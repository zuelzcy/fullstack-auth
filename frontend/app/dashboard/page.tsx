"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, User } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authApi
      .me()
      .then(setUser)
      .catch(() => router.replace("/login"));
  }, []);

  async function onLogout() {
    await authApi.logout();
    router.replace("/login");
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">加载中…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-4 text-2xl font-bold">控制台</h1>
        <p className="text-slate-600">
          欢迎，<span className="font-semibold">{user.username}</span>！
        </p>
        <dl className="mt-4 space-y-1 text-sm text-slate-500">
          <div>
            <dt className="inline">邮箱：</dt>
            <dd className="inline">{user.email}</dd>
          </div>
          <div>
            <dt className="inline">用户 ID：</dt>
            <dd className="inline">{user.id}</dd>
          </div>
        </dl>
        <button
          onClick={onLogout}
          className="mt-6 w-full rounded-lg border border-slate-300 py-2 hover:bg-slate-50"
        >
          退出登录
        </button>
      </div>
    </main>
  );
}
