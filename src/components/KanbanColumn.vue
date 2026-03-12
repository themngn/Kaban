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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
}

.column-count {
  font-size: 0.75rem;
  background: #e2e8f0;
  color: #475569;
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-height: 2rem;
}

.empty-state {
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.add-input {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  outline: none;
}

.add-input:focus {
  border-color: #6366f1;
}

.add-form-actions {
  display: flex;
  gap: 0.4rem;
}

.btn-primary {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-primary:hover {
  background: #4f46e5;
}

.btn-secondary {
  background: none;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-add-card {
  background: none;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  color: #64748b;
  padding: 0.35rem;
  width: 100%;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: center;
}

.btn-add-card:hover {
  background: #f1f5f9;
  color: #334155;
}
</style>
