<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  rank: {
    type: Number,
    required: true
  }
})

// 动态徽章颜色计算
const getBadgeColor = (rank) => {
  if (rank === 1) return 'linear-gradient(90deg, #ff4b2b 0%, #ff416c 100%)'
  if (rank === 2) return 'linear-gradient(90deg, #f7b733 0%, #fc4a1a 100%)'
  if (rank === 3) return 'linear-gradient(90deg, #00f0ff 0%, #0080ff 100%)'
  return 'linear-gradient(90deg, #94a3b8 0%, #64748b 100%)'
}
</script>

<template>
  <div class="horizontal-post-card">
    <div class="post-img-box">
      <div class="hot-badge" :style="{ background: getBadgeColor(rank) }">HOT {{ rank }}</div>
      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    </div>
    <div class="post-content">
      <div class="post-title">{{ post.title }}</div>
      <div class="post-stats-row">
        <div class="stat-col">
          <span class="label">阅读量</span>
          <span class="val">{{ post.views }}</span>
        </div>
        <div class="stat-col">
          <span class="label">点赞量</span>
          <span class="val">{{ post.likes }}</span>
        </div>
        <div class="stat-col">
          <span class="label">评论量</span>
          <span class="val">{{ post.comments }}</span>
        </div>
        <div class="stat-col">
          <span class="label">转发量</span>
          <span class="val">{{ post.shares }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-post-card {
  display: flex;
  align-items: stretch;
  padding: 0;
  gap: 0;
  height: 166px;
  flex-shrink: 0;
  background: linear-gradient(348deg, rgba(0, 27, 64, 0.40) 7.31%, rgba(0, 187, 255, 0.34) 90.95%);
  box-shadow: 0 4px 20px 20px rgba(0, 11, 37, 0.02);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(0, 240, 255, 0.9);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
    transform: translateX(4px);
  }
}

.post-img-box {
  width: 200px;
  height: auto;
  flex-shrink: 0;
  background: radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-right: 1px solid rgba(0, 240, 255, 0.15);

  svg {
    width: 40px;
    height: 40px;
    stroke: rgba(255, 255, 255, 0.3);
  }
}

.hot-badge {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 0 0 8px 0;
  z-index: 10;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
}

.post-content {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-title {
  font-size: 16px;
  margin-bottom: 12px;
  line-height: 1.6;
  color: #fff;
  opacity: 0.95;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.stat-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.15);

  &:last-child {
    border-right: none;
  }

  .label {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
  }

  .val {
    font-size: 18px;
    font-weight: bold;
    color: #00EAFF;
  }
}
</style>