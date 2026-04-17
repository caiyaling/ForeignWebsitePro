/**
 * @description 粒子系统 composable - 用于创建和管理背景粒子动画效果
 * @author caiyaling
 * @date 2026-04-17
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * 粒子类 - 单个粒子的属性和行为
 */
class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth
    this.height = canvasHeight
    this.reset(true)
  }

  /**
   * 重置粒子位置和属性
   * @param {boolean} initial - 是否为初始创建（决定初始位置分布）
   */
  reset(initial = false) {
    this.x = Math.random() * this.width
    this.y = initial ? Math.random() * this.height : this.height + 10
    this.vx = (Math.random() - 0.5) * 0.2 // 水平速度
    this.vy = Math.random() * 0.2 + 0.1 // 垂直速度（向上）
    this.size = Math.random() * 2 + 1 // 粒子大小
    this.baseAlpha = Math.random() * 0.3 + 0.05 // 基础透明度
    this.angle = Math.random() * Math.PI * 2 // 闪烁角度
    this.angleSpeed = 0.01 + Math.random() * 0.02 // 闪烁速度
  }

  /**
   * 更新粒子状态
   */
  update() {
    this.x += this.vx
    this.y -= this.vy
    this.angle += this.angleSpeed
    this.alpha = this.baseAlpha + Math.sin(this.angle) * 0.05

    // 粒子超出画布顶部时重置
    if (this.y < -10) {
      this.reset()
    }
  }

  /**
   * 绘制粒子
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   */
  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.fillStyle = 'rgba(180, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * 粒子系统配置选项
 * @typedef {Object} ParticleOptions
 * @property {number} count - 粒子数量，默认 60
 * @property {string} color - 粒子颜色，默认 'rgba(180, 255, 255, 0.6)'
 */

/**
 * 使用粒子系统的 composable
 * @param {ParticleOptions} options - 配置选项
 * @returns {Object} - 包含 canvas ref 和相关方法
 */
export function useParticles(options = {}) {
  const {
    count = 60,
    color = 'rgba(180, 255, 255, 0.6)'
  } = options

  const particleCanvasRef = ref(null)
  let animationFrameId = null
  let particles = []
  let cleanupFn = null

  /**
   * 初始化粒子系统
   * @returns {Function} - 清理函数
   */
  const initParticles = () => {
    const canvas = particleCanvasRef.value
    if (!canvas) return null

    const ctx = canvas.getContext('2d')

    /**
     * 调整 Canvas 尺寸并重新创建粒子
     */
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height))
    }

    /**
     * 动画循环
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw(ctx)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()

    // 返回清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }

  // 生命周期钩子
  onMounted(() => {
    nextTick(() => {
      cleanupFn = initParticles()
    })
  })

  onUnmounted(() => {
    if (cleanupFn) {
      cleanupFn()
    }
  })

  return {
    particleCanvasRef,
    initParticles
  }
}

export default useParticles