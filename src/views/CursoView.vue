<template>
  <div>
    <h1>Cursos</h1>
    {{ sigla }}
    <form @submit.prevent="salvarCurso">
      <p>
        <label id="siglaFormLabel" for="siglaForm">Sigla: </label>
        <input id="siglaForm" type="text" v-model="curso.sigla" required />
      </p>
      <p>
        <label id="nomeFormLabel" for="nomeForm">Nome: </label>
        <input id="nomeForm" type="text" v-model="curso.nome" required />
      </p>
      <button type="submit">Salvar</button>
    </form>
    <p v-if="erro.length > 0">{{ erro }}</p>
    <p>
      <label id="labelsigla" for="sigla">Sigla: </label>
      <input id="sigla" type="text" :value="sigla" @input="alteracaoSigla" />
      <input id="sigla2" type="text" v-model="sigla" />
    </p>
    <p v-if="sigla.length > 3">Sigla muito grande!</p>
    <div v-else>Ok</div>
    <button @click="buscarCursos">Atualizar</button>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface curso {
  sigla: string
  nome: string
  id?: number
}

const curso = ref<curso>({ sigla: '', nome: '' })

const erro = ref<string>('')

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

async function buscarCursos() {
  cursos.value = (await axios.get<curso[]>('curso')).data
}

async function salvarCurso() {
  try {
    await axios.post('curso', curso.value)
    await buscarCursos()
    erro.value = ''
  } catch (error) {
    erro.value = (error as Error).message
  }
}

onMounted(() => {
  buscarCursos()
})
</script>
