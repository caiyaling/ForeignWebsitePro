<template>
  <div class="dashboard-wrapper">
    <div class="ambient-light"></div>
    <div class="ambient-highlight"></div>
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>

    <div class="dashboard-container">
      
      <div class="page-header-wrapper">
        <div class="page-header">
          <div class="page-title-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="136" height="10" viewBox="0 0 136 10" fill="none" class="title-deco">
              <path d="M87.0439 9.28516H125.861L135.271 0H96.4541L87.0439 9.28516ZM58.8135 9.28516H76.458L85.8682 0H68.2236L58.8135 9.28516ZM34.1113 9.28516H47.1533L57.6377 0H44.5957L34.1113 9.28516ZM15.291 9.28516H24.7012L34.1113 0H24.7012L15.291 9.28516ZM0 9.28516H4.70508L14.1152 0H9.41016L0 9.28516Z" fill="url(#paint0_linear_273_17560)"/>
              <defs><linearGradient id="paint0_linear_273_17560" x1="123.713" y1="8.56379" x2="9.46027" y2="8.56379" gradientUnits="userSpaceOnUse"><stop stop-color="#00F2EF"/><stop offset="1" stop-color="#00E0DB" stop-opacity="0.287027"/></linearGradient></defs>
            </svg>
            <span>发声账号运营全景看板</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="136" height="10" viewBox="0 0 136 10" fill="none" class="title-deco flipped">
              <path d="M87.0439 9.28516H125.861L135.271 0H96.4541L87.0439 9.28516ZM58.8135 9.28516H76.458L85.8682 0H68.2236L58.8135 9.28516ZM34.1113 9.28516H47.1533L57.6377 0H44.5957L34.1113 9.28516ZM15.291 9.28516H24.7012L34.1113 0H24.7012L15.291 9.28516ZM0 9.28516H4.70508L14.1152 0H9.41016L0 9.28516Z" fill="url(#paint0_linear_273_17560)"/>
            </svg>
          </div>
        </div>
        <div class="update-time">数据更新至: {{ updateDate }}</div>
      </div>

      <div class="top-dashboard-grid">
        
        <div class="card fan-card" @mousemove="handleMouseMove">
          <div class="fan-top-section">
            <div class="title-wrap">
              <div class="section-dot"></div>
              <div class="card-title">粉丝概况</div>
            </div>
            <div class="sub-label" style="margin-top: 16px;">当前粉丝总数</div>
            <div class="stat-num text-yellow" style="font-size: 38px; margin: 8px 0;">{{ formatNumber(fanData.total) }}</div>
          </div>

          <div class="fan-inner-box">
            <div class="fan-inner-header">
              <span>本周新增粉丝</span>
              <span class="percent">{{ fanData.weeklyGrowthRate }}%</span>
            </div>
            <div class="fan-inner-content">
              <div class="stat-num text-cyan">+{{ formatNumber(fanData.weeklyNew) }}</div>
            </div>
            <div ref="fanChartRef" class="mini-chart-container"></div>
          </div>
        </div>

        <div>
          <div class="metrics-5-grid">
            <div v-for="(metric, index) in coreMetrics" :key="index" class="card metric-mini-card" @mousemove="handleMouseMove">
              <div class="card-title">{{ metric.label }} <span class="title-muted">（历史总额）</span></div>
              <div class="stat-num">{{ formatNumber(metric.total) }}</div>
              <div class="metric-footer">
                <span class="sub-label">近2周</span> 
                <span class="text-yellow">+{{ metric.recentAdd }}</span> 
                <span class="sub-label">{{ metric.unit }}</span>
              </div>
            </div>
          </div>

          <div class="card hit-posts-card" @mousemove="handleMouseMove" @mouseenter="pauseCarousel" @mouseleave="startCarousel">
            <div class="header-row">
              <div class="title-wrap">
                <div class="section-dot"></div>
                <div class="card-title">爆款贴文排行榜</div>
              </div>
              <div class="more-btn">更多 &gt;</div>
            </div>
            
            <div class="hit-posts-carousel">
              <div class="nav-arrow" @click="prevPage">&lt;</div>
              <div class="carousel-viewport">
                <div class="hit-posts-track" :style="{ transform: `translateX(-${carouselCurrentPage * 100}%)` }">
                  <div class="page-slide" v-for="(pagePosts, pageIndex) in chunkedPosts" :key="pageIndex">
                    
                    <div class="post-item" v-for="post in pagePosts" :key="post.id">
                      <div class="hot-badge" :style="{ background: post.badgeColor }">{{ post.hotLabel }}</div>
                      <div class="post-img-placeholder">
                        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <div class="post-content">
                        <div class="post-title">{{ post.title }}</div>
                        <div class="post-stats-row">
                          <div class="stat-col"><span class="label">阅读量</span><span class="val">{{ post.views }}</span></div>
                          <div class="stat-col"><span class="label">点赞量</span><span class="val">{{ post.likes }}</span></div>
                          <div class="stat-col"><span class="label">评论量</span><span class="val">{{ post.comments }}</span></div>
                          <div class="stat-col"><span class="label">转发量</span><span class="val">{{ post.shares }}</span></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div class="nav-arrow" @click="nextPage">&gt;</div>
            </div>
            
            <div class="carousel-dots">
              <span 
                v-for="(_, index) in chunkedPosts" 
                :key="index" 
                class="dot" 
                :class="{ active: index === carouselCurrentPage }"
                @click="goToPage(index)">
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-title-wrap">
        <div class="section-title-deco-arrow"></div>
        <div class="section-title">烘托行为及增长分析</div>
        <div class="section-title-deco-line"></div>
      </div>
      
      <div class="engagement-4-grid">
        <div v-for="(item, index) in engagementData" :key="index" class="card engagement-card" @mousemove="handleMouseMove">
          <div class="sub-label" style="color: var(--text-muted); margin-bottom:12px;">{{ item.label }}</div>
          <div class="stat-num">{{ formatNumber(item.total) }}</div>
          <div class="progress-row">
            <div class="progress-track"><div class="progress-fill bg-cyan" :style="{ width: item.progress + '%' }"></div></div>
            <div class="progress-text"><span class="sub-label">近2周</span> <span class="text-cyan">+{{ item.recentAdd }}</span></div>
          </div>
        </div>
      </div>

      <div class="charts-2-grid">
        <div class="card" @mousemove="handleMouseMove">
          <div class="title-wrap" style="margin-bottom: 16px;">
            <div class="section-dot"></div><div class="card-title">行为增量分析</div>
          </div>
          <div ref="lineChartRef" class="main-chart-container"></div>
        </div>
        
        <div class="card" @mousemove="handleMouseMove">
          <div class="title-wrap" style="margin-bottom: 16px;">
            <div class="section-dot"></div><div class="card-title">本周各项烘托占比分布</div>
          </div>
          <div ref="pieChartRef" class="main-chart-container"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, shallowRef } from 'vue';
import * as echarts from 'echarts';

// =======================
// 数据状态管理 (可由 API 替换)
// =======================

const updateDate = ref('2026年03月18日');

// 1. 粉丝概况数据
const fanData = ref({
  total: 1343592,
  weeklyNew: 1343,
  weeklyGrowthRate: 12.5,
  trendData: [20, 25, 23, 30, 140, 160, 155] // 图表渲染数据
});

// 2. 核心 5 指标
const coreMetrics = ref([
  { label: '贴文总量', total: 1343592, recentAdd: 84, unit: '篇' },
  { label: '阅读总量', total: 1343592, recentAdd: 84, unit: '次' },
  { label: '点赞总量', total: 1343592, recentAdd: 84, unit: '次' },
  { label: '评论总量', total: 1343592, recentAdd: 84, unit: '次' },
  { label: '转发总量', total: 1343592, recentAdd: 84, unit: '次' }
]);

// 3. 行为及增量分析 (4 进度条)
const engagementData = ref([
  { label: '历史浏览总量', total: 1343592, recentAdd: '84 M', progress: 45 },
  { label: '烘托点赞总量', total: 1343592, recentAdd: '84 M', progress: 55 },
  { label: '烘托评论总量', total: 1343592, recentAdd: '84 M', progress: 30 },
  { label: '烘托转发总量', total: 1343592, recentAdd: '84 M', progress: 20 }
]);

// 4. 爆款排行榜假数据 (共 6 条)
const hitPosts = ref([
  { id: 1, hotLabel: 'HOT 1', badgeColor: 'linear-gradient(90deg, #ff4b2b 0%, #ff416c 100%)', title: '2026年，世界和平世界和平世界和平世界和平世界...', views: '120k', likes: '32w', comments: '3435', shares: '33w' },
  { id: 2, hotLabel: 'HOT 2', badgeColor: 'linear-gradient(90deg, #f7b733 0%, #fc4a1a 100%)', title: '人工智能如何重新定义未来的数字生活边界探讨...', views: '115k', likes: '28w', comments: '2980', shares: '25w' },
  { id: 3, hotLabel: 'HOT 3', badgeColor: 'linear-gradient(90deg, #00f0ff 0%, #0080ff 100%)', title: '清洁能源技术突破：实现工业零碳排放新路径...', views: '98k', likes: '21w', comments: '1850', shares: '18w' },
  { id: 4, hotLabel: 'HOT 4', badgeColor: 'linear-gradient(90deg, #b057ff 0%, #7000ff 100%)', title: '火星开拓计划：人类建立地外基地的初步构想...', views: '85k', likes: '18w', comments: '1240', shares: '15w' },
  { id: 5, hotLabel: 'HOT 5', badgeColor: 'linear-gradient(90deg, #ff9900 0%, #d47000 100%)', title: '量子计算商用化落地，将给传统行业带来哪些冲击...', views: '76k', likes: '15w', comments: '980', shares: '12w' },
  { id: 6, hotLabel: 'HOT 6', badgeColor: 'linear-gradient(90deg, #00ff9d 0%, #00b36e 100%)', title: '2026年全球智能穿戴设备销量突破新高分析报告...', views: '62k', likes: '11w', comments: '840', shares: '9w' }
]);

// 每页 3 个，计算分割后的二维数组用于轮播
const chunkedPosts = computed(() => {
  const size = 3;
  const result = [];
  for (let i = 0; i < hitPosts.value.length; i += size) {
    result.push(hitPosts.value.slice(i, i + size));
  }
  return result;
});

// =======================
// 交互与图表控制
// =======================

// 格式化数字 (1234567 -> 1,234,567)
const formatNumber = (num) => {
  return Number(num).toLocaleString('en-US');
};

// --- 卡片悬停光效计算 ---
const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

// --- 轮播逻辑 ---
const carouselCurrentPage = ref(0);
let carouselTimer = null;

const nextPage = () => {
  carouselCurrentPage.value = (carouselCurrentPage.value + 1) % chunkedPosts.value.length;
};
const prevPage = () => {
  carouselCurrentPage.value = (carouselCurrentPage.value - 1 + chunkedPosts.value.length) % chunkedPosts.value.length;
};
const goToPage = (index) => {
  carouselCurrentPage.value = index;
};
const startCarousel = () => {
  if (!carouselTimer) {
    carouselTimer = setInterval(nextPage, 4000);
  }
};
const pauseCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
};

// --- ECharts 实例化 ---
const fanChartRef = ref(null);
const lineChartRef = ref(null);
const pieChartRef = ref(null);

const charts = shallowRef({});

const initCharts = () => {
  const colors = { cyan: '#00f0ff', green: '#00ff9d', orange: '#ff9900', red: '#ff416c', textMuted: '#94a3b8' };

  // 1. 粉丝图表
  if (fanChartRef.value) {
    const fanChart = echarts.init(fanChartRef.value);
    fanChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(5,8,16,0.9)',
        borderColor: colors.cyan,
        textStyle: { color: '#fff', fontSize: 16 },
        formatter: '{b}<br/>{marker} 新增粉丝: <span style="color:#00f0ff;font-weight:bold;">{c}</span>'
      },
      grid: { left: 0, right: 0, top: 10, bottom: -1 },
      xAxis: { type: 'category', boundaryGap: false, data: ['周一','周二','周三','周四','周五','周六','周日'], show: false },
      yAxis: { type: 'value', show: false, min: 0, max: 200 },
      series: [{
        name: '新增粉丝',
        data: fanData.value.trendData,
        type: 'line', smooth: 0.5, showSymbol: false, symbol: 'circle', symbolSize: 8,
        itemStyle: { color: colors.cyan },
        lineStyle: { color: colors.green, width: 3, shadowColor: 'rgba(0, 255, 157, 0.5)', shadowBlur: 10, shadowOffsetY: 4 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 157, 0.4)' }, { offset: 1, color: 'rgba(0, 255, 157, 0)' }
          ])
        }
      }]
    });
    charts.value.fan = fanChart;
  }

  // 2. 折线图
  if (lineChartRef.value) {
    const lineChart = echarts.init(lineChartRef.value);
    lineChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(5,8,16,0.9)', borderColor: colors.cyan, textStyle: { color: '#fff', fontSize: 16 } },
      legend: { data: ['阅读增长', '点赞增长', '评论增长', '转发增长'], bottom: 0, textStyle: { color: colors.textMuted, fontSize: 16 }, icon: 'circle' },
      grid: { left: '3%', right: '4%', top: '8%', bottom: '15%', containLabel: true },
      xAxis: { 
        type: 'category', boundaryGap: false, data: ['09-01', '09-07', '09-15', '10-01', '10-07', '10-15', '10-30'],
        axisLabel: { color: colors.textMuted, fontSize: 16 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      yAxis: { type: 'value', axisLabel: { color: colors.textMuted, fontSize: 16 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
      series: [
        { name: '阅读增长', type: 'line', smooth: true, color: colors.cyan, data: [1200, 1320, 1010, 1340, 900, 2300, 2100] },
        { name: '点赞增长', type: 'line', smooth: true, color: colors.green, data: [2200, 1820, 1910, 2340, 2900, 3300, 3100] },
        { name: '评论增长', type: 'line', smooth: true, color: colors.red, data: [150, 232, 201, 154, 190, 330, 410] },
        { name: '转发增长', type: 'line', smooth: true, color: colors.orange, data: [320, 332, 301, 334, 390, 330, 320] }
      ]
    });
    charts.value.line = lineChart;
  }

  // 3. 饼图
  if (pieChartRef.value) {
    const pieChart = echarts.init(pieChartRef.value);
    pieChart.setOption({
      tooltip: { trigger: 'item', backgroundColor: 'rgba(5,8,16,0.9)', borderColor: 'rgba(255,255,255,0.2)', textStyle: { color: '#fff', fontSize: 16 } },
      legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: colors.textMuted, fontSize: 16 }, icon: 'circle', itemGap: 20 },
      series: [{
        name: '占比分布', type: 'pie', radius: ['45%', '70%'], center: ['35%', '50%'], avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#02040a', borderWidth: 2 },
        label: { show: false }, labelLine: { show: false },
        data: [
          { value: 1048, name: '浏览增量', itemStyle: { color: colors.red } },
          { value: 735, name: '评论增量', itemStyle: { color: colors.orange } },
          { value: 580, name: '点赞增量', itemStyle: { color: colors.green } },
          { value: 484, name: '转发增量', itemStyle: { color: colors.cyan } }
        ]
      }]
    });
    charts.value.pie = pieChart;
  }
};

const handleResize = () => {
  Object.values(charts.value).forEach(chart => {
    chart && chart.resize();
  });
};

// --- 粒子系统背景逻辑 ---
const particleCanvas = ref(null);
let animationFrameId;

const initParticles = () => {
  if (!particleCanvas.value) return;
  const ctx = particleCanvas.value.getContext('2d');
  let width, height, particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * width; 
      this.y = init ? Math.random() * height : height + 10;
      this.vx = (Math.random() - 0.5) * 0.4; 
      this.vy = Math.random() * 0.3 + 0.1;
      this.size = Math.random() * 3 + 2; 
      this.baseAlpha = Math.random() * 0.3 + 0.1; 
      this.angle = Math.random() * Math.PI * 2; 
      this.angleSpeed = 0.02 + Math.random() * 0.03;
    }
    update() {
      this.x += this.vx; this.y -= this.vy; this.angle += this.angleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.angle) * 0.1;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = 'rgba(100, 240, 255, 0.9)'; 
      ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; 
    }
  }

  const resize = () => {
    width = particleCanvas.value.width = window.innerWidth; 
    height = particleCanvas.value.height = window.innerHeight;
    particles = Array.from({ length: 60 }, () => new Particle());
  };
  window.addEventListener('resize', resize);
  resize();
  
  const loop = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    animationFrameId = requestAnimationFrame(loop);
  }; 
  loop();
};

// =======================
// Vue 生命周期
// =======================
onMounted(() => {
  initCharts();
  initParticles();
  startCarousel();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  pauseCarousel();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  Object.values(charts.value).forEach(chart => {
    chart && chart.dispose();
  });
});
</script>

<style scoped>
/* 此处的 CSS 完全基于前述 HTML 版本的提取
  使用 scoped 保证组件样式隔离，但在需要覆盖 ECharts 时可去掉 scoped 或使用 :deep()
*/

.dashboard-wrapper {
  --bg-color: #02040a;
  --text-main: #ffffff;
  --text-muted: #94a3b8;
  --accent-cyan: #00f0ff;
  --accent-yellow: #ffd700;
  --accent-green: #00ff9d;
  --accent-purple: #b057ff;
  --accent-orange: #ff9900;
  --accent-red: #ff416c;
  
  background-color: var(--bg-color); color: var(--text-main);
  height: 100vh; width: 100vw; overflow: hidden; display: flex; font-size: 16px; position: relative;
  background-image: 
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      radial-gradient(circle at 50% 0%, #081029 0%, #02040a 100%);
  background-size: 50px 50px, 50px 50px, 100% 100%;
  font-family: 'Inter', system-ui, sans-serif;
}

.ambient-light {
  position: absolute; top: -25vh; left: 50%; transform: translateX(-50%); width: 120vw; height: 80vh;
  background: radial-gradient(50% 50% at 50% 50%, rgba(30, 50, 120, 0.3) 0%, rgba(10, 15, 30, 0.1) 60%, transparent 100%);
  filter: blur(80px); z-index: 0; pointer-events: none;
}
.ambient-highlight {
  position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 60vw; height: 300px;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 100%);
  filter: blur(60px); z-index: 0; pointer-events: none; mix-blend-mode: screen;
}
.particle-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }

.dashboard-container { flex: 1; padding: 20px 40px 40px 40px; overflow-y: auto; position: relative; z-index: 5; scrollbar-width: none;}
.dashboard-container::-webkit-scrollbar { display: none; }

/* Header & Titles */
.page-header-wrapper { display: flex; justify-content: center; align-items: flex-end; margin-bottom: 30px; position: relative; }
.page-title-text {
  font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #fff;
  text-shadow: 0 0 20px rgba(0,240,255,0.3); background: linear-gradient(to bottom, #ffffff, #d0eaff);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: flex; align-items: center; gap: 20px;
}
.title-deco { width: 160px; height: 14px; filter: drop-shadow(0 0 5px rgba(0, 242, 239, 0.5)); }
.title-deco.flipped { transform: scaleX(-1); }
.update-time { position: absolute; right: 0; bottom: 5px; font-size: 16px; color: var(--text-muted); opacity: 0.8; }

.section-title-wrap { display: flex; align-items: center; gap: 12px; margin: 24px 0 16px; }
.section-title-deco-arrow { width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 10px solid var(--accent-cyan); filter: drop-shadow(0 0 4px var(--accent-cyan));}
.section-title { font-size: 20px; font-weight: bold; color: var(--text-main); white-space: nowrap;}
.section-title-deco-line { flex: 1; height: 2px; background: linear-gradient(90deg, rgba(0,240,255,0.6), transparent); margin-left: 8px;}
.section-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-cyan); box-shadow: 0 0 6px var(--accent-cyan); }
.title-wrap { display: flex; align-items: center; gap: 8px; }

/* Cards 通用 */
.card {
  --mouse-x: -1000px; --mouse-y: -1000px;
  border: 1px solid rgba(67, 236, 255, 0.3); border-radius: 8px;
  background: radial-gradient(54.42% 32.41% at 52.05% 0%, rgba(0, 255, 246, 0.15) 0%, rgba(0, 225, 255, 0.00) 100%), linear-gradient(348deg, rgba(0, 27, 64, 0.40) 7.31%, rgba(0, 187, 255, 0.10) 90.95%);
  box-shadow: 0 4px 20px 20px rgba(0, 11, 37, 0.02);
  padding: 20px 24px; position: relative; backdrop-filter: blur(5px);
  display: flex; flex-direction: column; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.card::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(0, 240, 255, 0.2), transparent 50%);
  z-index: 1; opacity: 0; transition: opacity 0.3s; pointer-events: none; mix-blend-mode: overlay;
}
.card:hover::before { opacity: 1; }
.card:hover { transform: translateY(-2px); border-color: rgba(67, 236, 255, 0.8); box-shadow: 0 0 30px rgba(67, 236, 255, 0.25); }

/* Grids */
.top-dashboard-grid { display: grid; grid-template-columns: 280px 1fr; gap: 24px; margin-bottom: 24px; }
.metrics-5-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
.engagement-4-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
.charts-2-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; margin-bottom: 40px;}

/* Typography */
.card-title { font-size: 16px; font-weight: bold; color: #fff; }
.stat-num { font-size: 32px; font-weight: bold; font-family: 'Segoe UI', sans-serif; color: #00EAFF; margin: 8px 0;}
.text-cyan { color: var(--accent-cyan); }
.text-green { color: var(--accent-green); }
.text-yellow { color: var(--accent-yellow); font-weight: bold; text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);}
.sub-label { color: var(--text-muted); font-size: 16px; } 

/* 粉丝概况卡片 */
.fan-card { padding: 24px; justify-content: flex-start; gap: 20px;}
.fan-top-section { display: flex; flex-direction: column; }
.fan-inner-box {
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
  flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; padding: 14px; 
}
.fan-inner-header {
  background: rgba(0, 150, 255, 0.15); border-radius: 6px; padding: 10px 16px;
  display: flex; justify-content: space-between; align-items: center; font-size: 16px; color: rgba(255,255,255,0.9); z-index: 2; 
}
.fan-inner-header .percent { color: var(--accent-cyan); font-weight: bold; font-size: 18px;}
.fan-inner-content { padding: 20px 8px 0 8px; display: flex; flex-direction: column; flex: 1; position: relative; z-index: 2; pointer-events: none;}
.fan-inner-content .stat-num { margin: 0; font-size: 32px;}
.mini-chart-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 130px; z-index: 1; }

/* 5指标微卡片 */
.metric-mini-card { padding: 16px 14px; gap: 8px; justify-content: center; position: relative; }
.metric-mini-card .card-title { font-size: 16px; font-weight: normal; color: rgba(255, 255, 255, 0.65); margin-bottom: 8px; display: flex; align-items: baseline; gap: 4px; white-space: nowrap; }
.metric-mini-card .title-muted { font-size: 16px; color: rgba(255, 255, 255, 0.65); font-weight: normal; } 
.metric-mini-card .stat-num { margin: 4px 0 12px 0; display: block; }
.metric-footer { font-size: 16px; display: flex; align-items: center; gap: 6px; } 

/* 爆款贴文 */
.hit-posts-card { flex: 1; padding: 20px 24px;}
.header-row { display: flex; justify-content: space-between; align-items: center;}
.more-btn { color: var(--accent-cyan); cursor: pointer; font-size: 16px; }
.hit-posts-carousel { display: flex; align-items: center; gap: 16px; margin-top: 12px; width: 100%;}
.carousel-viewport { flex: 1; overflow: hidden; width: 100%; border-radius: 8px; }
.hit-posts-track { display: flex; width: 100%; transition: transform 0.5s ease-in-out; }
.page-slide { flex: 0 0 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.nav-arrow { font-size: 24px; color: var(--accent-cyan); cursor: pointer; opacity: 0.8; transition: 0.2s; padding: 0 10px; user-select: none;}
.nav-arrow:hover { opacity: 1; transform: scale(1.2);}
.post-item { 
  background: linear-gradient(180deg, rgba(16, 35, 75, 0.6) 0%, rgba(10, 20, 45, 0.8) 100%);
  border: 1px solid rgba(0, 240, 255, 0.5); border-radius: 8px; display: flex; flex-direction: column; transition: 0.3s;
  position: relative; overflow: hidden;
}
.post-item:hover { border-color: rgba(0, 240, 255, 0.9); box-shadow: 0 0 15px rgba(0, 240, 255, 0.2); }
.post-img-placeholder {
  width: 100%; height: 130px; position: relative;
  background: radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%); 
  display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.post-img-placeholder svg { width: 40px; height: 40px; stroke: rgba(255,255,255,0.3); }
.hot-badge { position: absolute; top: 0; left: 0; color: #fff; font-size: 16px; font-weight: bold; padding: 4px 10px; border-radius: 0 0 8px 0; z-index: 10; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);}
.post-content { padding: 16px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;}
.post-title { font-size: 16px; line-height: 1.6; color: #fff; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; opacity: 0.9; margin-bottom: 16px;}
.post-stats-row { display: flex; justify-content: space-between; align-items: center; text-align: center;}
.stat-col { flex: 1; display: flex; flex-direction: column; gap: 8px; border-right: 1px solid rgba(255, 255, 255, 0.15); }
.stat-col:last-child { border-right: none; }
.stat-col .label { font-size: 16px; color: var(--text-muted); }
.stat-col .val { font-size: 18px; font-weight: bold; color: var(--accent-cyan); }
.carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
.carousel-dots .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(0, 240, 255, 0.3); cursor: pointer;}
.carousel-dots .dot.active { background: var(--accent-cyan); box-shadow: 0 0 6px var(--accent-cyan); }

/* 行为增量 */
.engagement-card { justify-content: space-between; gap: 16px; padding: 20px 24px;}
.progress-row { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
.progress-track { flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; }
.progress-text { display: flex; align-items: center; gap: 6px; font-weight: bold; white-space: nowrap; font-size: 16px;}
.bg-cyan { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }

/* Main Charts */
.main-chart-container { width: 100%; height: 320px; margin-top: 16px;}
</style>