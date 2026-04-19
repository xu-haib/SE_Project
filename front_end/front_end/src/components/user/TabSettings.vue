<template>
  <div class="settings-tab">
    <el-card>
      <el-row :gutter="48">
        <el-col :span="12" class="safety">
          <h3>账号设置</h3>
          <el-form label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="form.username" />
            </el-form-item>

            <!-- <el-form-item label="电子邮箱">
              <el-input v-model="form.email" />
              <el-button size="small" type="text">验证邮箱</el-button>
            </el-form-item> -->

            <el-form-item>
              <el-button type="primary" @click="doUpdateProfile">保存更改</el-button>
            </el-form-item>
          </el-form>

          <h3>密码安全</h3>
          <el-form label-width="80px">
            <el-form-item label="当前密码">
              <el-input v-model="password.old" type="password" />
            </el-form-item>

            <el-form-item label="新密码">
              <el-input v-model="password.new" type="password" />
            </el-form-item>

            <el-form-item label="确认密码">
              <el-input v-model="password.confirm" type="password" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="doUpdatePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
          
          <h3>账号安全</h3>
          <el-form label-width="80px">
            <el-form-item>
              <el-button type="danger" @click="doLogout">退出登录</el-button>
              <!-- <el-button type="danger" @click="doLogout">注销账号</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="12" class="avatar-upload">
          <el-avatar :size="150" :src="avatarUrl" />
          <el-upload
            action="/api/image/avatar"
            :show-file-list="false"
            :http-request="handleUpload"
            accept="image/*"
          >
            <el-button type="primary">上传新头像</el-button>
          </el-upload>
          <p class="tip">支持 JPG/PNG 格式，大小不超过 2MB</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElMessage,
  ElAvatar,
  ElUpload,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  ElCard,
  type UploadRequestOptions,
} from 'element-plus'
import type { AvatarUploadResponse, User } from '@/interface'
import { apiAvatarUpload, apiLogout, apiUserEdit } from '@/api';

import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';

const auth = useAuth();
const router = useRouter();

const props = defineProps<{
  user: User
}>()

const form = ref({
  username: props.user.name,
  email: 'user@example.com',
})

const password = ref({
  old: '',
  new: '',
  confirm: '',
})

const avatarUrl = ref(props.user.avatar)

function doLogout() {
  auth.logout().then(() => {
    router.push(`/`)
  })
}

const uploading = ref(false)

// 处理上传逻辑
const handleUpload = async (options: UploadRequestOptions) => {
  const { file } = options

  uploading.value = true
  apiAvatarUpload({
    file: file
  }).then((response) => {
    avatarUrl.value = response.path
  }) .finally(() => {
    uploading.value = false
  })
}

function doUpdateProfile() {
  // apiUserEdit({})
}

function doUpdatePassword() {
  ElMessage.success('密码已修改')
}

</script>

<style lang="scss" scoped>
.settings-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: 8px;

  h3 {
    margin-bottom: 0.5em;
  }
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .el-avatar {
    margin-bottom: 20px;
  }

  .tip {
    margin-top: 10px;
    color: var(--el-text-color-secondary);
    font-size: 0.9em;
  }
}
</style>
