import type { Role, User, UserId } from '../entity'

export interface UserRequest {
  user: UserId
}

export interface UserResponse {
  user: User
}

export interface AvatarUploadRequest {
  file: File
}

export interface AvatarUploadResponse {
  path: string
}

export type UserListRequest = UserFilterQuery

export interface UserListResponse {
  total: number
  users: User[]
}

export interface UserFilterParams {
  user?: string
  role?: Role
}

export type UserFilterQuery = UserFilterParams & {
  page?: number
}

// 修改用户基本信息
export interface UserEditRequest {
  user: User
}

// 应答创建后的用户（补全缺失信息）
export interface UserEditResponse {
  user: User
}

// 删除用户
export interface UserDeleteRequest {
  user: UserId
}

export interface UserDeleteResponse {}
