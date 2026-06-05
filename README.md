# TrabalhoWeb

Trabalho em grupo 2026/1 — POC interna de um **catálogo de produtos**.

Esta etapa é apenas o **scaffold**: provar que o ambiente inteiro sobe via Docker,
com frontend e backend conversando e os dados persistindo em volumes. A lógica de
negócio ainda é placeholder (marcada com `// TODO:`). Sem autenticação.

## Stack

- **Frontend:** Vue 3 + Vite (modo dev)
- **Backend / API:** Node.js + **Express** + Prisma (pasta `api/`)
- **Banco:** SQLite (arquivo, acessado pelo backend via Prisma)
- **Orquestração:** Docker + Docker Compose
- **Arquitetura:** monorepo (front e back no mesmo repositório)

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose (já incluso no Docker Desktop / `docker compose`)

## Como subir

Na primeira vez (constrói as imagens):

```bash
docker compose up --build -d
```

Nas próximas:

```bash
docker compose up -d
```

### URLs de acesso

- **Frontend:** http://localhost:5173 — abre no navegador e exibe a resposta do
  `GET /` da API, provando que front e back estão conversando.
- **Backend / API:** http://localhost:3000
  - `GET /` → `{ "message": "API is running!" }`
  - `POST /notebooks` → cria um registro (`{ "brand": "...", "model": "..." }`)


## Como parar

```bash
docker compose down
```

## Onde os dados persistem (volumes)

Os dados ficam em **volumes nomeados** e sobrevivem a `docker compose down` + `up`:

- `db-data` → arquivo SQLite do backend (`/data/db/dev.db` no container)
- `uploads-data` → pasta de uploads de imagens (`/data/uploads`) — **placeholder**,
  já provisionado para uso futuro (fotos dos produtos)

### Resetar o estado (apaga os dados)

```bash
docker compose down -v
```

## Configuração (opcional)

Portas e URL da API têm defaults no `docker-compose.yml`. Para customizar, copie
`.env.example` para `.env` e ajuste:

| Variável        | Default | Descrição                                      |
|-----------------|---------|------------------------------------------------|
| `BACKEND_PORT`  | `3000`  | Porta da API no host                           |
| `FRONTEND_PORT` | `5173`  | Porta do frontend no host                      |
| `VITE_API_URL`  | `/api`  | Caminho base da API usado pelo browser (proxy) |

## Estrutura de pastas

```
/
├── api/                 # API Node + Express + Prisma + SQLite
│   ├── prisma/          # schema.prisma
│   ├── src/             # app.js, server.js, routes, controllers, services, database
│   └── Dockerfile             
├── frontend/            # app Vue 3 + Vite (hello world)
│   ├── src/             # main.js, App.vue
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```