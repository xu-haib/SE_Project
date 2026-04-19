<template>
  <el-dialog v-model="visible" :title="`提交代码 - ${problem.id}`" width="800" @close="resetForm" align-center append-to-body :z-index="1000">
    <el-form :model="form" label-width="auto">
      <el-form-item label="编程语言" required>
        <el-select
          v-model="form.lang"
          class="input-lang"
          placeholder="选择编程语言"
          size="large"
          filterable
        >
          <el-option
            v-for="item in codeLangs"
            :key="item!.id"
            :label="item!.description"
            :value="item!.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="代码编辑" required>
        <el-input
          v-model="form.code"
          :autosize="{ minRows: 10, maxRows: 12 }"
          class="input-code"
          type="textarea"
          placeholder="Your code here..."
        />
        <!-- <code-editor
          v-model="form.code"
          :language="form.lang"
          height="400px"
          :line-numbers="true"
        /> -->
      </el-form-item>

      <el-form-item label="或者">
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :on-change="handleCodeUpload"
          :show-file-list="false"
        >
          <el-button type="primary">
            <font-awesome-icon :icon="faUpload" class="mr-2" />
            上传代码文件
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitting"
          :disabled="!formValid"
        >
          <font-awesome-icon :icon="faPaperPlane" class="mr-2" />
          提交评测
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { ElDialog } from 'element-plus'

import { computed, reactive, ref } from 'vue'
import { faUpload, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
// import CodeEditor from '@/components/common/CodeEditor.vue'
import { useConfig } from '@/stores/config'
import { apiJudge } from '@/api'
import { find } from 'lodash-es'

import type { UploadFile } from 'element-plus'

import { useRouter } from 'vue-router'
import type { ContestId, Problem } from '@/interface'
import { useContest } from '@/stores/contest'

const router = useRouter()
const contestStore = useContest()

const props = defineProps<{
  problem: Problem
}>()

const visible = defineModel<boolean>({
  required: true,
})

const { codeLangs } = useConfig().config

const form = reactive({
  lang: '',
  code: '',
})

const submitting = ref(false)

// 表单验证
const formValid = computed(() => {
  return form.lang && form.code.trim().length > 0
})

// 重置表单
const resetForm = () => {
  form.lang = ''
  form.code = ''
}

// 处理代码文件上传
const handleCodeUpload = (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  const extension = getExtension(file.name)

  // 尝试根据文件扩展名自动设置语言
  if (!form.lang) {
    const matchedLang = find(codeLangs, (lang) => lang!.ext.includes(extension.toLowerCase()))
    if (matchedLang) {
      form.lang = matchedLang.id
    }
  }

  // 读取文件内容
  const reader = new FileReader()
  reader.onload = (e) => {
    form.code = (e.target?.result as string) || ''
  }
  reader.readAsText(file)
}

// 获取文件扩展名
function getExtension(fileName: string): string {
  const parts = fileName.split('.')
  return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : ''
}

// 处理提交
const handleSubmit = async () => {
  if (!formValid.value) {
    return
  }

  submitting.value = true

  try {
    const response = await apiJudge({
      problem: props.problem.id,
      lang: form.lang,
      code: form.code,
      contest: contestStore.currentContest === null ? undefined : contestStore.currentContest.id,
    })
    router.push(`/submission/${response.submission}`)

    visible.value = false
  } catch (error) {
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.input-lang {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.mr-2 {
  margin-right: 0.5rem;
}

.input-code {
  font-family: monospace;
}
</style>
