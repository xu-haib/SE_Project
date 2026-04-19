<template>
  <div v-if="!contestStore.loading" class="toolbar">
    <font-awesome-icon
      v-if="contest"
      :icon="faPenToSquare"
      class="tool-icon"
      @click="router.push(`/contest/${contest.id}/edit`)"
    />
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import { useRouter } from 'vue-router'
import { useContest } from '@/stores/contest'
import { computed } from 'vue'

const router = useRouter()

const contestStore = useContest()
const contest = computed(() => contestStore.currentContest)
</script>

<style lang="scss" scoped>
.toolbar {
  position: absolute;
  top: 48px;
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
