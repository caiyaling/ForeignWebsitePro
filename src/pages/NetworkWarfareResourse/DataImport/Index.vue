<script setup>
/**
 * @description 数据导入页面
 * @date 2024-04-23
 */
import { ref, watch } from 'vue'
import PageLayout from '@/pages/NetworkWarfareResourse/components/PageLayout.vue'
import AccountTable from './components/AccountTable.vue'
import BehaviorTable from './components/BehaviorTable.vue'
import PopularPostUpload from './components/PopularPostUpload.vue'

// 当前激活的标签页
const activeTab = ref('account')

// 行为记录表格组件引用
const behaviorTableRef = ref(null)

// 监听tab切换
watch(activeTab, (newTab) => {
  if (newTab === 'behavior' && behaviorTableRef.value) {
    behaviorTableRef.value.init()
  }
})
</script>

<template>
  <page-layout background="gray">
    <!-- Tabs 标签页 -->
    <div class="tabs-wrapper">
      <div class="tabs-container">
        <div
          :class="['tab-item', { active: activeTab === 'account' }]"
          @click="activeTab = 'account'"
        >
          账号基本情况
        </div>
        <div
          :class="['tab-item', { active: activeTab === 'behavior' }]"
          @click="activeTab = 'behavior'"
        >
          账号行为记录
        </div>
        <div
          :class="['tab-item', { active: activeTab === 'popular' }]"
          @click="activeTab = 'popular'"
        >
          爆款贴文链接
        </div>
      </div>
    </div>

    <!-- 账号基本情况 -->
    <account-table v-if="activeTab === 'account'" />

    <!-- 账号行为记录 -->
    <behavior-table
      v-if="activeTab === 'behavior'"
      ref="behaviorTableRef"
    />

    <!-- 爆款贴文链接 -->
    <popular-post-upload v-if="activeTab === 'popular'" />
  </page-layout>
</template>

<style lang="scss" scoped>
.tabs-wrapper {
  background: #fff;
}

.tabs-container {
  display: flex;
  border-bottom: 2px solid #e4e7ed;
}

.tab-item {
  padding: 8px 20px;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #303133;
  cursor: pointer;
  border-bottom: 2px solid #e4e7ed;
  margin-bottom: -2px;
  transition: all 0.2s;

  &:hover {
    color: #0060ff;
  }

  &.active {
    font-weight: 700;
    color: #0060ff;
    border-bottom-color: #0060ff;
  }
}
</style>
