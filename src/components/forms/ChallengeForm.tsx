import { Autocomplete, TextField } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Controller, type UseFormReturn } from "react-hook-form"
import type { ChallengeDetails, ChallengeInfos } from "../../types/challenge"
import { fetchGameTitles } from "../../utils/gameTitles"
import { useEffect } from "react"

type ChallengeFormProps = {
  form: UseFormReturn<ChallengeInfos>
  challenge?: ChallengeDetails
}

export const ChallengeForm = ({ form, challenge }: ChallengeFormProps) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
    reset,
  } = form
  const { data: gameOptions = [] } = useQuery({
    queryKey: ["gameOptions"],
    queryFn: fetchGameTitles,
  })
  useEffect(() => {
    if (challenge) {
      reset({
        title: challenge.title,
        description: challenge.description,
        rules: challenge.rules,
        game_title: challenge.game.title,
      })
    }
  }, [challenge, reset])
  return (
    <>
      <TextField
        label="Titre du challenge"
        type="text"
        fullWidth
        margin="normal"
        {...register("title", {
          required: "champ requis",
          maxLength: { value: 100, message: "Maximum 100 caractères" },
        })}
        error={!!errors.title}
        helperText={
          errors.title?.message ||
          `${watch("title")?.length || 0}/100 caractères`
        }
        sx={{ marginBottom: 2 }}
        multiline
        rows={1}
        variant="outlined"
      />
      <TextField
        label="Description"
        type="text"
        fullWidth
        margin="normal"
        {...register("description", {
          required: "champ requis",
          maxLength: { value: 200, message: "Maximum 200 caractères" },
          minLength: { value: 10, message: "Minimum 10 caractères" },
        })}
        sx={{ marginBottom: 2 }}
        multiline
        rows={1}
        variant="outlined"
        error={!!errors.description}
        helperText={
          errors.description?.message ||
          `${watch("description")?.length || 0}/200 caractères`
        }
      />
      <TextField
        label="Règles"
        type="text"
        fullWidth
        margin="normal"
        {...register("rules", {
          required: "champ requis",
          maxLength: { value: 200, message: "Maximum 200 caractères" },
          minLength: { value: 10, message: "Minimum 10 caractères" },
        })}
        multiline
        rows={1}
        variant="outlined"
        error={!!errors.rules}
        helperText={
          errors.rules?.message ||
          `${watch("rules")?.length || 0}/200 caractères`
        }
      />
      <Controller
        name="game_title"
        control={control}
        rules={{ required: "champ requis" }}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={gameOptions}
            getOptionLabel={(option) => option}
            value={field.value || null}
            onChange={(_, value) => field.onChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Titre du jeu"
                type="text"
                fullWidth
                margin="normal"
                error={!!errors.game_title}
                helperText={errors.game_title?.message}
              />
            )}
          />
        )}
      />
    </>
  )
}
