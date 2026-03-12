import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Column } from '@/types'

const STORAGE_KEY = 'kanban-board'

const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', cards: [] },
  { id: 'inprogress', title: 'In Progress', cards: [] },
  { id: 'done', title: 'Done', cards: [] },
]

function loadFromStorage(): Column[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Column[]
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(DEFAULT_COLUMNS))
}

export const useBoardStore = defineStore('board', () => {
  const columns = ref<Column[]>(loadFromStorage())

  watch(columns, (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true })

  function addCard(columnId: string, title: string) {
    const column = columns.value.find((c) => c.id === columnId)
    if (!column) return
    column.cards.push({ id: crypto.randomUUID(), title })
  }

  function deleteCard(columnId: string, cardId: string) {
    const column = columns.value.find((c) => c.id === columnId)
    if (!column) return
    column.cards = column.cards.filter((c) => c.id !== cardId)
  }

  function moveCard(fromColumnId: string, cardId: string, direction: 'left' | 'right') {
    const fromIndex = columns.value.findIndex((c) => c.id === fromColumnId)
    if (fromIndex === -1) return
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= columns.value.length) return

    const fromColumn = columns.value[fromIndex]
    const toColumn = columns.value[toIndex]
    const cardIndex = fromColumn.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    const [card] = fromColumn.cards.splice(cardIndex, 1)
    toColumn.cards.push(card)
  }

  return { columns, addCard, deleteCard, moveCard }
})
