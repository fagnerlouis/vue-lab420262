<template>
  <div>
    <h1>Disciplinas</h1>
    <form @submit.prevent="salvarDisciplina">
      <p>
        <label for="codigo">Código: </label>
        <input id="codigo" type="text" v-model="disciplina.codigo" required />
      </p>
      <p>
        <label for="nome">Nome: </label>
        <input id="nome" type="text" v-model="disciplina.nome" required />
      </p>
      <p>
        <label for="cargaHoraria">Carga horária: </label>
        <input id="cargaHoraria" type="number" v-model.number="disciplina.cargaHoraria" />
      </p>
      <p>
        <label for="curso">Curso: </label>
        <select id="curso" v-model="disciplina.curso.id" required>
          <option v-for="c in cursos" :key="c.id" :value="c.id">{{ c.sigla }}</option>
        </select>
      </p>
      <button type="submit">Salvar</button>
      <button type="button" @click="limpar">Cancelar</button>
    </form>
    <p v-if="erro" class="erro">{{ erro }}</p>

    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Carga horária</th>
          <th>Curso</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in disciplinas" :key="d.id">
          <td>{{ d.codigo }}</td>
          <td>{{ d.nome }}</td>
          <td>{{ d.cargaHoraria }}</td>
          <td>{{ d.curso.sigla }}</td>
          <td>
            <button @click="disciplinaSelecionada = d">Alunos</button>
            <button @click="editar(d)">Editar</button>
            <button @click="excluir(d)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- a lista de disciplinas já vem do backend com os alunos matriculados -->
    <ListaDetalhes
      v-if="disciplinaSelecionada"
      :titulo="'Alunos matriculados em ' + disciplinaSelecionada.nome"
      :itens="disciplinaSelecionada.alunos.map((a) => a.ra + ' - ' + a.nome)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ListaDetalhes from '@/components/ListaDetalhes.vue'

interface Curso {
  id?: number
  sigla?: string
}

interface Disciplina {
  id?: number
  codigo: string
  nome: string
  cargaHoraria?: number
  curso: Curso
  alunos: { ra: number; nome: string }[]
}

const disciplinas = ref<Disciplina[]>([])
const cursos = ref<Curso[]>([])
const disciplina = ref<Disciplina>({ codigo: '', nome: '', curso: {}, alunos: [] })
const erro = ref<string>('')
const disciplinaSelecionada = ref<Disciplina | null>(null)

async function buscarDisciplinas() {
  try {
    disciplinas.value = (await axios.get<Disciplina[]>('disciplina')).data
  } catch (error) {
    erro.value = (error as Error).message
  }
}

async function buscarCursos() {
  try {
    cursos.value = (await axios.get<Curso[]>('curso')).data
  } catch (error) {
    erro.value = (error as Error).message
  }
}

async function salvarDisciplina() {
  try {
    if (disciplina.value.id) {
      await axios.put(`disciplina/${disciplina.value.id}`, disciplina.value)
    } else {
      await axios.post('disciplina', disciplina.value)
    }
    limpar()
    await buscarDisciplinas()
  } catch (error) {
    erro.value = (error as Error).message
  }
}

function editar(d: Disciplina) {
  // copia também o curso, para o select não alterar a linha da tabela
  disciplina.value = { ...d, curso: { ...d.curso } }
}

async function excluir(d: Disciplina) {
  try {
    await axios.delete(`disciplina/${d.id}`)
    disciplinaSelecionada.value = null
    erro.value = ''
    await buscarDisciplinas()
  } catch (error) {
    erro.value = (error as Error).message
  }
}

function limpar() {
  disciplina.value = { codigo: '', nome: '', curso: {}, alunos: [] }
  erro.value = ''
}

onMounted(() => {
  buscarDisciplinas()
  buscarCursos()
})
</script>
