import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiLogin, apiLogout, apiRegister, apiMe } from '@/api/auth'
import type { LoginRequest, RegisterRequest, User } from '@/interface'
import { useContest } from './contest'

export const useAuth = defineStore('auth', () => {
  const router = useRouter()
  const contestStore = useContest()

  const currentUser = ref<User | null>(null)
  const currentToken = ref<string | null>(null) // 不再直接初始化，由 initialize() 处理

  const pendingRedirect = ref<string | null>(null)
  const isInitialized = ref(false)
  const isAuthenticated = computed(() => !!currentToken.value)

  // 从 localStorage 或 sessionStorage 读取 token
  const fetchToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  // 保存 token 到存储
  const persistToken = (token: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('token', token)
    } else {
      sessionStorage.setItem('token', token)
    }
  }

  // 清除所有 token 存储
  const dropToken = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  }

  const setRedirectUrl = (url: string | null) => {
    pendingRedirect.value = url
  }

  const show = ref((tab: 'login' | 'register' = 'login') => {})
  const hide = ref(() => {})

  const login = async (requestBody: LoginRequest) => {
    const response = await apiLogin(requestBody)
    currentToken.value = response.token
    currentUser.value = response.user
    persistToken(response.token, !!requestBody.remember)
    contestStore.refresh()

    if (pendingRedirect.value) {
      router.push(pendingRedirect.value)
      pendingRedirect.value = null
    }
  }

  const register = async (requestBody: RegisterRequest) => {
    await apiRegister(requestBody)
  }

  const logout = async () => {
    await apiLogout({})
    currentToken.value = null
    currentUser.value = null
    dropToken()
    contestStore.refresh()
  }

  // 初始化：加载 token 并获取用户信息
  const initialize = async () => {
    const token = fetchToken()
    if (token) {
      try {
        currentToken.value = token
        const res = await apiMe({}) // 根据 token 获取用户信息
        currentUser.value = res.user
      } catch (error) {
        // Token 无效时清理
        dropToken()
        currentToken.value = null
      }
    }
    isInitialized.value = true
  }

  return {
    currentUser,
    currentToken,
    isInitialized,
    isAuthenticated,
    setRedirectUrl,
    show,
    hide,
    login,
    logout,
    register,
    initialize,
  }
})
