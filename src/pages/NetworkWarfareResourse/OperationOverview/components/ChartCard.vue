<script setup>
import { ref, onMounted, onBeforeUnmount, shallowRef, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  chartType: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'pie'].includes(value)
  },
  chartData: {
    type: Object,
    default: () => ({})
  },
  colors: {
    type: Object,
    default: () => ({
      cyan: '#00f0ff',
      green: '#00ff9d',
      orange: '#ff9900',
      red: '#ff416c',
      textMuted: '#94a3b8'
    })
  }
})

const cardRef = ref(null)
const chartRef = ref(null)
const chart = shallowRef(null)

const handleMouseMove = (e) => {
  const card = cardRef.value
  if (!card) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}

const initLineChart = () => {
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value)
  chart.value.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5,8,16,0.9)',
      borderColor: props.colors.cyan,
      textStyle: { color: '#fff', fontSize: 16 }
    },
    legend: {
      data: props.chartData.legend || [],
      bottom: 0,
      textStyle: { color: props.colors.textMuted, fontSize: 16 },
      icon: 'circle'
    },
    grid: { left: '3%', right: '4%', top: '8%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.chartData.xAxis || [],
      axisLabel: { color: props.colors.textMuted, fontSize: 16 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: props.colors.textMuted, fontSize: 16 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: (props.chartData.series || []).map((item, index) => ({
      name: item.name,
      type: 'line',
      smooth: true,
      color: item.color || Object.values(props.colors)[index],
      data: item.data
    }))
  })
}

const initPieChart = () => {
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value)
  chart.value.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(5,8,16,0.9)',
      borderColor: 'rgba(255,255,255,0.2)',
      textStyle: { color: '#fff', fontSize: 16 }
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: props.colors.textMuted, fontSize: 14 },
      icon: 'circle',
      itemGap: 16
    },
    series: [{
      name: props.chartData.name || '占比分布',
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['30%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#02040a', borderWidth: 2 },
      label: { show: false },
      labelLine: { show: false },
      data: (props.chartData.data || []).map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: item.color || Object.values(props.colors)[index] }
      }))
    }]
  })
}

const initChart = () => {
  if (props.chartType === 'line') {
    initLineChart()
  } else if (props.chartType === 'pie') {
    initPieChart()
  }
}

const handleResize = () => {
  if (chart.value) {
    chart.value.resize()
  }
}

watch(() => props.chartData, () => {
  initChart()
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
  <div ref="cardRef" class="chart-card" @mousemove="handleMouseMove">
    <div class="title-wrap" style="margin-bottom: 16px;">
      <div class="section-dot"></div>
      <div class="card-title">{{ title }}</div>
    </div>
    <div ref="chartRef" class="main-chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.chart-card {
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
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.main-chart-container {
  width: 100%;
  height: 320px;
}
</style>