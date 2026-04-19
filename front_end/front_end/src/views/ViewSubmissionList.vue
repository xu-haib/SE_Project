<template>
  <layout-main :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '提交列表'},
    ]">
    <div class="submission-list-container">
      <submission-filter :filter="form" @filter-change="handleFilterChange" />
      <submission-list :filter="form" />
    </div>
  </layout-main>
</template>

<script setup lang="ts">
import LayoutMain from '@/components/layout/LayoutMain.vue'

import SubmissionList from '@/components/submission/SubmissionList.vue'
import SubmissionFilter from '@/components/submission/SubmissionFilter.vue'

import { ref } from 'vue'
import type { SubmissionFilterParams } from '@/interface'

import { useRoute, type LocationQuery } from 'vue-router'
import { queryNoS, queryStr, queryNum } from '@/utils/query'

const route = useRoute()

function buildForm(query: LocationQuery) {
  return {
    user: queryStr(query.user),
    problem: queryNum(query.problem),
    lang: queryStr(query.lang),
    verdict: queryStr(query.verdict),
  }
}

const form = ref<SubmissionFilterParams>(buildForm(route.query))

const handleFilterChange = (params: SubmissionFilterParams) => {
  form.value = params
}
</script>

<style lang="scss" scoped>
.submission-list-container {
  > *:not(:last-child) {
    margin-bottom: 1em;
  }
}
</style>
