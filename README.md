# Catálogo de Notebooks

POC de um catálogo web para listar, gerenciar e documentar notebooks com fotos e QR codes.

## Stack

- **Frontend:** Vue 3 + Vite (com HMR)
- **Backend / API:** Node.js + Express + Prisma
- **Banco:** SQLite (persistido em volume Docker)
- **Orquestração:** Docker Compose

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose

## Como subir

**Primeira vez (constrói as imagens):**

```bash
docker compose up --build -d
```

**Próximas vezes:**

```bash
docker compose up -d
```

Acesse:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000

O banco é populado automaticamente com dados de exemplo (3 categorias, 3 notebooks).

## Funcionalidades

- ✅ **Listagem de notebooks** — tabela com marca, modelo, CPU, RAM e categoria
- ✅ **Criar/editar/deletar notebooks** — formulário com especificações detalhadas
- ✅ **Gerenciar categorias** — criar, editar e deletar categorias
- ✅ **Upload de fotos** — cada notebook pode ter múltiplas fotos
- ✅ **QR Code** — cada notebook gera um QR code que aponta para sua página (útil para compartilhar)
- ✅ **UI limpa** — nav bar, cards, tabelas estilizadas, inputs responsivos

## Desenvolvimento (hot reload)

Ao salvar, ambos recarregam automaticamente — **sem rebuild**:

```bash
docker compose up
```

- **Frontend:** HMR do Vite (reload automático no browser)
- **Backend:** `node --watch` (restart ao salvar `.js` em `api/src/`)

> **Alterou `api/prisma/schema.prisma`?**
> ```bash
> docker compose exec backend npx prisma generate
> docker compose restart backend
> ```

> **Alterou `docker-compose.yml` ou `*/Dockerfile`?**
> ```bash
> docker compose down
> docker compose up --build -d
> ```

## Como parar

```bash
docker compose down
```

## Dados persistem em volumes

- **Banco:** `db-data` (SQLite)
- **Uploads:** `uploads-data` (fotos dos notebooks)

Para resetar (apaga dados):

```bash
docker compose down -v
```

## Configuração (opcional)

Copie `.env.example` para `.env` e customize:

| Variável        | Default              | Descrição                       |
|-----------------|----------------------|---------------------------------|
| `BACKEND_PORT`  | `3000`               | Porta da API                    |
| `FRONTEND_PORT` | `5173`               | Porta do frontend               |
| `VITE_API_URL`  | `/api`               | URL da API no browser (proxy)   |
| `FRONTEND_URL`  | `http://localhost:5173` | URL do frontend (para QR code)  |

Para testar QR code no celular:
```bash
# .env
FRONTEND_URL=http://<seu-ip-local>:5173

docker compose down
docker compose up --build -d
```

O QR code gerado na página de detalhe do notebook apontará para `http://<seu-ip-local>:5173/{id}`.

## Estrutura

```
.
├── api/
│   ├── src/
│   │   ├── app.js         # Express setup
│   │   ├── server.js      # Entry point
│   │   └── routes/        # Notebooks, categories, uploads
│   ├── prisma/
│   │   ├── schema.prisma  # Schema Notebook, Category, NotebookImage
│   │   └── seed.js        # Dados iniciais
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── views/         # Lista, Detalhe, Formulario, Categorias
│   │   ├── services/      # API client
│   │   ├── assets/        # CSS global
│   │   ├── router/        # Vue Router 4
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

### Notebooks

- `GET /api/notebooks` — listar todos
- `GET /api/notebooks/:id` — detalhe + fotos
- `GET /api/notebooks/:id/qrcode` — QR code (PNG)
- `POST /api/notebooks` — criar
- `PUT /api/notebooks/:id` — editar
- `DELETE /api/notebooks/:id` — deletar

### Categorias

- `GET /api/categories` — listar
- `POST /api/categories` — criar
- `PUT /api/categories/:id` — editar
- `DELETE /api/categories/:id` — deletar

### Uploads

- `POST /api/uploads` — enviar foto (multipart/form-data: notebookId + file)
- `DELETE /api/uploads/:id` — deletar foto

## License

Trabalho acadêmico.
