<template>
  <div class="filter-container">
    <el-card class="card">
      <template #header> 筛选 </template>

      <el-form :model="form">
        <el-form-item label="赛制" class="filter-item">
          <el-select v-model="form.rule" placeholder="全部赛制" clearable>
            <el-option label="OI 赛制" value="OI" />
            <el-option label="ACM 赛制" value="ACM" />
            <el-option label="IOI 赛制" value="IOI" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度" class="filter-item">
          <el-select v-model="form.difficulty" placeholder="全部难度" clearable>
            <el-option v-for="i in 5" :key="i" :label="`${i}星`" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始于" class="filter-item">
          <el-date-picker style="width: calc(100% - 40px)" v-model="form.after" type="date" placeholder="选择日期"/>
          <span style="margin-left: 0.5em">之后</span>
        </el-form-item>
        <el-form-item label="开始于" class="filter-item">
          <el-date-picker style="width: calc(100% - 40px)" v-model="form.before" type="date" placeholder="选择日期"/>
          <span style="margin-left: 0.5em">之前</span>
        </el-form-item>
      </el-form>

      <div class="button-container">
        <el-button type="primary" @click="handleSubmit">筛选</el-button>
        <el-button plain type="primary" @click="handleReset">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { ContestFilterParams } from '@/interface'
import { ref } from 'vue'

import { ElForm, ElFormItem, ElSelect, ElOption, ElButton, ElCard } from 'element-plus'
import { cloneDeep } from 'lodash-es';

const emits = defineEmits<{
  (e: 'filter-change', value: ContestFilterParams): void
}>()

const props = defineProps<{
  filter: ContestFilterParams
}>()

const form = ref<ContestFilterParams>(cloneDeep(props.filter))

const handleSubmit = () => {
  emits('filter-change', cloneDeep(form.value))
}
const handleReset = () => {
  form.value = {}
  emits('filter-change', {})
}
</script>

<style lang="scss" scoped>
.card {
  margin: 0;
  padding: 0;

  > ::v-deep(.el-card__header) {
    padding: 8px 12px;
  }
}

.filter-container {
  > *:not(:last-child) {
    margin-bottom: 16px;
  }
}

.filter-item {
  &:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>
