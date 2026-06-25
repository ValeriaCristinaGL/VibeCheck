# ============================================
# Stage 1: Build
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copia o csproj e o global.json para restore otimizado (cache de camadas)
COPY global.json ./
COPY VibeCheckAPI-Dotnet8.csproj ./
RUN dotnet restore VibeCheckAPI-Dotnet8.csproj

# Copia o restante do código e publica
COPY . .
RUN dotnet publish VibeCheckAPI-Dotnet8.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ============================================
# Stage 2: Runtime
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Labels OCI
LABEL org.opencontainers.image.title="VibeCheck Backend API"
LABEL org.opencontainers.image.description="API backend do VibeCheck — ASP.NET Core 8.0"
LABEL org.opencontainers.image.source="https://github.com/ifpebj-ti/vibecheck"
LABEL org.opencontainers.image.licenses="Apache-2.0"

WORKDIR /app

# Copia artefatos publicados
COPY --from=build /app/publish .

# Porta padrão da API
EXPOSE 8080

# Variáveis de ambiente padrão
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "VibeCheckAPI-Dotnet8.dll"]
