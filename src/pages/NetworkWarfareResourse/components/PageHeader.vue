<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  updateTime: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div :class="['page-header-wrapper', { centered }]">
    <div class="page-header">
      <div class="page-title-text">
        <svg xmlns="http://www.w3.org/2000/svg" width="136" height="10" viewBox="0 0 136 10" fill="none" class="title-deco">
          <path d="M87.0439 9.28516H125.861L135.271 0H96.4541L87.0439 9.28516ZM58.8135 9.28516H76.458L85.8682 0H68.2236L58.8135 9.28516ZM34.1113 9.28516H47.1533L57.6377 0H44.5957L34.1113 9.28516ZM15.291 9.28516H24.7012L34.1113 0H24.7012L15.291 9.28516ZM0 9.28516H4.70508L14.1152 0H9.41016L0 9.28516Z" fill="url(#paint0_linear_title_deco)"/>
          <defs>
            <linearGradient id="paint0_linear_title_deco" x1="123.713" y1="8.56379" x2="9.46027" y2="8.56379" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00F2EF"/>
              <stop offset="1" stop-color="#00E0DB" stop-opacity="0.287027"/>
            </linearGradient>
          </defs>
        </svg>
        <span>{{ title }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="136" height="10" viewBox="0 0 136 10" fill="none" class="title-deco flipped">
          <path d="M87.0439 9.28516H125.861L135.271 0H96.4541L87.0439 9.28516ZM58.8135 9.28516H76.458L85.8682 0H68.2236L58.8135 9.28516ZM34.1113 9.28516H47.1533L57.6377 0H44.5957L34.1113 9.28516ZM15.291 9.28516H24.7012L34.1113 0H24.7012L15.291 9.28516ZM0 9.28516H4.70508L14.1152 0H9.41016L0 9.28516Z" fill="url(#paint1_linear_title_deco)"/>
          <defs>
            <linearGradient id="paint1_linear_title_deco" x1="123.713" y1="8.56379" x2="9.46027" y2="8.56379" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00F2EF"/>
              <stop offset="1" stop-color="#00E0DB" stop-opacity="0.287027"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    <div v-if="updateTime" class="update-time">数据更新至: {{ updateTime }}</div>
  </div>
</template>

<style lang="scss" scoped>
.page-header-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 32px;
  position: relative;

  &.centered {
    justify-content: center;
    align-items: center;
    margin-top: 16px;
  }
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-title-text {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  background: linear-gradient(to bottom, #ffffff, #d0eaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-deco {
  width: 136px;
  height: 10px;
  filter: drop-shadow(0 0 5px rgba(0, 242, 239, 0.5));
}

.title-deco.flipped {
  transform: scaleX(-1);
}

.update-time {
  position: absolute;
  right: 0;
  bottom: 5px;
  font-size: 16px;
  color: #94a3b8;
  opacity: 0.8;
}
</style>