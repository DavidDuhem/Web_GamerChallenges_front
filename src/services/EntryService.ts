import type {
  AuthenticatedUserEntry,
  Entry,
  EntryVoteResponse,
} from "../types/entry"

import { handleAxiosError } from "../utils/handleAxiosError"
import { refreshTokenIfInvalid } from "../utils/token"
import axiosClient from "./axiosClient"
import BaseService from "./BaseService"

class EntryService extends BaseService<Entry> {
  constructor() {
    super("/entries")
  }
  async getEntryMostLikedEntry(): Promise<Entry[]> {
    const res = await handleAxiosError(() =>
      axiosClient.get(`${this.endpoint}/most-liked`)
    )
    return res.data.data
  }
  async getAllEntriesForUniqueChallenge(
    id: number
  ): Promise<AuthenticatedUserEntry> {
    const res = await handleAxiosError(() =>
      axiosClient.get(`${this.endpoint}/${id}`)
    )
    return res.data
  }
  async createEntry(
    challengeId: number,
    payload: Partial<Entry>
  ): Promise<Entry> {
    await refreshTokenIfInvalid()
    const res = await handleAxiosError(() =>
      axiosClient.post<Entry>(`${this.endpoint}/${challengeId}`, payload)
    )
    return res.data
  }

  async toggleEntryVote(entryId: number): Promise<EntryVoteResponse> {
    await refreshTokenIfInvalid()
    const res = await handleAxiosError(() =>
      axiosClient.post<EntryVoteResponse>(`${this.endpoint}/${entryId}/vote`)
    )
    return res.data
  }

  async updateEntry(
    challengeId: number,
    payload: Partial<Entry>
  ): Promise<Entry> {
    const res = await handleAxiosError(() =>
      axiosClient.patch<Entry>(`${this.endpoint}/${challengeId}`, payload)
    )
    return res.data
  }

  async deleteEntry(id: number): Promise<void> {
    return this.delete(id)
  }
}
export default new EntryService()
