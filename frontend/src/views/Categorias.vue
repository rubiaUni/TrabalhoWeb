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
  if (!confirm('Excluir?')) return;
  try {
    await categories.delete(id);
    await carregar();
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <main>
    <router-link to="/">Voltar</router-link>
    <h1>Categorias</h1>
    <form @submit.prevent="salvar">
      <label>Nome <input v-model="nome" required/></label>
      <label>Descrição <input v-model="desc"/></label>
      <button :disabled="loading">{{ editId ? 'Atualizar' : 'Criar' }}</button>
      <button v-if="editId" type="button" @click="editId=null; nome=''; desc=''">Cancelar</button>
    </form>
    <p v-if="error" style="color:crimson">{{ error }}</p>
    <table>
      <thead><tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Qtd</th><th/></tr></thead>
      <tbody>
        <tr v-for="c in items" :key="c.id">
          <td>{{ c.id }}</td><td>{{ c.name }}</td><td>{{ c.description }}</td>
          <td>{{ c._count?.notebooks || 0 }}</td>
          <td><button @click="editar(c)">Editar</button> <button @click="remover(c.id)">Excluir</button></td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
