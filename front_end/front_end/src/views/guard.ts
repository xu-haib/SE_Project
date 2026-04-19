import { useAuth } from '@/stores/auth'
import { useConfig } from '@/stores/config'
import { useContest } from '@/stores/contest'
import type { Router } from 'vue-router'

import { ElMessage, ElMessageBox } from 'element-plus'
import Swal from 'sweetalert2'

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const authStore = useAuth()
    const contestStore = useContest()
    const configStore = useConfig()

    // 初始化配置文件
    if (!configStore.isInitialized) {
      await configStore.initialize()
    }

    // 初始化认证状态
    if (!authStore.isInitialized) {
      await authStore.initialize()
    }

    // 初始化比赛状态
    if (!contestStore.isInitialized) {
      const saved = await contestStore.restore()
      contestStore.isInitialized = true

      if (!to.path.startsWith('/contest/')) {
        if (saved !== 0) {
          ElMessageBox.confirm('检测到你在离开前处于比赛模式，是否继续比赛？', '警告', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            router.push(`/contest/${saved}`)
            return false
          })
        }
        await contestStore.exit()
      } else {
        await contestStore.refresh()
      }
    } else {
      if (!to.path.startsWith('/contest/')) {
        await contestStore.exit()
      } else {
        const array = to.path.split('/')
        console.log(array)

        if (array.length > 2) {
          const id = parseInt(array[2])
          if(!contestStore.currentContest || id != contestStore.currentContest.id){
            await contestStore.enter(id)
          } else {
            await contestStore.refresh()
          }
        } else {
          await contestStore.exit()
        }
      }
    }
    // 检查路由是否需要认证
    if (to.meta.minRole){
      if (!authStore.currentUser){
        authStore.setRedirectUrl(to.fullPath)
        authStore.show('login')
        return false
      }
      if((to.meta.minRole as number) > authStore.currentUser.role){
        Swal.fire({
          title: '暂无权限',
          icon: 'error',
          text: '你没有权限访问该页面',
          timer: 1000
        })
        return false
      }
    }
    return true
  })
}
