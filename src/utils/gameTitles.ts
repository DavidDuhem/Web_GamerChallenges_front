import GameService from "../services/GameService"

export const fetchGameTitles = async (): Promise<string[]> => {
  const games = await GameService.getAllGames()
  return games.map((game) => game.title)
}
