import { TextField } from "@mui/material"
import type { UseFormReturn } from "react-hook-form"
import type { LoginInfos } from "../../types/auth"

type LoginFormProps = {
  form: UseFormReturn<LoginInfos>
}

export const LoginForm = ({ form }: LoginFormProps) => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        {...register("email", { required: "Email requis" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        margin="normal"
        {...register("password", { required: "Mot de passe requis" })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
    </>
  )
}
