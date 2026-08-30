/** Resolve public site URL on Vercel, local, or custom domain */
export function getSiteUrl(): string {
  const authUrl = process.env.NEXTAUTH_URL?.trim();
  if (authUrl) {
    if (authUrl.startsWith("http://") || authUrl.startsWith("https://")) {
      return authUrl.replace(/\/$/, "");
    }
    return `https://${authUrl.replace(/\/$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/** NextAuth reads NEXTAUTH_URL from process.env — normalize before init */
export function ensureAuthEnv() {
  process.env.NEXTAUTH_URL = getSiteUrl();
}
