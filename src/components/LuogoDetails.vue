<template>
  <v-dialog v-model="dialogLocal" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar :color="getHeaderColor(luogo.categoria)" density="comfortable">
        <!-- Bottone icona ben visibile con sfondo e colore -->
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
        
        <v-toolbar-title>{{ luogo.nome }}</v-toolbar-title>
        
        <v-spacer></v-spacer>
        
        <v-chip :color="getCategoriaColor(luogo.categoria)" variant="elevated">
          {{ formatCategoria(luogo.categoria) }}
        </v-chip>
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4 mb-4">
              <v-card-title class="text-h6">Informazioni</v-card-title>
              
              <v-list density="comfortable">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-calendar"></v-icon>
                  </template>
                  <v-list-item-subtitle>Data visita</v-list-item-subtitle>
                  <v-list-item-title>{{ formatDate(luogo.data_visita) }}</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-map-marker"></v-icon>
                  </template>
                  <v-list-item-subtitle>Indirizzo</v-list-item-subtitle>
                  <v-list-item-title>{{ luogo.indirizzo }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>

            <v-card variant="outlined" class="pa-4">
              <v-card-title class="text-h6">Descrizione</v-card-title>
              <v-card-text>{{ luogo.descrizione }}</v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4 mb-4">
              <v-card-title class="text-h6">Dettagli specifici</v-card-title>
              <!-- Campi specifici per categoria (stesso contenuto) -->
            </v-card>

            <v-card variant="outlined" class="pa-4">
              <v-card-title class="text-h6">Luoghi correlati</v-card-title>
              <v-card-text>
                <v-chip-group>
                  <v-chip
                    v-for="related in relatedLuoghi"
                    :key="related.id"
                    variant="outlined"
                    @click="selectRelated(related)"
                  >
                    {{ related.nome }}
                  </v-chip>
                </v-chip-group>
                <v-alert v-if="relatedLuoghi.length === 0" type="info" variant="tonal">
                  Nessun luogo correlato trovato
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="tonal" @click="closeDetails">Chiudi</v-btn>
        <v-btn 
          color="primary" 
          variant="tonal"
          class="mx-1"
          size="large"
        >
          <v-icon start>mdi-map</v-icon>
          Vedi sulla mappa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogLocal: this.modelValue
    };
  },
  watch: {
    modelValue(newValue) {
      this.dialogLocal = newValue;
    },
    dialogLocal(newValue) {
      this.$emit('update:modelValue', newValue);
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
      this.dialogLocal = false;
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
        'ristorante': 'red-lighten-1',
        'chiesa': 'blue-lighten-2',
        'museo': 'amber-lighten-2',
        'rifugio': 'green-lighten-1',
        'lago': 'blue-lighten-1',
        'parco_naturale': 'green-lighten-1'
      };
      return colorMap[categoria] || 'grey';
    },
    isSimilarDate(date1, date2) {
      // Se una delle date non esiste, ritorna false
      if (!date1 || !date2) return false;
      
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