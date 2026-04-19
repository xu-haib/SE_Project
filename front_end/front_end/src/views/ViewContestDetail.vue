<template>
  <layout-sidebar :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '比赛列表', to: {name: 'contest-list'}},
    {label: `#${ props.cid_str }`},
    ]">
    <template #main>
      <contest-toolbar />

      <el-card>
        <template v-if="contest">
          <el-tabs v-model="activeTab" class="contest-tabs" @tab-click="handleClick">
            <!-- 比赛详情 -->
            <el-tab-pane label="比赛详情" name="overview">
              <contest-overview />
            </el-tab-pane>

            <!-- 题目列表 -->
            <el-tab-pane label="题目列表" name="problems">
              <contest-problems />
            </el-tab-pane>

            <!-- 我的提交 -->
            <el-tab-pane label="我的提交" name="submissions">
              <contest-submissions />
            </el-tab-pane>

            <!-- 排行榜 -->
            <el-tab-pane label="排行榜" name="ranking" />
          </el-tabs>
        </template>
        <template v-else>
          <div v-if="loading" v-loading="true" style="height: 200px" />
          <el-empty v-else description="暂无数据" />
        </template>
      </el-card>
    </template>
    <template #sidebar>
      <contest-sidebar />
    </template>
  </layout-sidebar>
</template>

<script setup lang="ts">

import LayoutSidebar from '@/components/layout/LayoutSidebar.vue'
import ContestSidebar from '@/components/contest/ContestSidebar.vue'

import ContestOverview from '@/components/contest/ContestOverview.vue'
import ContestProblems from '@/components/contest/ContestProblems.vue'
import ContestSubmissions from '@/components/contest/ContestSubmissions.vue'
import ContestToolbar from '@/components/contest/ContestToolbar.vue'

import { ElTabs, ElTabPane, ElCard, type TabsPaneContext } from 'element-plus'

import { computed, onMounted, ref } from 'vue'

import type { ContestId } from '@/interface'

import { useContest } from '@/stores/contest'
import { useRouter } from 'vue-router'

const props = defineProps<{
  cid_str: string
}>();

const contestStore = useContest()
const router = useRouter()

const contest = computed(() => contestStore.currentContest)
const loading = computed(() => contestStore.loading)

const activeTab = ref('overview')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (tab.paneName === 'ranking') {
    event.preventDefault()
    router.push(`/contest/${contest.value!.id}/ranklist`)
  }
}
</script>

<style lang="scss" scoped>
.edit-icon {
  position: absolute;
  top: -0.5em;
  right: 0.5em;
}

.contest-tabs {
  position: relative;
}
</style>
