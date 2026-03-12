<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
  title: string
  message?: string
  type?: 'confirm' | 'prompt'
  inputType?: 'text' | 'number'
  initialValue?: string
  placeholder?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  presets?: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  (e: 'confirm', value?: string): void
  (e: 'cancel'): void
  (e: 'update:show', value: boolean): void
}>()

const inputValue = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.show, (newVal) => {
  if (newVal && props.type === 'prompt') {
    inputValue.value = props.initialValue || ''
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }
})

function handleConfirm() {
  emit('confirm', props.type === 'prompt' ? String(inputValue.value) : undefined)
  emit('update:show', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:show', false)
}

function handleKeydown(e: KeyboardEvent) {
  if (props.show && e.key === 'Escape') {
    handleCancel()
  }
}

function applyPreset(val: string) {
  inputValue.value = val
  inputRef.value?.focus()
}

function increment() {
  let val = parseInt(String(inputValue.value), 10)
  if (isNaN(val)) val = 0
  inputValue.value = String(val + 1)
}

function decrement() {
  let val = parseInt(String(inputValue.value), 10)
  if (isNaN(val)) val = 0
  if (val > 0) {
    inputValue.value = String(val - 1)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <h3 class="modal-title">{{ title }}</h3>
      <p v-if="message" class="modal-message">{{ message }}</p>
      
      <template v-if="type === 'prompt'">
        <div class="input-wrapper" :class="{ 'has-stepper': inputType === 'number' }">
          <input
            ref="inputRef"
            :type="inputType || 'text'"
            :min="inputType === 'number' ? '0' : undefined"
            v-model="inputValue"
            class="modal-input"
            :placeholder="placeholder"
            @keyup.enter="handleConfirm"
            @keyup.esc="handleCancel"
          />
          <div v-if="inputType === 'number'" class="stepper-controls">
            <button type="button" class="stepper-btn up" @click="increment" aria-label="Increase">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </button>
            <button type="button" class="stepper-btn down" @click="decrement" aria-label="Decrease">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
        </div>
        <div v-if="presets && presets.length" class="modal-presets">
          <button
            v-for="(preset, i) in presets"
            :key="i"
            class="preset-chip"
            @click="applyPreset(preset.value)"
          >
            {{ preset.label }}
          </button>
        </div>
      </template>
      
      <div class="modal-actions">
        <button class="btn-secondary" @click="handleCancel">{{ cancelText || 'Cancel' }}</button>
        <button 
          :class="['btn-primary', { 'btn-danger': danger }]" 
          @click="handleConfirm"
        >
          {{ confirmText || 'OK' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-message {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
}

.modal-input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

/* Hide default number arrows */
.has-stepper .modal-input::-webkit-outer-spin-button,
.has-stepper .modal-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.has-stepper .modal-input[type=number] {
  -moz-appearance: textfield;
  padding-right: 2.5rem; /* Make room for custom arrows */
}

.stepper-controls {
  position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px;
  display: flex;
  flex-direction: column;
  width: 2rem;
  border-left: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
}

.stepper-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.stepper-btn:hover {
  background-color: var(--color-button-hover);
  color: var(--color-text-primary);
}

.stepper-btn:active {
  background-color: var(--color-border);
}

.stepper-btn svg {
  width: 14px;
  height: 14px;
}

.stepper-btn.up {
  border-bottom: 1px solid var(--color-border);
}

.modal-input:focus {
  border-color: var(--color-accent);
}

.modal-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: -0.25rem;
}

.preset-chip {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 0.2rem 0.6rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-chip:hover {
  background: var(--color-button-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border-light);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.btn-primary {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-accent-hover, var(--color-accent));
  opacity: 0.9;
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
}

.btn-danger:hover {
  background: #dc2626;
  opacity: 1;
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-bg-secondary);
}
</style>