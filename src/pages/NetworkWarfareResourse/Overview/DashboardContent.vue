<template>
  <div class="dashboard-content-wrapper">
    <AmbientBackground />

    <div class="dashboard-container">
      <PageHeader title="资源总览" centered />

      <!-- 账号资源总览 -->
      <AccountResourceSection :cards="accountCards" />

      <!-- 基础资源总览 -->
      <BaseResourceSection :cards="baseCards" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import AmbientBackground from '../components/AmbientBackground.vue'
import AccountResourceSection from './components/AccountResourceSection.vue'
import BaseResourceSection from './components/BaseResourceSection.vue'

// 导入图标
import socialPlatformIcon from '../assets/icon/social-platform.png'
import blogForumIcon from '../assets/icon/blog-forum.png'
import emailIcon from '../assets/icon/email.png'
import dedicatedDeviceIcon from '../assets/icon/dedicated-device.png'
import phoneCardIcon from '../assets/icon/phone-card.png'
import networkProxyIcon from '../assets/icon/network-proxy.png'
import telecomResourceIcon from '../assets/icon/telecom-resource.png'

// 账号资源卡片数据
const accountCards = ref([
  {
    name: '社交平台',
    icon: socialPlatformIcon,
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
    icon: socialPlatformIcon,
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
    icon: blogForumIcon,
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
    icon: emailIcon,
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
    icon: dedicatedDeviceIcon,
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
    icon: phoneCardIcon,
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
    icon: networkProxyIcon,
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
    icon: telecomResourceIcon,
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
  font-size: 16px;
  position: relative;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, "Microsoft YaHei", sans-serif;
}

::-webkit-scrollbar { display: none; width: 0; height: 0; }
* { scrollbar-width: none; }

.dashboard-container {
  flex: 1;
  padding: 16px 32px 32px 32px;
  overflow-y: auto;
  position: relative;
  z-index: 5;
}
</style>