/**
 * @description 手机卡号相关 API
 * @date 2024-04-13
 */
import request from '@/utils/request'

// ==================== 手机卡号台账 ====================

/**
 * 归属地统计
 * @returns {Promise} [{ label, value }]
 */
export function getSimCardLocationStats() {
  return request.get('/sim-card-ledger/location-statistics')
}

/**
 * 卡号类型统计
 * @returns {Promise} [{ label, value }]
 */
export function getSimCardTypeStats() {
  return request.get('/sim-card-ledger/type-statistics')
}

/**
 * 分页查询手机卡号台账
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词（模糊匹配编号、手机卡序列号、手机号）
 * @param {string} params.projectCode - 所属项目
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getSimCardPage(params) {
  return request.get('/sim-card-ledger/page', { params })
}

/**
 * 获取项目列表
 * @returns {Promise}
 */
export function getSimCardProjectList() {
  return request.get('/sim-card-ledger/project-list')
}

/**
 * 导出手机卡号台账
 * @param {Object} params - 导出参数
 * @returns {Promise}
 */
export function exportSimCard(params) {
  return request.get('/sim-card-ledger/export', { params, responseType: 'blob' })
}

/**
 * 导入手机卡号台账
 * @param {FormData} data - Excel文件
 * @returns {Promise}
 */
export function importSimCard(data) {
  return request.post('/sim-card-ledger/import', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 下载手机卡号台账导入模板
 * @returns {Promise}
 */
export function downloadSimCardTemplate() {
  return request.get('/sim-card-ledger/template', { responseType: 'blob' })
}

/**
 * 删除手机卡号台账
 * @param {number} id - 主键ID
 * @returns {Promise}
 */
export function deleteSimCard(id) {
  return request.delete(`/sim-card-ledger/${id}`)
}
