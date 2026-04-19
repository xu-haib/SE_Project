<template>
  <div class="pie-chart-container">
    <!-- 使用ECharts或类似库实现 -->
    <div ref="chartEl" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import type { Judgement } from '@/interface'

import { useConfig } from '@/stores/config'
import { groupBy } from 'lodash-es'

const { difficulties } = useConfig().config

const props = defineProps<{
  judgements: Judgement[]
}>()

const chartEl = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function parsePieData(judgements: Judgement[]) {
  const difficultyMap = groupBy(judgements, j =>
    difficulties.findIndex(d => d.min <= j.difficulty && j.difficulty <= d.max)
  );
  const difficultyCount: {
    name: string, value: number
  }[] = [];
  for (const [difficulty, items] of Object.entries(difficultyMap)) {
    difficultyCount.push({
      name: difficulties[parseInt(difficulty)].name,
      value: items.length
    })
  }
  return difficultyCount;
}

onMounted(() => {
  if (chartEl.value) {
    chart = echarts.init(chartEl.value)
    updateChart()
  }
})

watch(() => props.judgements, updateChart)

function updateChart() {
  if (!chart) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
    },
    series: [
      {
        name: '难度分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: parsePieData(props.judgements),
      },
    ],
  }

  chart.setOption(option)
}
</script>
