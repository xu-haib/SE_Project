import type {
  Contest,
  ContestDifficulty,
  ContestId,
  ContestRule,
  ContestWithSignup,
  ProblemCore,
  Ranking,
  UserId,
} from '../entity'

export interface ContestFilterParams {
  keyword?: string
  rule?: ContestRule
  difficulty?: ContestDifficulty
  before?: Date
  after?: Date
}

export type ContestFilterQuery = ContestFilterParams & {
  size?: number
  page?: number
}

export type ContestListRequest = ContestFilterQuery

export interface ContestListResponse {
  total: number
  contests: ContestWithSignup[]
}

export interface ContestAllRequest {
  page: number
  filter: ContestFilterForm
}

export interface ContestAllResponse {
  total: number
  contests: Contest[]
}

export interface ContestFilterForm {
  rule?: ContestRule
  difficulty?: ContestDifficulty
}

export interface ContestRequest {
  contest: ContestId
}

export interface ContestResponse {
  contest: Contest
}

export interface SignupRequest {
  contest: ContestId
}

export interface SignupResponse {
  
}

export interface SignoutRequest {
  contest: ContestId
}

export interface SignoutResponse {
  
}

export interface RankingRequest {
  contest: ContestId
  user: UserId
}

export interface RankingResponse {
  ranking?: Ranking
}

export interface RanklistRequest {
  contest: ContestId
}

export interface RanklistResponse {
  rankings: Ranking[]
}

export interface ContestProblemsRequest {
  contest: ContestId
}

export interface ContestProblemsResponse {
  problems: ProblemCore[]
}

export interface ContestEditRequest {
  contest: Contest
}

export interface ContestEditResponse {
  contest: Contest
}