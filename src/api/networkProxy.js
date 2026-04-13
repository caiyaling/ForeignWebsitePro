/**
 * @description 网络代理相关 API
 * @date 2024-04-13
 */
import request from '@/utils/request'

// ==================== 网络代理台账 ====================

/**
 * 静态代理统计
 * @returns {Promise} [{ label, total, use }]
 */
export function getStaticProxyStats() {
  return request.get('/network-proxy/static-proxy-statistics')
}

/**
 * 动态代理统计
 * @returns {Promise} [{ label, total, use }]
 */
export function getDynamicProxyStats() {
  return request.get('/network-proxy/dynamic-proxy-statistics')
}

/**
 * 分页查询网络代理台账
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词（模糊匹配编号、IP地址）
 * @param {string} params.accountType - 账号类型
 * @param {string} params.ipType - IP类型
 * @param {string} params.latestStatus - 最新状态
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getNetworkProxyPage(params) {
  return request.get('/network-proxy/page', { params })
}

/**
 * 获取账号类型列表
 * @returns {Promise}
 */
export function getNetworkProxyAccountTypeList() {
  return request.get('/network-proxy/account-type-list')
}

/**
 * 获取IP类型列表
 * @returns {Promise}
 */
export function getNetworkProxyIpTypeList() {
  return request.get('/network-proxy/ip-type-list')
}

/**
 * 导出网络代理台账
 * @param {Object} params - 导出参数
 * @returns {Promise}
 */
export function exportNetworkProxy(params) {
  return request.get('/network-proxy/export', { params, responseType: 'blob' })
}

/**
 * 导入网络代理台账
 * @param {FormData} data - Excel文件
 * @returns {Promise}
 */
export function importNetworkProxy(data) {
  return request.post('/network-proxy/import', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 下载网络代理台账导入模板
 * @returns {Promise}
 */
export function downloadNetworkProxyTemplate() {
  return request.get('/network-proxy/template', { responseType: 'blob' })
}

/**
 * 删除网络代理台账
 * @param {number} id - 主键ID
 * @returns {Promise}
 */
export function deleteNetworkProxy(id) {
  return request.delete(`/network-proxy/${id}`)
}
