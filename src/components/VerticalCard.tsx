import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material"
import type { ReactNode } from "react"
import { Link } from "react-router"

interface VerticalCardProps {
  image: string
  text_chip: string
  link_path: string
  children?: ReactNode
}
export const VerticalCard = ({
  image,
  text_chip,
  link_path,
  children,
}: VerticalCardProps) => {
  return (
    <Card
      sx={{
        maxWidth: {
          xs: "280px",
          sm: "260px",
        },
      }}
    >
      <CardActionArea>
        <CardMedia component="img" src={image} alt="Card Image" />
        <CardContent
          sx={{
            backgroundColor: "var(--jet)",
            color: "var(--lavander)",
            minHeight: 250,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontSize: {
              xs: "14px",
              md: "16px",
            },
          }}
        >
          {children}
          <CardActions className="flex justify-end">
            <Chip
              clickable
              component={Link}
              to={`/challenges/${link_path}`}
              label={text_chip}
              color="primary"
            ></Chip>
          </CardActions>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
