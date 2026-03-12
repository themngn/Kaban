<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import KanbanColumn from '@/components/KanbanColumn.vue'
import { useTheme } from '@/composables/useTheme'

const store = useBoardStore()
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <main class="board-view">
    <div class="board-header">
      <h1 class="board-title">Kaban Board</h1>
      <button class="btn-theme-toggle" @click="toggleTheme" :title="`Switch to ${isDark ? 'light' : 'dark'} theme`">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </div>
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
  background: var(--color-bg-primary);
  transition: background-color 0.2s ease;
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.board-title {
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-text-primary);
  transition: color 0.2s ease;
}

.btn-theme-toggle {
  position: absolute;
  right: 0;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-theme-toggle:hover {
  background: var(--color-button-hover);
}

.board {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
