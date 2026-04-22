<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: {
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
  <div class="engagement-4-grid">
    <div
      v-for="(item, index) in data"
      :key="index"
      :ref="el => cardRefs[index] = el"
      class="engagement-card"
      @mousemove="handleMouseMove($event, index)"
    >
      <div class="sub-label" style="color: var(--text-muted, #94a3b8); margin-bottom: 12px;">{{ item.label }}</div>
      <div class="stat-num">{{ formatNumber(item.total) }}</div>
      <div class="progress-row">
        <div class="progress-track">
          <div class="progress-fill bg-cyan" :style="{ width: item.progress + '%' }"></div>
        </div>
        <div class="progress-text">
          <span class="sub-label">近2周</span>
          <span class="text-cyan">+{{ item.recentAdd }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.engagement-4-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.engagement-card {
  --mouse-x: -1000px;
  --mouse-y: -1000px;
  border: 1px solid rgba(67, 236, 255, 0.3);
  border-radius: 8px;
  background: radial-gradient(54.42% 32.41% at 52.05% 0%, rgba(0, 255, 246, 0.15) 0%, rgba(0, 225, 255, 0.00) 100%), linear-gradient(348deg, rgba(0, 27, 64, 0.40) 7.31%, rgba(0, 187, 255, 0.10) 90.95%);
  box-shadow: 0 4px 20px 20px rgba(0, 11, 37, 0.02);
  padding: 20px 24px;
  position: relative;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  justify-content: space-between;
  gap: 16px;

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

  .sub-label {
    color: #94a3b8;
    font-size: 16px;
  }

  .stat-num {
    font-size: 32px;
    font-weight: bold;
    font-family: 'Segoe UI', sans-serif;
    color: #00EAFF;
    margin: 8px 0;
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
  }

  .progress-track {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 3px;
  }

  .bg-cyan {
    background: #00f0ff;
    box-shadow: 0 0 8px #00f0ff;
  }

  .progress-text {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: bold;
    white-space: nowrap;
    font-size: 16px;
  }

  .text-cyan {
    color: #00f0ff;
  }
}
</style>