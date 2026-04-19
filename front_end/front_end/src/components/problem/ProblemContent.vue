<template>
  <el-card class="problem-container">
    <template v-if="problem && statement">
      <!-- 题目基本信息 -->
      <div class="problem-header">
        <h1 class="problem-title">
          {{ title || '暂无数据' }}
        </h1>
        <div class="problem-meta">
          <span class="time-limit">时间限制: {{ formatTimeShort(problem.limitTime) }}</span>
          <span class="memory-limit">内存限制: {{ formatMemory(problem.limitMemory) }}</span>
          <span class="problem-type">{{ formatProblemType(problem.type) }}</span>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="problem-content">
        <!-- 题目背景 -->
        <div v-if="statement.background" class="problem-section">
          <h2 class="section-title">题目背景</h2>
          <md-render :content="statement.background" />
        </div>

        <!-- 题目描述 -->
        <div v-if="statement.legend" class="problem-section">
          <h2 class="section-title">题目描述</h2>
          <md-render :content="statement.legend" />
        </div>

        <!-- 输入格式 -->
        <div v-if="statement.formatI" class="problem-section">
          <h2 class="section-title">输入格式</h2>
          <md-render :content="statement.formatI" />
        </div>

        <!-- 输出格式 -->
        <div v-if="statement.formatO" class="problem-section">
          <h2 class="section-title">输出格式</h2>
          <md-render :content="statement.formatO" />
        </div>

        <!-- 样例 -->
        <div v-if="statement.examples && statement.examples.length > 0" class="problem-section">
          <h2 class="section-title">样例</h2>
          <div v-for="(example, index) in statement.examples" :key="index" class="example">
            <el-row :gutter="8">
              <el-col :span="12" class="data">
                <h3>
                  输入 #{{ index + 1 }}
                  <a
                    href="#"
                    @click.prevent="copyText(index + 1, example.dataI || '')"
                    class="copy-link"
                  >
                    <font-awesome-icon v-if="copied != index + 1" :icon="faCopy" />
                    <font-awesome-icon v-else :icon="faCheck" />
                  </a>
                </h3>
                <pre v-if="example.dataI">{{ example.dataI }}</pre>
              </el-col>
              <el-col :span="12" class="data">
                <h3>
                  输出 #{{ index + 1 }}
                  <a
                    href="#"
                    @click.prevent="copyText(-index - 1, example.dataO || '')"
                    class="copy-link"
                  >
                    <font-awesome-icon v-if="copied != -index - 1" :icon="faCopy" />
                    <font-awesome-icon v-else :icon="faCheck" />
                  </a>
                </h3>
                <pre v-if="example.dataO">{{ example.dataO }}</pre>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 提示 -->
        <div v-if="statement.hint" class="problem-section">
          <h2 class="section-title">提示</h2>
          <md-render :content="statement.hint" />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="loading" v-loading="true" style="height: 200px" />
      <el-empty v-else description="暂无题面" />
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MdRender from '../common/MdRender.vue'

import { ElRow, ElCol, ElEmpty, ElCard } from 'element-plus'
import { faCopy, faCheck, faLanguage, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import type { Problem, UserLangId } from '@/interface'
import { formatMemory, formatProblemType, formatTimeShort } from '@/utils/format'

import { useConfig } from '@/stores/config'

const props = defineProps<{
  problem: Problem | null
  loading: boolean
}>()

const configStore = useConfig()

function getLang() {
  if (props.problem !== null) {
    const keys = Object.keys(props.problem.statements)
    if (keys.length !== 0) {
      if (!(configStore.userLang in keys)) {
        return keys[0]
      }
    }
  }
  return configStore.userLang
}

const statementLang = ref<UserLangId>(getLang())

const statement = computed(() => props.problem?.statements[statementLang.value])
const title = computed(() => props.problem?.title[statementLang.value] || '暂无题面')

const copied = ref(0)

const copyText = async (index: number, text: string) => {
  await navigator.clipboard.writeText(text)
  copied.value = index
  setTimeout(() => {
    if (copied.value == index) copied.value = 0
  }, 1000)
}
</script>

<style lang="scss" scoped>
.problem-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;

  > .problem {
    &-title {
      margin-bottom: 10px;
      color: #1a1a1a;
    }
    &-meta {
      margin-bottom: 10px;
      span {
        margin: 0 10px;
      }
    }
  }
}

.functions {
  position: absolute;
  top: 0;
  right: 0;
}

.problem-content {
  text-align: left;

  .problem- {
    &-stats {
      color: #666;
      span {
        margin: 0 10px;
      }
    }

    &-section {
      margin-bottom: 30px;
    }
  }
  .section-title {
    margin-bottom: 15px;
    color: #1a1a1a;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 5px;
  }
}

.example {
  margin-bottom: 20px;
  overflow: hidden;

  h3 {
    background-color: #f5f5f5;
    padding: 4px 10px;
    margin: 0;
    font-size: medium;
    border-bottom: 1px solid #e0e0e0;

    > .copy-link {
      float: right;
      text-decoration: underline;
      cursor: pointer;
      margin-left: 10px;
    }
  }
  data {
    padding: 4px;
  }
}

pre {
  margin: 0;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 3px;
  overflow-x: auto;
}
</style>
