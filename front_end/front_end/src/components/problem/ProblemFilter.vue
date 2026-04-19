<template>
  <div class="filter-container">
    <el-card class="card">
      <template #header> 筛选 </template>

      <el-form :model="form">
        <el-form-item label="难度" class="filter-item">
          <el-space spacer="-" :fill-ratio="40">
            <el-input v-model.number="form.minDifficulty" />
            <el-input v-model.number="form.maxDifficulty" />
          </el-space>
        </el-form-item>
        <!-- <el-form-item label="标签" class="filter-item">
          <a class="tag-selector">标签选择器</a>
        </el-form-item> -->

        <el-input v-model="form.keywords" placeholder="题目名称、ID" class="filter-item">
          <template #prefix>
            <font-awesome-icon :icon="faMagnifyingGlass" />
          </template>
        </el-input>
      </el-form>

      <div class="button-container">
        <el-button type="primary" @click="handleSubmit">筛选</el-button>
        <el-button plain type="primary" @click="handleReset">清空</el-button>
      </div>
    </el-card>

    <!-- <el-card class="card">
      <template #header>
        <span>最近添加</span>
      </template>
      TODO
    </el-card>

    <el-card class="card">
      <template #header>
        <span>最近做过</span>
      </template>
      TODO
    </el-card> -->
  </div>
</template>

<script setup lang="ts">
import type { ProblemFilterParams } from '@/interface'

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { ElCard, ElInput, ElForm, ElFormItem, ElSpace, ElButton } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue'

const emits = defineEmits<{
  (e: 'filter-change', value: ProblemFilterParams): void
}>()

const props = defineProps<{
  filter: ProblemFilterParams
}>()

const form = ref<ProblemFilterParams>(cloneDeep(props.filter))

const handleSubmit = () => {
  emits('filter-change', cloneDeep(form.value))
}
const handleReset = () => {
  emits('filter-change', {})
}
</script>

<style lang="scss" scoped>
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

.tag-selector {
  margin-left: auto;
}

.card {
  margin: 0;
  padding: 0;

  > ::v-deep(.el-card__header) {
    padding: 8px 12px;
  }
}

.button-container {
  margin-top: 16px;
  width: 100%;
}
</style>
