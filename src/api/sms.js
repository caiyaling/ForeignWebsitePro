/**
 * @description 短信台账相关 API
 * @date 2024-04-13
 */
import request from '@/utils/request'

// ==================== 短信台账 ====================

/**
 * 短信使用统计
 * @returns {Promise} [{ label, value }]
 */
export function getSmsStatistics() {
  return request.get('/sms-ledger/statistics')
}

/**
 * 分页查询短信台账
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词（模糊匹配任务ID、接收号码）
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getSmsPage(params) {
  return request.get('/sms-ledger/page', { params })
}

/**
 * 删除短信台账
 * @param {number} id - 主键ID
 * @returns {Promise}
 */
export function deleteSms(id) {
  return request.delete(`/sms-ledger/${id}`)
}

/**
 * 导出短信台账
 * @param {Object} params - 导出参数
 * @param {number} params.exportType - 导出类型：1-按当前查询条件导出，2-导出全部
 * @param {string} params.keyword - 关键词
 * @returns {Promise}
 */
export function exportSms(params) {
  return request.get('/sms-ledger/export', { params, responseType: 'blob' })
}

/**
 * 导入短信台账
 * @param {FormData} data - Excel文件
 * @returns {Promise}
 */
export function importSms(data) {
  return request.post('/sms-ledger/import', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 下载短信台账导入模板
 * @returns {Promise}
 */
export function downloadSmsTemplate() {
  return request.get('/sms-ledger/template', { responseType: 'blob' })
}
