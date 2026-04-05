"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import WeeklyReportGenerator from "@/components/WeeklyReportGenerator";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p>加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">周报生成器</h1>
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              退出登录
            </button>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              使用 GitHub 登录
            </button>
          )}
        </div>

        {session ? (
          <WeeklyReportGenerator user={session.user} />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow">
            <p className="text-gray-600 mb-4">
              请使用 GitHub 账号登录以生成周报。
            </p>
            <p className="text-sm text-gray-500">
              我们需要访问您的 GitHub 仓库以获取提交历史。
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
