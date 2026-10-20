const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export type User = {
  id: number;
  email: string;
  username: string;
  created_at?: string;
};

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let detail: any = "请求失败";
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* ignore */
    }
    const message = Array.isArray(detail)
      ? detail.map((d: any) => d.msg).join("、")
      : detail;
    throw new Error(message);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export const authApi = {
  register: (data: {
    email: string;
    username: string;
    password: string;
  }) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
  me: () => apiFetch<User>("/auth/me"),
};
