<template>
  <div class="panel-container">
    <el-card>
      <h3>评测详情</h3>

      <template v-if="submission">
        <div class="description-list">
          <div class="description-item">
            <span class="item-label">编号</span>
            <span class="item-value">{{ submission.id }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">提交用户</span>
            <span class="item-value">{{ submission.user.name }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">关联试题</span>
            <span class="item-value">{{ submission.problem.title['zh-CN'] }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">提交时间</span>
            <span class="item-value">{{ formatDate(submission.submittedAt) }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">评测时间</span>
            <span class="item-value">{{ formatDate(submission.processedAt) }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">最终用时</span>
            <span class="item-value">{{ formatTimeShort(submission.time) }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">评测空间</span>
            <span class="item-value">{{ formatMemory(submission.memory) }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">代码长度</span>
            <span class="item-value">{{ submission.length }}</span>
          </div>
          <div class="description-item">
            <span class="item-label">评测语言</span>
            <span class="item-value">{{ codeLangs[submission.lang]?.description ?? '未知语言' }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-loading="loading" style="height: 288px" />
      </template>
    </el-card>

    <el-button type="primary" @click="goToProblem" :disabled="!submission"> 查看试题 </el-button>
  </div>
</template>

<script setup lang="ts">
import type { SubmissionFull } from '@/interface'
import { formatDate, formatMemory, formatTimeShort } from '@/utils/format'

import { ElButton, ElCard } from 'element-plus'
import { useRouter } from 'vue-router'
import { useConfig } from '@/stores/config'
import { useContest } from '@/stores/contest'

const { codeLangs } = useConfig().config

const router = useRouter()
const contestStore = useContest()

const goToProblem = () => {
  const submission = props.submission
  if (submission && submission.problem) {
    if (submission.contest){
      const contest = submission.contest
        contestStore.enter(contest).then(() => {
          router.push(`/contest/${contest}/${ contestStore.getLabel(submission.problem.id )}`)
      })
    } else {
      router.push(`/problem/${submission.problem.id}`)
    }
  }
}

const props = defineProps<{
  submission: SubmissionFull | null
  loading: boolean
}>()
</script>

<style lang="scss" scoped>
.panel-container {
  > * {
    width: 100%;
  }

  > :not(:last-child) {
    margin-bottom: 1em;
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
