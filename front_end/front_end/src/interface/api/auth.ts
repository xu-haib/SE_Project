import type { User, UserId } from '../entity'

export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  user: User
}

// 已携带 Cookie，不需要额外参数
export interface LogoutRequest {}

// 登出后不进行任何操作
export interface LogoutResponse {}

export interface RegisterRequest {
  username: string
  password: string
}

// 注册后自动切换至登录界面，不需要返回任何东西
export interface RegisterResponse {}

// 获取当前用户信息
export interface MeRequest {}

// 返回当前用户信息
export interface MeResponse {
  user: User
}

// 创建用户包含其他字段
export interface CreateRequest {
  user: User
  password: string
}

export interface CreateResponse {}

// 重置密码
export interface ResetRequest {
  user: UserId
  oldPassword: string
  newPassword: string
}

export interface ResetResponse {}
