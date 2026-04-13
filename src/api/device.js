/**
 * @description 设备相关 API
 * @date 2024-04-13
 */
import request from '@/utils/request'

// ==================== 云手机台账 ====================

/**
 * 云手机使用情况统计
 * @returns {Promise} { usedQuantity, availableQuantity }
 */
export function getCloudPhoneUsageStats() {
  return request.get('/cloud-phone-ledger/usage-statistics')
}

/**
 * 分页查询云手机台账
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词（模糊查询编号）
 * @param {string} params.projectCode - 所属项目
 * @param {string} params.brand - 品牌
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getCloudPhonePage(params) {
  return request.get('/cloud-phone-ledger/page', { params })
}

/**
 * 导出云手机台账
 * @param {Object} params - 导出参数
 * @returns {Promise}
 */
export function exportCloudPhone(params) {
  return request.get('/cloud-phone-ledger/export', { params, responseType: 'blob' })
}

/**
 * 导入云手机台账
 * @param {FormData} data - Excel文件
 * @returns {Promise}
 */
export function importCloudPhone(data) {
  return request.post('/cloud-phone-ledger/import', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 下载云手机台账导入模板
 * @returns {Promise}
 */
export function downloadCloudPhoneTemplate() {
  return request.get('/cloud-phone-ledger/template', { responseType: 'blob' })
}

/**
 * 删除云手机台账
 * @param {number} id - 主键ID
 * @returns {Promise}
 */
export function deleteCloudPhone(id) {
  return request.delete(`/cloud-phone-ledger/${id}`)
}

// ==================== 实体手机台账 ====================

/**
 * 实体手机使用情况统计（按品牌）
 * @returns {Promise} { brandStatisticsList: [{ brand, usedQuantity, availableQuantity }] }
 */
export function getPhysicalPhoneUsageStats() {
  return request.get('/physical-phone-ledger/usage-statistics')
}

/**
 * 分页查询实体手机台账
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词（模糊查询编号）
 * @param {string} params.projectCode - 所属项目
 * @param {string} params.brand - 品牌
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getPhysicalPhonePage(params) {
  return request.get('/physical-phone-ledger/page', { params })
}

/**
 * 导出实体手机台账
 * @param {Object} params - 导出参数
 * @returns {Promise}
 */
export function exportPhysicalPhone(params) {
  return request.get('/physical-phone-ledger/export', { params, responseType: 'blob' })
}

/**
 * 导入实体手机台账
 * @param {FormData} data - Excel文件
 * @returns {Promise}
 */
export function importPhysicalPhone(data) {
  return request.post('/physical-phone-ledger/import', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 下载实体手机台账导入模板
 * @returns {Promise}
 */
export function downloadPhysicalPhoneTemplate() {
  return request.get('/physical-phone-ledger/template', { responseType: 'blob' })
}

/**
 * 删除实体手机台账
 * @param {number} id - 主键ID
 * @returns {Promise}
 */
export function deletePhysicalPhone(id) {
  return request.delete(`/physical-phone-ledger/${id}`)
}

// ==================== 下拉筛选选项 ====================

/**
 * 获取云手机品牌列表
 * @returns {Promise}
 */
export function getCloudPhoneBrandList() {
  return request.get('/cloud-phone-ledger/brand-list')
}

/**
 * 获取云手机项目列表
 * @returns {Promise}
 */
export function getCloudPhoneProjectList() {
  return request.get('/cloud-phone-ledger/project-list')
}

/**
 * 获取实体手机品牌列表
 * @returns {Promise}
 */
export function getPhysicalPhoneBrandList() {
  return request.get('/physical-phone-ledger/brand-list')
}

/**
 * 获取实体手机项目列表
 * @returns {Promise}
 */
export function getPhysicalPhoneProjectList() {
  return request.get('/physical-phone-ledger/project-list')
}
