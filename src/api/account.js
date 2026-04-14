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

/**
 * 获取账号详情（虚拟人设信息）
 * @param {string} accountCode - 账号编号
 * @returns {Promise}
 */
export function getAccountDetail(accountCode) {
  return request.get('/account-info/detail', { params: { accountCode } })
}

/**
 * 分页查询账号运维信息
 * @param {Object} params - 查询参数
 * @param {string} params.accountCode - 账号编号
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getAccountOperationPage(params) {
  return request.get('/account-info/operation/page', { params })
}

/**
 * 查询账号粉丝数量列表
 * @param {Object} params - 查询参数
 * @param {string} params.accountCode - 账号编号
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @returns {Promise} 返回粉丝数据列表
 */
export function getFansCountList(params) {
  return request.get('/account-behavior-record/fans/count/list', { params })
}

/**
 * 分页查询发帖行为
 * @param {Object} params - 查询参数
 * @param {string} params.accountCode - 账号编号
 * @param {string} params.updateTime - 更新时间（完全匹配统计结束时间，格式：yyyy-MM-dd）
 * @param {string} params.isHotPost - 是否爆款
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getPostBehaviorPage(params) {
  return request.get('/account-behavior-record/post-behavior/page', { params })
}

/**
 * 分页查询助推烘托行为
 * @param {Object} params - 查询参数
 * @param {string} params.accountCode - 账号编号
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getBoostBehaviorPage(params) {
  return request.get('/account-behavior-record/boost-behavior/page', { params })
}

/**
 * 分页查询账号申诉信息
 * @param {Object} params - 查询参数
 * @param {string} params.accountCode - 账号编号
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise}
 */
export function getAppealPage(params) {
  return request.get('/account-info/appeal/page', { params })
}

/**
 * 获取更新时间列表（统计结束时间）
 * @returns {Promise} 返回 List<String> 格式为 yyyy-MM-dd
 */
export function getUpdateTimeList() {
  return request.get('/account-behavior-record/update-time/list')
}
