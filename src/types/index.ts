export interface LinkRequest {
  discordId: string;
  githubUsername: string;
}

export interface UserMapping {
  discordId: string;
  githubUsername: string;
}

export interface DBUser {
  id: string;
  discordId: string;
  githubUsername: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}
