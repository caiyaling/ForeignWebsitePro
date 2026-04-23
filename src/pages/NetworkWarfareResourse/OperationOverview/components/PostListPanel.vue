<script setup>
import HorizontalPostCard from './HorizontalPostCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  posts: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="post-list-panel">
    <div class="column-title">{{ title }}</div>
    <div class="column-list">
      <horizontal-post-card
        v-for="(post, index) in posts"
        :key="post.id"
        :post="post"
        :rank="index + 1"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-list-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(180deg, rgba(16, 35, 75, 0.7) 0%, rgba(10, 20, 45, 0.8) 100%);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  height: 100%;
  overflow: hidden;
}

.column-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.column-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 240, 255, 0.3) rgba(0, 0, 0, 0.2);

  &::-webkit-scrollbar {
    width: 6px;
    display: block;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 240, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 240, 255, 0.6);
    box-shadow: 0 0 6px rgba(0, 240, 255, 0.5);
  }
}
</style>