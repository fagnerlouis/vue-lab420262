<template>
  <div>
    <h1>Alunos</h1>
    <form @submit.prevent="salvarAluno">
      <p>
        <label for="ra">RA: </label>
        <input id="ra" type="number" v-model.number="aluno.ra" required />
      </p>
      <p>
        <label for="nome">Nome: </label>
        <input id="nome" type="text" v-model="aluno.nome" required />
      </p>
      <p>
        <label for="dataNascimento">Data de nascimento: </label>
        <input id="dataNascimento" type="date" v-model="aluno.dataNascimento" />
      </p>
      <button type="submit">Salvar</button>
      <button type="button" @click="limpar">Cancelar</button>
    </form>
    <p v-if="erro" class="erro">{{ erro }}</p>

    <table>
      <thead>
        <tr>
          <th>RA</th>
          <th>Nome</th>
          <th>Nascimento</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in alunos" :key="a.id">
          <td>{{ a.ra }}</td>
          <td>{{ a.nome }}</td>
          <td>{{ a.dataNascimento }}</td>
          <td>
            <button @click="verDisciplinas(a)">Disciplinas</button>
            <button @click="editar(a)">Editar</button>
            <button @click="excluir(a)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ListaDetalhes
      v-if="alunoSelecionado"
      :titulo="'Disciplinas de ' + alunoSelecionado.nome"
      :itens="disciplinasDoAluno"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ListaDetalhes from '@/components/ListaDetalhes.vue'

interface Aluno {
  id?: number
  ra?: number
  nome: string
  dataNascimento?: string
}

interface Disciplina {
  codigo: string
  nome: string
}

const alunos = ref<Aluno[]>([])
const aluno = ref<Aluno>({ nome: '' })
const erro = ref<string>('')
const alunoSelecionado = ref<Aluno | null>(null)
const disciplinasDoAluno = ref<string[]>([])

async function buscarAlunos() {
  try {
    alunos.value = (await axios.get<Aluno[]>('aluno')).data
  } catch (error) {
    erro.value = (error as Error).message
  }
}

async function salvarAluno() {
  try {
    if (aluno.value.id) {
      await axios.put(`aluno/${aluno.value.id}`, aluno.value)
    } else {
      await axios.post('aluno', aluno.value)
    }
    limpar()
    await buscarAlunos()
  } catch (error) {
    erro.value = (error as Error).message
  }
}

function editar(a: Aluno) {
  // copia o aluno para o formulário
  aluno.value = { ...a }
}

async function excluir(a: Aluno) {
  try {
    await axios.delete(`aluno/${a.id}`)
    alunoSelecionado.value = null
    erro.value = ''
    await buscarAlunos()
  } catch (error) {
    erro.value = (error as Error).message
  }
}

async function verDisciplinas(a: Aluno) {
  try {
    const disciplinas = (await axios.get<Disciplina[]>(`aluno/${a.id}/disciplinas`)).data
    disciplinasDoAluno.value = disciplinas.map((d) => d.codigo + ' - ' + d.nome)
    alunoSelecionado.value = a
  } catch (error) {
    erro.value = (error as Error).message
  }
}

function limpar() {
  aluno.value = { nome: '' }
  erro.value = ''
}

onMounted(() => {
  buscarAlunos()
})
</script>
