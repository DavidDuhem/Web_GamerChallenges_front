import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material"
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { ChallengeDelete } from "../components/ChallengeDelete"
import { ChallengeEdit } from "../components/ChallengeEdit"
import { CreateEntryModal } from "../components/CreateEntryModal"
import EntryCard from "../components/EntryCard "
import ChallengeService from "../services/ChallengeService"
import EntryService from "../services/EntryService"
import { useAuthStore } from "../stores/authStore"
import { formatted } from "../utils/formatedDate"

interface HorizontalCardProps {
  img?: string
}
export const ChallengeDetailsPage = ({
  img = "https:images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
}: HorizontalCardProps) => {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)
  const { challengeId } = useParams()
  const isLogIn = useAuthStore((state) => state.isLoggedIn)
  const [liked, setLiked] = useState<boolean>(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const results = useQueries({
    queries: [
      {
        queryKey: ["challengeDetails", challengeId, currentUser?.id],
        queryFn: () =>
          ChallengeService.getChallengeDetails(Number(challengeId)),
      },
      {
        queryKey: ["challengeEntries", challengeId, isLogIn],
        queryFn: () =>
          EntryService.getAllEntriesForUniqueChallenge(Number(challengeId)),
      },
    ],
  })

  const toggleVote = useMutation({
    mutationFn: (challengeId: number) =>
      ChallengeService.toggleChallengeVote(challengeId),
  })
  const challengeIsLoading = results[0]?.isLoading
  const challengeData = results[0]?.data
  const {
    title,
    game,
    description,
    rules,
    created_at,
    user,
    userHasVoted,
    challenge_id,
  } = challengeData || {}
  const formattedDate = created_at && formatted(created_at).toString()
  const entriesAreLoading = results[1]?.isLoading
  const entries = results[1]?.data?.entries || []
  const memberEntries = results[1]?.data?.memberEntries || []
  useEffect(() => {
    if (challengeData) {
      setLiked(userHasVoted ?? false)
    }
  }, [userHasVoted, challengeData])

  const handleVoteToggle = async () => {
    const res = await toggleVote.mutateAsync(Number(challengeId))
    setLiked(res.voted)
  }

  const deleteEntryMutation = useMutation({
    mutationFn: (entryId: number) => EntryService.deleteEntry(entryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["challengeEntries", challengeId, currentUser?.id],
        exact: true,
      })
      await queryClient.refetchQueries({ type: "active" })
    },
  })

  const handleEntryDelete = async (entry_id: number) => {
    try {
      await deleteEntryMutation.mutateAsync(entry_id)
      setSnackbarMessage("Participation supprimée avec succès !")
      setSnackbarOpen(true)
    } catch (error) {
      console.error(error)
      setSnackbarMessage("Erreur lors de la suppression")
      setSnackbarOpen(true)
    }
  }

  // const [version, setVersion] = useState(0)

  // useEffect(() => {
  //   if (!entriesAreLoading) {
  //     setVersion((v) => v + 1)
  //   }
  // }, [entries])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: "var(--margin-mobile)", sm: "var(--margin-desktop)" },
        marginTop: { sm: "var(--margin-desktop)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--margin-desktop-elements)",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Détails du challenge
        </Typography>
        {challengeIsLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {!challengeIsLoading && (
          <Card
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "auto",
              color: "var(--lavander)",
              borderRadius: 2,
              width: { md: 800 },
            }}
          >
            <CardMedia
              component="img"
              image={game?.image_url ?? img}
              alt="image challenge card"
              sx={{
                width: { xs: 100, md: 200 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></CardMedia>
            <CardContent
              sx={{
                backgroundColor: "var(--jet)",
                padding: { xs: "0.5rem", md: "1rem 2rem 1rem 2rem" },
                display: "flex",
                flexDirection: "column",
                gap: 1,
                flex: 1,
              }}
            >
              <Typography variant="h6">{title}</Typography>
              <Typography variant="body2">{formattedDate}</Typography>
              <Typography variant="body2">Par {user?.pseudo}</Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.5, textAlign: { md: "justify" } }}
              >
                {description}
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.5, textAlign: { md: "justify" } }}
              >
                {rules}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1rem",
                backgroundColor: "var(--jet)",
              }}
            >
              {user?.id === currentUser?.id && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <ChallengeEdit challenge={challengeData!} />
                  <ChallengeDelete challenge_id={challenge_id!} />
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "end" }}>
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
            </Box>
          </Card>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: {
            xs: "var(--margin-mobile-elements)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: {
              xs: "var(--margin-mobile-elements)",
              sm: "var(--margin-desktop-elements)",
            },
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Participations
          </Typography>
          {isLogIn && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Chip
                onClick={() => setIsCreateModalOpen(true)}
                label="PARTICIPER AU CHALLENGE"
                color="primary"
              ></Chip>
              <CreateEntryModal
                open={isCreateModalOpen}
                setOpen={setIsCreateModalOpen}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: {
              xs: "var(--margin-mobile-elements)",
              sm: "var(--margin-desktop-elements)",
            },
          }}
        >
          {isLogIn && (
            <>
              <Typography variant="h5">Mes participations</Typography>
              {entriesAreLoading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              {!entriesAreLoading && memberEntries.length <= 0 && (
                <Typography component="span">
                  Aucune participation trouvée
                </Typography>
              )}
              {!entriesAreLoading && memberEntries.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    flexWrap: "wrap",
                    gap: {
                      xs: "var(--margin-mobile-elements)",
                      sm: "var(--margin-desktop-elements)",
                    },
                  }}
                >
                  {memberEntries.map(
                    ({ entry_id, title, user, video_url, userHasVoted }) => (
                      <EntryCard
                        key={entry_id}
                        entryData={{
                          title: title,
                          video_url: video_url,
                          user_id: currentUser?.id,
                          challenge_id: Number(challengeId),
                        }}
                        description={title}
                        pseudo={user.pseudo}
                        videoUrl={video_url}
                        image={user.avatar}
                        entry_id={entry_id}
                        isOwner={true}
                        userHasVoted={userHasVoted ?? false}
                        onDelete={handleEntryDelete}
                      />
                    )
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: {
              xs: "var(--margin-mobile-elements)",
              sm: "var(--margin-desktop-elements)",
            },
          }}
        >
          {isLogIn && (
            <Typography variant="h5">Autres participations</Typography>
          )}
          {entriesAreLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {!entriesAreLoading && entries.length <= 0 && (
            <Typography component="span">
              Aucune participation trouvée
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              flexWrap: "wrap",
              gap: {
                xs: "var(--margin-mobile-elements)",
                sm: "var(--margin-desktop-elements)",
              },
            }}
          >
            {entries.map(
              ({ entry_id, title, user, video_url, userHasVoted }) => (
                <EntryCard
                  key={entry_id}
                  entryData={{
                    title: title,
                    video_url: video_url,
                    user_id: currentUser?.id,
                    challenge_id: Number(challengeId),
                  }}
                  description={title}
                  pseudo={user.pseudo}
                  videoUrl={video_url}
                  image={user.avatar}
                  entry_id={entry_id}
                  isOwner={false}
                  userHasVoted={userHasVoted ?? false}
                />
              )
            )}
          </Box>
        </Box>
      </Box>

      <Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarMessage.includes("Erreur") ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
