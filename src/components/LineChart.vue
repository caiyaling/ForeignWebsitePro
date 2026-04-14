<script setup>
/**
 * @description 通用折线图组件
 * @author Claude
 * @date 2026-04-08
 */
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 图表数据
  chartData: {
    type: Object,
    required: true,
    // { xAxis: [], series: [{ name, data, color }] }
  },
  // 单位
  unit: {
    type: String,
    default: ''
  },
  // Y 轴格式化函数
  yAxisFormatter: {
    type: Function,
    default: null
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 图例位置：top-left, top-right, bottom
  legendPosition: {
    type: String,
    default: 'top-right'
  },
  // 是否显示网格线
  showGrid: {
    type: Boolean,
    default: true
  },
  // 图表高度
  height: {
    type: String,
    default: '300px'
  },
  // 是否平滑曲线
  smooth: {
    type: Boolean,
    default: false
  },
  // 线条宽度
  lineWidth: {
    type: Number,
    default: 2
  },
  // 是否显示 Y 轴单位名称
  showYAxisName: {
    type: Boolean,
    default: true
  },
  // Y 轴最大值
  yAxisMax: {
    type: Number,
    default: null
  },
  // Y 轴分割段数
  yAxisSplitNumber: {
    type: Number,
    default: 5
  }
})

const chartRef = ref(null)
let chartInstance = null

// 获取图例配置
const getLegendConfig = (series) => {
  const positions = {
    'top-left': { left: 'left', top: 'top' },
    'top-right': { right: 'right', top: 'top' },
    'bottom': { left: 'center', bottom: 'bottom' }
  }
  return {
    show: props.showLegend,
    ...positions[props.legendPosition],
    itemWidth: 8,
    itemHeight: 3,
    itemGap: 16,
    textStyle: {
      color: '#4E5969',
      fontSize: 12,
      fontFamily: 'Inter, Microsoft YaHei, sans-serif'
    },
    icon: 'rect',
    // 即使不显示图例，也需要配置 data 以支持 legendToggleSelect
    data: series ? series.map(s => s.name) : []
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) {
    console.log('LineChart: chartRef 不存在')
    return
  }

  const { xAxis, series } = props.chartData
  console.log('LineChart initChart - 数据:', { xAxis, series })

  // 如果没有数据，不初始化图表
  if (!xAxis?.length || !series?.length) {
    console.log('LineChart: 数据为空，跳过初始化')
    return
  }

  chartInstance = echarts.init(chartRef.value)
  console.log('LineChart: ECharts 实例创建成功')

  // 系列配置
  const seriesConfig = series.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data,
    smooth: props.smooth,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: props.lineWidth,
      color: item.color
    },
    itemStyle: {
      color: item.color
    },
    emphasis: {
      focus: 'series',
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff',
        shadowBlur: 4,
        shadowColor: 'rgba(0, 0, 0, 0.2)'
      }
    }
  }))

  // 格式化数值显示
  const formatValue = (value) => {
    if (value === 0) return '0'
    if (Math.abs(value) >= 10000) {
      return (value / 10000).toFixed(2) + 'w'
    }
    return value.toFixed(2)
  }

  // Y 轴配置
  const yAxisConfig = {
    type: 'value',
    name: props.showYAxisName ? props.unit : '',
    nameTextStyle: {
      color: '#86909C',
      fontSize: 14,
      fontFamily: 'Inter, Microsoft YaHei, sans-serif',
      padding: [0, 40, 0, 0]
    },
    nameGap: 10,
    max: props.yAxisMax,
    splitNumber: props.yAxisSplitNumber,
    axisLine: {
      show: false
    },
    axisTick: {
      show: true,
      length: 4,
      inside: true,
      lineStyle: {
        color: '#C9CDD4'
      }
    },
    axisLabel: {
      color: '#86909C',
      fontSize: 12,
      fontFamily: 'Roboto, Microsoft YaHei, sans-serif',
      formatter: props.yAxisFormatter || formatValue
    },
    splitLine: {
      show: props.showGrid,
      lineStyle: {
        color: '#E5E6EB',
        type: 'solid'
      }
    }
  }

  // X 轴配置
  const xAxisConfig = {
    type: 'category',
    data: xAxis,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E5E6EB'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#E5E6EB'
      }
    },
    axisLabel: {
      color: '#86909C',
      fontSize: 12,
      fontFamily: 'Roboto, Microsoft YaHei, sans-serif',
      margin: 12
    },
    boundaryGap: false
  }

  // Tooltip 配置
  const tooltipConfig = {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'transparent',
    borderWidth: 0,
    padding: [12, 12],
    boxShadow: '0 4px 9px rgba(0, 0, 0, 0.1), 0 64px 26px rgba(0, 0, 0, 0.01)',
    textStyle: {
      color: '#1D2129',
      fontSize: 12,
      fontFamily: 'Roboto, Microsoft YaHei, sans-serif'
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#C9CDD4',
        type: 'dashed'
      }
    },
    formatter: (params) => {
      // 格式化日期显示
      let dateStr = params[0].axisValue
      if (dateStr.includes('-')) {
        dateStr = dateStr.replace(/-/g, '/')
      }
      let html = `<div style="font-weight: 500; font-size: 14px; margin-bottom: 8px; font-family: 'Roboto', 'Microsoft YaHei', sans-serif;">${dateStr}</div>`
      params.forEach(param => {
        const valueStr = formatValue(param.value) + (props.unit ? props.unit : '')
        html += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; min-width: 180px;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 8px; height: 3px; background: ${param.color}; margin-right: 4px;"></span>
              <span style="color: #4E5969; font-size: 12px;">${param.seriesName}</span>
            </div>
            <span style="font-weight: 500; color: #1D2129; margin-left: 16px; font-size: 12px; font-family: 'Roboto', 'Microsoft YaHei', sans-serif;">${valueStr}</span>
          </div>
        `
      })
      return html
    }
  }

  const option = {
    grid: {
      left: 50,
      right: 20,
      top: props.showLegend ? 40 : 20,
      bottom: 40
    },
    legend: getLegendConfig(seriesConfig),
    tooltip: tooltipConfig,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    series: seriesConfig
  }

  chartInstance.setOption(option)
}

// 更新图表数据
const updateChart = () => {
  console.log('LineChart updateChart - chartInstance:', !!chartInstance)
  if (!chartInstance) {
    // 如果图表实例不存在，尝试初始化
    initChart()
    return
  }

  const { xAxis, series } = props.chartData
  console.log('LineChart updateChart - 数据:', { xAxis, series })

  // 如果没有数据，不更新
  if (!xAxis?.length || !series?.length) return

  // 重新构建完整的系列配置
  const seriesConfig = series.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data,
    smooth: props.smooth,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: props.lineWidth,
      color: item.color
    },
    itemStyle: {
      color: item.color
    },
    emphasis: {
      focus: 'series',
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff',
        shadowBlur: 4,
        shadowColor: 'rgba(0, 0, 0, 0.2)'
      }
    }
  }))

  // 使用 notMerge 模式完全替换数据
  chartInstance.setOption({
    xAxis: { data: xAxis },
    series: seriesConfig
  }, { notMerge: false })
}

// 监听窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 是否已挂载
const isMounted = ref(false)

// 监听数据变化
watch(() => props.chartData, (newVal, oldVal) => {
  console.log('LineChart watch 触发:', {
    isMounted: isMounted.value,
    hasXAxis: !!newVal?.xAxis?.length,
    hasSeries: !!newVal?.series?.length,
    chartInstance: !!chartInstance,
    chartRefExists: !!chartRef.value,
    newVal: newVal,
    oldVal: oldVal
  })

  // 必须等待组件挂载后才能操作
  if (!isMounted.value) {
    console.log('LineChart: 组件未挂载，跳过')
    return
  }

  // 如果有数据变化，进行更新或初始化
  if (newVal?.xAxis?.length && newVal?.series?.length) {
    nextTick(() => {
      if (chartInstance) {
        console.log('LineChart: 更新已存在的图表')
        updateChart()
      } else {
        console.log('LineChart: 初始化新图表')
        initChart()
      }
    })
  }
}, { deep: true, immediate: true })

onMounted(() => {
  console.log('LineChart onMounted 开始, chartData:', props.chartData)
  isMounted.value = true

  // 组件挂载时，如果数据已存在则初始化
  nextTick(() => {
    console.log('LineChart nextTick 内, chartData:', props.chartData)
    if (props.chartData?.xAxis?.length && props.chartData?.series?.length) {
      console.log('LineChart: 挂载时有数据，初始化图表')
      initChart()
    }
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

// 切换系列显示/隐藏
const toggleSeries = (seriesName) => {
  if (!chartInstance) return

  // 使用 ECharts 的 dispatchAction 切换图例选中状态
  // 这会自动隐藏/显示对应的系列
  chartInstance.dispatchAction({
    type: 'legendToggleSelect',
    name: seriesName
  })
}

// 暴露方法
defineExpose({
  resize: handleResize,
  getChartInstance: () => chartInstance,
  toggleSeries
})
</script>

<template>
  <div ref="chartRef" class="line-chart" :style="{ height }"></div>
</template>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
}
</style>
