<template>
  <div class="config-container">
    <el-table :data="codeLangsList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="文件后缀" width="200">
        <template #default="{ row }">
          <el-tag v-for="ext in row.ext" :key="ext" style="margin-right: 5px">
            {{ ext }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ratio" label="时限比率" width="120" align="center" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTable, ElTableColumn, ElTag } from 'element-plus'
import { useConfig } from '@/stores/config'

const { codeLangs } = useConfig().config

const codeLangsList = computed(() => {
  return Object.values(codeLangs).filter(Boolean)
})
</script>

<style scoped>

</style>