import { has } from 'lodash-es'
import { ofetch } from 'ofetch'
import Swal from 'sweetalert2'

export const showSuccess = (message: string) => {
  return Swal.fire({ icon: 'success', title: '成功', text: message, timer: 1000 })
}

export const showError = (message: string) => {
  return Swal.fire({ icon: 'error', title: '错误', text: message })
}

const createFetchInstance = (success: boolean, error: boolean) => {
  return ofetch.create({
    baseURL: '/api',
    credentials: 'include',
    async onRequest({ options }) {
      // 请求拦截器 - 添加 token
      const tokenL = localStorage.getItem('token')
      const tokenS = sessionStorage.getItem('token')
      if (tokenS) {
        options.headers.set('Authorization', `Bearer ${tokenS}`)
      } else if (tokenL) {
        options.headers.set('Authorization', `Bearer ${tokenL}`)
      }
    },
    async onResponse({ response, options }) {
      // 响应拦截器 - 成功处理
      if (success) {
        showSuccess('操作成功')
      }

      if (has(response, 'data') && has(response, 'code') && has(response, 'message')) {
        if (response._data.code !== 200) {
          const message = response?._data?.error || '请求失败'
          if (error) {
            showError(message)
          }
          throw response._data.data
        }
        return response._data.data
      }
      return response._data
    },
    async onResponseError({ response, options }) {
      // 响应拦截器 - 错误处理
      const message = response?._data?.error || '请求失败'

      if (error) {
        showError(message)
      }
      throw response._data
    },
  })
}

export const apiFetchSilent = createFetchInstance(false, false) // 静默，成功和失败时均静默（可以通过 try catch 自行处理）
export const apiFetchRemind = createFetchInstance(true, true) // 提醒，成功和失败时均提示，用于给予用户反馈（例如创建文章）
export const apiFetchDefault = createFetchInstance(false, true) // 默认，成功时静默、失败时提示，适用于大多数自动完成的请求（例如拉取列表）
