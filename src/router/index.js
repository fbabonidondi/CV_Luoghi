import { createRouter, createWebHistory } from 'vue-router';
import LuoghiList from '../components/LuoghiList.vue';
import LuogoDetails from '../components/LuogoDetails.vue';
import StatistichePage from '../components/StatistichePage.vue';
import luoghiData from '@/assets/data/luoghi.json';

const routes = [
  { path: '/', name: 'Home', component: LuoghiList },
  { path: '/luoghi', name: 'LuoghiList', component: LuoghiList },
  { path: '/luoghi/:id', name: 'LuogoDetails', component: LuogoDetails, props: true },
  { 
    path: '/statistiche', 
    name: 'StatistichePage', 
    component: StatistichePage, 
    props: { luoghi: luoghiData.luoghi }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
