import type { GitHubCommit } from "./types";

export async function generateWeeklySummary(commits: GitHubCommit[]): Promise<string> {
  const apiKey = process.env.ZHIPUAI_API_KEY;
  const baseURL = process.env.ZHIPUAI_BASE_URL || "https://ark.cn-beijing.volces.com/api/coding/v3";

  console.log("=== 调试信息 ===");
  console.log("ZHIPUAI_API_KEY 存在:", !!apiKey);
  console.log("ZHIPUAI_API_KEY 长度:", apiKey?.length);
  console.log("ZHIPUAI_BASE_URL:", baseURL);
  console.log("================");

  if (!apiKey) {
    throw new Error("ZHIPUAI_API_KEY is not configured");
  }

  if (commits.length === 0) {
    throw new Error("No commits provided for summarization");
  }

  // 构建提示词
  const prompt = buildSummaryPrompt(commits);

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "GLM-4.7",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "";
    return summary;
  } catch (error) {
    console.error("智谱 AI API error:", error);
    throw error;
  }
}

function buildSummaryPrompt(commits: GitHubCommit[]): string {
  const commitsText = commits
    .map((c, i) => `${i + 1}. ${c.repo}: ${c.message}`)
    .join("\n");

  return `请根据以下 GitHub 提交记录生成周报：

提交记录：
${commitsText}

请按以下结构生成周报：
1. ****（2-3 句话）
2. **主要成就**（要点列表）
3. **涉及的仓库**
4. **提交统计**

请使用 Markdown 格式，确保周报专业且简洁。`;
}
