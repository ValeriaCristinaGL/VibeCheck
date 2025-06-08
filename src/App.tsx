import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Emoji.tsx";
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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