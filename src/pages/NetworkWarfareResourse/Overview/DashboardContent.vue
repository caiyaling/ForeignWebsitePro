<template>
  <div class="dashboard-content-wrapper">
    <div class="ambient-light"></div>
    <div class="ambient-highlight"></div>

    <canvas ref="particleCanvasRef" id="particle-canvas"></canvas>

    <div class="dashboard-container">
      <PageHeader title="资源总览" />

      <!-- 账号资源总览 -->
      <AccountResourceSection :cards="accountCards" />

      <!-- 基础资源总览 -->
      <BaseResourceSection :cards="baseCards" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from './components/PageHeader.vue'
import AccountResourceSection from './components/AccountResourceSection.vue'
import BaseResourceSection from './components/BaseResourceSection.vue'
import { useParticles } from './composables/useParticles'

// 粒子系统
const { particleCanvasRef } = useParticles({ count: 60 })

// 账号资源卡片数据
const accountCards = ref([
  {
    name: '社交平台',
    icon: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
    typeCount: 6,
    totalCount: 5300,
    items: [
      { name: 'Facebook', value: 1800, percent: 34 },
      { name: 'Instagram', value: 900, percent: 17 },
      { name: 'Threads', value: 100, percent: 2 },
      { name: 'YouTube', value: 1100, percent: 21 },
      { name: 'TIKTOK', value: 1100, percent: 21 },
      { name: 'X', value: 300, percent: 6 }
    ]
  },
  {
    name: '即时通信',
    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
    typeCount: 4,
    totalCount: 1150,
    items: [
      { name: 'telegram', value: 200, percent: 17 },
      { name: 'line', value: 750, percent: 65 },
      { name: 'Teams', value: 100, percent: 8 },
      { name: 'Signal', value: 100, percent: 8 }
    ]
  },
  {
    name: '博客论坛',
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    typeCount: 3,
    totalCount: 15,
    items: [
      { name: 'PPT', value: 5, percent: 33 },
      { name: 'Dcard', value: 5, percent: 33 },
      { name: 'Pixnet', value: 5, percent: 33 }
    ]
  },
  {
    name: '电子邮箱',
    icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    typeCount: 2,
    totalCount: 200,
    items: [
      { name: 'Gmail', value: 100, percent: 50 },
      { name: 'outlook', value: 100, percent: 50 }
    ]
  }
])

// 基础资源卡片数据
const baseCards = ref([
  {
    name: '专用设备',
    icon: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
    typeCount: 2,
    totalCount: 620,
    unit: '个',
    subSections: [
      {
        title: '云手机',
        highlightValue: '500',
        suffix: '台',
        type: 'custom-progress',
        markers: [
          { value: '400', position: 40, color: '#00f0ff' },
          { value: '100', position: 90, color: '#ffd700' }
        ],
        segments: [
          { type: 'segment-blue', width: 80 },
          { type: 'segment-yellow', width: 20, left: 80 }
        ]
      },
      {
        title: '实体手机',
        highlightValue: '120',
        suffix: '台',
        type: 'progress-list',
        items: [
          { name: '苹果', value: '10台', percent: 8 },
          { name: '三星', value: '15台', percent: 12 },
          { name: '谷歌', value: '5台', percent: 4 },
          { name: '红米', value: '53台', percent: 44 },
          { name: 'Vivo', value: '20台', percent: 16 },
          { name: 'Oppo', value: '17台', percent: 14 }
        ]
      }
    ]
  },
  {
    name: '手机卡号',
    icon: '<path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><rect x="8" y="10" width="8" height="8"></rect>',
    typeCount: 2,
    totalCount: 601,
    unit: '个',
    subSections: [
      {
        title: '归属地',
        titleStyle: 'font-weight: normal; opacity: 0.6;',
        type: 'progress-list',
        items: [
          { name: '菲律宾', value: '137张', percent: 23 },
          { name: '香港', value: '464张', percent: 77 }
        ]
      },
      {
        title: '卡号类型',
        titleStyle: 'font-weight: normal; opacity: 0.6;',
        type: 'progress-list',
        items: [
          { name: '流量卡', value: '100张', percent: 20 },
          { name: '通讯卡', value: '501张', percent: 80 }
        ]
      }
    ]
  },
  {
    name: '网络代理',
    icon: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
    typeCount: 2,
    totalCount: 10700,
    unit: '个',
    subSections: [
      {
        title: '静态代理',
        highlightValue: '700',
        suffix: '个',
        type: 'custom-progress',
        markers: [
          { value: '400', position: 28, color: '#00f0ff' },
          { value: '300', position: 78, color: '#ffd700' }
        ],
        segments: [
          { type: 'segment-blue', width: 57 },
          { type: 'segment-yellow', width: 43, left: 57 }
        ],
        footerText: '覆盖 13 个国家/地区',
        footerHighlight: '13'
      },
      {
        title: '动态代理',
        highlightValue: '10000',
        suffix: '个',
        type: 'custom-progress',
        markers: [
          { value: '500', position: 25, color: '#00f0ff' },
          { value: '500', position: 75, color: '#ffd700' }
        ],
        segments: [
          { type: 'segment-blue', width: 50 },
          { type: 'segment-yellow', width: 50, left: 50 }
        ],
        footerText: 'IP出口覆盖美国，日本，韩国，东南亚等出口国家/地区',
        footerStyle: 'text-align: left;'
      }
    ]
  },
  {
    name: '电信资源',
    icon: '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
    typeCount: 2,
    totalCount: 250,
    unit: '万',
    subSections: [
      {
        title: '短信',
        highlightValue: '150',
        suffix: '万条',
        type: 'custom-progress',
        markers: [
          { value: '144万', position: 75, color: '#00f0ff' },
          { value: '6万', position: 98, color: '#ffd700' }
        ],
        segments: [
          { type: 'segment-blue', width: 96 },
          { type: 'segment-yellow', width: 4, left: 96 }
        ]
      },
      {
        title: '语音',
        highlightValue: '100',
        suffix: '万次',
        type: 'custom-progress',
        markers: [
          { value: '100万次', position: 50, color: '#00f0ff' }
        ],
        segments: [
          { type: 'segment-blue', width: 100 }
        ]
      }
    ]
  }
])
</script>

<style scoped>
.dashboard-content-wrapper {
  --bg-color: transparent;
  --text-main: #ffffff;
  --text-muted: #94a3b8;
  --accent-cyan: #00f0ff;
  --accent-yellow: #ffd700;
  --accent-green: #00ff9d;

  color: var(--text-main);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  position: relative;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, "Microsoft YaHei", sans-serif;
}

::-webkit-scrollbar { display: none; width: 0; height: 0; }
* { scrollbar-width: none; }

.ambient-light {
  position: absolute; top: -25vh; left: 50%; transform: translateX(-50%);
  width: 120vw; height: 80vh;
  background: radial-gradient(50% 50% at 50% 50%, rgba(30, 50, 120, 0.3) 0%, rgba(10, 15, 30, 0.1) 60%, transparent 100%);
  filter: blur(80px); z-index: 0; pointer-events: none;
}

.ambient-highlight {
  position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
  width: 60vw; height: 300px;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 100%);
  filter: blur(60px); z-index: 0; pointer-events: none; mix-blend-mode: screen;
}

#particle-canvas {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1; pointer-events: none;
}

.dashboard-container {
  flex: 1;
  padding: 16px 32px 32px 32px;
  overflow-y: auto;
  position: relative;
  z-index: 5;
}
</style>