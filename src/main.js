import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'
import './style.css'

// Service worker: com 'autoUpdate' a página recarrega sozinha quando sai versão nova.
registerSW({
  immediate: true,
  onRegisteredSW(_url, reg) {
    // confere se há versão nova a cada hora (para quem deixa o app aberto)
    reg && setInterval(() => reg.update(), 60 * 60 * 1000)
  }
})

createApp(App).use(router).mount('#app')
