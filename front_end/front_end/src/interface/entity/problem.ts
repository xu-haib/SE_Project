import type { ProblemId, BaseModel, TagClassifyId, TagId, UserId, UserLangId } from './enum'
import type { Judgement } from './judge'

// 配置文件：标签分类（算法标签（有若干子类）、来源标签、技术性标签）
export interface TagClassify {
  id: TagClassifyId
  name: string
}

// 配置文件：标签
export interface Tag {
  id: TagId
  classify: TagClassifyId
  name: string
}

// 题面的子集（辅助类型，在查询题目列表时使用）
export interface ProblemCore extends BaseModel {
  id: ProblemId
  type: 'traditional' | 'interactive' // 传统题、交互题
  status: 'public' | 'private' | 'contest'

  limitTime: number
  limitMemory: number

  countCorrect: number
  countTotal: number

  difficulty: number
  tags: TagId[]
  provider: UserId

  title: Record<UserLangId, string> // 多语言对应不同题目名称，缺省使用第一个
}

// 用于题目列表
export interface ProblemCoreWithJudgements extends ProblemCore {
  judgements: Judgement[]
}

// 题面，一条题目对应多个题面
export interface Statement {
  background?: string // 题目背景
  legend?: string // 题目描述
  formatI?: string // 输入格式
  formatO?: string // 输出格式
  examples: {
    // 样例
    dataI: string
    dataO: string
  }[]
  hint?: string // 提示，含样例解释
  note?: string // 管理员内部字段
}

// 表：题目
export interface Problem extends ProblemCore {
  statements: Record<string, Statement>

  hasTestdata: boolean
  hasConfig: boolean
}

// 配置文件：难度等级
export interface Level {
  name: string
  min: number
  max: number
}
