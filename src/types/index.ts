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
  createdAt: Date;
  updatedAt: Date;
}

export interface DBEvent {
  id: string;
  userId: string;
  type: string;
  points: number;
  createdAt: Date;
  user?: {
    githubUsername: string;
  };
}
