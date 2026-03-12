<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useBoardStore } from '@/stores/board'
import KanbanColumn from '@/components/KanbanColumn.vue'
import { useTheme } from '@/composables/useTheme'

const store = useBoardStore()
const { isDark, toggleTheme } = useTheme()

const newColumnTitle = ref('New Column')
const isEditingBoardName = ref(false)
const editingBoardName = ref('')
const boardNameInput = ref<HTMLInputElement | null>(null)
const showMenu = ref(false)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}

function clearBoard() {
  if (confirm('Clear all cards from all columns?')) {
    store.clearBoard()
    closeMenu()
  }
}

function deleteBoard() {
  store.deleteBoard()
  closeMenu()
}

const handleClickOutside = (event: MouseEvent) => {
  const menu = document.querySelector('.menu-dropdown')
  const button = document.querySelector('.btn-board-menu')
  if (menu && !menu.contains(event.target as Node) && button && !button.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function startEditingBoardName() {
  editingBoardName.value = store.boardName
  isEditingBoardName.value = true
  nextTick(() => {
    boardNameInput.value?.focus()
    boardNameInput.value?.select()
  })
}

function saveBoardName() {
  if (isEditingBoardName.value) {
    store.setBoardName(editingBoardName.value)
    isEditingBoardName.value = false
  }
}

function cancelEditingBoardName() {
  isEditingBoardName.value = false
}

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
      <h1 v-if="!isEditingBoardName" class="board-title" @click="startEditingBoardName">
        {{ store.boardName }}
      </h1>
      <input v-else ref="boardNameInput" v-model="editingBoardName" class="board-title-input" @blur="saveBoardName"
        @keyup.enter="saveBoardName" @keyup.esc="cancelEditingBoardName" maxlength="50" />
      <div class="header-actions">
        <div class="board-menu-container">
          <button class="btn-board-menu" @click="toggleMenu">⋮</button>
          <div v-if="showMenu" class="menu-dropdown">
            <button class="menu-item" @click="clearBoard">Clear Board</button>
            <button class="menu-item delete-item" @click="deleteBoard">Delete Board</button>
          </div>
        </div>
        <button class="btn-theme-toggle" @click="toggleTheme" :title="`Switch to ${isDark ? 'light' : 'dark'} theme`">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
    <div class="board">
      <KanbanColumn v-for="(column, index) in store.columns" :key="column.id" :column="column" :is-first="index === 0"
        :is-last="index === store.columns.length - 1" />
      <div class="add-column-card">
        <input v-model="newColumnTitle" class="add-column-input" placeholder="Column name..."
          @keyup.enter="addNewColumn" maxlength="30" />
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
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.board-title:hover {
  background: var(--color-bg-secondary);
}

.board-title-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-accent);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  outline: none;
  width: auto;
  min-width: 200px;
  max-width: 400px;
}

.header-actions {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-board-menu {
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
  color: var(--color-text-primary);
}

.btn-board-menu:hover {
  background: var(--color-button-hover);
}

.board-menu-container {
  position: relative;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  z-index: 100;
  min-width: 150px;
}

.menu-item {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: var(--color-button-hover);
}

.delete-item {
  color: var(--color-delete);
}

.delete-item:hover {
  background: var(--color-delete-bg);
}

.btn-theme-toggle {
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
  width: 320px;
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
