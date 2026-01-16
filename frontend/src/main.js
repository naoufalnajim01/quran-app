import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useQuranStore } from './stores/quran'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

// Initialiser le dark mode
const store = useQuranStore()
store.initDarkMode()

app.mount('#app')
