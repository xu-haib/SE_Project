// 存放在数据库中
export type ContestId = number
export type ProblemId = number
export type SubmissionId = number
export type TagId = number
export type TagClassifyId = number
export type UserId = number

// 配置文件，存放在 JSON 文件中
export type UserLangId = string
export type CodeLangId = string
export type VerdictId = string

export type ProblemLabel = string

export interface BaseModel {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}