import { Box, Chip, Typography } from "@mui/material"
import { Link } from "react-router"
import { BoardCard } from "../components/BoardCard"
import { VerticalCard } from "../components/VerticalCard"
import ChallengeService from "../services/ChallengeService"
import { useQueries } from "@tanstack/react-query"
import EntryService from "../services/EntryService"
import { formatted } from "../utils/formatedDate"

export const LandingPage = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["newestChallenges"],
        queryFn: () => ChallengeService.getNewest(),
      },
      {
        queryKey: ["popularChallenges"],
        queryFn: () => ChallengeService.getMostLikedChallenges(),
      },
      {
        queryKey: ["popularEntries"],
        queryFn: () => EntryService.getEntryMostLikedEntry(),
      },
    ],
  })
  const newestChallenges = results[0]
  const popularChallenges = results[1]
  const popularEntries = results[2]

  return (
    <div className="flex flex-col gap-[var(--margin-mobile)] sm:gap-[var(--margin-desktop)]">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          flex: {
            xs: 1,
          },
          alignItems: "center",
          fontSize: {
            xs: "1rem",
            md: "1.25rem",
          },
        }}
      >
        <div className="flex flex-col text-center justify-evenly items-center bg-amber- max-w-[1056px] h-[250px] sm:h-[400px]">
          <div className="sm:h-[201px]">
            <h1 className="text-[36px] sm:text-[48px]">GamerChallenges</h1>
            <p className="max-w-[486px] ">
              Une plateforme dédiée aux challenges de jeux vidéo, permettant aux
              utilisateurs de proposer et relever des challenges sur différents
              jeux
            </p>
          </div>
          <Chip
            component={Link}
            to={"/challenges"}
            clickable
            sx={{ fontSize: "1rem" }}
            label="CHALLENGES"
            color="primary"
          />
        </div>
      </Box>
      <Box className="flex flex-col gap-[var(--margin-desktop-elements)] sm:flex-row">
        <div className="flex-1 min-w-0">
          <p className="text-[1.25rem] " style={{ marginBottom: "1rem" }}>
            Leaderboard des challenges
          </p>
          <div className="flex flex-col gap-[var(--margin-cards)]">
            {popularChallenges.data?.map(
              ({ challenge_id, game, title, _count }) => (
                <BoardCard
                  key={challenge_id}
                  img={game.image_url}
                  description={title}
                  likes_number={_count.challengeVoters}
                />
              )
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[1.25rem]" style={{ marginBottom: "1rem" }}>
            Leaderboard des participants
          </p>
          <div className="flex flex-col gap-[var(--margin-cards)]">
            {popularEntries.data?.map(({ entry_id, user, title, _count }) => (
              <BoardCard
                key={entry_id}
                img={user.avatar}
                description={title}
                likes_number={_count.entryVoters}
              />
            ))}
          </div>
        </div>
      </Box>
      <Box>
        <p className="text-[1.25rem] " style={{ marginBottom: "1rem" }}>
          Nouveaux challenges
        </p>
        <div className=" flex flex-col items-center justify-between gap-[var(--margin-mobile-elements)] sm:flex-row ">
          {newestChallenges.data?.map(
            ({ challenge_id, game, created_at, user, title }) => (
              <VerticalCard
                key={challenge_id}
                image={game.image_url}
                link_path={`${challenge_id}`}
                text_chip="Détails"
              >
                <Box
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2, // Limite de lignes
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2, // Limite de lignes
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {game.title}
                  </Typography>
                  <Typography variant="body1">
                    Le {formatted(created_at)}
                  </Typography>
                </Box>
                <Typography variant="body2">Par {user.pseudo}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2, // Limite de lignes
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {title}
                </Typography>
              </VerticalCard>
            )
          )}
        </div>
      </Box>
    </div>
  )
}
