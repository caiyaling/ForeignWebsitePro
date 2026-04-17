<script setup>
/**
 * @description 账号详情页面包屑导航组件
 * @date 2024-04-09
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 来源页面映射
const sourcePageMap = {
  '/network-warfare-resource/social': '社交平台',
  '/network-warfare-resource/instant-messaging': '即时通讯',
  '/network-warfare-resource/blog-forum': '博客论坛',
  '/network-warfare-resource/email': '电子邮箱'
}

// 面包屑数据
const breadcrumbs = computed(() => {
  const from = route.query.from || ''
  const sourceName = sourcePageMap[from] || '未知来源'

  return [
    { label: sourceName, path: from || '/' },
    { label: '账号详情', path: '', active: true }
  ]
})

// 点击面包屑跳转
const handleBreadcrumbClick = (item) => {
  if (item.path && !item.active) {
    router.push(item.path)
  }
}
</script>

<template>
  <nav class="account-breadcrumb">
    <div class="breadcrumb-list">
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <span
          :class="['breadcrumb-item', { active: item.active, clickable: item.path && !item.active }]"
          @click="handleBreadcrumbClick(item)"
        >
          {{ item.label }}
        </span>
        <el-icon v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">
          <ArrowRight />
        </el-icon>
      </template>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.account-breadcrumb {
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.breadcrumb-item {
  font-size: 14px;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  color: #606266;
  line-height: 22px;

  &.clickable {
    color: #0048FF;
    cursor: pointer;

    &:hover {
      color: #4080FF;
    }
  }

  &.active {
    color: #303133;
    font-weight: 500;
  }
}

.breadcrumb-separator {
  margin: 0 8px;
  font-size: 14px;
  color: #909399;
}
</style>
