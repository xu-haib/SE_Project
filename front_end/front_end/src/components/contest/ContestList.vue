<template>
  <div class="contest-list-container">
    <template v-if="classified.running.length > 0">
      <el-divider class="running">正在进行</el-divider>

      <div class="contest-section">
        <contest-card
          v-for="contest in classified.running"
          :key="contest.id"
          :contest="contest"
          type="running"
          @signup="handleSignup(contest)"
          @signout="handleSignout(contest)"
        />
      </div>
    </template>

    <template v-if="classified.pending.length > 0">
      <el-divider class="pending">即将开始</el-divider>

      <div class="contest-section">
        <contest-card
          v-for="contest in classified.pending"
          :key="contest.id"
          :contest="contest"
          type="pending"
          @signup="handleSignup(contest)"
          @signout="handleSignout(contest)"
        />
      </div>
    </template>

    <template v-if="classified.finished.length > 0">
      <el-divider class="finished">已经结束</el-divider>

      <div class="contest-section">
        <contest-card
          v-for="contest in classified.finished"
          :key="contest.id"
          :contest="contest"
          type="finished"
        />
      </div>
    </template>

    <el-pagination
      :current-page="currentPage"
      :page-size="10"
      :pager-count="11"
      :total="total"
      @update:current-page="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ContestCard from './ContestCard.vue'

import { ElPagination, ElDivider } from 'element-plus'

import { apiContestList, apiSignout, apiSignup } from '@/api/contest'
import type { Contest, ContestFilterParams, ContestWithSignup } from '@/interface'
import { useRoute, useRouter } from 'vue-router'
import { omitBy } from 'lodash-es'
import Swal from 'sweetalert2'

// 比赛数据
const contests = ref<ContestWithSignup[]>([])
const classified =  ref<{
  running: ContestWithSignup[],
  pending: ContestWithSignup[],
  finished: ContestWithSignup[],
}>({
  running: [],
  pending: [],
  finished: []
});

watch(contests, () => {
  const now = Date.now()
  classified.value.running = []
  classified.value.pending = []
  classified.value.finished = []
  
  for(const contest of contests.value){
    const s = contest.startTime.getTime()
    const e = contest.endTime.getTime()
    if(s <= now && now <= e){
      classified.value.running.push(contest)
    } else 
    if(now < s){
      classified.value.pending.push(contest)
    } else {
      classified.value.finished.push(contest)
    }
  }
})

const props = defineProps<{
  filter: ContestFilterParams
}>()

const route = useRoute()
const router = useRouter()

const total = ref(0)
const currentPage = ref(Number(route.query.page || 1))

const loading = ref(false)

// 处理报名
function handleSignup(contest: Contest) {
  Swal.fire({
    title: `确认要报名比赛 ${contest.title} 吗？`,
    text: '可以在比赛开始前取消报名。',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed) {
      apiSignup({
        contest: contest.id
      }).then(fetchData)
    }
  })
}

// 处理取消报名
function handleSignout(contest: Contest) {
  Swal.fire({
    title: `确认取消报名比赛 ${contest.title} 吗？`,
    text: '可以在比赛开始前重新报名。',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed) {
      apiSignout({
        contest: contest.id
      }).then(fetchData)
    }
  })
}

const emits = defineEmits(['page-change'])

async function fetchData() {
  loading.value = true
  contests.value = []

  // 过滤掉 undefined 和空数组
  const query = omitBy(
    {
      ...props.filter,
      before: props.filter.before?.toISOString(),
      after: props.filter.after?.toISOString(),
      page: currentPage.value,
    },
    (v) => !v,
  )
  router.push({ query })

  apiContestList(query)
    .then((response) => {
      contests.value = response.contests
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
.contest-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contest-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

.running {
  > ::v-deep(.el-divider__text) {
    color: white;
    background-color: var(--el-color-primary);
    border-radius: 8px;
  }
}

.pending,
.finished {
  > ::v-deep(.el-divider__text) {
    background-color: #f9f9f9;
  }
}
</style>
