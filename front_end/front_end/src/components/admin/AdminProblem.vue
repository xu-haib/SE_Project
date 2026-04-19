<template>
  <div class="problem-list">
    <div class="toolbar">
      <el-button type="primary" @click="handleCreate">创建题目</el-button>

      <div class="filter-list">
        <el-select
          v-model="filter.status"
          placeholder="题目状态"
          style="width: 120px; margin-left: 10px"
          clearable
          @change="handleSearch"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <el-option label="公开" value="public" />
          <el-option label="私有" value="private" />
          <el-option label="比赛" value="contest" />
        </el-select>
        <!-- <el-select
          v-model="filter.type"
          placeholder="题目类型"
          clearable
          style="width: 120px; margin-left: 10px"
          @change="fetchProblems"
        >
          <el-option label="全部" value="" />
          <el-option label="传统题" value="traditional" />
          <el-option label="交互题" value="interactive" />
        </el-select> -->
        <el-input
          v-model="filter.keywords"
          placeholder="题目名称"
          style="width: 300px; margin-left: 10px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <font-awesome-icon :icon="faMagnifyingGlass" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </div>

    <el-table :data="problems" v-loading="loading" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column label="标题" min-width="200">
        <template #default="{ row }">
          <router-link :to="`/problem/${row.id}`" class="title-link">
            {{ row.title['zh-CN'] || Object.values(row.title)[0] || '暂无标题' }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          {{ getTypeText(row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="时间限制" width="120">
        <template #default="{ row }">
          {{ formatTimeShort(row.limitTime) }}
        </template>
      </el-table-column>
      <el-table-column label="空间限制" width="120">
        <template #default="{ row }">
          {{ formatMemory(row.limitMemory) }}
        </template>
      </el-table-column>
      <el-table-column label="难度" width="120">
        <template #default="{ row }">
          {{ row.difficulty }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchProblems"
      @current-change="fetchProblems"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ProblemCore, ProblemFilterParams } from '@/interface'
import { apiProblemAll, apiProblemDelete } from '@/api'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { formatTimeShort, formatMemory } from '@/utils/format'
import Swal from 'sweetalert2'

const router = useRouter()

const problems = ref<ProblemCore[]>([])
const loading = ref(false)

const filter = ref<ProblemFilterParams>({})

const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})

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

const fetchProblems = async () => {
  loading.value = true
  try {
    const res = await apiProblemAll({
      page: pagination.value.current,
      // size: pagination.value.size,
      ...filter.value,
    })
    problems.value = res.problems
    pagination.value.total = res.total
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  router.push(`/problem/create`)
}

const handleEdit = (problem: ProblemCore) => {
  router.push(`/problem/${problem.id}/edit`)
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchProblems()
}

const handleDelete = (problem: ProblemCore) => {
  Swal.fire({
    title: '确认删除吗？',
    text: '删除后将无法恢复！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed) {
      apiProblemDelete({
        problem: problem.id
      }).then(fetchProblems)
    }
  })
}

onMounted(() => {
  fetchProblems()
})
</script>

<style lang="scss" scoped>
// .problem-list {

// }

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-link {
  color: var(--el-color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
