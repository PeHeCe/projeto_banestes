import { useEffect, useState } from 'react'
import { Cliente } from '../types/cliente'
import { fetchCSV } from '../api/cliente'
import { Link } from 'react-router-dom'
import '../styles/ListaClientes.css'
import Papa from 'papaparse'

const CLIENTES_URL =
  'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes'

const parseCSV = (csv: string): Cliente[] => {
  const linhas = csv.trim().split('\n')
  const cabecalhosLimpos = linhas[0]
    .split(',')
    .filter((h) => h.trim() !== '')

  const csvCorrigido = [cabecalhosLimpos.join(','), ...linhas.slice(1)].join('\n')

  const parsed = Papa.parse(csvCorrigido, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log('Cabeçalhos reconhecidos:', results.meta.fields)
    },
  })

  return parsed.data.map((obj: any, index: number) => {
    console.log(`Linha ${index}: ID = ${obj.id}`)

    return {
      id: obj.id,
      cpfCnpj: obj.cpfCnpj,
      rg: obj.rg || undefined,
      dataNascimento: obj.dataNascimento ? new Date(obj.dataNascimento) : undefined,
      nome: obj.nome,
      nomeSocial: obj.nomeSocial || undefined,
      email: obj.email,
      endereco: obj.endereco,
      rendaAnual: parseFloat(obj.rendaAnual?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0'),
      patrimonio: parseFloat(obj.patrimonio?.replace(/[^\d,.-]/g, '').replace(',', '.') || '0'),
      estadoCivil: obj.estadoCivil as Cliente['estadoCivil'],
      codigoAgencia: Number(obj.codigoAgencia) || 0,
    }
  })
}

const ListaClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const porPagina = 10

  useEffect(() => {
    fetchCSV(CLIENTES_URL).then((csv) => {
      const data = parseCSV(csv)
      setClientes(data)
    })
  }, [])

  const clientesFiltrados = clientes.filter((cliente) =>
    [cliente.nome, cliente.cpfCnpj].some((campo) =>
      (campo ? campo.toLowerCase() : '').includes(busca.toLowerCase())
    )
  )

  const totalPaginas = Math.ceil(clientesFiltrados.length / porPagina)
  const inicio = (paginaAtual - 1) * porPagina
  const fim = inicio + porPagina

  return (
    <div className="lista-clientes-container">
      <h1>Lista de Clientes</h1>

      <input
        type="text"
        placeholder="Buscar por nome ou CPF/CNPJ"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value)
          setPaginaAtual(1)
        }}
        className="input-busca"
      />

      <ul className="clientes-lista">
        {clientesFiltrados.slice(inicio, fim).map((cliente) => (
          <li key={cliente.id} className="cliente-item">
            <Link to={`/clientes/${cliente.id}`}>
              <strong>{cliente.nome}</strong>
            </Link>
            <span><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</span>
            <span><strong>Email:</strong> {cliente.email}</span>
          </li>
        ))}
      </ul>

      <div className="paginacao">
        <span>
          Página: {paginaAtual} de {totalPaginas}
        </span>
        <div className="botoes-paginacao">
          <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(paginaAtual - 1)}>
            Anterior
          </button>
          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual(paginaAtual + 1)}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListaClientes
