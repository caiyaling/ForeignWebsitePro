<script setup>
import { useRouter } from 'vue-router'
import ProgressItem from './ProgressItem.vue'

const router = useRouter()

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  typeCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: '个'
  },
  items: {
    type: Array,
    default: () => []
  },
  subSections: {
    type: Array,
    default: () => []
  },
  animationDelay: {
    type: Number,
    default: 0
  },
  routePath: {
    type: String,
    default: ''
  }
})

// 卡片名称与路由路径的映射
const routeMap = {
  '社交平台': '/network-warfare-resource/social',
  '即时通信': '/network-warfare-resource/instant-messaging',
  '博客论坛': '/network-warfare-resource/blog-forum',
  '电子邮箱': '/network-warfare-resource/email',
  '专用设备': '/network-warfare-resource/device',
  '手机卡号': '/network-warfare-resource/phone',
  '网络代理': '/network-warfare-resource/proxy',
  '电信资源': '/network-warfare-resource/telecom'
}

const handleMouseMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}

const handleCardClick = () => {
  const path = props.routePath || routeMap[props.name]
  if (path) {
    router.push(path)
  }
}

// 解析 footerText 高亮
const parseFooterText = (subSection) => {
  if (!subSection.footerText || !subSection.footerHighlight) {
    return { before: subSection.footerText || '', highlight: '', after: '' }
  }
  const parts = subSection.footerText.split(subSection.footerHighlight)
  return {
    before: parts[0] || '',
    highlight: subSection.footerHighlight,
    after: parts[1] || ''
  }
}
</script>

<template>
  <div
    class="card"
    :class="{ 'split-card': subSections.length > 0, 'clickable': routePath || routeMap[name] }"
    @mousemove="handleMouseMove"
    @click="handleCardClick"
    :style="{ animationDelay: `${animationDelay}s` }"
  >
    <div class="card-header">
      <div class="card-title-row">
        <div class="card-icon">
          <img v-if="icon" :src="icon" :alt="name" class="icon-img" />
        </div>
        <span class="card-name">{{ name }}</span>
      </div>
      <div class="card-stats-row">
        <div class="stat-group"><span class="stat-num">{{ typeCount }}</span> <span class="stat-label">类</span></div>
        <div class="stat-group"><span class="stat-num">{{ totalCount }}</span> <span class="stat-label">{{ unit }}</span></div>
      </div>
      <div class="card-divider"></div>
    </div>

    <!-- 简单进度列表模式 (用于账号资源) -->
    <template v-if="items.length > 0">
      <ProgressItem
        v-for="item in items"
        :key="item.name"
        :name="item.name"
        :value="item.value"
        :percent="item.percent"
      />
    </template>

    <!-- 子分区模式 (用于基础资源) -->
    <template v-if="subSections.length > 0">
      <div
        v-for="subSection in subSections"
        :key="subSection.title"
        class="sub-section"
      >
        <div class="sub-title" :style="subSection.titleStyle">
          {{ subSection.title }}
          <span v-if="subSection.highlightValue" class="text-cyan">{{ subSection.highlightValue }}</span>
          <span v-if="subSection.suffix">{{ subSection.suffix }}</span>
        </div>

        <!-- 自定义进度条（带标记） -->
        <template v-if="subSection.type === 'custom-progress'">
          <div class="custom-legend-row">
            <div class="legend-item"><span class="legend-dot dot-blue"></span>待分配</div>
            <div class="legend-item"><span class="legend-dot dot-yellow"></span>已使用</div>
          </div>
          <div class="custom-progress-wrapper">
            <div
              v-for="marker in subSection.markers"
              :key="marker.value"
              class="marker-val"
              :style="{ left: marker.position + '%', '--marker-color': marker.color }"
            >{{ marker.value }}</div>
            <div class="custom-bar-bg">
              <div
                v-for="(segment, idx) in subSection.segments"
                :key="idx"
                class="custom-bar-segment"
                :class="segment.type"
                :style="{ width: segment.width + '%', left: segment.left ? segment.left + '%' : 'auto' }"
              ></div>
            </div>
          </div>
          <div v-if="subSection.footerText" class="footer-text" :style="subSection.footerStyle">
            <template v-if="subSection.footerHighlight">
              {{ parseFooterText(subSection).before }}
              <span class="text-cyan">{{ parseFooterText(subSection).highlight }}</span>
              {{ parseFooterText(subSection).after }}
            </template>
            <template v-else>
              {{ subSection.footerText }}
            </template>
          </div>
        </template>

        <!-- 普通进度条列表 -->
        <template v-else-if="subSection.type === 'progress-list'">
          <ProgressItem
            v-for="item in subSection.items"
            :key="item.name"
            :name="item.name"
            :value="item.value"
            :percent="item.percent"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.card {
  --mouse-x: -1000px;
  --mouse-y: -1000px;
  border: 1px solid rgba(67, 236, 255, 0.3);
  border-radius: 8px;
  background: radial-gradient(54.42% 32.41% at 52.05% 0%, rgba(0, 255, 246, 0.25) 0%, rgba(0, 225, 255, 0.00) 100%), linear-gradient(348deg, rgba(0, 27, 64, 0.60) 7.31%, rgba(0, 187, 255, 0.15) 90.95%);
  box-shadow: 0 4px 20px 20px rgba(0, 11, 37, 0.02);
  padding: 20px;
  position: relative;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  animation: card-entry 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(0, 240, 255, 0.2), transparent 50%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.card:hover::before { opacity: 1; }
.card > * { position: relative; z-index: 2; }
.card:hover { transform: translateY(-2px); border-color: rgba(67, 236, 255, 0.8); box-shadow: 0 0 30px rgba(67, 236, 255, 0.25); }

.card.clickable {
  cursor: pointer;
}

.split-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

@keyframes card-entry {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 卡片头部 */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon .icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-name {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 0.5px;
}

.card-stats-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 4px;
}

.card-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #00f0ff 0%, rgba(0, 240, 255, 0.1) 100%);
  opacity: 0.6;
  margin-top: 6px;
  box-shadow: 0 0 4px rgba(0, 240, 255, 0.5);
}

.stat-num {
  color: #ffd700;
  font-size: 26px;
  font-weight: bold;
  font-family: 'Segoe UI', sans-serif;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
}

/* 子分区 */
.sub-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sub-title {
  font-size: 16px;
  font-weight: normal;
  color: #fff;
  margin-bottom: 6px;
  margin-top: 10px;
  opacity: 0.9;
}

.text-cyan {
  color: #00f0ff;
  font-size: 18px;
  font-weight: bold;
  margin: 0 4px;
  font-family: 'Segoe UI', sans-serif;
}

/* 自定义进度条 */
.custom-legend-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #94a3b8;
  opacity: 0.8;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot-blue {
  background-color: #00f0ff;
  box-shadow: 0 0 5px #00f0ff;
}

.dot-yellow {
  background-color: #ffd700;
  box-shadow: 0 0 5px #ffd700;
}

.custom-progress-wrapper {
  position: relative;
  margin-bottom: 16px;
  padding-top: 28px;
}

.marker-val {
  position: absolute;
  top: -6px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Segoe UI', sans-serif;
  transform: translateX(-50%);
  color: var(--marker-color);
  text-shadow: 0 0 8px var(--marker-color);
  white-space: nowrap;
  z-index: 5;
}

.marker-val::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid var(--marker-color);
}

.custom-bar-bg {
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  position: relative;
  overflow: visible;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
}

.custom-bar-segment {
  height: 100%;
  position: absolute;
  top: 0;
  border-radius: 5px;
}

.custom-bar-segment.segment-blue:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.custom-bar-segment.segment-yellow {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.segment-blue {
  background: linear-gradient(90deg, #00c6ff 0%, #00f0ff 100%);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  z-index: 2;
}

.segment-yellow {
  background: linear-gradient(90deg, #ffaa00 0%, #ffd700 100%);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  z-index: 1;
}

.footer-text {
  font-size: 12px;
  color: #fff;
  opacity: 0.6;
  text-align: right;
  margin-top: -4px;
}
</style>