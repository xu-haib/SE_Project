import type {
  CodeLangId,
  ContestId,
  ProblemId,
  BaseModel,
  UserId,
  UserLangId,
  VerdictId,
  SubmissionId,
} from './enum'
import type { ProblemCore } from './problem'
import type { User } from './user'

export type Judge = 'correct' | 'incorrect' | number

// 配置文件：提交语言
export interface CodeLang {
  id: CodeLangId
  ext: string[] // 用于识别文件的文件后缀
  description: string // 语言描述，例如 C++11 (GCC9)
  ratio: number // 时限比率，用于给更慢的语言乘上倍率
}

// 配置文件：用户语言
export interface UserLang {
  id: UserLangId
  description: string // 语言描述，例如 “中文” 或者 “English”
  flag?: string // 国旗标识
}

// 配置文件：记录状态
export interface Verdict {
  id: VerdictId
  description: string // 描述，例如 Wrong Answer
  abbr: string // 缩写，例如 WA
  color: string
}

// 测试点详细信息
export interface Testcase {
  id: number
  verdict: VerdictId
  time?: number
  memory?: number
  score?: number
  input?: string
  output?: string
  checker?: string
}

// 测试点的子集（辅助类型）
export interface SubmissionCore extends BaseModel {
  id: SubmissionId
  user: UserId
  problem: ProblemId // 关联试题
  contest?: ContestId // 关联比赛

  submittedAt: Date // 提交时间
  processedAt: Date // 评测时间
  lang: CodeLangId // 评测语言

  verdict: VerdictId // 评测结果
  score: number // 得分，主要用于部分分
  time: number // 评测用时
  memory: number // 占用空间
  length: number // 代码长度
}

// 表：题目结果
export interface Judgement {
  problem: ProblemId // 关联试题（类型为 number）
  user: UserId // 关联用户（类型为 number）

  judge: Judge // 题目评判（类型为 'correct' | 'incorrect' | number（分数），只有 correct 的记为通过）
  difficulty: number // 试题难度，防止计算练习数据时和 Problem 联合查询带来性能开销
  stamp: Date // 通过时间
}

// export interface JudgementFull extends Omit<Judgement, 'problem' | 'user'> {
//   problem: ProblemCore
//   user: User
// }

// 表：评测记录
export interface Submission extends SubmissionCore {
  code: string
  compile?: {
    success: boolean
    message: string
  }
  detail: Testcase[]
}

// 用于在评测列表展示的轻量查询结果
export interface SubmissionLite extends Omit<SubmissionCore, 'problem' | 'user'> {
  problem: ProblemCore // 评测列表不需要题面，但需要题目信息
  user: User
}

// 用于在评测详情展示的完整查询结果
export interface SubmissionFull extends Omit<Submission, 'problem' | 'user'> {
  problem: ProblemCore // 评测详情不需要题面，但需要题目信息
  user: User
}
