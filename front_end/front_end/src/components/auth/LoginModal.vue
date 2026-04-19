<template>
  <el-dialog v-model="showLogin" :show-close="false" width="450px" @close="doClose">
    <template #header>
      <el-alert v-if="loginError" :title="loginError" type="error" :closable="false" show-icon />
    </template>
    <el-tabs v-model="activeTab" stretch>
      <el-tab-pane label="登录" name="login">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名" clearable />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              type="password"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.remember"> 7天内自动登录 </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              :loading="loginLoading"
              style="width: 100%"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="注册" name="register">
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="用户名" clearable />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              placeholder="密码"
              type="password"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              placeholder="确认密码"
              type="password"
              show-password
              clearable
            />
          </el-form-item>

          <el-alert
            v-if="registerError"
            :title="registerError"
            type="error"
            :closable="false"
            show-icon
          />

          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              :loading="registerLoading"
              style="width: 100%"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="activeTab === 'login'" type="primary" link @click="activeTab = 'register'">
          没有账号？立即注册
        </el-button>
        <el-button v-else type="primary" link @click="activeTab = 'login'">
          已有账号？立即登录
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'

import { ElForm, ElFormItem, ElInput, ElDialog, ElTabs, ElTabPane } from 'element-plus'

const authStore = useAuth()
const showLogin = ref(false)

// 模态框状态
const activeTab = ref<'login' | 'register'>('login')

// 登录相关
const loginFormRef = ref<FormInstance>()
const loginLoading = ref(false)
const loginError = ref('')
const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
})

// 注册相关
const registerFormRef = ref<FormInstance>()
const registerLoading = ref(false)
const registerError = ref('')
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 验证规则
const validatePasswordConfirm = (
  rule: unknown,
  value: string,
  callback: (error?: string | Error | undefined) => void,
) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' },
  ],
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePasswordConfirm, trigger: 'blur' },
  ],
}

// 切换标签页时重置错误
watch(activeTab, () => {
  loginError.value = ''
  registerError.value = ''
})

function doClose() {
  authStore.setRedirectUrl(null)
}

// 登录处理
const handleLogin = async () => {
  try {
    loginError.value = ''
    await loginFormRef.value?.validate()
    loginLoading.value = true
    await authStore.login(loginForm)
    showLogin.value = false
  } catch (error: unknown) {
    if (error instanceof Error) {
      // 如果包含 Axios 错误信息结构
      const maybeAxiosError = error as { response?: { data?: { message?: string } } }
      loginError.value =
        maybeAxiosError.response?.data?.message || error.message || '登录失败，请稍后重试'
    } else {
      loginError.value = '登录失败，请稍后重试'
    }
  } finally {
    loginLoading.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  try {
    registerError.value = ''
    await registerFormRef.value?.validate()

    registerLoading.value = true
    await authStore.register({
      username: registerForm.username,
      password: registerForm.password,
    })

    activeTab.value = 'login'
    loginForm.username = registerForm.username
    registerForm.password = ''
    registerForm.confirmPassword = ''
  } catch (error: unknown) {
    if (error instanceof Error) {
      const maybeAxiosError = error as { response?: { data?: { message?: string } } }
      registerError.value =
        maybeAxiosError.response?.data?.message || error.message || '注册失败，请稍后重试'
    } else {
      registerError.value = '注册失败，请稍后重试'
    }
  } finally {
    registerLoading.value = false
  }
}

onMounted(() => {
  authStore.show = (tab: 'login' | 'register' = 'login') => {
    activeTab.value = tab
    showLogin.value = true
  }
  authStore.hide = () => {
    showLogin.value = false
  }
})
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>
