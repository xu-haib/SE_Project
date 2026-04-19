<template>
  <layout-sidebar :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '题目列表', to: { name: 'problem-list'}},
    {label:  `${ props.pid_str ? ( '#' + props.pid_str) : ( '比赛 ' + (props.cid_str ?? '') + ' ' + (props.plabel ?? '') ) }`},
    ]">
    <template #main>
      <problem-toolbar :loading="loading" :problem="problem" />
      <problem-content :loading="loading" :problem="problem" />
    </template>
    <template #sidebar>
      <contest-sidebar />
      <problem-panel :loading="loading" :problem="problem" :judgement="judgement" />
    </template>
  </layout-sidebar>
</template>

<script setup lang="ts">
import LayoutSidebar from '@/components/layout/LayoutSidebar.vue'
import ProblemContent from '@/components/problem/ProblemContent.vue'
import ProblemPanel from '@/components/problem/ProblemPanel.vue'
import ProblemToolbar from '@/components/problem/ProblemToolbar.vue'

import ContestSidebar from '@/components/contest/ContestSidebar.vue'

import { computed, onMounted, provide, ref, watch } from 'vue'
import type { Problem, Judgement } from '@/interface'
import { apiProblem } from '@/api'

import { useContest } from '@/stores/contest'
import { useRouter } from 'vue-router'

const router = useRouter()
const contestStore = useContest()

const props = defineProps<{
  plabel?: string
  pid_str?: string
  cid_str?: string
}>()

const problem = ref<Problem | null>(null)
const judgement = ref<Judgement | null>(null)

const loading = ref(false)

async function getProblem() {
  problem.value = null
  loading.value = true

  let query: number = 0

  if (props.cid_str && props.plabel) {
    await contestStore.enter(parseInt(props.cid_str)).then(() => {
      query = contestStore.currentContest!.problems[props.plabel!]
    })
  } else if (props.pid_str) {
    query = parseInt(props.pid_str)
  }

  if (query) {
    await apiProblem({ problem: query })
      .then((response) => {
        problem.value = response.problem
        if (response.judgement) judgement.value = response.judgement
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    loading.value = false
  }
}

onMounted(() => {
  getProblem()
})

watch(props, () => getProblem())
</script>

<style lang="scss" scoped></style>
