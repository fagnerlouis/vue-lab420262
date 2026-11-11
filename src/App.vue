<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import keycloak from './keycloak'

const usuario = keycloak.tokenParsed?.preferred_username
//const usuario = 'teste'

function sair() {
  keycloak.logout({ redirectUri: window.location.origin })
}
</script>

<template>
  <header>
    <p class="usuario">
      Usuário: {{ usuario }}
      <button @click="sair">Sair</button>
    </p>
    <nav>
      <RouterLink to="/">Início</RouterLink>
      <RouterLink to="/aluno">Alunos</RouterLink>
      <RouterLink to="/curso">Cursos</RouterLink>
      <RouterLink to="/disciplina">Disciplinas</RouterLink>
      <RouterLink to="/matricula">Matrícula</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
