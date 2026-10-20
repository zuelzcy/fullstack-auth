import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "全栈认证 Demo",
  description: "Next.js + FastAPI + MySQL 用户认证示例",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
