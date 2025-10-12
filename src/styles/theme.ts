import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#8585FF",
      contrastText: "#EBEBFF",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#EBEBFF",
            },
            "&:hover fieldset": {
              borderColor: "#8585FF",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8585FF",
            },
            "& input": {
              color: "#EBEBFF",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#EBEBFF",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#EBEBFF",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          color: "var(--lavander)",
          backgroundColor: "var(--eerie-black)",
          boxShadow: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#EBEBFF",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#EBEBFF",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid var(--lavander)",
          boxShadow: "none",
          "&.Mui-expanded": {
            borderBottom: "none",
          },
        },
        expandIconWrapper: {
          color: "var(--lavander)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          ".MuiChip-labelMedium": {
            padding: "1rem",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
  },
})
