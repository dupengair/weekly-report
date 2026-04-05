"use client";

import { useState } from "react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Props {
  user: User;
}

interface Commit {
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

interface Report {
  commits: Commit[];
  summary: string;
  startDate: string;
  endDate: string;
}

export default function WeeklyReportGenerator({ user }: Props) {
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState(1);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      // 获取 GitHub 提交记录
      const githubResponse = await fetch(`/api/github?weeks=${weeks}`, {
        method: "GET",
      });

      if (!githubResponse.ok) {
        const errorData = await githubResponse.json();
        throw new Error(errorData.error || "Failed to fetch commits");
      }

      const githubData = await githubResponse.json();

      if (githubData.commits.length === 0) {
        setError("在指定期间未找到提交记录");
        setLoading(false);
        return;
      }

      // 生成摘要
      const summarizeResponse = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commits: githubData.commits }),
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const summarizeData = await summarizeResponse.json();

      setReport({
        commits: githubData.commits,
        summary: summarizeData.summary,
        startDate: githubData.startDate,
        endDate: githubData.endDate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">生成周报</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            报告周期
          </label>
          <select
            value={weeks}
            onChange={(e) => setWeeks(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>最近一周</option>
            <option value={2}>最近两周</option>
            <option value={4}>最近一个月</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "生成中..." : "生成周报"}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {report && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">周报</h3>
            <span className="text-sm text-gray-500">
              共 {report.commits.length} 个提交
            </span>
          </div>
          <div className="prose max-w-none">
            {report.summary.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
