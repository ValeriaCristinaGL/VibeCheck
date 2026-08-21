# Deploy do VibeCheck na Azure Container Apps

Este guia usa a mesma abordagem aplicada antes em outros projetos:

- PostgreSQL em `canadacentral`
- Container Apps no ambiente já existente `cae-qualeider-206522191`
- frontend em `vibecheck.valerialima.me`
- backend em `backend.vibecheck.valerialima.me`

## 0. Atenção importante

O `GOOGLE_CLIENT_SECRET` foi exposto na conversa. Depois do deploy, gere um novo secret no Google Cloud e troque na Azure.

No Google Cloud OAuth, cadastre:

- Authorized JavaScript origins:
  - `https://vibecheck.valerialima.me`
- Authorized redirect URIs:
  - `https://backend.vibecheck.valerialima.me/signin-google`

## 1. Publicar as imagens atualizadas

No seu computador, na pasta do projeto:

```powershell
cd "C:\Users\tomas\OneDrive\Área de Trabalho\Amor\VibeCheck"

$TAG="azure-20260821"

docker login

docker build -t valerialima/vibecheck-api:$TAG -f back/Dockerfile back
docker tag valerialima/vibecheck-api:$TAG valerialima/vibecheck-api:latest
docker push valerialima/vibecheck-api:$TAG
docker push valerialima/vibecheck-api:latest

docker build `
  --build-arg VITE_API_BASE_URL=https://backend.vibecheck.valerialima.me/api `
  --build-arg VITE_API_TIMEOUT=10000 `
  -t valerialima/vibecheck-frontend:$TAG `
  -f front/Dockerfile `
  front

docker tag valerialima/vibecheck-frontend:$TAG valerialima/vibecheck-frontend:latest
docker push valerialima/vibecheck-frontend:$TAG
docker push valerialima/vibecheck-frontend:latest
```

## 2. Criar o banco PostgreSQL

No Azure Cloud Shell:

```bash
SUFFIX=$(date +%y%m%d%H%M)

RG_APPS="rg-qualeider-206522191"
ENV_APPS="cae-qualeider-206522191"

RG_DB="rg-vibecheck-$SUFFIX"
LOC_DB="canadacentral"

PG="pg-vibecheck-$SUFFIX"
DB="vibecheck"
PGUSER="vibecheckadmin"
PGPASS="TroquePorUmaSenhaForte123!"

az provider register --namespace Microsoft.DBforPostgreSQL

az group create \
  --name "$RG_DB" \
  --location "$LOC_DB"

az postgres flexible-server create \
  --resource-group "$RG_DB" \
  --name "$PG" \
  --location "$LOC_DB" \
  --admin-user "$PGUSER" \
  --admin-password "$PGPASS" \
  --public-access 0.0.0.0 \
  --tier Burstable \
  --sku-name Standard_B1ms \
  --storage-size 32 \
  --version 16

az postgres flexible-server db create \
  --resource-group "$RG_DB" \
  --server-name "$PG" \
  --name "$DB"
```

Pegue o host do banco:

```bash
PGHOST=$(az postgres flexible-server show \
  --resource-group "$RG_DB" \
  --name "$PG" \
  --query fullyQualifiedDomainName \
  -o tsv)

echo "$PGHOST"
```

## 3. Criar os Container Apps

Ainda no Azure Cloud Shell:

```bash
BACKEND_APP="vibecheck-backend"
FRONTEND_APP="vibecheck-frontend"

BACKEND_IMAGE="valerialima/vibecheck-api:latest"
FRONTEND_IMAGE="valerialima/vibecheck-frontend:latest"

FRONTEND_URL="https://vibecheck.valerialima.me"
BACKEND_URL="https://backend.vibecheck.valerialima.me"

GOOGLE_CLIENT_ID="SEU_CLIENT_ID"
GOOGLE_CLIENT_SECRET="SEU_CLIENT_SECRET"
```

Crie o backend:

```bash
az containerapp create \
  --name "$BACKEND_APP" \
  --resource-group "$RG_APPS" \
  --environment "$ENV_APPS" \
  --image "$BACKEND_IMAGE" \
  --ingress external \
  --target-port 8080 \
  --env-vars \
    ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    FRONTEND_URL="$FRONTEND_URL" \
    CORS_ALLOWED_ORIGINS="$FRONTEND_URL" \
    DatabaseProvider=Postgres \
    ConnectionStrings__DefaultConnection="Host=$PGHOST;Port=5432;Database=$DB;Username=$PGUSER;Password=$PGPASS;Ssl Mode=Require;Trust Server Certificate=true" \
    Authentication__Google__ClientId="$GOOGLE_CLIENT_ID" \
    Authentication__Google__ClientSecret="$GOOGLE_CLIENT_SECRET"
```

Crie o frontend:

```bash
az containerapp create \
  --name "$FRONTEND_APP" \
  --resource-group "$RG_APPS" \
  --environment "$ENV_APPS" \
  --image "$FRONTEND_IMAGE" \
  --ingress external \
  --target-port 80
```

## 4. Testar pelas URLs da Azure

```bash
BACKEND_FQDN=$(az containerapp show \
  --resource-group "$RG_APPS" \
  --name "$BACKEND_APP" \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

FRONTEND_FQDN=$(az containerapp show \
  --resource-group "$RG_APPS" \
  --name "$FRONTEND_APP" \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

echo "Backend: https://$BACKEND_FQDN"
echo "Frontend: https://$FRONTEND_FQDN"
```

Teste o backend:

```bash
curl "https://$BACKEND_FQDN/api/auth"
```

## 5. Configurar domínio customizado

No seu provedor DNS, crie:

- `vibecheck.valerialima.me` apontando por CNAME para o `FRONTEND_FQDN`
- `backend.vibecheck.valerialima.me` apontando por CNAME para o `BACKEND_FQDN`

Depois, no Azure Cloud Shell:

```bash
az containerapp hostname add \
  --hostname "vibecheck.valerialima.me" \
  --resource-group "$RG_APPS" \
  --name "$FRONTEND_APP"

az containerapp hostname bind \
  --hostname "vibecheck.valerialima.me" \
  --resource-group "$RG_APPS" \
  --name "$FRONTEND_APP" \
  --environment "$ENV_APPS" \
  --validation-method CNAME

az containerapp hostname add \
  --hostname "backend.vibecheck.valerialima.me" \
  --resource-group "$RG_APPS" \
  --name "$BACKEND_APP"

az containerapp hostname bind \
  --hostname "backend.vibecheck.valerialima.me" \
  --resource-group "$RG_APPS" \
  --name "$BACKEND_APP" \
  --environment "$ENV_APPS" \
  --validation-method CNAME
```

## 6. Se o app já existir e você só quiser atualizar

```bash
az containerapp update \
  --name "vibecheck-backend" \
  --resource-group "rg-qualeider-206522191" \
  --image "valerialima/vibecheck-api:latest"

az containerapp update \
  --name "vibecheck-frontend" \
  --resource-group "rg-qualeider-206522191" \
  --image "valerialima/vibecheck-frontend:latest"
```

## 7. Observações finais

- O frontend precisa ser rebuildado com `VITE_API_BASE_URL=https://backend.vibecheck.valerialima.me/api`.
- O backend agora aplica migration ao iniciar, então ele cria as tabelas se o banco estiver vazio.
- O login Google depende do redirect URI do backend, não do frontend.
