import { createApp } from 'vue'
import App from './App.vue'
import { install } from './plugins'

const app = createApp(App)

install(app).mount('#app')
