<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notebooks, categories, uploads } from '../services/api.js';

const route = useRoute();
const router = useRouter();
const editId = route.params.id;

const cats = ref([]);
const f = ref({
  brand: '', model: '', categoryId: null,
  cpuBrand: '', cpuModel: '', cpuCores: null, cpuThreads: null,
  ramGb: null, ramType: '',
  storageGb: null, storageType: '',
  gpuModel: '', gpuVramGb: null,
  displaySize: null, displayPanel: '',
  osName: '',
  batteryMWh: null, batteryHealth: null,
  coverageMonths: null,
});
const foto = ref(null);
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  cats.value = await categories.list();
  if (editId) {
    const nb = await notebooks.get(editId);
    if (nb) Object.keys(f.value).forEach(k => { if (k in nb) f.value[k] = nb[k]; });
  }
});

function onFotoChange(e) {
  foto.value = e.target.files[0] || null;
}

async function salvar() {
  error.value = '';
  loading.value = true;
  try {
    if (editId) {
      await notebooks.update(editId, f.value);
      if (foto.value) await uploads.create(Number(editId), foto.value);
    } else {
      const nb = await notebooks.create(f.value);
      if (foto.value) await uploads.create(nb.id, foto.value);
    }
    router.push('/');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="container">
    <router-link to="/" class="back-link">Voltar</router-link>
    <div class="page-header">
      <h1>{{ editId ? 'Editar' : 'Novo' }} Notebook</h1>
    </div>

    <div v-if="error" class="alert-error">{{ error }}</div>

    <form @submit.prevent="salvar">
      <fieldset>
        <legend>Dados básicos</legend>
        <div class="form-grid">
          <label>Marca <input v-model="f.brand" required /></label>
          <label>Modelo <input v-model="f.model" required /></label>
          <label>Categoria
            <select v-model="f.categoryId">
              <option :value="null">—</option>
              <option v-for="c in cats" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Processador</legend>
        <div class="form-grid">
          <label>Marca <input v-model="f.cpuBrand" /></label>
          <label>Modelo <input v-model="f.cpuModel" /></label>
          <label>Cores <input v-model="f.cpuCores" type="number" /></label>
          <label>Threads <input v-model="f.cpuThreads" type="number" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>RAM</legend>
        <div class="form-grid">
          <label>GB <input v-model="f.ramGb" type="number" /></label>
          <label>Tipo <input v-model="f.ramType" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Armazenamento</legend>
        <div class="form-grid">
          <label>GB <input v-model="f.storageGb" type="number" /></label>
          <label>Tipo <input v-model="f.storageType" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>GPU</legend>
        <div class="form-grid">
          <label>Modelo <input v-model="f.gpuModel" /></label>
          <label>VRAM (GB) <input v-model="f.gpuVramGb" type="number" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Tela</legend>
        <div class="form-grid">
          <label>Polegadas <input v-model="f.displaySize" type="number" step="0.1" /></label>
          <label>Painel <input v-model="f.displayPanel" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>SO / Bateria / Garantia</legend>
        <div class="form-grid">
          <label>Sistema operacional <input v-model="f.osName" /></label>
          <label>Bateria (mWh) <input v-model="f.batteryMWh" type="number" /></label>
          <label>Saúde (%) <input v-model="f.batteryHealth" type="number" /></label>
          <label>Garantia (meses) <input v-model="f.coverageMonths" type="number" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Foto</legend>
        <div class="form-grid">
          <label>Adicionar foto <input type="file" accept="image/*" @change="onFotoChange" /></label>
        </div>
      </fieldset>

      <button class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Salvando...' : 'Salvar' }}
      </button>
    </form>
  </main>
</template>
