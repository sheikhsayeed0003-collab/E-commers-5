"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-muted text-sm">Have a question? We&apos;re here to help.</p>
          {[
            { icon: Phone, label: "Phone", value: "+880 1700-000000" },
            { icon: Mail, label: "Email", value: "support@esy.com" },
            { icon: MapPin, label: "Address", value: "Dhaka, Bangladesh" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>
              <div><p className="text-xs text-muted">{label}</p><p className="text-sm font-medium">{value}</p></div>
            </div>
          ))}
        </div>
        {sent ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center">
            <p className="font-medium">Message sent!</p>
            <p className="text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <textarea
              required
              rows={4}
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
              minLength={10}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
