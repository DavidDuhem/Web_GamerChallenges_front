import { Alert, Box, Snackbar, TextField } from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import EntryService from "../../services/EntryService"
import { useAuthStore } from "../../stores/authStore"
import type { UseFormInputs } from "../CreateEntryModal"
import { CustomModal } from "../CustomModal"

export const UpdateEntryModal = ({
  open,
  setOpen,
  entryId,
  entryData,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  entryId: number
  entryData: UseFormInputs
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UseFormInputs>({
    defaultValues: entryData,
  })
  useEffect(() => {
    reset(entryData)
  }, [entryData, reset])
  const queryClient = useQueryClient()
  const challengeId = entryData.challenge_id
  const currentUser = useAuthStore((state) => state.user)
  const updateEntryMutation = useMutation({
    mutationFn: ({ entryId, data }: { entryId: number; data: UseFormInputs }) =>
      EntryService.updateEntry(entryId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["challengeEntries", challengeId, currentUser?.id],
        exact: true,
      })
      await queryClient.refetchQueries({ type: "active" })
      setSnackbarOpen(true)
      handleClose()
    },
  })
  const onSubmit = async (data: UseFormInputs) => {
    try {
      await updateEntryMutation.mutateAsync({
        entryId,
        data: {
          ...data,
          challenge_id: entryData.challenge_id,
          user_id: entryData.user_id,
        },
      })
      setSnackbarOpen(true)
      handleClose()
    } catch (error) {
      console.error(error)
    }
  }
  const handleClose = () => {
    reset()
    setOpen(false)
  }
  return (
    <>
      <CustomModal
        open={open}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        title="Modifier la participation"
        validationButtonText="Modifier"
      >
        <Box className="flex flex-col">
          <TextField
            label="Titre"
            fullWidth
            margin="normal"
            {...register("title", {
              required: "Titre requis",
              minLength: { value: 5, message: "Minimum de 5 caractères" },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Video URL"
            fullWidth
            margin="normal"
            {...register("video_url", {
              required: "URL video requise",
              pattern: {
                value: /^(https?:\/\/[^\s]+)$/,
                message: "Format 'http(s)://' non respecté",
              },
            })}
            error={!!errors.video_url}
            helperText={errors.video_url?.message}
          />
        </Box>
      </CustomModal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Participation Modifiée avec succès !
        </Alert>
      </Snackbar>
    </>
  )
}
