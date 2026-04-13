<script setup>
/**
 * @description 专用设备页面
 * @date 2024-04-09
 */
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import ResourceCard from '@/pages/NetworkWarfareResourse/components/ResourceCard.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'
import { useTableData } from '@/composables/useTableData'

// 当前选中的卡片索引
const activeCardIndex = ref(0)

// 卡片数据
const cards = [
  {
    name: '云手机',
    total: '12,584',
    type: 'chart',
    icon: '/figma/device-cloud-phone.svg',
    description: 'IP出口覆盖美国，日本，韩国，东南亚等国家/地区',
    chart: {
      // 外环数据
      outerData: [
        { value: 8543, name: '已使用', color: '#f77234' },
        { value: 4041, name: '待分配', color: '#165dff' }
      ],
      // 内环数据
      innerData: [
        { value: 8543, name: '已使用', color: '#f77234' },
        { value: 4041, name: '待分配', color: '#165dff' }
      ],
      // 图例
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '待分配', color: '#165dff' }
      ]
    }
  },
  {
    name: '实体手机',
    total: '400/500台',
    type: 'stats',
    icon: '/figma/device-physical-phone.svg',
    stats: [
      { label: '苹果', value: '2343' },
      { label: '三星', value: '2343' },
      { label: '谷歌', value: '2343' },
      { label: '红米', value: '2343' },
      { label: 'Vivo', value: '2343' },
      { label: 'Oppo', value: '2343' },
      { label: '华为', value: '1234' },
      { label: '小米', value: '987' },
      { label: '一加', value: '654' },
      { label: '荣耀', value: '321' }
    ]
  }
]

// 云手机表格列配置
const cloudPhoneColumns = [
  { prop: 'deviceNo', label: '编号', minWidth: 120 },
  { prop: 'purpose', label: '用途', minWidth: 100 },
  { prop: 'project', label: '所属项目', minWidth: 140 },
  { prop: 'delivery', label: '交付方', minWidth: 100 },
  { prop: 'model', label: '型号', minWidth: 140 },
  { prop: 'brand', label: '品牌', minWidth: 100 },
  { prop: 'config', label: '配置', minWidth: 200 },
  { prop: 'os', label: '操作系统', minWidth: 100 },
  { prop: 'quantity', label: '数量', minWidth: 80 },
  { prop: 'updatedAt', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 实体手机表格列配置
const physicalPhoneColumns = [
  { prop: 'deviceNo', label: '编号', minWidth: 120 },
  { prop: 'purpose', label: '用途', minWidth: 100 },
  { prop: 'delivery', label: '交付方', minWidth: 100 },
  { prop: 'project', label: '所属项目', minWidth: 140 },
  { prop: 'assetName', label: '资产名称', minWidth: 140 },
  { prop: 'brand', label: '品牌', minWidth: 100 },
  { prop: 'spec', label: '型号/规格/版本', minWidth: 160 },
  { prop: 'config', label: '基本配置', minWidth: 200 },
  { prop: 'unit', label: '单位', minWidth: 80 },
  { prop: 'quantity', label: '数量', minWidth: 80 },
  { prop: 'updatedAt', label: '更新时间', minWidth: 120 },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 根据选中卡片动态计算表格标题
const tableTitle = computed(() => {
  return activeCardIndex.value === 0 ? '云手机台账' : '实体手机台账'
})

// 根据选中卡片动态计算表格列配置
const tableColumns = computed(() => {
  return activeCardIndex.value === 0 ? cloudPhoneColumns : physicalPhoneColumns
})

// 云手机表格数据
const cloudPhoneData = ref([
  { id: 1, index: 1, deviceNo: 'CP001', purpose: '采集', project: '项目A', delivery: 'team1', model: 'iPhone 15 Pro', brand: '苹果', config: '256GB / 8GB RAM / A17 Pro', os: 'iOS 17', quantity: 50, updatedAt: '2024.03.03' },
  { id: 2, index: 2, deviceNo: 'CP002', purpose: '发声', project: '项目B', delivery: 'team2', model: 'Galaxy S24', brand: '三星', config: '256GB / 12GB RAM / 骁龙8 Gen3', os: 'Android 14', quantity: 30, updatedAt: '2024.03.03' },
  { id: 3, index: 3, deviceNo: 'CP003', purpose: '采集', project: '项目A', delivery: 'team1', model: 'Pixel 8', brand: '谷歌', config: '128GB / 8GB RAM / Tensor G3', os: 'Android 14', quantity: 25, updatedAt: '2024.03.03' },
  { id: 4, index: 4, deviceNo: 'CP004', purpose: '发声', project: '项目C', delivery: 'team3', model: 'Redmi Note 13', brand: '红米', config: '128GB / 6GB RAM / 天玑6080', os: 'Android 13', quantity: 40, updatedAt: '2024.03.03' },
  { id: 5, index: 5, deviceNo: 'CP005', purpose: '采集', project: '项目B', delivery: 'team2', model: 'X100', brand: 'Vivo', config: '256GB / 12GB RAM / 天玑9300', os: 'Android 14', quantity: 35, updatedAt: '2024.03.03' }
])

// 实体手机表格数据
const physicalPhoneData = ref([
  { id: 1, index: 1, deviceNo: 'PP001', purpose: '采集', delivery: 'team1', project: '项目A', assetName: 'iPhone 15 Pro', brand: '苹果', spec: 'A17 Pro / 256GB', config: '256GB / 8GB RAM', unit: '台', quantity: 50, updatedAt: '2024.03.03' },
  { id: 2, index: 2, deviceNo: 'PP002', purpose: '发声', delivery: 'team2', project: '项目B', assetName: 'Galaxy S24', brand: '三星', spec: '骁龙8 Gen3 / 256GB', config: '256GB / 12GB RAM', unit: '台', quantity: 30, updatedAt: '2024.03.03' },
  { id: 3, index: 3, deviceNo: 'PP003', purpose: '采集', delivery: 'team1', project: '项目A', assetName: 'Pixel 8', brand: '谷歌', spec: 'Tensor G3 / 128GB', config: '128GB / 8GB RAM', unit: '台', quantity: 25, updatedAt: '2024.03.03' },
  { id: 4, index: 4, deviceNo: 'PP004', purpose: '发声', delivery: 'team3', project: '项目C', assetName: 'Redmi Note 13', brand: '红米', spec: '天玑6080 / 128GB', config: '128GB / 6GB RAM', unit: '台', quantity: 40, updatedAt: '2024.03.03' },
  { id: 5, index: 5, deviceNo: 'PP005', purpose: '采集', delivery: 'team2', project: '项目B', assetName: 'X100', brand: 'Vivo', spec: '天玑9300 / 256GB', config: '256GB / 12GB RAM', unit: '台', quantity: 35, updatedAt: '2024.03.03' }
])

// 根据选中卡片动态计算表格数据
const tableData = computed(() => {
  return activeCardIndex.value === 0 ? cloudPhoneData.value : physicalPhoneData.value
})

const filters = ref({
  keyword: '',
  project: '',
  brand: ''
})

const pageSize = ref(100)
const currentPage = ref(1)
const total = ref(568)

// 所属项目选项
const projectOptions = ['项目A', '项目B', '项目C']

// 品牌选项
const brandOptions = ['苹果', '三星', '谷歌', '红米', 'Vivo', 'Oppo']

const handleSearch = () => {
  console.log('搜索:', filters.value)
}

// 处理分页变化事件
const onPageChange = ({ page, pageSize }) => {
  console.log('分页变化:', { page, pageSize })
  // TODO: 根据 activeCardIndex 调用对应的 API
  // handlePageChange({ page, pageSize })
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
    // 根据当前选中的卡片删除对应数据
    if (activeCardIndex.value === 0) {
      const index = cloudPhoneData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        cloudPhoneData.value.splice(index, 1)
      }
    } else {
      const index = physicalPhoneData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        physicalPhoneData.value.splice(index, 1)
      }
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}
</script>

<template>
  <div class="special-device-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <!-- 使用ResourceCard组件 -->
        <resource-card
          :cards="cards"
          v-model:active-index="activeCardIndex"
        />

        <!-- 数据表格 - 设备模式 -->
        <data-table
          :title="tableTitle"
          :filters="filters"
          :table-data="tableData"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          :columns="tableColumns"
          :device-mode="true"
          :project-options="projectOptions"
          :brand-options="brandOptions"
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
.special-device-page {
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
