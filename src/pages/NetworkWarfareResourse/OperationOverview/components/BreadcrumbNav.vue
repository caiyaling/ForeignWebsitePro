<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  items: {
    type: Array,
    required: true
    // 格式: [{ label: '运营数据概览', path: '/xxx' }, { label: '详情', active: true }]
  }
})

const handleClick = (item) => {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <div class="breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <span
        :class="['breadcrumb-item', { active: item.active, clickable: item.path }]"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </span>
      <span v-if="index < items.length - 1" class="separator">/</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.breadcrumb {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  gap: 8px;
  align-items: center;
}

.breadcrumb-item {
  color: #94a3b8;
  cursor: default;
  transition: color 0.3s;

  &.clickable {
    cursor: pointer;

    &:hover {
      color: #00f0ff;
    }
  }

  &.active {
    color: #ffffff;
  }
}

.separator {
  color: #94a3b8;
  opacity: 0.5;
}
</style>