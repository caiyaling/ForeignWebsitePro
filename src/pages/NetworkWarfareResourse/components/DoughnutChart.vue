<script setup>
/**
 * @description 双环形图组件 - 根据 Figma 设计稿精确还原
 * 设计稿节点: 137:26280
 *
 * 图表设计说明：
 * - 双环形图，两个环显示相同的数据比例
 * - 橙色：已使用，蓝色：待分配
 * - 鼠标悬停时扇形会突出放大
 *
 * 精确位置数据 (来自 Figma 节点):
 * - Chart Container: 163px × 163px
 * - Doughnut 2 (外环): x=13, y=19, 137×137px
 * - Doughnut 1 (内环): x=0, y=6, 163×163px
 * @date 2024-04-09
 */
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  outerData: {
    type: Array,
    default: () => []
  },
  innerData: {
    type: Array,
    default: () => []
  },
  width: {
    type: [Number, String],
    default: 163
  },
  height: {
    type: [Number, String],
    default: 163
  }
})

const chartRef = ref(null)
let chartInstance = null

/**
 * 精确位置计算（容器 163×163）:
 *
 * 外环 (Doughnut 2): x=13, y=19, 137×137
 * - 中心 Y: 19 + 137/2 = 87.5 → 87.5/163 = 53.7%
 * - 外半径: 137/2 = 68.5px → 42%
 * - 环宽度: 约 15px → 内半径约 33%
 *
 * 内环 (Doughnut 1): x=0, y=6, 163×163
 * - 中心 Y: 6 + 163/2 = 87.5 → 87.5/163 = 53.7%
 * - 外半径: 81.5px → 50%
 * - 环宽度: 约 17px → 内半径约 39%
 */
const chartOption = computed(() => {
  // 计算数据总和
  const outerTotal = props.outerData.reduce((sum, item) => sum + item.value, 0)
  const innerTotal = props.innerData.reduce((sum, item) => sum + item.value, 0)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const total = params.seriesIndex === 0 ? innerTotal : outerTotal
        const percent = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0
        return `${params.name}<br/>${params.value} (${percent}%)`
      },
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      padding: [8, 12]
    },
    series: [
      // 内环 (Doughnut 1) - 较大
      {
        type: 'pie',
        radius: ['39%', '50%'],
        center: ['50%', '53.7%'],
        startAngle: 90,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: props.innerData.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        })),
        emphasis: {
          scale: true,
          scaleSize: 12,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        silent: false,
        z: 1
      },
      // 外环 (Doughnut 2) - 较小
      {
        type: 'pie',
        radius: ['33%', '42%'],
        center: ['50%', '53.7%'],
        startAngle: 90,
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: props.outerData.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        })),
        emphasis: {
          scale: true,
          scaleSize: 12,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        silent: false,
        z: 2
      }
    ]
  }
})

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(chartOption.value)
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(chartOption.value)
  }
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(
  () => [props.outerData, props.innerData],
  () => { updateChart() },
  { deep: true }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    ref="chartRef"
    class="doughnut-chart"
    :style="{ width: `${width}px`, height: `${height}px` }"
  ></div>
</template>

<style lang="scss" scoped>
.doughnut-chart {
  flex-shrink: 0;
}
</style>
