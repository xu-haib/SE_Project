<template>
  <div class="config-list">
    <div class="toolbar">
      <el-button type="primary" @click="handleCreate">新增标签</el-button>
      <el-button @click="handleImport">导入</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>

    <el-table :data="tags" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="标签名" />
      <el-table-column prop="classify" label="分类">
        <template #default="{ row }">
          {{ getClassifyName(row.classify) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标签名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.classify">
            <el-option
              v-for="classify in tagClassifies"
              :key="classify.id"
              :label="classify.name"
              :value="classify.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importVisible" title="导入配置">
      <el-upload
        action="/api/config/import"
        :before-upload="beforeImport"
        :on-success="handleImportSuccess"
        :show-file-list="false"
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElCard } from 'element-plus'
import type { Tag, TagClassify } from '@/interface'

const tags = ref<Tag[]>([])
const tagClassifies = ref<TagClassify[]>([])
const dialogVisible = ref(false)
const importVisible = ref(false)
const dialogTitle = ref('')
const form = ref({
  id: 0,
  name: '',
  classify: 0,
})

const getClassifyName = (id: number) => {
  const classify = tagClassifies.value.find((c) => c.id === id)
  return classify?.name || '未知'
}

const fetchTags = async () => {
  try {
    // const res = await getTags()
    // tags.value = res.data
  } catch (error) {
    ElMessage.error('获取标签失败')
  }
}

const fetchTagClassifies = async () => {
  try {
    // const res = await getTagClassifies()
    // tagClassifies.value = res.data
  } catch (error) {
    ElMessage.error('获取标签分类失败')
  }
}

const handleCreate = () => {
  dialogTitle.value = '新增标签'
  form.value = {
    id: 0,
    name: '',
    classify: tagClassifies.value[0]?.id || 0,
  }
  dialogVisible.value = true
}

const handleEdit = (tag: Tag) => {
  dialogTitle.value = '编辑标签'
  form.value = { ...tag }
  dialogVisible.value = true
}

const handleDelete = (tag: Tag) => {
  ElMessageBox.confirm(`确定删除标签 "${tag.name}"?`, '提示', {
    type: 'warning',
  }).then(async () => {
    try {
      // await deleteTag(tag.id)
      ElMessage.success('删除成功')
      fetchTags()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleImport = () => {
  importVisible.value = true
}

const handleExport = async () => {
  try {
    // const res = await exportTags()
    // 下载文件
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const beforeImport = (file: File) => {
  // 验证文件格式
  return true
}

const handleImportSuccess = () => {
  ElMessage.success('导入成功')
  importVisible.value = false
  fetchTags()
}

const submitForm = async () => {
  try {
    if (form.value.id) {
      // await updateTag(form.value)
      ElMessage.success('更新成功')
    } else {
      // await createTag(form.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchTags()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchTags()
  fetchTagClassifies()
})
</script>
