import { Box, Toolbar, Typography } from "@mui/material"
import { Link } from "react-router"
import "../styles/index.css"

export default function Footer() {
  return (
    <footer className="w-full mt-auto flex items-center justify-center align-item h-auto">
      <Box
        component="footer"
        sx={{
          color: "var(--lavender)",
          borderTop: "1px solid var(--jet)",
          mt: { xs: "var(--margin-mobile)", md: "var(--margin-desktop)" },
          px: 2,
          py: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              maxWidth: {
                xs: "100%",
              },
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: {
                  xs: "1rem",
                  md: "1.5rem",
                },
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              Gamer Challenges © 2025 Tous droits réservés
            </Typography>
            <Link
              to="/cgu"
              className="text-[1rem] md:text-[1.5rem] text-white underline hover:no-underline"
            >
              CGU
            </Link>
          </Box>
        </Toolbar>
      </Box>
    </footer>
  )
}
