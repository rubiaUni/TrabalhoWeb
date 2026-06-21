<script setup>
import { ref, onMounted } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

// Status da API
const status = ref('checando...');
const ok = ref(false);

// Lista de notebooks
const notebooks = ref([]);

// Formulário
const brand = ref('');
const model = ref('');

// Controle de edição
const editingId = ref(null);

// Feedback
const loading = ref(false);
const error = ref('');
const success = ref('');

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

async function loadNotebooks() {
  try {
    const res = await fetch(`${apiUrl}/notebooks`);

    if (!res.ok) {
      throw new Error('Erro ao buscar notebooks');
    }

    notebooks.value = await res.json();
  } catch (err) {
    error.value = err.message;
  }
}

async function saveNotebook() {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const payload = {
      brand: brand.value,
      model: model.value,
    };

    let res;

    if (editingId.value) {
      res = await fetch(
        `${apiUrl}/notebooks/${editingId.value}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
    } else {
      res = await fetch(
        `${apiUrl}/notebooks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao salvar notebook');
    }

    success.value = editingId.value
      ? 'Notebook atualizado com sucesso!'
      : 'Notebook criado com sucesso!';

    resetForm();
    await loadNotebooks();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

function editNotebook(notebook) {
  editingId.value = notebook.id;

  brand.value = notebook.brand;
  model.value = notebook.model;

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

async function deleteNotebook(id) {
  const confirmed = confirm(
    'Deseja realmente excluir este notebook?'
  );

  if (!confirmed) {
    return;
  }

  error.value = '';
  success.value = '';

  try {
    const res = await fetch(
      `${apiUrl}/notebooks/${id}`,
      {
        method: 'DELETE',
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao excluir notebook');
    }

    success.value = 'Notebook excluído com sucesso!';

    if (editingId.value === id) {
      resetForm();
    }

    await loadNotebooks();
  } catch (err) {
    error.value = err.message;
  }
}

function resetForm() {
  editingId.value = null;
  brand.value = '';
  model.value = '';
}

onMounted(async () => {
  await checkApi();
  await loadNotebooks();
});
</script>

<template>
  <main
    style="
      font-family: system-ui, sans-serif;
      max-width: 900px;
      margin: 4rem auto;
      padding: 0 1rem;
    "
  >
    <h1>Catálogo de Notebooks</h1>

    <!-- CHECK API -->
    <section
      style="
        margin-top: 2rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
      "
    >
      <h2>Check API</h2>

      <p>API: <code>{{ apiUrl }}</code></p>

      <p>
        GET / :
        <strong :style="{ color: ok ? 'green' : 'crimson' }">
          {{ status }}
        </strong>
      </p>

      <button @click="checkApi">
        Check API
      </button>
    </section>

    <!-- FORMULÁRIO -->
    <section
      style="
        margin-top: 2rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
      "
    >
      <h2>
        {{ editingId ? 'Editar Notebook' : 'Novo Notebook' }}
      </h2>

      <form @submit.prevent="saveNotebook">
        <div style="margin-bottom: 1rem">
          <label>Marca</label>
          <br />
          <input
            v-model="brand"
            type="text"
            placeholder="Dell"
            required
            style="
              width: 100%;
              padding: 8px;
              box-sizing: border-box;
            "
          />
        </div>

        <div style="margin-bottom: 1rem">
          <label>Modelo</label>
          <br />
          <input
            v-model="model"
            type="text"
            placeholder="Inspiron 15"
            required
            style="
              width: 100%;
              padding: 8px;
              box-sizing: border-box;
            "
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
        >
          {{
            loading
              ? 'Salvando...'
              : editingId
              ? 'Atualizar'
              : 'Criar'
          }}
        </button>

        <button
          v-if="editingId"
          type="button"
          @click="resetForm"
          style="margin-left: 10px"
        >
          Cancelar
        </button>
      </form>

      <p
        v-if="success"
        style="color: green; margin-top: 1rem"
      >
        {{ success }}
      </p>

      <p
        v-if="error"
        style="color: crimson; margin-top: 1rem"
      >
        {{ error }}
      </p>
    </section>

    <!-- LISTAGEM -->
    <section
      style="
        margin-top: 2rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
      "
    >
      <h2>Notebooks Cadastrados</h2>

      <button
        @click="loadNotebooks"
        style="margin-bottom: 1rem"
      >
        Atualizar Lista
      </button>

      <table
        style="
          width: 100%;
          border-collapse: collapse;
        "
      >
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px">
              ID
            </th>
            <th style="border: 1px solid #ccc; padding: 8px">
              Marca
            </th>
            <th style="border: 1px solid #ccc; padding: 8px">
              Modelo
            </th>
            <th style="border: 1px solid #ccc; padding: 8px">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="notebook in notebooks"
            :key="notebook.id"
          >
            <td style="border: 1px solid #ccc; padding: 8px">
              {{ notebook.id }}
            </td>

            <td style="border: 1px solid #ccc; padding: 8px">
              {{ notebook.brand }}
            </td>

            <td style="border: 1px solid #ccc; padding: 8px">
              {{ notebook.model }}
            </td>

            <td style="border: 1px solid #ccc; padding: 8px">
              <button
                @click="editNotebook(notebook)"
                style="margin-right: 8px"
              >
                Editar
              </button>

              <button
                @click="deleteNotebook(notebook.id)"
              >
                Excluir
              </button>
            </td>
          </tr>

          <tr v-if="notebooks.length === 0">
            <td
              colspan="4"
              style="
                text-align: center;
                padding: 1rem;
                border: 1px solid #ccc;
              "
            >
              Nenhum notebook encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>