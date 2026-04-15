<script setup>
/**
 * @description 数据导入页面
 * @date 2024-04-10
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import DataImportUpload from '@/components/DataImportUpload.vue'
import ImportErrorDialog from '@/components/ImportErrorDialog.vue'
import {
  downloadAccountTemplate,
  importAccountData,
  downloadBehaviorTemplate,
  importBehaviorData,
  downloadHotPostTemplate,
  importHotPostData
} from '@/api/dataImport'

// 当前激活的标签页
const activeTab = ref('account')

// 上传组件引用
const uploadRef = ref(null)

// 导入加载状态
const importing = ref(false)

// 导入错误弹框
const showErrorDialog = ref(false)
const errorList = ref([])

// 处理文件变化
const handleFileChange = (files) => {
  console.log('文件变化:', files)
}

// 处理模板下载
const handleDownloadTemplate = async () => {
  try {
    let res
    let fileName

    switch (activeTab.value) {
      case 'account':
        res = await downloadAccountTemplate()
        fileName = '账号基本情况模板.xlsx'
        break
      case 'behavior':
        res = await downloadBehaviorTemplate()
        fileName = '账号行为记录模板.xlsx'
        break
      case 'popular':
        res = await downloadHotPostTemplate()
        fileName = '爆款贴文链接模板.xlsx'
        break
      default:
        ElMessage.warning('未知的导入类型')
        return
    }

    // 创建 blob 并在新窗口打开
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)

    // 尝试在新窗口打开 Excel 文件
    const newWindow = window.open(url, '_blank')

    // 如果新窗口打开失败（可能被浏览器拦截），则下载文件
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // 延迟释放 URL，确保文件可以被打开
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)
  } catch (error) {
    console.error('模板下载失败:', error)
    ElMessage.error('模板下载失败')
  }
}

// 处理确认导入
const handleConfirm = async (files) => {
  if (!files || files.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', files[0].raw)

    let res
    switch (activeTab.value) {
      case 'account':
        res = await importAccountData(formData)
        break
      case 'behavior':
        res = await importBehaviorData(formData)
        break
      case 'popular':
        res = await importHotPostData(formData)
        break
      default:
        ElMessage.warning('未知的导入类型')
        return
    }

    if (res.code === 200) {
      // 检查是否有错误列表
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
        ElMessage.warning('部分数据导入失败')
      } else {
        ElMessage.success('导入成功')
        uploadRef.value?.clearFiles()
      }
    } else {
      // 接口返回错误，检查是否有错误列表
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
      } else {
        ElMessage.error(res.message || '导入失败')
      }
    }
  } catch (error) {
    console.error('导入失败:', error)
    // 检查错误响应中是否有错误列表
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
</script>

<template>
  <div class="data-import-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
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

        <!-- 上传区域 -->
        <div class="upload-wrapper">
          <div class="upload-container">
            <data-import-upload
              ref="uploadRef"
              :single-file="true"
              :confirm-loading="importing"
              @change="handleFileChange"
              @download-template="handleDownloadTemplate"
              @confirm="handleConfirm"
            />
          </div>
        </div>
      </main>
    </div>

    <!-- 导入错误弹框 -->
    <import-error-dialog
      v-model="showErrorDialog"
      :error-list="errorList"
    />
  </div>
</template>

<style lang="scss" scoped>
.data-import-page {
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
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// Tabs 标签页样式
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

// 上传区域样式
.upload-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.upload-container {
  flex: 1;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
