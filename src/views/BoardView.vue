<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'
import KanbanColumn from '@/components/KanbanColumn.vue'
import { useTheme } from '@/composables/useTheme'

const store = useBoardStore()
const { isDark, toggleTheme } = useTheme()

const newColumnTitle = ref('New Column')

function addNewColumn() {
  const title = newColumnTitle.value.trim()
  if (title) {
    store.addColumn(title)
    newColumnTitle.value = 'New Column'
  }
}
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
      <div class="add-column-card">
        <input v-model="newColumnTitle" class="add-column-input" placeholder="Column name..."
          @keyup.enter="addNewColumn" />
        <button class="btn-add-column" @click="addNewColumn">+ Add Column</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.board-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 2rem;
  background: var(--color-bg-primary);
  transition: background-color 0.2s ease;
  overflow: hidden;
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  flex-shrink: 0;
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
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 0.5rem 0 0 0;
  flex: 1;
  margin: 0 -2rem -2rem -2rem;
  padding-right: 2rem;
  padding-left: 2rem;
  padding-bottom: 2rem;
  justify-content: center;
}

.add-column-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--color-bg-primary);
  border: 2px dashed var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  width: 280px;
  flex-shrink: 0;
  min-height: 200px;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.add-column-card:hover,
.add-column-card:focus-within {
  opacity: 1;
  background: var(--color-bg-secondary);
  border-color: var(--color-accent);
}

.add-column-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.add-column-input:focus {
  border-color: var(--color-accent);
}

.btn-add-column {
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

/* Style scrollbar for light theme */
.board::-webkit-scrollbar {
  height: 8px;
}

.board::-webkit-scrollbar-track {
  background: transparent;
}

.board::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

.board::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}
</style>
