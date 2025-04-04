import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import router from './router'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'  // <== Importa il CSS delle icone
import { aliases, mdi } from 'vuetify/iconsets/mdi'  // <== Importa il set di icone MDI

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',  // <== Imposta il set predefinito su MDI
    aliases,
    sets: { mdi }
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          primary: '#6200ea',
          secondary: '#03dac6',
          background: '#f8f9fa',
        }
      }
    }
  }
})

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
