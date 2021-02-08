import { isUrl } from '@/utils/util'

export const convertRouter = (routerMap, parent) => {
  return routerMap.map((item) => {
    let { label, component, show, hideChildren, icon } = item || {}
    const currentRouter = {
      alwaysShow: true,
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.label || item.key || '',
      redirect: item.redirect !== undefined ? item.redirect : 'noRedirect',
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        noKeepAlive: true,
      },
    }
    if (label !== undefined && label !== '') {
      currentRouter.meta.title = label
    } else if (item.name !== undefined) {
      currentRouter.meta.title = item.name
    }
    if (icon !== undefined && icon !== '') {
      currentRouter.meta.icon = icon
    }
    if (component) {
      if (component === 'Layout') {
        component = (resolve) => require(['@/layouts'], resolve)
      } else if (component === 'EmptyLayout') {
        component = (resolve) => require(['@/layouts/EmptyLayout'], resolve)
      } else {
        const index = component.indexOf('views')
        const path = index > 0 ? component.slice(index) : `views/${component}`
        component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    currentRouter.component = component
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    if (isUrl(item.path)) {
      currentRouter.meta.target = '_blank'
    }

    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = convertRouter(item.children, currentRouter)
    } else {
      delete currentRouter.children
    }
    return currentRouter
  })
}

export function filterAsyncRoutes(routes, roles) {
  const finallyRoutes = []
  routes.forEach((route) => {
    const item = { ...route }
    debugger
    if (route.children && route.children.length) {
      item.children = filterAsyncRoutes(item.children, roles)
      finallyRoutes.push(item)
    }
  })
  return finallyRoutes
}
