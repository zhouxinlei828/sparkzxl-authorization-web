/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import { getInfo, login } from '@/api/login'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
  setTokenType,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'

const state = () => ({
  tokenType: 'bearer ',
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  roles: [],
  permissions: [],
})
const getters = {
  tokenType: (state) => state.tokenType,
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  roles: (state) => state.roles,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setTokenType(state, tokenType) {
    state.tokenType = tokenType.concat(' ')
    setTokenType(tokenType)
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}
const actions = {
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo)
    const accessToken = data['access_token']
    const tokenType = data['token_type']
    if (accessToken) {
      commit('setAccessToken', accessToken)
      commit('setTokenType', tokenType)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  async getUserInfo({ commit }) {
    const { data } = await getInfo()
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let { username, avatar, roleBasicInfos } = data
    if (data) {
      commit('SET_INFO', data)
      commit('setUsername', username)
      commit('setAvatar', avatar)
      commit('SET_ROLES', roleBasicInfos)
      return data
    } else {
      Vue.prototype.$baseMessage('用户信息接口异常', 'error')
      return false
    }
  },
  async logout({ dispatch }) {
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default { state, getters, mutations, actions }
