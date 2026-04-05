import { Octokit } from "octokit";
import type { GitHubCommit } from "./types";

export async function getUserCommits(
  username: string,
  token: string,
  startDate: Date,
  endDate: Date
): Promise<GitHubCommit[]> {
  const octokit = new Octokit({ auth: token });

  try {
    // 获取用户的所有仓库
    const { data: repos } = await octokit.request("GET /user/repos", {
      type: "owner",
      per_page: 100,
    });

    const allCommits: GitHubCommit[] = [];

    // 遍历每个仓库获取提交记录
    for (const repo of repos) {
      const commits = await getRepoCommits(
        octokit,
        repo.owner.login,
        repo.name,
        startDate,
        endDate
      );
      allCommits.push(...commits);
    }

    return allCommits;
  } catch (error) {
    console.error("Error fetching user commits:", error);
    throw error;
  }
}

async function getRepoCommits(
  octokit: Octokit,
  username: string,
  repoName: string,
  startDate: Date,
  endDate: Date
): Promise<GitHubCommit[]> {
  const commits: GitHubCommit[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/commits",
        {
          owner: username,
          repo: repoName,
          since: startDate.toISOString(),
          until: endDate.toISOString(),
          per_page: 100,
          page,
        }
      );

      if (data.length === 0) {
        hasMore = false;
        break;
      }

      for (const commit of data) {
        if (commit.commit?.author?.date) {
          commits.push({
            sha: commit.sha,
            message: commit.commit.message,
            author: {
              name: commit.commit.author.name,
              email: commit.commit.author.email,
              date: commit.commit.author.date,
            },
            repo: repoName,
            url: commit.html_url || "",
          });
        }
      }

      page++;
      hasMore = data.length === 100;
    } catch (error) {
      console.error(`Error fetching commits for ${repoName}:`, error);
      break;
    }
  }

  return commits;
}
