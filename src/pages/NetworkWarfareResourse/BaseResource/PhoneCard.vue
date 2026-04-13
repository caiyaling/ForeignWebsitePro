<script setup>
/**
 * @description 手机卡号页面
 * @date 2024-04-09
 */
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import PhoneCardPanel from './components/PhoneCardPanel.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'
import { useTableData } from '@/composables/useTableData'

// 卡片数据
const cards = [
  {
    name: '归属地',
    stats: [
      { label: '菲律宾', value: '2343' },
      { label: '香港', value: '2343' },
      { label: '美国', value: '1234' },
      { label: '日本', value: '987' },
      { label: '韩国', value: '654' },
      { label: '新加坡', value: '321' }
    ]
  },
  {
    name: '卡号类型',
    stats: [
      { label: '通讯卡', value: '2343' },
      { label: '流量卡', value: '2343' },
      { label: '物联网卡', value: '1234' }
    ]
  }
]

// 表格列配置
const tableColumns = [
  { prop: 'assetNo', label: '编号', minWidth: 120 },
  { prop: 'delivery', label: '交付方', minWidth: 100 },
  { prop: 'assetType', label: '资产类别', minWidth: 100 },
  { prop: 'serialNo', label: '手机卡序列号', minWidth: 140 },
  { prop: 'phoneNumber', label: '手机号', minWidth: 120 },
  { prop: 'project', label: '所属项目', minWidth: 120 },
  { prop: 'equipment', label: '所属装备', minWidth: 120 },
  { prop: 'brandModel', label: '品牌型号', minWidth: 120 },
  { prop: 'specParams', label: '规格参数', minWidth: 140 },
  { prop: 'remark', label: '备注', minWidth: 100 },
  { prop: 'updatedAt', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
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
    project: ''
  },
  defaultPageSize: 100
})

// 模拟数据
tableData.value = [
  { id: 1, index: 1, assetNo: 'PH-001-23456', delivery: 'team1', assetType: '通讯卡', serialNo: 'SN-20240001', phoneNumber: '+63-912-345-678', project: '项目A', equipment: '云手机-001', brandModel: 'Globe TM', specParams: '4G/无限流量', remark: '菲律宾本地卡', updatedAt: '2024.03.03' },
  { id: 2, index: 2, assetNo: 'HK-002-34567', delivery: 'team2', assetType: '流量卡', serialNo: 'SN-20240002', phoneNumber: '+852-1234-5678', project: '项目B', equipment: '云手机-002', brandModel: 'China Mobile', specParams: '5G/100GB', remark: '香港本地卡', updatedAt: '2024.03.03' },
  { id: 3, index: 3, assetNo: 'US-003-45678', delivery: 'team1', assetType: '通讯卡', serialNo: 'SN-20240003', phoneNumber: '+1-555-123-4567', project: '项目A', equipment: '云手机-003', brandModel: 'AT&T', specParams: '4G/无限通话', remark: '美国本地卡', updatedAt: '2024.03.03' },
  { id: 4, index: 4, assetNo: 'JP-004-56789', delivery: 'team3', assetType: '物联网卡', serialNo: 'SN-20240004', phoneNumber: '-', project: '项目C', equipment: '实体手机-001', brandModel: 'Docomo', specParams: 'NB-IoT', remark: '日本物联网卡', updatedAt: '2024.03.03' },
  { id: 5, index: 5, assetNo: 'KR-005-67890', delivery: 'team2', assetType: '通讯卡', serialNo: 'SN-20240005', phoneNumber: '+82-10-1234-5678', project: '项目B', equipment: '云手机-004', brandModel: 'SK Telecom', specParams: '5G/无限流量', remark: '韩国本地卡', updatedAt: '2024.03.03' }
]
total.value = 568

// 所属项目选项
const projectOptions = ['项目A', '项目B', '项目C']

// 处理分页变化事件
const onPageChange = ({ page, pageSize }) => {
  console.log('分页变化:', { page, pageSize })
  handlePageChange({ page, pageSize })
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
  <div class="phone-card-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 手机卡号卡片 -->
        <phone-card-panel :cards="cards" />

        <!-- 数据表格 -->
        <data-table
          title="手机卡号台账"
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :device-mode="true"
          :project-options="projectOptions"
          :show-brand-filter="false"
          search-placeholder="关键词：资产编号，手机卡序列号，手机号"
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
.phone-card-page {
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
