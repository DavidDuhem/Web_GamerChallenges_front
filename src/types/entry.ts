import type { User } from "./auth"

export interface Entry {
  entry_id: number
  title: string
  video_url: string
  user: User
  user_id: number
  challenge_id: number
  _count: {
    entryVoters: number
  }
}
export interface AuthenticatedUserEntry {
  memberEntries?: (Omit<Entry, "_count"> & { userHasVoted?: boolean })[]
  entries: (Omit<Entry, "_count"> & { userHasVoted?: boolean })[]
}
export interface EntryVoteResponse {
  voted: boolean
}
