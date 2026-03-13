<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores/board'

const router = useRouter()
const store = useBoardStore()

const plansData = [
  {
    name: 'Cheap',
    price: '0',
    description: 'Basic essentials for hobbyists.',
    features: [
      { text: 'Up to 6 Columns', available: true },
      { text: 'Up to 100 Tasks', available: true },
      { text: 'Light/Dark Mode', available: true },
      { text: 'Standard support', available: false },
      { text: 'Custom themes', available: false },
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '30',
    description: 'The standard for growing teams.',
    features: [
      { text: 'Up to 20 Columns', available: true },
      { text: 'Up to 500 Tasks', available: true },
      { text: 'Light/Dark Mode', available: true },
      { text: 'Priority support', available: true },
      { text: 'Custom themes', available: false },
    ],
    highlight: true,
  },
  {
    name: 'Max',
    price: '300',
    description: 'Advanced power for scaling businesses.',
    features: [
      { text: '100 Boards', available: true },
      { text: 'Unlimited tasks', available: true },
      { text: 'Light/Dark Mode', available: true },
      { text: '24/7 Priority support', available: true },
      { text: 'Custom themes', available: true },
    ],
    highlight: false,
  },
  {
    name: 'Pro Max',
    price: '3000',
    description: 'The ultimate enterprise experience.',
    features: [
      { text: 'Unlimited everything', available: true },
      { text: 'Light/Dark Mode', available: true },
      { text: 'Dedicated Account Manager', available: true },
      { text: 'On-premise deployment', available: true },
      { text: 'Custom development', available: true },
    ],
    highlight: false,
  },
]

const plans = computed(() => {
  return plansData.map(plan => ({
    ...plan,
    isCurrent: store.currentPlan === plan.name,
    buttonText: store.currentPlan === plan.name ? 'Current Plan' : (plan.name === 'Pro Max' ? 'Contact Sales' : `Upgrade to ${plan.name}`)
  }))
})

const handlePlanAction = (planName: string) => {
  if (planName === store.currentPlan) return
  window.location.href = 'https://rick.nerial.uk/video.mp4'
}
const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="payment-view">
    <header class="payment-header">
      <button class="btn-back" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Board
      </button>
      <div class="header-content">
        <h1>Choose Your Plan</h1>
        <p>Scaling productivity from personal to global enterprise.</p>
      </div>
    </header>

    <main class="plans-container">
      <div v-for="plan in plans" :key="plan.name" class="plan-card"
        :class="{ highlight: plan.highlight, current: plan.isCurrent }">
        <div v-if="plan.highlight" class="popular-badge">MOST POPULAR</div>
        <div v-if="plan.isCurrent" class="current-badge">CURRENT PLAN</div>
        <div class="plan-header">
          <h2 class="plan-name">{{ plan.name }}</h2>
          <div class="plan-price">
            <template v-if="plan.price === '0'">
              <span class="amount">Free</span>
            </template>
            <template v-else>
              <span class="currency">$</span>
              <span class="amount">{{ plan.price }}</span>
              <span class="period">/month</span>
            </template>
          </div>
          <p class="plan-description">{{ plan.description }}</p>
        </div>

        <ul class="features-list">
          <li v-for="feature in plan.features" :key="feature.text" :class="{ unavailable: !feature.available }">
            <svg v-if="feature.available" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <svg v-else class="x-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            {{ feature.text }}
          </li>
        </ul>

        <button class="btn-plan" :class="{ 'btn-primary': plan.highlight }" :disabled="plan.isCurrent"
          @click="handlePlanAction(plan.name)">
          {{ plan.buttonText }}
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.payment-view {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.payment-header {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 60px;
  position: relative;
}

.btn-back {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: var(--color-button-hover);
  color: var(--color-text-primary);
}

.header-content {
  text-align: center;
  margin-top: 40px;
}

.header-content h1 {
  font-size: 36px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.header-content p {
  font-size: 18px;
  color: var(--color-text-secondary);
}

.plans-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1300px;
  margin-bottom: 40px;
}

.plan-card {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.plan-card.highlight {
  border: 2px solid var(--color-accent);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.2);
  transform: scale(1.05);
  z-index: 1;
}

.plan-card.highlight:hover {
  transform: scale(1.05) translateY(-5px);
}

.popular-badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-accent);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.current-badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-slate-600);
  color: rgb(37, 37, 37);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.plan-card.current {
  border: 2px solid var(--color-slate-400);
  background-color: var(--color-bg-secondary);
}

.plan-card.current .btn-plan {
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-weight: 800;
  cursor: default;
  border: 2px dashed var(--color-border);
}

.plan-card.current .plan-name {
  color: var(--color-accent);
}

.plan-header {
  margin-bottom: 25px;
  text-align: center;
}

.plan-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--color-text-primary);
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 12px;
}

.currency {
  font-size: 20px;
  font-weight: 500;
  margin-right: 2px;
}

.amount {
  font-size: 40px;
  font-weight: 800;
  color: var(--color-text-primary);
}

.period {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-left: 2px;
}

.plan-description {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.features-list {
  list-style: none;
  margin-bottom: 30px;
  flex-grow: 1;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--color-text-primary);
}

.features-list li.unavailable {
  color: var(--color-text-secondary);
  opacity: 0.6;
  text-decoration: line-through;
}

.check-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.x-icon {
  color: var(--color-text-secondary);
  flex-shrink: 0;
  opacity: 0.5;
}

.btn-plan {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.btn-plan:hover:not(:disabled) {
  background-color: var(--color-button-hover);
}

.btn-plan.btn-primary {
  background-color: var(--color-accent);
  color: white;
  border: none;
}

.btn-plan.btn-primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

@media (max-width: 1024px) {
  .plans-container {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
  }

  .plan-card.highlight {
    transform: none;
  }

  .plan-card.highlight:hover {
    transform: translateY(-5px);
  }
}

@media (max-width: 640px) {
  .header-content h1 {
    font-size: 28px;
  }

  .plans-container {
    grid-template-columns: 1fr;
  }
}
</style>
