<script setup>
import { ref } from 'vue'
import PageLayout from '@/pages/NetworkWarfareResourse/components/PageLayout.vue'
import AmbientBackground from '@/pages/NetworkWarfareResourse/components/AmbientBackground.vue'
import BreadcrumbNav from './components/BreadcrumbNav.vue'
import PostListPanel from './components/PostListPanel.vue'

// 数据更新时间
const updateDate = ref('2026年03月18日')

// 面包屑配置
const breadcrumbItems = [
  { label: '运营数据概览', path: '/network-warfare-resource/operation-overview' },
  { label: '详情', active: true }
]

// Mock 列表数据生成器
const generateMockData = (prefix, count = 15) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}_${i + 1}`,
    title: '2026年，世界和平世界和平世界和平世界和平世界和平世界和平世界和平世界和平...',
    views: '120k',
    likes: '32w',
    comments: '3435',
    shares: '33w'
  }))
}

// 近一个月 & 历史数据源
const recentPosts = ref(generateMockData('recent'))
const historyPosts = ref(generateMockData('history'))
</script>

<template>
  <page-layout>
    <div class="hit-posts-detail-content">
      <!-- 背景光效与粒子 -->
      <ambient-background />

      <!-- 核心内容区 -->
      <div class="dashboard-container">
        <!-- 页面头部：面包屑 | 标题 | 更新时间 -->
        <div class="page-header-row">
          <breadcrumb-nav :items="breadcrumbItems" />
          <div class="page-title-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="136" height="10" viewBox="0 0 136 10" fill="none" class="title-deco">
              <path d="M87.0439 9.28516H125.861L135.271 0H96.4541L87.0439 9.28516ZM58.8135 9.28516H76.458L85.8682 0H68.2236L58.8135 9.28516ZM34.1113 9.28516H47.1533L57.6377 0H44.5957L34.1113 9.28516ZM15.291 9.28516H24.7012L34.1113 0H24.7012L15.291 9.28516ZM0 9.28516H4.70508L14.1152 0H9.41016L0 9.28516Z" fill="url(#paint0_linear_hitposts_title)"/>
              <defs>
                <linearGradient id="paint0_linear_hitposts_title" x1="123.713" y1="8.56379" x2="9.46027" y2="8.56379" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#00F2EF"/>
                  <stop offset="1" stop-color="#00E0DB" stop-opacity="0.287027"/>
                </linearGradient>
              </defs>
            </svg>
            <span>发声账号运营全景看板</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="136" height="10" viewBox="0 0 136 10" fill="none" class="title-deco flipped">
              <path d="M87.0439 9.28516H125.861L135.271 0H96.4541L87.0439 9.28516ZM58.8135 9.28516H76.458L85.8682 0H68.2236L58.8135 9.28516ZM34.1113 9.28516H47.1533L57.6377 0H44.5957L34.1113 9.28516ZM15.291 9.28516H24.7012L34.1113 0H24.7012L15.291 9.28516ZM0 9.28516H4.70508L14.1152 0H9.41016L0 9.28516Z" fill="url(#paint1_linear_hitposts_title)"/>
              <defs>
                <linearGradient id="paint1_linear_hitposts_title" x1="123.713" y1="8.56379" x2="9.46027" y2="8.56379" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#00F2EF"/>
                  <stop offset="1" stop-color="#00E0DB" stop-opacity="0.287027"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="update-time">数据更新至: {{ updateDate }}</div>
        </div>

        <!-- 详情两列布局 -->
        <div class="detail-grid">
          <!-- 左侧面板：近一个月 -->
          <post-list-panel title="近一个月爆款贴文" :posts="recentPosts" />

          <!-- 右侧面板：历史 -->
          <post-list-panel title="历史爆款贴文" :posts="historyPosts" />
        </div>
      </div>
    </div>
  </page-layout>
</template>

<style lang="scss" scoped>
.hit-posts-detail-content {
  height: 100%;
  position: relative;
  background-color: #02040a;
  color: #ffffff;
  font-size: 16px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    radial-gradient(circle at 50% 0%, #081029 0%, #02040a 100%);
  background-size: 50px 50px, 50px 50px, 100% 100%;

  // 隐藏原生滚动条
  * {
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.dashboard-container {
  height: 100%;
  padding: 20px 40px 40px 40px;
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 40px;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.page-title-text {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  background: linear-gradient(to bottom, #ffffff, #d0eaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-deco {
  width: 160px;
  height: 14px;
  filter: drop-shadow(0 0 5px rgba(0, 242, 239, 0.5));
}

.title-deco.flipped {
  transform: scaleX(-1);
}

.update-time {
  font-size: 16px;
  color: #94a3b8;
  opacity: 0.8;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  flex: 1;
  min-height: 0;
}
</style>