# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copia apenas arquivos de dependência para cache otimizado
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copia dependências instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args para variáveis de ambiente do Vite
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_API_TIMEOUT=10000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT

# Build de produção
RUN npm run build

# ============================================
# Stage 3: Runtime (Nginx)
# ============================================
FROM nginx:stable-alpine AS runtime

# Labels OCI
LABEL org.opencontainers.image.title="VibeCheck Frontend"
LABEL org.opencontainers.image.description="Frontend do VibeCheck — React + Vite + TailwindCSS"
LABEL org.opencontainers.image.source="https://github.com/ifpebj-ti/vibecheck"
LABEL org.opencontainers.image.licenses="Apache-2.0"

# Remove config padrão do Nginx e copia o customizado
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia assets buildados
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
