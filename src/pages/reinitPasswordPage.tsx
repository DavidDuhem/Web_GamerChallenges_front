import { Box, Button, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useAuth } from "../hooks/useAuth"
import { useSearchParams } from "react-router-dom"
import type { ResetPasswordInfos } from "../types/auth"
import { useState } from "react"

export const ReinitPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const { resetPassword } = useAuth()
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<
    string | null
  >(null)
  const reinitPasswordForm = useForm<ResetPasswordInfos>()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = reinitPasswordForm

  const password = watch("password")

  const onSubmit = async (data: ResetPasswordInfos) => {
    const res = await resetPassword(data)
    setResetPasswordSuccess(res.message)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: "var(--margin-mobile)", sm: "var(--margin-desktop)" },
        marginTop: { sm: "var(--margin-desktop)" },
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Réinitialisation du mot de passe
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            flexDirection: "column",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <input type="hidden" value={token} {...register("token")} />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Mot de passe requis",
              minLength: { value: 12, message: "Minimum 12 caractères" },
              maxLength: { value: 100, message: "Maximum 100 caractères" },
              validate: (passwordInput) => {
                if (!/[a-z]/.test(passwordInput)) {
                  return "Le mot de passe doit contenir au moins une minuscule"
                }
                if (!/[A-Z]/.test(passwordInput)) {
                  return "Le mot de passe doit contenir au moins une majuscule"
                }
                if (!/[0-9]/.test(passwordInput)) {
                  return "Le mot de passe doit contenir au moins un chiffre"
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordInput)) {
                  return "Le mot de passe doit contenir au moins un caractère spécial"
                }
                return true
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            type="password"
            fullWidth
            margin="normal"
            {...register("confirm", {
              required: "Confirmation requise",
              validate: (passwordInput) =>
                passwordInput === password ||
                "Les mots de passe ne correspondent pas",
            })}
            error={!!errors.confirm}
            helperText={errors.confirm?.message}
          />
          {resetPasswordSuccess && (
            <p className="text-green-600">{resetPasswordSuccess}</p>
          )}
          <Button
            sx={{ mt: 2, width: "50%", mx: "auto" }}
            color="primary"
            variant="contained"
            type="submit"
          >
            {"Valider"}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
