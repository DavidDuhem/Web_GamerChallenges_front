import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useAuthStore } from "../stores/authStore"
import AuthService from "../services/AuthService"
import type { User } from "../types/auth"

export const useFetchCurrentUser = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)

  const { data: user, isLoading } = useQuery<User | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const accessToken = await AuthService.getNewAccessToken()
      if (accessToken) {
        setAccessToken(accessToken)
      }

      const user = await AuthService.getCurrentUser()
      return user
    },
    retry: false,
  })

  useEffect(() => {
    if (!isLoading) {
      setUser(user ?? null)
    }
  }, [user, isLoading, setUser])
}
