export interface User {
  id: number
  pseudo: string
  email: string
  role: "admin" | "member"
  avatar: string
}

export interface UserResponse {
  message?: string
  user: User
  accessToken?: string
}

export interface LoginInfos {
  email: string
  password: string
}

export interface ForgotPasswordInfos {
  email: string
}

export interface ResetPasswordInfos {
  password: string
  confirm: string
  token: string
}

export interface RegisterInfos {
  pseudo: string
  email: string
  password: string
  confirm: string
  avatar: string
}

export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isLoading: boolean
  accessToken: string | null
  setUser: (user: User | null) => void
  logout: () => void
  setAccessToken: (token: string | null) => void
}

export type AuthModalProps = {
  open: boolean
  setOpen: (value: boolean) => void
}

export type RegisterError = {
  errors?: {
    email?: string
    pseudo?: string
  }
}

export type FormType = "login" | "register" | "forgotPassword"
