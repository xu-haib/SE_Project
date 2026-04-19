<template>
  <layout-main :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '比赛列表', to: {name: 'contest-list'}},
    {label: `#${ props.cid_str }`, to: {name: 'contest-detail', params: { 'cid_str': props.cid_str }}},
    {label: '比赛编辑'},
    ]">
    <el-card>
      <template v-if="contest">
        <el-tabs v-model="activeTab">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <contest-edit-basic v-model="contest" />
          </el-tab-pane>

          <!-- 比赛试题 -->
          <el-tab-pane v-if="contest.id !== 0" label="比赛试题" name="problemset">
            <contest-edit-problemset v-model="contest" />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-else>
        <div v-if="loading" v-loading="true" style="height: 200px" />
        <el-empty v-else description="暂无数据" />
      </template>
    </el-card>
  </layout-main>
</template>

<script setup lang="ts">
import LayoutMain from '@/components/layout/LayoutMain.vue'

import ContestEditBasic from '@/components/contest/ContestEditBasic.vue'
import ContestEditProblemset from '@/components/contest/ContestEditProblemset.vue'

import { ElTabs, ElTabPane, ElCard } from 'element-plus'

import { computed, onMounted, ref } from 'vue'

import type { Contest } from '@/interface'
import { apiContest, apiProblem } from '@/api'

const activeTab = ref('basic')
const props = defineProps<{
  cid_str?: string
}>()

const contest = ref<Contest | null>(null)
const loading = ref(false)

async function getContest() {
  contest.value = null

  if (props.cid_str) {
    loading.value = true
    await apiContest({ contest: parseInt(props.cid_str) })
      .then((response) => {
        contest.value = response.contest
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    contest.value = {
      id: 0,
      title: '',
      summary: '',
      description: '',
      difficulty: 1,
      status: 'private',
      startTime: new Date(),
      endTime: new Date(),
      rule: 'ACM',
      problems: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    }
  }
}

getContest()
</script>

<style lang="scss" scoped></style>
