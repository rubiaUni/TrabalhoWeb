# Dockerfile da API existente (pasta ./api). Fica fora de ./api de proposito:
# o codigo da API nao deve ser alterado, so orquestrado.
#
# Imagem Debian slim (glibc) -> binarios pre-compilados de better-sqlite3.
FROM node:20-bookworm-slim

# Toolchain minima caso better-sqlite3 precise compilar (fallback).
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencias primeiro (cache de camadas). Contexto de build = ./api.
COPY package.json package-lock.json ./
RUN npm install

# A config do Prisma (prisma.config.ts) faz `import "dotenv/config"`, mas o
# pacote nao esta no package.json deles. Instalamos so na imagem, sem alterar
# os arquivos do repositorio (--no-save).
RUN npm install --no-save dotenv

# Codigo da API (inalterado).
COPY . .

# Gera o Prisma Client em src/generated/prisma (ignorado pelo git deles).
RUN npx prisma generate

EXPOSE 3000

# Em runtime: cria/atualiza o schema no arquivo SQLite (que vive num volume)
# e sobe o servidor. `db push` e idempotente e sobrevive a down + up.
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node src/server.js"]
