<template>
  <div class="submission-detail-main">
    <!-- 主内容标签页 -->
    <el-tabs v-model="activeTab" class="detail-tabs">
      <template v-if="submission">
        <!-- 编译信息标签页 -->
        <el-tab-pane label="编译信息" name="compile">
          <div v-if="submission.compile" class="compile-info">
            <el-alert
              :type="submission.compile.success ? 'success' : 'error'"
              :title="submission.compile.success ? '编译成功' : '编译错误'"
              :closable="false"
            />
            <pre class="compile-message">{{ submission.compile.message }}</pre>
          </div>
          <el-empty v-else description="暂无编译信息" />
        </el-tab-pane>

        <!-- 测试点信息标签页 -->
        <el-tab-pane label="测试点" name="testcases">
          <div class="testcase-container">
            <div v-for="(testcase, index) in submission.detail" :key="index" class="testcase-item">
              <!-- Juding -->
              <template v-if="testcase.verdict === 'JD' || testcase.verdict === 'PD'">
                <div
                  class="testcase-badge pending"
                  v-loading="true"
                  element-loading-svg-view-box="0, 0, 50, 50"
                  element-loading-background="transparent"
                />
              </template>
              <template v-else>
                <div
                  class="testcase-badge"
                  :style="{ backgroundColor: `${verdicts[testcase.verdict]?.color ?? '#0E1D69'}` }"
                  @click="showTestcase(testcase, index)"
                >
                  <span class="testcase-id">#{{ index + 1 }}</span>
                  <span class="testcase-verdict">{{ verdicts[testcase.verdict]?.abbr ?? 'UKE' }}</span>
                  <span class="testcase-meta">
                    <span v-if="testcase.time !== undefined">{{ testcase.time }}ms</span>
                    <span v-if="testcase.memory !== undefined">{{
                      formatMemory(testcase.memory)
                    }}</span>
                  </span>
                </div>
              </template>
            </div>
          </div>
        </el-tab-pane>

        <!-- 代码展示标签页 -->
        <el-tab-pane label="代码" name="code">
          <div class="code-container">
            <div class="code-meta">
              <span>语言: {{ codeLangs[submission.lang]?.description || '未知语言' }}</span>
              <span>代码长度: {{ submission.length }} bytes</span>
            </div>
            <pre class="code-content"><code>{{ submission.code }}</code></pre>
          </div>
        </el-tab-pane>
      </template>
      <template v-else>
        <div v-if="loading" v-loading="true" style="height: 300px" />
        <el-empty v-else description="未查询到记录" />
      </template>
    </el-tabs>

    <el-dialog
      v-model="testcaseDialogVisible"
      :title="`测试点 #${selectedTestcaseIndex + 1} 详情`"
      width="800"
    >
      <div v-if="selectedTestcase" class="testcase-detail">
        <el-descriptions :column="4" border>
          <el-descriptions-item label="状态">
            <verdict-tag :verdict="selectedTestcase.verdict" />
          </el-descriptions-item>
          <el-descriptions-item label="用时">{{ selectedTestcase.time }}ms</el-descriptions-item>
          <el-descriptions-item label="内存">{{
            formatMemory(selectedTestcase.memory)
          }}</el-descriptions-item>
          <el-descriptions-item label="得分" v-if="selectedTestcase.score !== undefined">
            {{ selectedTestcase.score }}分
          </el-descriptions-item>
        </el-descriptions>

        <div class="details">
          <h3>输入摘要</h3>
          <pre class="testcase-data">{{ selectedTestcase.input }}</pre>
          <h3>输出摘要</h3>
          <pre class="testcase-data">{{ selectedTestcase.output }}</pre>
          <h3>校验信息</h3>
          <pre class="testcase-data">{{ selectedTestcase.checker }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import {
  ElTabs,
  ElTabPane,
  ElAlert,
  ElEmpty,
  ElDialog,
  ElDescriptions,
  ElDescriptionsItem,
} from 'element-plus'
import type { SubmissionFull, Testcase } from '@/interface'

import VerdictTag from '../common/VerdictTag.vue'

import { useConfig } from '@/stores/config'

import { formatMemory } from '@/utils/format'

const { verdicts, codeLangs } = useConfig().config

const props = defineProps<{
  submission: null | SubmissionFull
  loading: boolean
}>()

const activeTab = ref('testcases')
const testcaseDialogVisible = ref(false)
const selectedTestcase = ref<Testcase | null>(null)
const selectedTestcaseIndex = ref(0)

function showTestcase(testcase: Testcase, index: number) {
  selectedTestcase.value = testcase
  selectedTestcaseIndex.value = index
  testcaseDialogVisible.value = true
}

watchEffect(() => {
  if (props.submission) {
    if (props.submission.compile?.success === false) {
      activeTab.value = 'compile'
    } else if (props.submission.verdict === 'JD') {
      // 评测中显示测试点标签页
      activeTab.value = 'testcases'
    }
  }
})
</script>

<style scoped lang="scss">
.submission-detail-main {
  flex: 1;
  min-width: 0;
}

.submission-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color);

  h2 {
    margin: 0 0 10px 0;
    font-size: 1.5em;
  }

  .meta-info {
    display: flex;
    align-items: center;
    gap: 15px;

    .time,
    .memory {
      font-size: 0.9em;
      color: var(--el-text-color-secondary);
    }
  }
}

.detail-tabs {
  :deep(.el-tabs__content) {
    padding: 0 10px;
  }
}

.compile-info {
  .compile-message {
    margin-top: 15px;
    padding: 10px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    white-space: pre-wrap;
    font-family: monospace;
    line-height: 1.5;
  }
}

.testcase-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6em, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.testcase-item {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.testcase-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;

  padding: 10px;
  border-radius: 4px;
  color: white;
  text-align: center;

  width: 6.5em;
  height: 6.5em;

  &.pending {
    background-color:#14558f;

    &::v-deep(.circular .path) {
      stroke-width: 4;
      stroke: white;
    }
  }

  .testcase-id {
    position: absolute;
    top: 0;
    left: 0;
    padding: 6px;

    font-size: small;
    opacity: 0.8;
  }

  .testcase-verdict {
    font-size: larger;
    font-weight: normal;
    margin: 5px 0;
  }

  .testcase-meta {
    font-size: small;
    font-weight: bold;
    opacity: 0.8;
    display: flex;
    gap: 5px;
  }
}

.code-container {
  .code-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.9em;
    color: var(--el-text-color-secondary);
  }

  .code-content {
    margin: 0;
    padding: 15px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
    line-height: 1.5;
  }
}

.testcase-detail {
  .testcase-data {
    margin: 0;
    padding: 15px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
    font-family: monospace;
    line-height: 1.5;
    white-space: pre-wrap;
  }
}

.details {
  margin-top: 1em;
}
</style>
