import { TextField } from "@mui/material"
import type { UseFormReturn } from "react-hook-form"
import type { RegisterInfos } from "../../types/auth"

type RegisterFormProps = {
  form: UseFormReturn<RegisterInfos>
}

export const RegisterForm = ({ form }: RegisterFormProps) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form

  const password = watch("password")

  return (
    <>
      <TextField
        label="Avatar URL (optionnel)"
        type="text"
        fullWidth
        margin="normal"
        {...register("avatar", {
          validate: (avatar) => {
            const trimmedAvatar = avatar.trim()

            if (!trimmedAvatar) return true

            let url: URL
            try {
              url = new URL(trimmedAvatar)
            } catch {
              return "L'URL est invalide"
            }

            if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)) {
              return "L'URL doit pointer vers une image"
            }

            return true
          },
        })}
        error={!!errors.avatar}
        helperText={errors.avatar?.message}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        {...register("email", {
          required: "Email requis",
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Pseudo"
        type="text"
        fullWidth
        margin="normal"
        {...register("pseudo", {
          required: "Pseudo requis",
          maxLength: {
            value: 50,
            message: "Le pseudo ne peut pas dépasser 50 caractères",
          },
        })}
        error={!!errors.pseudo}
        helperText={errors.pseudo?.message}
      />
      <TextField
        label="Mot de passe"
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
        label="Confirmer le mot de passe"
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
    </>
  )
}
