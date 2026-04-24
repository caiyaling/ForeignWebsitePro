<script setup>
/**
 * @description 账号基本情况表格组件
 * @date 2024-04-24
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElSelect, ElOption, ElButton, ElInput, ElDatePicker, ElTableColumn } from 'element-plus'
import MultiHeaderTable from '@/components/MultiHeaderTable.vue'
import BatchImportDialog from '@/components/BatchImportDialog.vue'
import ImportErrorDialog from '@/components/ImportErrorDialog.vue'
import { getAccountPage, getPlatforms, getAccountTypes, getStatuses } from '@/api/account'
import { exportAccountData, downloadAccountTemplate, importAccountData } from '@/api/dataImport'

const router = useRouter()

// 筛选条件
const filters = ref({
  keyword: '',
  accountType: '',
  platformName: '',
  latestStatus: '',
  isSampled: '',
  startDate: '',
  endDate: ''
})

// 日期范围
const dateRange = ref([])

// 下拉选项
const platformOptions = ref([])
const accountTypeOptions = ref([])
const latestStatusOptions = ref([])

// 表格数据
const tableData = ref([])
const loading = ref(false)
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)

// 表格高度
const tableHeight = ref(600)

// 批量导入弹框
const showImportDialog = ref(false)
const importing = ref(false)

// 导入错误弹框
const showErrorDialog = ref(false)
const errorList = ref([])

// 表格列配置
const columns = ref([
  { prop: 'accountType', label: '账号类型', width: 120 },
  { prop: 'deliveryParty', label: '交付方', width: 120 },
  { prop: 'statisticsStartDate', label: '统计开始日期', width: 120 },
  { prop: 'statisticsEndDate', label: '统计结束日期', width: 120 },
  { prop: 'isSampled', label: '是否抽检', width: 80, align: 'center' },
  { prop: 'sampleResult', label: '抽检结果', width: 80, align: 'center' },
  {
    label: '账号基本信息',
    align: 'center',
    children: [
      { prop: 'accountCode', label: '账号编号', width: 120, showOverflowTooltip: true },
      { prop: 'accountVersion', label: '账号版本号', width: 100 },
      { prop: 'accountPositioning', label: '账号定位', width: 100, showOverflowTooltip: true },
      { prop: 'platformName', label: '平台名称', width: 100 },
      { prop: 'userNickname', label: '用户昵称', width: 100, showOverflowTooltip: true },
      { prop: 'accountId', label: '账号ID', width: 120, showOverflowTooltip: true },
      { prop: 'linkUrl', label: '链接URL', width: 120, showOverflowTooltip: true },
      { prop: 'registerRegion', label: '注册地区', width: 100 },
      { prop: 'registerTime', label: '注册时间', width: 100 },
      { prop: 'fansCount', label: '粉丝数量', width: 100 },
      { prop: 'friendsCount', label: '好友数量', width: 100 },
      { prop: 'groupCount', label: '群组数量', width: 100 },
      { prop: 'groupAvgCount', label: '群组平均人数', width: 100 },
      { prop: 'historyPostCount', label: '历史发言数量', width: 100 },
      { prop: 'accountInfoCompleteness', label: '账号信息完善度', width: 120 }
    ]
  },
  {
    label: '虚拟人设信息',
    align: 'center',
    children: [
      { prop: 'gender', label: '性别', width: 80 },
      { prop: 'region', label: '地区', width: 100 },
      { prop: 'nation', label: '民族', width: 80 },
      { prop: 'language', label: '语言', width: 80 },
      { prop: 'school', label: '毕业院校', width: 120, showOverflowTooltip: true },
      { prop: 'education', label: '学历', width: 80 },
      { prop: 'maritalStatus', label: '婚姻状况', width: 100 },
      { prop: 'industry', label: '行业', width: 100 },
      { prop: 'occupation', label: '职业', width: 100 },
      { prop: 'hobbies', label: '兴趣爱好', width: 120, showOverflowTooltip: true },
      { prop: 'religion', label: '宗教信仰', width: 100 },
      { prop: 'tags', label: '标签', width: 120, showOverflowTooltip: true }
    ]
  },
  {
    label: '账号运维信息',
    align: 'center',
    children: [
      { prop: 'loginMethod', label: '登录方式', width: 100 },
      { prop: 'loginPassword', label: '登录密码', width: 100, showOverflowTooltip: true },
      { prop: 'bindPhone', label: '绑定手机号', width: 120 },
      { prop: 'phoneRegion', label: '手机号归属地', width: 120 },
      { prop: 'bindEmail', label: '绑定邮箱', width: 150, showOverflowTooltip: true },
      { prop: 'networkIp', label: '配套网络IP', width: 120, showOverflowTooltip: true },
      { prop: 'systemTimezone', label: '系统时区', width: 100 },
      { prop: 'browserLanguage', label: '浏览器语言', width: 120 },
      { prop: 'userAgent', label: 'User Agent', width: 150, showOverflowTooltip: true },
      { prop: 'latestStatus', label: '最新状态', width: 100 },
      { prop: 'checkDate', label: '检测日期', width: 100 },
      { prop: 'invalidDate', label: '失效日期', width: 100 },
      { prop: 'remark', label: '备注', width: 150, showOverflowTooltip: true }
    ]
  },
  {
    label: '账号申诉/替换记录',
    align: 'center',
    children: [
      { prop: 'accountBannedTime', label: '账号被封时间', width: 150 },
      { prop: 'accountRecoveryTime', label: '账号恢复时间', width: 150 },
      { prop: 'accountReplaceTime', label: '账号替换时间', width: 150 },
      { prop: 'replacedAccountId', label: '替换后账号ID', width: 150 },
      { prop: 'banReason', label: '账号封禁原因', width: 180, showOverflowTooltip: true },
      { prop: 'appealUpdateTime', label: '更新时间', width: 120 }
    ]
  }
])

// 获取筛选选项
const fetchFilterOptions = async () => {
  try {
    const [platformsRes, typesRes, statusesRes] = await Promise.all([
      getPlatforms(),
      getAccountTypes(),
      getStatuses()
    ])

    if (platformsRes.code === 200 && platformsRes.data) {
      platformOptions.value = platformsRes.data
    }
    if (typesRes.code === 200 && typesRes.data) {
      accountTypeOptions.value = typesRes.data
    }
    if (statusesRes.code === 200 && statusesRes.data) {
      latestStatusOptions.value = statusesRes.data
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
  }
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const params = {
      keyword: filters.value.keyword || undefined,
      accountType: filters.value.accountType || undefined,
      platformName: filters.value.platformName || undefined,
      latestStatus: filters.value.latestStatus || undefined,
      isSampled: filters.value.isSampled || undefined,
      startDate: filters.value.startDate || undefined,
      endDate: filters.value.endDate || undefined,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const res = await getAccountPage(params)
    if (res.code === 200 && res.data) {
      tableData.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取表格数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchTableData()
}

// 处理日期变化
const handleDateChange = (val) => {
  if (val && val.length === 2) {
    filters.value.startDate = val[0]
    filters.value.endDate = val[1]
  } else {
    filters.value.startDate = ''
    filters.value.endDate = ''
  }
}

// 处理批量导入 - 打开弹框
const handleBatchImport = () => {
  showImportDialog.value = true
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const res = await downloadAccountTemplate()
    const blob = res instanceof Blob ? res : new Blob([res])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '账号基本情况导入模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('模板下载失败:', error)
    ElMessage.error('模板下载失败')
  }
}

// 确定导入
const handleImportConfirm = async (files) => {
  if (!files || files.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }

  importing.value = true
  try {
    const formData = new FormData()
    const rawFile = files[0].raw || files[0]
    formData.append('file', rawFile)

    const res = await importAccountData(formData)

    if (res.code === 200) {
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
        ElMessage.warning('部分数据导入失败')
      } else {
        ElMessage.success('导入成功')
        showImportDialog.value = false
        fetchTableData()
      }
    } else {
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
      } else {
        ElMessage.error(res.message || '导入失败')
      }
    }
  } catch (error) {
    console.error('导入失败:', error)
    if (error.response?.data?.errorList && error.response.data.errorList.length > 0) {
      errorList.value = error.response.data.errorList
      showErrorDialog.value = true
    } else {
      ElMessage.error('导入失败')
    }
  } finally {
    importing.value = false
  }
}

// 处理批量导出
const handleBatchExport = async () => {
  try {
    const res = await exportAccountData()
    if (res) {
      const blob = res instanceof Blob ? res : new Blob([res])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '账号基本情况数据.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success('导出成功')
    }
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchTableData()
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTableData()
}

// 点击详情
const handleDetail = (row) => {
  const routeData = router.resolve({
    path: '/network-warfare-resource/account-detail',
    query: {
      accountCode: row.accountCode,
      from: router.currentRoute.value.path,
      accountType: row.accountType || ''
    }
  })
  window.open(routeData.href, '_blank')
}

// 初始化
onMounted(() => {
  fetchFilterOptions()
  fetchTableData()
})
</script>

<template>
  <div class="account-table-panel">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <!-- 关键词搜索 -->
      <div class="search-input-wrapper">
        <div class="search-prefix">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#606266" stroke-width="1.5"/>
            <path d="M9.5 9.5L12.5 12.5" stroke="#606266" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <el-input
          v-model="filters.keyword"
          placeholder="关键词：资产编号，账号ID，用户昵称"
          class="search-input"
          clearable
        />
      </div>

      <!-- 下拉筛选 -->
      <div class="filter-selects">
        <el-select
          v-model="filters.accountType"
          placeholder="账号类型"
          class="filter-select"
          clearable
        >
          <el-option
            v-for="item in accountTypeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-select
          v-model="filters.platformName"
          placeholder="平台名称"
          class="filter-select"
          clearable
        >
          <el-option
            v-for="item in platformOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-select
          v-model="filters.latestStatus"
          placeholder="最新状态"
          class="filter-select"
          clearable
        >
          <el-option
            v-for="item in latestStatusOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-select
          v-model="filters.isSampled"
          placeholder="是否抽检"
          class="filter-select"
          clearable
        >
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>

        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="To"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-picker"
          @change="handleDateChange"
        />
      </div>

      <!-- 搜索按钮 -->
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button class="action-btn" @click="handleBatchImport">批量导入</el-button>
        <el-button class="action-btn" @click="handleBatchExport">批量导出</el-button>
      </div>
    </div>

    <!-- 多级表头表格 -->
    <multi-header-table
      :data="tableData"
      :columns="columns"
      :height="tableHeight"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      show-selection
      show-index
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <!-- 操作列 -->
      <template #append-columns>
        <el-table-column label="操作" width="60" align="center" fixed="right">
          <template #default="{ row }">
            <span class="action-link" @click="handleDetail(row)">详情</span>
          </template>
        </el-table-column>
      </template>
    </multi-header-table>

    <!-- 批量导入弹框 -->
    <batch-import-dialog
      v-model="showImportDialog"
      title="账号基本情况批量导入"
      accept=".xlsx,.xls"
      :single-file="true"
      @download-template="handleDownloadTemplate"
      @confirm="handleImportConfirm"
    />

    <!-- 导入错误弹框 -->
    <import-error-dialog
      v-model="showErrorDialog"
      :error-list="errorList"
    />
  </div>
</template>

<style lang="scss" scoped>
.account-table-panel {
  flex: 1;
  min-height: 0;
  padding: 20px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin-bottom: 16px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 398px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.search-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-right: none;
  border-radius: 4px 0 0 4px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 0 4px 4px 0;
  height: 32px;
  box-shadow: 0 0 0 1px #e4e7ed inset;
  padding: 0 8px;
}

.search-input :deep(.el-input__inner) {
  font-size: 13px;
  color: #303133;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
  font-size: 13px;
}

.filter-selects {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.filter-select {
  width: 280px;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  height: 32px;
}

.filter-select :deep(.el-input__inner) {
  font-size: 14px;
  color: #303133;
}

.filter-select :deep(.el-input__inner::placeholder) {
  color: #a8abb2;
}

.date-picker {
  width: 280px;
}

.date-picker :deep(.el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  height: 32px;
}

.search-btn {
  height: 32px;
  padding: 0 16px;
  background: #0048ff;
  border-color: #0048ff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  height: 32px;
  padding: 0 16px;
  background: #ecf5ff;
  border-color: #0048ff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #0048ff;
}

.action-link {
  font-size: 14px;
  color: #0048ff;
  cursor: pointer;

  &:hover {
    color: #3370ff;
  }
}
</style>