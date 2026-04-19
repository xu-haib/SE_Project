<template>
  <layout-main :bread="[
    {label: 'Reisen Online Judge', to: { name: 'home' }},
    {label: '用户主页'},
    {label: `#${ props.uid_str || currentUser?.id || 0 }`},
    ]">
    <div class="user-profile">
      <template v-if="visitingUser">
        <template v-if="uid === 0"> 尚未登录。 </template>
        <template v-else>
          <!-- 顶部用户信息 -->
          <div class="user-header">
            <el-avatar :size="120" :src="visitingUser.avatar" />
            <h1>{{ visitingUser.name }}</h1>
            <div class="user-meta">
              <span>注册于 {{ formatDate(visitingUser.createdAt) }}</span>
              <!-- <span>解决 100 道题目</span> -->
            </div>
          </div>

          <!-- 标签页导航 -->
          <template v-if="isCurrentUser">
            <el-tabs v-model="activeTab" class="profile-tabs">
              <el-tab-pane label="练习" name="practice">
                <tab-practice :user="visitingUser" />
              </el-tab-pane>
              <el-tab-pane label="题库" name="problems">
                <tab-problem :user="visitingUser" />
              </el-tab-pane>
              <el-tab-pane label="设置" name="settings">
                <tab-settings :user="visitingUser" />
              </el-tab-pane>
            </el-tabs>
          </template>
          <template v-else>
            <el-tabs v-model="activeTab" class="profile-tabs">
              <el-tab-pane label="练习" name="practice">
                <tab-practice :user="visitingUser" />
              </el-tab-pane>
            </el-tabs>
          </template>
        </template>
      </template>
    </div>
  </layout-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/stores/auth'
import { formatDate } from '@/utils/format'

import { ElTabs, ElTabPane, ElAvatar } from 'element-plus'

import LayoutMain from '@/components/layout/LayoutMain.vue'
import TabPractice from '@/components/user/TabPractice.vue'
import TabProblem from '@/components/user/TabProblem.vue'
import TabSettings from '@/components/user/TabSettings.vue'
import type { User } from '@/interface'
import { apiUser } from '@/api/user'

const props = defineProps<{
  uid_str?: string
}>()

const currentUser = useAuth().currentUser
const visitingUser = ref<User | null>(null)

const uid: number = props.uid_str ? parseInt(props.uid_str) : currentUser?.id || 0
const activeTab = ref('practice')

const isCurrentUser = computed(() => currentUser?.id === uid)

onMounted(() => {
  apiUser({ user: uid }).then((response) => {
    visitingUser.value = response.user
  })
})
</script>

<style scoped>
.user-profile {
  max-width: 1200px;
  margin: 0 auto;
}

.user-header {
  text-align: center;
  margin-bottom: 30px;
}

.user-header h1 {
  margin: 15px 0 5px;
  font-size: 2em;
}

.user-meta {
  color: var(--el-text-color-secondary);
  display: flex;
  justify-content: center;
  gap: 20px;
}

.profile-tabs {
  margin-top: 20px;
}
</style>
