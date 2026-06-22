import { createRouter, createWebHistory } from 'vue-router';
import Lista from '../views/Lista.vue';
import Detalhe from '../views/Detalhe.vue';
import Formulario from '../views/Formulario.vue';
import Categorias from '../views/Categorias.vue';

const routes = [
  { path: '/', component: Lista },
  { path: '/:id', component: Detalhe },
  { path: '/novo', component: Formulario },
  { path: '/:id/editar', component: Formulario },
  { path: '/categorias', component: Categorias },
];

export default createRouter({ history: createWebHistory(), routes });
