"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/account/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>}
        {[
          { key: "name", label: "Full Name", type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "phone", label: "Phone", type: "tel" },
          { key: "password", label: "Password", type: "password" },
          { key: "confirm", label: "Confirm Password", type: "password" },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="text-sm font-medium block mb-1">{label}</label>
            <input type={type} required value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
        ))}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
        <p className="text-sm text-center text-muted">
          Already have an account? <Link href="/account/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
