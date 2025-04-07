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
            <v-row dense>
              <v-col 
                v-for="(stat, index) in statistiche" 
                :key="index" 
                cols="6" 
                sm="4" 
                md="2"
                @click="handleCategoryClick(stat.label)"
              >
                <v-hover v-slot="{ isHovering, props }">
                  <v-card
                    v-bind="props"
                    :elevation="isHovering ? 8 : 2"
                    class="text-center pa-3 transition-swing d-flex flex-column justify-center"
                    :color="getCategoriaColor(stat.label)"
                    height="150"
                    theme="dark"
                  >
                    <v-icon size="36" class="mb-2">{{ getCategoriaIcon(stat.label) }}</v-icon>
                    <v-card-title class="text-h4 justify-center py-1">{{ stat.valore }}</v-card-title>
                    <v-card-subtitle class="text-caption pb-0">{{ stat.label }}</v-card-subtitle>
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
        <v-card elevation="2" class="h-100 pa-4">
          <v-card-title class="font-weight-bold">
            <v-icon start>mdi-chart-pie</v-icon>
            Distribuzione per Categoria
          </v-card-title>
          <v-card-text class="text-center">
            <v-skeleton-loader
              type="image"
              class="mx-auto"
              max-width="300"
            ></v-skeleton-loader>
            <p class="text-caption text-medium-emphasis mt-4">Grafico in fase di sviluppo</p>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100 pa-4">
          <v-card-title class="font-weight-bold">
            <v-icon start>mdi-map</v-icon>
            Distribuzione Geografica
          </v-card-title>
          <v-card-text class="text-center">
            <v-skeleton-loader
              type="image"
              class="mx-auto"
              max-width="300"
            ></v-skeleton-loader>
            <p class="text-caption text-medium-emphasis mt-4">Mappa in fase di sviluppo</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="font-weight-bold">
            <v-icon start>mdi-chart-timeline-variant</v-icon>
            Attività Recente
          </v-card-title>
          <v-card-text>
            <v-timeline side="end" align="start">
              <v-timeline-item
                v-for="n in 3"
                :key="n"
                dot-color="primary"
                size="small"
              >
                <div class="d-flex">
                  <v-skeleton-loader
                    type="list-item-two-line"
                    width="100%"
                  ></v-skeleton-loader>
                </div>
              </v-timeline-item>
            </v-timeline>
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
      
      const statisticheArray = Object.entries(categorieCounts).map(([categoria, count]) => ({
        label: this.formatCategoria(categoria),
        valore: count
      }));
      
      statisticheArray.unshift({
        label: 'Totale luoghi',
        valore: this.luoghi.length
      });
      
      return statisticheArray;
    }
  },
  methods: {
    handleCategoryClick(categoryLabel) {
      const categoryMap = {
        'Ristoranti': 'ristorante',
        'Chiese': 'chiesa',
        'Musei': 'museo',
        'Rifugi': 'rifugio',
        'Laghi': 'lago',
        'Parchi Naturali': 'parco_naturale',
        'Castelli': 'castello',
        'Teatri': 'teatro',
        'Monumenti': 'monumento'
      };
      const categoryValue = categoryMap[categoryLabel];
      if (categoryValue) {
        this.$router.push({
          path: '/luoghi',
          query: { categoria: categoryValue }
        });
      }
    },
    getCategoriaColor(categoria) {
      const colors = {
        'Totale luoghi': 'primary',
        'Ristoranti': 'red-darken-1',
        'Chiese': 'blue-darken-2',
        'Musei': 'amber-darken-2',
        'Rifugi': 'green-darken-1',
        'Laghi': 'blue',
        'Parchi Naturali': 'green',
        'Castelli': 'purple-darken-1',
        'Teatri': 'orange-darken-1',
        'Monumenti': 'cyan-darken-1'
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
        'Parchi Naturali': 'mdi-pine-tree',
        'Castelli': 'mdi-castle',
        'Teatri': 'mdi-drama-masks',
        'Monumenti': 'mdi-cross'
      };
      return icons[categoria] || 'mdi-map-marker';
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
    }
  }
}
</script>

<style scoped>
.v-card.on-hover {
  transform: translateY(-5px);
  transition: all 0.3s ease-in-out;
}
</style>