<template>
  <div class="panel-container">
    <el-card>
      <h3 class="info-title">题目信息</h3>

      <template v-if="problem">
        <div class="description-list">
          <div class="description-item">
            <span class="item-label">编号</span>
            <span class="item-value">{{ problem.id }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">难度</span>
            <span class="item-value">{{ problem.difficulty }}</span>
          </div>
          <!-- <div class="description-item">
            <span class="item-label">标签</span>
            <span class="item-value">没写</span>
          </div> -->
          <div class="description-item">
            <span class="item-label">来源</span>
            <span class="item-value">{{ problem.provider }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-loading="loading" style="height: 128px" />
      </template>
    </el-card>

    <el-button type="primary" :disabled="problem === null || !problem.hasTestdata" @click="handleSubmit">提交</el-button>

    <el-space fill :fill-ratio="40">
      <el-button plain @click="gotoAllRecords">全部记录</el-button>
      <el-button plain @click="gotoMyRecords">我的记录</el-button>
    </el-space>
  </div>

  <problem-submit v-if="problem" :problem="problem" v-model="openSubmit" />
</template>

<script setup lang="ts">
import ProblemSubmit from './ProblemSubmit.vue'
import type { Problem, Judgement } from '@/interface'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

import { ElButton, ElCard, ElSpace } from 'element-plus'
import { ref } from 'vue'

const router = useRouter()
const auth = useAuth()

const openSubmit = ref(false)

function handleSubmit() {
  if(!auth.isAuthenticated){
    auth.show('login')
  } else {
    openSubmit.value = true
  }
}

const props = withDefaults(
  defineProps<{
    problem: Problem | null
    judgement: Judgement | null
    edit?: boolean
    loading: boolean
  }>(),
  {
    edit: false,
  },
)

const gotoAllRecords = () => {
  if (!props.problem) return
  router.push(`/submission?problem=${props.problem.id}`)
}

const gotoMyRecords = () => {
  if (!props.problem) return
  if (!auth.currentUser) {
    auth.show('login')
    return
  }
  router.push(`/submission?problem=${props.problem.id}&user=${auth.currentUser.id}`)
}
</script>

<style lang="scss" scoped>
.info-title {
  margin-bottom: 0.5em;
}

.panel-container {
  > * {
    width: 100%;
  }

  > :not(:last-child) {
    margin-bottom: 16px;
  }

  &:not(:last-child) {
    margin-bottom: 24px;
  }
}

.description {
  &-list {
    width: 100%;

    > .item {
      &-label {
        flex-shrink: 0;
        margin-right: 1rem;
        white-space: nowrap;
      }
      &-value {
        flex-grow: 1;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
  }
}
</style>
