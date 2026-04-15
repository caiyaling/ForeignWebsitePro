<script setup>
/**
 * @description 导入错误弹框组件
 * @date 2024-04-15
 */
import { computed } from 'vue'
import { ElDialog, ElTable, ElTableColumn, ElButton } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  errorList: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: '导入失败'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="error-tip">
      <span class="error-icon">⚠️</span>
      <span>以下数据导入失败，请检查后重新导入：</span>
    </div>

    <el-table
      :data="errorList"
      border
      style="width: 100%"
      max-height="400px"
    >
      <el-table-column
        prop="rowNum"
        label="行号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="reason"
        label="失败原因"
        min-width="200"
        show-overflow-tooltip
      />
    </el-table>

    <template #footer>
      <el-button type="primary" @click="handleClose">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.error-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fef0f0;
  border-radius: 4px;
  color: #f56c6c;
  font-size: 14px;
}

.error-icon {
  font-size: 16px;
}
</style>
