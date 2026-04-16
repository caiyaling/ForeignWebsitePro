/**
 * 获取静态资源路径
 * 自动添加 Vite base 前缀
 * @param {string} path - 相对于 public 目录的路径，如 '/figma/logo.svg'
 * @returns {string} 完整的资源路径
 */
export function getAssetUrl(path) {
  const base = import.meta.env.BASE_URL
  // 移除开头的斜杠，避免双斜杠
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${cleanPath}`
}
