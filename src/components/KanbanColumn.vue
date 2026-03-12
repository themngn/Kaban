<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'
import KanbanCard from './KanbanCard.vue'
import type { Column } from '@/types'

const props = defineProps<{
  column: Column
  isFirst: boolean
  isLast: boolean
}>()

const store = useBoardStore()

const newCardTitle = ref('')
const showForm = ref(false)

function submitCard() {
  const title = newCardTitle.value.trim()
  if (!title) return
  store.addCard(props.column.id, title)
  newCardTitle.value = ''
  showForm.value = false
}

function cancelAdd() {
  newCardTitle.value = ''
  showForm.value = false
}
</script>

<template>
  <div class="column">
    <div class="column-header">
      <h2 class="column-title">{{ props.column.title }}</h2>
      <span class="column-count">{{ props.column.cards.length }}</span>
    </div>

    <div class="card-list">
      <KanbanCard v-for="card in props.column.cards" :key="card.id" :card="card" :column-id="props.column.id"
        :can-move-left="!props.isFirst" :can-move-right="!props.isLast" />
      <p v-if="props.column.cards.length === 0" class="empty-state">No cards yet</p>
    </div>

    <div v-if="showForm" class="add-form">
      <input v-model="newCardTitle" class="add-input" placeholder="Card title..." autofocus @keyup.enter="submitCard"
        @keyup.esc="cancelAdd" />
      <div class="add-form-actions">
        <button class="btn-primary" @click="submitCard">Add</button>
        <button class="btn-secondary" @click="cancelAdd">Cancel</button>
      </div>
    </div>
    <button v-else class="btn-add-card" @click="showForm = true">+ Add card</button>
  </div>
</template>

<style scoped>
.column {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.column-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
  transition: color 0.2s ease;
}

.column-count {
  font-size: 0.75rem;
  background: var(--color-count-bg);
  color: var(--color-count-text);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-height: 2rem;
}

.empty-state {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
  transition: color 0.2s ease;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.add-input {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  outline: none;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.add-input:focus {
  border-color: var(--color-accent);
}

.add-form-actions {
  display: flex;
  gap: 0.4rem;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-accent-hover);
}

.btn-secondary {
  background: none;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-button-hover);
}

.btn-add-card {
  background: none;
  border: 1px dashed var(--color-border-light);
  border-radius: 6px;
  color: var(--color-text-secondary);
  padding: 0.35rem;
  width: 100%;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: center;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.btn-add-card:hover {
  background: var(--color-button-hover);
  color: var(--color-text-primary);
}
</style>
