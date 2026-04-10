<script setup>
/**
 * @description 数据导入上传组件
 * @date 2024-04-10
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, Close } from '@element-plus/icons-vue'

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
  }
})

const emit = defineEmits(['change', 'remove'])

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
</style>
