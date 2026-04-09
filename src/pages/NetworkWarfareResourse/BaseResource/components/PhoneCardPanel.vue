<script setup>
/**
 * @description 手机卡号卡片组件
 * @date 2024-04-09
 */

const props = defineProps({
  // 卡片数据
  cards: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="phone-card-panel">
    <div class="card-row">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="phone-card"
      >
        <!-- 标题 -->
        <div class="card-title">{{ card.name }}</div>
        <!-- 统计列表 -->
        <div class="stats-list">
          <div v-for="(stat, statIdx) in card.stats" :key="statIdx" class="stat-row">
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-value">{{ stat.value }}</span>
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
  flex-direction: column;
  width: 536px;
  height: 132px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(156deg, #fff4fd 4.47%, #c9e5ff 85.39%);
  padding: 16px 0;
  border: 1px solid #fff;
  border-radius: 4px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  gap: 16px;
}

.card-title {
  padding: 0 20px;
  color: #303133;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.stats-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 4px;

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
</style>
