import { StrictMode } from 'react'  // Importa o StrictMode para ativar verificações adicionais durante o desenvolvimento
import { createRoot } from 'react-dom/client'  // Importa o método para criar raiz no React 18+
import './index.css'  // Importa o arquivo CSS global
import App from './App.tsx'  // Importa o componente principal da aplicação

// Cria a raiz React na div com id 'root' (certificando que não é null com '!')
// e renderiza o componente App dentro do StrictMode para melhores práticas de desenvolvimento
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
