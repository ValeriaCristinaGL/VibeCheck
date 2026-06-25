# VibeCheck 🎯

O **VibeCheck** é uma aplicação voltada para o acompanhamento e registro de estados emocionais de alunos e turmas. Desenvolvido com uma arquitetura moderna e escalável, o projeto permite que professores analisem o engajamento emocional de suas turmas através de dashboards e relatórios detalhados.

---

## 🛠️ Tecnologias Utilizadas

### Backend
* **Linguagem/Framework:** .NET 8 (C#) / ASP.NET Core Web API
* **Banco de Dados:** PostgreSQL (padrão) com suporte a SQL Server
* **ORM:** Entity Framework Core
* **Autenticação:** Google OAuth2

### Frontend
* **Linguagem/Framework:** React + TypeScript
* **Ferramenta de Build:** Vite
* **Estilização:** TailwindCSS v4
* **Servidor de Produção:** Nginx (dentro do container Docker)

---

## 📁 Estrutura do Projeto

```
VibeCheck/
├── .github/
│   └── workflows/
│       ├── backend-ci-cd.yml   # Workflow do backend
│       └── frontend-ci-cd.yml  # Workflow do frontend
├── back/                       # Código-fonte do Backend (.NET 8)
│   ├── Controllers/
│   ├── Services/
│   ├── Data/
│   ├── Dockerfile
│   └── ...
├── front/                      # Código-fonte do Frontend (React + Vite)
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ...
├── docker-compose.dev.yml      # Configuração para Desenvolvimento
├── docker-compose.prod.yml     # Configuração para Produção (Imagens GHCR)
├── .env-example                # Exemplo de variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
└── LICENSE                     # Licença Apache 2.0
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Docker** e **Docker Compose** instalados na sua máquina.

### Passo 1: Configurar Variáveis de Ambiente
Copie o arquivo `.env-example` da raiz para `.env` e preencha as variáveis de ambiente necessárias:
```bash
cp .env-example .env
```

### Passo 2: Executar em Ambiente de Desenvolvimento (Dev)
O ambiente de desenvolvimento realiza o build local do frontend e do backend, e sobe uma instância do PostgreSQL:
```bash
docker compose -f docker-compose.dev.yml up --build
```
* **Frontend:** Acessível em [http://localhost:3000](http://localhost:3000)
* **Backend:** Acessível em [http://localhost:8080](http://localhost:8080)
* **Swagger (Documentação da API):** Acessível em [http://localhost:8080/swagger](http://localhost:8080/swagger)

---

## 🌐 Deploy em Produção (GHCR)

Para subir o ambiente de produção consumindo as imagens prontas e otimizadas do GitHub Container Registry (GHCR):

```bash
# Defina o owner do repositório e a senha do banco antes de rodar
export GITHUB_REPOSITORY_OWNER=ValeriaCristinaGL
export POSTGRES_PASSWORD=sua_senha_segura
export TAG=latest

docker compose -f docker-compose.prod.yml up -d
```

---

## 🔄 Pipeline de CI/CD (GitHub Actions)

Os workflows do GitHub Actions estão configurados na pasta `.github/workflows/`. Eles são disparados automaticamente ao realizar o merge de um Pull Request para a branch `main`, ou manualmente via `workflow_dispatch`.

### Etapas do Pipeline:
1. **Versionamento Semântico Automatizado (Tags):** Calcula automaticamente a nova versão (`major.minor.patch`) com base nos campos marcados no corpo do Pull Request:
   - `[x] novo-marco` (Major)
   - `[x] nova-feature` (Minor)
   - `[x] bug-fix` / `[x] outros` (Patch)
2. **Setup e Builds Multi-Arquitetura (Multi-Arch):**
   - Configura emulação **QEMU** e **Docker Buildx** para compilar imagens simultaneamente para as arquiteturas **AMD64** (servidores comuns) e **ARM64** (servidores ARM, VMs gratuitas na Oracle Cloud, etc).
3. **Escaneamento de Segurança (Trivy Scan):** Analisa a imagem gerada em busca de vulnerabilidades críticas.
4. **Publicação no GHCR:** Envia a imagem com a tag da versão e a tag `latest` para o GitHub Container Registry do repositório.
5. **Criação de Release:** Cria uma release oficial no repositório GitHub contendo as notas da versão e o changelog gerado.

---

## 📜 Licença

Este projeto é distribuído sob a licença **Apache License 2.0**. Consulte o arquivo [LICENSE](file:///c:/Users/20232ewbj0203/Desktop/VibeCheck/LICENSE) para mais detalhes.
