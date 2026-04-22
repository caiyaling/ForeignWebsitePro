<script setup>
import { ref, onMounted, onBeforeUnmount, shallowRef, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  weeklyNew: {
    type: Number,
    default: 0
  },
  weeklyGrowthRate: {
    type: Number,
    default: 0
  },
  trendData: {
    type: Array,
    default: () => []
  }
})

const cardRef = ref(null)
const chartRef = ref(null)
const chart = shallowRef(null)

const formatNumber = (num) => {
  return Number(num).toLocaleString('en-US')
}

const handleMouseMove = (e) => {
  const card = cardRef.value
  if (!card) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}

const initChart = () => {
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value)
  chart.value.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5,8,16,0.9)',
      borderColor: '#00f0ff',
      textStyle: { color: '#fff', fontSize: 16 },
      formatter: '{b}<br/>{marker} 新增粉丝: <span style="color:#00f0ff;font-weight:bold;">{c}</span>',
      confine: true
    },
    grid: { left: 0, right: 0, top: 10, bottom: -1 },
    xAxis: { type: 'category', boundaryGap: false, data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], show: false },
    yAxis: { type: 'value', show: false, min: 0, max: 200 },
    series: [{
      name: '新增粉丝',
      data: props.trendData,
      type: 'line',
      smooth: 0.5,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#00f0ff' },
      lineStyle: { color: '#00ff9d', width: 3, shadowColor: 'rgba(0, 255, 157, 0.5)', shadowBlur: 10, shadowOffsetY: 4 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 255, 157, 0.4)' },
          { offset: 1, color: 'rgba(0, 255, 157, 0)' }
        ])
      }
    }]
  })
}

const handleResize = () => {
  if (chart.value) {
    chart.value.resize()
  }
}

watch(() => props.trendData, () => {
  if (chart.value) {
    chart.value.setOption({
      series: [{ data: props.trendData }]
    })
  }
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart.value) {
    chart.value.dispose()
  }
})
</script>

<template>
  <div ref="cardRef" class="fan-card" @mousemove="handleMouseMove">
    <div class="fan-top-section">
      <div class="title-wrap">
        <div class="section-dot"></div>
        <div class="card-title">粉丝概况</div>
      </div>
      <div class="sub-label" style="margin-top: 16px;">当前粉丝总数</div>
      <div class="stat-num text-yellow" style="font-size: 38px; margin: 8px 0;">{{ formatNumber(total) }}</div>
    </div>

    <div class="fan-inner-box">
      <div class="fan-inner-header">
        <span>本周新增粉丝</span>
        <span class="percent">{{ weeklyGrowthRate }}%</span>
      </div>
      <div class="fan-inner-content">
        <div class="stat-num text-cyan">+{{ formatNumber(weeklyNew) }}</div>
      </div>
      <div ref="chartRef" class="mini-chart-container"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fan-card {
  --mouse-x: -1000px;
  --mouse-y: -1000px;
  border: 1px solid rgba(67, 236, 255, 0.3);
  border-radius: 8px;
  background: radial-gradient(54.42% 32.41% at 52.05% 0%, rgba(0, 255, 246, 0.15) 0%, rgba(0, 225, 255, 0.00) 100%), linear-gradient(348deg, rgba(0, 27, 64, 0.40) 7.31%, rgba(0, 187, 255, 0.10) 90.95%);
  box-shadow: 0 4px 20px 20px rgba(0, 11, 37, 0.02);
  padding: 24px;
  position: relative;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

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
}

.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00f0ff;
  box-shadow: 0 0 6px #00f0ff;
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

.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
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

.text-cyan {
  color: #00f0ff;
}

.text-yellow {
  color: #ffd700;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

.fan-top-section {
  display: flex;
  flex-direction: column;
}

.fan-inner-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  padding: 14px;
}

.fan-inner-header {
  background: rgba(0, 150, 255, 0.15);
  border-radius: 6px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  z-index: 2;

  .percent {
    color: #00f0ff;
    font-weight: bold;
    font-size: 18px;
  }
}

.fan-inner-content {
  padding: 20px 8px 0 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  z-index: 2;
  pointer-events: none;

  .stat-num {
    margin: 0;
    font-size: 32px;
  }
}

.mini-chart-container {
  position: absolute;
  bottom: 110px;
  left: 0;
  width: 100%;
  height: 130px;
  z-index: 1;
}
</style>