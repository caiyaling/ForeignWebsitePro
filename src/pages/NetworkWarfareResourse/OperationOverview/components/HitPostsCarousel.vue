<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import HitPostCard from './HitPostCard.vue'

const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  },
  pageSize: {
    type: Number,
    default: 3
  }
})

const cardRef = ref(null)
const carouselCurrentPage = ref(0)
let carouselTimer = null

const chunkedPosts = computed(() => {
  const result = []
  for (let i = 0; i < props.posts.length; i += props.pageSize) {
    result.push(props.posts.slice(i, i + props.pageSize))
  }
  return result
})

const handleMouseMove = (e) => {
  const card = cardRef.value
  if (!card) return
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}

const nextPage = () => {
  carouselCurrentPage.value = (carouselCurrentPage.value + 1) % chunkedPosts.value.length
}

const prevPage = () => {
  carouselCurrentPage.value = (carouselCurrentPage.value - 1 + chunkedPosts.value.length) % chunkedPosts.value.length
}

const goToPage = (index) => {
  carouselCurrentPage.value = index
}

const startCarousel = () => {
  if (!carouselTimer) {
    carouselTimer = setInterval(nextPage, 4000)
  }
}

const pauseCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

const emit = defineEmits(['more'])

const handleMore = () => {
  emit('more')
}

onMounted(() => {
  startCarousel()
})

onBeforeUnmount(() => {
  pauseCarousel()
})
</script>

<template>
  <div
    ref="cardRef"
    class="hit-posts-card"
    @mousemove="handleMouseMove"
    @mouseenter="pauseCarousel"
    @mouseleave="startCarousel"
  >
    <div class="header-row">
      <div class="title-wrap">
        <div class="section-dot"></div>
        <div class="card-title">爆款贴文排行榜</div>
      </div>
      <div class="more-btn" @click="handleMore">更多 &gt;</div>
    </div>

    <div class="hit-posts-carousel">
      <div class="nav-arrow" @click="prevPage">&lt;</div>
      <div class="carousel-viewport">
        <div class="hit-posts-track" :style="{ transform: `translateX(-${carouselCurrentPage * 100}%)` }">
          <div class="page-slide" v-for="(pagePosts, pageIndex) in chunkedPosts" :key="pageIndex">
            <HitPostCard v-for="post in pagePosts" :key="post.id" :post="post" />
          </div>
        </div>
      </div>
      <div class="nav-arrow" @click="nextPage">&gt;</div>
    </div>

    <div class="carousel-dots">
      <span
        v-for="(_, index) in chunkedPosts"
        :key="index"
        class="dot"
        :class="{ active: index === carouselCurrentPage }"
        @click="goToPage(index)"
      ></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hit-posts-card {
  --mouse-x: -1000px;
  --mouse-y: -1000px;
  border: 1px solid rgba(67, 236, 255, 0.3);
  border-radius: 8px;
  background: radial-gradient(54.42% 32.41% at 52.05% 0%, rgba(0, 255, 246, 0.15) 0%, rgba(0, 225, 255, 0.00) 100%), linear-gradient(348deg, rgba(0, 27, 64, 0.40) 7.31%, rgba(0, 187, 255, 0.10) 90.95%);
  box-shadow: 0 4px 20px 20px rgba(0, 11, 37, 0.02);
  flex: 1;
  padding: 20px 24px;
  position: relative;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(0, 240, 255, 0.2), transparent 50%);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(67, 236, 255, 0.8);
    box-shadow: 0 0 30px rgba(67, 236, 255, 0.25);
  }
}

.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00f0ff;
  box-shadow: 0 0 6px #00f0ff;
  animation: breathing-glow 2.5s infinite ease-in-out;
}

@keyframes breathing-glow {
  0%, 100% {
    box-shadow: 0 0 4px #00f0ff;
    background-color: #00f0ff;
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 10px #00f0ff, 0 0 15px rgba(0, 240, 255, 0.6);
    background-color: #80fcff;
    opacity: 1;
    transform: scale(1.3);
  }
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-btn {
  color: #00f0ff;
  cursor: pointer;
  font-size: 16px;
}

.hit-posts-carousel {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  width: 100%;
}

.carousel-viewport {
  flex: 1;
  overflow: hidden;
  width: 100%;
  border-radius: 8px;
}

.hit-posts-track {
  display: flex;
  width: 100%;
  transition: transform 0.5s ease-in-out;
}

.page-slide {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.nav-arrow {
  font-size: 24px;
  color: #00f0ff;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.2s;
  padding: 0 10px;
  user-select: none;

  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(0, 240, 255, 0.3);
    cursor: pointer;

    &.active {
      background: #00f0ff;
      box-shadow: 0 0 6px #00f0ff;
    }
  }
}
</style>