<template>
  <layout-sidebar :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '比赛列表'},
    ]">
    <template #main>
      <contest-list :filter="form" ref="contests" />
    </template>
    <template #sidebar>
      <contest-filter :filter="form" @filter-change="handleFilterChange" />
    </template>
  </layout-sidebar>
</template>

<script setup lang="ts">
import LayoutSidebar from '@/components/layout/LayoutSidebar.vue'
import ContestList from '@/components/contest/ContestList.vue'
import ContestFilter from '@/components/contest/ContestFilter.vue'
import type { ContestDifficulty, ContestFilterForm, ContestFilterParams, ContestRule } from '@/interface'
import { ref } from 'vue'
import { useRoute, type LocationQuery } from 'vue-router'
import { queryDate, queryNum, queryStr } from '@/utils/query'

const route = useRoute()

function buildForm(query: LocationQuery) {
  return {
    rule: queryStr(query.rule) as ContestRule,
    difficulty: queryNum(query.difficulty) as ContestDifficulty,
    before: queryDate(query.before),
    after: queryDate(query.before),
    keyword: queryStr(query.keyword),
  }
}

const form = ref<ContestFilterParams>(buildForm(route.query))

const handleFilterChange = (params: ContestFilterParams) => {
  form.value = params
}
</script>

<style lang="scss" scoped></style>
