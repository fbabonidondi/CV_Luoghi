<template>
  <v-container>
    <v-card elevation="2" class="mb-4">
      <v-card-title class="bg-grey-darken-3">
        <span class="text-white">Luoghi visitati per categoria</span>
      </v-card-title>
      
      <v-card-text>
        <v-row align="center" class="mb-4">
          <v-btn-toggle
            v-model="activeFilter"
            mandatory
            color="grey-darken-4"
            variant="flat"
            divided
            class="my-4"
          >
            <v-btn value="all" @click="setFilter('all')">Tutti</v-btn>
            <v-btn 
              v-for="categoria in categorieUniche" 
              :key="categoria.id"
              :value="categoria.id"
              class="text-white"
            >
              {{ categoria.label }}
            </v-btn>
          </v-btn-toggle>

          <v-spacer></v-spacer>

          <v-text-field
            v-model="searchQuery"
            density="compact"
            variant="solo-filled"
            placeholder="Cerca..."
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px"
            hide-details
          ></v-text-field>
        </v-row>
      </v-card-text>
    </v-card>

    <v-expansion-panels variant="accordion" multiple v-model="expandedCategories">
      <v-expansion-panel
        v-for="categoria in categorieConLuoghi"
        :key="categoria.id"
        :value="categoria.id"
      >
        <v-expansion-panel-title>
          <template v-slot:default>
            <v-row no-gutters>
              <v-col cols="4" class="d-flex align-center">
                <v-icon :icon="getCategoriaIcon(categoria.id)" class="me-2"></v-icon>
                {{ categoria.label }}
              </v-col>
              <v-col cols="8" class="text-right">
                <v-chip size="small" class="me-2">{{ categoria.luoghi.length }}</v-chip>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list lines="two">
            <v-list-item
              v-for="luogo in categoria.luoghi"
              :key="luogo.id"
              @click="selectLuogo(luogo)"
              class="py-2"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-map-marker"></v-icon>
              </template>
              
              <v-list-item-title>{{ luogo.nome }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ luogo.indirizzo }} - {{ formatDate(luogo.data_visita) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-alert
      v-if="categorieConLuoghi.length === 0"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Nessun luogo corrisponde ai criteri di ricerca
    </v-alert>
  </v-container>
</template>

<script>
export default {
  name: 'LuoghiList',
  props: {
    luoghi: { type: Array, required: true },
    showFavorites: { type: Boolean, default: false }
  },
  data() {
    return {
      activeFilter: 'all',
      searchQuery: '',
      expandedCategories: ['ristorante'] // La prima categoria è espansa di default
    }
  },
  created() {
    if (this.$route.query.categoria) {
      this.activeFilter = this.$route.query.categoria;
    }
  },
  computed: {
    filteredLuoghi() {
      let filtered = this.luoghi;
      if (this.showFavorites) {
        filtered = filtered.filter(luogo => luogo.preferito);
      }
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(luogo => luogo.categoria === this.activeFilter);
      }
      if (!this.searchQuery.trim()) {
        return filtered;
      }
      const query = this.searchQuery.toLowerCase().trim();
      return filtered.filter(luogo => {
        return (
          luogo.nome.toLowerCase().includes(query) ||
          luogo.indirizzo.toLowerCase().includes(query) ||
          luogo.descrizione.toLowerCase().includes(query)
        );
      });
    },
    categorieUniche() {
      const categorie = new Set(this.luoghi.map(luogo => luogo.categoria));
      return Array.from(categorie).sort().map(categoria => ({
        id: categoria,
        label: this.formatCategoria(categoria)
      }));
    },
    categorieConLuoghi() {
      return this.categorieUniche
        .map(categoria => {
          const luoghiCategoria = this.filteredLuoghi.filter(luogo => 
            luogo.categoria === categoria.id
          );
          return {
            ...categoria,
            luoghi: luoghiCategoria
          };
        })
        .filter(categoria => categoria.luoghi.length > 0);
    }
  },
  methods: {
    selectLuogo(luogo) {
      this.$emit('luogo-selected', luogo);
    },
    setFilter(categoria) {
      this.activeFilter = categoria;
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
        'ristorante': 'mdi-silverware-fork-knife',
        'chiesa': 'mdi-church',
        'museo': 'mdi-bank',
        'rifugio': 'mdi-home',
        'lago': 'mdi-water',
        'parco_naturale': 'mdi-pine-tree',
        'castello': 'mdi-castle',
        'teatro': 'mdi-drama-masks',
        'monumento': 'mdi-cross'
      };
      return iconMap[categoria] || 'mdi-map-marker';
    },
    formatCategoria(categoria) {
      const categorieMap = {
        'ristorante': 'Ristoranti',
        'chiesa': 'Chiese',
        'museo': 'Musei',
        'rifugio': 'Rifugi',
        'lago': 'Laghi',
        'parco_naturale': 'Parchi Naturali',
        'castello': 'Castelli',
        'teatro': 'Teatri',
        'monumento': 'Monumenti'
      };
      return categorieMap[categoria] || categoria.charAt(0).toUpperCase() + categoria.slice(1);
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
.v-expansion-panel-title {
  background-color: rgba(0,0,0,0.03);
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.v-list-item:hover {
  background-color: rgba(0,0,0,0.04);
}

/* Stile per i bottoni dei filtri */
::v-deep .v-btn-toggle .v-btn {
  background-color: #616161 !important;
  transition: all 0.3s ease;
}

/* Stile per il bottone attivo */
::v-deep .v-btn-toggle .v-btn.v-btn--active {
  background-color: #424242 !important;
  transform: scale(1.02);
}

/* Regolazione spaziatura header */
.v-card-title {
  padding: 16px 24px;
  transition: background-color 0.3s ease;
}
</style>