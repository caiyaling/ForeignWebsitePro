<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="section-header">
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
    <div class="section-count">{{ count }}</div>
    <div class="section-deco-bar"></div>
    <div class="section-line"></div>
  </div>
</template>

<style scoped>
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
  text-shadow: 0 0 5px rgba(0,240,255,0.4);
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