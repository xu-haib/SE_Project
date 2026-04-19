<template>
  <div class="editor-container">
    <div class="lang-select-container">
      <el-select v-model="currentLang" style="width: 150px; margin-right: 1em">
        <el-option
          v-for="(userLang, id) of config.config.userLangs"
          :key="id"
          :value="id"
          :label="userLang!.description"
        />
      </el-select>

      <el-button :loading="saving" type="danger" v-if="currentLang" @click="deleteStatement">
        删除
      </el-button>
    </div>

    <el-divider />

    <template v-if="currentLang">
      <template v-if="CStatement">
        <el-form :label-width="100" label-position="left">
          <el-form-item label="标题">
            <el-input v-model="CTitle" />
          </el-form-item>

          <problem-edit-part label="题目背景" v-model="CStatement.background" />
          <problem-edit-part label="题目描述" v-model="CStatement.legend" />
          <problem-edit-part label="输入格式" v-model="CStatement.formatI" />
          <problem-edit-part label="输出格式" v-model="CStatement.formatO" />

          <el-form-item v-for="(exapmle, id) in CStatement.examples" :key="id">
            <template #label>
              <div>
                {{ `样例组 #${id + 1}` }}
                <font-awesome-icon :icon="faXmark" @click="deleteExample(id)" />
              </div>
            </template>

            <div class="example-container">
              <el-input
                type="textarea"
                v-model="exapmle.dataI"
                :autosize="{ minRows: 5, maxRows: 10 }"
                resize="none"
              />
              <el-input
                type="textarea"
                v-model="exapmle.dataO"
                :autosize="{ minRows: 5, maxRows: 10 }"
                resize="none"
              />
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              plain
              @click="CStatement.examples.push({ dataI: '', dataO: '' })"
              >新建样例</el-button
            >
          </el-form-item>

          <problem-edit-part label="提示" v-model="CStatement.hint" />
        </el-form>

        <el-button :loading="saving" type="primary" @click="saveStatement"> 保存 </el-button>
      </template>
      <template v-else>
        <el-form>
          <el-form-item label="标题">
            <el-input v-model="CTitle" />
          </el-form-item>
        </el-form>

        <el-button type="primary" @click="createStatement"> 创建 </el-button>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Problem, Statement } from '@/interface'
import ProblemEditPart from './ProblemEditPart.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElDivider } from 'element-plus'
import { ref, watch } from 'vue'

import { useConfig } from '@/stores/config'
import { cloneDeep, remove } from 'lodash-es'
import { apiProblemEdit } from '@/api'

import Swal from 'sweetalert2'

const config = useConfig()

const problem = defineModel<Problem>({
  required: true,
})

const currentLang = ref<string | undefined>(undefined)
const CStatement = ref<Statement | undefined>(undefined)
const CTitle = ref<string | undefined>(undefined)

const saving = ref(false)

function createStatement() {
  if (!currentLang.value) return
  CStatement.value = { examples: [] }
}

function deleteStatement() {
  if (!currentLang.value) return

  Swal.fire({
    title: '确认删除吗？',
    text: '删除后将无法恢复！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (!currentLang.value) return
    if (result.isConfirmed) {
      delete problem.value.title[currentLang.value]
      delete problem.value.statements[currentLang.value]
      CStatement.value = problem.value.statements[currentLang.value]
      saveProblem()
    }
  })
}

function saveStatement() {
  if (!currentLang.value || CTitle.value === undefined || CStatement.value === undefined) return
  problem.value.title[currentLang.value] = CTitle.value
  problem.value.statements[currentLang.value] = cloneDeep(CStatement.value)

  saveProblem()
}

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

function deleteExample(id: number) {
  if (!CStatement.value) return
  remove(CStatement.value.examples, (_value, index) => index === id)
}

watch(currentLang, () => {
  if (!currentLang.value) return

  CStatement.value = problem.value.statements[currentLang.value]
  CTitle.value = problem.value.title[currentLang.value]
})

const keyList: ['background' | 'formatI' | 'formatO', string][] = [
  ['background', '题目背景'],
  ['formatI', '输入格式'],
  ['formatO', '输出格式'],
]
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
