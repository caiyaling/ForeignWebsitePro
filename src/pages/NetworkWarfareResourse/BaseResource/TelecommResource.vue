<script setup>
/**
 * @description 电信资源页面
 * @date 2024-04-10
 */
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import ResourceCard from '@/pages/NetworkWarfareResourse/components/ResourceCard.vue'
import DataTable from '@/pages/NetworkWarfareResourse/components/DataTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'

// 当前选中的卡片索引
const activeCardIndex = ref(0)

// 卡片数据
const cards = [
  {
    name: '短信',
    total: '100/400万次',
    type: 'chart',
    icon: '/figma/telecomm-sms.svg',
    chart: {
      outerData: [
        { value: 100, name: '已使用', color: '#f77234' },
        { value: 300, name: '剩余额度', color: '#165dff' }
      ],
      innerData: [
        { value: 100, name: '已使用', color: '#f77234' },
        { value: 300, name: '剩余额度', color: '#165dff' }
      ],
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '剩余额度', color: '#165dff' }
      ]
    }
  },
  {
    name: '语音',
    total: '100/400万次',
    type: 'chart',
    icon: '/figma/telecomm-voice.svg',
    chart: {
      outerData: [
        { value: 100, name: '已使用', color: '#f77234' },
        { value: 300, name: '剩余额度', color: '#165dff' }
      ],
      innerData: [
        { value: 100, name: '已使用', color: '#f77234' },
        { value: 300, name: '剩余额度', color: '#165dff' }
      ],
      legends: [
        { label: '已使用', color: '#f77234' },
        { label: '剩余额度', color: '#165dff' }
      ]
    }
  }
]

// 短信表格列配置
const smsColumns = [
  { prop: 'taskId', label: '任务ID', minWidth: 120 },
  { prop: 'type', label: '类型', minWidth: 100 },
  { prop: 'sendType', label: '发送类型', minWidth: 100 },
  { prop: 'sendResult', label: '发送结果', minWidth: 100 },
  { prop: 'deliveryTime', label: '送达时间', minWidth: 120 },
  { prop: 'originalPhone', label: '原始接收号码', minWidth: 140 },
  { prop: 'content', label: '短信内容', minWidth: 200 },
  { prop: 'updatedAt', label: '更新时间', minWidth: 120 },
  { prop: 'status', label: '状态', minWidth: 100, type: 'status' },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 语音表格列配置
const voiceColumns = [
  { prop: 'taskId', label: '任务ID', minWidth: 120 },
  { prop: 'type', label: '类型', minWidth: 100 },
  { prop: 'sendType', label: '发送类型', minWidth: 100 },
  { prop: 'sendResult', label: '发送结果', minWidth: 100 },
  { prop: 'deliveryTime', label: '送达时间', minWidth: 120 },
  { prop: 'originalPhone', label: '原始接收号码', minWidth: 140 },
  { prop: 'content', label: '通话备注', minWidth: 200 },
  { prop: 'updatedAt', label: '更新时间', minWidth: 120 },
  { prop: 'status', label: '状态', minWidth: 100, type: 'status' },
  { prop: 'action', label: '操作', minWidth: 80, type: 'action', actionType: 'delete' }
]

// 根据选中卡片动态计算表格标题
const tableTitle = computed(() => {
  return activeCardIndex.value === 0 ? '短信台账' : '语音台账'
})

// 根据选中卡片动态计算表格列配置
const tableColumns = computed(() => {
  return activeCardIndex.value === 0 ? smsColumns : voiceColumns
})

// 短信表格数据
const smsData = ref([
  { id: 1, index: 1, taskId: 'SMS001', type: '验证码', sendType: '单发', sendResult: '成功', deliveryTime: '2024.03.03 10:30', originalPhone: '+86-138****1234', content: '您的验证码是123456，有效期5分钟', updatedAt: '2024.03.03', status: '已使用' },
  { id: 2, index: 2, taskId: 'SMS002', type: '通知', sendType: '群发', sendResult: '成功', deliveryTime: '2024.03.03 11:20', originalPhone: '+86-139****5678', content: '您的订单已发货，请注意查收', updatedAt: '2024.03.03', status: '剩余额度' },
  { id: 3, index: 3, taskId: 'SMS003', type: '营销', sendType: '群发', sendResult: '部分成功', deliveryTime: '2024.03.03 14:15', originalPhone: '+86-137****9012', content: '限时优惠活动，点击查看详情', updatedAt: '2024.03.03', status: '已使用' },
  { id: 4, index: 4, taskId: 'SMS004', type: '验证码', sendType: '单发', sendResult: '成功', deliveryTime: '2024.03.03 15:45', originalPhone: '+1-555-123-4567', content: 'Your verification code is 789012', updatedAt: '2024.03.03', status: '剩余额度' },
  { id: 5, index: 5, taskId: 'SMS005', type: '通知', sendType: '单发', sendResult: '失败', deliveryTime: '-', originalPhone: '+81-90-1234-5678', content: '重要通知：系统维护公告', updatedAt: '2024.03.03', status: '已使用' }
])

// 语音表格数据
const voiceData = ref([
  { id: 1, index: 1, taskId: 'VCE001', type: '通知', sendType: '自动', sendResult: '接通', deliveryTime: '2024.03.03 09:30', originalPhone: '+86-138****1234', duration: '2分30秒', updatedAt: '2024.03.03', status: '已使用' },
  { id: 2, index: 2, taskId: 'VCE002', type: '验证', sendType: '自动', sendResult: '接通', deliveryTime: '2024.03.03 10:15', originalPhone: '+86-139****5678', duration: '1分15秒', updatedAt: '2024.03.03', status: '剩余额度' },
  { id: 3, index: 3, taskId: 'VCE003', type: '营销', sendType: '手动', sendResult: '未接通', deliveryTime: '-', originalPhone: '+1-555-123-4567', duration: '-', updatedAt: '2024.03.03', status: '已使用' },
  { id: 4, index: 4, taskId: 'VCE004', type: '通知', sendType: '自动', sendResult: '接通', deliveryTime: '2024.03.03 14:20', originalPhone: '+81-90-1234-5678', duration: '3分45秒', updatedAt: '2024.03.03', status: '剩余额度' },
  { id: 5, index: 5, taskId: 'VCE005', type: '验证', sendType: '自动', sendResult: '接通', deliveryTime: '2024.03.03 16:00', originalPhone: '+82-10-1234-5678', duration: '45秒', updatedAt: '2024.03.03', status: '已使用' }
])

// 根据选中卡片动态计算表格数据
const tableData = computed(() => {
  return activeCardIndex.value === 0 ? smsData.value : voiceData.value
})

const filters = ref({
  keyword: '',
  project: ''
})

const pageSize = ref(100)
const currentPage = ref(1)
const total = ref(568)

const handleSearch = () => {
  console.log('搜索:', filters.value)
}

// 处理分页变化事件
const onPageChange = ({ page, pageSize }) => {
  console.log('分页变化:', { page, pageSize })
  // TODO: 根据 activeCardIndex 调用对应的 API
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
      const index = smsData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        smsData.value.splice(index, 1)
      }
    } else {
      const index = voiceData.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        voiceData.value.splice(index, 1)
      }
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}
</script>

<template>
  <div class="telecomm-resource-page">
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
          :show-project-filter="false"
          :show-brand-filter="false"
          search-placeholder="关键词：ID，主叫号码，被叫号码"
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
.telecomm-resource-page {
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
