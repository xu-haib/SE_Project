import type { Problem, ProblemCore, ProblemId, Judgement, TagId, UserId, ProblemCoreWithJudgements } from '../entity'

export interface ProblemListRequest extends ProblemFilterParams {
  size?: number
  page?: number
}

export interface ProblemListResponse {
  total: number
  problems: ProblemCoreWithJudgements[]
}

export interface ProblemAllRequest extends ProblemFilterParams {
  size?: number
  page?: number
}

export interface ProblemAllResponse {
  total: number
  problems: ProblemCore[]
}

export interface ProblemFilterParams {
  minDifficulty?: number
  maxDifficulty?: number
  tags?: TagId[]
  keywords?: string
  status?: string
  provider?: UserId
}

export interface ProblemRequest {
  problem: ProblemId
  user?: UserId
}

export interface ProblemResponse {
  problem: Problem
  judgement?: Judgement
}

// 如果 problem.id 为 0，则为创建题面
export interface ProblemEditRequest {
  problem: Problem
}

// 应答创建后的题面（补全缺失信息）
export interface ProblemEditResponse {
  problem: Problem
}

export interface ProblemDeleteRequest {
  problem: ProblemId
}

export interface ProblemDeleteResponse {
}

export interface ProblemSolvedRequest {
  problem: ProblemId
  user: UserId
}

export interface ProblemSolvedResponse {
  problems: Problem[]
}
