<script setup>
import { getAssetUrl } from '@/utils/assets'

const username = 'admin'
</script>

<template>
  <header class="global-header">
    <div class="brand">
      <img :src="getAssetUrl('/figma/logo-icon.svg')" alt="" class="brand-icon" />
      <span class="brand-text">作战资源库</span>
    </div>

    <div class="toolbar">
      <button class="toolbar-button" type="button" aria-label="搜索">
        <img :src="getAssetUrl('/figma/mnijidos-cf8wmtt.svg')" alt="" />
      </button>
      <button class="toolbar-button" type="button" aria-label="通知">
        <img :src="getAssetUrl('/figma/mnijidos-7thb8hs.svg')" alt="" />
      </button>
      <button class="account-button" type="button" aria-label="当前用户">
        <span class="avatar">
          <img :src="getAssetUrl('/figma/mnijidos-cxocglf.svg')" alt="" />
        </span>
        <span class="username">{{ username }}</span>
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.global-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px; /* 使用固定高度而非 min-height */
  flex-shrink: 0; /* 防止在 flex 布局中被压缩 */
  padding: 0 16px;
  border-bottom: 1px solid #414243;
  background: #080027;
}

.brand {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 20px;
}

.brand-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.brand-text {
  color: #e5eaf3;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
}

.toolbar {
  display: flex;
  align-items: stretch;
  margin-left: auto;
}

.toolbar-button,
.account-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 64px; /* 使用固定高度 */
  flex-shrink: 0; /* 防止压缩 */
  padding: 0 12px;
  border: 0;
  background: transparent;
  color: #e5eaf3;
}

.toolbar-button img {
  width: 16px;
  height: 16px;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
}

.avatar img {
  width: 14px;
  height: 14px;
}

.username {
  font-size: 14px;
  line-height: 22px;
}
</style>
