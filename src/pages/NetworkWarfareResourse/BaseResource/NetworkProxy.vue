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
import BatchImportDialog from '@/components/BatchImportDialog.vue'

// 卡片数据
const cards = [
  {
    name: '静态代理',
    total: '12,584',
    type: 'progress',
    icon: '/figma/network-proxy-static.svg',
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
    icon: '/figma/network-proxy-dynamic.svg',
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
  { prop: 'resourceCode', label: '资源编码', minWidth: 100 },
  { prop: 'accountType', label: '账号类型', minWidth: 80 },
  { prop: 'ipAddress', label: 'IP地址', minWidth: 120 },
  { prop: 'ipType', label: 'IP类型', minWidth: 100 },
  { prop: 'protocolType', label: '协议类型', minWidth: 80 },
  { prop: 'exitRegion', label: '出口地区', minWidth: 80 },
  { prop: 'latestStatus', label: '最新状态', minWidth: 80 },
  { prop: 'checkDate', label: '检测日期', minWidth: 100 },
  { prop: 'expiryDate', label: '失效日期', minWidth: 100 },
  { prop: 'resourceSource', label: '资源来源', minWidth: 100 },
  { prop: 'resourceSourceType', label: '资源来源类型', minWidth: 120 },
  { prop: 'delivery', label: '交付方', minWidth: 80 },
  { prop: 'deliveryDate', label: '交付日期', minWidth: 100 },
  { prop: 'responsibleUnit', label: '责任单位', minWidth: 100 },
  { prop: 'responsiblePerson', label: '责任人', minWidth: 80 },
  { prop: 'remark', label: '备注', minWidth: 80 },
  { prop: 'updatedAt', label: '更新时间', minWidth: 100 },
  { prop: 'status', label: '状态', minWidth: 120, type: 'status' },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 表格数据
const tableData = ref([
  { id: 1, resourceCode: 'IP001', accountType: '采集', ipAddress: '152.131.11.13', ipType: '静态IP代理', protocolType: 'IPv4', exitRegion: '韩国', latestStatus: '存活', checkDate: '2025.01.15', expiryDate: '2025.12.31', resourceSource: '项目交付', resourceSourceType: '-', delivery: '-', deliveryDate: '-', responsibleUnit: '-', responsiblePerson: '-', remark: '-', updatedAt: '2025.01.15', status: '已使用' },
  { id: 2, resourceCode: 'IP002', accountType: '发声', ipAddress: '192.168.1.101', ipType: '动态IP代理', protocolType: 'IPv4', exitRegion: '香港', latestStatus: '存活', checkDate: '2025.01.14', expiryDate: '2025.06.30', resourceSource: '外部采购', resourceSourceType: '-', delivery: '-', deliveryDate: '-', responsibleUnit: '-', responsiblePerson: '-', remark: '-', updatedAt: '2025.01.14', status: '剩余额度' },
  { id: 3, resourceCode: 'IP003', accountType: '采集', ipAddress: '192.168.1.102', ipType: '静态IP代理', protocolType: 'IPv6', exitRegion: '美国', latestStatus: '失效', checkDate: '2025.01.13', expiryDate: '2025.09.15', resourceSource: '项目交付', resourceSourceType: '-', delivery: '-', deliveryDate: '-', responsibleUnit: '-', responsiblePerson: '-', remark: '-', updatedAt: '2025.01.13', status: '已使用' },
  { id: 4, resourceCode: 'IP004', accountType: '发声', ipAddress: '10.0.0.100', ipType: '动态IP代理', protocolType: 'IPv4', exitRegion: '日本', latestStatus: '存活', checkDate: '2025.01.12', expiryDate: '2025.11.30', resourceSource: '外部采购', resourceSourceType: '-', delivery: '-', deliveryDate: '-', responsibleUnit: '-', responsiblePerson: '-', remark: '-', updatedAt: '2025.01.12', status: '剩余额度' },
  { id: 5, resourceCode: 'IP005', accountType: '采集', ipAddress: '10.0.0.101', ipType: '静态IP代理', protocolType: 'IPv4', exitRegion: '新加坡', latestStatus: '存活', checkDate: '2025.01.11', expiryDate: '2025.07.15', resourceSource: '项目交付', resourceSourceType: '-', delivery: '-', deliveryDate: '-', responsibleUnit: '-', responsiblePerson: '-', remark: '-', updatedAt: '2025.01.11', status: '已使用' }
])

const filters = ref({
  keyword: '',
  project: '',
  ipType: '',
  exitRegion: ''
})

const pageSize = ref(100)
const currentPage = ref(1)
const total = ref(568)

// 所属项目选项
const projectOptions = ['项目A', '项目B', '项目C']

// IP类型选项
const ipTypeOptions = ['静态IP代理', '动态IP代理']

// 出口地区选项
const exitRegionOptions = ['台湾', '香港', '美国', '英国', '法国', '日本', '韩国', '新加坡']

const handleSearch = () => {
  console.log('搜索:', filters.value)
}

// 处理分页变化事件
const onPageChange = ({ page, pageSize }) => {
  console.log('分页变化:', { page, pageSize })
  // TODO: 调用 API 获取数据
}

// 批量导入弹框
const showBatchImportDialog = ref(false)

// 批量导入
const handleBatchImport = () => {
  showBatchImportDialog.value = true
}

// 确认导入
const handleImportConfirm = (files) => {
  console.log('导入文件:', files)
  ElMessage.success('导入成功')
  showBatchImportDialog.value = false
}

// 下载模板
const handleDownloadTemplate = () => {
  console.log('下载模板')
  ElMessage.info('正在下载模板...')
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
          :show-brand-filter="true"
          :brand-placeholder="'出口地区'"
          :brand-options="exitRegionOptions"
          :brand-filter-key="'exitRegion'"
          :show-third-filter="true"
          :third-filter-placeholder="'IP类型'"
          :third-filter-options="ipTypeOptions"
          :third-filter-key="'ipType'"
          search-placeholder="关键词：资源编码，IP地址"
          @update:filters="val => filters = val"
          @search="handleSearch"
          @page-change="onPageChange"
          @delete="handleDelete"
          @batch-import="handleBatchImport"
          @batch-export="handleBatchExport"
        />
      </main>
    </div>

    <!-- 批量导入弹框 -->
    <batch-import-dialog
      v-model="showBatchImportDialog"
      title="批量导入"
      :single-file="true"
      @confirm="handleImportConfirm"
      @download-template="handleDownloadTemplate"
    />
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
