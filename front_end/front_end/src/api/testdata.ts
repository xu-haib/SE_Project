import type {
  TestdataUploadRequest,
  TestdataUploadResponse,
  TestdataDownloadRequest,
  TestdataDownloadResponse,
  TestdataDeleteRequest,
  TestdataDeleteResponse,
  TestdataConfigUploadRequest,
  TestdataConfigUploadResponse,
  TestdataConfigRequest,
  TestdataConfigResponse,
} from '@/interface'
import { apiFetchDefault, apiFetchRemind } from '@/utils/ofetch'

export const apiTestdataDownload = async (request: TestdataDownloadRequest) => {
  return apiFetchDefault<TestdataDownloadResponse>('/testdata/download', {
    method: 'POST',
    body: request,
  })
}

export const apiTestdataUpload = async (request: TestdataUploadRequest) => {
  const formData = new FormData()
  formData.append('problem', request.problem.toString())
  formData.append('file', request.file)

  return apiFetchRemind<TestdataUploadResponse>('/testdata/upload', {
    method: 'POST',
    body: formData,
  })
}

export const apiTestdataDelete = async (request: TestdataDeleteRequest) => {
  return apiFetchRemind<TestdataDeleteResponse>('/testdata/delete', {
    method: 'POST',
    body: request,
  })
}

export const apiTestdataConfigUpload = async (request: TestdataConfigUploadRequest) => {
  return apiFetchDefault<TestdataConfigUploadResponse>('/testdata/config/upload', {
    method: 'POST',
    body: request,
  })
}

export const apiDataConfigDetail = async (request: TestdataConfigRequest) => {
  return apiFetchDefault<TestdataConfigResponse>('/testdata/config/view', {
    method: 'POST',
    body: request,
  })
}
