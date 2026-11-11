<template>
  <div>
    <h1>Cursos</h1>
    <form @submit.prevent="salvarCurso">
      <p>
        <label for="sigla">Sigla: </label>
        <input id="sigla" type="text" v-model="curso.sigla" required />
      </p>
      <p>
        <label for="nome">Nome: </label>
        <input id="nome" type="text" v-model="curso.nome" required />
      </p>
      <button type="submit">Salvar</button>
      <button type="button" @click="limpar">Cancelar</button>
    </form>
    <p v-if="erro" class="erro">{{ erro }}</p>

    <table>
      <thead>
        <tr>
          <th>Sigla</th>
          <th>Nome</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in cursos" :key="c.id">
          <td>{{ c.sigla }}</td>
          <td>{{ c.nome }}</td>
          <td>
            <button @click="ver(c, 'disciplinas')">Disciplinas</button>
            <button @click="ver(c, 'alunos')">Alunos</button>
            <button @click="editar(c)">Editar</button>
            <button @click="excluir(c)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="cursoSelecionado">
      <ListaDetalhes
        v-if="exibir === 'disciplinas'"
        :titulo="'Disciplinas de ' + cursoSelecionado.sigla"
        :itens="disciplinasDoCurso.map((d) => d.codigo + ' - ' + d.nome)"
      />
      <div v-if="exibir === 'alunos'">
        <h2>Alunos cursando disciplinas de {{ cursoSelecionado.sigla }}</h2>
        <ListaDetalhes
          v-for="d in disciplinasDoCurso"
          :key="d.id"
          :titulo="d.codigo + ' - ' + d.nome"
          :itens="d.alunos.map((a) => a.ra + ' - ' + a.nome)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ListaDetalhes from '@/components/ListaDetalhes.vue'

interface Curso {
  id?: number
  sigla: string
  nome: string
}

interface Disciplina {
  id: number
  codigo: string
  nome: string
  alunos: { ra: number; nome: string }[]
}

const cursos = ref<Curso[]>([])
const curso = ref<Curso>({ sigla: '', nome: '' })
const erro = ref<string>('')
const cursoSelecionado = ref<Curso | null>(null)
const disciplinasDoCurso = ref<Disciplina[]>([])
const exibir = ref<string>('')

async function buscarCursos() {
  try {
    cursos.value = (await axios.get<Curso[]>('curso')).data
  } catch (error) {
    erro.value = (error as Error).message
  }
}

async function salvarCurso() {
  try {
    if (curso.value.id) {
      await axios.put(`curso/${curso.value.id}`, curso.value)
    } else {
      await axios.post('curso', curso.value)
    }
    limpar()
    await buscarCursos()
  } catch (error) {
    erro.value = (error as Error).message
  }
}

function editar(c: Curso) {
  curso.value = { id: c.id, sigla: c.sigla, nome: c.nome }
}

async function excluir(c: Curso) {
  if (!confirm('Deseja excluir ' + c.nome + '?')) {
    return;
  }
  try {
    await axios.delete(`curso/${c.id}`)
    cursoSelecionado.value = null
    erro.value = ''
    await buscarCursos()
  } catch (error) {
    erro.value = (error as Error).message
  }
}

// busca as disciplinas do curso (cada disciplina já vem com seus alunos)
async function ver(c: Curso, tipo: string) {
  try {
    disciplinasDoCurso.value = (await axios.get<Disciplina[]>(`curso/${c.id}/disciplinas`)).data
    cursoSelecionado.value = c
    exibir.value = tipo
  } catch (error) {
    erro.value = (error as Error).message
  }
}

function limpar() {
  curso.value = { sigla: '', nome: '' }
  erro.value = ''
}

onMounted(() => {
  buscarCursos()
})
</script>
