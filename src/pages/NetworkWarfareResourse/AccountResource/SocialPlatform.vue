﻿<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import SummaryCards from '@/pages/NetworkWarfareResourse/components/SummaryCards.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import { useTableData } from '@/composables/useTableData'

const router = useRouter()

// 社交平台表格列配置
const tableColumns = [
  { prop: 'accountType', label: '账号类型', width: 100 },
  { prop: 'sampled', label: '是否采样', width: 80, align: 'center' },
  { prop: 'result', label: '采样结果', width: 80, align: 'center' },
  { prop: 'platform', label: '平台名称', width: 120 },
  { prop: 'accountNo', label: '账号编号', width: 100 },
  { prop: 'version', label: '账号版本号', width: 100 },
  { prop: 'location', label: '账号定位', width: 100 },
  { prop: 'nickname', label: '用户昵称', width: 120 },
  { prop: 'accountId', label: '账号ID', width: 120 },
  { prop: 'url', label: '链接URL', width: 100 },
  { prop: 'region', label: '注册地区', width: 100 },
  { prop: 'registeredAt', label: '注册时间', width: 120 },
  { prop: 'integrity', label: '账号信息完善度', width: 130, type: 'progress' },
  { prop: 'delivery', label: '交付方', width: 100 },
  { prop: 'latestStatus', label: '最新状态', width: 100, type: 'status' },
  { prop: 'updatedAt', label: '更新时间', width: 120 },
  { prop: 'action', label: '操作', width: 80, type: 'action' }
]

const platformOptions = ['Facebook', 'Instagram', 'Twitter', 'threads', 'line', 'Youtube', 'TiTok', 'X']

const cards = [
  {
    name: 'Facebook',
    total: '12,584',
    icon: '/figma/mnijidos-mhm8ijf.svg',
    variant: 'warm',
    stats: [
      { label: '采集', value: '2343' },
      { label: '贴靠', value: '2343' },
      { label: '发声（高）', value: '2343' },
      { label: '发声（中）', value: '2343' }
    ]
  },
  {
    name: 'Instagram',
    total: '12,584',
    icon: '/figma/mnijidos-9h6v96r.svg',
    variant: 'warm',
    stats: [
      { label: '采集', value: '2343' },
      { label: '贴靠', value: '2343' }
    ]
  },
  {
    name: 'threads',
    total: '12,584',
    icon: '/figma/mnijidos-927feh6.svg',
    variant: 'warm',
    stats: [{ label: '贴靠', value: '2343' }]
  },
  {
    name: 'Youtube',
    total: '12,584',
    icon: '/figma/mnijidos-hh4aiod.svg',
    variant: 'cool',
    stats: [
      { label: '采集', value: '2343' },
      { label: '贴靠', value: '2343' }
    ]
  },
  {
    name: 'TiTok',
    total: '12,584',
    icon: '/figma/mnijidos-neinw5m.svg',
    variant: 'cool',
    stats: [
      { label: '采集', value: '2343' },
      { label: '贴靠', value: '2343' },
      { label: '发声（高）', value: '2343' },
      { label: '发声（中）', value: '2343' }
    ]
  },
  {
    name: 'X',
    total: '12,584',
    icon: '/figma/mnijidos-63851so.svg',
    variant: 'cool',
    stats: [
      { label: '采集', value: '2343' },
      { label: '贴靠', value: '2343' }
    ]
  }
]

// 使用 useTableData composable 管理表格数据
// apiUrl 配置后，分页变化时会自动调用接口
const {
  tableData,
  pageSize,
  currentPage,
  total,
  filters,
  loading,
  fetchData,
  handlePageChange,
  handleSearch
} = useTableData({
  // API 接口地址（根据实际项目配置）
  // apiUrl: '/api/social-platform/accounts',
  apiUrl: '', // 暂时为空，使用模拟数据
  defaultFilters: {
    keyword: '',
    accountType: '',
    platform: '',
    latestStatus: '',
    isSampled: ''
  },
  defaultPageSize: 100
})

// 如果没有配置 apiUrl，使用模拟数据
if (!tableData.value.length) {
  tableData.value = [
    { id: 1, accountType: '采集', sampled: '是', result: '-', platform: 'Facebook', accountNo: 'CJ01', version: '2', location: 'A类', nickname: 'lad', accountId: '55552533', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 50, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
    { id: 2, accountType: '声（高）', sampled: '是', result: '-', platform: 'Facebook', accountNo: 'CJ01', version: '2', location: 'A类', nickname: 'lad', accountId: '55552533', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 60, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
    { id: 3, accountType: '声（中）', sampled: '是', result: '-', platform: 'Facebook', accountNo: 'CJ01', version: '2', location: 'A类', nickname: 'lad', accountId: '55552533', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 75, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
    { id: 4, accountType: '采集', sampled: '是', result: '-', platform: 'Facebook', accountNo: 'CJ01', version: '2', location: 'A类', nickname: 'lad', accountId: '55552533', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 80, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
    { id: 5, accountType: '采集', sampled: '是', result: '-', platform: 'Facebook', accountNo: 'CJ01', version: '2', location: 'A类', nickname: 'lad', accountId: '55552533', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 90, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' }
  ]
  total.value = 9900
}

// 处理分页变化事件 - 切换页码或每页条数时会触发 API 调用
const onPageChange = ({ page, pageSize }) => {
  console.log('分页变化:', { page, pageSize })
  handlePageChange({ page, pageSize })
}

// 处理详情点击 - 跳转到账号详情页
const handleDetail = (row) => {
  router.push({
    path: '/account-detail',
    query: {
      accountId: row.accountId || row.id,
      from: router.currentRoute.value.path,
      accountType: row.accountType || ''
    }
  })
}

// 处理附件点击 - 打开附件预览
const handleAttachmentClick = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="social-platform-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用SummaryCards组件 -->
        <summary-cards :cards="cards" />

        <data-table
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :platform-options="platformOptions"
          @update:filters="val => filters = val"
          @search="handleSearch"
          @page-change="onPageChange"
          @detail="handleDetail"
          @attachment-click="handleAttachmentClick"
        />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.social-platform-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #efefef;
}

.page-shell {
  display: flex;
  flex: 1;
  min-height: 0;
}

.page-main {
  flex: 1;
  min-width: 0;
  padding: 12px 10px 12px 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
