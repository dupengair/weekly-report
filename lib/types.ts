export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  repo: string;
  url: string;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  username: string;
  startDate: string;
  endDate: string;
  commits: GitHubCommit[];
  summary: string;
  createdAt: string;
}

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

export interface GenerateReportRequest {
  username: string;
  weeks?: number;
  startDate?: string;
  endDate?: string;
}
