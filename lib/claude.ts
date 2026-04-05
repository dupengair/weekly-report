import Anthropic from "@anthropic-ai/sdk";
import type { GitHubCommit } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateWeeklySummary(commits: GitHubCommit[]): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  if (commits.length === 0) {
    throw new Error("No commits provided for summarization");
  }

  // 构建提示词
  const prompt = buildSummaryPrompt(commits);

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // 提取文本内容
    const content = message.content
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("\n");

    return content;
  } catch (error) {
    console.error("Claude API error:", error);
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
1. **概要**（2-3 句话）
2. **主要成就**（要点列表）
3. **涉及的仓库**
4. **提交统计**

请使用 Markdown 格式，确保周报专业且简洁。`;
}
