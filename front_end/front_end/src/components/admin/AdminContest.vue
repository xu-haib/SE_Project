<template>
  <div class="contest-list">
    <div class="toolbar">
      <el-button type="primary" @click="handleCreate">创建比赛</el-button>
      <el-select
        v-model="filter.status"
        placeholder="比赛状态"
        clearable
        style="width: 120px; margin-left: 10px"
        @change="fetchContests"
      >
        <el-option label="全部" value="" />
        <el-option label="未开始" value="pending" />
        <el-option label="进行中" value="running" />
        <el-option label="已结束" value="ended" />
      </el-select>
      <el-select
        v-model="filter.rule"
        placeholder="比赛规则"
        clearable
        style="width: 120px; margin-left: 10px"
        @change="fetchContests"
      >
        <el-option label="全部" value="" />
        <el-option label="OI" value="OI" />
        <el-option label="ACM" value="ACM" />
        <el-option label="IOI" value="IOI" />
      </el-select>
      <el-input
        v-model="filter.keyword"
        placeholder="搜索比赛"
        style="width: 300px; margin-left: 10px"
        clearable
        @clear="fetchContests"
        @keyup.enter="fetchContests"
      >
        <template #append>
          <el-button icon="search" @click="fetchContests" />
        </template>
      </el-input>
    </div>

    <el-table :data="contests" v-loading="loading" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="名称" min-width="200">
        <template #default="{ row }">
          <router-link :to="`/contest/${row.id}`" class="title-link">
            {{ row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row)">
            {{ getStatusText(row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="360">
        <template #default="{ row }">
          <div>{{ formatDate(row.startTime) }} ~ {{ formatDate(row.endTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="rule" label="规则" width="100" />
      <el-table-column label="难度" width="150">
        <template #default="{ row }">
          <el-rate v-model="row.difficulty" disabled :max="5" text-color="#ff9900" />
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
      :page-size="pagination.size"
      :page-sizes="[10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="fetchContests"
      @current-change="fetchContests"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElTable, ElTableColumn, ElPagination, ElRate } from 'element-plus'
import type { Contest } from '@/interface'
import { formatDate } from '@/utils/format'
import { apiContestAll } from '@/api'

const router = useRouter()

const contests = ref<Contest[]>([])
const loading = ref(false)

const pagination = reactive({
  current: 1,
  size: 50,
  total: 0,
})

const filter = ref({
  status: '',
  rule: '',
  keyword: '',
})

const getStatusText = (contest: Contest) => {
  const now = new Date()
  if (now < contest.startTime) return '未开始'
  if (now > contest.endTime) return '已结束'
  return '进行中'
}

const getStatusTagType = (contest: Contest) => {
  const now = new Date()
  if (now < contest.startTime) return 'info'
  if (now > contest.endTime) return ''
  return 'success'
}

const fetchContests = async () => {
  loading.value = true
  try {
    const res = await apiContestAll({
      page: pagination.current,
      filter: {},
    })
    contests.value = res.contests
    pagination.total = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {}

const handleEdit = (contest: Contest) => {
  router.push(`/contest/${contest.id}/edit`)
}

const handleDelete = (contest: Contest) => {
  ElMessageBox.confirm(`确定删除比赛 "${contest.title}"?`, '提示', {
    type: 'warning',
  }).then(async () => {
    try {
      // await deleteContest(contest.id)
      ElMessage.success('删除成功')
      fetchContests()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  fetchContests()
})
</script>

<style lang="scss" scoped>
// .contest-list {

// }

.toolbar {
  display: flex;
  align-items: center;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
