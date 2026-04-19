import type {
  AvatarUploadRequest,
  AvatarUploadResponse,
  Judgement,
  PracticeRequest,
  PracticeResponse,
  UserDeleteRequest,
  UserDeleteResponse,
  UserEditRequest,
  UserEditResponse,
  UserListRequest,
  UserListResponse,
  UserRequest,
  UserResponse,
} from '@/interface'
import { apiFetchDefault, apiFetchRemind } from '@/utils/ofetch'

export const apiUser = async (request: UserRequest) => {
  return apiFetchDefault<UserResponse>('/user', {
    method: 'POST',
    body: request,
  })
}

export const apiUserEdit = async (request: UserEditRequest) => {
  return apiFetchDefault<UserEditResponse>('/user/edit', {
    method: 'POST',
    body: request,
  })
}

export const apiUserDelete = async (request: UserDeleteRequest) => {
  return apiFetchDefault<UserDeleteResponse>('/user/delete', {
    method: 'POST',
    body: request,
  })
}

export const apiUserAll = async (request: UserListRequest) => {
  return apiFetchDefault<UserListResponse>('/user/all', {
    method: 'POST',
    body: request,
  })
}

export const apiAvatarUpload = async (request: AvatarUploadRequest) => {
  const formData = new FormData()
  formData.append('file', request.file)

  return apiFetchRemind<AvatarUploadResponse>('/upload/avatar', {
    method: 'POST',
    body: formData,
  })
}

const processJudgementDates = (judgement: Judgement) => {
  judgement.stamp = new Date(judgement.stamp as unknown as number)
  return judgement
}

export const apiPractice = async (request: PracticeRequest) => {
  const data = await apiFetchDefault<PracticeResponse>('/user/practice', {
    method: 'POST',
    body: request,
  })
  data.judgements = data.judgements.map(processJudgementDates)
  return data
}