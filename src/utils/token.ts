import AuthService from "../services/AuthService"
import { useAuthStore } from "../stores/authStore"
import { jwtDecode } from "jwt-decode"

export async function refreshTokenIfInvalid(): Promise<void> {
  const authStore = useAuthStore.getState()
  const token = authStore.accessToken

  if (!token || !isAccessTokenValid(token)) {
    const newToken = await AuthService.getNewAccessToken()
    if (newToken) {
      authStore.setAccessToken(newToken)
    } else {
      await AuthService.logout()
      authStore.logout()
    }
  }
}

function isAccessTokenValid(token: string): boolean {
  try {
    const payload = jwtDecode<{ exp: number }>(token)
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
