<template>
  <div class="problem-tab">
    <el-row :gutter="20">
      <!-- 题目列表 -->
      <el-col :md="12" :sm="24">
        <el-card class="panel">
          <div class="panel-header">
            <h3>我创建的题目</h3>
            <el-button type="primary" size="small" @click="handleCreateProblem">新建题目</el-button>
          </div>

          <template v-if="problems.length > 0">
              
            <table class="problemset">
              <colgroup>
                <col class="col-id" />
                <col class="col-title" />
                <col class="col-submit" />
                <col class="col-status" />
                <col class="col-edit" />
              </colgroup>
              <tbody>
                <tr class="entry" v-for="problem in problems" :key="problem.id">
                  <td class="id">{{ problem.id }}</td>

                  <td class="problem">
                    <router-link :to="`/problem/${problem.id}`" class="problem-title">
                      {{ problem.title['zh-CN'] || Object.values(problem.title)[0] || '暂无标题' }}
                    </router-link>
                  </td>

                  <td class="submit">{{ problem.countTotal }} 提交</td>
                  <td class="status">{{ getStatusText(problem.status) }}</td>
                  <td class="edit">
                    <font-awesome-icon :icon="faPenToSquare" @click="handleEditProblem(problem.id)" />
                  </td>
                </tr>
              </tbody>
            </table>

            <el-pagination
              v-model:current-page="pagination.current"
              v-model:page-size="pagination.size"
              :total="pagination.total"
              layout="total, prev, pager, next, jumper"
              @size-change="fetchProblems"
              @current-change="fetchProblems"
            />
          </template>
          <template v-else>
            <el-empty description="暂无题目数据" />
          </template>

        </el-card>
      </el-col>

      <!-- 比赛列表 -->
      <el-col :md="12" :sm="24">
        <el-card class="panel">
          <div class="panel-header">
            <h3>我创建的比赛</h3>
            <el-button type="primary" size="small">新建比赛</el-button>
          </div>
          <el-empty description="暂无比赛数据" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ProblemCore, ProblemId, User } from '@/interface'

import { ElRow, ElCol, ElButton, ElPagination } from 'element-plus'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

import { useRouter } from 'vue-router'
import { apiProblemMine } from '@/api'

const router = useRouter();

const props = defineProps<{
  user: User
}>()

const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})

const problems = ref<ProblemCore[]>([])
const loading = ref(false)

const fetchProblems = async () => {
  loading.value = true
  try {
    const res = await apiProblemMine({
      provider: props.user.id,
      page: pagination.value.current,
      // size: pagination.value.size,
    })
    problems.value = res.problems
    pagination.value.total = res.total
  } finally {
    loading.value = false
  }
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    public: '公开',
    private: '私有',
    contest: '比赛',
  }
  return map[status] || '未知'
}

function handleCreateProblem(){
  router.push(`/problem/create`)
}

function handleEditProblem(problem: ProblemId){
  router.push(`/problem/${problem}/edit`)

}

onMounted(() => {
  fetchProblems()
})
</script>

<style lang="scss" scoped>
.problem-tab {
  padding: 8px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

.problemset {
  &-head {
    padding-top: 0.5em;
    background-color: rgba(255, 255, 255, 0.8);
  }
  &-bottom {
    padding: 0.5em 0;
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
    &-id {
      width: 60px;
    }
    &-title {
      width: auto;
    }
    &-submit {
      width: 90px;
    }
    &-status {
      width: 50px;
    }
    &-edit {
      width: 35px;
    }
  }

  td {
    &.status {
      text-align: center;
    }
    &.id {
      text-align: center;
    }
    &.submit {
      text-align: right;
    }
    &.edit {
      text-align: center;
    }
  }
}

.acceptance {
  &-bar {
    height: 100%;
    background-color: var(--el-color-success);
    transition: width 0.3s ease;
  }

  &-bar-container {
    position: relative;
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
