import { IconButton, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { CustomModal } from "./CustomModal"
import { useState } from "react"

interface DeleteEntryProp {
  onDelete?: () => void
}

export const EntryDelete = ({ onDelete }: DeleteEntryProp) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleConfirmDeleteEntry = () => {
    handleClose()
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <>
      <IconButton aria-label="supprimer" onClick={handleOpen}>
        <DeleteIcon sx={{ color: "var(--danger-red)" }} />
      </IconButton>
      <CustomModal
        open={open}
        onSubmit={handleConfirmDeleteEntry}
        onClose={handleClose}
        title="Suppression de la participation"
      >
        <Typography>
          Êtes-vous sûr de vouloir supprimer cette participation ? Cette action
          est irréversible.
        </Typography>
      </CustomModal>
    </>
  )
}
