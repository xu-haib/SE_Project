import type { CodeLang, Level, Tag, TagId, UserLang, Verdict } from '../interface'

export const configCodeLangs: Record<string, CodeLang> = {
  cpp: { id: 'cpp', ext: ['.cpp'], description: 'C++17 (GCC 9)', ratio: 1 },
  java: { id: 'java', ext: ['.java'], description: 'Java 11', ratio: 2 },
  python: { id: 'python', ext: ['.py'], description: 'Python 3.8', ratio: 3 },
}

export const configUserLangs: Record<string, UserLang> = {
  'en-US': { id: 'en-US', description: 'English' },
  'zh-CN': { id: 'zh-CN', description: '简体中文' },
  'zh-TW': { id: 'zh-TW', description: '繁体中文' },
}

export const configVerdicts: Record<string, Verdict> = {
  AC: { id: 'AC', description: 'Accepted', abbr: 'AC', color: '#67C23A' },
  WA: { id: 'WA', description: 'Wrong Answer', abbr: 'WA', color: '#F56C6C' },
  RE: { id: 'RE', description: 'Runtime Error', abbr: 'RE', color: '#6A3BC0' },
  TLE: { id: 'TLE', description: 'Time Limit Exceeded', abbr: 'TLE', color: '#E6A23C' },
  MLE: { id: 'MLE', description: 'Memory Limit Exceeded', abbr: 'MLE', color: '#E6A23C' },
  CE: { id: 'CE', description: 'Compile Error', abbr: 'CE', color: '#909399' },
  UKE: { id: 'UKE', description: 'Unknown Error', abbr: 'UKE', color: '#909399' },
}

export const configDifficulties: Level[] = [
  { min: 800, max: 1099, name: '入门' },
  { min: 1100, max: 1399, name: '简单' },
  { min: 1400, max: 1699, name: '中等' },
  { min: 1700, max: 1999, name: '较难' },
  { min: 2000, max: 2299, name: '困难' },
  { min: 2300, max: 2599, name: '挑战' },
  { min: 2600, max: 2899, name: '精英' },
  { min: 2900, max: 3199, name: '专家' },
  { min: 3200, max: 3500, name: '大师' },
]

export const configTags: Record<TagId, Tag> = {
  1: { id: 1, name: '动态规划', classify: 1 },
  2: { id: 2, name: '图论', classify: 1 },
  3: { id: 3, name: '数据结构', classify: 1 },
}
