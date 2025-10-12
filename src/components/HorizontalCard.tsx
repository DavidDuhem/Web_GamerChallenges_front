import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from "@mui/material"
import { Link } from "react-router"
import { formatted } from "../utils/formatedDate"

interface HorizontalCardProps {
  link_path: number
  img: string
  text_chip: string
  title: string
  creation_date: Date | string
  content: string
}

export const HorizontalCard = ({
  link_path,
  img,
  text_chip,
  title,
  creation_date,
  content,
}: HorizontalCardProps) => {
  const UppercaseChipText = text_chip.toUpperCase()
  const formattedDate = formatted(creation_date).toString()
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "center",
        margin: "auto",
        color: "var(--lavander)",
        borderRadius: 2,
        height: { xs: 150, md: 200 },
        overflow: "hidden",
        maxWidth: { md: 900 },
        backgroundColor: "var(--eerie-black)",
      }}
    >
      <CardMedia
        component="img"
        image={img}
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
          padding: { xs: "0.5rem", md: "1rem 4rem 1rem 2rem" },
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: { xs: 1, md: 5 }, // Limite de lignes
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: { xs: "12px" } }} variant="body2">
          {formattedDate}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: { xs: 3, md: 5 }, // Limite de lignes
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          padding: "1rem",
          backgroundColor: "var(--jet)",
        }}
      >
        <Chip
          clickable
          component={Link}
          to={`/challenges/${link_path}`}
          label={UppercaseChipText}
          color="primary"
        ></Chip>
      </Box>
    </Card>
  )
}
