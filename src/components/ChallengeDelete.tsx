import { Alert, Chip, Snackbar, Typography } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import ChallengeService from "../services/ChallengeService"
import { queryClient } from "../main"
import { useNavigate } from "react-router"
import { CustomModal } from "./CustomModal"
import { useState } from "react"

interface DeleteChallengeProp {
  challenge_id: number
}

export const ChallengeDelete = ({ challenge_id }: DeleteChallengeProp) => {
  const [open, setOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  )
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const navigate = useNavigate()

  const { mutate: deleteChallenge } = useMutation({
    mutationFn: (challengeId: number) =>
      ChallengeService.deleteChallenge(challengeId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["challengeDetails", challenge_id],
      })
      queryClient.removeQueries({ queryKey: ["challengesList"] })
      setSnackbarSeverity("success")
      setSnackbarMessage("Challenge supprimé avec succès !")
      setSnackbarOpen(true)
      setTimeout(() => navigate("/challenges"), 500)
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression:", error)
      setSnackbarSeverity("error")
      setSnackbarMessage("Erreur lors de la suppression !")
      setSnackbarOpen(true)
    },
  })
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleConfirmDeleteChallenge = () => {
    deleteChallenge(Number(challenge_id))
    handleClose()
  }
  return (
    <>
      <Chip
        label="SUPPRIMER"
        color="primary"
        sx={{
          color: "var(--danger-red)",
          borderColor: "var(--danger-red)",
          "&:hover": {
            backgroundColor: "var(--danger-red) !important",
            color: "var(--lavander)",
            cursor: "pointer",
          },
        }}
        variant="outlined"
        onClick={handleOpen}
      />
      <CustomModal
        open={open}
        onSubmit={handleConfirmDeleteChallenge}
        onClose={handleClose}
        title="Suppression du challenge"
      >
        <Typography>
          Êtes-vous sûr de vouloir supprimer ce challenge ? Cette action est
          irréversible.
        </Typography>
      </CustomModal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
