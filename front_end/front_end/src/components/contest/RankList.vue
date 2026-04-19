<template>
  <div class="ranklist-container">
    <table v-if="contest" class="ranklist">
      <colgroup class="colgroup">
        <col class="col-rank" />
        <col class="col-name" />
        <col class="col-score-solved" />
        <col class="col-score-penalty" />
        <col v-for="_ in labels" class="col-problem" :key="_" />
        <col class="col-empty" />
      </colgroup>
      <thead>
        <tr class="headline entry">
          <th class="rank">RANK</th>
          <th class="name">TEAM</th>
          <th class="score" colspan="2">SCORE</th>
          <th v-for="label in labels" class="problem-cell" :key="label">
            <router-link
              class="problem"
              :to="`/contest/${contest.id}/problem/${contest.problems[label]}`"
            >
              {{ label }}
            </router-link>
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="rank of ranklist" class="normal-line entry" :key="rank.ranking">
          <template v-if="rank.detail.type === 'ACM'">
            <td class="rank">
              {{ rank.ranking }}
            </td>
            <td class="name">
              {{ rank.team }}
            </td>
            <td class="score-solved">
              {{ rank.detail.totalSolved }}
            </td>
            <td class="score-penalty">
              {{ rank.detail.totalPenalty }}
            </td>
            <td v-for="(cell, label) in getACMLine(contest, rank)" class="result-cell" :key="label">
              <div v-if="cell !== null" class="result" :class="{
                solved: cell.isSolved && !cell.isFirst,
                first: cell.isFirst,
                attempted: !cell.isSolved && cell.attemptBF,
                frozen: !cell.isSolved && !cell.attemptBF && cell.attemptAF
              }">
                  <template v-if="cell.isSolved">
                    {{ cell.penalty }}
                  </template>
                  <template v-else>
                    &nbsp;
                  </template>
                <span>
                  <template v-if="cell.attemptBF && cell.attemptAF">
                    {{ getTries(cell.attemptBF + cell.attemptAF) }}
                  </template>
                  <template v-else-if="cell.attemptBF">
                    {{ getTries(cell.attemptBF) }}
                  </template>
                  <template v-else>
                    {{ getTries(cell.attemptAF) }}
                  </template>
                </span>
              </div>
            </td>
            <td />
          </template>
          <template v-else>
            
          </template>
        </tr>
      </tbody>
    </table>
    <el-empty v-else description="暂无排行" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import type { ACMCell, Contest, Ranking } from '@/interface'

import { useContest } from '@/stores/contest'
import { ElEmpty } from 'element-plus'
import { apiRanklist } from '@/api/contest'

const contestStore = useContest()

const contest = computed(() => contestStore.currentContest)
const labels = computed(() => {
  if (contest.value) return Object.keys(contest.value.problems)
  return []
})

const ranklist = ref<Ranking[]>([])
const loading = ref(false)

function getACMLine(contest: Contest, ranking: Ranking) {
  if(ranking.detail.type !== 'ACM'){
    return [];
  }
  const cells: (ACMCell | null)[] = [];
  for(const label in contest.problems){
    cells.push(ranking.detail.problems[contest.problems[label]] ?? null)
  }
  return cells;
}

function updateRanks() {
  if (!contest.value) return

  loading.value = true
  apiRanklist({
    contest: contest.value.id,
  })
    .then((response) => {
      ranklist.value = response.rankings
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  updateRanks()
})

watch(contest, updateRanks)

function getTries(attempt: number) {
  if (attempt <= 1) return `${attempt} try`
  return `${attempt} tries`
}
</script>

<style lang="scss" scoped>
.problem-cell {
  margin: 4px;
  text-align: center;
  cursor: pointer;
  padding: 0.2em;
  font-size: 1.2em;
}

.solved {
  background-color: #60e760;
}

.frozen {
  background-color: #6666FF;
}

.first {
  background-color: #1daa1d;
}

.attempted {
  background-color: #e87272;
}

table.ranklist,
table.ranklist-head {
  width: 100%;
  border-collapse: collapse;
  // table-layout: fixed;

  tr.entry {
    height: 2.5em;
    border-bottom: 1px solid #e0e0e0;
  }

  th,
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tr {
    &.headline {
      position: sticky;
      top: 0;
      background-color: white;
      border-bottom: 3px solid black;
    }
    &.normal-line {
      border-bottom: 1px solid black;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  .col {
    &-rank {
      width: 4em;
      border-right: 1px solid #aaa;
    }
    &-name {
      width: 10em;
      border-right: 1px solid #aaa;
    }
    &-score-solved {
      width: 40px;
    }
    &-score-penalty {
      width: 40px;
      border-right: 1px solid #aaa;
    }
    &-problem {
      width: 65px;
    }
    &-empty {
      width: auto;
    }
  }

  td {
    &.rank {
      text-align: center;
    }
    &.name {
      font-weight: bold;
      text-align: center;
    }
    &.score-solved {
      font-weight: bold;
      font-size: 0.9rem;
      text-align: center;
    }
    &.score-penalty {
      font-size: 0.9rem;
      text-align: center;
    }
    &.result-cell {
      > .result {
        margin: 2px 1px 2px 1px;
        padding: 2px;
        line-height: 1;
        text-align: center;
        font-size: 1.1rem;
        span {
          margin-top: 0.05rem;
          font-size: 0.8rem;
          display: block;
        }
      }
    }
  }
}
</style>
