<script setup>
import { computed } from 'vue'
import SectionTitle from '../../components/SectionTitle.vue'
import ResourceCard from './ResourceCard.vue'

const props = defineProps({
  cards: {
    type: Array,
    default: () => []
  }
})

// 计算总数量
const totalCount = computed(() => {
  return props.cards.reduce((sum, card) => sum + (parseInt(card.totalCount) || 0), 0)
})
</script>

<template>
  <div class="resource-section">
    <SectionTitle title="账号资源总览" :count="totalCount" />

    <div class="grid-row">
      <ResourceCard
        v-for="(card, index) in cards"
        :key="card.name"
        :name="card.name"
        :icon="card.icon"
        :type-count="card.typeCount"
        :total-count="card.totalCount"
        :items="card.items"
        :animation-delay="0.1 + index * 0.1"
      />
    </div>
  </div>
</template>

<style scoped>
.resource-section {
  margin-bottom: 32px;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1400px) {
  .grid-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 1fr;
  }
}
</style>