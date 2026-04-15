<script setup>
/**
 * @description 账号粉丝情况图表组件
 * @author Claude
 * @date 2026-04-08
 */
import { ref, computed, watch } from 'vue'
import { ElDatePicker, ElEmpty } from 'element-plus'
import LineChart from '@/components/LineChart.vue'

const props = defineProps({
  title: {
    type: String,
    default: '账号粉丝情况'
  },
  // 图表数据
  chartData: {
    type: Object,
    default: () => ({
      xAxis: [],
      series: []
    })
  }
})

const emit = defineEmits(['date-change'])

// 日期范围
const dateRange = ref([])

// 图表组件引用
const lineChartRef = ref(null)

// 监听日期范围变化
watch(dateRange, (newVal) => {
  emit('date-change', newVal)
})

// 是否有数据
const hasData = computed(() => {
  const xAxis = props.chartData?.xAxis
  const series = props.chartData?.series
  const result = (xAxis && xAxis.length > 0) && (series && series.length > 0)
  console.log('AccountFansChart hasData:', result, {
    xAxisLength: xAxis?.length,
    seriesLength: series?.length,
    chartData: JSON.stringify(props.chartData)
  })
  return result
})

// 实际使用的图表数据
const actualChartData = computed(() => {
  if (hasData.value) {
    console.log('AccountFansChart actualChartData: 使用有效数据')
    return props.chartData
  }
  console.log('AccountFansChart actualChartData: 返回空数据')
  return { xAxis: [], series: [] }
})

// 图例配置 - 名称与 API 返回一致
const legendConfig = {
  '当前粉丝数': { color: '#165DFF', label: '当前粉丝数' },
  '新增粉丝数': { color: '#14C9C9', label: '账号新增粉丝数' },
  '累计新增粉丝数': { color: '#F7BA1E', label: '账号累计新增粉丝数' }
}

// 图例选中状态 - 使用 series 名称作为 key
const legendSelected = ref({})

// 初始化图例选中状态
watch(() => props.chartData.series, (series) => {
  if (series && series.length > 0) {
    const newSelected = {}
    series.forEach(item => {
      // 默认全部选中
      if (legendSelected.value[item.name] === undefined) {
        newSelected[item.name] = true
      } else {
        newSelected[item.name] = legendSelected.value[item.name]
      }
    })
    legendSelected.value = newSelected
  }
}, { immediate: true })

// 获取图例项列表
const legendItems = computed(() => {
  if (!hasData.value || !props.chartData.series) return []
  return props.chartData.series.map(item => ({
    name: legendConfig[item.name]?.label || item.name,
    originalName: item.name,
    color: item.color || legendConfig[item.name]?.color || '#165DFF',
    selected: legendSelected.value[item.name] !== false
  }))
})

// 点击图例项
const handleLegendClick = (item) => {
  // 切换选中状态
  legendSelected.value[item.originalName] = !legendSelected.value[item.originalName]

  // 调用 LineChart 的切换系列方法
  if (lineChartRef.value) {
    lineChartRef.value.toggleSeries(item.originalName)
  }
}

// Y 轴格式化函数 - 按照设计稿格式显示（带两位小数）
const yAxisFormatter = (value) => {
  if (value === 0) return '0'
  return value.toFixed(2)
}

</script>

<template>
  <section class="fans-chart-panel">
    <!-- 标题栏 -->
    <div class="panel-header">
      <div class="header-left">
        <div class="title-spacer"></div>
        <span class="panel-title">{{ title }}</span>
      </div>
      <div class="header-right">
        <div class="form-item">
          <span class="form-label">统计时间范围</span>
        </div>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          size="small"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          class="date-picker"
        />
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container">
      <!-- 有数据时显示图表 -->
      <div v-if="hasData" class="chart-inner">
        <!-- 图例 -->
        <div class="chart-legend">
          <div class="legend-items">
            <div
              v-for="(item, index) in legendItems"
              :key="index"
              class="legend-item"
              :class="{ 'legend-item-disabled': !item.selected }"
              @click="handleLegendClick(item)"
            >
              <span class="legend-line" :style="{ background: item.selected ? item.color : '#C9CDD4' }"></span>
              <span class="legend-text">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <!-- 折线图 -->
        <div class="chart-wrapper">
          <line-chart
            ref="lineChartRef"
            :chart-data="actualChartData"
            :show-legend="false"
            unit="个"
            height="340px"
            :line-width="3"
            :y-axis-split-number="5"
            :y-axis-formatter="yAxisFormatter"
          />
        </div>
      </div>

      <!-- 暂无数据占位 -->
      <div v-else class="empty-state">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.fans-chart-panel {
  padding: 20px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter, #EBEEF5);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-spacer {
  width: 4px;
  height: 20px;
  background: #0048FF;
  border-radius: 2px;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  color: #303133;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.required-mark {
  color: #F53F3F;
  font-size: 14px;
  line-height: 1;
}

.form-label {
  font-size: 14px;
  color: var(--el-text-color-primary, #303133);
  font-family: var(--el-font-family, 'Inter', 'Microsoft YaHei', sans-serif);
  white-space: nowrap;
}

.date-picker {
  width: 280px;
}

.date-picker :deep(.el-input__wrapper) {
  border-radius: var(--el-border-radius-base, 4px);
  box-shadow: 0 0 0 1px var(--el-border-color, #DCDFE6) inset;
  padding: 0 8px;
  height: 32px;
  background: #fff;
}

.date-picker :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-hover, #C0C4CC) inset;
}

.date-picker :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary, #409EFF) inset;
}

.date-picker :deep(.el-range-input) {
  font-size: var(--el-font-size-base, 14px);
  color: var(--el-text-color-primary, #303133);
  font-family: var(--el-font-family, 'Inter', 'Microsoft YaHei', sans-serif);
}

.date-picker :deep(.el-range-separator) {
  font-size: var(--el-font-size-base, 14px);
  color: var(--el-text-color-primary, #303133);
  padding: 0 4px;
}

.date-picker :deep(.el-range__icon) {
  color: var(--el-text-color-placeholder, #A8ABB2);
  font-size: 16px;
}

.chart-container {
  background: #fff;
  border-radius: 6px;
  padding: 20px;
  border: 1px solid #E5E6EB;
}

.chart-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 360px;
}

.chart-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
}


.legend-items {
  display: flex;
  align-items: center;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.legend-item:hover {
  opacity: 0.8;
}

.legend-item-disabled .legend-text {
  color: #C9CDD4;
  text-decoration: line-through;
}

.legend-line {
  width: 8px;
  height: 3px;
  border-radius: 1px;
}

.legend-line-blue {
  background: #165DFF;
}

.legend-line-cyan {
  background: #14C9C9;
}

.legend-line-gold {
  background: #F7BA1E;
}

.legend-text {
  font-size: 12px;
  color: #4E5969;
  font-family: 'Inter', 'Noto Sans JP', 'Noto Sans SC', sans-serif;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
}

/* 暂无数据占位样式 - 与表格空状态一致 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
}

.empty-state :deep(.el-empty__description) {
  margin-top: 0;
}
</style>
