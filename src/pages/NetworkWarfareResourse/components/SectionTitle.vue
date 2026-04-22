<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: null
  },
  simple: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="simple" class="section-title-wrap">
    <div class="section-title-deco-arrow"></div>
    <div class="section-title">{{ title }}</div>
    <div class="section-title-deco-line"></div>
  </div>
  <div v-else class="section-header">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="30" viewBox="0 0 15 30" fill="none" class="section-arrow">
      <path d="M0 0V29.4L14.4 15.2L0 0Z" fill="url(#paint_section_arrow)"/>
      <defs>
        <linearGradient id="paint_section_arrow" x1="29.4606" y1="14.7044" x2="-1.45576" y2="14.7044" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00F2EF"/>
          <stop offset="0.427" stop-color="#00E0DB" stop-opacity="0.831"/>
          <stop offset="1" stop-color="#00E0DB" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
    <div class="section-title">{{ title }}</div>
    <div v-if="count !== null" class="section-count">{{ count }}</div>
    <div class="section-deco-bar"></div>
    <div class="section-line"></div>
  </div>
</template>

<style lang="scss" scoped>
// 简洁模式样式（运营数据概览使用）
.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 16px;
}

.section-title-deco-arrow {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid #00f0ff;
  filter: drop-shadow(0 0 4px #00f0ff);
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  white-space: nowrap;
}

.section-title-deco-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.6), transparent);
  margin-left: 8px;
}

// 完整模式样式（资源概览使用）
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 8px;
}

.section-arrow {
  width: 15px;
  height: 30px;
  margin-right: 12px;
  filter: drop-shadow(0 0 3px rgba(0, 242, 239, 0.5));
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-right: 12px;
}

.section-count {
  font-size: 24px;
  font-weight: bold;
  color: #00f0ff;
  font-family: 'Segoe UI', sans-serif;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.4);
  letter-spacing: 1px;
}

.section-deco-bar {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #00f0ff, rgba(0, 240, 255, 0.6));
  margin-left: 16px;
  margin-right: 8px;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.5) 0%, transparent 100%);
  opacity: 0.5;
}
</style>