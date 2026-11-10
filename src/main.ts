import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import keycloak from './keycloak'

import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080/'

// Quando o backend responde com erro, usa a mensagem enviada por ele
// (ex.: "Curso possui disciplinas...") no lugar da mensagem genérica do axios
axios.interceptors.response.use(
  (resposta) => resposta,
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message
    }
    return Promise.reject(error)
  },
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Abre a tela de login do Keycloak e só monta a aplicação depois do login
keycloak.init({ onLoad: 'login-required' }).then(() => {
  app.mount('#app')
})
