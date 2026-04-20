<script setup>
/**
 * @description 基础资源卡片组件 - 用于专用设备页面
 * @date 2024-04-09
 */
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import DoughnutChart from './DoughnutChart.vue'

const props = defineProps({
  // 卡片数据
  cards: {
    type: Array,
    default: () => []
  },
  // 当前选中的卡片索引
  activeIndex: {
    type: Number,
    default: 0
  },
  // 是否禁用选中交互
  disableSelect: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:activeIndex'])

const handleCardClick = (index) => {
  if (props.disableSelect) return
  emit('update:activeIndex', index)
}

// 自定义滚动条相关
const progressListRefs = ref({})
const scrollbarThumbTop = ref({})
const showScrollbar = ref({})

// 图表组件引用
const chartRefs = ref({})

// 当前高亮的图例索引（按卡片索引）
const highlightedLegendIndex = ref({})

// 初始化滚动条状态
const initScrollbar = (cardIndex) => {
  const listEl = progressListRefs.value[cardIndex]
  if (!listEl) return

  const { scrollHeight, clientHeight } = listEl
  showScrollbar.value[cardIndex] = scrollHeight > clientHeight
}

// 处理滚动
const handleScroll = (cardIndex) => {
  const listEl = progressListRefs.value[cardIndex]
  if (!listEl) return

  const { scrollTop, scrollHeight, clientHeight } = listEl
  const maxScrollTop = scrollHeight - clientHeight

  if (maxScrollTop > 0) {
    // 滚动区域高度 168px，滚动条轨道高度 168px，滑块高度 38px
    // 滑块可移动范围 = 168 - 38 = 130px
    const thumbTrackHeight = 130
    scrollbarThumbTop.value[cardIndex] = (scrollTop / maxScrollTop) * thumbTrackHeight
  }
}

// 设置列表元素引用
const setProgressListRef = (el, cardIndex) => {
  if (el) {
    progressListRefs.value[cardIndex] = el
    nextTick(() => initScrollbar(cardIndex))
  }
}

// 设置图表组件引用
const setChartRef = (el, cardIndex) => {
  if (el) {
    chartRefs.value[cardIndex] = el
  }
}

// 处理图例点击
const handleLegendClick = (cardIndex, legendIndex) => {
  const chartRef = chartRefs.value[cardIndex]
  if (!chartRef) return

  // 切换高亮状态
  if (highlightedLegendIndex.value[cardIndex] === legendIndex) {
    // 取消高亮
    chartRef.downplay(legendIndex)
    highlightedLegendIndex.value[cardIndex] = null
  } else {
    // 先取消之前的高亮
    if (highlightedLegendIndex.value[cardIndex] !== undefined && highlightedLegendIndex.value[cardIndex] !== null) {
      chartRef.downplay(highlightedLegendIndex.value[cardIndex])
    }
    // 高亮新的
    chartRef.highlight(legendIndex)
    highlightedLegendIndex.value[cardIndex] = legendIndex
  }
}

// 监听卡片数据变化
watch(() => props.cards, () => {
  nextTick(() => {
    props.cards.forEach((card, index) => {
      if (card.type === 'progress') {
        initScrollbar(index)
      }
    })
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    props.cards.forEach((card, index) => {
      if (card.type === 'progress') {
        initScrollbar(index)
      }
    })
  })
})
</script>

<template>
  <section class="resource-panel">
    <div class="card-row">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :class="[
          'resource-card',
          card.type === 'chart' ? 'card-chart-type' : card.type === 'progress' ? 'card-progress-type' : 'card-stats-type',
          { 'card-active': !disableSelect && activeIndex === index },
          { 'card-disabled': disableSelect }
        ]"
        @click="handleCardClick(index)"
      >
        <!-- 左侧：图标 + 名称/数量（水平布局） -->
        <div class="card-profile">
          <div class="profile-header">
            <div class="card-icon-wrapper">
              <img v-if="card.icon" :src="card.icon" alt="" class="card-icon" />
              <div v-else class="card-icon-placeholder">{{ card.name?.charAt(0) || '?' }}</div>
            </div>
            <div class="card-profile-info">
              <div class="card-header-row">
                <div class="card-name">{{ card.name }}</div>
              </div>
              <div class="card-body-row">
                <div class="card-total">{{ card.total }}</div>
              </div>
            </div>
          </div>
          <!-- 描述文字（仅云手机卡片有） -->
          <div v-if="card.description" class="card-description">
            {{ card.description }}
          </div>
        </div>

        <!-- 右侧：环形图表类型 -->
        <div v-if="card.type === 'chart'" class="card-chart-section">
          <doughnut-chart
            :ref="(el) => setChartRef(el, index)"
            :outer-data="card.chart.outerData"
            :inner-data="card.chart.innerData"
          />
          <div class="chart-legend">
            <div
              v-for="(item, idx) in card.chart.legends"
              :key="idx"
              :class="['legend-item', { 'legend-active': highlightedLegendIndex[index] === idx }]"
              @click="handleLegendClick(index, idx)"
            >
              <div class="legend-dot" :style="{ background: item.color }"></div>
              <span class="legend-text">{{ item.label }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：进度条列表类型 -->
        <div v-else-if="card.type === 'progress'" class="card-progress-section">
          <div
            :ref="(el) => setProgressListRef(el, index)"
            class="progress-list"
            @scroll="handleScroll(index)"
          >
            <!-- 各地区行（接口返回的数据已包含总计行） -->
            <div v-for="(item, itemIdx) in card.progressItems" :key="itemIdx" class="progress-row">
              <span class="progress-label">{{ item.label }}：</span>
              <div class="progress-stats">
                <span class="progress-text">共</span>
                <span class="progress-total">{{ item.total }}</span>
                <span class="progress-text">个，</span>
                <span class="progress-text">已使用</span>
                <span class="progress-used">{{ item.used }}</span>
                <span class="progress-text">个</span>
              </div>
            </div>
          </div>
          <!-- 自定义滚动条 -->
          <div
            v-if="showScrollbar[index]"
            class="custom-scrollbar-track"
          >
            <div
              class="custom-scrollbar-thumb"
              :style="{ top: (scrollbarThumbTop[index] || 0) + 'px' }"
            ></div>
          </div>
        </div>

        <!-- 右侧：统计列表类型 -->
        <div v-else class="card-stats-section">
          <div class="stats-list">
            <div v-for="(stat, statIdx) in card.stats" :key="statIdx" class="stat-row">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.resource-panel {
  flex-shrink: 0;
  padding: 16px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.resource-card {
  display: flex;
  width: 536px;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(147.07deg, #fff4fd 4.47%, #c9e5ff 85.39%);
  padding: 16px 0;
  cursor: pointer;
  border: 2px solid #fff;
  border-radius: 4px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.card-active {
  border: 2px solid var(--el-color-primary, #0060ff);
  border-radius: 4px;
  transform: translateY(-2px);
}

// 禁用选中状态
.card-disabled {
  cursor: default;

  &:hover {
    transform: none;
  }
}

// 云手机卡片样式（带环形图表）
.card-chart-type {
  background: linear-gradient(147.07deg, #fff4fd 4.47%, #c9e5ff 85.39%);

  .card-profile {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 16px;
    gap: 8px;
    border-right: 1px solid rgba(22, 119, 255, 0.15);
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-icon-wrapper {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
  }

  .card-profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .card-header-row {
    padding: 0 8px;
    width: 171px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .card-body-row {
    padding: 0 8px;
    width: 171px;
    display: flex;
    align-items: center;
  }

  .card-name {
    font-size: 20px;
    line-height: 28px;
    color: var(--el-text-color-primary, #303133);
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-weight: 400;
    white-space: nowrap;
  }

  .card-total {
    font-size: 16px;
    font-weight: 700;
    color: #0026ff;
    line-height: normal;
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    white-space: nowrap;
  }
}

// 实体手机卡片样式（带统计列表）
.card-stats-type {
  background: linear-gradient(147.07deg, #fff4fd 4.47%, #c9e5ff 85.39%);

  .card-profile {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 16px;
    gap: 8px;
    border-right: 1px solid rgba(22, 119, 255, 0.15);
  }

  .card-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .card-header-row {
    padding: 0 8px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .card-body-row {
    padding: 0 8px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .card-name {
    font-size: 20px;
    line-height: 28px;
    color: var(--el-text-color-primary, #303133);
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-weight: 400;
  }

  .card-total {
    font-size: 16px;
    font-weight: 700;
    color: #0026ff;
    line-height: normal;
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  }
}

// 进度条类型卡片样式（网络代理页面静态代理）
.card-progress-type {
  width: 792px;
  height: 200px;
  position: relative;


  .card-profile {
    width: 275px;
    flex: 0 0 275px;
    padding: 0 20px;
    gap: 4px;
  }

  .card-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .card-profile-info {
    padding-left: 0;
    width: 171px;
  }

  .profile-header {
    display: flex;
    align-items: center;
  }

  .card-name {
    padding-left: 20px;
    line-height: 28px;
  }

  .card-total {
    padding-left: 16px;
  }

  .card-description {
    line-height: 28px;
  }
}

.card-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
  border-right: 1px solid rgba(22, 119, 255, 0.15);
  gap: 8px;
}

.profile-header {
  display: flex;
  align-items: center;
}

.card-icon-wrapper {
  flex-shrink: 0;
  border-radius: 1000px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 100%;
  height: 100%;
  // object-fit: cover;
}

.card-icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.card-profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
}

.card-body-row {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.card-name {
  color: #303133;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  white-space: nowrap;
}

.card-total {
  color: #0026ff;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  white-space: nowrap;
}

.card-description {
  color: #909399;
  font-size: 14px;
  line-height: 20px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

// 环形图表区域
.card-chart-section {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 20px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 72, 255, 0.08);
  }

  &.legend-active {
    background: rgba(0, 72, 255, 0.12);

    .legend-text {
      color: #0048ff;
      font-weight: 500;
    }
  }
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 1;
  font-family: 'Alibaba PuHuiTi', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  white-space: nowrap;
}

// 统计列表区域
.card-stats-section {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  overflow: hidden;
}

.stats-list {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 4px;

  // 隐藏滚动条但保持滚动功能
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.stat-label {
  color: #606266;
  font-size: 16px;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.stat-value {
  color: rgba(0, 0, 0, 0.88);
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

// 进度条列表区域
.card-progress-section {
  display: flex;
  flex: 0 0 517px;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  width: 517px;
  position: relative;
}

.progress-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;

  // 隐藏原生滚动条
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
}

// 自定义滚动条轨道
.custom-scrollbar-track {
  position: absolute;
  right: 5px;
  top: 56px;
  width: 5px;
  height: 130px; // 168px - 38px = 130px（滑块可移动范围）
  background: transparent;
}

// 自定义滚动条滑块
.custom-scrollbar-thumb {
  position: absolute;
  left: 0;
  width: 5px;
  height: 38px;
  background: #b8d4ff;
  border-radius: 100px;
  transition: top 0.1s ease-out;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  line-height: 28px;
  padding: 0 20px;
}

.progress-label {
  color: #303133;
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  white-space: nowrap;
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.progress-text {
  color: #606266;
  font-size: 16px;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.progress-total {
  color: #0026ff;
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.progress-used {
  color: #0026ff;
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}
</style>
