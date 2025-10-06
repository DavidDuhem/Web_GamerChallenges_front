// import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Modal,
  Typography,
} from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import ReactPlayer from "react-player"
import avatarDefault from "../assets/avatar.svg"
import { UpdateEntryModal } from "../components/forms/EntryForm"
import EntryService from "../services/EntryService"
import { useAuthStore } from "../stores/authStore"
import type { UseFormInputs } from "./CreateEntryModal"
import { EntryDelete } from "./EntryDelete"
interface EntryCardProps {
  entry_id: number
  image?: string
  pseudo: string | number
  description: string
  videoUrl?: string
  isOwner: boolean
  userHasVoted: boolean
  entryData: UseFormInputs
  onDelete?: (entryId: number) => void
}

export default function EntryCard({
  entry_id,
  entryData,
  image,
  pseudo,
  description,
  videoUrl,
  isOwner,
  userHasVoted,
  onDelete,
}: EntryCardProps) {
  const [liked, setLiked] = useState(userHasVoted)
  const isLogIn = useAuthStore((state) => state.isLoggedIn)
  const toggleVote = useMutation({
    mutationFn: (challengeId: number) =>
      EntryService.toggleEntryVote(challengeId),
  })
  const handleVoteToggle = async () => {
    const res = await toggleVote.mutateAsync(Number(entry_id))
    setLiked(res.voted)
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(entry_id)
    }
    handleClose()
  }

  return (
    <>
      <Card
        sx={{
          backgroundColor: "var(--jet)",
          color: "var(--lavander)",

          maxWidth: {
            xs: "280px",
            md: "450px",
          },

          minWidth: {
            xs: "280px",
            md: "300px",
          },
        }}
      >
        <Box
          display="flex"
          gap={1}
          alignItems="center"
          justifyContent="space-between"
          margin="16px 16px 0 10px"
        >
          <Avatar
            src={image || avatarDefault}
            alt="Photo"
            sx={{
              width: 40,
              height: 40,
              bgcolor: "var(--tropical-indigo)",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          {isLoggedIn && isOwner && (
            <Box>
              <IconButton
                aria-label="modifier"
                onClick={() => setIsEntryModalOpen(true)}
              >
                <EditIcon sx={{ color: "var(--lavander)" }} />
              </IconButton>
              <EntryDelete onDelete={handleDelete} />
            </Box>
          )}
        </Box>

        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={0}
          >
            <Typography variant="h6" component="div" marginBottom={1}>
              {pseudo || "Pseudo"}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            marginBottom={2}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: { xs: 2, md: 3 }, // Limite de lignes
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description || "Description courte de la vidéo"}
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={handleOpen}
          >
            <ReactPlayer
              src={videoUrl || "https://muxed.s3.amazonaws.com/leds.mp4"}
              width="100%"
              height="100%"
              controls
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            />
          </Box>
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90vw", md: "80vw" },
                maxHeight: { xs: "100vh", md: "100vh" },
                bgcolor: "transparent",
                outline: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "60vh", md: "90vh" },
                  maxHeight: "100vh",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: 8,
                  bgcolor: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ReactPlayer
                  src={videoUrl || "https://muxed.s3.amazonaws.com/leds.mp4"}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  style={{
                    backgroundColor: "black",
                  }}
                />
              </Box>
            </Box>
          </Modal>
          <Box display="flex" justifyContent="flex-end" mt={0} mb={-2}>
            {isLogIn && (
              <IconButton onClick={handleVoteToggle} aria-label="like">
                {liked ? (
                  <FavoriteIcon sx={{ color: "var(--tropical-indigo)" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "var(--lavander)" }} />
                )}
              </IconButton>
            )}
          </Box>
          <UpdateEntryModal
            open={isEntryModalOpen}
            setOpen={setIsEntryModalOpen}
            entryId={entry_id}
            entryData={{
              title: entryData.title,
              video_url: entryData.video_url,
              user_id: entryData.user_id,
              challenge_id: entryData.challenge_id,
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}
