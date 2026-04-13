/**
 * @description 账号相关 API
 * @date 2024-04-13
 */
import request from '@/utils/request'

/**
 * 获取账号类型统计数据
 * @param {number} resourceType - 资源类型：1-社交媒体 2-即时通讯 3-论坛社区 4-邮箱
 * @returns {Promise}
 */
export function getAccountTypeStats(resourceType) {
  return request.get('/account-info/stats/account-type', {
    params: { resourceType }
  })
}

/**
 * 获取平台名称列表
 * @returns {Promise}
 */
export function getPlatforms() {
  return request.get('/account-info/platforms')
}

/**
 * 获取账号类型列表
 * @returns {Promise}
 */
export function getAccountTypes() {
  return request.get('/account-info/types')
}

/**
 * 获取最新状态列表
 * @returns {Promise}
 */
export function getStatuses() {
  return request.get('/account-info/statuses')
}

/**
 * 分页查询账号台账
 * @param {Object} params - 查询参数
 * @param {number} params.resourceType - 资源类型：1-社交媒体 2-即时通讯 3-论坛社区 4-邮箱
 * @param {string} params.keyword - 关键词
 * @param {string} params.accountType - 账号类型
 * @param {string} params.platformName - 平台名称
 * @param {string} params.latestStatus - 最新状态
 * @param {string} params.isSampled - 是否抽检
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getAccountPage(params) {
  return request.get('/account-info/page', { params })
}
