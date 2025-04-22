import { Routes, Route } from 'react-router-dom';
import ListaClientes from './pages/ListaClientes';
import ClienteDetalhes from './pages/ClienteDetalhes';

function App() {
  return (
    <Routes>
      {/* Página principal - listagem de clientes */}
      <Route path="/" element={<ListaClientes />} />

      {/* Página de detalhes do cliente */}
      <Route path="/clientes/:id" element={<ClienteDetalhes />} />
    </Routes>
  );
}

export default App;
