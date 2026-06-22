<script setup>
import { ref, onMounted } from 'vue';
import { notebooks } from '../services/api.js';

const items = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    items.value = await notebooks.list();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main>
    <h1>Notebooks</h1>
    <router-link to="/novo">+ Novo</router-link>
    <router-link to="/categorias" style="margin-left:1rem">Categorias</router-link>

    <p v-if="loading">Carregando...</p>
    <p v-else-if="error" style="color:crimson">{{ error }}</p>
    <table v-else-if="items.length">
      <thead><tr><th>#</th><th>Marca</th><th>Modelo</th><th>CPU</th><th>RAM</th><th/></tr></thead>
      <tbody>
        <tr v-for="n in items" :key="n.id">
          <td>{{ n.id }}</td>
          <td>{{ n.brand }}</td>
          <td>{{ n.model }}</td>
          <td>{{ n.cpuBrand || '' }} {{ n.cpuModel || '' }}</td>
          <td>{{ n.ramGb ? n.ramGb + 'GB' : '-' }}</td>
          <td>
            <router-link :to="`/${n.id}`">Ver</router-link>
            <router-link :to="`/${n.id}/editar`" style="margin-left:.5rem">Editar</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nenhum notebook cadastrado.</p>
  </main>
</template>
