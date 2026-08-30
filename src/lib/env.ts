/** Validate required env vars — logs clear errors on Vercel */
export function validateEnv() {
  const missing: string[] = [];

  if (!process.env.DATABASE_URL?.startsWith("mongodb")) {
    missing.push("DATABASE_URL (mongodb+srv://...)");
  }
  if (!process.env.NEXTAUTH_SECRET) {
    missing.push("NEXTAUTH_SECRET");
  }

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    console.error(
      `[esy] Missing Vercel env vars: ${missing.join(", ")}. ` +
        "Add them in Vercel Dashboard → Settings → Environment Variables → Redeploy."
    );
  }
}
