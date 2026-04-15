<script setup>
/**
 * @description 数据导入上传组件
 * @date 2024-04-10
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, Close, Download } from '@element-plus/icons-vue'

const props = defineProps({
  // 是否限制只能上传一个文件
  singleFile: {
    type: Boolean,
    default: true
  },
  // 接受的文件类型
  accept: {
    type: String,
    default: '.xlsx,.xls'
  },
  // 是否显示确定按钮
  showConfirm: {
    type: Boolean,
    default: true
  },
  // 确定按钮加载状态
  confirmLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change', 'remove', 'download-template', 'confirm'])

// 已上传文件列表
const fileList = ref([])

// 处理文件变化
const handleFileChange = (file, files) => {
  if (props.singleFile && fileList.value.length > 0) {
    ElMessage.warning('只能上传一个文件，请先删除已上传的文件')
    return
  }
  if (props.singleFile) {
    fileList.value = [file]
  } else {
    fileList.value = files
  }
  emit('change', fileList.value)
}

// 移除文件
const handleRemove = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emit('remove', file)
  }
}

// 获取文件列表
const getFiles = () => {
  return fileList.value
}

// 清空文件列表
const clearFiles = () => {
  fileList.value = []
}

// 处理模板下载
const handleTemplateDownload = () => {
  emit('download-template')
}

// 处理确认
const handleConfirm = () => {
  emit('confirm', fileList.value)
}

// 暴露方法供父组件调用
defineExpose({
  getFiles,
  clearFiles
})
</script>

<template>
  <div class="data-import-upload">
    <!-- 拖拽上传区域 -->
    <el-upload
      class="upload-dragger"
      drag
      :auto-upload="false"
      :show-file-list="false"
      :accept="accept"
      :on-change="handleFileChange"
    >
      <el-icon class="upload-icon"><UploadFilled /></el-icon>
      <div class="upload-text">点击上传Excel文件</div>
    </el-upload>

    <!-- 模板下载按钮 -->
    <div class="template-download" @click="handleTemplateDownload">
      <el-icon class="download-icon"><Download /></el-icon>
      <span class="download-text">模版下载</span>
    </div>

    <!-- 已上传文件列表 -->
    <div v-if="fileList.length > 0" class="file-list">
      <div v-for="file in fileList" :key="file.uid" class="file-item">
        <div class="file-info">
          <el-icon class="file-icon"><Document /></el-icon>
          <span class="file-name">{{ file.name }}</span>
        </div>
        <el-icon class="remove-icon" @click.stop="handleRemove(file)"><Close /></el-icon>
      </div>
    </div>

    <!-- 确定按钮 -->
    <div v-if="showConfirm" class="confirm-wrapper">
      <el-button
        type="primary"
        :loading="confirmLoading"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data-import-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 360px;
}

.upload-dragger {
  width: 356px;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
    height: 210px;
    background: #fafcff;
    border: 1px dashed #e4e7ed;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:hover {
      border-color: #0060ff;
    }
  }

  .upload-icon {
    font-size: 48px;
    color: #c0c4cc;
  }

  .upload-text {
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #0060ff;
    cursor: pointer;
  }
}

.template-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  .download-icon {
    font-size: 14px;
    color: #0060ff;
  }

  .download-text {
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: #0060ff;
    white-space: nowrap;
  }
}

.file-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2px 4px;

  .file-info {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .file-icon {
    font-size: 16px;
    color: #606266;
  }

  .file-name {
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 22px;
    color: #606266;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }

  .remove-icon {
    font-size: 16px;
    color: #606266;
    cursor: pointer;

    &:hover {
      color: #f56c6c;
    }
  }
}

.confirm-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  padding-top: 24px;

  :deep(.el-button) {
    flex: 1;
    height: 32px;
    background: #0060ff;
    border-color: #0060ff;
    border-radius: 4px;
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;

    &:hover {
      background: #3380ff;
      border-color: #3380ff;
    }
  }
}
</style>
