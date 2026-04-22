<script setup>
import { ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import SectionTitle from '../components/SectionTitle.vue'
import AmbientBackground from '../components/AmbientBackground.vue'
import FanCard from './components/FanCard.vue'
import MetricsGrid from './components/MetricsGrid.vue'
import HitPostsCarousel from './components/HitPostsCarousel.vue'
import EngagementCard from './components/EngagementCard.vue'
import ChartCard from './components/ChartCard.vue'

// 数据状态管理
const updateDate = ref('2026年03月18日')

// 粉丝概况数据
const fanData = ref({
  total: 1343592,
  weeklyNew: 1343,
  weeklyGrowthRate: 12.5,
  trendData: [20, 25, 23, 30, 140, 160, 155]
})

// 核心 5 指标
const coreMetrics = ref([
  { label: '贴文总量', total: 1343592, recentAdd: 84, unit: '篇' },
  { label: '阅读总量', total: 1343592, recentAdd: 84, unit: '次' },
  { label: '点赞总量', total: 1343592, recentAdd: 84, unit: '次' },
  { label: '评论总量', total: 1343592, recentAdd: 84, unit: '次' },
  { label: '转发总量', total: 1343592, recentAdd: 84, unit: '次' }
])

// 行为及增量分析
const engagementData = ref([
  { label: '历史浏览总量', total: 1343592, recentAdd: '84 M', progress: 45 },
  { label: '烘托点赞总量', total: 1343592, recentAdd: '84 M', progress: 55 },
  { label: '烘托评论总量', total: 1343592, recentAdd: '84 M', progress: 30 },
  { label: '烘托转发总量', total: 1343592, recentAdd: '84 M', progress: 20 }
])

// 爆款排行榜数据
const hitPosts = ref([
  { id: 1, hotLabel: 'HOT 1', badgeColor: 'linear-gradient(90deg, #ff4b2b 0%, #ff416c 100%)', title: '2026年，世界和平世界和平世界和平世界和平世界...', views: '120k', likes: '32w', comments: '3435', shares: '33w' },
  { id: 2, hotLabel: 'HOT 2', badgeColor: 'linear-gradient(90deg, #f7b733 0%, #fc4a1a 100%)', title: '人工智能如何重新定义未来的数字生活边界探讨...', views: '115k', likes: '28w', comments: '2980', shares: '25w' },
  { id: 3, hotLabel: 'HOT 3', badgeColor: 'linear-gradient(90deg, #00f0ff 0%, #0080ff 100%)', title: '清洁能源技术突破：实现工业零碳排放新路径...', views: '98k', likes: '21w', comments: '1850', shares: '18w' },
  { id: 4, hotLabel: 'HOT 4', badgeColor: 'linear-gradient(90deg, #b057ff 0%, #7000ff 100%)', title: '火星开拓计划：人类建立地外基地的初步构想...', views: '85k', likes: '18w', comments: '1240', shares: '15w' },
  { id: 5, hotLabel: 'HOT 5', badgeColor: 'linear-gradient(90deg, #ff9900 0%, #d47000 100%)', title: '量子计算商用化落地，将给传统行业带来哪些冲击...', views: '76k', likes: '15w', comments: '980', shares: '12w' },
  { id: 6, hotLabel: 'HOT 6', badgeColor: 'linear-gradient(90deg, #00ff9d 0%, #00b36e 100%)', title: '2026年全球智能穿戴设备销量突破新高分析报告...', views: '62k', likes: '11w', comments: '840', shares: '9w' }
])

// 折线图数据
const lineChartData = ref({
  legend: ['阅读增长', '点赞增长', '评论增长', '转发增长'],
  xAxis: ['09-01', '09-07', '09-15', '10-01', '10-07', '10-15', '10-30'],
  series: [
    { name: '阅读增长', data: [1200, 1320, 1010, 1340, 900, 2300, 2100], color: '#00f0ff' },
    { name: '点赞增长', data: [2200, 1820, 1910, 2340, 2900, 3300, 3100], color: '#00ff9d' },
    { name: '评论增长', data: [150, 232, 201, 154, 190, 330, 410], color: '#ff416c' },
    { name: '转发增长', data: [320, 332, 301, 334, 390, 330, 320], color: '#ff9900' }
  ]
})

// 饼图数据
const pieChartData = ref({
  name: '占比分布',
  data: [
    { value: 1048, name: '浏览增量', color: '#ff416c' },
    { value: 735, name: '评论增量', color: '#ff9900' },
    { value: 580, name: '点赞增量', color: '#00ff9d' },
    { value: 484, name: '转发增量', color: '#00f0ff' }
  ]
})
</script>

<template>
  <div class="dashboard-wrapper">
    <AmbientBackground />

    <div class="dashboard-container">
      <!-- 页面标题 -->
      <PageHeader title="发声账号运营全景看板" :update-time="updateDate" />

      <!-- 顶部数据网格 -->
      <div class="top-dashboard-grid">
        <!-- 粉丝概况卡片 -->
        <FanCard
          :total="fanData.total"
          :weekly-new="fanData.weeklyNew"
          :weekly-growth-rate="fanData.weeklyGrowthRate"
          :trend-data="fanData.trendData"
        />

        <div>
          <!-- 5 指标网格 -->
          <MetricsGrid :metrics="coreMetrics" />

          <!-- 爆款贴文轮播 -->
          <HitPostsCarousel :posts="hitPosts" />
        </div>
      </div>

      <!-- 分区标题 -->
      <SectionTitle title="烘托行为及增长分析" simple />

      <!-- 行为增量卡片 -->
      <EngagementCard :data="engagementData" />

      <!-- 图表区域 -->
      <div class="charts-2-grid">
        <ChartCard
          title="行为增量分析"
          chart-type="line"
          :chart-data="lineChartData"
        />
        <ChartCard
          title="本周各项烘托占比分布"
          chart-type="pie"
          :chart-data="pieChartData"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  --text-main: #ffffff;
  --text-muted: #94a3b8;
  --accent-cyan: #00f0ff;
  --accent-yellow: #ffd700;
  --accent-green: #00ff9d;
  --accent-purple: #b057ff;
  --accent-orange: #ff9900;
  --accent-red: #ff416c;

  color: var(--text-main);
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  font-size: 16px;
  position: relative;
  font-family: 'Inter', system-ui, sans-serif;
}

.dashboard-container {
  flex: 1;
  padding: 20px 40px 40px 40px;
  overflow-y: auto;
  position: relative;
  z-index: 5;
  scrollbar-width: none;
}

.dashboard-container::-webkit-scrollbar {
  display: none;
}

.top-dashboard-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.charts-2-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}
</style>