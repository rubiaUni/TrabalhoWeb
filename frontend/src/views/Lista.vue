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
  <main class="container">
    <div class="page-header">
      <h1>Notebooks</h1>
      <router-link to="/novo" class="btn btn-primary">+ Novo</router-link>
    </div>

    <p v-if="loading" class="text-muted">Carregando...</p>
    <div v-else-if="error" class="alert-error">{{ error }}</div>
    <div v-else-if="items.length" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>CPU</th>
            <th>RAM</th>
            <th>Categoria</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in items" :key="n.id">
            <td class="text-muted">{{ n.id }}</td>
            <td>{{ n.brand }}</td>
            <td>{{ n.model }}</td>
            <td>{{ [n.cpuBrand, n.cpuModel].filter(Boolean).join(' ') || '—' }}</td>
            <td>{{ n.ramGb ? n.ramGb + ' GB' : '—' }}</td>
            <td>{{ n.category?.name || '—' }}</td>
            <td>
              <div class="row">
                <router-link :to="`/${n.id}`" class="btn btn-ghost">Ver</router-link>
                <router-link :to="`/${n.id}/editar`" class="btn btn-outline">Editar</router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-muted">Nenhum notebook cadastrado.</p>
  </main>
</template>
