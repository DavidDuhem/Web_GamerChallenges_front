import { Alert, Box, Snackbar, TextField } from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router"
import EntryService from "../services/EntryService"
import { useAuthStore } from "../stores/authStore"
import { CustomModal } from "./CustomModal"

export interface UseFormInputs {
  title: string
  video_url: string
  user_id?: number
  challenge_id?: number
  entry_id?: number
}

export const CreateEntryModal = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const currentUser = useAuthStore((state) => state.user)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const { challengeId } = useParams()
  const queryClient = useQueryClient()

  const createEntryMutation = useMutation({
    mutationFn: (data: UseFormInputs) =>
      EntryService.createEntry(Number(challengeId), data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["challengeEntries", challengeId, currentUser?.id],
        exact: true,
      })
      await queryClient.refetchQueries({ type: "active" })
      setSnackbarOpen(true)
      handleClose()
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error)
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UseFormInputs>()

  const onSubmit = async (data: UseFormInputs) => {
    const payload = {
      ...data,
      challenge_id: Number(challengeId),
      user_id: currentUser?.id,
    }
    createEntryMutation.mutate(payload)
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
        title="Création de la participation"
        validationButtonText="Créer"
      >
        <Box className="flex flex-col">
          <>
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
                  value: /(www|http:|https:)+[^\s]+[\w]/,
                  message: "Format 'http(s)://' non respecté",
                },
              })}
              error={!!errors.video_url}
              helperText={errors.video_url?.message}
            />
          </>
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
          Participation créée avec succès !
        </Alert>
      </Snackbar>
    </>
  )
}
