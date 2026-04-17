<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, Document, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 菜单项对应的路由路径
const menuRoutes = {
  // '资源概览': '/network-warfare-resource/overview',
  '社交平台': '/network-warfare-resource/social',
  '即时通讯': '/network-warfare-resource/instant-messaging',
  '博客论坛': '/network-warfare-resource/blog-forum',
  '电子邮件': '/network-warfare-resource/email',
  '专用设备': '/network-warfare-resource/device',
  '手机卡号': '/network-warfare-resource/phone',
  '网络代理': '/network-warfare-resource/proxy',
  '电信资源': '/network-warfare-resource/telecom',
  '数据导入': '/network-warfare-resource/data-import'
}

// 菜单配置
const sections = [
  {
    title: '资源概览',
    icon: 'menu',
    hasArrow: false,
    children: []
  },
  {
    title: '账号资源',
    icon: 'document',
    hasArrow: true,
    children: ['社交平台', '即时通讯', '博客论坛', '电子邮件']
  },
  {
    title: '基础资源',
    icon: 'document',
    hasArrow: true,
    children: ['专用设备', '手机卡号', '网络代理', '电信资源']
  },
  {
    title: '运营数据概览',
    icon: 'document',
    hasArrow: false,
    children: []
  },
  {
    title: '数据导入',
    icon: 'document',
    hasArrow: false,
    children: []
  }
]

// 展开状态
const expandedSections = ref(['账号资源', '基础资源'])

// 当前激活的二级菜单
const activeMenu = ref('社交平台')

// 根据当前路由确定激活菜单
const setActiveMenuByRoute = () => {
  const currentPath = route.path
  for (const [name, path] of Object.entries(menuRoutes)) {
    if (path === currentPath) {
      activeMenu.value = name
      // 确保父级菜单展开
      const parentSection = sections.find(s => s.children.includes(name))
      if (parentSection && !expandedSections.value.includes(parentSection.title)) {
        expandedSections.value.push(parentSection.title)
      }
      break
    }
  }
  // 处理一级菜单路由（如数据导入）
  for (const section of sections) {
    if (section.children.length === 0 && menuRoutes[section.title] === currentPath) {
      activeMenu.value = section.title
      break
    }
  }
}

// 判断某个分组是否包含激活的菜单
const isSectionActive = (section) => {
  // 如果是没有子菜单的项，判断是否直接匹配
  if (section.children.length === 0) {
    return activeMenu.value === section.title
  }
  return section.children.includes(activeMenu.value)
}

// 判断某个分组是否展开
const isSectionExpanded = (section) => {
  return expandedSections.value.includes(section.title)
}

// 切换分组展开/收起
const toggleSection = (section) => {
  // 无箭头的菜单项，直接跳转
  if (!section.hasArrow) {
    activeMenu.value = section.title
    const path = menuRoutes[section.title]
    if (path) {
      router.push(path)
    }
    return
  }

  const index = expandedSections.value.indexOf(section.title)
  if (index > -1) {
    expandedSections.value.splice(index, 1)
  } else {
    expandedSections.value.push(section.title)
  }
}

// 点击二级菜单
const handleMenuClick = (menuName) => {
  activeMenu.value = menuName
  const path = menuRoutes[menuName]
  if (path) {
    router.push(path)
  }
}

// 监听路由变化
watch(() => route.path, setActiveMenuByRoute)

onMounted(() => {
  setActiveMenuByRoute()
})
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <div v-for="section in sections" :key="section.title" class="section">
        <!-- 一级菜单 -->
        <div
          :class="['section-row', { active: isSectionActive(section) }]"
          @click="toggleSection(section)"
        >
          <div class="section-left">
            <el-icon class="section-icon">
              <Menu v-if="section.icon === 'menu'" />
              <Document v-else />
            </el-icon>
            <span class="section-title">{{ section.title }}</span>
          </div>
          <el-icon
            v-if="section.hasArrow"
            :class="['section-arrow', { expanded: isSectionExpanded(section) }]"
          >
            <ArrowDown />
          </el-icon>
        </div>

        <!-- 二级菜单 -->
        <div v-if="section.children.length && isSectionExpanded(section)" class="children">
          <div
            v-for="child in section.children"
            :key="child"
            :class="['child-row', { active: activeMenu === child }]"
            @click="handleMenuClick(child)"
          >
            {{ child }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  flex: 0 0 200px;
  background: #080027;
  border-right: 1px solid #414243;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.36);
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-top: 12px;
}

.section {
  display: flex;
  flex-direction: column;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 46px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &.active {
    .section-title {
      color: #1677ff;
    }

    .section-icon {
      color: #1677ff;
    }

    .section-arrow {
      color: #1677ff;
    }
  }
}

.section-left {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.section-icon {
  font-size: 18px;
  color: #e5eaf3;
}

.section-title {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #e5eaf3;
  white-space: nowrap;
}

.section-arrow {
  font-size: 12px;
  color: #e5eaf3;
  transition: transform 0.2s ease;

  &.expanded {
    transform: rotate(180deg);
  }
}

.children {
  display: flex;
  flex-direction: column;
}

.child-row {
  min-height: 46px;
  padding: 12px 20px 12px 40px;
  color: #e5eaf3;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: rgba(236, 245, 255, 0.05);
  }

  &.active {
    background: rgba(236, 245, 255, 0.1);
    color: #1677ff;

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
</style>
