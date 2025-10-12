import { Chip } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { ChallengeDetails, ChallengeInfos } from "../types/challenge"
import { useMutation } from "@tanstack/react-query"
import ChallengeService from "../services/ChallengeService"
import { queryClient } from "../main"
import { ChallengeForm } from "./forms/ChallengeForm"
import { CustomModal } from "./CustomModal"

interface ChallengeEditModalProp {
  challenge: ChallengeDetails
}

export const ChallengeEdit = ({ challenge }: ChallengeEditModalProp) => {
  const [open, setOpen] = useState(false)
  const challengeForm = useForm<ChallengeInfos>()

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    challengeForm.reset()
    setOpen(false)
  }

  const { mutate: updateChallenge, isPending } = useMutation({
    mutationFn: (data: ChallengeInfos) =>
      ChallengeService.update(challenge.challenge_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["challengeDetails"],
      })
      queryClient.removeQueries({ queryKey: ["challengesList"] })
      handleClose()
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour:", error)
    },
  })

  const onSubmitChallenge = () => {
    challengeForm.handleSubmit((data) => {
      updateChallenge(data)
    })()
  }

  return (
    <>
      <Chip label="EDITER" color="primary" size="medium" onClick={handleOpen} />
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Edition du challenge"
        validationButtonText={isPending ? "Enregistrement..." : "Enregistrer"}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmitChallenge()
        }}
      >
        <ChallengeForm form={challengeForm} challenge={challenge} />
      </CustomModal>
    </>
  )
}
