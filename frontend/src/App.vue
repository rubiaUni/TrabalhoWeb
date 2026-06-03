<script setup>
import { ref, onMounted } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

const status = ref('checando...');
const ok = ref(false);


async function checkApi() {
  status.value = 'checando...';
  ok.value = false;
  try {
    const res = await fetch(`${apiUrl}/`);
    const data = await res.json();
    status.value = JSON.stringify(data);
    ok.value = res.ok;
  } catch (err) {
    status.value = `falha ao conectar: ${err.message}`;
    ok.value = false;
  }
}

onMounted(checkApi);

// TODO: telas reais do catalogo consumindo a API existente
// (ex.: POST /notebooks { brand, model } e futuras rotas de listagem).
</script>

<template>
  <main style="font-family: system-ui, sans-serif; max-width: 640px; margin: 4rem auto; padding: 0 1rem;">
    <h1>Catalogo de Produtos &mdash; POC</h1>
    <p>hello world.</p>

    <section style="margin-top: 2rem; padding: 1rem; border: 1px solid #ccc; border-radius: 8px;">
      <h2>check API</h2>
      <p>API (via proxy): <code>{{ apiUrl }}</code></p>
      <p>
        GET / :
        <strong :style="{ color: ok ? 'green' : 'crimson' }">{{ status }}</strong>
      </p>
      <button @click="checkApi">Check!</button>
    </section>
  </main>
</template>
