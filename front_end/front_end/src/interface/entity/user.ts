import type { BaseModel, UserId } from './enum'

export enum Role {
  User = 1,
  Jury = 2,
  Admin = 3,
  Super = 4,
}

// 表：用户信息
export interface User extends BaseModel {
  id: UserId

  name: string
  role: Role
  avatar?: string
}
