<script setup lang="ts">
// Componente reutilizável: mostra um título e uma lista de textos
defineProps<{
  titulo: string
  itens: string[]
}>()
</script>

<template>
  <div class="detalhes">
    <h3>{{ titulo }}</h3>
    <ul>
      <li v-for="(item, indice) in itens" :key="indice">{{ item }}</li>
      <li v-if="itens.length === 0">Nenhum registro.</li>
    </ul>
  </div>
</template>
