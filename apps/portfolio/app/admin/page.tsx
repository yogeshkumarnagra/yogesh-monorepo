"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin/editor");
      } else {
        const d = await res.json();
        setError(d.error ?? "Login failed");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-3">
            // admin
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Resume Editor</h1>
          <p className="text-text-secondary text-sm mt-1">Sign in to edit and publish your resume</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-card border border-border rounded-xl p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-widest mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary
                         placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary
                         placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-medium py-2.5 rounded-lg text-sm transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-text-muted text-xs mt-6 font-mono">
          <a href="/" className="hover:text-text-secondary transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  );
}
