<script setup>
/**
 * @description 账号详情页左侧锚点菜单组件
 * @date 2024-04-08
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Document } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 所有可能的菜单
const allMenuItems = [
  { id: 'virtual-persona', title: '虚拟人设信息' },
  { id: 'account-ops', title: '账号运维信息' },
  { id: 'account-fans-chart', title: '账号粉丝情况' },
  { id: 'post-behavior', title: '发帖行为记录' },
  { id: 'boost-record', title: '助推烘托记录' },
  { id: 'appeal-record', title: '申诉/替换记录' }
]

// 根据来源和账号类型计算可见菜单
const menuItems = computed(() => {
  const from = route.query.from || ''
  const accountType = route.query.accountType || ''

  // 社交平台
  if (from.includes('/social')) {
    // 采集账号：只显示虚拟人设信息、账号运维信息
    if (accountType === '采集') {
      return [
        { id: 'virtual-persona', title: '虚拟人设信息' },
        { id: 'account-ops', title: '账号运维信息' }
      ]
    }
    // 贴靠发声账号：显示所有菜单
    return allMenuItems
  }

  // 即时通讯：显示虚拟人设信息、账号运维信息、申诉/替换记录
  if (from.includes('/instant-messaging')) {
    return [
      { id: 'virtual-persona', title: '虚拟人设信息' },
      { id: 'account-ops', title: '账号运维信息' },
      { id: 'appeal-record', title: '申诉/替换记录' }
    ]
  }

  // 博客论坛：显示虚拟人设信息、账号运维信息、申诉/替换记录
  if (from.includes('/blog-forum')) {
    return [
      { id: 'virtual-persona', title: '虚拟人设信息' },
      { id: 'account-ops', title: '账号运维信息' },
      { id: 'appeal-record', title: '申诉/替换记录' }
    ]
  }

  // 电子邮箱：只显示虚拟人设信息
  if (from.includes('/email')) {
    return [
      { id: 'virtual-persona', title: '虚拟人设信息' }
    ]
  }

  // 默认显示所有菜单
  return allMenuItems
})

// 当前激活菜单
const activeMenu = ref('virtual-persona')

// 点击菜单 - 锚点跳转
const handleMenuClick = (menuId) => {
  activeMenu.value = menuId
  const element = document.getElementById(menuId)
  if (element) {
    const container = document.querySelector('.page-main')
    if (container) {
      const offsetTop = element.offsetTop - 16 // 减去页面顶部的padding
      container.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }
}

// 滚动监听 - 自动更新激活状态
const handleScroll = () => {
  const container = document.querySelector('.page-main')
  if (!container) return

  const scrollTop = container.scrollTop
  const sections = menuItems.value.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
  })).filter(s => s.element)

  // 找到当前滚动位置对应的section
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element) {
      const offsetTop = section.element.offsetTop - 80 // 偏移量
      if (scrollTop >= offsetTop) {
        activeMenu.value = section.id
        return
      }
    }
  }

  // 如果滚动到顶部，激活第一个
  if (sections.length > 0) {
    activeMenu.value = sections[0].id
  }
}

let scrollContainer = null

onMounted(() => {
  scrollContainer = document.querySelector('.page-main')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <aside class="account-sidebar">
    <div class="sidebar-content">
      <!-- 菜单列表 -->
      <nav class="menu-list">
        <div
          v-for="item in menuItems"
          :key="item.id"
          :class="['menu-item', { active: activeMenu === item.id }]"
          @click="handleMenuClick(item.id)"
        >
          <div class="menu-left">
            <el-icon class="menu-icon">
              <Document />
            </el-icon>
            <span class="menu-title">{{ item.title }}</span>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.account-sidebar {
  width: 200px;
  flex: 0 0 200px;
  background: #080027;
  border-right: 1px solid #414243;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.36);
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 12px;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &.active {
    background: rgba(236, 245, 255, 0.1);

    .menu-title {
      color: #1677ff;
    }

    .menu-icon {
      color: #1677ff;
    }

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #1677ff;
    }
  }
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.menu-icon {
  width: 18px;
  height: 18px;
  font-size: 18px;
  color: #e5eaf3;
}

.menu-title {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #e5eaf3;
  white-space: nowrap;
}
</style>
