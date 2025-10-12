import axios from "axios"
import AuthService from "./AuthService"
import { useAuthStore } from "../stores/authStore"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    if (
      error.response?.status === 401 &&
      !request._retry &&
      !request.url?.includes("/refresh")
    ) {
      request._retry = true

      try {
        const newToken = await AuthService.getNewAccessToken()
        if (newToken !== null) {
          useAuthStore.getState().setAccessToken(newToken)
          return axiosClient(request)
        } else {
          useAuthStore.getState().logout()
          return Promise.reject(error)
        }
      } catch {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
