<script setup>
/**
 * @description 账号粉丝情况图表组件
 * @author Claude
 * @date 2026-04-08
 */
import { ref, computed } from 'vue'
import { ElDatePicker } from 'element-plus'
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

// 日期范围
const dateRange = ref([])

// 默认图表数据（用于演示）
const defaultChartData = computed(() => {
  // 生成日期数据 - 按设计稿日期
  const dates = [
    '2025-09-01', '2025-09-07', '2025-09-15', '2025-10-01', '2025-10-17',
    '2025-10-15', '2025-10-15', '2025-10-15', '2025-10-15', '2025-10-15', '2025-10-15'
  ]

  // 生成模拟数据 - 对应设计稿中的数据
  const currentFansData = [200, 350, 480, 620, 750, 820, 880, 920, 950, 980, 990]
  const newFansData = [0, 150, 130, 140, 130, 70, 60, 40, 30, 30, 10]
  const totalNewFansData = [0, 150, 280, 420, 550, 620, 680, 720, 750, 780, 790]

  return {
    xAxis: dates,
    series: [
      {
        name: '当前粉丝数',
        data: currentFansData,
        color: '#165DFF'
      },
      {
        name: '账号新增粉丝数',
        data: newFansData,
        color: '#14C9C9'
      },
      {
        name: '账号累计新增粉丝数',
        data: totalNewFansData,
        color: '#F7BA1E'
      }
    ]
  }
})

// 实际使用的图表数据
const actualChartData = computed(() => {
  return props.chartData.xAxis?.length > 0 ? props.chartData : defaultChartData.value
})

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
          <span class="required-mark">*</span>
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
      <div class="chart-inner">
        <!-- 图例 -->
        <div class="chart-legend">
          <span class="unit-label">个</span>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-line legend-line-blue"></span>
              <span class="legend-text">当前粉丝数</span>
            </div>
            <div class="legend-item">
              <span class="legend-line legend-line-cyan"></span>
              <span class="legend-text">账号新增粉丝数</span>
            </div>
            <div class="legend-item">
              <span class="legend-line legend-line-gold"></span>
              <span class="legend-text">账号累计新增粉丝数</span>
            </div>
          </div>
        </div>

        <!-- 折线图 -->
        <div class="chart-wrapper">
          <line-chart
            :chart-data="actualChartData"
            :show-legend="false"
            unit="个"
            height="280px"
            :line-width="3"
            :y-axis-max="1000"
            :y-axis-split-number="5"
            :y-axis-formatter="yAxisFormatter"
          />
        </div>
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

.unit-label {
  font-size: 14px;
  color: #86909C;
  font-family: 'Inter', 'Microsoft YaHei', sans-serif;
  line-height: 22px;
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
</style>
