import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Importação das páginas
import Home from "./pages/Home.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import CheckOut from "./pages/CheckOut.tsx";
import Emoji from "./pages/Emoji.tsx";
import CheckIn from "./pages/CheckIn.tsx";
import AlunoCheck from "./pages/AlunoCheck.tsx";
import Confirmacao from "./pages/Confirmacao.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import RecuperarSenha from "./pages/RecuperarSenha.tsx";

import { ProtectedRoute } from "./pages/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      {/* Componente Router para navegação entre rotas*/}
      <Router>
        {/* Define as rotas da aplicação */}
        <Routes>
          {/* Rota pública para a página de home */}
          <Route path="/" element={<Home />} />
          {/* Rota pública para a página de cadastro */}
          <Route path="/cadastro" element={<Cadastro />} />
          {/* Rota pública para a página de cadastro */}
          <Route path="/recuperarSenha" element={<RecuperarSenha />} />

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
                <AlunoCheck />
              </ProtectedRoute>
            }
          />

          <Route
            path="/comfirmacao"
            element={
              <ProtectedRoute requiredRole="ROLE_ALUNO">
                <Confirmacao />
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
    </>
  );
}

export default App;
