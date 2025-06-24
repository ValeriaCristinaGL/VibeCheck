import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.tsx";
import AlunoCheckInPage from "./pages/Aluno-checkin";
import ConfirmacaoPage from "./pages/Confirmacao.tsx";
import CheckInPage from "./pages/CheckIn.tsx";
import DashboardPage from "./pages/Dashboard.tsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/aluno-checkin" element={<AlunoCheckInPage />} />
        <Route path="/confirmacao" element={<ConfirmacaoPage />} />
        <Route path="/checkIn" element={<CheckInPage/>} />
        <Route path="/Dashboard" element={<DashboardPage/>} />

        {/* Adicione outras rotas aqui */}
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
