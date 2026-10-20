"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(() => router.replace("/dashboard"))
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500">
        {checking ? "检查登录状态…" : "正在跳转…"}
      </p>
    </main>
  );
}
