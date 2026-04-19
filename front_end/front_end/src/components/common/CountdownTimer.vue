<template>
  <span class="countdown-timer">
    {{ left }}
  </span>
</template>

<script setup lang="ts">
import { formatTimeLong } from '@/utils/format'
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  target: Date
}>()

const left = ref('')
let timer: number

function update() {
  left.value = formatTimeLong(Math.max(0, props.target.getTime() - Date.now()))
}

onMounted(() => {
  update()
  timer = window.setInterval(update, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.countdown-timer {
  font-family: monospace;
  font-weight: bold;
  color: var(--el-color-primary);
}
</style>
