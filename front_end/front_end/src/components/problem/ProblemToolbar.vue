<template>
  <div v-if="!loading" class="toolbar">
    <font-awesome-icon v-if="problem" :icon="faGlobe" class="tool-icon" />

    <font-awesome-icon
      v-if="problem"
      :icon="faPenToSquare"
      class="tool-icon"
      @click="router.push(`/problem/${problem.id}/edit`)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Problem } from '@/interface'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare, faGlobe } from '@fortawesome/free-solid-svg-icons'

import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  problem: Problem | null
  loading: boolean
}>()
</script>

<style lang="scss" scoped>
.toolbar {
  position: absolute;
  top: 24px;
  left: -16px;

  display: flex;
  flex-direction: column;
}

.tool-icon {
  width: 20px;
  height: 20px;
  padding: 6px;
  color: var(--el-color-primary);
  &:hover {
    color: var(--el-color-primary-dark-2);
  }
}
</style>
