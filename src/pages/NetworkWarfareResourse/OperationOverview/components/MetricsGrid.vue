<script setup>
import { ref } from 'vue'

const props = defineProps({
  metrics: {
    type: Array,
    default: () => []
  }
})

const cardRefs = ref([])

const formatNumber = (num) => {
  return Number(num).toLocaleString('en-US')
}

const handleMouseMove = (e, index) => {
  const card = cardRefs.value[index]
  if (!card) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}
</script>

<template>
  <div class="metrics-5-grid">
    <div
      v-for="(metric, index) in metrics"
      :key="index"
      :ref="el => cardRefs[index] = el"
      class="metric-mini-card"
      @mousemove="handleMouseMove($event, index)"
    >
      <div class="card-title">
        {{ metric.label }}
        <span class="title-muted">（历史总额）</span>
      </div>
      <div class="stat-num">{{ formatNumber(metric.total) }}</div>
      <div class="metric-footer">
        <span class="sub-label">近2周</span>
        <span class="text-yellow">+{{ metric.recentAdd }}</span>
        <span class="sub-label">{{ metric.unit }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.metrics-5-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-mini-card {
  --mouse-x: -1000px;
  --mouse-y: -1000px;
  border: 1px solid rgba(67, 236, 255, 0.3);
  border-radius: 8px;
  background: radial-gradient(54.42% 32.41% at 52.05% 0%, rgba(0, 255, 246, 0.15) 0%, rgba(0, 225, 255, 0.00) 100%), linear-gradient(348deg, rgba(0, 27, 64, 0.40) 7.31%, rgba(0, 187, 255, 0.10) 90.95%);
  box-shadow: 0 4px 20px 20px rgba(0, 11, 37, 0.02);
  padding: 16px 14px;
  position: relative;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  gap: 8px;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(0, 240, 255, 0.2), transparent 50%);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(67, 236, 255, 0.8);
    box-shadow: 0 0 30px rgba(67, 236, 255, 0.25);
  }

  .card-title {
    font-size: 16px;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 8px;
    display: flex;
    align-items: baseline;
    gap: 4px;
    white-space: nowrap;
  }

  .title-muted {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
    font-weight: normal;
  }

  .stat-num {
    margin: 4px 0 12px 0;
    display: block;
    font-size: 32px;
    font-weight: bold;
    font-family: 'Segoe UI', sans-serif;
    color: #00EAFF;
  }

  .metric-footer {
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sub-label {
    color: #94a3b8;
    font-size: 16px;
  }

  .text-yellow {
    color: #ffd700;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  }
}
</style>