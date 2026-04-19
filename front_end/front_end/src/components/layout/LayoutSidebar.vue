<template>
  <div class="layout">
    <div class="layout-body">
      <main-header :bread="props.bread" />
      <div class="content-wrapper">
        <div class="content">
          <main class="main-content">
            <slot name="main" />
          </main>

          <aside class="sidebar-affix">
            <slot name="sidebar" />
          </aside>
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

.content-wrapper {
  flex: 1;
}

.content {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
  grid-column-gap: 16px;

  padding: 24px;

  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.main-content {
  padding: 0;
}

.sidebar-affix {
  top: 0;
  position: sticky;
  align-self: flex-start;
  max-height: 100vh;
  overflow-y: auto;
  padding: 16px;
  margin: -16px; // Preserve spaces for shadow
}
</style>
