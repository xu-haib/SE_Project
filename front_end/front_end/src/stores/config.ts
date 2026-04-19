import { syncConfig } from '@/api/config'
import type {
  Level,
  Tag,
  TagId,
  Verdict,
  VerdictId,
  CodeLangId,
  UserLangId,
  UserLang,
  CodeLang,
} from '@/interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfig = defineStore('config', () => {
  const isInitialized = ref(false)

  // 用户可以更改的设置选项
  const userLang = ref<UserLangId>('zh-CN')
  const codeLang = ref<CodeLangId>('cpp')

  // 每次加载时进行同步，不会更改
  const config = ref<{
    tags: Record<TagId, Tag | undefined>
    userLangs: Record<UserLangId, UserLang | undefined>
    codeLangs: Record<CodeLangId, CodeLang | undefined>
    verdicts: Record<VerdictId, Verdict | undefined>
    difficulties: Level[]
  }>({
    tags: {},
    userLangs: {},
    codeLangs: {},
    verdicts: {},
    difficulties: [],
  })

  const initialize = async () => {
    const response = await syncConfig()
    config.value = response
    isInitialized.value = true
  }

  return {
    config,
    userLang,
    codeLang,
    isInitialized,
    initialize,
  }
})
