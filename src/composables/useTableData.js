/**
 * @description 表格数据请求 composable
 * @date 2024-04-13
 */
import { ref, reactive } from 'vue'
import request from '@/utils/request'

/**
 * 表格数据请求 composable
 * @param {Object} options 配置选项
 * @param {string} options.apiUrl API 接口地址
 * @param {Object} options.defaultFilters 默认筛选条件
 * @param {number} options.defaultPageSize 默认每页条数
 * @param {Function} options.dataTransform 数据转换函数
 * @returns {Object} 表格数据和相关方法
 */
export function useTableData(options = {}) {
  const {
    apiUrl = '',
    defaultFilters = {},
    defaultPageSize = 100,
    dataTransform = null
  } = options

  // 表格数据
  const tableData = ref([])

  // 分页状态
  const pageSize = ref(defaultPageSize)
  const currentPage = ref(1)
  const total = ref(0)

  // 筛选条件
  const filters = reactive({
    keyword: '',
    ...defaultFilters
  })

  // 加载状态
  const loading = ref(false)

  // 错误信息
  const error = ref(null)

  /**
   * 获取表格数据
   */
  const fetchData = async () => {
    if (!apiUrl) {
      console.warn('useTableData: apiUrl is required')
      return
    }

    loading.value = true
    error.value = null

    try {
      const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...filters
      }

      const response = await request.get(apiUrl, { params })

      // 处理响应数据
      if (response) {
        // 支持不同的响应格式
        const data = response.data || response.list || response
        const totalValue = response.total || response.count || 0

        // 数据转换
        tableData.value = dataTransform ? dataTransform(data) : data
        total.value = totalValue
      }
    } catch (err) {
      error.value = err.message || '请求失败'
      console.error('useTableData fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理分页变化
   * @param {Object} param0 分页参数
   */
  const handlePageChange = ({ page, pageSize: size }) => {
    currentPage.value = page
    pageSize.value = size
    fetchData()
  }

  /**
   * 处理筛选条件变化并重新查询
   */
  const handleSearch = () => {
    currentPage.value = 1 // 重置到第一页
    fetchData()
  }

  /**
   * 重置筛选条件
   */
  const resetFilters = () => {
    Object.keys(filters).forEach(key => {
      filters[key] = defaultFilters[key] || ''
    })
    currentPage.value = 1
    fetchData()
  }

  /**
   * 刷新当前页数据
   */
  const refresh = () => {
    fetchData()
  }

  return {
    // 状态
    tableData,
    pageSize,
    currentPage,
    total,
    filters,
    loading,
    error,

    // 方法
    fetchData,
    handlePageChange,
    handleSearch,
    resetFilters,
    refresh
  }
}

export default useTableData
