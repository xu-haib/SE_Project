<template>
  <div class="basic-container">
    <el-form v-model="problem" style="max-width: 200px">
      <el-form-item label="时间限制">
        <el-input v-model.number="problem.limitTime" />
      </el-form-item>
      <el-form-item label="空间限制">
        <el-input v-model.number="problem.limitMemory" />
      </el-form-item>
      <el-form-item label="可见状态">
        <el-select v-model="problem.status">
          <el-option value="public" label="公开" />
          <el-option value="contest" label="比赛" />
          <el-option value="private" label="隐藏" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目类型">
        <el-select v-model="problem.type">
          <el-option value="traditional" label="传统" />
          <el-option value="interactive" label="交互" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目难度">
        <el-input v-model.number="problem.difficulty" />
      </el-form-item>
      <el-form-item label="标签设置"> </el-form-item>
    </el-form>

    <el-button :loading="saving" type="primary" @click="saveProblem"> 保存 </el-button>
  </div>
</template>

<script setup lang="ts">
import type { Problem } from '@/interface'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus'

import { useConfig } from '@/stores/config'
import { ref } from 'vue'
import { apiProblemEdit } from '@/api'
const { difficulties } = useConfig().config

const saving = ref(false)

const problem = defineModel<Problem>({
  required: true,
})

async function saveProblem() {
  saving.value = true
  try {
    await apiProblemEdit({
      problem: problem.value,
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.example-container {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
</style>
