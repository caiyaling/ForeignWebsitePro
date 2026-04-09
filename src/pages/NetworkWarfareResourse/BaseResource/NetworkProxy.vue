<script setup>
/**
 * @description 网络代理页面
 * @date 2024-04-09
 */
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import ResourceCard from '@/pages/NetworkWarfareResourse/components/ResourceCard.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'

// 卡片数据
const cards = [
  {
    name: '静态代理',
    total: '12,584',
    type: 'progress',
    icon: 'https://www.figma.com/api/mcp/asset/ddc4db0d-3037-47cb-a33e-d377913e0851',
    description: '覆盖13个国家/地区',
    progressItems: [
      { label: '总计', total: 2343, used: 12 },
      { label: '台湾', total: 2343, used: 12 },
      { label: '香港', total: 2343, used: 12 },
      { label: '美国', total: 2343, used: 12 },
      { label: '英国', total: 2343, used: 12 },
      { label: '法国', total: 2343, used: 12 }
    ]
  },
  {
    name: '动态代理',
    total: '12,584',
    type: 'chart',
    icon: 'https://www.figma.com/api/mcp/asset/47fa662f-de13-4519-9894-3834aeb29a61',
    description: 'IP出口覆盖美国，日本，韩国，东南亚等国家/地区',
    chart: {
      outerData: [
        { value: 8543, name: '已使用', color: '#f77234' },
        { value: 4041, name: '待分配', color: '#165dff' }
      ],
      innerData: [
        { value: 8543, name: '已使用', color: '#f77234' },
        { value: 4041, name: '待分配', color: '#165dff' }
      ],
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '待分配', color: '#165dff' }
      ]
    }
  }
]

// 表格列配置
const tableColumns = [
  { prop: 'proxyNo', label: '编号', width: 120 },
  { prop: 'proxyType', label: '代理类型', width: 100 },
  { prop: 'proxyIp', label: '代理IP', minWidth: 140 },
  { prop: 'port', label: '端口', width: 80 },
  { prop: 'project', label: '所属项目', minWidth: 140 },
  { prop: 'delivery', label: '交付方', width: 100 },
  { prop: 'region', label: '所属地区', minWidth: 120 },
  { prop: 'provider', label: '供应商', width: 100 },
  { prop: 'bandwidth', label: '带宽', width: 100 },
  { prop: 'expireAt', label: '到期时间', width: 120 },
  { prop: 'status', label: '状态', width: 80, type: 'status' },
  { prop: 'updatedAt', label: '更新时间', width: 120 },
  { prop: 'action', label: '操作', width: 80, type: 'action', actionType: 'delete' }
]

// 表格数据
const tableData = ref([
  { id: 1, proxyNo: 'SP001', proxyType: '静态', proxyIp: '192.168.1.100', port: '8080', project: '项目A', delivery: 'team1', region: '台湾', provider: 'Luminati', bandwidth: '100Mbps', expireAt: '2025.12.31', status: '正常', updatedAt: '2024.03.03' },
  { id: 2, proxyNo: 'SP002', proxyType: '静态', proxyIp: '192.168.1.101', port: '8080', project: '项目B', delivery: 'team2', region: '香港', provider: 'Smartproxy', bandwidth: '50Mbps', expireAt: '2025.06.30', status: '正常', updatedAt: '2024.03.03' },
  { id: 3, proxyNo: 'SP003', proxyType: '静态', proxyIp: '192.168.1.102', port: '8080', project: '项目A', delivery: 'team1', region: '美国', provider: 'Oxylabs', bandwidth: '200Mbps', expireAt: '2025.09.15', status: '正常', updatedAt: '2024.03.03' },
  { id: 4, proxyNo: 'DP001', proxyType: '动态', proxyIp: '10.0.0.100', port: '1080', project: '项目A', delivery: 'team1', region: '美国', provider: 'IPRoyal', bandwidth: '80Mbps', expireAt: '2025.11.30', status: '正常', updatedAt: '2024.03.03' },
  { id: 5, proxyNo: 'DP002', proxyType: '动态', proxyIp: '10.0.0.101', port: '1080', project: '项目B', delivery: 'team2', region: '日本', provider: 'Proxy-Seller', bandwidth: '60Mbps', expireAt: '2025.07.15', status: '正常', updatedAt: '2024.03.03' }
])

const filters = ref({
  keyword: '',
  project: ''
})

const pageSize = ref(100)
const currentPage = ref(1)
const total = ref(568)

// 所属项目选项
const projectOptions = ['项目A', '项目B', '项目C']

const handleSearch = () => {
  console.log('搜索:', filters.value)
}

// 批量导入
const handleBatchImport = () => {
  console.log('批量导入')
}

// 批量导出
const handleBatchExport = () => {
  console.log('批量导出')
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}
</script>

<template>
  <div class="network-proxy-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用ResourceCard组件 - 禁用选中交互 -->
        <resource-card
          :cards="cards"
          :disable-select="true"
        />

        <!-- 数据表格 - 设备模式 -->
        <data-table
          title="网络代理台账"
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :device-mode="true"
          :project-options="projectOptions"
          :show-brand-filter="false"
          search-placeholder="关键词：代理IP，端口，编号"
          @update:filters="val => filters = val"
          @search="handleSearch"
          @update:page-size="val => pageSize = val"
          @update:current-page="val => currentPage = val"
          @delete="handleDelete"
          @batch-import="handleBatchImport"
          @batch-export="handleBatchExport"
        />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.network-proxy-page {
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
