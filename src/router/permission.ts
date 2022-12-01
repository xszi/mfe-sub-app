import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'
import { RouteLocationNormalized } from 'vue-router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
import { ElMessage } from 'element-plus'
import { whiteList } from '@/config/white-list'
import rolesSettings from '@/config/roles'
import { addVisitedViewCache } from '@/utils/routeCache'
// import { getToken } from '@/utils/cookies'

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {
  addVisitedViewCache(to)
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const getToken = () => {
    const token = sessionStorage.getItem('frame_token') || 'aaa'
    return token
  }

  // 判断该用户是否登录
  if (getToken()) {
    if (to.path === '/login') {
      // 如果登录，并准备进入 login 页面，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查用户是否已获得其权限角色
      if (userStore.roles.length === 0) {
        try {
          if (rolesSettings.openRoles) {
            // 注意：角色必须是一个数组！ 例如: ['admin'] 或 ['developer', 'editor']
            await userStore.getInfo()
            // 获取接口返回的 roles
            const roles = userStore.roles
            // 根据角色生成可访问的 routes
            permissionStore.setRoutes(roles)
          } else {
            // 没有开启角色功能，则启用默认角色
            userStore.setRoles(rolesSettings.defaultRoles)
            permissionStore.setRoutes(rolesSettings.defaultRoles)
          }
          // 动态地添加可访问的 routes
          permissionStore.dynamicRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 确保添加路由已完成
          // 设置 replace: true, 因此导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (err: any) {
          // 删除 token，并重定向到登录页面
          userStore.resetToken()
          ElMessage.error(err.message || 'Has Error')
          next('/login')
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // 如果没有 token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在免登录的白名单中，则直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
