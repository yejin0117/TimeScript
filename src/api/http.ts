// src/api/http.ts
const BASE =
  (process.env.REACT_APP_API_BASE || "http://localhost:8080").replace(/\/$/, "");

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(method: HttpMethod, path: string, body?: any): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const tk = getToken();
  if (tk) headers.Authorization = `Bearer ${tk}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return (await res.json().catch(() => null)) as T;
}

export const http = {
  get:  <T>(p: string) => request<T>("GET", p),
  post: <T>(p: string, b?: any) => request<T>("POST", p, b),
  put:  <T>(p: string, b?: any) => request<T>("PUT", p, b),
  del:  <T>(p: string) => request<T>("DELETE", p),
};
