import { useMutation } from "@tanstack/react-query"
import type {
  ForgotPasswordInfos,
  ResetPasswordInfos,
  LoginInfos,
  RegisterInfos,
} from "../types/auth"
import AuthService from "../services/AuthService"
import { queryClient } from "../main"
import { useAuthStore } from "../stores/authStore"

export const useAuth = () => {
  const loginAccountMutation = useMutation({
    mutationFn: (credentials: LoginInfos) => AuthService.login(credentials),
    onSuccess: (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken || null)
    },
  })

  const registerAccountMutation = useMutation({
    mutationFn: (registerInfos: RegisterInfos) =>
      AuthService.register(registerInfos),
    onSuccess: (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken || null)
    },
  })

  const logoutAccountMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      useAuthStore.getState().setAccessToken(null)
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: (userId: number) => AuthService.softDeleteUser(userId),
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (userEmail: ForgotPasswordInfos) =>
      AuthService.forgotPassword(userEmail),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: ({ password, confirm, token }: ResetPasswordInfos) =>
      AuthService.resetPassword({ password, confirm, token }),
  })

  const loginAccount = async (credentials: LoginInfos) => {
    const logIn = loginAccountMutation.mutateAsync(credentials)
    queryClient.invalidateQueries() // Clear all cached queries
    return logIn
  }

  const registerAccount = async (registerInfos: RegisterInfos) => {
    const register = registerAccountMutation.mutateAsync(registerInfos)
    queryClient.invalidateQueries() // Clear all cached queries
    return register
  }

  const logoutAccount = async () => {
    const logout = logoutAccountMutation.mutateAsync()
    queryClient.invalidateQueries() // Clear all cached queries
    return logout
  }

  const deleteAccount = async (userId: number) => {
    return deleteAccountMutation.mutateAsync(userId)
  }

  const forgotPassword = async (userEmail: ForgotPasswordInfos) => {
    return forgotPasswordMutation.mutateAsync(userEmail)
  }

  const resetPassword = async ({
    password,
    confirm,
    token,
  }: ResetPasswordInfos) => {
    return resetPasswordMutation.mutateAsync({ password, confirm, token })
  }

  return {
    loginAccount,
    registerAccount,
    logoutAccount,
    deleteAccount,
    forgotPassword,
    resetPassword,
    loginAccountMutation,
    registerAccountMutation,
    logoutAccountMutation,
    deleteAccountMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  }
}
