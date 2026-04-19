import { defineFakeRoute } from 'vite-plugin-fake-server/client'

import { mockProblems, mockProblemsCore, mockProblemCoreWithJudgements } from '../data'
import type {
  ProblemListRequest,
  ProblemListResponse,
  ProblemRequest,
  ProblemResponse,
} from '../interface'
import { sample, slice } from 'lodash-es'

export default defineFakeRoute([
  {
    url: '/api/problem/list',
    method: 'post',
    timeout: 1000,
    response: (request: { body: Partial<ProblemListRequest> }) => {
      const start = ((request.body.page || 1) - 1) * 50
      const response: ProblemListResponse = {
        problems: slice(mockProblemCoreWithJudgements, start, start + 50),
        total: mockProblemsCore.length,
      }
      return response
    },
  },
  {
    url: '/api/problem',
    method: 'post',
    timeout: 1000,
    response: (_request: { body: Partial<ProblemRequest> }) => {
      const response: ProblemResponse = {
        problem: sample(mockProblems)!,
      }
      return response
    },
  },
])
