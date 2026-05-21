export type GitHubUser = {
  login: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
};

export type Repo = {
  id: number;
  name: string;
  stargazers_count: number;
  language: string;
};