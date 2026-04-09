<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="panel-toolbar">
    <div class="panel-title-wrap">
      <span class="panel-accent"></span>
      <h2 class="panel-title">{{ title }}</h2>
    </div>

    <div class="toolbar-filters">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  align-self: stretch;
}

.panel-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.panel-accent {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: #0048FF;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  color: #303133;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
}

.toolbar-filters {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}
</style>
