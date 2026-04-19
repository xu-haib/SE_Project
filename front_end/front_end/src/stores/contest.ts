// @/stores/contest.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth } from './auth'
import type { Contest, ContestId, ProblemId, Ranking } from '@/interface'
import { apiContest, apiRanking } from '@/api/contest'

export const useContest = defineStore('contest', () => {
  const isInitialized = ref(false)
  const loading = ref(false)

  // 当前比赛信息
  const currentContest = ref<Contest | null>(null)
  const currentRanking = ref<Ranking | null>(null)

  // 比赛模式状态
  const valid = computed(() => currentContest.value !== null)

  const authStore = useAuth()

  function getLabel(problem: ProblemId) {
    if (!currentContest.value) return null
    const keys = Object.keys(currentContest.value.problems)
    for (const label of keys) {
      if (currentContest.value.problems[label] === problem) return label
    }
    return null
  }


  async function refresh() {
    console.log('refreshing contest mode: ', currentContest.value?.id)

    if (currentContest.value && authStore.currentUser) {
      await apiRanking({
        contest: currentContest.value.id,
        user: authStore.currentUser.id,
      }).then((response) => {
        currentRanking.value = response.ranking ?? null
      }).catch(() => {
        currentRanking.value = null
      })
    }
  }

  // 进入比赛模式
  async function enter(contest: ContestId) {
    if (currentContest.value && currentContest.value.id !== contest) {
      exit()
    }
    if (currentContest.value && currentContest.value.id === contest) {
      return
    }

    console.log('entering contest mode: ', contest)

    loading.value = true
    await apiContest({ contest: contest })
      .then((response) => {
        currentContest.value = response.contest
        refresh()

        // 存储到本地存储，以便重新登录后恢复
        localStorage.setItem(
          'current-contest',
          JSON.stringify({
            id: contest,
          }),
        )
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 退出比赛模式
  async function exit() {
    console.log('existing contest mode: ', currentContest.value?.id)

    currentContest.value = null
    currentRanking.value = null
    localStorage.removeItem('current-contest')
  }

  // 检查本地存储并恢复比赛模式
  async function restore() {
    const saved = localStorage.getItem('current-contest')
    if (saved) {
      const { id } = JSON.parse(saved)
      return parseInt(id)
    }
    return 0
  }

  return {
    currentContest,
    currentRanking,
    getLabel,
    valid,
    enter,
    exit,
    restore,
    refresh,
    isInitialized,
    loading,
  }
})
