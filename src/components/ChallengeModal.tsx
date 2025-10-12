import { Alert, Snackbar } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ChallengeService from "../services/ChallengeService"
import { useAuthStore } from "../stores/authStore"
import type { ChallengeInfos } from "../types/challenge"
import { CustomModal } from "./CustomModal"
import { ChallengeForm } from "./forms/ChallengeForm"

export default function ChallengeModal({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const challengeForm = useForm<ChallengeInfos>()
  const handleClose = () => {
    challengeForm.reset()
    setOpen(false)
  }
  const user = useAuthStore((state) => state.user)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  if (!isLoggedIn || !user) return null
  const onSubmitChallenge = async (data: ChallengeInfos) => {
    const response = await ChallengeService.create(data)
    if (!response) throw new Error("Erreur lors de l'envoi")
    setSnackbarOpen(true)
    handleClose()
  }
  return (
    <>
      <CustomModal
        open={open}
        onSubmit={challengeForm.handleSubmit(onSubmitChallenge)}
        onClose={handleClose}
        title="Création de challenge"
      >
        <ChallengeForm form={challengeForm} />
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
          Challenge envoyé avec succès !
        </Alert>
      </Snackbar>
    </>
  )
}
