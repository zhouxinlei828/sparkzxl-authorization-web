import { storage, tokenTableName, tokenTypeName } from '@/config'

export function getAccessToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTableName)
    } else {
      return localStorage.getItem(tokenTableName)
    }
  } else {
    return localStorage.getItem(tokenTableName)
  }
}

export function getTokenType() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTypeName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTypeName)
    } else {
      return localStorage.getItem(tokenTypeName)
    }
  } else {
    return localStorage.getItem(tokenTypeName)
  }
}

export function setAccessToken(accessToken) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenTableName, accessToken)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenTableName, accessToken)
    } else {
      return localStorage.setItem(tokenTableName, accessToken)
    }
  } else {
    return localStorage.setItem(tokenTableName, accessToken)
  }
}
export function setTokenType(accessToken, tokenType) {
  if (storage) {
    if ('localStorage' === storage) {
      localStorage.setItem(tokenTypeName, tokenType)
      return localStorage.setItem(tokenTableName, accessToken)
    } else if ('sessionStorage' === storage) {
      return localStorage.setItem(tokenTypeName, tokenType)
    } else {
      return localStorage.setItem(tokenTypeName, tokenType)
    }
  } else {
    return localStorage.setItem(tokenTypeName, tokenType)
  }
}

export function removeAccessToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(tokenTableName)
    }
  } else {
    return localStorage.removeItem(tokenTableName)
  }
}
