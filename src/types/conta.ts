export interface Conta {
    id: string;
    cpfCnpjCliente: string;
    tipo: 'corrente' | 'poupanca';
    saldo: number;
    limiteCredito: number;
    creditoDisponivel: number;
  }