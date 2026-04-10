<script setup>
/**
 * @description 批量导入弹框组件
 * @date 2024-04-10
 */
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Download, Document, Close } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '批量导入'
  },
  templateUrl: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '.xlsx,.xls'
  },
  // 是否限制只能上传一个文件
  singleFile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'download-template'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 已上传文件列表
const fileList = ref([])

// 上传组件引用
const uploadRef = ref(null)

// 处理文件变化
const handleFileChange = (file, files) => {
  // 如果限制单文件且已有文件，提示用户
  if (props.singleFile && fileList.value.length > 0) {
    ElMessage.warning('只能上传一个文件，请先删除已上传的文件')
    return
  }
  // 如果限制单文件，只保留最新的一个文件
  if (props.singleFile) {
    fileList.value = [file]
  } else {
    fileList.value = files
  }
}

// 移除文件
const handleRemove = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

// 模版下载
const handleDownloadTemplate = () => {
  emit('download-template')
  // 如果提供了模板URL，则下载
  if (props.templateUrl) {
    const link = document.createElement('a')
    link.href = props.templateUrl
    link.download = '导入模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// 确定导入
const handleConfirm = () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }
  emit('confirm', fileList.value)
}

// 取消
const handleCancel = () => {
  visible.value = false
}

// 关闭弹框时清空文件列表
const handleClose = () => {
  fileList.value = []
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="408px"
    :close-on-click-modal="false"
    :show-close="true"
    @close="handleClose"
    class="batch-import-dialog"
  >
    <div class="upload-wrapper">
      <!-- 上传拖拽区域 -->
      <el-upload
        ref="uploadRef"
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

      <!-- 模版下载按钮 -->
      <div class="template-download" @click="handleDownloadTemplate">
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
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancel-btn" @click="handleCancel">取消</el-button>
        <el-button class="confirm-btn" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
// 弹框整体样式
.batch-import-dialog {
  :deep(.el-dialog) {
    border-radius: 4px;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.12);
  }

  :deep(.el-dialog__header) {
    padding: 24px 24px 0;
    margin-right: 0;
    border-bottom: none;
  }

  :deep(.el-dialog__headerbtn) {
    top: 24px;
    right: 24px;
    width: 16px;
    height: 16px;

    .el-dialog__close {
      font-size: 16px;
      color: #909399;

      &:hover {
        color: #0060ff;
      }
    }
  }

  :deep(.el-dialog__title) {
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 18px;
    font-weight: 700;
    line-height: 26px;
    color: #303133;
  }

  :deep(.el-dialog__body) {
    padding: 24px;
    display: flex;
    justify-content: center;
  }

  :deep(.el-dialog__footer) {
    padding: 0 24px 24px;
    border-top: none;
  }
}

// 上传容器 - 宽度360px，垂直排列，gap: 8px
.upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 360px;
}

// 上传拖拽区域 - 宽度356px，高度210px
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

// 模版下载按钮 - 高度32px，居中对齐
.template-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  cursor: pointer;
  user-select: none;

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
  }

  &:hover {
    opacity: 0.8;
  }
}

// 文件列表
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

// 底部按钮
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  .cancel-btn {
    height: 32px;
    min-width: 72px;
    padding: 4px 16px;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: #606266;

    &:hover {
      color: #0060ff;
      border-color: #c0c4cc;
    }
  }

  .confirm-btn {
    height: 32px;
    min-width: 72px;
    padding: 4px 16px;
    background: #0060ff;
    border: 1px solid #0060ff;
    border-radius: 4px;
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: #fff;

    &:hover {
      background: #3370ff;
      border-color: #3370ff;
    }
  }
}
</style>
