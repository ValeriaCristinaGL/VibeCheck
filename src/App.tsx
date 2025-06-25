import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

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
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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