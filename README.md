# VibeCheck 🎯

[![Backend CI/CD Workflow](https://github.com/ValeriaCristinaGL/VibeCheck/actions/workflows/backend-ci-cd.yml/badge.svg)](https://github.com/ValeriaCristinaGL/VibeCheck/actions/workflows/backend-ci-cd.yml)
[![Frontend CI/CD Workflow](https://github.com/ValeriaCristinaGL/VibeCheck/actions/workflows/frontend-ci-cd.yml/badge.svg)](https://github.com/ValeriaCristinaGL/VibeCheck/actions/workflows/frontend-ci-cd.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![C#](https://img.shields.io/badge/language-C%23-blue.svg)](#)
[![React](https://img.shields.io/badge/language-React-cyan.svg)](#)
[![Docker](https://img.shields.io/badge/docker-compatible-blue.svg)](#)

Sistema web para monitoramento emocional de alunos durante práticas de bem-estar. O objetivo é registrar, armazenar e apresentar dados emocionais de forma anônima, simples e visual, utilizando emojis como meio principal de interação.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React, Vite, TypeScript, TailwindCSS v4
* **Back-end:** .NET 8 (ASP.NET Core Web API)
* **Banco de Dados:** PostgreSQL (padrão) com suporte a SQL Server via Database Adapter

<div align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=.net&logoColor=white" alt=".NET 8" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
</div>

---

## 📖 Documentação

Acesse os documentos detalhados sobre a arquitetura, decisões técnicas e guias do projeto:

* 📐 [**Documentação de Arquitetura (Modelo Arc42)**](docs/arquitetura-arc42.md) — Visão detalhada de escopo, blocos de construção, infraestrutura e cenários de qualidade.
---

## 🚀 Como Executar o Projeto Localmente

### Passo 1: Configurar as Variáveis de Ambiente
Copie o arquivo `.env-example` da raiz para `.env` e preencha as variáveis de ambiente necessárias:
```bash
cp .env-example .env
```

### Passo 2: Executar em Ambiente de Desenvolvimento (Dev)
O ambiente de desenvolvimento realiza o build local do frontend e do backend, e sobe uma instância do PostgreSQL:
```bash
docker compose -f docker-compose.dev.yml up --build
```
* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend:** [http://localhost:8080](http://localhost:8080)
* **Swagger (Documentação da API):** [http://localhost:8080/swagger](http://localhost:8080/swagger)

---

## 🛡️ Segurança e Qualidade de Código

* **Prevenção contra SQL Injection:** Consultas parametrizadas via Entity Framework Core em 100% dos acessos a dados.
* **Escaneamento de Vulnerabilidades:** Imagens Docker inspecionadas automaticamente pelo Trivy Scan durante a execução dos pipelines de CI/CD.
* **Segurança na API:** Filtro CORS restritivo e autenticação delegada de forma segura via Google OAuth 2.0.

---

## 📜 Licenciamento

Este projeto é licenciado sob a **Apache License 2.0**. Consulte o arquivo [LICENSE](LICENSE) para obter o texto completo da licença.
