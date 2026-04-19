import { defineFakeRoute } from 'vite-plugin-fake-server/client'

import { mockSubmissionsFull, mockSubmissionsLite } from '../data'
import type {
  SubmissionDetailRequest,
  SubmissionDetailResponse,
  SubmissionListRequest,
  SubmissionListResponse,
} from '../interface'

export default defineFakeRoute([
  {
    url: '/api/submission/list',
    method: 'post',
    timeout: 1000,
    response: (_request: { body: Partial<SubmissionListRequest> }) => {
      const response: SubmissionListResponse = {
        submissions: mockSubmissionsLite,
        total: 1000,
      }
      return response
    },
  },
  {
    url: '/api/submission',
    method: 'post',
    timeout: 1000,
    response: (_request: { body: Partial<SubmissionDetailRequest> }) => {
      const response: SubmissionDetailResponse = {
        submission: mockSubmissionsFull[0],
      }
      return response
    },
  },
])
