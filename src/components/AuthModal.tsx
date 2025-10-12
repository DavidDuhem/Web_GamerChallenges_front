import { useState } from "react"
import { useForm } from "react-hook-form"
import { CustomModal } from "./CustomModal"
import { RegisterForm } from "./forms/RegisterForm"
import { LoginForm } from "./forms/LoginForm"
import { useAuth } from "../hooks/useAuth"
import { useAuthStore } from "../stores/authStore"
import { Button } from "@mui/material"
import { ForgotPasswordForm } from "./forms/ForgotPasswordForm"
import type {
  LoginInfos,
  RegisterInfos,
  AuthModalProps,
  FormType,
  RegisterError,
  ForgotPasswordInfos,
} from "../types/auth"
import type { AxiosError } from "axios"

export const AuthModal = ({ open, setOpen }: AuthModalProps) => {
  const { loginAccount, registerAccount, forgotPassword } = useAuth()
  const setUser = useAuthStore((state) => state.setUser)

  const [currentFormType, setCurrentFormType] = useState<FormType>("login")
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<
    string | null
  >(null)

  const loginForm = useForm<LoginInfos>()
  const registerForm = useForm<RegisterInfos>()
  const forgotPasswordForm = useForm<ForgotPasswordInfos>()

  const { setError: setLoginError } = loginForm
  const { setError: setRegisterError } = registerForm

  const onSubmitLogin = async (data: LoginInfos) => {
    try {
      const res = await loginAccount(data)
      setUser(res.user)
      onClose()
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setLoginError("email", {
        type: "manual",
        message: axiosError.response?.data?.message,
      })
      setLoginError("password", {
        type: "manual",
        message: axiosError.response?.data?.message,
      })
    }
  }

  const onSubmitRegister = async (data: RegisterInfos) => {
    try {
      const res = await registerAccount(data)
      setUser(res.user)
      onClose()
    } catch (error) {
      const axiosError = error as AxiosError<RegisterError>
      const apiErrors = axiosError.response?.data.errors
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([key, message]) => {
          setRegisterError(key as "email" | "pseudo", {
            type: "manual",
            message: message as string,
          })
        })
      }
    }
  }

  const onSubmitForgotPassword = async (data: ForgotPasswordInfos) => {
    try {
      const res = await forgotPassword({ email: data.email })
      setForgotPasswordSuccess(res.message)
      setTimeout(() => {
        onClose()
      }, 5000)
    } catch (error) {
      console.error(error)
    }
  }

  const onClose = () => {
    loginForm.reset()
    registerForm.reset()
    forgotPasswordForm.reset()
    setForgotPasswordSuccess(null)
    setCurrentFormType("login")
    setOpen(false)
  }

  const currentTitle = () => {
    switch (currentFormType) {
      case "login":
        return "Connexion"
      case "register":
        return "Création de compte"
      case "forgotPassword":
        return "Mot de passe oublié"
    }
  }

  return (
    <CustomModal
      open={open}
      onSubmit={
        currentFormType === "login"
          ? loginForm.handleSubmit(onSubmitLogin)
          : currentFormType === "register"
            ? registerForm.handleSubmit(onSubmitRegister)
            : forgotPasswordForm.handleSubmit(onSubmitForgotPassword)
      }
      onClose={onClose}
      title={currentTitle()}
    >
      <div className="flex flex-col">
        {currentFormType === "login" ? (
          <LoginForm form={loginForm} />
        ) : currentFormType === "register" ? (
          <RegisterForm form={registerForm} />
        ) : (
          <ForgotPasswordForm form={forgotPasswordForm} />
        )}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() =>
              setCurrentFormType(
                currentFormType === "login" ? "register" : "login"
              )
            }
          >
            {currentFormType === "login"
              ? "Créer un compte"
              : "Déjà un compte ?"}
          </Button>
        </div>
        <div className="flex justify-end">
          {currentFormType === "login" && (
            <Button
              type="button"
              onClick={() => setCurrentFormType("forgotPassword")}
            >
              Mot de passe oublié ?
            </Button>
          )}
        </div>
        {forgotPasswordSuccess && (
          <p className="text-green-600">{forgotPasswordSuccess}</p>
        )}
      </div>
    </CustomModal>
  )
}
