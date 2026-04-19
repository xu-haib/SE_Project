import type {
  TagId,
  Tag,
  VerdictId,
  Verdict,
  Level,
  UserLangId,
  CodeLangId,
  UserLang,
  CodeLang,
} from '../entity'

export interface SyncConfigResponse {
  tags: Record<TagId, Tag | undefined>
  userLangs: Record<UserLangId, UserLang | undefined>
  codeLangs: Record<CodeLangId, CodeLang | undefined>
  verdicts: Record<VerdictId, Verdict | undefined>
  difficulties: Level[]
}
