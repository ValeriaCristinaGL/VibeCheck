# VibeCheck

Aplicação web para gerenciamento de check-in/check-out, relatórios e controle de usuários com autenticação e autorização por roles.

---

## Tecnologias Utilizadas

- React 18 com TypeScript  
- React Router Dom para roteamento e rotas protegidas  
- Tailwind CSS para estilização  
- Radix UI para componentes acessíveis  
- Axios para requisições HTTP (via cliente `http` personalizado)  
- Lucide Icons, clsx, tailwind-merge, entre outros

---

## Requisitos

- Node.js (versão 16+ recomendada)  
- npm ou yarn  
- Backend rodando e acessível (endpoint `/user/details` para autenticação)  

---

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/ValeriaCristinaGL/VibeCheck.git
   cd vibecheck
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure o backend para estar rodando e acessível, com suporte a CORS para o frontend.

4. Ajuste, se necessário, o arquivo `src/api/http.ts` para apontar para a URL correta do backend.

---

## Execução

### Rodar em modo desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O servidor estará disponível geralmente em `http://localhost:3000` com hot reload.

---

## Estrutura do Projeto

- `/src/components` — Componentes React reutilizáveis (formulários, botões, layouts)  
- `/src/hooks` — Hooks personalizados, como autenticação  
- `/src/pages` — Páginas da aplicação mapeadas pelas rotas  
- `/src/api` — Configuração e instância do cliente HTTP (Axios)  
- `/src/styles` — Arquivos CSS e configurações do Tailwind  
- `/src/App.tsx` — Componente principal com as rotas e proteções  
- `/src/main.tsx` — Ponto de entrada da aplicação  

---

## Funcionalidades Principais

- Tela de Login  
- Registro de usuários (cadastro)  
- Check-in e Check-out para professores e alunos  
- Dashboard protegido para professores  
- Formulário de Emoções para alunos  
- Relatórios para professores  
- Rotas protegidas por nível de permissão (`ROLE_ALUNO`, `ROLE_PROFESSOR`)

---

## Autenticação e Proteção de Rotas

- Hook `useAuth` para carregar usuário logado e seu papel (role)  
- Componente `ProtectedRoute` para restringir acesso por role  
- Redirecionamento para login caso usuário não autenticado ou sem permissão

---

## Estilização

- Tailwind CSS com variáveis CSS customizadas para tema claro e escuro  
- Animações usando `tw-animate-css`  
- Componentes estilizados usando Radix UI e ícones da Lucide Icons  

---
