import { Box, Chip, CircularProgress, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import ChallengeModal from "../components/ChallengeModal"
import { ChallengesList } from "../components/ChallengesList"
import ChallengeService from "../services/ChallengeService"
import { useAuthStore } from "../stores/authStore"

export const ChallengesPage = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [page, setPage] = useState(1)
  const [isCreateChallengeModalOpen, setIsCreateChallengeModalOpen] =
    useState(false)
  const handleChange = (
    _event: React.ChangeEvent<unknown> | React.MouseEvent<unknown>,
    value: number
  ) => {
    setPage(value)
  }
  useEffect(() => {
    setPage(1)
  }, [isLoggedIn])

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challengesList", page],
    queryFn: () => ChallengeService.getChallenges(page),
    staleTime: 2 * 60 * 1000, //Données reste "fraiches" durant 2 minutes
    gcTime: 5 * 60 * 1000, // Cache 5 minutes
    refetchOnWindowFocus: false, // Évite refetch intempestifs
    refetchOnMount: false, // Utilise cache si frais
  })

  const challengeList = response?.challenges ?? []
  const challengeMemberList = response?.memberChallenges ?? []
  const totalPages = response?.nbPages
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  if (error) {
    return <Typography color="error">Erreur lors du chargement</Typography>
  }
  if (challengeList.length <= 0 && challengeMemberList.length <= 0) {
    return <Typography component="span">Aucun challenge trouvé</Typography>
  }
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
          gap: {
            xs: "var(--margin-mobile-elements)",
            sm: "var(--margin-desktop-elements)",
          },
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Liste des challenges
        </Typography>
        {isLoggedIn && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Chip
              onClick={() => setIsCreateChallengeModalOpen(true)}
              label="CREER UN CHALLENGE"
              color="primary"
            ></Chip>
            <ChallengeModal
              open={isCreateChallengeModalOpen}
              setOpen={setIsCreateChallengeModalOpen}
            />
          </Box>
        )}
      </Box>
      <>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : isLoggedIn && challengeMemberList.length >= 0 ? (
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
            <ChallengesList
              challenges={challengeMemberList}
              isLogIn={isLoggedIn}
              titleSection="Mes challenges"
            />
            <ChallengesList
              challenges={challengeList}
              isLogIn={isLoggedIn}
              titleSection="Autres challenges"
              handleChange={handleChange}
              nbPages={totalPages}
              page={page}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ChallengesList
              challenges={challengeList}
              isLogIn={isLoggedIn}
              handleChange={handleChange}
              nbPages={totalPages}
              page={page}
            />
          </Box>
        )}
      </>
    </Box>
  )
}
