<template>
  <router-view />
  <login-modal />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoginModal from './components/auth/LoginModal.vue'
</script>
