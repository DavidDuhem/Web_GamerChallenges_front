import type { Game } from "../types/games"
import { handleAxiosError } from "../utils/handleAxiosError"
import axiosClient from "./axiosClient"
import BaseService from "./BaseService"

class GameService extends BaseService<Game> {
  constructor() {
    super("/games")
  }
  async getAllGames(): Promise<Game[]> {
    const res = await handleAxiosError(() =>
      axiosClient.get<{ data: Game[] }>(`${this.endpoint}`)
    )
    return res.data.data
  }
}
export default new GameService()
