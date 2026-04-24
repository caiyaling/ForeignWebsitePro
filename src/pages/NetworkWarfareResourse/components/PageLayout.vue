<script setup>
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'

const props = defineProps({
  background: {
    type: String,
    default: 'image',
    validator: (value) => ['image', 'gray'].includes(value)
  }
})
</script>

<template>
  <div class="page-wrapper" :class="{ 'gray-bg': background === 'gray' }">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使用固定高度而非 min-height，确保子元素能正确继承高度 */
  background-image: url('@/assets/overviewBg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.page-wrapper.gray-bg {
  background: #efefef;
  background-image: none;
}

.page-shell {
  display: flex;
  flex: 1;
  min-height: 0;
  height: calc(100vh - 64px); /* 明确设置高度，减去 header 高度 */
  overflow: hidden;
}

.page-main {
  flex: 1;
  min-width: 0;
  min-height: 0; /* 确保 flex 子元素正确收缩 */
  height: 100%; /* 明确设置高度 */
  overflow: hidden;
  display: flex; /* 默认使用 flex 布局 */
  flex-direction: column;

  // 灰色背景页面的 padding
  &:has(.data-table),
  &:has(.summary-cards),
  &:has(.resource-card),
  &:has(.phone-card-panel) {
    padding: 12px 10px 12px 12px;
    gap: 8px;
  }

  // 数据导入页面的 padding
  &:has(.tabs-wrapper) {
    padding: 16px;
    gap: 16px;
  }
}
</style>