# Frontend Vue 3 + Vite rodando em modo dev (hello world / POC).
FROM node:20-bookworm-slim

WORKDIR /app

# Dependencias primeiro (cache de camadas).
COPY package.json ./
RUN npm install

# Codigo do app.
COPY . .

EXPOSE 5173

# Dev server exposto em 0.0.0.0 para ser acessivel fora do container.
# VITE_API_URL e lido em runtime pelo dev server (via ambiente do compose).
CMD ["npm", "run", "dev"]
