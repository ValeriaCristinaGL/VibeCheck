import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Importação das páginas
import Login from "./pages/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import CheckOut from "./pages/CheckOut.tsx";
import Emoji from "./pages/Emoji.tsx";
import CheckIn from "./pages/CheckIn.tsx";
import AlunoCheckIn from "./pages/Aluno-checkin.tsx";
import Comfirmacao from "./pages/Confirmacao.tsx";
import Relatorio from "./pages/Relatorio.tsx";
import DashboardPage from "./pages/Dashboard.tsx";

import { ProtectedRoute } from "./pages/ProtectedRoute";

function App() {
  return (
    // Componente Router para navegação entre rotas
    <Router>
      {/* Define as rotas da aplicação */}
      <Routes>
        {/* Rota pública para a página de login */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas que exigem autenticação */}
        <Route
          path="/cadastro"
          element={
            <ProtectedRoute requiredRole="ROLE_ALUNO">
              <Cadastro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute requiredRole="ROLE_PROFESSOR">
              <CheckOut />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkin"
          element={
            <ProtectedRoute requiredRole="ROLE_PROFESSOR">
              <CheckIn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emoji"
          element={
            <ProtectedRoute requiredRole="ROLE_ALUNO">
              <Emoji />
            </ProtectedRoute>
          }
        />

        <Route
          path="/check"
          element={
            <ProtectedRoute requiredRole="ROLE_ALUNO">
              <AlunoCheckIn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/comfirmacao"
          element={
            <ProtectedRoute requiredRole="ROLE_ALUNO">
              <Comfirmacao />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorio"
          element={
            <ProtectedRoute requiredRole="ROLE_PROFESSOR">
              <Relatorio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute requiredRole="ROLE_PROFESSOR">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Rota para tratar páginas não encontradas */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-2xl font-bold">Página não encontrada</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
