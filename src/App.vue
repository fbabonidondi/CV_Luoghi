<template>
  <v-app :theme="theme">
    <!-- Navigation Drawer migliorato -->
    <v-navigation-drawer v-model="drawer" app :width="280" elevation="4" temporary>
      <v-card flat class="pa-4 text-center">
        <v-avatar color="teal" size="80">
          <v-icon size="48" color="white">mdi-map-marker</v-icon>
        </v-avatar>
        <h2 class="text-h5 mt-3 font-weight-medium">CV_Luoghi</h2>
        <p class="text-caption text-medium-emphasis">Luoghi interessanti</p>
      </v-card>
      
      <v-divider></v-divider>
      
      <v-list nav>
      <v-list-item 
        v-for="(item, i) in menuItems" 
        :key="i" 
        link 
        :to="item.route">
        
        <template v-slot:prepend>
          <v-icon :color="item.color || 'teal'">{{ item.icon }}</v-icon>
        </template>

        <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
       </v-list>

      
      <template v-slot:append>
        <v-divider></v-divider>
        <div class="pa-4">
          <v-btn block color="teal" variant="tonal">
            <v-icon start>mdi-information</v-icon>
            Informazioni
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar migliorato con icone sempre visibili -->
    <v-app-bar app color="grey-darken-4" elevation="2">
      <!-- Menu navigation icon con stile ben visibile -->
      <v-btn
        icon
        color="teal-lighten-1"
        class="ml-2 mr-1"
        size="large"
        variant="tonal"
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      
      <v-toolbar-title class="font-weight-bold">
        <span class="text-teal">CV_Luoghi</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>

      <!-- Barra di ricerca integrata nell'app-bar -->
      <v-slide-x-transition>
        <v-text-field
          v-if="showSearchBar"
          v-model="searchQuery"
          density="compact"
          hide-details
          variant="solo-filled"
          rounded="pill"
          placeholder="Cerca luoghi..."
          prepend-inner-icon="mdi-magnify"
          class="search-field mx-2"
          bg-color="grey-darken-3"
          clearable
          style="max-width: 300px"
          @keyup.enter="searchLuoghi"
        ></v-text-field>
      </v-slide-x-transition>
      
      <!-- Bottoni icona ben visibili con sfondo e colore -->
      <v-btn 
        icon
        class="mx-1"
        variant="tonal"
        color="teal-lighten-1"
        size="large"
        @click="toggleSearchBar"
      >
        <v-icon>{{ showSearchBar ? 'mdi-close' : 'mdi-magnify' }}</v-icon>
      </v-btn>
      
      <v-btn 
        icon
        class="mx-1"
        variant="tonal"
        color="amber-lighten-1"
        size="large"
        @click="toggleThemeMode"
      >
        <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn 
            icon
            class="mx-1"
            variant="tonal"
            color="blue-lighten-1"
            size="large"
            v-bind="props"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in dropdownMenu" :key="i" :value="item" @click="handleMenuAction(item.action)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
      <v-container class="py-6">
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
      </v-container>
    </v-main>
    
    <!-- Speed dial per azioni rapide -->
    <v-speed-dial
      v-model="fab"
      location="bottom right"
      direction="top"
      transition="scale-transition"
      :style="{ position: 'fixed', bottom: '16px', right: '16px' }"
    >
      <template v-slot:activator>
        <v-btn
          color="teal"
          icon="mdi-plus"
          size="large"
          elevation="4"
        ></v-btn>
      </template>
      <v-btn
        color="green"
        icon="mdi-plus-circle"
        size="small"
        elevation="2"
        @click="nuovoLuogo"
      >
        <v-tooltip activator="parent" location="left">Aggiungi nuovo luogo</v-tooltip>
      </v-btn>
      <v-btn
        color="blue"
        icon="mdi-map-marker-radius"
        size="small"
        elevation="2"
        @click="trovaVicini"
      >
        <v-tooltip activator="parent" location="left">Trova luoghi vicini</v-tooltip>
      </v-btn>
      <v-btn
        color="red"
        icon="mdi-heart"
        size="small"
        elevation="2"
        @click="mostraPreferiti"
      >
        <v-tooltip activator="parent" location="left">Mostra preferiti</v-tooltip>
      </v-btn>
    </v-speed-dial>

    <!-- Footer -->
    <v-footer app class="bg-grey-darken-4 text-center d-flex flex-column pa-0">
      <div class="pt-4 pb-3">
        <v-btn v-for="icon in socialIcons" :key="icon" icon class="mx-2" variant="text" color="teal">
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="py-2 text-grey">
        <small>© {{ currentYear }} - CV_Luoghi - FBaboni</small>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import LuoghiList from './components/LuoghiList.vue';
import LuogoDetails from './components/LuogoDetails.vue';
import luoghiData from './assets/data/luoghi.json';

export default {
  name: 'App',
  components: {
    LuoghiList,
    LuogoDetails,
  },
  data() {
    return {
      drawer: false,
      fab: false,
      isDarkMode: true,
      showSearchBar: true,
      searchQuery: '',
      activeTab: 'list',
      showLuogoDialog: false,
      hasMapFeature: false,
      menuItems: [
        { text: 'Home', route: '/', icon: 'mdi-home', color: 'primary' },
        { text: 'Luoghi', route: '/luoghi', icon: 'mdi-map-marker-multiple', color: 'success' },
        { text: 'Categorie', route: '/categorie', icon: 'mdi-shape', color: 'info' },
        { text: 'Preferiti', route: '/preferiti', icon: 'mdi-heart', color: 'error' },
        { text: 'Statistiche', route: '/statistiche', icon: 'mdi-chart-bar', color: 'warning' },
        { text: 'Impostazioni', route: '/impostazioni', icon: 'mdi-cog', color: 'grey' }
      ],
      dropdownMenu: [
        { title: 'Aggiorna dati', action: 'refresh' },
        { title: 'Esporta luoghi', action: 'export' },
        { title: 'Gestisci categorie', action: 'categories' },
        { title: 'Informazioni', action: 'about' }
      ],
      socialIcons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-instagram',
        'mdi-github'
      ],
      luoghi: [],
      selectedLuogo: null,
      currentYear: new Date().getFullYear(),
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
        'parco_naturale'
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
    // Caricamento luoghi e aggiunta della proprietà preferito
    this.luoghi = luoghiData.luoghi.map(luogo => ({
      ...luogo,
      preferito: false
    }));
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
    },
    luoghiFiltrati() {
      let risultato = [...this.luoghi];
      
      // Filtra per categoria
      if (this.filtriSelezionati.categoria) {
        risultato = risultato.filter(luogo => 
          luogo.categoria === this.filtriSelezionati.categoria
        );
      }
      
      // Filtra per preferiti
      if (this.filtriSelezionati.preferiti) {
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
      
      // Filtra per ricerca se presente
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        risultato = risultato.filter(luogo => 
          luogo.nome.toLowerCase().includes(query) || 
          luogo.localita.toLowerCase().includes(query) ||
          luogo.descrizione.toLowerCase().includes(query)
        );
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
    toggleThemeMode() {
      this.isDarkMode = !this.isDarkMode;
      this.$vuetify.theme.dark = this.isDarkMode;
    },
    toggleSearchBar() {
      this.showSearchBar = !this.showSearchBar;
      if (!this.showSearchBar) {
        this.searchQuery = '';
      } else {
        // Focus on search field when opened
        setTimeout(() => {
          const searchField = document.querySelector('input[type="text"]');
          if (searchField) searchField.focus();
        }, 50);
      }
    },
    searchLuoghi() {
      this.showNotification(`Ricerca: ${this.searchQuery}`, 'info');
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
    handleMenuAction(action) {
      switch(action) {
        case 'refresh':
          this.showNotification('Dati aggiornati', 'success');
          break;
        case 'export':
          this.showNotification('Funzione di esportazione da implementare', 'info');
          break;
        case 'categories':
          this.showNotification('Gestione categorie da implementare', 'info');
          break;
        case 'about':
          this.showNotification('Informazioni applicazione', 'info');
          break;
      }
    },
    showNotification(text, color = 'success') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    getCategoriaColor(categoria) {
      const colors = {
        'Totale luoghi': 'primary',
        'Ristoranti': 'red-darken-1',
        'Chiese': 'blue-darken-2',
        'Musei': 'amber-darken-2',
        'Rifugi': 'green-darken-1',
        'Laghi': 'blue',
        'Parchi': 'green',
        'ristorante': 'red-darken-1',
        'chiesa': 'blue-darken-2',
        'museo': 'amber-darken-2',
        'rifugio': 'green-darken-1',
        'lago': 'blue',
        'parco_naturale': 'green'
      };
      return colors[categoria] || 'grey';
    },
    getCategoriaIcon(categoria) {
      const icons = {
        'Totale luoghi': 'mdi-map-marker-multiple',
        'Ristoranti': 'mdi-silverware-fork-knife',
        'Chiese': 'mdi-church',
        'Musei': 'mdi-bank',
        'Rifugi': 'mdi-home',
        'Laghi': 'mdi-waves',
        'Parchi': 'mdi-pine-tree'
      };
      return icons[categoria] || 'mdi-map-marker';
    },
    nuovoLuogo() {
      this.showNotification('Funzione per aggiungere nuovo luogo', 'info');
    },
    trovaVicini() {
      this.showNotification('Ricerca luoghi vicini', 'info');
    },
    mostraPreferiti() {
      this.filtriSelezionati.preferiti = true;
      this.applicaFiltri();
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
  }
};
</script>

<style>
.v-navigation-drawer {
  border-bottom: 10px solid rgba(231, 29, 29, 0.12);
}

.on-hover {
  transition: all 0.3s ease-in-out;
}

/* Animazioni per il speed dial */
.v-speed-dial {
  position: absolute;
}

.v-speed-dial .v-btn {
  margin-top: 10px;
}

.v-speed-dial .v-btn:first-of-type {
  margin-top: 0;
}

/* Stile per hover effect sulle cards */
.v-card.on-hover {
  transform: translateY(-50px);
}
</style>