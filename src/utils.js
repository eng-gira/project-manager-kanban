import jwt_decode from "jwt-decode"

export function uuid () {
  return Math.random().toString(16).slice(2)
}

export function hasExpired(token) {
  const decoded = jwt_decode(token)
  const now = Date.now() / 1000

  if(! decoded || now >= decoded.exp) {
    return true
  }
  return false
}

export function expiryData(token) {
  const decoded = jwt_decode(token)
  const now = Date.now() / 1000

  console.log('now:', now)
  console.log('decoded.exp:', decoded.exp)
}