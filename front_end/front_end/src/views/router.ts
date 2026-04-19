import ViewContestList from '@/views/ViewContestList.vue'
import ViewHome from '@/views/ViewHome.vue'
import ViewProblemList from '@/views/ViewProblemList.vue'
import ViewSubmissionList from '@/views/ViewSubmissionList.vue'
import LayoutAdmin from '@/components/layout/LayoutAdmin.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard.ts'

import { Role } from '@/interface/index.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ViewHome,
    },
    {
      path: '/problem',
      name: 'problem-list',
      component: ViewProblemList,
    },
    {
      path: '/problem/create',
      name: 'problem-create',
      component: () => import('@/views/ViewProblemEdit.vue'),
      meta: { minRole: Role.Jury },
    },
    {
      path: '/problem/:pid_str(\\d+)',
      name: 'problem-detail',
      component: () => import('@/views/ViewProblemDetail.vue'),
      props: true,
    },
    {
      path: '/problem/:pid_str(\\d+)/edit',
      name: 'problem-edit',
      component: () => import('@/views/ViewProblemEdit.vue'),
      props: true,
      meta: { minRole: Role.Jury },
    },
    {
      path: '/submission',
      name: 'submission-list',
      component: ViewSubmissionList,
    },
    {
      path: '/submission/:rid_str(\\d+)',
      name: 'submission-detail',
      component: () => import('@/views/ViewSubmissionDetail.vue'),
      props: true,
    },
    {
      path: '/user',
      name: 'user-default',
      component: () => import('@/views/ViewUser.vue'),
      meta: { minRole: Role.User },
    },
    {
      path: '/user/:uid_str(\\d+)',
      name: 'user',
      component: () => import('@/views/ViewUser.vue'),
      props: true,
      meta: { minRole: Role.User },
    },
    {
      path: '/contest',
      name: 'contest-list',
      component: ViewContestList,
    },
    {
      path: '/contest/create',
      name: 'contest-create',
      component: () => import('@/views/ViewContestEdit.vue'),
      props: true,
      meta: { minRole: Role.Jury },
    },
    {
      path: '/contest/:cid_str(\\d+)',
      name: 'contest-detail',
      component: () => import('@/views/ViewContestDetail.vue'),
      props: true,
      meta: { minRole: Role.User },
    },
    {
      path: '/contest/:cid_str(\\d+)/edit',
      name: 'contest-edit',
      component: () => import('@/views/ViewContestEdit.vue'),
      props: true,
      meta: { minRole: Role.Jury },
    },
    {
      path: '/contest/:cid_str(\\d+)/ranklist',
      name: 'contest-ranklist',
      component: () => import('@/views/ViewContestRanking.vue'),
      props: true,
    },
    {
      path: '/contest/:cid_str(\\d+)/:plabel',
      name: 'contest-problem-detail',
      component: () => import('@/views/ViewProblemDetail.vue'),
      props: true,
      meta: { minRole: Role.User },
    },
    {
      path: '/admin',
      component: LayoutAdmin,
      meta: { minRole: Role.Admin },
      children: [
        // 用户管理
        {
          path: 'users',
          component: () => import('@/components/admin/AdminUser.vue'),
          meta: { title: '用户列表' },
        },

        // 题目管理
        {
          path: 'problems',
          component: () => import('@/components/admin/AdminProblem.vue'),
          meta: { title: '题目列表' },
        },
        // {
        //   path: 'tags',
        //   component: () => import('@/components/admin/AdminTag.vue'),
        //   meta: { title: '标签分类' },
        // },
        {
          path: 'levels',
          component: () => import('@/components/admin/AdminDifficulty.vue'),
          meta: { title: '难度分级' }
        },

        // 比赛管理
        {
          path: 'contests',
          component: () => import('@/components/admin/AdminContest.vue'),
          meta: { title: '比赛列表' },
        },

        // 评测管理
        {
          path: 'submissions',
          component: () => import('@/components/admin/AdminSubmission.vue'),
          meta: { title: '提交记录' }
        },
        {
          path: 'verdicts',
          component: () => import('@/components/admin/AdminVerdict.vue'),
          meta: { title: '评测状态' }
        },
        {
          path: 'code-langs',
          component: () => import('@/components/admin/AdminCodeLang.vue'),
          meta: { title: '编程语言' }
        },

        // 系统配置
        {
          path: 'user-langs',
          component: () => import('@/components/admin/AdminUserLang.vue'),
          meta: { title: '用户语言' }
        }
      ],
    },
  ],
})

setupRouterGuard(router)

export default router
