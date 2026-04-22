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
  return props.cards.reduce((sum, card) => {
    const count = parseInt(String(card.totalCount).replace(/[^0-9]/g, '')) || 0
    return sum + count
  }, 0)
})
</script>

<template>
  <div class="resource-section">
    <SectionTitle title="基础资源总览" :count="totalCount" />

    <div class="grid-row">
      <ResourceCard
        v-for="(card, index) in cards"
        :key="card.name"
        :name="card.name"
        :icon="card.icon"
        :type-count="card.typeCount"
        :total-count="card.totalCount"
        :unit="card.unit"
        :sub-sections="card.subSections"
        :animation-delay="0.5 + index * 0.1"
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