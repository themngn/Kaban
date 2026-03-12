<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import type { Card } from '@/types'

const props = defineProps<{
  card: Card
  columnId: string
  canMoveLeft: boolean
  canMoveRight: boolean
}>()

const store = useBoardStore()
</script>

<template>
  <div class="card">
    <span class="card-title">{{ props.card.title }}</span>
    <div class="card-actions">
      <button class="btn-icon" :disabled="!props.canMoveLeft" title="Move left"
        @click="store.moveCard(props.columnId, props.card.id, 'left')">
        ←
      </button>
      <button class="btn-icon" :disabled="!props.canMoveRight" title="Move right"
        @click="store.moveCard(props.columnId, props.card.id, 'right')">
        →
      </button>
      <button class="btn-icon btn-delete" title="Delete card" @click="store.deleteCard(props.columnId, props.card.id)">
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
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
}

.card-title {
  flex: 1;
  font-size: 0.9rem;
  word-break: break-word;
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
  color: #64748b;
  line-height: 1;
}

.btn-icon:hover:not(:disabled) {
  background: #f1f5f9;
  color: #334155;
}

.btn-icon:disabled {
  opacity: 0.25;
  cursor: default;
}

.btn-delete:hover:not(:disabled) {
  background: #fee2e2;
  color: #dc2626;
}
</style>
