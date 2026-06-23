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
  if (!confirm('Excluir este notebook?')) return;
  try {
    await notebooks.delete(route.params.id);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <main class="container">
    <router-link to="/" class="back-link">Voltar</router-link>

    <p v-if="loading" class="text-muted">Carregando...</p>
    <div v-else-if="error" class="alert-error">{{ error }}</div>
    <div v-else-if="!n" class="text-muted">Notebook não encontrado.</div>
    <div v-else>
      <div class="page-header">
        <h1>{{ n.brand }} {{ n.model }}</h1>
        <div class="row">
          <router-link :to="`/${n.id}/editar`" class="btn btn-outline">Editar</router-link>
          <button class="btn btn-danger" @click="remover">Excluir</button>
        </div>
      </div>

      <div class="card">
        <p class="card-title">Especificações</p>
        <dl class="dl-grid">
          <dt>Categoria</dt>
          <dd>{{ n.category?.name || '—' }}</dd>

          <dt>Processador</dt>
          <dd>{{ n.cpuBrand }} {{ n.cpuModel }}
            <span v-if="n.cpuCores" class="text-muted">({{ n.cpuCores }}c/{{ n.cpuThreads }}t)</span>
          </dd>

          <dt>RAM</dt>
          <dd>{{ n.ramGb ? n.ramGb + ' GB' : '—' }} {{ n.ramType || '' }}</dd>

          <dt>Armazenamento</dt>
          <dd>{{ n.storageGb ? n.storageGb + ' GB' : '—' }} {{ n.storageType || '' }}</dd>

          <dt>GPU</dt>
          <dd>{{ n.gpuModel || '—' }}
            <span v-if="n.gpuVramGb" class="text-muted">({{ n.gpuVramGb }} GB)</span>
          </dd>

          <dt>Tela</dt>
          <dd>{{ n.displaySize ? n.displaySize + '"' : '—' }} {{ n.displayPanel || '' }}</dd>

          <dt>Sistema operacional</dt>
          <dd>{{ n.osName || '—' }}</dd>

          <dt>Bateria</dt>
          <dd>
            {{ n.batteryMWh ? n.batteryMWh + ' mWh' : '—' }}
            <span v-if="n.batteryHealth" class="text-muted">· Saúde {{ n.batteryHealth }}%</span>
          </dd>

          <dt>Garantia</dt>
          <dd>{{ n.coverageMonths ? n.coverageMonths + ' meses' : '—' }}</dd>
        </dl>
      </div>

      <div v-if="n.images?.length" class="card">
        <p class="card-title">Fotos</p>
        <div class="photo-gallery">
          <img
            v-for="img in n.images"
            :key="img.id"
            :src="`/api/uploads/${img.filename}`"
            :alt="n.model"
          />
        </div>
      </div>

      <div class="card">
        <p class="card-title">QR Code</p>
        <img
          :src="`/api/notebooks/${n.id}/qrcode`"
          alt="QR Code"
          class="qr-img"
        />
      </div>
    </div>
  </main>
</template>
