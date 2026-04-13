<script setup>
import { ref } from 'vue'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import SummaryCards from '@/pages/NetworkWarfareResourse/components/SummaryCards.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import { useTableData } from '@/composables/useTableData'

// 博客论坛表格列配置
const tableColumns = [
  { prop: 'accountType', label: '账号类型', width: 100 },
  { prop: 'isSampled', label: '是否抽检', width: 80, align: 'center' },
  { prop: 'sampleResult', label: '抽检结果', width: 80, align: 'center' },
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
  { prop: 'action', label: '操作', width: 120, type: 'action' }
]

const platformOptions = ['PPT', 'Dcard', 'Pixnet']

const cards = [
  {
    name: 'PPT',
    total: '12,584',
    icon: '/figma/blog-ppt.svg',
    variant: 'warm',
    stats: [{ label: '贴靠', value: '2343' }]
  },
  {
    name: 'Dcard',
    total: '12,584',
    icon: '/figma/blog-dcard.svg',
    variant: 'warm',
    stats: [{ label: '贴靠', value: '2343' }]
  },
  {
    name: 'Pixnet',
    total: '12,584',
    icon: '/figma/blog-pixnet.svg',
    variant: 'warm',
    stats: [{ label: '贴靠', value: '2343' }]
  }
]

// 使用 useTableData composable 管理表格数据
const {
  tableData,
  pageSize,
  currentPage,
  total,
  filters,
  handlePageChange,
  handleSearch
} = useTableData({
  apiUrl: '', // 配置 API 地址后分页变化会自动调用接口
  defaultFilters: {
    keyword: '',
    accountType: '',
    platform: '',
    latestStatus: '',
    isSampled: ''
  },
  defaultPageSize: 100
})

// 模拟数据（实际项目中删除此部分，使用 API 返回数据）
tableData.value = [
  { id: 1, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'PPT', accountNo: 'BF001', version: 'v1.0', location: 'A类', nickname: 'user1', accountId: 'PPT12345', url: '-', region: '台湾', registeredAt: '2024.03.01', integrity: 50, delivery: 'team1', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 2, accountType: '发声（高）', isSampled: '是', sampleResult: '-', platform: 'Dcard', accountNo: 'BF002', version: 'v1.0', location: 'A类', nickname: 'user2', accountId: 'DC12345', url: '-', region: '台湾', registeredAt: '2024.03.01', integrity: 60, delivery: 'team1', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 3, accountType: '发声（中）', isSampled: '是', sampleResult: '-', platform: 'Pixnet', accountNo: 'BF003', version: 'v1.0', location: 'A类', nickname: 'user3', accountId: 'PX12345', url: '-', region: '台湾', registeredAt: '2024.03.01', integrity: 75, delivery: 'team1', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 4, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'PPT', accountNo: 'BF004', version: 'v2.0', location: 'B类', nickname: 'user4', accountId: 'PPT67890', url: '-', region: '台湾', registeredAt: '2024.02.15', integrity: 80, delivery: 'team2', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 5, accountType: '采集', isSampled: '是', sampleResult: '-', platform: 'Dcard', accountNo: 'BF005', version: 'v1.5', location: 'A类', nickname: 'user5', accountId: 'DC67890', url: '-', region: '台湾', registeredAt: '2024.02.20', integrity: 90, delivery: 'team2', latestStatus: '正常', updatedAt: '2024.03.03' }
]
total.value = 9900

// 处理分页变化事件
const onPageChange = ({ page, pageSize }) => {
  console.log('分页变化:', { page, pageSize })
  handlePageChange({ page, pageSize })
}
</script>

<template>
  <div class="blog-forum-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用SummaryCards组件 -->
        <summary-cards :cards="cards" />

        <!-- 使用DataTable组件 -->
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
        />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-forum-page {
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
