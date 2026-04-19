<template>
  <div class="submission-list">
    <div class="toolbar">
      <div class="filter-list">

        <el-input
          v-model="filter.user"
          placeholder="用户ID或名称"
          style="width: 200px; margin-right: 10px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />

        <el-input
          v-model="filter.problem"
          placeholder="题目ID"
          style="width: 120px; margin-right: 10px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />

        <el-select
          v-model="filter.verdict"
          placeholder="评测结果"
          style="width: 150px; margin-right: 10px"
          clearable
          @change="handleSearch"
          @clear="handleSearch"
        >
          <el-option
            v-for="verdict in verdicts"
            :key="verdict!.id"
            :label="verdict!.description"
            :value="verdict!.id"
          />
        </el-select>

        <el-button type="primary" @click="handleSearch">
          <font-awesome-icon :icon="faMagnifyingGlass" />
          搜索
        </el-button>
      </div>
    </div>

    <el-table :data="submissions" v-loading="loading" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="submittedAt" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.submittedAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="user.name" label="用户" width="150" />
      <el-table-column prop="problem.title" label="题目" width="auto">
        <template #default="{ row }">
          {{ row.problem.title['zh-CN'] ?? Object.values(row.problem.title)[0] ?? '暂无标题' }}
        </template>
      </el-table-column>
      <el-table-column prop="lang" label="语言" width="150">
        <template #default="{ row }">
          {{ codeLangs[row.lang]?.description ?? '未知语言' }}
        </template>
      </el-table-column>
      <el-table-column prop="verdict" label="结果" width="120">
        <template #default="{ row }">
          <verdict-tag :verdict="row.verdict" />
        </template>
      </el-table-column>
      <el-table-column prop="time" label="用时" width="100" align="right">
        <template #default="{ row }">
          {{ formatTimeShort(row.time) }}
        </template>
      </el-table-column>
      <el-table-column prop="memory" label="内存" width="100" align="right">
        <template #default="{ row }">
          {{ formatMemory(row.memory) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleRejudge(row)">重测</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="total, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchSubmissions"
      @current-change="fetchSubmissions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElButton, ElTable, ElTableColumn, ElInput, ElSelect, ElOption, ElPagination } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

import type { SubmissionFilterParams, SubmissionLite, Verdict } from '@/interface'
import { formatDate, formatMemory, formatTimeShort } from '@/utils/format'
import VerdictTag from '../common/VerdictTag.vue'
import { apiSubmissionList, apiSubmissionDelete, apiSubmissionRejudge } from '@/api/submission'
import { useConfig } from '@/stores/config'

const { codeLangs, verdicts } = useConfig().config

const submissions = ref<SubmissionLite[]>([])
const loading = ref(false)

const filter = ref<SubmissionFilterParams>({})

const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})

const fetchSubmissions = async () => {
  loading.value = true
  try {
    const res = await apiSubmissionList({
      page: pagination.value.current,
      size: pagination.value.size,
      ...filter.value,
    })
    submissions.value = res.submissions
    pagination.value.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchSubmissions()
}

const handleRejudge = (submission: SubmissionLite) => {
  Swal.fire({
    title: '确认重测吗？',
    text: '这将重新评测此提交记录',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed) {
      apiSubmissionRejudge({ id: submission.id })
        .then(() => {
          ElMessage.success('重测请求已提交')
          fetchSubmissions()
        })
    }
  })
}

const handleDelete = (submission: SubmissionLite) => {
  Swal.fire({
    title: '确认删除吗？',
    text: '删除后将无法恢复！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed) {
      apiSubmissionDelete({ id: submission.id })
        .then(() => {
          ElMessage.success('删除成功')
          fetchSubmissions()
        })
    }
  })
}

onMounted(() => {
  fetchSubmissions()
})
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-list {
  display: flex;
  align-items: center;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>