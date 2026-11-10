<template>
  <div>
    <h1>Matrícula</h1>
    <form @submit.prevent="matricular">
      <p>
        <label for="aluno">Aluno: </label>
        <select id="aluno" v-model="alunoId" required>
          <option v-for="a in alunos" :key="a.id" :value="a.id">{{ a.ra }} - {{ a.nome }}</option>
        </select>
      </p>
      <p>
        <label for="disciplina">Disciplina: </label>
        <select id="disciplina" v-model="disciplinaId" required>
          <option v-for="d in disciplinas" :key="d.id" :value="d.id">
            {{ d.codigo }} - {{ d.nome }}
          </option>
        </select>
      </p>
      <button type="submit">Matricular</button>
    </form>
    <p v-if="mensagem" class="sucesso">{{ mensagem }}</p>
    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Aluno {
  id: number
  ra: number
  nome: string
}

interface Disciplina {
  id: number
  codigo: string
  nome: string
}

const alunos = ref<Aluno[]>([])
const disciplinas = ref<Disciplina[]>([])
const alunoId = ref<number>()
const disciplinaId = ref<number>()
const mensagem = ref<string>('')
const erro = ref<string>('')

async function matricular() {
  mensagem.value = ''
  erro.value = ''
  try {
    await axios.post(`disciplina/${disciplinaId.value}/aluno/${alunoId.value}`)
    mensagem.value = 'Matrícula realizada!'
  } catch (error) {
    erro.value = (error as Error).message
  }
}

onMounted(async () => {
  try {
    alunos.value = (await axios.get<Aluno[]>('aluno')).data
    disciplinas.value = (await axios.get<Disciplina[]>('disciplina')).data
  } catch (error) {
    erro.value = (error as Error).message
  }
})
</script>
