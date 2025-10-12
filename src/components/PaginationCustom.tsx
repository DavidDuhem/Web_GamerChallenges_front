import { Pagination, Stack } from "@mui/material"
interface PaginationCustomProps {
  nbPages: number
  handleChange: (
    event: React.ChangeEvent<unknown> | React.MouseEvent<unknown>,
    value: number
  ) => void
  page: number
}
export const PaginationCustom = ({
  nbPages,
  handleChange,
  page,
}: PaginationCustomProps) => {
  return (
    <Stack spacing={2}>
      <Pagination
        count={nbPages}
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
        sx={{
          "& .MuiPaginationItem-root": {
            borderColor: "var(--lavander)",
            color: "var(--lavander)",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "var(--tropical-indigo) !important", // <-- ajoute !important si conflit
            color: "white",
          },
        }}
      />
    </Stack>
  )
}
