"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/account/profile");
      router.refresh();
    }
  };

  return (
    <div className="container-main py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In to esy</h1>
      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>}
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-sm text-center text-muted">
          Don&apos;t have an account? <Link href="/account/register" className="text-primary hover:underline">Register</Link>
        </p>
        <div className="text-xs text-muted text-center border-t border-border pt-3">
          Demo: admin@esy.com / admin123456<br />
          Customer: customer@esy.com / customer123
        </div>
      </form>
    </div>
  );
}
