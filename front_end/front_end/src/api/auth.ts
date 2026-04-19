import type {
  CreateRequest,
  CreateResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  MeRequest,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  ResetRequest,
  ResetResponse,
} from '@/interface'

import { apiFetchSilent } from '@/utils/ofetch'

export const apiLogin = async (requestBody: LoginRequest) => {
  return apiFetchSilent<LoginResponse>('/auth/login', {
    method: 'POST',
    body: requestBody,
  })
}

export const apiLogout = async (requestBody: LogoutRequest) => {
  return apiFetchSilent<LogoutResponse>('/auth/logout', {
    method: 'POST',
    body: requestBody,
  })
}

export const apiRegister = async (requestBody: RegisterRequest) => {
  return apiFetchSilent<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: requestBody,
  })
}

export const apiMe = async (requestBody: MeRequest) => {
  return apiFetchSilent<MeResponse>('/auth/me', {
    method: 'POST',
    body: requestBody,
  })
}

export const apiCreate = async (requestBody: CreateRequest) => {
  return apiFetchSilent<CreateResponse>('/auth/create', {
    method: 'POST',
    body: requestBody,
  })
}

export const apiReset = async (requestBody: ResetRequest) => {
  return apiFetchSilent<ResetResponse>('/auth/reset', {
    method: 'POST',
    body: requestBody,
  })
}
