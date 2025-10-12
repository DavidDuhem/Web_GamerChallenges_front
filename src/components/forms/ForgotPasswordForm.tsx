import { TextField } from "@mui/material"
import type { UseFormReturn } from "react-hook-form"
import type { ForgotPasswordInfos } from "../../types/auth"

type ForgotPasswordForm = {
  form: UseFormReturn<ForgotPasswordInfos>
}

export const ForgotPasswordForm = ({ form }: ForgotPasswordForm) => {
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
    </>
  )
}
