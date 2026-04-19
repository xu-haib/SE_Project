import type {
  Judgement,
  JudgeRequest,
  JudgeResponse,
  ProblemAllRequest,
  ProblemAllResponse,
  ProblemCoreWithJudgements,
  ProblemDeleteRequest,
  ProblemDeleteResponse,
  ProblemEditRequest,
  ProblemEditResponse,
  ProblemListRequest,
  ProblemListResponse,
  ProblemRequest,
  ProblemResponse,
  ProblemSolvedRequest,
  ProblemSolvedResponse,
} from '@/interface'

import { apiFetchDefault, apiFetchRemind, apiFetchSilent } from '@/utils/ofetch'

const normalizeJudgementDates = (judgement: Judgement) => {
  judgement.stamp = new Date(judgement.stamp as unknown as number)
  return judgement
}

const normalizeProblemDates = (problem: ProblemCoreWithJudgements) => {
  problem.judgements = problem.judgements.map(normalizeJudgementDates)
  return problem
}

export const apiProblemList = async (body: ProblemListRequest) => {
  const data = await apiFetchDefault<ProblemListResponse>('/problem/list', {
    method: 'POST',
    body,
  })
  data.problems = data.problems.map(normalizeProblemDates)
  return data
}

export const apiProblemMine = async (body: ProblemAllRequest) => {
  return apiFetchDefault<ProblemAllResponse>('/problem/mine', {
    method: 'POST',
    body,
  })
}

export const apiProblemAll = async (body: ProblemAllRequest) => {
  return apiFetchDefault<ProblemAllResponse>('/problem/all', {
    method: 'POST',
    body,
  })
}

export const apiProblemSolved = async (body: ProblemSolvedRequest) => {
  return apiFetchDefault<ProblemSolvedResponse>('/problem/solved', {
    method: 'POST',
    body,
  })
}

export const apiProblem = async (body: ProblemRequest) => {
  return apiFetchDefault<ProblemResponse>('/problem', {
    method: 'POST',
    body,
  })
}

export const apiProblemCheck = async (body: ProblemRequest) => {
  return apiFetchSilent<ProblemResponse>('/problem', {
    method: 'POST',
    body,
  })
}

export const apiProblemEdit = async (body: ProblemEditRequest) => {
  return apiFetchRemind<ProblemEditResponse>('/problem/edit', {
    method: 'POST',
    body,
  })
}

export const apiProblemDelete = async (body: ProblemDeleteRequest) => {
  return apiFetchRemind<ProblemDeleteResponse>('/problem/delete', {
    method: 'POST',
    body,
  })
}

export const apiJudge = async (body: JudgeRequest) => {
  if (body.contest !== undefined) {
    return apiFetchDefault<JudgeResponse>('/contest/submit', {
      method: 'POST',
      body,
    })
  } else {
    return apiFetchDefault<JudgeResponse>('/problem/submit', {
      method: 'POST',
      body,
    })
  }
}
