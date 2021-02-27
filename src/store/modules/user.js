import Vue from 'vue'
import { getAuthorizeUrl, getInfo, login, logout } from '@/api/login'
import {
  getAccessToken,
  removeAccessToken,
  removeTokenType,
  setAccessToken,
  setTokenType,
  setTenant,
  getTenant,
  getTokenType,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title } from '@/config'

const state = () => ({
  tokenType: getTokenType(),
  accessToken: getAccessToken(),
  tenant: getTenant(),
  username: '',
  avatar: '',
  roles: [],
  permissions: [],
})
const getters = {
  tokenType: (state) => state.tokenType,
  accessToken: (state) => state.accessToken,
  tenant: (state) => state.tenant,
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
    state.tokenType = tokenType
    setTokenType(tokenType)
  },
  setTenant(state, tenant) {
    state.tenant = tenant
    setTenant(tenant)
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
    const tenant = data['tenant']
    if (accessToken) {
      commit('setAccessToken', accessToken)
      commit('setTokenType', tokenType)
      commit('setTenant', tenant)
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
      Vue.prototype.$baseMessage(`登录接口异常，未正确返回token...`, 'error')
    }
  },
  async authorizationLogin({ commit }, tokenData) {
    const accessToken = tokenData['access_token']
    const tokenType = tokenData['token_type']
    const tenant = tokenData['tenant']
    if (accessToken) {
      commit('setAccessToken', accessToken)
      commit('setTokenType', tokenType)
      commit('setTenant', tenant)
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
      return true
    }
    return false
  },
  async getUserInfo({ commit }) {
    const { data } = await getInfo()
    if (!data) {
      Vue.prototype.$baseMessage('获取用户信息失败，请重新登录...', 'error')
      return false
    }
    let { name, avatar, roleBasicInfos } = data
    commit('SET_INFO', data)
    commit('setUsername', name)
    commit('setAvatar', avatar)
    commit('SET_ROLES', roleBasicInfos)
    return data
  },
  async logout({ dispatch }, frontUrl) {
    const response = await logout()
    const responseData = response.data
    if (responseData === 1) {
      await dispatch('resetAccessToken')
      await resetRouter()
      let url = ''
      if (frontUrl !== undefined) {
        url = frontUrl
      }
      const { data } = await getAuthorizeUrl({ frontUrl: url })
      if (!data) {
        Vue.prototype.$baseMessage('获取授权登录地址，请重新获取...', 'error')
        return false
      } else {
      }
      window.location.href = data
    }
  },

  async resetAccessToken({ commit }) {
    commit('SET_INFO', '')
    commit('setUsername', '')
    commit('setAvatar', '')
    commit('SET_ROLES', '')
    commit('setAccessToken', '')
    removeAccessToken()
    removeTokenType()
  },
}
export default { state, getters, mutations, actions }
