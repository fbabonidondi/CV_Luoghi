<template>
    <div class="luogo-details-overlay" @click.self="closeDetails">
      <div class="luogo-details-modal">
        <div class="card shadow">
          <div 
            class="card-header d-flex justify-content-between align-items-center"
            :class="getHeaderClass(luogo.categoria)"
          >
            <div class="d-flex align-items-center">
              <i class="fas me-2" :class="getCategoriaIcon(luogo.categoria)"></i>
              <h3 class="mb-0 h5 text-white">{{ luogo.nome }}</h3>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="closeDetails" aria-label="Close"></button>
          </div>
          
          <div class="card-body">
            <div class="mb-4 d-flex justify-content-between">
              <span class="badge me-2" :class="getCategoriaClass(luogo.categoria)">
                {{ formatCategoria(luogo.categoria) }}
              </span>
              <span class="text-muted"><i class="far fa-calendar-alt me-1"></i>{{ formatDate(luogo.data_visita) }}</span>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="detail-section mb-3">
                  <h4 class="h6 text-uppercase text-primary">Descrizione</h4>
                  <p>{{ luogo.descrizione }}</p>
                </div>
                
                <div class="detail-section mb-3">
                  <h4 class="h6 text-uppercase text-primary">Indirizzo</h4>
                  <p class="d-flex align-items-start">
                    <i class="fas fa-map-marker-alt mt-1 me-2 text-danger"></i>
                    <span>{{ luogo.indirizzo }}</span>
                  </p>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="detail-section mb-3">
                  <h4 class="h6 text-uppercase text-primary">Commento</h4>
                  <p class="fst-italic">
                    <i class="fas fa-quote-left me-1 small text-muted"></i>
                    {{ luogo.commento }}
                    <i class="fas fa-quote-right ms-1 small text-muted"></i>
                  </p>
                </div>
                
                <!-- Campi specifici per categoria -->
                <template v-if="luogo.categoria === 'ristorante' && luogo.lista_cibi">
                  <div class="detail-section mb-3">
                    <h4 class="h6 text-uppercase text-primary">Cibi assaggiati</h4>
                    <ul class="list-unstyled">
                      <li v-for="(cibo, index) in luogo.lista_cibi" :key="index" class="mb-1">
                        <i class="fas fa-utensil-spoon me-2 text-muted"></i>{{ cibo }}
                      </li>
                    </ul>
                  </div>
                </template>
                
                <template v-if="luogo.categoria === 'rifugio' && luogo.altitudine">
                  <div class="detail-section mb-3">
                    <h4 class="h6 text-uppercase text-primary">Altitudine</h4>
                    <p class="d-flex align-items-center">
                      <i class="fas fa-mountain me-2 text-success"></i>
                      <span>{{ luogo.altitudine }} metri s.l.m.</span>
                    </p>
                  </div>
                </template>
                
                <template v-if="luogo.categoria === 'lago' && luogo.superficie">
                  <div class="detail-section mb-3">
                    <h4 class="h6 text-uppercase text-primary">Superficie</h4>
                    <p class="d-flex align-items-center">
                      <i class="fas fa-water me-2 text-primary"></i>
                      <span>{{ luogo.superficie }} km²</span>
                    </p>
                  </div>
                </template>
                
                <template v-if="luogo.categoria === 'parco_naturale' && luogo.estensione">
                  <div class="detail-section mb-3">
                    <h4 class="h6 text-uppercase text-primary">Estensione</h4>
                    <p class="d-flex align-items-center">
                      <i class="fas fa-tree me-2 text-success"></i>
                      <span>{{ luogo.estensione }} ettari</span>
                    </p>
                  </div>
                </template>
              </div>
            </div>
            
            <!-- Info aggiuntive -->
            <div class="additional-info">
              <div class="row">
                <div class="col-md-12">
                  <div class="card bg-light">
                    <div class="card-body">
                      <h5 class="text-muted mb-3">Hai visitato altri luoghi nelle vicinanze</h5>
                      <div class="related-locations d-flex flex-wrap gap-2">
                        <button 
                          v-for="related in relatedLuoghi" 
                          :key="related.id"
                          class="btn btn-sm btn-outline-secondary"
                          @click="selectRelated(related)"
                        >
                          {{ related.nome }}
                        </button>
                        <div v-if="relatedLuoghi.length === 0" class="text-muted small">
                          Nessun altro luogo nelle vicinanze
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-footer d-flex justify-content-end">
            <button class="btn btn-outline-secondary me-2" @click="closeDetails">
              <i class="fas fa-times me-1"></i>Chiudi
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-map-marked-alt me-1"></i>Vedi sulla mappa
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LuogoDetails',
    props: {
      luogo: {
        type: Object,
        required: true
      },
      luoghi: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      // Trova luoghi correlati (stessa categoria o data di visita simile)
      relatedLuoghi() {
        // Se non ci sono altri luoghi, restituisci un array vuoto
        if (!this.luoghi || this.luoghi.length <= 1) return [];
        
        return this.luoghi
          .filter(l => l.id !== this.luogo.id)
          .filter(l => l.categoria === this.luogo.categoria || 
                      this.isSimilarDate(l.data_visita, this.luogo.data_visita))
          .slice(0, 3); // Limitiamo a 3 luoghi correlati
      }
    },
    methods: {
      closeDetails() {
        this.$emit('close');
      },
      selectRelated(luogo) {
        this.$emit('close');
        setTimeout(() => {
          this.$emit('luogo-selected', luogo);
        }, 300);
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
      },
      formatCategoria(categoria) {
        const categorieMap = {
          'ristorante': 'Ristorante',
          'chiesa': 'Chiesa',
          'museo': 'Museo',
          'rifugio': 'Rifugio',
          'lago': 'Lago',
          'parco_naturale': 'Parco Naturale'
        };
        
        return categorieMap[categoria] || categoria;
      },
      getCategoriaIcon(categoria) {
        const iconMap = {
          'ristorante': 'fa-utensils',
          'chiesa': 'fa-church',
          'museo': 'fa-landmark',
          'rifugio': 'fa-mountain',
          'lago': 'fa-water',
          'parco_naturale': 'fa-tree'
        };
        
        return iconMap[categoria] || 'fa-map-marker-alt';
      },
      getCategoriaClass(categoria) {
        const classMap = {
          'ristorante': 'bg-danger',
          'chiesa': 'bg-info',
          'museo': 'bg-warning',
          'rifugio': 'bg-success',
          'lago': 'bg-primary',
          'parco_naturale': 'bg-success'
        };
        
        return classMap[categoria] || 'bg-secondary';
      },
      getHeaderClass(categoria) {
        const headerClassMap = {
          'ristorante': 'bg-danger text-white',
          'chiesa': 'bg-info text-white',
          'museo': 'bg-warning text-white',
          'rifugio': 'bg-success text-white',
          'lago': 'bg-primary text-white',
          'parco_naturale': 'bg-success text-white'
        };
        
        return headerClassMap[categoria] || 'bg-secondary text-white';
      },
      isSimilarDate(date1, date2) {
        // Controlla se le date sono entro 30 giorni l'una dall'altra
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }
    }
  }
  </script>
  
  <style scoped>
  .luogo-details-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .luogo-details-modal {
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    animation: fadeIn 0.3s;
  }
  
  .detail-section h4 {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.5px;
  }
  
  .detail-section {
    background-color: #ffffff;
    border-radius: 0.25rem;
    padding: 0.75rem;
    border-left: 3px solid #e9ecef;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>