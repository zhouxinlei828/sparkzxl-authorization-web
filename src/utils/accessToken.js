import { storage, tokenKeyName, tokenTypeKeyName } from '@/config'

export function getAccessToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenKeyName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenKeyName)
    } else {
      return localStorage.getItem(tokenKeyName)
    }
  } else {
    return localStorage.getItem(tokenKeyName)
  }
}

export function getTokenType() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTypeKeyName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTypeKeyName)
    } else {
      return localStorage.getItem(tokenTypeKeyName)
    }
  } else {
    return localStorage.getItem(tokenTypeKeyName)
  }
}

export function setAccessToken(accessToken) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenKeyName, accessToken)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenKeyName, accessToken)
    } else {
      return localStorage.setItem(tokenKeyName, accessToken)
    }
  } else {
    return localStorage.setItem(tokenKeyName, accessToken)
  }
}
export function setTokenType(accessToken, tokenType) {
  if (storage) {
    if ('localStorage' === storage) {
      localStorage.setItem(tokenTypeKeyName, tokenType)
      return localStorage.setItem(tokenTypeKeyName, accessToken)
    } else if ('sessionStorage' === storage) {
      return localStorage.setItem(tokenTypeKeyName, tokenType)
    } else {
      return localStorage.setItem(tokenTypeKeyName, tokenType)
    }
  } else {
    return localStorage.setItem(tokenTypeKeyName, tokenType)
  }
}

export function removeAccessToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenKeyName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(tokenKeyName)
    }
  } else {
    return localStorage.removeItem(tokenKeyName)
  }
}

export function removeTokenType() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenTypeKeyName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(tokenTypeKeyName)
    }
  } else {
    return localStorage.removeItem(tokenTypeKeyName)
  }
}
