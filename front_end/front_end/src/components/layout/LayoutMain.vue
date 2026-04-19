<template>
  <div class="layout">
    <div class="layout-body">
      <main-header :bread="props.bread" />
      <div class="main-wrapper">
        <div class="main-content">
          <slot />
        </div>
      </div>
      <main-footer />
    </div>
    <main-sidebar />
  </div>
</template>

<script setup lang="ts">
import MainHeader from './MainHeader.vue'
import MainFooter from './MainFooter.vue'
import MainSidebar from './MainSidebar.vue'
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

const props = defineProps<{
  bread?: { label: string, to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric}[]
}>();
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 60px;
  position: relative;
}

.main-wrapper {
  flex: 1;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
