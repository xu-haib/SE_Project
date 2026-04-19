<template>
  <template v-if="contest">
    <md-render :content="contest.description" />
  </template>
  <el-empty description="比赛不存在" v-else />
</template>

<script setup lang="ts">
import MdRender from '../common/MdRender.vue'

import { ElEmpty } from 'element-plus'

import { useContest } from '@/stores/contest'
import { computed } from 'vue'

const contest = computed(() => useContest().currentContest)
</script>

<style lang="scss" scoped></style>
