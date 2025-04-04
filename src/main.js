import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import router from './router';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
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