/**
 * @description 语音台账相关 API
 * @date 2024-04-13
 */
import request from '@/utils/request'

// ==================== 语音台账 ====================

/**
 * 语音使用统计
 * @returns {Promise} [{ label, value }]
 */
export function getVoiceStatistics() {
  return request.get('/voice-ledger/statistics')
}

/**
 * 分页查询语音台账
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词（模糊匹配任务ID、主叫号码、被叫号码）
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getVoicePage(params) {
  return request.get('/voice-ledger/page', { params })
}

/**
 * 删除语音台账
 * @param {number} id - 主键ID
 * @returns {Promise}
 */
export function deleteVoice(id) {
  return request.delete(`/voice-ledger/${id}`)
}

/**
 * 导出语音台账
 * @param {Object} params - 导出参数
 * @param {number} params.exportType - 导出类型：1-按当前查询条件导出，2-导出全部
 * @param {string} params.keyword - 关键词
 * @returns {Promise}
 */
export function exportVoice(params) {
  return request.get('/voice-ledger/export', { params, responseType: 'blob' })
}

/**
 * 导入语音台账
 * @param {FormData} data - Excel文件
 * @returns {Promise}
 */
export function importVoice(data) {
  return request.post('/voice-ledger/import', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 下载语音台账导入模板
 * @returns {Promise}
 */
export function downloadVoiceTemplate() {
  return request.get('/voice-ledger/template', { responseType: 'blob' })
}
