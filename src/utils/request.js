import axios from 'axios'

// 创建axios实例
// 开发环境使用环境变量，生产环境使用 /net-api 前缀
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/net-api',
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 请求错误处理
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 只返回响应数据
    return response.data
  },
  error => {
    // 响应错误处理
    console.error('响应错误:', error)
    return Promise.reject(error)
  }
)

export default service
