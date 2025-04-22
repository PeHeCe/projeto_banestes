import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Cliente } from '../types/cliente'
import { Conta } from '../types/conta'
import { Agencia } from '../types/agencia'
import { fetchCSV } from '../api/cliente'

const URLS = {
  clientes: 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes',
  contas: 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas',
  agencias: 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias'
}
const parseClientes = (csv: string): Cliente[] => {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const obj: any = {}
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim()
    })


    console.log('Cliente ID:', obj.id)


    
    return {
      id: obj.id,
      cpfCnpj: obj.cpfCnpj,
      rg: obj.rg || undefined,
      dataNascimento: new Date(obj.dataNascimento),
      nome: obj.nome,
      nomeSocial: obj.nomeSocial || undefined,
      email: obj.email,
      endereco: obj.endereco,
      rendaAnual: Number(obj.rendaAnual),
      patrimonio: Number(obj.patrimonio),
      estadoCivil: obj.estadoCivil as Cliente['estadoCivil'],
      codigoAgencia: Number(obj.codigoAgencia),
    }
  })
}

const parseContas = (csv: string): Conta[] => {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',')

  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const obj: any = {}
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim()
    })

    return {
      id: obj.id,
      cpfCnpjCliente: obj.cpfCnpjCliente,
      tipo: obj.tipo as Conta['tipo'],
      saldo: Number(obj.saldo),
      limiteCredito: Number(obj.limiteCredito),
      creditoDisponivel: Number(obj.creditoDisponivel),
    }
  })
}

const parseAgencias = (csv: string): Agencia[] => {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',')

  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const obj: any = {}
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim()
    })

    return {
      id: obj.id,
      codigo: Number(obj.codigo),
      nome: obj.nome,
      endereco: obj.endereco,
    }
  })
}

const ClienteDetalhes = () => {
  const { id } = useParams()


  console.log('ID da URL:', id) 








  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [contas, setContas] = useState<Conta[]>([])
  const [agencia, setAgencia] = useState<Agencia | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      const [csvClientes, csvContas, csvAgencias] = await Promise.all([
        fetchCSV(URLS.clientes),
        fetchCSV(URLS.contas),
        fetchCSV(URLS.agencias),
      ])

      const listaClientes = parseClientes(csvClientes)
      const clienteSelecionado = listaClientes.find((c) => c.id.trim() === id?.trim())
      if (!clienteSelecionado) return

      setCliente(clienteSelecionado)

      const listaContas = parseContas(csvContas).filter(
        (c) => c.cpfCnpjCliente === clienteSelecionado.cpfCnpj
      )
      setContas(listaContas)

      const listaAgencias = parseAgencias(csvAgencias)
      const agenciaDoCliente = listaAgencias.find(
        (a) => a.codigo === clienteSelecionado.codigoAgencia
      )
      setAgencia(agenciaDoCliente || null)
    }

    carregarDados()
  }, [id])

  if (!cliente) {
    return <p>Cliente não encontrado...</p>
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Detalhes do Cliente</h2>
      <p><strong>Nome:</strong> {cliente.nome}</p>
      <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
      <p><strong>RG:</strong> {cliente.rg || 'N/A'}</p>
      <p><strong>Data de Nascimento:</strong> {cliente.dataNascimento ? cliente.dataNascimento.toLocaleDateString() : 'N/A'}</p>
      <p><strong>Email:</strong> {cliente.email}</p>
      <p><strong>Endereço:</strong> {cliente.endereco}</p>
      <p><strong>Estado Civil:</strong> {cliente.estadoCivil}</p>
      <p><strong>Renda Anual:</strong> R$ {cliente.rendaAnual.toLocaleString()}</p>
      <p><strong>Patrimônio:</strong> R$ {cliente.patrimonio.toLocaleString()}</p>

      <h3>Contas Bancárias</h3>
      {contas.length > 0 ? (
        <ul>
          {contas.map((conta) => (
            <li key={conta.id}>
              <strong>Tipo:</strong> {conta.tipo} — <strong>Saldo:</strong> R$ {conta.saldo.toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma conta encontrada.</p>
      )}

      <h3>Agência</h3>
      {agencia ? (
        <div>
          <p><strong>Nome:</strong> {agencia.nome}</p>
          <p><strong>Endereço:</strong> {agencia.endereco}</p>
        </div>
      ) : (
        <p>Agência não encontrada.</p>
      )}

      <Link to="/">← Voltar à lista</Link>
    </div>
  )
}

export default ClienteDetalhes
