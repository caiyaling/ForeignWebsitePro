/**
 * @description 粒子系统 composable - 用于创建和管理背景粒子动画效果
 */

import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth
    this.height = canvasHeight
    this.reset(true)
  }

  reset(initial = false) {
    this.x = Math.random() * this.width
    this.y = initial ? Math.random() * this.height : this.height + 10
    this.vx = (Math.random() - 0.5) * 0.4
    this.vy = Math.random() * 0.3 + 0.1
    this.size = Math.random() * 3 + 2
    this.baseAlpha = Math.random() * 0.3 + 0.1
    this.angle = Math.random() * Math.PI * 2
    this.angleSpeed = 0.02 + Math.random() * 0.03
  }

  update() {
    this.x += this.vx
    this.y -= this.vy
    this.angle += this.angleSpeed
    this.alpha = this.baseAlpha + Math.sin(this.angle) * 0.1
    if (this.y < -10) this.reset()
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.fillStyle = 'rgba(100, 240, 255, 0.9)'
    ctx.shadowBlur = 5
    ctx.shadowColor = 'rgba(0, 240, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

export function useParticles(options = {}) {
  const { count = 60 } = options

  const particleCanvasRef = ref(null)
  let animationFrameId = null
  let particles = []
  let cleanupFn = null

  const initParticles = () => {
    const canvas = particleCanvasRef.value
    if (!canvas) return null

    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw(ctx)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }

  onMounted(() => {
    nextTick(() => {
      cleanupFn = initParticles()
    })
  })

  onBeforeUnmount(() => {
    if (cleanupFn) cleanupFn()
  })

  return { particleCanvasRef }
}

export default useParticles