"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register({ email, username, password });
      await authApi.login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "注册失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold">注册</h1>
        {error && (
          <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">用户名</span>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">邮箱</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>
        <label className="mb-5 block">
          <span className="mb-1 block text-sm">密码</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>
        <button
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 py-2 text-white disabled:opacity-60"
        >
          {loading ? "注册中…" : "注册并登录"}
        </button>
        <p className="mt-4 text-sm text-slate-500">
          已有账号？{" "}
          <a className="text-blue-600 hover:underline" href="/login">
            登录
          </a>
        </p>
      </form>
    </main>
  );
}
