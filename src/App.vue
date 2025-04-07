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

      <!-- Speed dial per azioni rapide (mantieni se necessario) -->
      <v-speed-dial
        v-model="fab"
        location="bottom right"
        direction="top"
        transition="scale-transition"
        :style="{ position: 'fixed', bottom: '16px', right: '16px' }"
      >
        <!-- ... (mantieni lo speed dial esistente) ... -->
      </v-speed-dial>
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
import luoghiData from './assets/data/luoghi.json';

export default {
  name: 'App',
  components: {
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
    
    const statisticheArray = Object.entries(categorieCounts).map(([categoria, count]) => ({
      label: this.formatCategoria(categoria), // Usa la funzione per formattare il nome
      valore: count,
      icon: this.getCategoriaIcon(categoria),
      color: this.getCategoriaColor(categoria)
    }));
    
    // Aggiungi il totale all'inizio
    statisticheArray.unshift({
      label: 'Totale luoghi',
      valore: this.luoghi.length,
      icon: 'mdi-map-marker-multiple',
      color: 'primary'
    });
    
    return statisticheArray;
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
    handleRelatedLuogo(luogo) {
    // Aggiorna il luogo selezionato senza chiudere il dialog
    this.selectedLuogo = luogo;
    // Se necessario, fai scroll verso l'alto
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    'ristorante': 'red-darken-1',
    'chiesa': 'blue-darken-2',
    'museo': 'amber-darken-2',
    'rifugio': 'green-darken-1',
    'lago': 'blue',
    'parco_naturale': 'green',
    'castello': 'purple-darken-1',
    'teatro': 'orange-darken-1',
    'monumento': 'cyan-darken-1'
  };
  return colors[categoria] || 'grey';
},
getCategoriaIcon(categoria) {
  const icons = {
    'Totale luoghi': 'mdi-map-marker-multiple',
    'ristorante': 'mdi-silverware-fork-knife',
    'chiesa': 'mdi-church',
    'museo': 'mdi-bank',
    'rifugio': 'mdi-home',
    'lago': 'mdi-waves',
    'parco_naturale': 'mdi-pine-tree',
    'castello': 'mdi-castle',
    'teatro': 'mdi-drama-masks',
    'monumento': 'mdi-monument'
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
    'parco_naturale': 'Parco Naturale',
    'castello': 'Castello',
    'teatro': 'Teatro',
    'monumento': 'Monumento'
  };
  
  return categorieMap[categoria] || categoria.charAt(0).toUpperCase() + categoria.slice(1);
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