import request from '@/utils/request'

const userApi = {
  Login: '/authorization/oauth/token',
  Logout: '/authorization/logout',
  ForgePassword: '/authorization/forge-password',
  Register: '/authorization/register',
  getCaptcha: '/authorization/oauth/captcha',
  SendSmsErr: '/account/sms_err',
  UserInfo: '/authorization/user/currentUser',
  authorizeUrl: '/authorization/oauth/getAuthorizeUrl',
  UserMenu: '/authorization/user/routers',
}

export function login(parameter) {
  const data = { ...parameter }
  data.grantType = 'password'
  data.scope = 'all'
  delete data.tenant
  return request({
    url: userApi.Login,
    method: 'post',
    data: data,
    headers: {
      Authorization: 'Basic c3Bhcmt6eGw6MTIzNDU2',
      'Content-Type': 'application/json',
    },
  })
}

export function getInfo() {
  return request({
    url: userApi.UserInfo,
    method: 'get',
  })
}
export function getAuthorizeUrl(parameter) {
  return request({
    url: userApi.authorizeUrl,
    method: 'get',
    params: parameter,
  })
}

export function getCurrentUserNav() {
  return request({
    url: userApi.UserMenu,
    method: 'get',
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function getCaptcha(parameter) {
  return request({
    url: userApi.getCaptcha,
    method: 'get',
    params: parameter,
  })
}
