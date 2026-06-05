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


## Desenvolvimento (hot reload)

Os dois serviços recarregam automaticamente ao salvar — **não precisa rebuildar**
para o dia a dia:

- **Frontend** (`frontend/`): HMR do Vite. Edite e salve; o navegador atualiza sozinho.
- **Backend** (`api/`): o container monta o código via bind-mount e roda
  `node --watch`. Ao salvar qualquer `.js` em `api/src/`, o servidor reinicia sozinho
  (ex.: `Restarting 'src/server.js'`).

Basta deixar rodando:

```bash
docker compose up
```

> **Mudou `api/prisma/schema.prisma`?** Aí sim é preciso regenerar o Prisma Client e
> aplicar o schema (o `node --watch` não faz isso). Rode:
> ```bash
> docker compose exec backend npx prisma generate
> docker compose restart backend   # re-aplica o schema (db push) e sobe o server
> ```

> **Editou `docker-compose.yml` ou `*/Dockerfile`?** Esses não são hot-reload —
> recrie com `docker compose up -d` (ou `--build` se mexeu no Dockerfile).


## Como parar

```bash
docker compose down
```

## Onde os dados persistem (host)

Os dados são montados em **bind-mount** na pasta `./data` do projeto, então ficam
visíveis no host e sobrevivem a qualquer `docker compose down` + `up`:

- `./data/db/dev.db` → arquivo SQLite do backend (montado em `/data/db` no container)
- `./data/uploads/` → uploads de imagens (montado em `/data/uploads`) — **placeholder**,
  já provisionado para uso futuro (fotos dos produtos)

> Os arquivos gerados em runtime (`dev.db`, fotos) são criados pelo container (root) e
> ficam **fora do git** (`.gitignore`); só os `.gitkeep` das pastas são versionados.

### Resetar o estado (apaga os dados)

Como agora é bind-mount no host, `down -v` **não** apaga o banco. Apague os arquivos:

```bash
docker compose down
rm -f data/db/dev.db data/db/dev.db-*   # pode exigir sudo (arquivo é root)
rm -rf data/uploads/*                   # mantém a pasta e o .gitkeep
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
├── data/                # dados persistidos no host (bind-mount; conteúdo fora do git)
│   ├── db/              # dev.db (SQLite)
│   └── uploads/         # fotos enviadas (placeholder)
├── frontend/            # app Vue 3 + Vite (hello world)
│   ├── src/             # main.js, App.vue
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```