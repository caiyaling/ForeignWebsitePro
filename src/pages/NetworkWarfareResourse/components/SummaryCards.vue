<script setup>
defineProps({
  cards: {
    type: Array,
    default: () => []
  },
  // 卡片固定宽度，不设置则使用响应式网格
  cardWidth: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section class="summary-panel">
    <div :class="['card-row', { 'fixed-width': cardWidth }]">
      <div
        v-for="(card, index) in cards"
        :key="index"
        :class="['summary-card', card.variant, { 'simple-mode': !card.stats || card.stats.length === 0 }]"
        :style="cardWidth ? { width: cardWidth, flex: 'none' } : {}"
      >
        <div class="card-profile">
          <div class="card-icon-wrapper">
            <img :src="card.icon" alt="" class="card-icon" />
          </div>
          <div class="card-profile-text">
            <div class="card-name">{{ card.name }}</div>
            <div class="card-total">{{ card.total }}</div>
          </div>
        </div>

        <div v-if="card.stats && card.stats.length" class="card-stats">
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
.summary-panel {
  flex-shrink: 0;
  padding: 16px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

.card-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  &.fixed-width {
    display: flex;
    gap: 24px;
  }
}

.summary-card {
  display: flex;
  min-height: 128px;
  max-width: 396px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 9px 28px 8px rgba(0, 0, 0, 0.05), 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.summary-card.warm {
  background: linear-gradient(98deg, #fff4fd -6.07%, #c9e5ff 92.55%);
}

.summary-card.cool {
  background: linear-gradient(98deg, #eef6ff -6.07%, #b6ebef 92.55%);
}

.summary-card.simple-mode {
  background: linear-gradient(150deg, #fff4fd 4.47%, #c9e5ff 85.39%);
}

.card-profile {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 0 50%;
  padding: 0 16px;

  &::after {
    content: '';
    position: absolute;
    top: 16px;
    right: 0;
    bottom: 16px;
    width: 1px;
    background: rgba(22, 119, 255, 0.15);
  }
}

// 电子邮箱卡片（无统计数据）- 左侧占满整行
.summary-card.simple-mode .card-profile {
  flex: 1;

  &::after {
    display: none;
  }
}

.card-icon-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 1000px;
  overflow: hidden;
}

.card-icon {
  position: absolute;
  width: 100%;
  height: 100%;
}

.card-profile-text {
  padding-left: 10px;
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

.card-stats {
  display: flex;
  flex: 0 0 50%;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 12px;
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

@media (max-width: 1200px) {
  .card-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
