<template>
  <div class="layout">
    <div class="layout-body">
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
    <admin-header />
    <admin-sidebar />
  </div>
</template>

<script setup lang="ts">
import AdminHeader from './AdminHeader.vue'
import AdminSidebar from './AdminSidebar.vue'
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
  margin-left: 160px;
  margin-top: 60px;
  padding: 24px;
  position: relative;
}

.content-wrapper {
  flex: 1;
}

.main-content {
  padding: 0;
}
</style>
