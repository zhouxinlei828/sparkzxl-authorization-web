/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { getCurrentUserNav } from '@/api/login'
import { convertRouter, filterAsyncRoutes } from '@/utils/handleRoutes'

const state = () => ({
  routes: [],
  partialRoutes: [],
})
const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setAllRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = constantRoutes.concat(routes)
  },
}
const rootRouter = {
  path: '/',
  component: 'Layout',
  redirect: 'index',
  children: [
    {
      path: 'index',
      name: 'Index',
      component: 'index/index',
      meta: {
        title: '首页',
        icon: 'home',
        affix: true,
      },
    },
  ],
}

const actions = {
  async setRoutes({ commit }, permissions) {
    const finallyAsyncRoutes = await filterAsyncRoutes(
      [...asyncRoutes],
      permissions
    )
    commit('setRoutes', finallyAsyncRoutes)
    return finallyAsyncRoutes
  },
  async setAllRoutes({ commit }) {
    let { data } = await getCurrentUserNav()
    data.push({
      name: '404',
      path: '*',
      redirect: '/404',
      hidden: true,
      component: '@/views/404',
      meta: { title: '404' },
    })
    const menuNav = []
    menuNav.push(rootRouter)
    data.forEach((result) => {
      const item = { ...result }
      menuNav.push(item)
    })
    let accessRoutes = convertRouter(menuNav)
    console.log(accessRoutes)
    debugger
    commit('setAllRoutes', accessRoutes)
    return accessRoutes
  },
  setPartialRoutes({ commit }, accessRoutes) {
    commit('setPartialRoutes', accessRoutes)
    return accessRoutes
  },
}
export default { state, getters, mutations, actions }
