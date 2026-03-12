<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import type { Card } from '@/types'

const props = defineProps<{
  card: Card
  columnId: string
}>()

const store = useBoardStore()
</script>

<template>
  <div class="card">
    <span class="card-title">{{ props.card.title }}</span>
    <div class="card-actions">
      <button
        class="btn-icon btn-delete"
        title="Delete card"
        @click="store.deleteCard(props.columnId, props.card.id)"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  user-select: none;
  cursor: grab;
}

.card:active {
  cursor: grabbing;
}

.card-title {
  flex: 1;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
  transition: color 0.2s ease;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-icon:hover:not(:disabled) {
  background: var(--color-button-hover);
  color: var(--color-text-primary);
}

.btn-icon:disabled {
  opacity: 0.25;
  cursor: default;
}

.btn-delete:hover:not(:disabled) {
  background: var(--color-delete-bg);
  color: var(--color-delete);
}
</style>
