<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="hit-post-card">
    <div class="hot-badge" :style="{ background: post.badgeColor }">{{ post.hotLabel }}</div>
    <div class="post-img-placeholder">
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
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
.hit-post-card {
  background: linear-gradient(180deg, rgba(16, 35, 75, 0.6) 0%, rgba(10, 20, 45, 0.8) 100%);
  border: 1px solid rgba(0, 240, 255, 0.5);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(0, 240, 255, 0.9);
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
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
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.post-img-placeholder {
  width: 100%;
  height: 130px;
  position: relative;
  background: radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  svg {
    width: 40px;
    height: 40px;
    stroke: rgba(255, 255, 255, 0.3);
  }
}

.post-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.post-title {
  font-size: 16px;
  line-height: 1.6;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.9;
  margin-bottom: 16px;
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
    color: #94a3b8;
  }

  .val {
    font-size: 18px;
    font-weight: bold;
    color: #00f0ff;
  }
}
</style>