<script setup>
/**
 * @description 爆款贴文链接上传组件
 * @date 2024-04-24
 */
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import DataImportUpload from '@/components/DataImportUpload.vue'
import ImportErrorDialog from '@/components/ImportErrorDialog.vue'
import { downloadHotPostTemplate, importHotPostData } from '@/api/dataImport'

const uploadRef = ref(null)
const importing = ref(false)
const showErrorDialog = ref(false)
const errorList = ref([])

const uploadConfig = computed(() => {
  return {
    accept: '.zip',
    uploadText: '点击上传文件'
  }
})

const handleFileChange = (files) => {
  console.log('文件变化:', files)
}

const handleDownloadTemplate = async () => {
  try {
    const res = await downloadHotPostTemplate()
    const blob = res instanceof Blob ? res : new Blob([res])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '爆款贴文链接模板.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)

    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('模板下载失败:', error)
    ElMessage.error('模板下载失败')
  }
}

const handleConfirm = async (files) => {
  if (!files || files.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }

  importing.value = true
  try {
    const formData = new FormData()
    const rawFile = files[0].raw || files[0]
    formData.append('file', rawFile)

    const res = await importHotPostData(formData)

    if (res.code === 200) {
      if (res.data?.errorList && res.data.errorList.length > 0) {
        errorList.value = res.data.errorList
        showErrorDialog.value = true
        ElMessage.warning('部分数据导入失败')
      } else {
        ElMessage.success('导入成功')
        uploadRef.value?.clearFiles()
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
</script>

<template>
  <div class="upload-wrapper">
    <div class="upload-container">
      <data-import-upload
        ref="uploadRef"
        :single-file="true"
        :accept="uploadConfig.accept"
        :upload-text="uploadConfig.uploadText"
        :confirm-loading="importing"
        @change="handleFileChange"
        @download-template="handleDownloadTemplate"
        @confirm="handleConfirm"
      />
    </div>
  </div>

  <!-- 导入错误弹框 -->
  <import-error-dialog
    v-model="showErrorDialog"
    :error-list="errorList"
  />
</template>

<style lang="scss" scoped>
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
