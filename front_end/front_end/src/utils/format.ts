// 补零函数
const padZero = (num: number) => num.toString().padStart(2, '0')

export function formatDate(date: Date | undefined) {
  if(date === undefined){
    return '未知日期'
  }
  const now = new Date()
  const target = new Date(date)

  const year = target.getFullYear()
  const month = target.getMonth() + 1
  const day = target.getDate()
  const hours = target.getHours()
  const minutes = target.getMinutes()
  const seconds = target.getSeconds()

  if (now.getFullYear() === year) {
    // 同年，不显示年份
    return `${month}-${day} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  } else {
    // 不同年，显示年份
    return `${year}-${month}-${day} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }
}

export function formatTimeShort(ms: number | undefined) {
  if (ms === undefined) return '-'
  if (ms >= 10000) {
    return `${(ms / 1000).toFixed(1)}s`
  }
  return `${ms}ms`
}

export function formatMemory(kb: number | undefined) {
  if (kb === undefined) return '-'
  if (kb >= 1024 * 1024) {
    return `${(kb / (1024 * 1024)).toFixed(1)}GB`
  } else if (kb >= 1024) {
    return `${(kb / 1024).toFixed(1)}MB`
  }
  return `${kb}KB`
}

export function formatTimeContest(ms: number | undefined, short: boolean = true) {
  if (ms === undefined) return '-'
  const dd = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hh = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (short) {
    if (dd) return `${dd}d ${hh}h`
    else return `${hh}h`
  } else {
    if (dd) return `${dd} 天 ${hh} 小时`
    else return `${hh} 小时`
  }
}

export function formatTimeLong(ms: number | undefined, short: boolean = true) {
  if (ms === undefined) return '-'

  const dd = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hh = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mm = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const ss = Math.floor((ms % (1000 * 60)) / 1000)

  if (short) {
    if (dd) return `${dd}:${padZero(hh)}:${padZero(mm)}:${padZero(ss)}`
    else return `${hh}:${padZero(mm)}:${padZero(ss)}`
  } else {
    if (dd) return `${dd} 天 ${padZero(hh)} 小时 ${padZero(mm)} 分钟 ${padZero(ss)} 秒`
    else return `${hh} 小时 ${padZero(mm)} 分钟 ${padZero(ss)} 秒`
  }
}

export function formatProblemType(type: string) {
  if (type == 'traditional') return '传统题'
  if (type == 'interactive') return '传统题'
  return '未知题型'
}
