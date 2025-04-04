<template>
    <div>
      <!-- Filtri -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="2" class="pa-4 rounded-lg">
            <v-card-title class="pb-2">
              <v-icon color="teal" class="me-2">mdi-filter-variant</v-icon>
              Filtri
            </v-card-title>
            <v-row>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="filtriSelezionati.categoria"
                  :items="categorieFiltro"
                  label="Categoria"
                  clearable
                  variant="outlined"
                  density="comfortable"
                  color="teal"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="filtriSelezionati.ordinamento"
                  :items="ordinamentiFiltro"
                  label="Ordinamento"
                  variant="outlined"
                  density="comfortable"
                  color="teal"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4" class="d-flex align-center">
                <v-switch
                  v-model="filtriSelezionati.preferiti"
                  label="Solo preferiti"
                  color="teal"
                  hide-details
                  :disabled="showFavorites"
                ></v-switch>
                <v-spacer></v-spacer>
                <v-btn color="teal" @click="applicaFiltri" variant="elevated" class="rounded-pill">
                  <v-icon start>mdi-filter</v-icon>
                  Applica
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Vista a tabs per diverse modalità di visualizzazione -->
      <v-card elevation="2" class="mb-6 rounded-lg overflow-hidden">
        <v-tabs v-model="activeTab" bg-color="grey-darken-3" slider-color="teal" centered>
          <v-tab value="list" class="text-body-1">
            <v-icon start>mdi-format-list-bulleted</v-icon>
            Lista
          </v-tab>
          <v-tab value="grid" class="text-body-1">
            <v-icon start>mdi-grid</v-icon>
            Griglia
          </v-tab>
          <v-tab value="map" v-if="hasMapFeature" class="text-body-1">
            <v-icon start>mdi-map</v-icon>
            Mappa
          </v-tab>
        </v-tabs>
  
        <v-window v-model="activeTab">
          <v-window-item value="list">
            <LuoghiList 
              :luoghi="luoghiFiltrati" 
              :show-favorites="showFavorites"
              @luogo-selected="handleLuogoSelected"
              @toggle-preferito="togglePreferito" 
            />
          </v-window-item>
          
          <v-window-item value="grid">
            <v-row class="pa-4">
              <v-col v-for="luogo in luoghiFiltrati" :key="luogo.id" cols="12" sm="6" md="4" lg="3">
                <v-hover v-slot="{ isHovering, props }">
                  <v-card 
                    v-bind="props"
                    :elevation="isHovering ? 8 : 2" 
                    class="h-100 rounded-lg"
                    @click="handleLuogoSelected(luogo)"
                  >
                    <v-img
                      :src="luogo.immagine || `/api/placeholder/400/200?text=${luogo.nome}`"
                      height="200"
                      cover
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="teal"></v-progress-circular>
                        </v-row>
                      </template>
                      <div class="fill-height d-flex flex-column justify-space-between">
                        <div class="d-flex justify-end pa-2">
                          <v-btn
                            icon
                            variant="text"
                            size="small"
                            :color="luogo.preferito ? 'error' : 'white'"
                            @click.stop="togglePreferito(luogo)"
                          >
                            <v-icon>{{ luogo.preferito ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                          </v-btn>
                        </div>
                        <div>
                          <v-chip
                            size="small"
                            class="ma-2 text-capitalize"
                            :color="getCategoriaColor(luogo.categoria)"
                          >
                            {{ luogo.categoria }}
                          </v-chip>
                        </div>
                      </div>
                    </v-img>
                    
                    <v-card-title class="text-truncate pb-1">
                      {{ luogo.nome }}
                    </v-card-title>
                    
                    <v-card-subtitle class="pb-1">
                      <v-icon size="small" class="me-1">mdi-map-marker</v-icon>
                      {{ luogo.localita }}
                    </v-card-subtitle>
                    
                    <v-card-text class="text-truncate">
                      {{ luogo.descrizione }}
                    </v-card-text>
                    
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn variant="text" color="teal" @click.stop="handleLuogoSelected(luogo)" class="text-capitalize">
                        Dettagli
                        <v-icon end>mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-window-item>
          
          <v-window-item value="map" v-if="hasMapFeature">
            <div class="pa-4 text-center">
              <p class="text-body-1">Visualizzazione mappa (da implementare)</p>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
  
      <!-- Dettagli Luogo con dialog -->
      <v-dialog v-model="showLuogoDialog" fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar :color="getHeaderColor(selectedLuogo?.categoria)" dark>
            <v-btn 
              icon
              class="mx-1"
              variant="tonal"
              color="white"
              size="large"
              @click="closeDetails"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title class="text-truncate">{{ selectedLuogo?.nome }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="togglePreferito(selectedLuogo)" v-if="selectedLuogo">
              <v-icon>{{ selectedLuogo.preferito ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
            </v-btn>
            <v-chip v-if="selectedLuogo" :color="getCategoriaColor(selectedLuogo.categoria)" variant="elevated">
              {{ formatCategoria(selectedLuogo.categoria) }}
            </v-chip>
          </v-toolbar>
          
          <div v-if="selectedLuogo">
            <LuogoDetails
              :luogo="selectedLuogo"
              :luoghi="luoghi"
              @close="closeDetails"
              @luogo-selected="handleLuogoSelected"
              @open-related-luogo="handleRelatedLuogo"
              @toggle-preferito="togglePreferito"
            />
          </div>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar per notifiche -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color || 'teal'" :timeout="3000" location="top">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false">Chiudi</v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script>
  import LuoghiList from './LuoghiList.vue';
  import LuogoDetails from './LuogoDetails.vue';
  import luoghiData from '@/assets/data/luoghi.json';
  
  export default {
    name: 'HomePage',
    components: {
      LuoghiList,
      LuogoDetails
    },
    props: {
      showFavorites: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        activeTab: 'list',
        showLuogoDialog: false,
        hasMapFeature: false,
        luoghi: [],
        selectedLuogo: null,
        filtriSelezionati: {
          categoria: null,
          ordinamento: 'nome_asc',
          preferiti: false
        },
        categorieFiltro: [
          'ristorante',
          'chiesa',
          'museo',
          'rifugio',
          'lago',
          'parco_naturale',
          'castello',
          'monumento',
          'teatro',
        ],
        ordinamentiFiltro: [
          { title: 'Nome (A-Z)', value: 'nome_asc' },
          { title: 'Nome (Z-A)', value: 'nome_desc' },
          { title: 'Località', value: 'localita' },
          { title: 'Categoria', value: 'categoria' }
        ],
        snackbar: {
          show: false,
          text: '',
          color: 'success'
        }
      };
    },
    created() {
            // Controlla se c'è un parametro categoria nella query string
    if (this.$route.query.categoria) {
      this.filtriSelezionati.categoria = this.$route.query.categoria;
      this.applicaFiltri();
    }
      // Caricamento luoghi e aggiunta della proprietà preferito
      this.luoghi = luoghiData.luoghi.map(luogo => ({
        ...luogo,
        preferito: false
      }));
  
      // Se siamo nella route dei preferiti, attiva il filtro
      if (this.showFavorites) {
        this.filtriSelezionati.preferiti = true;
      }
    },
    computed: {
      luoghiFiltrati() {
        let risultato = [...this.luoghi];
        
        // Filtra per categoria
        if (this.filtriSelezionati.categoria) {
          risultato = risultato.filter(luogo => 
            luogo.categoria === this.filtriSelezionati.categoria
          );
        }
        
        // Filtra per preferiti (se non siamo già nella route dei preferiti)
        if (this.filtriSelezionati.preferiti && !this.showFavorites) {
          risultato = risultato.filter(luogo => luogo.preferito);
        }
        
        // Se siamo nella route dei preferiti, filtra sempre per preferiti
        if (this.showFavorites) {
          risultato = risultato.filter(luogo => luogo.preferito);
        }
        
        // Applica ordinamento
        switch(this.filtriSelezionati.ordinamento) {
          case 'nome_asc':
            risultato.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
          case 'nome_desc':
            risultato.sort((a, b) => b.nome.localeCompare(a.nome));
            break;
          case 'localita':
            risultato.sort((a, b) => a.localita.localeCompare(b.localita));
            break;
          case 'categoria':
            risultato.sort((a, b) => a.categoria.localeCompare(b.categoria));
            break;
        }
        
        return risultato;
      }
    },
    methods: {
      handleLuogoSelected(luogo) {
        this.selectedLuogo = luogo;
        this.showLuogoDialog = true;
      },
      closeDetails() {
        this.showLuogoDialog = false;
        this.selectedLuogo = null;
      },
      applicaFiltri() {
        this.showNotification('Filtri applicati', 'success');
      },
      togglePreferito(luogo) {
        if (luogo) {
          luogo.preferito = !luogo.preferito;
          this.showNotification(
            luogo.preferito 
              ? `${luogo.nome} aggiunto ai preferiti` 
              : `${luogo.nome} rimosso dai preferiti`,
            luogo.preferito ? 'success' : 'info'
          );
        }
      },
      handleRelatedLuogo(luogo) {
        this.selectedLuogo = luogo;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      showNotification(text, color = 'success') {
        this.snackbar.text = text;
        this.snackbar.color = color;
        this.snackbar.show = true;
      },
      getCategoriaColor(categoria) {
        const colors = {
          'ristorante': 'red-darken-1',
          'chiesa': 'blue-darken-2',
          'museo': 'amber-darken-2',
          'rifugio': 'green-darken-1',
          'lago': 'blue',
          'parco_naturale': 'green'
        };
        return colors[categoria] || 'grey';
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
      }
    }
  };
  </script>
  
  <style scoped>
  /* Stili aggiuntivi se necessari */
  </style>