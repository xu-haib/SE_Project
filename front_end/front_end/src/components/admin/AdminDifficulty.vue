<template>
  <div class="config-container">
    <el-table :data="difficulties" border style="width: 100%">
      <el-table-column prop="name" label="难度名称" width="180" />
      <el-table-column prop="min" label="难度下界" />
      <el-table-column prop="max" label="难度上界" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from '@/stores/config'

const { difficulties } = useConfig().config
</script>

<style scoped lang="scss">

</style>