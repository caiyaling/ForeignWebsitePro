/**
 * @description 数据导入相关 API
 * @date 2024-04-14
 */
import request from '@/utils/request'

/**
 * 下载账号基本情况模板
 * @returns {Promise}
 */
export function downloadAccountTemplate() {
  return request.get('/account-info/template', {
    responseType: 'blob'
  })
}

/**
 * 导入账号基本情况数据
 * @param {FormData} formData - 包含文件的表单数据
 * @returns {Promise}
 */
export function importAccountData(formData) {
  return request.post('/account-info/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 下载账号行为记录模板
 * @returns {Promise}
 */
export function downloadBehaviorTemplate() {
  return request.get('/account-behavior-record/template', {
    responseType: 'blob'
  })
}

/**
 * 导入账号行为记录数据
 * @param {FormData} formData - 包含文件的表单数据
 * @returns {Promise}
 */
export function importBehaviorData(formData) {
  return request.post('/account-behavior-record/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 下载爆款贴文链接模板
 * @returns {Promise}
 */
export function downloadHotPostTemplate() {
  return request.get('/hot-post-record/template', {
    responseType: 'blob'
  })
}

/**
 * 导入爆款贴文链接数据
 * @param {FormData} formData - 包含文件的表单数据
 * @returns {Promise}
 */
export function importHotPostData(formData) {
  return request.post('/hot-post-record/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
