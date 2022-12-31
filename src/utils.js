import jwt_decode from "jwt-decode"

export function isProjectAdmin (adminId) {
  const token = localStorage.getItem('access_token')
  let decoded = jwt_decode(token)

  return decoded.user.id == adminId
}

export function nearlyExpired(token) {
  const decoded = jwt_decode(token)
  const now = Date.now() / 1000

  if(! decoded || ((now + 30) >= decoded.exp)) {
    return true
  }
  return false
}

export function expiryData(token) {
  const decoded = jwt_decode(token)
  const now = Date.now() / 1000
}