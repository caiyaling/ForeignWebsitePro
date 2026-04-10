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

// 当前激活的标签页
const activeTab = ref('account')

// 上传组件引用
const uploadRef = ref(null)

// 处理文件变化
const handleFileChange = (files) => {
  console.log('文件变化:', files)
}

// 提交上传
const handleSubmit = () => {
  const files = uploadRef.value?.getFiles()
  if (!files || files.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }
  console.log('上传文件:', files)
  ElMessage.success('上传成功')
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
              @change="handleFileChange"
            />
          </div>
        </div>
      </main>
    </div>
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
