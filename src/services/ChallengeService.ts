import type {
  Challenge,
  ChallengeDetails,
  ChallengeVoteResponse,
  PaginationChallenge,
} from "../types/challenge"
import { handleAxiosError } from "../utils/handleAxiosError"
import { refreshTokenIfInvalid } from "../utils/token"
import axiosClient from "./axiosClient"
import BaseService from "./BaseService"

class ChallengeService extends BaseService<Challenge> {
  constructor() {
    super("/challenges")
  }
  async getChallengeDetails(challengeId: number): Promise<ChallengeDetails> {
    const res = await handleAxiosError(() =>
      axiosClient.get(`${this.endpoint}/${challengeId}`)
    )
    return res.data
  }
  async getNewest(): Promise<Challenge[]> {
    const res = await handleAxiosError(() =>
      axiosClient.get(`${this.endpoint}/newest`)
    )
    return res.data.data
  }
  async getMostLikedChallenges(): Promise<Challenge[]> {
    const res = await handleAxiosError(() =>
      axiosClient.get(`${this.endpoint}/most-liked`)
    )
    return res.data.data
  }
  async getChallenges(page: number): Promise<PaginationChallenge> {
    const res = await handleAxiosError(() =>
      axiosClient.get(`${this.endpoint}?page=${page}`)
    )
    return res.data
  }
  async deleteChallenge(challenge_id: number): Promise<void> {
    const res = await this.delete(challenge_id)
    return res
  }
  async toggleChallengeVote(
    challengeId: number
  ): Promise<ChallengeVoteResponse> {
    await refreshTokenIfInvalid()
    const res = await handleAxiosError(() =>
      axiosClient.post<ChallengeVoteResponse>(
        `${this.endpoint}/${challengeId}/vote`
      )
    )
    return res.data
  }
}
export default new ChallengeService()
