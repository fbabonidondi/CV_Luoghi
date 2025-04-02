<template>
    <v-container class="py-6">
      <v-row>
        <v-col cols="12">
          <v-card elevation="3" class="rounded-lg">
            <v-card-title class="text-center py-4">
              <h1 class="text-h4 font-weight-bold">Statistiche Luoghi</h1>
              <p class="text-subtitle-1 text-medium-emphasis">Panoramica dei luoghi da esplorare</p>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="(stat, index) in statistiche" :key="index" cols="6" sm="4" md="2">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      :elevation="isHovering ? 8 : 2"
                      :class="{ 'on-hover': isHovering }"
                      class="text-center pa-3 transition-swing"
                      :color="getCategoriaColor(stat.label)"
                      theme="dark"
                    >
                      <v-icon size="36" class="mb-2">{{ getCategoriaIcon(stat.label) }}</v-icon>
                      <v-card-title class="text-h4 justify-center py-1">{{ stat.valore }}</v-card-title>
                      <v-card-subtitle class="pb-0">{{ stat.label }}</v-card-subtitle>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Grafici statistiche -->
      <v-row class="mt-6">
        <v-col cols="12" md="6">
          <v-card elevation="2" class="h-100">
            <v-card-title class="font-weight-bold">
              <v-icon start>mdi-chart-pie</v-icon>
              Distribuzione per Categoria
            </v-card-title>
            <v-card-text class="text-center">
              <p class="text-body-1 text-medium-emphasis">
                Grafico distribuzione luoghi per categoria (da implementare)
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card elevation="2" class="h-100">
            <v-card-title class="font-weight-bold">
              <v-icon start>mdi-map</v-icon>
              Distribuzione Geografica
            </v-card-title>
            <v-card-text class="text-center">
              <p class="text-body-1 text-medium-emphasis">
                Grafico distribuzione luoghi per località (da implementare)
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row class="mt-6">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title class="font-weight-bold">
              <v-icon start>mdi-chart-timeline-variant</v-icon>
              Attività Recente
            </v-card-title>
            <v-card-text>
              <p class="text-body-1 text-medium-emphasis text-center">
                Timeline delle attività recenti (da implementare)
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'StatistichePage',
    props: {
      luoghi: {
        type: Array,
        required: true
      }
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
      getCategoriaColor(categoria) {
        const colors = {
          'Totale luoghi': 'primary',
          'Ristoranti': 'red-darken-1',
          'Chiese': 'blue-darken-2',
          'Musei': 'amber-darken-2',
          'Rifugi': 'green-darken-1',
          'Laghi': 'blue',
          'Parchi': 'green'
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
      }
    }
  };
  </script>
  
  <style scoped>
  .v-card.on-hover {
    transform: translateY(-5px);
    transition: all 0.3s ease-in-out;
  }
  </style>