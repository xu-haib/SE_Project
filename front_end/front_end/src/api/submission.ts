import type {
  Submission,
  SubmissionDeleteRequest,
  SubmissionDeleteResponse,
  SubmissionDetailRequest,
  SubmissionDetailResponse,
  SubmissionListRequest,
  SubmissionListResponse,
  SubmissionRejudgeRequest,
  SubmissionRejudgeResponse,
} from '@/interface'

import { apiFetchDefault } from '@/utils/ofetch'

export const apiSubmissionList = async (request: SubmissionListRequest) => {
  const response = await apiFetchDefault<SubmissionListResponse>('/submission/list', {
    method: 'POST',
    body: request,
  })
  for (const submission of response.submissions) {
    submission.submittedAt = new Date(submission.submittedAt)
    submission.processedAt = new Date(submission.processedAt)
  }
  return response
}

export const apiSubmissionDelete = async (request: SubmissionDeleteRequest) => {
  const response = await apiFetchDefault<SubmissionDeleteResponse>('/submission/delete', {
    method: 'POST',
    body: request,
  })
  return response
}

export const apiSubmissionRejudge = async (request: SubmissionRejudgeRequest) => {
  const response = await apiFetchDefault<SubmissionRejudgeResponse>('/submission/rejudge', {
    method: 'POST',
    body: request,
  })
  const submission = response.submission
  submission.submittedAt = new Date(submission.submittedAt)
  submission.processedAt = new Date(submission.processedAt)
  return response
}

export const apiSubmissionAll = apiSubmissionList;

export const apiSubmissionDetail = async (request: SubmissionDetailRequest) => {
  const response = await apiFetchDefault<SubmissionDetailResponse>('/submission', {
    method: 'POST',
    body: request,
  })
  const submission = response.submission
  submission.submittedAt = new Date(submission.submittedAt)
  submission.processedAt = new Date(submission.processedAt)
  return response
}

// WebSocket 支持
export const setupSubmissionWS = (submissionId: number, callback: (data: Submission) => void) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  const ws = new WebSocket(`${protocol}//${host}/api/ws/submission/${submissionId}`)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    data.submittedAt = new Date(data.submittedAt)
    data.processedAt = new Date(data.processedAt)
    callback(data)
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  return () => ws.close()
}