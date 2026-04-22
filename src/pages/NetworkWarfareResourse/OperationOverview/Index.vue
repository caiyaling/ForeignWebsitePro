<script setup>
import GlobalHeader from '@/pages/NetworkWarfareResourse/components/GlobalHeader.vue'
import Sidebar from '@/pages/NetworkWarfareResourse/components/Sidebar.vue'
import OperationDashboard from './OperationDashboard.vue'
</script>

<template>
  <div class="operation-overview-page">
    <global-header />

    <div class="page-shell">
      <sidebar />

      <main class="page-main">
        <operation-dashboard />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.operation-overview-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url('@/assets/overviewBg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.page-shell {
  display: flex;
  flex: 1;
  min-height: 0;
}

.page-main {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
</style>
