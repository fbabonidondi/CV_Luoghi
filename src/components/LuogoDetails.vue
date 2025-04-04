<template>
  <div>
    <!-- Header con colore basato sulla categoria -->
    <v-card-item 
      :color="getHeaderColor(luogo.categoria)" 
      class="text-white"
    >
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon 
          :icon="getCategoriaIcon(luogo.categoria)" 
          class="mr-2" 
          size="large"
        ></v-icon>
        {{ luogo.nome }}
      </v-card-title>
      <v-card-subtitle class="text-white-opacity mt-1">
        {{ formatCategoria(luogo.categoria) }} • {{ formatDate(luogo.data_visita) }}
      </v-card-subtitle>
    </v-card-item>

    <!-- Tabs per navigare tra le sezioni -->
    <v-tabs
      v-model="activeTab"
      :bg-color="getCategoriaColor(luogo.categoria)"
      align-tabs="center"
      grow
      density="compact"
    >
      <v-tab value="info">
        <v-icon start>mdi-information-outline</v-icon>
        Info
      </v-tab>
      <v-tab value="details">
        <v-icon start>mdi-card-text-outline</v-icon>
        Dettagli
      </v-tab>
      <v-tab value="related">
        <v-icon start>mdi-link-variant</v-icon>
        Correlati
      </v-tab>
      <v-tab value="map">
        <v-icon start>mdi-map-outline</v-icon>
        Mappa
      </v-tab>
    </v-tabs>

    <!-- Contenuto delle tabs -->
    <v-window v-model="activeTab">
      <!-- Tab Informazioni -->
      <v-window-item value="info">
        <v-container class="pa-3">
          <v-row>
            <v-col cols="12">
              <div class="d-flex align-center mb-2">
                <v-avatar :color="getHeaderColor(luogo.categoria)" size="32" class="mr-3">
                  <v-icon color="white" :icon="getCategoriaIcon(luogo.categoria)"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-body-1 font-weight-bold text-dark">{{ luogo.nome }}</div>
                  <div class="text-caption text-grey-darken-3">{{ formatCategoria(luogo.categoria) }}</div>
                </div>
              </div>

              <v-divider class="mb-2"></v-divider>

              <v-list density="compact" class="pa-0 bg-transparent">
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-calendar" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title class="text-dark">Data visita</v-list-item-title>
                  <v-list-item-subtitle class="text-grey-darken-3">{{ formatDate(luogo.data_visita) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-map-marker" color="grey-darken-1"></v-icon>
                  </template>
                  <v-list-item-title class="text-dark">Indirizzo</v-list-item-title>
                  <v-list-item-subtitle class="text-grey-darken-3">{{ luogo.indirizzo }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-divider class="my-2"></v-divider>

              <div>
                <div class="text-subtitle-1 font-weight-bold mb-1 text-dark">Descrizione</div>
                <v-card 
                  variant="outlined" 
                  class="pa-2" 
                  :color="`${getCategoriaColor(luogo.categoria)}-lighten-5`"
                >
                  <div class="text-dark">{{ luogo.descrizione }}</div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <!-- Tab Dettagli -->
      <v-window-item value="details">
        <v-container class="pa-3">
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-2 text-dark">Dettagli specifici</div>

              <!-- Commento sempre presente per tutti i luoghi -->
              <v-card
                variant="outlined"
                class="mb-2 pa-2"
                :color="`${getCategoriaColor(luogo.categoria)}-lighten-5`"
              >
                <div class="text-subtitle-2 font-weight-bold mb-1 text-dark">Commento</div>
                <div class="text-dark">{{ luogo.commento || 'Nessun commento disponibile' }}</div>
              </v-card>
              
              <!-- Campi specifici per categoria -->
              <template v-if="luogo.categoria === 'ristorante' && luogo.lista_cibi">
                <v-card
                  variant="outlined"
                  class="mb-2 pa-2"
                  :color="`${getCategoriaColor(luogo.categoria)}-lighten-5`"
                >
                  <div class="text-subtitle-2 font-weight-bold mb-1 text-dark">Lista cibi</div>
                  <div class="d-flex flex-wrap">
                    <v-chip
                      v-for="(cibo, index) in luogo.lista_cibi"
                      :key="index"
                      size="small"
                      class="ma-1"
                      :color="getHeaderColor(luogo.categoria)"
                      label
                    >
                      {{ cibo }}
                    </v-chip>
                  </div>
                </v-card>
              </template>
              
              <template v-if="luogo.categoria === 'rifugio' && luogo.altitudine">
                <v-card
                  variant="outlined"
                  class="mb-2 pa-2"
                  :color="`${getCategoriaColor(luogo.categoria)}-lighten-5`"
                >
                  <div class="text-subtitle-2 font-weight-bold mb-1 text-dark">Altitudine</div>
                  <div class="d-flex align-center text-dark">
                    <v-icon icon="mdi-elevation-rise" class="mr-2" :color="getHeaderColor(luogo.categoria)"></v-icon>
                    <span>{{ luogo.altitudine }} metri s.l.m.</span>
                  </div>
                </v-card>
              </template>
              
              <template v-if="luogo.categoria === 'lago' && luogo.superficie">
                <v-card
                  variant="outlined"
                  class="mb-2 pa-2"
                  :color="`${getCategoriaColor(luogo.categoria)}-lighten-5`"
                >
                  <div class="text-subtitle-2 font-weight-bold mb-1 text-dark">Superficie</div>
                  <div class="d-flex align-center text-dark">
                    <v-icon icon="mdi-waves" class="mr-2" :color="getHeaderColor(luogo.categoria)"></v-icon>
                    <span>{{ luogo.superficie }} km²</span>
                  </div>
                </v-card>
              </template>
              
              <template v-if="luogo.categoria === 'parco_naturale' && luogo.estensione">
                <v-card
                  variant="outlined"
                  class="mb-2 pa-2"
                  :color="`${getCategoriaColor(luogo.categoria)}-lighten-5`"
                >
                  <div class="text-subtitle-2 font-weight-bold mb-1 text-dark">Estensione</div>
                  <div class="d-flex align-center text-dark">
                    <v-icon icon="mdi-ruler-square" class="mr-2" :color="getHeaderColor(luogo.categoria)"></v-icon>
                    <span>{{ luogo.estensione }} ettari</span>
                  </div>
                </v-card>
              </template>
              
              <!-- Fallback per altre categorie o campi mancanti -->
              <v-alert v-if="!hasSpecificDetails" type="info" variant="tonal" density="compact" class="mt-2">
                Nessun dettaglio specifico disponibile per questa categoria
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <!-- Tab Luoghi correlati -->
      <v-window-item value="related">
        <v-container class="pa-3">
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-2 text-dark">Luoghi correlati</div>
              
              <template v-if="relatedLuoghi.length > 0">
                <v-card
                  v-for="related in relatedLuoghi"
                  :key="related.id"
                  variant="outlined"
                  class="mb-2"
                  :color="`${getCategoriaColor(related.categoria)}-lighten-5`"
                  @click="selectRelated(related)"
                >
                  <v-card-item class="pa-2">
                    <template v-slot:prepend>
                      <v-avatar :color="getHeaderColor(related.categoria)" size="32" class="mr-2">
                        <v-icon color="white" :icon="getCategoriaIcon(related.categoria)"></v-icon>
                      </v-avatar>
                    </template>
                    <v-card-title class="text-body-1 text-dark">{{ related.nome }}</v-card-title>
                    <v-card-subtitle class="text-caption text-grey-darken-3">{{ formatCategoria(related.categoria) }}</v-card-subtitle>
                  </v-card-item>
                </v-card>
              </template>
              
              <v-alert v-else type="info" variant="tonal" density="compact" class="mt-2">
                <template v-slot:prepend>
                  <v-icon icon="mdi-information-outline"></v-icon>
                </template>
                Nessun luogo correlato trovato
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <!-- Tab Mappa -->
      <v-window-item value="map">
        <v-container class="pa-3">
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-2 text-dark">Posizione sulla mappa</div>
              
              <v-card 
                class="map-placeholder d-flex align-center justify-center" 
                height="250"
                :color="`${getCategoriaColor(luogo.categoria)}-lighten-5`"
                variant="outlined"
              >
                <div class="text-center">
                  <v-icon icon="mdi-map-marker" size="large" :color="getHeaderColor(luogo.categoria)" class="mb-2"></v-icon>
                  <div class="text-body-1 text-dark">{{ luogo.indirizzo }}</div>
                  <div class="text-caption text-grey-darken-3">
                    (Qui verrebbe visualizzata la mappa per questo luogo)
                  </div>
                </div>
              </v-card>
              
              <v-btn 
                :color="getHeaderColor(luogo.categoria)" 
                variant="tonal" 
                block 
                class="mt-2"
                prepend-icon="mdi-directions"
                size="small"
              >
                Ottieni indicazioni
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>

    <!-- Footer con azioni -->
    <v-card-actions class="pa-2">
      <v-btn 
        variant="text" 
        @click="closeDetails"
        prepend-icon="mdi-close"
        size="small"
      >
        Chiudi
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn 
        :color="getHeaderColor(luogo.categoria)" 
        variant="tonal"
        prepend-icon="mdi-share-variant"
        class="mr-1"
        size="small"
      >
        Condividi
      </v-btn>
      <v-btn 
        :color="getHeaderColor(luogo.categoria)" 
        prepend-icon="mdi-heart-outline"
        size="small"
      >
        Salva
      </v-btn>
    </v-card-actions>
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
  data() {
    return {
      activeTab: 'info',
    }
  },
  computed: {
    relatedLuoghi() {
      if (!this.luoghi || this.luoghi.length <= 1) return [];
      
      return this.luoghi
        .filter(l => l.id !== this.luogo.id)
        .filter(l => l.categoria === this.luogo.categoria || 
                    this.isSimilarDate(l.data_visita, this.luogo.data_visita))
        .slice(0, 3);
    },
    
    hasSpecificDetails() {
      const categoria = this.luogo.categoria;
      
      if (!categoria) return false;
      
      if (categoria === 'ristorante' && this.luogo.lista_cibi && this.luogo.lista_cibi.length > 0) return true;
      if (categoria === 'rifugio' && this.luogo.altitudine) return true;
      if (categoria === 'lago' && this.luogo.superficie) return true;
      if (categoria === 'parco_naturale' && this.luogo.estensione) return true;
      
      return false;
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
      if (!dateString) return 'Data non disponibile';
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('it-IT', options);
    },
    formatCategoria(categoria) {
      if (!categoria) return 'Categoria non specificata';
      
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
        'ristorante': 'mdi-silverware-fork-knife',
        'chiesa': 'mdi-church',
        'museo': 'mdi-bank',
        'rifugio': 'mdi-home',
        'lago': 'mdi-water',
        'parco_naturale': 'mdi-tree'
      };
      
      return iconMap[categoria] || 'mdi-map-marker';
    },
    getHeaderColor(categoria) {
      if (!categoria) return 'grey';
      
      const colorMap = {
        'ristorante': 'red-darken-1',
        'chiesa': 'blue-darken-2',
        'museo': 'amber-darken-2',
        'rifugio': 'green-darken-1',
        'lago': 'blue',
        'parco_naturale': 'green'
      };
      return colorMap[categoria] || 'grey';
    },
    getCategoriaColor(categoria) {
      if (!categoria) return 'grey';
      
      const colorMap = {
        'ristorante': 'red',
        'chiesa': 'blue',
        'museo': 'amber',
        'rifugio': 'green',
        'lago': 'blue',
        'parco_naturale': 'green'
      };
      return colorMap[categoria] || 'grey';
    },
    isSimilarDate(date1, date2) {
      if (!date1 || !date2) return false;
      
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
.text-white-opacity {
  opacity: 0.9;
}

.v-card-title {
  word-break: break-word;
  line-height: 1.3;
}

.v-card-subtitle {
  line-height: 1.2;
}

.v-card-item {
  padding: 12px !important;
}

.v-avatar {
  --v-avatar-height: 32px !important;
}

.map-placeholder {
  border: 1px dashed rgba(0,0,0,0.1);
}

.text-dark {
  color: rgba(0, 0, 0, 0.87);
}

.text-grey-darken-3 {
  color: rgba(0, 0, 0, 0.6);
}
</style>