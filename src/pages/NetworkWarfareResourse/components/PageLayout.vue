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
  min-height: 100vh;
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
}

.page-main {
  flex: 1;
  min-width: 0;
  overflow: hidden;

  // 灰色背景页面的 padding
  &:has(.data-table),
  &:has(.summary-cards),
  &:has(.resource-card),
  &:has(.phone-card-panel) {
    padding: 12px 10px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  // 数据导入页面的 padding
  &:has(.tabs-wrapper) {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>