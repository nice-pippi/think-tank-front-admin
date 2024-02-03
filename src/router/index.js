import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]

  },
  {
    path: '/application',
    component: Layout,
    meta: { title: '申请记录', icon: 'el-icon-view' },
    children: [
      {
        path: 'block',
        name: 'Block',
        component: () => import('@/views/application-block/index'),
        meta: { title: '板块创建申请', icon: 'el-icon-s-grid' }
      },
      {
        path: 'master',
        name: 'Master',
        component: () => import('@/views/application-master/index'),
        meta: { title: '板块板主申请', icon: 'el-icon-user-solid' }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    meta: { title: '举报记录', icon: 'el-icon-warning' },
    children: [
      {
        path: 'post',
        name: 'Post',
        component: () => import('@/views/report-post/index'),
        meta: { title: '举报帖子', icon: 'el-icon-document' }
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/report-comment/index'),
        meta: { title: '举报评论', icon: 'el-icon-chat-line-round' }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    meta: { title: '综合管理', icon: 'el-icon-s-flag' },
    children: [
      {
        path: 'blockclassify',
        name: 'Blockclassify',
        component: () => import('@/views/manage-blockclassify/index'),
        meta: { title: '板块分类', icon: 'el-icon-s-management' }
      },
      {
        path: 'block',
        name: 'Block',
        component: () => import('@/views/manage-block/index'),
        meta: { title: '板块管理', icon: 'el-icon-s-ticket' }
      },
      {
        path: 'post',
        name: 'Post',
        component: () => import('@/views/manage-post/index'),
        meta: { title: '帖子管理', icon: 'el-icon-edit-outline' }
      },
      {
        path: 'master',
        name: 'Master',
        component: () => import('@/views/manage-master/index'),
        meta: { title: '板主管理', icon: 'el-icon-s-custom' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/manage-user/index'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
