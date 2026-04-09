<script setup>
import { ref } from 'vue'
import GlobalHeader from './components/GlobalHeader.vue'
import Sidebar from './components/Sidebar.vue'
import SummaryCards from './components/SummaryCards.vue'
import DataTable from './components/DataTable.vue'

// 电子邮箱表格列配置
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

// 电子邮箱平台选项
const platformOptions = ['Gmail', 'Outlook', 'Yahoo Mail', 'Hotmail', 'ProtonMail', 'iCloud']

// 电子邮箱卡片数据
const cards = [
  {
    name: 'Gmail',
    total: '12,584',
    icon: 'https://www.figma.com/api/mcp/asset/cfdb8933-1f49-4ce6-ba6d-0b3639753726'
  },
  {
    name: 'Outlook',
    total: '12,584',
    icon: 'https://www.figma.com/api/mcp/asset/d45c8a48-aa7a-465a-a9c0-9539b7aaacea'
  }
]

const filters = ref({
  keyword: '',
  accountType: '',
  platform: '',
  latestStatus: '',
  isSampled: ''
})

const pageSize = ref(100)
const currentPage = ref(1)
const total = ref(21546)

const tableData = ref([
  { id: 1, accountType: '采集', sampled: '是', result: '-', platform: 'Gmail', accountNo: 'EM01', version: '2', location: 'A类', nickname: 'user001', accountId: 'user001@gmail.com', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 50, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 2, accountType: '声（高）', sampled: '是', result: '-', platform: 'Gmail', accountNo: 'EM02', version: '2', location: 'A类', nickname: 'user002', accountId: 'user002@gmail.com', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 60, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 3, accountType: '声（中）', sampled: '是', result: '-', platform: 'Outlook', accountNo: 'EM03', version: '2', location: 'A类', nickname: 'user003', accountId: 'user003@outlook.com', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 75, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 4, accountType: '采集', sampled: '是', result: '-', platform: 'Outlook', accountNo: 'EM04', version: '2', location: 'A类', nickname: 'user004', accountId: 'user004@outlook.com', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 80, delivery: 'lin', latestStatus: '正常', updatedAt: '2024.03.03' },
  { id: 5, accountType: '采集', sampled: '是', result: '-', platform: 'Gmail', accountNo: 'EM05', version: '2', location: 'A类', nickname: 'user005', accountId: 'user005@gmail.com', url: '-', region: '美国', registeredAt: '2024.03.03', integrity: 90, delivery: 'lin', latestStatus: '异常', updatedAt: '2024.03.03' }
])

const handleSearch = () => {
  console.log('搜索:', filters.value)
}
</script>

<template>
  <div class="email-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用SummaryCards组件 -->
        <summary-cards :cards="cards" card-width="396px" />

        <data-table
          title="账号台账"
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :platform-options="platformOptions"
          @update:filters="val => filters = val"
          @search="handleSearch"
          @update:page-size="val => pageSize = val"
          @update:current-page="val => currentPage = val"
        />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.email-page {
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
