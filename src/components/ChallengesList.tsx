import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { HorizontalCard } from "../components/HorizontalCard"
import type { Challenge } from "../types/challenge"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { PaginationCustom } from "./PaginationCustom"
import { formatted } from "../utils/formatedDate"
import { VerticalCard } from "./VerticalCard"

interface ChallengesListProp {
  challenges: Challenge[]
  isLogIn: boolean
  titleSection?: string
  handleChange?: (
    event: React.ChangeEvent<unknown> | React.MouseEvent<unknown>,
    value: number
  ) => void
  nbPages?: number
  page?: number
}

export const ChallengesList = ({
  challenges,
  isLogIn,
  titleSection,
  handleChange,
  nbPages,
  page,
}: ChallengesListProp) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const hasPagination = nbPages && handleChange && page
  const renderChallengeCards = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      {challenges.map(
        ({ challenge_id, game, title, created_at, description }) => (
          <Box key={challenge_id}>
            {!isMobile ? (
              <HorizontalCard
                link_path={challenge_id}
                img={game.image_url}
                title={title}
                creation_date={created_at}
                content={description}
                text_chip="DETAILS"
              />
            ) : (
              <VerticalCard
                key={challenge_id}
                image={game.image_url}
                link_path={`${challenge_id}`}
                text_chip="DETAILS"
              >
                <Box>
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
                  <Typography variant="caption">
                    {formatted(created_at)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      pt: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: { xs: 3, md: 5 }, // Limite de lignes
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {description}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 14,
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 3, md: 3 }, // Limite de lignes
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {title}
                </Typography>
              </VerticalCard>
            )}
          </Box>
        )
      )}
    </Box>
  )
  const renderPagination = () => {
    if (!nbPages || !handleChange || !page) return null
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "25px",
        }}
      >
        <PaginationCustom
          page={page}
          nbPages={nbPages}
          handleChange={handleChange}
        />
      </Box>
    )
  }

  if (!isLogIn && hasPagination) {
    return (
      <Box>
        {renderChallengeCards()}
        {renderPagination()}
      </Box>
    )
  }
  if (isLogIn && challenges.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          gap: {
            xs: "var(--margin-mobile-elements)",
            sm: "var(--margin-desktop-elements)",
          },
        }}
      >
        <Typography variant="h5">{titleSection}</Typography>
        <Typography component="span">Aucun challenge pour le moment</Typography>
      </Box>
    )
  }
  return (
    <Accordion
      defaultExpanded={!!isLogIn}
      sx={{
        maxWidth: "900px",
        width: "100%",
        alignSelf: "center",
      }}
    >
      <AccordionSummary
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          "&.MuiAccordionSummary-gutters": {
            paddingLeft: 0,
            paddingRight: 0,
          },
        }}
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: "var(--lavander)",
            }}
          />
        }
      >
        <Typography variant="h5">{titleSection}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "stretch" },
            width: "100%",
          }}
        >
          {renderChallengeCards()}
        </Box>
      </AccordionDetails>
      {isLogIn && renderPagination()}
    </Accordion>
  )
}
