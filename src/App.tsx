import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import CheckOut from "./pages/CheckOut.tsx";
import Emoji from "./pages/Emoji.tsx";
import CheckIn from "./pages/CheckIn.tsx";
import AlunoCheckIn from "./pages/Aluno-checkin.tsx";
import Comfirmacao from "./pages/Confirmacao.tsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/emoji" element={<Emoji />} />
        <Route path="/aluno_check_in" element={<AlunoCheckIn />} />
        <Route path="/comfirmacao" element={<Comfirmacao />} />
  
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