# VibeCheck API

API em .NET 8 para sistema de check-in/check-out educacional com autenticação Google e registro de emoções.

## 📋 Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/download/) (versão 12+)
- Conta Google Cloud Platform para OAuth

## ⚙️ Configuração Inicial

### 1. Clone o projeto

```bash
git clone <url-do-repositorio>
cd VibeCheckAPI-Dotnet8
```

### 2. Configure o banco PostgreSQL

- Instale PostgreSQL
- Crie um banco chamado `vibecheck`
- Usuário: `postgres`, Senha: `root` (ou ajuste no appsettings)

- Ou suba uma imagem via docker [Recomendado]
  
docker run --name vibecheck-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=vibecheck -p 5432:5432 -d postgres:17

### 3. Configure Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto (ou use existente)
3. Ative a API "Google+ API"
4. Vá em "Credenciais" → "Criar credenciais" → "ID do cliente OAuth 2.0"
5. Tipo: Aplicação da Web
6. Origens JavaScript autorizadas:
    - `http://localhost:3000`
7. URIs de redirecionamento autorizados: 
    - `https://localhost:7000/signin-google`
    - `http://localhost:8080/api/auth/success`
8. Copie o **Client ID** e **Client Secret**

### 4. Configure appsettings.Development.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=vibecheck;Username=postgres;Password=root"
  },
  "Authentication": {
    "Google": {
      "ClientId": "SEU_CLIENT_ID_AQUI",
      "ClientSecret": "SEU_CLIENT_SECRET_AQUI"
    }
  },
  "Authorization": {
    "Professores": {
      "Emails": ["professor@exemplo.com"],
      "Domains": ["escola.edu.br"],
      "Contains": ["professor"]
    }
  }
}
```

## 🚀 Como executar

### 1. Restaurar dependências

```bash
dotnet restore
```

### 2. Criar o banco de dados

```bash
dotnet ef database update
```

### 3. Executar a aplicação

```bash
dotnet run
```

A API estará disponível em: `https://localhost:8080`

## 🏗️ Estrutura do Projeto

```
VibeCheckAPI-Dotnet8/
├── Controllers/          # Endpoints da API
├── Data/Context/         # Configuração banco de dados
├── DTOs/                 # Objetos para transferência de dados
├── Models/               # Modelos do banco de dados
├── Repositories/         # Acesso aos dados
├── Services/             # Lógica de negócio
└── appsettings.json      # Configurações
```

## 📚 Principais Funcionalidades

### Autenticação

- **Login Google**: `GET /api/auth/login`
- **Detalhes usuário**: `GET /api/auth/user/details`
- **Logout**: `POST /api/auth/logout`

### Professor (requer role ROLE_PROFESSOR)

- **Gerar código check-in**: `POST /liberar-checkin`
- **Gerar código check-out**: `POST /liberar-checkout`
- **Listar turmas**: `GET /turmas`
- **Dashboard**: `GET /dashboard`
- **Editar turma**: `PUT /turmas/{id}`
- **Excluir turma**: `DELETE /turmas/{id}`

### Aluno (requer role ROLE_ALUNO)

- **Fazer check-in**: `POST /checkin`
- **Registrar emoção**: `POST /registrar`

## 👥 Sistema de Roles

O sistema identifica automaticamente se um usuário é Professor ou Aluno baseado em:

1. **Email exato** listado em `Authorization:Professores:Emails`
2. **Domínio do email** listado em `Authorization:Professores:Domains`
3. **Texto contido no email** listado em `Authorization:Professores:Contains`

Se nenhuma condição for atendida, o usuário é criado como **Aluno**.

## 🔄 Fluxo Típico de Uso

### Para Professores:

1. Faz login via Google
2. Sistema identifica como professor (baseado no email)
3. Redireciona para `/dashboard`
4. Cria turma e gera códigos de check-in/check-out
5. Alunos usam os códigos para fazer presença

### Para Alunos:

1. Faz login via Google
2. Sistema identifica como aluno
3. Redireciona para `/check`
4. Usa código fornecido pelo professor para check-in
5. Registra sua emoção no momento

## 🗃️ Banco de Dados

### Principais tabelas:

- **Usuarios** (Professor/Aluno - herança TPH)
- **Turmas** (uma turma por professor)
- **Avaliacoes** (códigos de check-in/out)
- **RegistrosEmocionais** (emoções registradas)
- **Emocoes** (catálogo de emoções)

## 🛠️ Comandos Úteis

```bash
# Verificar status do banco
dotnet ef database update

# Criar nova migração (após alterar models)
dotnet ef migrations add NomeDaMigracao

# Aplicar migração
dotnet ef database update

# Limpar e recompilar
dotnet clean
dotnet build

# Ver logs detalhados
dotnet run --verbosity detailed
```

## 🐛 Resolução de Problemas

### Erro de conexão com banco

- Verifique se PostgreSQL está rodando
- Confirme usuário/senha no appsettings
- Teste conexão: `psql -h localhost -U postgres -d vibecheck`

### Erro OAuth Google

- Verifique Client ID e Client Secret
- Confirme URI de redirect no Google Console
- Certifique-se que a API está rodando em HTTPS

### Usuário sempre criado como Aluno

- Verifique configuração em `Authorization:Professores`
- Confirme que o email atende a pelo menos um critério

### Erro de migração

```bash
# Remove migração problemática
dotnet ef migrations remove

# Recria banco do zero
dotnet ef database drop
dotnet ef database update
```

## 🔧 Desenvolvimento

### Adicionando novos endpoints:

1. Crie método no Controller apropriado
2. Adicione atributo de autorização (`[Authorize(Policy = "...")]`)
3. Implemente lógica no Service correspondente

### Modificando banco:

1. Altere o model em `/Models`
2. Execute: `dotnet ef migrations add DescricaoDaMudanca`
3. Execute: `dotnet ef database update`

## 📞 Ajuda

Se encontrar problemas:

1. Verifique logs no terminal onde roda `dotnet run`
2. Teste endpoints via Swagger: `https://localhost:7000/swagger`
3. Verifique se todas dependências estão instaladas
4. Confirme configurações no appsettings.Development.json

---

**Dica**: Use o Swagger (interface web) para testar os endpoints facilmente!
    - http://localhost:8080/swagger/index.html
