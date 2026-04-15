<script setup>
import FiltersForm from './FiltersForm.vue'

const props = defineProps({
  title: {
    type: String,
    default: '账号台账'
  },
  filters: {
    type: Object,
    default: () => ({
      keyword: '',
      accountType: '',
      platform: '',
      latestStatus: '',
      isSampled: ''
    })
  },
  platformOptions: {
    type: Array,
    default: () => []
  },
  accountTypeOptions: {
    type: Array,
    default: () => []
  },
  latestStatusOptions: {
    type: Array,
    default: () => ['正常', '异常']
  },
  showSampledFilter: {
    type: Boolean,
    default: true
  },
  showStatusFilter: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '关键词，账号ID，用户昵称'
  }
})

const emit = defineEmits(['update:filters', 'search'])
</script>

<template>
  <div class="search-bar">
    <div class="panel-title-wrap">
      <span class="panel-accent"></span>
      <h2 class="panel-title">{{ title }}</h2>
    </div>
    <filters-form
      :filters="filters"
      :platform-options="platformOptions"
      :account-type-options="accountTypeOptions"
      :latest-status-options="latestStatusOptions"
      :show-sampled-filter="showSampledFilter"
      :show-status-filter="showStatusFilter"
      :search-placeholder="searchPlaceholder"
      @update:filters="val => emit('update:filters', val)"
      @search="emit('search')"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title-wrap {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.panel-accent {
  width: 4px;
  height: 20px;
  border-radius: 0;
  background: #0048FF;
}

.panel-title {
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: #303133;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', SimHei, Arial, Helvetica, sans-serif;
  margin: 0;
  width: 135px;
  padding-left: 8px;
}
</style>
