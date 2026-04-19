<template>
  <div class="config-container">
    <el-table :data="userLangsList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="国旗标识" width="120">
        <template #default="{ row }">
          <span v-if="row.flag">{{ row.flag }}</span>
          <el-tag v-else type="info">无</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTable, ElTableColumn, ElTag } from 'element-plus'
import { useConfig } from '@/stores/config'

const { userLangs } = useConfig().config

const userLangsList = computed(() => {
  return Object.values(userLangs).filter(Boolean)
})
</script>

<style scoped>

</style>