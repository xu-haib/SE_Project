<template>
  <table v-if="contest && Object.keys(problems).length > 0" class="problemset">
    <colgroup>
      <col class="col-label" />
      <col class="col-title" />
      <col class="col-acceptance" />
    </colgroup>
    <tbody>
      <tr class="entry" v-for="(problem, label) in problems" :key="problem.id">
        <!-- 状态列 -->

        <td class="label">
          <template v-if="label">
            {{ label }}
          </template>
        </td>

        <td class="title">
          <router-link :to="`/contest/${contest.id}/${label}`" class="problem-title">
            {{ problem.title['en-US'] }}
          </router-link>
        </td>

        <td class="acceptance">
          <span class="accept-number"> {{ problem.countCorrect }} / {{ problem.countTotal }} </span>

          <div class="acceptance-bar-container">
            <div
              class="acceptance-bar"
              :style="{
                width: `${problem.countTotal ? (100 * problem.countCorrect) / problem.countTotal : 0}%`,
              }"
            ></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <template v-else>
    <div v-if="loading" v-loading="true" style="height: 200px" />
    <el-empty v-else description="暂无试题" />
  </template>
</template>

<script setup lang="ts">
import { ElEmpty } from 'element-plus'

import { computed, onMounted, ref } from 'vue'

import { useContest } from '@/stores/contest'
import type { ProblemCore, ProblemId } from '@/interface'
import { apiContestProblems } from '@/api/contest'

const contestStore = useContest()
const contest = computed(() => contestStore.currentContest)
// const ranking = computed(() => contestStore.currentRanking)

const problems = ref<Record<string, ProblemCore>>({});

const loading = ref(false)

function getProblems() {
  if (!contest.value) return

  loading.value = true
  problems.value = {}
  apiContestProblems({
    contest: contest.value.id,
  })
    .then((response) => {
      response.problems.sort((a, b) => a.id - b.id)
      for (const problem of response.problems) {
        const label = contestStore.getLabel(problem.id)
        if(label !== null){
          problems.value[label] = problem
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getProblems()
})
</script>

<style lang="scss" scoped>
.problemset {
  &-head {
    padding-top: 16px;
    background-color: rgba(255, 255, 255, 0.8);
  }
  &-bottom {
    padding: 16px 0;
    background-color: rgba(255, 255, 255, 0.8);
  }
}

table.problemset {
  tr.entry {
    &:hover {
      background-color: #f5f5f5;
    }
  }
}

table.problemset,
table.problemset-head {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  tr.entry {
    height: 2.5em;
    border-bottom: 1px solid #e0e0e0;
  }

  th,
  td {
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .col {
    &-status {
      width: 40px;
    }
    &-label {
      width: 40px;
    }
    &-title {
      width: auto;
    }
    &-acceptance {
      width: 300px;
    }
  }

  td {
    &.label {
      text-align: center;
      font-weight: bold;
    }
    &.id {
      text-align: center;
    }
    &.difficulty {
      text-align: center;
    }
  }
}

.acceptance {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  > .accept-number {
    margin-right: 1em;
    font-weight: bold;
  }

  &-bar {
    height: 100%;
    background-color: var(--el-color-success);
    transition: width 0.3s ease;
  }

  &-bar-container {
    position: relative;
    width: 120px;
    height: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
  }
}

/* 题目标题样式 */
.problem-title {
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
}

.problem-title:hover {
  text-decoration: underline;
}
</style>
