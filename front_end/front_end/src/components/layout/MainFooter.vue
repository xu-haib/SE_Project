<template>
  <!-- TODO: Rewrite the footer -->
  <el-footer height="150px" class="footer">
    <el-row :gutter="24">
      <el-col :span="8">
        <h3 class="title">友情链接</h3>
        <el-row>
          <el-col :span="8"> Luogu OJ </el-col>
          <el-col :span="8"> Hydro OJ </el-col>
          <el-col :span="8"> Codeforces </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"> Universal OJ </el-col>
          <el-col :span="8"> Libre OJ </el-col>
          <el-col :span="8"> QOJ </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"> VJudge </el-col>
          <!-- <el-col :span="8">
            
          </el-col>
          <el-col :span="8">
            
          </el-col> -->
        </el-row>
      </el-col>
      <el-col :span="8">
        <h3 class="title">关于我们</h3>
      </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="6"> 这里应该有一些备案信息，但因为我们没有备案所以什么也没写。 </el-col>
    </el-row>
  </el-footer>
</template>

<script setup lang="ts">
import { ElFooter, ElRow, ElCol } from 'element-plus'
</script>

<style lang="scss" scoped>
.footer {
  padding: 1em 4em;
  background: #1a1f2e;
  border-top: 1px solid rgba(79, 156, 249, 0.15);
  color: #64748b;
}

.title {
  font-weight: normal;
  margin-bottom: 0.5em;
  color: #94a3b8;
}
</style>
