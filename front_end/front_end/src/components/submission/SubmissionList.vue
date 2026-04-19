<template>
  <el-card body-style="padding-top: 0.5em; padding-bottom: 0.5em">
    <el-affix>
      <table class="submission-list-head">
        <colgroup>
          <col class="col-id" />
          <col class="col-submit" />
          <col class="col-user" />
          <col class="col-problem" />
          <col class="col-lang" />
          <col class="col-verdict" />
          <col class="col-time" />
          <col class="col-memory" />
        </colgroup>
        <thead>
          <tr class="entry">
            <th>#</th>
            <th>提交时间</th>
            <th>提交用户</th>
            <th>试题</th>
            <th>语言</th>
            <th>评测结果</th>
            <th>用时</th>
            <th>空间</th>
          </tr>
        </thead>
      </table>
    </el-affix>

    <table class="submission-list" v-if="submissions.length > 0">
      <colgroup>
        <col class="col-id" />
        <col class="col-submit" />
        <col class="col-user" />
        <col class="col-problem" />
        <col class="col-lang" />
        <col class="col-verdict" />
        <col class="col-time" />
        <col class="col-memory" />
      </colgroup>
      <tbody>
        <tr v-for="submission in submissions" :key="submission.id" class="entry">
          <td class="id">
            <router-link :to="`/submission/${submission.id}`" class="submission-link">
              <span>{{ submission.id }}</span>
            </router-link>
          </td>
          <td class="time">
            {{ formatDate(submission.submittedAt) }}
          </td>
          <td class="user">
            <router-link :to="`/user/${submission.user.id}`" class="user-link">
              <span>{{ submission.user.name }}</span>
            </router-link>
          </td>
          <td class="problem">
            <router-link :to="`/problem/${submission.problem.id}`" class="problem-title">
              {{ submission.problem.title['zh-CN'] ?? Object.values(submission.problem.title)[0] ?? '暂无标题' }}
            </router-link>
          </td>
          <td class="lang">
            {{ codeLangs[submission.lang]?.description ?? '未知语言' }}
          </td>
          <td class="verdict">
            <verdict-tag :verdict="submission.verdict" />
          </td>
          <td class="time">{{ formatTimeShort(submission.time) }}</td>
          <td class="memory">{{ formatMemory(submission.memory) }}</td>
        </tr>
      </tbody>
    </table>
    <template v-else>
      <div v-if="loading" v-loading="true" style="height: 200px" />
      <el-empty v-else description="暂无记录" />
    </template>

    <el-affix position="bottom">
      <div class="submission-list-bottom">
        <el-pagination
          :current-page="currentPage"
          :page-size="100"
          :pager-count="11"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </el-affix>
  </el-card>
</template>

<script setup lang="ts">
import { ElCard, ElAffix, ElPagination, ElEmpty } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import type { SubmissionFilterParams, SubmissionLite } from '@/interface'

import { useConfig } from '@/stores/config'
import { useRoute, useRouter } from 'vue-router'

import { formatDate, formatMemory, formatTimeShort } from '@/utils/format'
import VerdictTag from '../common/VerdictTag.vue'
import { apiSubmissionList } from '@/api/submission'
import { omitBy } from 'lodash-es'

const props = defineProps<{
  filter: SubmissionFilterParams
}>()

const { codeLangs } = useConfig().config
const route = useRoute()
const router = useRouter()

const total = ref(0)
const currentPage = ref(Number(route.query.page || 1))
const submissions = ref<SubmissionLite[]>([])

const loading = ref(false)

async function fetchData() {
  loading.value = true
  submissions.value = []

  // 过滤掉 undefined 和空数组
  const query = omitBy(
    {
      ...props.filter,
      page: currentPage.value,
    },
    (v) => !v,
  )
  router.push({ query })

  apiSubmissionList(query)
    .then((response) => {
      submissions.value = response.submissions
      total.value = response.total
    })
    .finally(() => {
      loading.value = false
    })
}

// 监听筛选参数变化
watch(
  () => props.filter,
  () => {
    currentPage.value = 1
    fetchData()
  },
  { deep: true },
)

// 监听分页变化
watch(currentPage, fetchData)

// 初始化加载数据
fetchData()

const handlePageChange = (val: number) => {
  currentPage.value = val
}
</script>

<style lang="scss" scoped>
.submission-list {
  &-head {
    padding-top: 16px;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
  }
  &-bottom {
    padding: 16px 0;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
  }
}

table.submission-list {
  tr.entry {
    &:hover {
      background-color: #f5f5f5;
    }
  }
}

table.submission-list,
table.submission-list-head {
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
    &-submit {
      width: 180px;
    }
    &-user {
      width: 150px;
    }
    &-problem {
      width: auto;
    }
    &-lang {
      width: 150px;
    }
    &-verdict {
      width: 80px;
    }
    &-time {
      width: 80px;
    }
    &-memory {
      width: 80px;
    }
  }

  td {
    &.id,
    &.verdict,
    &.time,
    &.memory,
    &.user {
      text-align: center;
    }
    &.time,
    &.memory {
      font-family: monospace;
    }
    &.verdict {
      font-weight: bold;
      text-overflow: clip;
    }
  }
}

.user-link,
.submission-link {
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.problem-title {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}
</style>
