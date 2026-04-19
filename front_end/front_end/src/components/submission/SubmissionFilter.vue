<template>
  <div class="filter-container">
    <el-card class="card">
      <el-form :inline="true" :model="form">
        <el-form-item label="用户" class="filter-item">
          <el-input v-model="form.user" placeholder="用户名或 ID" clearable />
        </el-form-item>
        <el-form-item label="试题" class="filter-item">
          <el-input v-model.number="form.problem" placeholder="题目 ID" clearable />
        </el-form-item>
        <el-form-item label="语言" class="filter-item">
          <el-select v-model="form.lang" clearable>
            <el-option
              v-for="lang in codeLangs"
              :key="lang!.id"
              :value="lang!.id"
              :label="lang!.description"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评测结果" class="filter-item">
          <el-select v-model="form.verdict" clearable>
            <el-option
              v-for="verdict in verdicts"
              :key="verdict!.id"
              :value="verdict!.id"
              :label="verdict!.description"
            />
          </el-select>
        </el-form-item>

        <div class="button-container">
          <el-button type="primary" @click="handleSubmit">筛选</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { SubmissionFilterParams } from '@/interface'

import { ElCard, ElInput, ElForm, ElFormItem, ElSelect, ElOption, ElButton } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'

import { useConfig } from '@/stores/config'

const { codeLangs, verdicts } = useConfig().config

const emits = defineEmits<{
  (e: 'filter-change', value: SubmissionFilterParams): void
}>()

const props = defineProps<{
  filter: SubmissionFilterParams
}>()

const form = ref<SubmissionFilterParams>(cloneDeep(props.filter))

const handleSubmit = () => {
  emits('filter-change', cloneDeep(form.value))
}
// const handleReset = () => {
//   emits('filter-change', {})
// }
</script>

<style lang="scss" scoped>
.filter-item {
  margin: 0 1em;
  width: 200px;
}

.button-container {
  float: right;
}
</style>
