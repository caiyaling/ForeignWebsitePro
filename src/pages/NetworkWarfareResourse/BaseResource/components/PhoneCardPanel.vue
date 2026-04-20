<script setup>
/**
 * @description 手机卡号卡片组件
 * @date 2024-04-09
 */
import { getAssetUrl } from '@/utils/assets'

const props = defineProps({
  // 卡片数据
  cards: {
    type: Array,
    default: () => []
  }
})

// 根据卡片名称获取图标
const getCardIcon = (cardName) => {
  // 使用同一个图标，后续可按需要区分
  return getAssetUrl('/figma/phone-card-icon.svg')
}
</script>

<template>
  <section class="phone-card-panel">
    <div class="card-row">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="phone-card"
      >
        <!-- 左侧：图标 + 标题 -->
        <div class="card-profile">
          <div class="card-icon-wrapper">
            <img :src="getCardIcon(card.name)" alt="" class="card-icon" />
          </div>
          <div class="card-name">{{ card.name }}</div>
        </div>

        <!-- 右侧：统计列表 -->
        <div class="card-stats-section">
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
.phone-card-panel {
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

.phone-card {
  display: flex;
  width: 396px;
  min-height: 128px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(150.08deg, #fff4fd 4.47%, #c9e5ff 85.39%);
  padding: 16px 0;
  border: 2px solid #fff;
  border-radius: 4px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

// 左侧区域
.card-profile {
  display: flex;
  flex: 1 0 0;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  border-right: 1px solid rgba(22, 119, 255, 0.15);
  gap: 8px;
}

.card-icon-wrapper {
  width: 56px;
  height: 56px;
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
}

.card-name {
  color: var(--el-text-color-primary, #303133);
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  white-space: nowrap;
}

// 右侧统计区域
.card-stats-section {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  overflow: hidden;
}

.stats-list {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;

  // 隐藏滚动条但保持滚动功能
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.stat-label {
  color: var(--el-text-color-regular, #606266);
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
</style>
