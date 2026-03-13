<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useBoardStore } from '@/stores/board'
import { useRouter } from 'vue-router'
import KanbanCard from './KanbanCard.vue'
import ModalDialog from './ModalDialog.vue'
import draggable from 'vuedraggable'
import type { Column } from '@/types'

const props = defineProps<{
  column: Column
  isFirst: boolean
  isLast: boolean
}>()

const store = useBoardStore()
const router = useRouter()

const cards = computed({
  get: () => props.column.cards,
  set: (val) => {
    store.updateColumnCards(props.column.id, val)
  },
})

const newCardTitle = ref('')
const showForm = ref(false)
const isRenamingColumn = ref(false)
const newColumnTitle = ref(props.column.title)
const renameInput = ref<HTMLInputElement | null>(null)
const addInputRef = ref<HTMLInputElement | null>(null)
const showMenu = ref(false)

const showLimitModal = ref(false)
const limitModalTitle = ref('')
const limitModalMessage = ref('')

function goToUpgrade() {
  router.push('/payment')
}

const modalConfig = ref<{
  show: boolean
  type: 'confirm' | 'prompt'
  inputType?: 'text' | 'number'
  title: string
  message: string
  initialValue: string
  confirmText: string
  danger: boolean
  presets?: { label: string; value: string }[]
  onConfirm: (val?: string) => void
}>({
  show: false,
  type: 'confirm',
  inputType: 'text',
  title: '',
  message: '',
  initialValue: '',
  confirmText: 'OK',
  danger: false,
  presets: [],
  onConfirm: () => {}
})

function openConfirmModal(title: string, message: string, onConfirm: () => void, danger = false) {
  modalConfig.value = {
    show: true,
    type: 'confirm',
    inputType: 'text',
    title,
    message,
    initialValue: '',
    confirmText: danger ? 'Delete' : 'Yes',
    danger,
    presets: [],
    onConfirm
  }
  closeMenu()
}

function openPromptModal(title: string, message: string, initialValue: string, onConfirm: (val?: string) => void, inputType: 'text' | 'number' = 'text', presets?: { label: string; value: string }[]) {
  modalConfig.value = {
    show: true,
    type: 'prompt',
    inputType,
    title,
    message,
    initialValue,
    confirmText: 'Save',
    danger: false,
    presets,
    onConfirm
  }
  closeMenu()
}

function handleModalConfirm(value?: string) {
  modalConfig.value.onConfirm(value)
  modalConfig.value.show = false
}

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}

function clearColumn() {
  openConfirmModal(
    'Clear Column',
    `Clear all cards from "${props.column.title}"?`,
    () => {
      store.clearColumn(props.column.id)
    },
    true
  )
}

function setLimit() {
  const currentLimit = props.column.maxCards || ''
  openPromptModal(
    'Set limit',
    `Set max number of tiles for "${props.column.title}" (leave empty for no limit):`,
    currentLimit.toString(),
    (input) => {
      if (input !== undefined) {
        let limit = input === '' ? undefined : parseInt(input, 10)
        if (limit !== undefined && !isNaN(limit)) {
          limit = Math.max(0, limit)
          store.setColumnLimit(props.column.id, limit)
        } else if (limit === undefined) {
          store.setColumnLimit(props.column.id, limit)
        }
      }
    },
    'number',
    [
      { label: '3', value: '3' },
      { label: '5', value: '5' },
      { label: '10', value: '10' },
      { label: 'No Limit', value: '' }
    ]
  )
}

const handleClickOutside = (event: MouseEvent) => {
  const menu = document.querySelector(`.column-${props.column.id} .menu-dropdown`)
  const button = document.querySelector(`.column-${props.column.id} .btn-column-menu`)
  if (
    menu &&
    !menu.contains(event.target as Node) &&
    button &&
    !button.contains(event.target as Node)
  ) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function openAddCard() {
  showForm.value = true
  nextTick(() => {
    addInputRef.value?.focus()
    addInputRef.value?.select()
  })
}

function submitCard() {
  const title = newCardTitle.value.trim()
  if (!title) return
  const success = store.addCard(props.column.id, title)
  if (!success) {
    const planLimits = store.limits[store.currentPlan as keyof typeof store.limits] || store.limits.Cheap
    limitModalTitle.value = 'Task Limit Reached'
    limitModalMessage.value = `You've reached the limit of ${planLimits.cards} tasks for the ${store.currentPlan} plan. Upgrade to add more tasks!`
    showLimitModal.value = true
  } else {
    newCardTitle.value = ''
    nextTick(() => {
      addInputRef.value?.focus()
    })
  }
}

function cancelAdd() {
  newCardTitle.value = ''
  showForm.value = false
}

function startRenameColumn() {
  isRenamingColumn.value = true
  newColumnTitle.value = props.column.title
  nextTick(() => {
    renameInput.value?.focus()
    renameInput.value?.select()
  })
}

function submitRenameColumn() {
  if (isRenamingColumn.value) {
    const title = newColumnTitle.value.trim()
    if (title) {
      store.renameColumn(props.column.id, title)
    }
    isRenamingColumn.value = false
  }
}

function cancelRenameColumn() {
  isRenamingColumn.value = false
}

function deleteColumn() {
  openConfirmModal(
    'Delete Column',
    `Delete column "${props.column.title}"? This cannot be undone.`,
    () => {
      store.deleteColumn(props.column.id)
    },
    true
  )
}

const dragOptions = {
  forceFallback: true,
  fallbackOnBody: true,
  fallbackClass: 'fallback-card',
  setData: (dataTransfer: DataTransfer) => {
    const img = new window.Image()
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    dataTransfer.setDragImage(img, 0, 0)
  },
}
</script>

<template>
  <div
    class="column"
    :class="[
      `column-${props.column.id}`,
      {
        'limit-exceeded':
          props.column.maxCards && props.column.cards.length > props.column.maxCards,
      },
    ]"
  >
    <div class="column-header">
      <div v-if="isRenamingColumn" class="column-rename">
        <input
          ref="renameInput"
          v-model="newColumnTitle"
          class="rename-input"
          @blur="submitRenameColumn"
          @keyup.enter="submitRenameColumn"
          @keyup.esc="cancelRenameColumn"
          maxlength="30"
        />
      </div>
      <div v-else class="column-title-group">
        <h2 class="column-title" @click="startRenameColumn">{{ props.column.title }}</h2>
        <span class="column-count">
          {{ props.column.cards.length
          }}{{ props.column.maxCards ? ` / ${props.column.maxCards}` : '' }}
        </span>
        <div class="column-actions">
          <button
            class="btn-icon"
            :disabled="props.isFirst"
            title="Move left"
            @click="store.moveColumn(props.column.id, 'left')"
          >
            ←
          </button>
          <button
            class="btn-icon"
            :disabled="props.isLast"
            title="Move right"
            @click="store.moveColumn(props.column.id, 'right')"
          >
            →
          </button>
        </div>
        <div class="column-menu-container">
          <button class="btn-column-menu" title="Column menu" @click="toggleMenu">⋮</button>
          <div v-if="showMenu" class="menu-dropdown">
            <button class="menu-item" @click="setLimit">Set limit...</button>
            <button class="menu-item" @click="clearColumn">Clear Column</button>
            <button class="menu-item delete-item" @click="deleteColumn">Delete Column</button>
          </div>
        </div>
      </div>
    </div>

    <draggable
      v-model="cards"
      group="tasks"
      item-key="id"
      class="card-list"
      ghost-class="ghost-card"
      drag-class="drag-card"
      :animation="200"
      v-bind="dragOptions"
    >
      <template #item="{ element }">
        <KanbanCard :key="element.id" :card="element" :column-id="props.column.id" />
      </template>
      <template #footer>
        <p v-if="props.column.cards.length === 0 && !showForm" class="empty-state">No cards yet</p>
      </template>
    </draggable>

    <div v-if="showForm" class="add-form">
      <input
        ref="addInputRef"
        v-model="newCardTitle"
        class="add-input"
        placeholder="Card title..."
        autofocus
        @keyup.enter="submitCard"
        @keyup.esc="cancelAdd"
        maxlength="200"
      />
      <div class="add-form-actions">
        <button class="btn-primary" @click="submitCard">Add</button>
        <button class="btn-secondary" @click="cancelAdd">Cancel</button>
      </div>
    </div>
    <button v-else class="btn-add-card" @click="openAddCard">+ Add card</button>

    <ModalDialog
      v-model:show="showLimitModal"
      :title="limitModalTitle"
      :message="limitModalMessage"
      confirm-text="Upgrade Now"
      cancel-text="Maybe Later"
      @confirm="goToUpgrade"
    />

    <ModalDialog
      v-model:show="modalConfig.show"
      :type="modalConfig.type"
      :input-type="modalConfig.inputType"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :initial-value="modalConfig.initialValue"
      :confirm-text="modalConfig.confirmText"
      :danger="modalConfig.danger"
      :presets="modalConfig.presets"
      @confirm="handleModalConfirm"
    />
  </div>
</template>

<style scoped>
.column {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  position: relative;
  max-height: 100%;
}

.limit-exceeded {
  background-color: var(--color-delete-bg);
  border-color: var(--color-delete);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  flex-shrink: 0;
}

.column-title-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
}

.column-menu-container {
  position: relative;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 0.4rem;
  z-index: 100;
  min-width: 140px;
}

.menu-item {
  background: none;
  border: none;
  padding: 0.4rem 0.8rem;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 0.85rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
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

.column-rename {
  display: flex;
  gap: 0.3rem;
  width: 100%;
}

.rename-input {
  flex: 1;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  font-size: 0.95rem;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  outline: none;
}

.column-actions {
  display: flex;
  gap: 0.1rem;
  margin-left: auto;
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

.column-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
  transition: color 0.2s ease;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.column-title:hover {
  background: var(--color-button-hover);
}

.column-count {
  font-size: 0.75rem;
  background: var(--color-count-bg);
  color: var(--color-count-text);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  white-space: nowrap;
}

.btn-column-menu {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-text-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-column-menu:hover {
  background: var(--color-delete-bg);
  color: var(--color-delete);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  flex: 1;
}

/* Custom scrollbar for card list */
.card-list::-webkit-scrollbar {
  width: 4px;
}

.card-list::-webkit-scrollbar-track {
  background: transparent;
}

.card-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

.card-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

.card-list:has(.ghost-card) .empty-state {
  display: none;
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
  flex-shrink: 0;
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
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
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
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
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
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
  flex-shrink: 0;
}

.btn-add-card:hover {
  background: var(--color-button-hover);
  color: var(--color-text-primary);
}

.ghost-card {
  opacity: 0.5;
  background: var(--color-bg-secondary);
}

.drag-card {
  opacity: 0;
}

.fallback-card {
  opacity: 1 !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: rotate(2deg);
  cursor: grabbing !important;
  z-index: 1000;
  pointer-events: none !important;
}
</style>
