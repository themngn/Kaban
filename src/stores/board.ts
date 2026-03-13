import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Column, Card } from '@/types'

// Board store: central state for columns, cards and plan limits
// Persists to `localStorage` under `STORAGE_KEY`
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
  const boardName = ref(localStorage.getItem('kanban-board-name') || '🐗 Kaban Board')
  const currentPlan = ref(localStorage.getItem('kanban-plan') || 'Cheap')

  watch(columns, (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true })
  watch(boardName, (val) => localStorage.setItem('kanban-board-name', val))
  watch(currentPlan, (val) => localStorage.setItem('kanban-plan', val))

  function setBoardName(name: string) {
    boardName.value = name.trim() || '🐗 Kaban Board'
  }

  function switchPlan(plan: string) {
    currentPlan.value = plan
  }

  const limits = {
    Cheap: { columns: 6, cards: 100 },
    Pro: { columns: 20, cards: 500 },
    Max: { columns: 100, cards: 1000000 },
    'Pro Max': { columns: 1000, cards: 1000000 },
  }

  function addCard(columnId: string, title: string) {
    // Respect plan-level total card limits
    const planLimits = limits[currentPlan.value as keyof typeof limits] || limits.Cheap
    const totalCards = columns.value.reduce((acc, col) => acc + col.cards.length, 0)

    if (totalCards >= planLimits.cards) {
      return false
    }

    const column = columns.value.find((c) => c.id === columnId)
    if (!column) return false
    column.cards.push({ id: crypto.randomUUID(), title })
    return true
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
    if (!fromColumn || !toColumn) return
    const cardIndex = fromColumn.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    const [card] = fromColumn.cards.splice(cardIndex, 1) as [(typeof fromColumn.cards)[number]]
    toColumn.cards.push(card)
  }

  function moveColumn(columnId: string, direction: 'left' | 'right') {
    const index = columns.value.findIndex((c) => c.id === columnId)
    if (index === -1) return
    const toIndex = direction === 'left' ? index - 1 : index + 1
    if (toIndex < 0 || toIndex >= columns.value.length) return

    const [column] = columns.value.splice(index, 1)
    if (column) {
      columns.value.splice(toIndex, 0, column)
    }
  }

  function addColumn(title: string) {
    // Add a new column if plan allows it
    const planLimits = limits[currentPlan.value as keyof typeof limits] || limits.Cheap
    if (columns.value.length >= planLimits.columns) {
      return false
    }

    const newColumn: Column = {
      id: crypto.randomUUID(),
      title,
      cards: [],
    }
    columns.value.push(newColumn)
    return true
  }

  function renameColumn(columnId: string, newTitle: string) {
    const column = columns.value.find((c) => c.id === columnId)
    if (column) {
      column.title = newTitle.trim()
    }
  }

  function deleteColumn(columnId: string) {
    columns.value = columns.value.filter((c) => c.id !== columnId)
  }

  function clearBoard() {
    columns.value.forEach((c) => (c.cards = []))
  }

  function clearColumn(columnId: string) {
    const column = columns.value.find((c) => c.id === columnId)
    if (column) {
      column.cards = []
    }
  }

  function deleteBoard() {
    columns.value = JSON.parse(JSON.stringify(DEFAULT_COLUMNS))
    boardName.value = '🐗 Kaban Board'
  }

  function setColumnLimit(columnId: string, limit?: number) {
    // Set per-column card limit (or unset if undefined)
    const column = columns.value.find((c) => c.id === columnId)
    if (column) {
      column.maxCards = limit
    }
  }

  function updateColumnCards(columnId: string, newCards: Card[]) {
    // Replace the cards array for a column (used by drag/drop)
    const column = columns.value.find((c) => c.id === columnId)
    if (column) {
      column.cards = newCards
    }
  }

  return {
    columns,
    boardName,
    currentPlan,
    limits,
    setBoardName,
    switchPlan,
    addCard,
    deleteCard,
    moveCard,
    moveColumn,
    addColumn,
    renameColumn,
    deleteColumn,
    clearBoard,
    clearColumn,
    deleteBoard,
    setColumnLimit,
    updateColumnCards,
  }
})
