import type { ContestId, ProblemId, ProblemLabel, BaseModel, UserId } from './enum'
import type { Judgement } from './judge'

export type ContestDifficulty = 1 | 2 | 3 | 4 | 5
export type ContestStatus = 'private' | 'public' | 'deleted'
export type ContestRule = 'OI' | 'ACM' | 'IOI'

// 表：比赛基本信息
export interface Contest extends BaseModel {
  id: ContestId
  title: string
  banner?: string // 头图 URL
  summary: string // 简介
  description: string // 详情
  difficulty: ContestDifficulty // 难度星级
  status: ContestStatus
  startTime: Date
  endTime: Date
  rule: ContestRule
  problems: Record<ProblemLabel, ProblemId>
}

// 用于比赛列表
export interface ContestWithSignup extends Contest {
  signups?: Signup[]
}

// 表：比赛报名信息
export interface Signup {
  contest: ContestId
  user: UserId
  stamp: Date
}

export interface ACMCell {
  isFirst: boolean,   // 是否为一血
  isSolved: boolean,  // 是否已通过
  attemptBF: number,  // 封榜前尝试次数
  attemptAF: number,  // 封榜后尝试次数
  penalty: number,  // 罚时
}

export interface ACMDetail {
  type: 'ACM',
  totalPenalty: number, // 总罚时
  totalSolved: number,  // 总通过数

  problems: Record<ProblemId, ACMCell>
}

export interface OIDetail {
  type: 'OI',
  totalScore: number,

  problems: Record<ProblemId, {
    score: number,
  }>
}

export interface IOIDetail {
  type: 'IOI',
  totalScore: number,

  problems: Record<ProblemId, {
    score: number,
  }>
}

export type RankingDetail = ACMDetail | OIDetail | IOIDetail;

// 表：比赛排名信息，比赛时动态维护
export interface Ranking {
  contest: ContestId
  user: UserId
  team: string
  ranking: number
  detail: RankingDetail
}
