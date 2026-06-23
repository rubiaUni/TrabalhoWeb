<script setup>
import { ref, onMounted } from 'vue';
import { categories } from '../services/api.js';

const items = ref([]);
const nome = ref('');
const desc = ref('');
const editId = ref(null);
const error = ref('');
const loading = ref(false);

onMounted(carregar);
async function carregar() { items.value = await categories.list(); }

async function salvar() {
  error.value = '';
  loading.value = true;
  try {
    if (editId.value) await categories.update(editId.value, { name: nome.value, description: desc.value });
    else await categories.create({ name: nome.value, description: desc.value });
    nome.value = ''; desc.value = ''; editId.value = null;
    await carregar();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

function editar(c) { editId.value = c.id; nome.value = c.name; desc.value = c.description || ''; }
async function remover(id) {
  if (!confirm('Excluir categoria?')) return;
  try {
    await categories.delete(id);
    await carregar();
  } catch (e) {
    error.value = e.message;
  }
}

function cancelar() { editId.value = null; nome.value = ''; desc.value = ''; }
</script>

<template>
  <main class="container">
    <div class="page-header">
      <h1>Categorias</h1>
    </div>

    <div v-if="error" class="alert-error">{{ error }}</div>

    <div class="card" style="margin-bottom:1.5rem">
      <p class="card-title">{{ editId ? 'Editar categoria' : 'Nova categoria' }}</p>
      <form @submit.prevent="salvar">
        <div class="form-grid">
          <label>Nome <input v-model="nome" required /></label>
          <label>Descrição <input v-model="desc" /></label>
        </div>
        <div class="row" style="margin-top:1rem">
          <button class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Salvando...' : editId ? 'Atualizar' : 'Criar' }}
          </button>
          <button v-if="editId" type="button" class="btn btn-outline" @click="cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Notebooks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in items" :key="c.id">
            <td class="text-muted">{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.description || '—' }}</td>
            <td>{{ c._count?.notebooks || 0 }}</td>
            <td>
              <div class="row">
                <button class="btn btn-ghost" @click="editar(c)">Editar</button>
                <button class="btn btn-danger" @click="remover(c.id)">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
