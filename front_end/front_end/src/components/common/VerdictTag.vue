<template>
  <el-tag class="verdict-tag" :color="verdicts[verdict]?.color || '#000'">
    {{ verdicts[verdict]?.abbr || 'Unknown' }}
  </el-tag>
</template>

<script setup lang="ts">
import type { VerdictId } from '@/interface'
import { ElTag } from 'element-plus'

import { useConfig } from '@/stores/config'

const verdicts = useConfig().config.verdicts

const _props = defineProps<{
  verdict: VerdictId
}>()
</script>

<style lang="scss" scoped>
.verdict-tag {
  border: none;
  color: #fff;
}
</style>
