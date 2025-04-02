<template>
    <div class="luoghi-list">
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-primary text-white">
          <h2 class="mb-0 h5">Luoghi visitati per categoria</h2>
        </div>
        <div class="card-body">
          <!-- Filtri e ricerca -->
          <div class="mb-3 d-flex justify-content-between align-items-center">
            <div class="btn-group" role="group">
              <button 
                type="button" 
                class="btn btn-sm" 
                :class="activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
                @click="setFilter('all')"
              >
                Tutti
              </button>
              <button 
                v-for="categoria in categorie" 
                :key="categoria.id"
                type="button" 
                class="btn btn-sm" 
                :class="activeFilter === categoria.id ? 'btn-primary' : 'btn-outline-primary'"
                @click="setFilter(categoria.id)"
              >
                {{ categoria.label }}
              </button>
            </div>
            <div class="input-group input-group-sm" style="max-width: 200px;">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Cerca..." 
                v-model="searchQuery"
              >
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Vista gruppi categorie -->
      <div class="accordion" id="categorieLuoghi">
        <div 
          v-for="categoria in categorieConLuoghi" 
          :key="categoria.id"
          class="accordion-item"
        >
          <h2 class="accordion-header">
            <button 
              class="accordion-button" 
              :class="{ 'collapsed': !isExpanded(categoria.id) }"
              type="button" 
              @click="toggleExpand(categoria.id)"
              :aria-expanded="isExpanded(categoria.id)"
              :aria-controls="'panelCategoria' + categoria.id"
            >
              <div class="d-flex align-items-center w-100">
                <i class="fas me-2" :class="getCategoriaIcon(categoria.id)"></i>
                <span class="me-2">{{ categoria.label }}</span>
                <span class="badge bg-secondary ms-auto">{{ categoria.luoghi.length }}</span>
              </div>
            </button>
          </h2>
          <div 
            :id="'panelCategoria' + categoria.id" 
            class="accordion-collapse collapse"
            :class="{ 'show': isExpanded(categoria.id) }"
          >
            <div class="accordion-body p-0">
              <ul class="list-group list-group-flush">
                <li 
                  v-for="luogo in categoria.luoghi" 
                  :key="luogo.id" 
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  @click="selectLuogo(luogo)"
                >
                  <div>
                    <div class="fw-bold">{{ luogo.nome }}</div>
                    <div class="text-muted small">{{ luogo.indirizzo }}</div>
                    <div class="text-muted">{{ formatDate(luogo.data_visita) }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Messaggio quando non ci sono risultati -->
      <div v-if="categorieConLuoghi.length === 0" class="alert alert-info mt-3">
        Nessun luogo corrisponde ai criteri di ricerca
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LuoghiList',
    props: {
      luoghi: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        activeFilter: 'all',
        searchQuery: '',
        expandedCategories: ['ristorante'], // La prima categoria è espansa di default
        categorie: [
          { id: 'ristorante', label: 'Ristoranti' },
          { id: 'chiesa', label: 'Chiese' },
          { id: 'museo', label: 'Musei' },
          { id: 'rifugio', label: 'Rifugi' },
          { id: 'lago', label: 'Laghi' },
          { id: 'parco_naturale', label: 'Parchi Naturali' }
        ]
      }
    },
    computed: {
      filteredLuoghi() {
        let filteredByCategory = this.luoghi;
        
        // Filtra per categoria se non è 'all'
        if (this.activeFilter !== 'all') {
          filteredByCategory = this.luoghi.filter(luogo => luogo.categoria === this.activeFilter);
        }
        
        // Se non c'è una query di ricerca, restituisci i luoghi filtrati per categoria
        if (!this.searchQuery.trim()) {
          return filteredByCategory;
        }
        
        // Filtra per query di ricerca
        const query = this.searchQuery.toLowerCase().trim();
        return filteredByCategory.filter(luogo => {
          return (
            luogo.nome.toLowerCase().includes(query) ||
            luogo.indirizzo.toLowerCase().includes(query) ||
            luogo.descrizione.toLowerCase().includes(query)
          );
        });
      },
      categorieConLuoghi() {
        // Raggruppa i luoghi filtrati per categoria
        return this.categorie
          .map(categoria => {
            const luoghiCategoria = this.filteredLuoghi.filter(luogo => 
              luogo.categoria === categoria.id
            );
            
            return {
              ...categoria,
              luoghi: luoghiCategoria
            };
          })
          .filter(categoria => categoria.luoghi.length > 0); // Mostra solo categorie con luoghi
      }
    },
    methods: {
      selectLuogo(luogo) {
        this.$emit('luogo-selected', luogo);
      },
      setFilter(categoria) {
        this.activeFilter = categoria;
        
        // Se stiamo filtrando per una categoria specifica, espandiamola
        if (categoria !== 'all') {
          this.expandedCategories = [categoria];
        }
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
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
      isExpanded(categoriaId) {
        return this.expandedCategories.includes(categoriaId);
      },
      toggleExpand(categoriaId) {
        const index = this.expandedCategories.indexOf(categoriaId);
        if (index > -1) {
          this.expandedCategories.splice(index, 1);
        } else {
          this.expandedCategories.push(categoriaId);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .luoghi-list {
    margin-bottom: 2rem;
  }
  
  .list-group-item {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .list-group-item:hover {
    background-color: #f8f9fa;
  }
  
  .accordion-button:not(.collapsed) {
    background-color: #e7f1ff;
    color: #0d6efd;
    font-weight: bold;
  }
  
  .accordion-button:focus {
    box-shadow: none;
  }
  
  .accordion-button::after {
    margin-left: 0.5rem;
  }
  </style>