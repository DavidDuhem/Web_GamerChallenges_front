import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  ListItem,
  Typography,
} from "@mui/material"
import Logout from "@mui/icons-material/Logout"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { useState } from "react"
import { useAuthStore } from "../stores/authStore"
import { useAuth } from "../hooks/useAuth"
import { CustomModal } from "./CustomModal"

export default function AccountMenu() {
  const localLogout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const { logoutAccount, deleteAccount } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDeleteConfimModalOpen, setIsDeleteConfimModalOpen] = useState(false)

  if (!user) return null

  const { id, avatar, pseudo } = user
  const isMenuOpen = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = async () => {
    logoutAccount()
    localLogout()
    handleClose()
  }
  const handleConfirmDeleteAccount = () => {
    deleteAccount(id)
    localLogout()
    handleClose()
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Menu de compte">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={isMenuOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? "true" : undefined}
          >
            <Avatar src={avatar} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isMenuOpen}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              bgcolor: "var(--jet)",
              color: "primary.contrastText",
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "var(--jet)",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <ListItem onClick={handleClose}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={avatar} />
            <Typography
              noWrap
              sx={{
                maxWidth: 175,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {pseudo}
            </Typography>
          </Box>
        </ListItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "primary.contrastText" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
        <MenuItem
          onClick={() => setIsDeleteConfimModalOpen(true)}
          sx={{ color: "var(--danger-red)" }}
        >
          <ListItemIcon>
            <DeleteForeverIcon
              fontSize="small"
              sx={{ color: "var(--danger-red)" }}
            />
          </ListItemIcon>
          Supprimer le compte
        </MenuItem>
      </Menu>
      <CustomModal
        open={isDeleteConfimModalOpen}
        onSubmit={() => handleConfirmDeleteAccount()}
        onClose={() => setIsDeleteConfimModalOpen(false)}
        title="Suppression du compte"
      >
        <Typography>
          Êtes-vous sûr de vouloir supprimer votre compte ?
        </Typography>
      </CustomModal>
    </>
  )
}
