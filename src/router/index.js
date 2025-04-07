import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue'; // Da creare
import LuogoDetails from '@/components/LuogoDetails.vue';
import StatistichePage from '@/components/StatistichePage.vue';
import luoghiData from '@/assets/data/luoghi.json';

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HomePage 
  },
  { 
    path: '/luoghi', 
    name: 'Luoghi',
    component: HomePage 
  },
  { 
    path: '/preferiti', 
    name: 'Preferiti',
    component: HomePage,
    props: { showFavorites: true }
  },
  { 
    path: '/luoghi/:id', 
    name: 'LuogoDetails', 
    component: LuogoDetails, 
    props: true 
  },
  { 
    path: '/statistiche', 
    name: 'Statistiche', 
    component: StatistichePage ,
    props: { luoghi: luoghiData.luoghi } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;