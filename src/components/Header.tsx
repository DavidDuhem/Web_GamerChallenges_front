import {
  AppBar,
  Toolbar,
  useMediaQuery,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material"
import { useState } from "react"
import { AuthModal } from "./AuthModal"
import { useAuthStore } from "../stores/authStore"
import avatar from "../assets/avatar.svg"
import logo from "../assets/logo/logo_GamerChallenges.svg"
import logoSmall from "../assets/logo/logogram.svg"
import { Link } from "react-router"
import AccountMenu from "./AccountMenu"

export default function Header() {
  const isSmallScreen = useMediaQuery("(max-width:600px)")
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isFetchUserLoading = useAuthStore((state) => state.isLoading)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <AppBar position="static" sx={{ backgroundColor: "var(--jet)" }}>
      <Toolbar
        sx={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to={"/"}>
          <img
            src={isSmallScreen ? logoSmall : logo}
            alt="Logo Gamer Challenges"
            className="h-10"
          />
        </Link>
        {!isFetchUserLoading &&
          (isLoggedIn ? (
            <AccountMenu />
          ) : isSmallScreen ? (
            <IconButton
              onClick={() => setIsAuthModalOpen(true)}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar
                sx={{
                  ".MuiAvatar-img": { width: "75%", height: "75%", p: "1px" },
                }}
                src={avatar}
              />
            </IconButton>
          ) : (
            <Chip
              label="CONNEXION"
              color="primary"
              size="medium"
              onClick={() => setIsAuthModalOpen(true)}
            ></Chip>
          ))}
        <AuthModal open={isAuthModalOpen} setOpen={setIsAuthModalOpen} />
      </Toolbar>
    </AppBar>
  )
}
