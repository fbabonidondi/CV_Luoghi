<template>
  <div class="container py-4">
    <header class="mb-4 text-center">
      <h1 class="display-5 fw-bold mb-2">I Miei Luoghi Visitati</h1>
      <p class="lead text-muted">Una collezione di luoghi interessanti visitati nel tempo</p>
      <div class="d-flex justify-content-center mt-3">
        <div class="stats-container d-flex flex-wrap justify-content-center gap-3">
          <div v-for="(stat, index) in statistiche" :key="index" class="stat-card text-center p-2 rounded">
            <div class="fs-4 fw-bold">{{ stat.valore }}</div>
            <div class="stat-label small">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </header>
    
    <main>
      <LuoghiList 
        :luoghi="luoghi" 
        @luogo-selected="handleLuogoSelected" 
      />
      <LuogoDetails 
        v-if="selectedLuogo" 
        :luogo="selectedLuogo" 
        :luoghi="luoghi"
        @close="closeDetails"
        @luogo-selected="handleLuogoSelected"
      />
    </main>

    <footer class="text-center mt-5 py-3 text-muted border-top">
      <small>© {{ currentYear }} - App Luoghi Visitati</small>
    </footer>
  </div>
</template>

<script>
import LuoghiList from './components/LuoghiList.vue';
import LuogoDetails from './components/LuogoDetails.vue';
import luoghiData from './assets/data/luoghi.json';

export default {
  name: 'App',
  components: {
    LuoghiList,
    LuogoDetails
  },
  data() {
    return {
      luoghi: [],
      selectedLuogo: null,
      currentYear: new Date().getFullYear()
    }
  },
  created() {
    // Carica i dati dal file JSON
    this.luoghi = luoghiData.luoghi;
  },
  computed: {
    statistiche() {
      const categorieCounts = this.luoghi.reduce((acc, luogo) => {
        acc[luogo.categoria] = (acc[luogo.categoria] || 0) + 1;
        return acc;
      }, {});
      
      return [
        { label: 'Totale luoghi', valore: this.luoghi.length },
        { label: 'Ristoranti', valore: categorieCounts['ristorante'] || 0 },
        { label: 'Chiese', valore: categorieCounts['chiesa'] || 0 },
        { label: 'Musei', valore: categorieCounts['museo'] || 0 },
        { label: 'Rifugi', valore: categorieCounts['rifugio'] || 0 },
        { label: 'Laghi', valore: categorieCounts['lago'] || 0 },
        { label: 'Parchi', valore: categorieCounts['parco_naturale'] || 0 }
      ];
    }
  },
  methods: {
    handleLuogoSelected(luogo) {
      this.selectedLuogo = luogo;
    },
    closeDetails() {
      this.selectedLuogo = null;
    }
  }
}
</script>

<style>
body {
  background-color: #f8f9fa;
}

.container {
  max-width: 960px;
}

.stat-card {
  background-color: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  min-width: 90px;
  border: 1px solid #dee2e6;
}

.stat-label {
  color: #6c757d;
}

header {
  margin-bottom: 2rem;
}
</style>
