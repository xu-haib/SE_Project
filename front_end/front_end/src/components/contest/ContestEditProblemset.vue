<template>
  <div class="basic-container">
    <el-form :label-width="100">
      <el-form-item label="添加试题" class="form-item">

        <el-input class="input-label" placeholder="标签" v-model="label" />

        <el-input class="input-id" @input="handleInput" type="number" v-model.number="problemId" />

        <template v-if="problem">
          <span class="preview">
            {{ problem.id }} {{ problem.title['zh-CN'] || Object.values(problem?.title)[0] || '暂无标题' }}
          </span>
          
          <template v-if="problem.status === 'contest'">
            <font-awesome-icon style="color: var(--el-color-success)" :icon="faCheck" />
          </template>
          <template v-else>
            <font-awesome-icon style="color: var(--el-color-warning)" :icon="faTriangleExclamation" />

            <span class="info-convey">题目状态将在添加后转为比赛赛题</span>
          </template>
        </template>
      </el-form-item>

      <el-button type="primary" @click="addProblem">
        添加
      </el-button>
    </el-form>

    <el-table :data="problems" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="label" label="标签" width="60" />
      <el-table-column prop="problem.id" label="ID" width="75" />
      <el-table-column label="标题" min-width="200">
        <template #default="{ row }">
          <router-link :to="`/problem/${row.problem.id}`" class="title-link">
            {{ row.problem.title['zh-CN'] || Object.values(row.problem.title)[0] || '暂无标题' }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.problem.status)">
            {{ getStatusText(row.problem.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          {{ getTypeText(row.problem.type) }}
        </template>
      </el-table-column>
      <el-table-column label="时间限制" width="120">
        <template #default="{ row }">
          {{ formatTimeShort(row.problem.limitTime) }}
        </template>
      </el-table-column>
      <el-table-column label="空间限制" width="120">
        <template #default="{ row }">
          {{ formatMemory(row.problem.limitMemory) }}
        </template>
      </el-table-column>
      <el-table-column label="难度" width="120">
        <template #default="{ row }">
          {{ row.problem.difficulty }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="75" fixed="right">
        <template #default="{ row }">
          <el-button text type="danger" size="small" @click="deleteProblem(row.label)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { Contest, Problem, ProblemCore, ProblemId } from '@/interface'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

import { faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useConfig } from '@/stores/config'
import { ref, watch } from 'vue'
import { apiContestEdit, apiContestProblems, apiProblem, apiProblemCheck } from '@/api'
import { throttle } from 'lodash-es'

import { formatTimeShort, formatMemory } from '@/utils/format'
import Swal from 'sweetalert2'

const contest = defineModel<Contest>({
  required: true,
})

const problemId = ref<number | undefined>(undefined);
const label = ref<string | undefined>(undefined);
const problem = ref<Problem | null>(null);

const handleInput = throttle(checkProblem, 500)

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    public: '公开',
    private: '私有',
    contest: '比赛',
  }
  return map[status] || '未知'
}

const getStatusTagType = (status: string) => {
  const map: Record<string, string> = {
    public: 'success',
    private: 'info',
    contest: 'warning',
  }
  return map[status] || ''
}

const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    traditional: '传统题',
    interactive: '交互题',
  }
  return map[type] || '未知'
}

function checkProblem() {
  if(problemId.value === undefined){
    problem.value = null
    return
  }
  apiProblemCheck({
    problem: problemId.value
  }).then((response) => {
    problem.value = response.problem
  })
}

const problems = ref<
  {
    problem: ProblemCore
    label: string | null
  }[]
>([])

function addProblem(){
  if(problemId.value === undefined){
    Swal.fire({ icon: 'error', title: '错误', text: '请选择新试题 ID' })
    return
  }
  if(label.value === undefined){
    Swal.fire({ icon: 'error', title: '错误', text: '请选择新试题标签' })
    return
  }
  if(label.value in contest.value.problems){
    Swal.fire({ icon: 'error', title: '错误', text: '标签不能重复' })
    return
  }
  contest.value.problems[label.value] = problemId.value

  label.value = undefined
  problemId.value = undefined
  problem.value = null
  saveContest()
}

function deleteProblem(label: string){
  Swal.fire({
    title: '确认删除吗？',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed) {
      if(label in contest.value.problems){
        delete contest.value.problems[label]
        saveContest()
      } else {
        Swal.fire({ icon: 'error', title: '错误', text: '不存在的试题' })
        return
      }
    }
  })
}

const loading = ref(false)

function getProblems() {
  if (!contest.value) return

  loading.value = true
  problems.value = []
  apiContestProblems({
    contest: contest.value.id,
  })
    .then((response) => {
      response.problems.sort((a, b) => a.id - b.id)
      for (const problem of response.problems) {
        problems.value.push({
          problem: problem,
          label: getLabel(problem.id),
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function getLabel(problem: ProblemId) {
  if (!contest.value) return null
  const keys = Object.keys(contest.value.problems)
  for (const label of keys) {
    if (contest.value.problems[label] === problem) return label
  }
  return null
}

const saving = ref<boolean>(false);
function saveContest() {
  saving.value = true
  apiContestEdit({
    contest: contest.value
  }).then((response) => {
    contest.value = response.contest
    getProblems()
  }).finally(() => {
    saving.value = false
  })
}

getProblems()

</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  line-height: 1;
}

.input-label {
  width: 60px;
}
.input-id {
  margin-left: 1em;
  width: 200px;
}

.info-convey {
  margin-left: 0.5em;
  color: var(--el-color-warning);
}

.preview {
  margin: 0 1em;
}
</style>
