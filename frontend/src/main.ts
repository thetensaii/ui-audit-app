import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from "primevue/config"
import "primevue/resources/themes/lara-light-indigo/theme.css";

const app = createApp(App)
app.use(PrimeVue)
app.mount('#app')
