import BaseService from "./BaseService"
import axiosClient from "./axiosClient"
import { handleAxiosError } from "../utils/handleAxiosError"
import { refreshTokenIfInvalid } from "../utils/token"
import type {
  LoginInfos,
  UserResponse,
  User,
  RegisterInfos,
  ResetPasswordInfos,
} from "../types/auth"
import { queryClient } from "../main"

class AuthService extends BaseService<User> {
  constructor() {
    super("/auth")
  }

  async login(credentials: LoginInfos): Promise<UserResponse> {
    const res = await handleAxiosError(() =>
      axiosClient.post<UserResponse>(`${this.endpoint}/login`, credentials)
    )
    queryClient.invalidateQueries({ queryKey: ["challengesList"] })
    return res.data
  }

  async logout(): Promise<void> {
    await handleAxiosError(() => axiosClient.post(`${this.endpoint}/logout`))
    queryClient.invalidateQueries({ queryKey: ["challengesList"] })
  }

  async register(registerInfos: RegisterInfos): Promise<UserResponse> {
    const res = await handleAxiosError(() =>
      axiosClient.post<UserResponse>(`${this.endpoint}/register`, registerInfos)
    )
    return res.data
  }

  async getCurrentUser(): Promise<User> {
    await refreshTokenIfInvalid()
    const res = await handleAxiosError(() =>
      axiosClient.get<UserResponse>(`${this.endpoint}/me`)
    )
    return res.data.user
  }

  async softDeleteUser(userId: number): Promise<void> {
    await refreshTokenIfInvalid()
    await handleAxiosError(() =>
      axiosClient.patch(`${this.endpoint}/delete/${userId}`)
    )
  }

  async getNewAccessToken(): Promise<string | null> {
    const res = await handleAxiosError(() =>
      axiosClient.post<{ accessToken: string }>(`${this.endpoint}/refresh`)
    )
    return res.data.accessToken || null
  }

  async forgotPassword(payload: {
    email: string
  }): Promise<{ message: string }> {
    const res = await handleAxiosError(() =>
      axiosClient.post<{ message: string }>(
        `${this.endpoint}/forgot-password`,
        payload
      )
    )
    return res.data
  }

  async resetPassword(
    payload: ResetPasswordInfos
  ): Promise<{ message: string }> {
    const res = await handleAxiosError(() =>
      axiosClient.post<{ message: string }>(
        `${this.endpoint}/reset-password`,
        payload
      )
    )
    return res.data
  }
}

export default new AuthService()
