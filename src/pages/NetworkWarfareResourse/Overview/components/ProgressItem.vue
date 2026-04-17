<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  percent: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['mousemove'])

const handleMouseMove = (e) => {
  emit('mousemove', e)
}
</script>

<template>
  <div class="progress-container" @mousemove="handleMouseMove">
    <div class="list-item">
      <span class="item-name"><span class="dot"></span>{{ name }}</span>
      <span class="item-val">{{ value }}</span>
    </div>
    <div class="progress-bg">
      <div class="progress-bar" :style="{ width: percent + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  margin-bottom: 10px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 14px;
  color: #fff;
}

.item-name {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.6;
  font-weight: normal;
  transition: opacity 0.2s;
}

.list-item:hover .item-name {
  opacity: 0.9;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #00f0ff;
  box-shadow: 0 0 4px #00f0ff;
  animation: breathing-glow 2.5s infinite ease-in-out;
}

@keyframes breathing-glow {
  0%, 100% {
    box-shadow: 0 0 4px #00f0ff;
    background-color: #00f0ff;
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 10px #00f0ff, 0 0 15px rgba(0, 240, 255, 0.6);
    background-color: #80fcff;
    opacity: 1;
    transform: scale(1.3);
  }
}

.item-val {
  font-weight: bold;
  font-family: 'Segoe UI', sans-serif;
  opacity: 1;
  color: #fff;
}

.progress-bg {
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.6) 0%, rgba(0, 240, 255, 1) 100%);
  position: relative;
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}
</style>