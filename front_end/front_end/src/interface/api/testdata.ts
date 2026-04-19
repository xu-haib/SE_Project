import type { ProblemId, TestdataConfig } from '../entity'

export interface TestdataUploadRequest {
  problem: ProblemId
  file: File
}

export interface TestdataUploadResponse {
  valid: boolean
  message?: string // 添加错误消息字段
  config?: TestdataConfig // 可选返回配置信息
}

export interface TestdataDownloadRequest {
  problem: ProblemId
}

export interface TestdataDownloadResponse {
  url: string // 返回下载 URL
}

export interface TestdataDeleteRequest {
  problem: ProblemId
}

export type TestdataDeleteResponse = {}

export interface TestdataConfigUploadRequest {
  problem: ProblemId
  config: TestdataConfig
}

export interface TestdataConfigUploadResponse {
  valid: boolean
  message?: string
}

export interface TestdataConfigRequest {
  problem: ProblemId
}

export interface TestdataConfigResponse {
  config: TestdataConfig
}
