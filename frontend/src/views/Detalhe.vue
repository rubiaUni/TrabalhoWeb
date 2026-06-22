<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notebooks } from '../services/api.js';

const route = useRoute();
const router = useRouter();
const n = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    n.value = await notebooks.get(route.params.id);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

async function remover() {
  if (!confirm('Excluir?')) return;
  try {
    await notebooks.delete(route.params.id);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <main>
    <router-link to="/">Voltar</router-link>
    <p v-if="loading">Carregando...</p>
    <p v-else-if="error" style="color:crimson">{{ error }}</p>
    <div v-else-if="!n"><p>Notebook não encontrado.</p></div>
    <div v-else>
      <h1>{{ n.brand }} {{ n.model }}</h1>

      <table>
        <tr><th>Categoria</th><td>{{ n.category?.name || '-' }}</td></tr>
        <tr><th>Processador</th><td>{{ n.cpuBrand }} {{ n.cpuModel }} ({{ n.cpuCores }}c/{{ n.cpuThreads }}t)</td></tr>
        <tr><th>RAM</th><td>{{ n.ramGb }}GB {{ n.ramType || '' }}</td></tr>
        <tr><th>Armazenamento</th><td>{{ n.storageGb }}GB {{ n.storageType || '' }}</td></tr>
        <tr><th>GPU</th><td>{{ n.gpuModel || '-' }} {{ n.gpuVramGb ? '('+n.gpuVramGb+'GB)' : '' }}</td></tr>
        <tr><th>Tela</th><td>{{ n.displaySize || '' }}" {{ n.displayPanel || '' }}</td></tr>
        <tr><th>SO</th><td>{{ n.osName || '-' }}</td></tr>
        <tr><th>Bateria</th><td>{{ n.batteryMWh ? n.batteryMWh+'mWh' : '-' }} / Saúde {{ n.batteryHealth || '-' }}%</td></tr>
        <tr><th>Garantia</th><td>{{ n.coverageMonths ? n.coverageMonths+' meses' : '-' }}</td></tr>
      </table>

      <router-link :to="`/${n.id}/editar`">Editar</router-link>
      <button @click="remover" style="margin-left:1rem">Excluir</button>
    </div>
  </main>
</template>
