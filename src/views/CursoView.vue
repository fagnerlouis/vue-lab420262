<template>
  <div>
    <h1>Cursos</h1>
    {{ sigla }}
    <p>
      <label id="labelsigla" for="sigla">Sigla: </label>
      <input id="sigla" type="text" :value="sigla" @input="alteracaoSigla" />
      <input id="sigla2" type="text" v-model="sigla" />
    </p>
    <p v-if="sigla.length > 3">Sigla muito grande!</p>
    <div v-else>Ok</div>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Sigla</th>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in cursos" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.sigla }}</td>
          <td>{{ c.nome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface curso {
  sigla: string
  nome: string
  id?: number
}

const sigla = ref<string>('BD')

sigla.value = 'BDD'

const cursos = ref<curso[]>([
  { sigla: 'BD', nome: 'Banco de Dados', id: 1 },
  { sigla: 'LP', nome: 'Linguagem de Programação', id: 2 },
  { sigla: 'POO', nome: 'Programação Orientada a Objetos', id: 3 },
])

function alteracaoSigla(event: Event) {
  const input = event.target as HTMLInputElement
  sigla.value = input.value
}
</script>
