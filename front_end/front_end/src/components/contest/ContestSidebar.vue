<template>
  <div v-if="contest" class="contest-sidebar">
    <el-card>
      <template v-if="contest">
        <div class="contest-info">
          <router-link :to="`/contest/${contest.id}`">
            <h3>
              {{ contest.title }}
            </h3>
          </router-link>

          <div class="contest-time">
            <el-progress
              :percentage="(100 * (zone - left)) / zone"
              :stroke-width="15"
              striped
              :show-text="false"
            />

            <div>
              <span v-if="left > 0">剩余时间 {{ formatTimeLong(left) }}</span>
              <span v-else>比赛已结束</span>

              <router-link class="link-ranklist" :to="`/contest/${contest.id}/ranklist`">
                排行榜
              </router-link>
            </div>
          </div>
        </div>

        <div class="problem-badges">
          
          <div v-for="[label, cell] of Object.entries(getACMLine(contest, ranking))" class="problem-badge" :class="{
            'status-success': cell && cell.isSolved,
            'status-danger': cell && !cell.isSolved,
          }" :key="label"
            @click="goToProblem(label)"
          >
            {{ label }}
          </div>
        </div>
      </template>
    </el-card>

    <el-button type="primary" @click="exitContest">退出比赛模式</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useContest } from '@/stores/contest'

import { formatTimeLong } from '@/utils/format'
import type { ACMCell, Contest, ProblemId, Ranking } from '@/interface'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import { ElButton, ElProgress, ElCard } from 'element-plus'

// const props = withDefaults(defineProps<{
//   force?: boolean
// }>(), {
//   force: false
// });

const router = useRouter()
const contestStore = useContest()
const contest = computed(() => contestStore.currentContest)
const ranking = computed(() => contestStore.currentRanking)

const left = ref(0)
const zone = ref(1)

function update() {
  if (contest.value) {
    left.value = Math.max(0, contest.value.endTime.getTime() - Date.now())
    zone.value = contest.value.endTime.getTime() - contest.value.startTime.getTime()
  }
}

watch(contest, update)

function getACMLine(contest: Contest, ranking: Ranking | null) {
  if(ranking === null || ranking.detail.type !== 'ACM'){
    return [];
  }
  const cells: Record<string, ACMCell | null> = {};
  for(const label in contest.problems){
    cells[label] = (ranking.detail.problems[contest.problems[label]] ?? null)
  }
  return cells;
}

// 跳转到题目
function goToProblem(label: string) {
  if (!contest.value) return
  router.push(`/contest/${contest.value.id}/${label}`)
}

// 退出比赛模式
function exitContest() {
  contestStore.exit()
  router.push('/contest')
}

let timer: number
onMounted(() => {
  update()
  timer = window.setInterval(update, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.contest-sidebar {
  > * {
    width: 100%;
  }

  > *:not(:last-child) {
    margin-bottom: 16px;
  }

  &:not(:last-child) {
    margin-bottom: 24px;
  }
}

.contest-info {
  margin-bottom: 20px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 1.2em;
    word-break: break-word;

    transition: color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .contest-time {
    font-size: 0.9em;
    color: var(--el-text-color-secondary);
  }

  .link-ranklist {
    color: var(--el-text-color-primary);
    transition: color 0.2s;

    float: right;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.problem-badges {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
}

.problem-badge {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
  cursor: pointer;
  font-weight: bold;

  &.status-success {
    background-color: var(--el-color-success-light-9);
    color: var(--el-color-success);
  }

  &.status-danger {
    background-color: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }
}
</style>
