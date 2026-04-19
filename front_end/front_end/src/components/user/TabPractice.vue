<template>
  <div class="practice-tab">
    <!-- 统计图表区 -->
    <el-row class="section" :gutter="24">
      <el-col :span="12">
        <el-card body-style="padding: 4px">
          <template #header>参与比赛</template>
          <el-empty description="暂无比赛数据" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card body-style="padding: 4px">
          <template #header>难度分布</template>
          <chart-pie :judgements="corrects" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 热度图 -->
    <el-card class="section">
      <template #header>练习情况</template>
      <chart-contribution :judgements="corrects" />
    </el-card>

    <!-- 通过题目列表 -->
    <el-card class="section">
      <template #header>通过试题</template>

      <template v-if="Object.keys(grouped).length > 0">
        <div v-for="[di, judgements] of Object.entries(grouped)" :key="di">
          <template v-if="judgements.length > 0">
            <el-divider content-position="left">{{ difficulties[parseInt(di)].name }}</el-divider>
            <el-row :gutter="20">
              <el-col v-for="judgement in judgements" :key="judgement.problem" :xs="4" :sm="3" :md="2" :lg="2">
                <router-link :to="`/problem/${judgement.problem}`" class="problem-card">
                  <span class="problem-id">{{ judgement.problem }}</span>
                </router-link>
              </el-col>
            </el-row>
          </template>
        </div>
      </template>
      <template v-else>
        <el-empty description="暂无通过试题" />
      </template>
    </el-card>

    <el-card class="section" v-if="incorrects.length > 0">
      <template #header>尝试试题</template>
      
      <el-row :gutter="20">
        <el-col v-for="judgement in incorrects" :key="judgement.problem" :xs="4" :sm="3" :md="2" :lg="2">
          <router-link :to="`/problem/${judgement.problem}`" class="problem-card">
            <span class="problem-id">{{ judgement.problem }}</span>
          </router-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import type { Judgement, User } from '@/interface'

import { computed, onMounted, ref, watch } from 'vue'
import ChartContribution from './ChartContribution.vue'
import ChartPie from './ChartPie.vue'
import { ElCard } from 'element-plus'
import { apiPractice } from '@/api'
import { useConfig } from '@/stores/config'
import { floor, groupBy } from 'lodash-es'

const { difficulties } = useConfig().config

const props = defineProps<{
  user: User
}>()

const loading = ref(false)
const judgements = ref<Judgement[]>([]);

const corrects = computed(() => {
  return judgements.value.filter(j => j.judge === 'correct')
})

const incorrects = computed(() => {
  return judgements.value.filter(j => j.judge !== 'correct')
})

const grouped = computed(() => {
  return groupBy(corrects.value, j =>
    difficulties.findIndex(d => d.min <= j.difficulty && j.difficulty <= d.max)
  );
})

async function fetchPractice() {
  loading.value = true
  judgements.value = []

  apiPractice({
    user: props.user.id
  })
    .then((response) => {
      judgements.value = response.judgements
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  fetchPractice()
})
watch(() => props.user, fetchPractice)
</script>

<style lang="scss" scoped>
.practice-tab {
  padding: 8px;

  > *:not(:last-child) {
    margin-bottom: 24px;
  }
}

.chart-container {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
}

.problem-card {
  display: block;
  padding: 12px;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--el-box-shadow-light);
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  .problem-id {
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  /* .problem-title {
    color: var(--el-color-primary);
  } */
}
</style>
