<script setup>
import { useParticles } from '../composables/useParticles'

const { particleCanvasRef } = useParticles()
</script>

<template>
  <div class="ambient-background">
    <div class="ambient-light"></div>
    <div class="ambient-highlight"></div>
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
.ambient-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.ambient-light {
  position: absolute;
  top: -25vh;
  left: 50%;
  transform: translateX(-50%);
  width: 120vw;
  height: 80vh;
  background: radial-gradient(50% 50% at 50% 50%, rgba(30, 50, 120, 0.3) 0%, rgba(10, 15, 30, 0.1) 60%, transparent 100%);
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.ambient-highlight {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 60vw;
  height: 300px;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 100%);
  filter: blur(60px);
  z-index: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>