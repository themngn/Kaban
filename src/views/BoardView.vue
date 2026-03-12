<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import KanbanColumn from '@/components/KanbanColumn.vue'

const store = useBoardStore()
</script>

<template>
  <main class="board-view">
    <h1 class="board-title">Kaban Board</h1>
    <div class="board">
      <KanbanColumn v-for="(column, index) in store.columns" :key="column.id" :column="column" :is-first="index === 0"
        :is-last="index === store.columns.length - 1" />
    </div>
  </main>
</template>

<style scoped>
.board-view {
  padding: 2rem;
  min-height: 100vh;
  background: #f1f5f9;
}

.board-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #1e293b;
}

.board {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
