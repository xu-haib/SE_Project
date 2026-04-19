<template>
  <layout-sidebar :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '题目列表'}
    ]">
    <template #main>
      <problem-list :filter="form" />
    </template>
    <template #sidebar>
      <problem-filter :filter="form" @filter-change="handleFilterChange" />
    </template>
  </layout-sidebar>
</template>

<script setup lang="ts">
import LayoutSidebar from '@/components/layout/LayoutSidebar.vue'

import ProblemList from '@/components/problem/ProblemList.vue'
import ProblemFilter from '@/components/problem/ProblemFilter.vue'

import { ref } from 'vue'
import type { ProblemFilterParams } from '@/interface'
import { useRoute, type LocationQuery } from 'vue-router'
import { queryNum, queryStr } from '@/utils/query'

const route = useRoute()

function buildForm(query: LocationQuery) {
  return {
    minDifficulty: queryNum(query.minDifficulty),
    maxDifficulty: queryNum(query.maxDifficulty),
    tags: query.tags
      ? Array.isArray(query.tags)
        ? query.tags.map(Number)
        : [Number(query.tags)]
      : undefined,
    keywords: queryStr(query.keywords),
  }
}

const form = ref<ProblemFilterParams>(buildForm(route.query))

const handleFilterChange = (params: ProblemFilterParams) => {
  form.value = params
}
</script>

<style lang="scss" scoped></style>
