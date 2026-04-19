<template>
  <div class="user-list">
    <div class="toolbar">
      <el-button type="primary" @click="handleCreate">新增用户</el-button>

      <div class="filter-list">
        <el-select
          v-model="filter.role"
          placeholder="用户权限"
          style="width: 120px; margin-left: 10px"
          clearable
          @change="handleSearch"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <el-option label="普通" :value="1" />
          <el-option label="教练" :value="2" />
          <el-option label="管理" :value="3" />
          <el-option label="超管" :value="4" />
        </el-select>

        <el-input
          v-model="filter.user"
          placeholder="用户名或 ID"
          style="width: 300px; margin-left: 10px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <font-awesome-icon :icon="faMagnifyingGlass" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </div>

    <el-table :data="users" v-loading="loading" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-tag :type="roleTagType(row.role)">
            {{ roleText(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="register" label="注册时间">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="total, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchUsers"
      @current-change="fetchUsers"
    />

    <!-- 编辑对话框 -->
    <el-dialog
      close-on-click-modal
      show-close
      :z-index="10"
      v-model="dialog"
      :title="create ? '创建用户' : '修改信息'"
    >
      <el-form v-if="form" :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form.role">
            <el-option label="普通" :value="1" />
            <el-option label="教练" :value="2" />
            <el-option label="管理" :value="3" />
            <el-option label="超管" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="头像">
          <el-upload action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess">
            <el-avatar :src="form.avatar" />
          </el-upload>
        </el-form-item>

        <template v-if="create">
          <el-form-item label="密码">
            <el-input
              v-model="password"
              placeholder="密码"
              type="password"
              show-password
              clearable
            />
          </el-form-item>
          <div class="button-container">
            <el-button type="danger" @click="doCreate">创建账号</el-button>
          </div>
        </template>
        <template v-else>
          <div class="button-container">
            <el-button type="primary" @click="doEdit">修改信息</el-button>
          </div>
          <el-divider />
          <el-form-item label="密码">
            <el-input
              v-model="password"
              placeholder="密码"
              type="password"
              show-password
              clearable
            />
          </el-form-item>
          <div class="button-container">
            <el-button type="danger" @click="doReset">重置密码</el-button>
          </div>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElForm,
  ElFormItem,
  ElButton,
  ElDialog,
  ElDivider,
  ElAvatar,
  ElUpload,
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElInput,
  ElPagination,
  type FormRules,
} from 'element-plus'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import { type User, type UserFilterParams } from '@/interface'
import { formatDate } from '@/utils/format'
import { apiCreate, apiReset, apiUserDelete, apiUserEdit, apiUserAll } from '@/api'
import Swal from 'sweetalert2'

const users = ref<User[]>([])
const loading = ref(false)

const filter = ref<UserFilterParams>({})

const pagination = ref({
  current: 1,
  size: 20,
  total: 0,
})

const dialog = ref(false)
const form = ref<User>()

const create = ref(false)

const password = ref('')

const roleText = (role: number) => {
  const roles = ['', '用户', '裁判', '管理', '超管']
  return roles[role] || '未知'
}

const roleTagType = (role: number) => {
  const types = ['', 'info', 'primary', 'warning', 'error']
  return types[role] || ''
}

const fetchUsers = async () => {
  loading.value = true
  try {
    // 调用 API 获取用户列表
    const res = await apiUserAll({
      page: pagination.value.current,
      // size: pagination.value.size,
      ...filter.value,
    })
    users.value = res.users
    pagination.value.total = res.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchUsers()
}

const handleCreate = () => {
  form.value = {
    id: 0,
    name: '',
    role: 1,
    avatar: '',
  }
  create.value = true
  dialog.value = true
}

const handleEdit = (user: User) => {
  form.value = user
  create.value = false
  dialog.value = true
}

const handleDelete = (user: User) => {
  Swal.fire({
    title: '确认删除吗？',
    text: '删除后将无法恢复！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed) {
      apiUserDelete({
        user: user.id
      }).then(fetchUsers)
    }
  })
}

const doCreate = () => {
  if (!form.value) return
  apiCreate({
    user: form.value,
    password: password.value,
  }).then(fetchUsers)
}

const doEdit = () => {
  if (!form.value) return
  apiUserEdit({
    user: form.value
  }).then(fetchUsers)
}

const doReset = () => {
  if (!form.value) return
  apiReset({
    user: form.value.id,
    oldPassword: '',
    newPassword: password.value,
  })
}

const handleAvatarSuccess = (res: any) => {
  // form.value.avatar = res.url
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
