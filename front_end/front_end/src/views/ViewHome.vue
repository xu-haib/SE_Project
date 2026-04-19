<template>
  <LayoutHome>
    <!-- Hero 区 -->
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Reisen Online Judge</h1>
        <p class="hero-sub">在这里挑战算法，磨砺思维，参与竞赛</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/problem')">开始刷题</el-button>
          <el-button size="large" plain @click="$router.push('/contest')">查看比赛</el-button>
        </div>
      </div>
    </div>

    <!-- 动态卡片区 -->
    <div class="dashboard">
      <!-- 正在进行的比赛 -->
      <el-card class="dash-card" shadow="never">
        <template #header>
          <span class="card-title">
            <el-badge is-dot type="success" class="badge-dot" /> 正在进行的比赛
          </span>
        </template>
        <div v-if="running.length > 0">
          <div v-for="c in running" :key="c.id" class="contest-item" @click="$router.push(`/contest/${c.id}`)">
            <span class="contest-name">{{ c.title }}</span>
            <countdown-timer class="contest-countdown" :end-time="c.endTime" />
          </div>
        </div>
        <el-empty v-else description="暂无进行中的比赛" :image-size="60" />
      </el-card>

      <!-- 即将开始 -->
      <el-card class="dash-card" shadow="never">
        <template #header>
          <span class="card-title">
            <el-icon class="pending-icon"><Clock /></el-icon> 即将开始
          </span>
        </template>
        <div v-if="pending.length > 0">
          <div v-for="c in pending" :key="c.id" class="contest-item" @click="$router.push(`/contest/${c.id}`)">
            <span class="contest-name">{{ c.title }}</span>
            <span class="contest-date">{{ formatDate(c.startTime) }}</span>
          </div>
        </div>
        <el-empty v-else description="暂无即将开始的比赛" :image-size="60" />
      </el-card>

      <!-- 最近结束 -->
      <el-card class="dash-card" shadow="never">
        <template #header>
          <span class="card-title">
            <el-icon class="finished-icon"><Finished /></el-icon> 最近结束
          </span>
        </template>
        <div v-if="finished.length > 0">
          <div v-for="c in finished" :key="c.id" class="contest-item" @click="$router.push(`/contest/${c.id}`)">
            <span class="contest-name">{{ c.title }}</span>
            <el-tag size="small" type="info">已结束</el-tag>
          </div>
        </div>
        <el-empty v-else description="暂无最近结束的比赛" :image-size="60" />
      </el-card>
    </div>
  </LayoutHome>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElButton, ElCard, ElEmpty, ElBadge, ElTag, ElIcon } from 'element-plus'
import { Clock, Finished } from '@element-plus/icons-vue'
import LayoutHome from '@/components/layout/LayoutHome.vue'
import CountdownTimer from '@/components/common/CountdownTimer.vue'
import { apiContestList } from '@/api/contest'
import type { ContestWithSignup } from '@/interface'

const running = ref<ContestWithSignup[]>([])
const pending = ref<ContestWithSignup[]>([])
const finished = ref<ContestWithSignup[]>([])

function formatDate(d: Date) {
  return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  const res = await apiContestList({})
  const now = Date.now()
  for (const c of res.contests) {
    const s = c.startTime.getTime()
    const e = c.endTime.getTime()
    if (s <= now && now <= e) running.value.push(c)
    else if (now < s) pending.value.push(c)
    else finished.value.unshift(c)
  }
  finished.value = finished.value.slice(0, 3)
})
</script>

<style lang="scss" scoped>
.hero {
  background: linear-gradient(135deg, #1e3a5f 0%, #0f1117 60%);
  border-radius: 12px;
  padding: 60px 48px;
  margin-bottom: 32px;
  border: 1px solid rgba(79, 156, 249, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(79, 156, 249, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}

.hero-sub {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dash-card {
  background: #1a1f2e;
  border: 1px solid rgba(79, 156, 249, 0.12);
  border-radius: 8px;
  min-height: 200px;

  :deep(.el-card__header) {
    border-bottom: 1px solid rgba(79, 156, 249, 0.12);
    padding: 12px 16px;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #cbd5e1;
  font-size: 0.95rem;
}

.badge-dot {
  :deep(.el-badge__content) {
    top: 2px;
  }
}

.pending-icon {
  color: #f59e0b;
}

.finished-icon {
  color: #64748b;
}

.contest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(79, 156, 249, 0.08);
    padding-left: 8px;
  }
}

.contest-name {
  font-size: 0.9rem;
  color: #cbd5e1;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.contest-countdown {
  font-size: 0.82rem;
  color: #4f9cf9;
  white-space: nowrap;
}

.contest-date {
  font-size: 0.82rem;
  color: #64748b;
  white-space: nowrap;
}
</style>
