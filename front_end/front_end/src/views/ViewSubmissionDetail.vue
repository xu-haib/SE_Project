<template>
  <layout-sidebar :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '提交列表', to: {name: 'submission-list'}},
    {label: `#${ props.rid_str }`},
    ]">
    <template #main>
      <el-card>
        <submission-main :submission="submission" :loading="loading" />
      </el-card>
    </template>
    <template #sidebar>
      <submission-sidebar :submission="submission" :loading="loading" />
    </template>
  </layout-sidebar>
</template>

<script setup lang="ts">
import LayoutSidebar from '@/components/layout/LayoutSidebar.vue'
import SubmissionMain from '@/components/submission/SubmissionMain.vue'
import SubmissionSidebar from '@/components/submission/SubmissionSidebar.vue'

import { ElCard } from 'element-plus'

import { apiSubmissionDetail, setupSubmissionWS } from '@/api/submission'
import { onMounted, ref } from 'vue'
import type { SubmissionFull, SubmissionId } from '@/interface'
import { omit } from 'lodash-es'

const props = defineProps<{
  rid_str: string
}>()
const rid: SubmissionId = parseInt(props.rid_str)

const submission = ref<SubmissionFull | null>(null)
const loading = ref(true)

const unsubscribeWs = ref<() => void>(() => {})

function needListening(verdict: string) {
  return verdict === 'PD' || verdict === 'JD'
}

onMounted(() => {
  apiSubmissionDetail({
    id: rid,
  })
    .then((response) => {
      submission.value = response.submission

      // 如果评测未完成，建立 WebSocket 连接
      if (needListening(submission.value.verdict)) {
        unsubscribeWs.value = setupSubmissionWS(rid, (updated) => {
          submission.value = { 
            problem: submission.value!.problem,
            user: submission.value!.user,
            ...omit(updated, ['problem', 'user'])
          }
          
          // 评测完成时关闭连接
          if (!needListening(updated.verdict)) {
            unsubscribeWs.value()
          }
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style lang="scss" scoped></style>
