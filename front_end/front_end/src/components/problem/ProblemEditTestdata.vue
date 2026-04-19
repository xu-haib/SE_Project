<template>
  <div class="testdata-container">
    <el-upload
      class="upload-testdata"
      drag
      :limit="1"
      :before-upload="beforeDataUpload"
      :auto-upload="true"
      :http-request="uploadData"
    >
      <font-awesome-icon :icon="faCloudArrowUp" size="2x" />
      <div class="el-upload__text">将数据包拖拽至此处，或者<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">数据包应为zip格式，大小不超过200MB</div>
      </template>
    </el-upload>

    <el-divider />

    <div class="data-actions">
      <el-button type="primary" :loading="downloadingData" @click="downloadData">
        下载当前数据包
      </el-button>
      <el-button type="danger" :loading="deletingData" @click="deleteData"> 删除数据包 </el-button>
    </div>

    <el-alert
      title="配置文件说明"
      type="info"
      :closable="false"
      description="配置文件为YAML格式，用于定义测试数据的评分规则、时间限制等。"
      class="mb-4"
    />

    <!-- <el-upload
      class="upload-config"
      drag
      :limit="1"
      :auto-upload="true"
      :on-success="handleConfigUploadSuccess"
      :on-error="handleUploadError"
      :before-upload="beforeConfigUpload"
      :action="uploadConfigUrl"
      :headers="headers"
      :data="{ problem: problem.id }"
    >
      <font-awesome-icon :icon="faFileLines" size="2x" />
      <div class="el-upload__text">
        将配置文件拖拽至此处，或者<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          配置文件应为config.yml，大小不超过1MB
        </div>
      </template>
    </el-upload>

    <el-divider /> -->

    <!-- <div class="config-actions">
      <el-button 
        type="primary" 
        :loading="downloadingConfig" 
        @click="downloadConfig"
      >
        下载当前配置文件
      </el-button>
      <el-button 
        type="info" 
        :loading="viewingConfig" 
        @click="viewConfig"
      >
        查看配置详情
      </el-button>
    </div>

    <el-divider />

    <div v-if="configContent" class="config-preview">
      <h4>当前配置预览</h4>
      <pre>{{ configContent }}</pre>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import {
  ElUpload,
  ElButton,
  ElTabs,
  ElTabPane,
  ElDivider,
  ElAlert,
  ElMessage,
  type UploadRequestOptions,
} from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCloudArrowUp, faFileLines } from '@fortawesome/free-solid-svg-icons'
import type { Problem, TestdataUploadRequest } from '@/interface'
import { computed, ref } from 'vue'
import { useAuth } from '@/stores/auth'
import { apiTestdataDownload, apiTestdataDelete, apiTestdataUpload } from '@/api'

const authStore = useAuth()
const problem = defineModel<Problem>({ required: true })

const downloadingData = ref(false)
const deletingData = ref(false)
const configContent = ref<string | null>(null)

const headers = computed(() => ({
  Authorization: `Bearer ${authStore.currentToken}`,
}))

const beforeDataUpload = (file: File) => {
  const isZip = file.type === 'application/zip' || file.name.endsWith('.zip')
  const isLt200M = file.size / 1024 / 1024 < 50

  if (!isZip) {
    ElMessage.error('数据包必须是 ZIP 格式！')
    return false
  }
  if (!isLt200M) {
    ElMessage.error('数据包大小不能超过 50MB！')
    return false
  }
  return true
}

const beforeConfigUpload = (file: File) => {
  const isYaml =
    file.type === 'text/yaml' || file.name.endsWith('.yml') || file.name.endsWith('.yaml')
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isYaml) {
    ElMessage.error('配置文件必须是YAML格式!')
    return false
  }
  if (!isLt1M) {
    ElMessage.error('配置文件大小不能超过1MB!')
    return false
  }
  return true
}

const uploadData = async (options: UploadRequestOptions) => {
  const req: TestdataUploadRequest = {
    file: options.file,
    problem: problem.value.id,
  }

  await apiTestdataUpload(req)
}

const downloadData = async () => {
  downloadingData.value = true
  try {
    const response = await apiTestdataDownload({ problem: problem.value.id })
    if (response.url) {
      window.open(response.url, '_blank')
    }
  } finally {
    downloadingData.value = false
  }
}

const deleteData = async () => {
  deletingData.value = true
  try {
    await apiTestdataDelete({ problem: problem.value.id })
  } finally {
    deletingData.value = false
  }
}
</script>

<style lang="scss" scoped>
.testdata-container {
  padding: 20px;

  .upload-testdata,
  .upload-config {
    margin-bottom: 20px;

    .el-upload {
      width: 100%;
    }

    .el-upload-dragger {
      padding: 40px 20px;
      width: 100%;
    }

    .el-upload__text {
      margin-top: 10px;
    }

    .el-upload__tip {
      margin-top: 10px;
      color: var(--el-text-color-secondary);
    }
  }

  .data-actions,
  .config-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .config-preview {
    margin-top: 20px;
    padding: 15px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
