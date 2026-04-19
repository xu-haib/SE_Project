<template>
  <div class="config-container">
    <el-table :data="verdictsList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="abbr" label="缩写" width="120">
        <template #default="{ row }">
          <verdict-tag :verdict="row.id" />
        </template>
      </el-table-column>
      <el-table-column label="颜色" width="120">
        <template #default="{ row }">
          <div class="color-box" :style="{ backgroundColor: row.color }"></div>
          <span style="margin-left: 8px">{{ row.color }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { useConfig } from '@/stores/config'

import VerdictTag from '../common/VerdictTag.vue'

const { verdicts } = useConfig().config

const verdictsList = computed(() => {
  return Object.values(verdicts).filter(Boolean)
})
</script>

<style scoped lang="scss">
.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  vertical-align: middle;
}
</style>