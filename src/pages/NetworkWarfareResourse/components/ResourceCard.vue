<script setup>
/**
 * @description 基础资源卡片组件 - 用于专用设备页面
 * @date 2024-04-09
 */
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

// 计算进度条百分比
const getProgressPercent = (item) => {
  if (!item.total || item.total === 0) return 0
  return Math.min(100, Math.max(0, (item.used / item.total) * 100))
}
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
            </div>
            <div class="card-profile-info">
              <div class="card-name">{{ card.name }}</div>
              <div class="card-total">{{ card.total }}</div>
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
            :outer-data="card.chart.outerData"
            :inner-data="card.chart.innerData"
          />
          <div class="chart-legend">
            <div v-for="(item, idx) in card.chart.legends" :key="idx" class="legend-item">
              <div class="legend-dot" :style="{ background: item.color }"></div>
              <span class="legend-text">{{ item.label }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：进度条列表类型 -->
        <div v-else-if="card.type === 'progress'" class="card-progress-section">
          <!-- 装饰性分隔线 -->
          <div class="progress-divider"></div>
          <div class="progress-list">
            <div v-for="(item, itemIdx) in card.progressItems" :key="itemIdx" class="progress-row">
              <span class="progress-label">{{ item.label }}</span>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" :style="{ width: getProgressPercent(item) + '%' }"></div>
                </div>
              </div>
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
  height: 195px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(152.53deg, #fff4fd 4.47%, #c9e5ff 85.39%);
  padding: 16px 0;
  cursor: pointer;
  border: 1px solid #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.card-active {
  border: 2px solid #0060ff;
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
  background: linear-gradient(146.4deg, #fff4fd 4.47%, #c9e5ff 85.39%);

  .card-profile {
    padding: 0 16px;
  }

  .card-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .card-profile-info {
    padding-left: 8px;
  }

  // 云手机卡片左侧使用水平布局
  .profile-header {
    display: flex;
    align-items: center;
  }

  .card-description {
    margin-top: 8px;
  }
}

// 实体手机卡片样式（带统计列表）
.card-stats-type {
  .card-profile {
    padding: 0 20px;
  }

  .card-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .card-profile-info {
    padding-left: 20px;
  }

  // 实体手机卡片左侧使用水平布局
  .profile-header {
    display: flex;
    align-items: center;
  }
}

// 进度条类型卡片样式（网络代理页面静态代理）
.card-progress-type {
  width: 685px;
  height: 200px;

  .card-profile {
    width: 275px;
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
}

.card-icon {
  width: 100%;
  height: 100%;
}

.card-profile-info {
  display: flex;
  flex-direction: column;
}

.card-name {
  color: #303133;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.card-total {
  color: #0026ff;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
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
  flex: 1;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 410px;
  padding-left: 24px;
}

// 装饰性分隔线
.progress-divider {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 88px;
  background: linear-gradient(180deg, rgba(184, 212, 255, 0) 0%, #b8d4ff 50%, rgba(184, 212, 255, 0) 100%);
  border-radius: 100px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  max-height: 168px;
  overflow-y: auto;
  padding-right: 20px;

  // 隐藏滚动条但保持滚动功能
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  line-height: 28px;
  padding: 0;
}

.progress-label {
  color: #303133;
  font-size: 16px;
  font-weight: 700;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  white-space: nowrap;
  min-width: 40px;
}

.progress-bar-wrapper {
  width: 124px;
  flex-shrink: 0;
}

.progress-bar-bg {
  height: 6px;
  background: #b8d4ff;
  border-radius: 20px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--el-color-primary, #0048ff);
  border-radius: 50px;
  transition: width 0.3s ease;
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
