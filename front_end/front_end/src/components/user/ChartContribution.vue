<template>
  <div class="contribution-chart">

    <div class="controls">
      <el-select v-model="selectedYear" placeholder="选择年份" style="width: 150px" clearable>
        <el-option v-for="year in years" :key="year" :label="year.toString()" :value="year" />
      </el-select>

      <!-- <el-select v-model="showPrivateActivity" placeholder="展示内容" style="width: 180px">
        <el-option label="全部" value="true" />
        <el-option label="仅公开" value="false" />
      </el-select> -->
    </div>

    <svg class="chart" viewBox="0 0 721 110">
      <g transform="translate(25, 20)">
        <template v-for="[wi, dates] in Object.entries(grouped.weeks)">
          <g :transform="`translate(${parseInt(wi) * 13}, 0)`">
            <template v-for="date in dates">
              <template v-if="heatmapData[getDateString(date.date)]">
                <rect
                  class="day" width="11" height="11" :y="date.di * 13"
                  :fill="getColor(
                    heatmapData[getDateString(date.date)] || 0
                  )"
                  @mouseenter="showTooltip($event, getDateString(date.date))"
                  @mouseleave="hideTooltip"
                />
              </template>
              <template v-else>
                <rect class="day" width="11" height="11" :y="date.di * 13" :fill="getColor(0)" />
              </template>
            </template>
          </g>
        </template>

        <template v-for="[mi, week] in Object.entries(grouped.months)">
          <text :x="week * 13 - 4" y="-5" class="month">{{ getMonthText(parseInt(mi)) }}</text>
        </template>

        <text text-anchor="middle" class="wday" dx="-13" dy="22">周一</text>
        <text text-anchor="middle" class="wday" dx="-13" dy="48">周三</text>
        <text text-anchor="middle" class="wday" dx="-13" dy="74">周五</text>
      </g>
    </svg>
    
    <div
      v-if="tooltip.visible"
      class="custom-tooltip"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
    >
      {{ tooltip.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { groupBy, has } from 'lodash'
import type { Judgement } from '@/interface';
import { ElSelect, ElOption, ElTooltip } from 'element-plus';
import { formatDate } from '@/utils/format';

const props = defineProps<{
  judgements: Judgement[]
}>()

const tooltip = ref({
  x: 0,
  y: 0,
  content: '',
  visible: false,
});

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

const selectedYear = ref<number | undefined>(undefined)
// const showPrivateActivity = ref<'true' | 'false'>('true')

function getDateString(date: Date){
  return date.toISOString().split('T')[0]
}

function parseHeatmapData(judgements: Judgement[], year?: number) {
  const dateMap = groupBy(judgements, j =>
    getDateString(j.stamp)
  );
  const dateCount: Record<string, number> = {};
  for (const [date, items] of Object.entries(dateMap)) {
    dateCount[date] = items.length;
  }
  return dateCount;
}

const grouped = computed(() => {
  const s = selectedYear.value === undefined ? new Date(Date.now() - 365 * 86400 * 1000) : new Date(selectedYear.value,  0,  1)
  const e = selectedYear.value === undefined ? new Date(Date.now()                     ) : new Date(selectedYear.value, 11, 31)
  const dates: {
    wi: number,
    di: number,
    date: Date,
  }[] = []
  const weekMap: Record<number, number> = {}
  let p = new Date(s), wi = 0, di = s.getDay()
  while (p <= e) {
    dates.push({
      wi: wi,
      di: di,
      date: new Date(p)
    })
    const d = p.getDate()
    if (d === 15){
      weekMap[p.getMonth()] = wi
    }
    if (di === 6) {
      di = 0
      wi = wi + 1
    } else {
      di = di + 1
    }
    p.setDate(p.getDate() + 1)
  }
  const grouped = {
    weeks: groupBy(dates, d => d.wi),
    months: weekMap
  }
  return grouped
})

const heatmapData = computed(() =>
  parseHeatmapData(props.judgements, selectedYear.value)
)

function getMonthText(mi: number) {
  switch(mi){
    case 0: return '一月';
    case 1: return '二月';
    case 2: return '三月';
    case 3: return '四月';
    case 4: return '五月';
    case 5: return '六月';
    case 6: return '七月';
    case 7: return '八月';
    case 8: return '九月';
    case 9: return '十月';
    case 10: return '十一';
    case 11: return '十二';
  }
  return undefined;
}

function getColor(count: number): string {
  if (!count) return '#EBEDF0'
  if (count >= 4) return '#216E39'
  if (count === 3) return '#40C463'
  if (count === 2) return '#9BE9A8'
  return '#C6E48B'
}

const showTooltip = (event: MouseEvent, content: string) => {
  if(event.target){
    const rect = (event.target as SVGRectElement).getBoundingClientRect()
    tooltip.value.x = rect.x + rect.width / 2;
    tooltip.value.y = rect.y - 5;
  }
  tooltip.value.content = content;
  tooltip.value.visible = true;
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};

</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.chart {
  width: 100%;
  font-size: 0.6em;
  fill: var(--el-text-color-secondary);
}

.custom-tooltip {
  position: fixed;
  background: #333;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  pointer-events: none;
  font-size: 12px;
  z-index: 10;
  white-space: nowrap;

  transform: translate(-50%, -100%);
}
</style>