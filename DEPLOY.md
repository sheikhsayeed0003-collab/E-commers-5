# Vercel Deployment Guide

## 1. Create PostgreSQL database (free)

Use [Neon](https://neon.tech) or Supabase:

1. Create project → copy **Connection string**
2. Use the **pooled** URL for serverless (Neon: enable connection pooling)

Example:
```
postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

## 2. Push code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deploy"
git push
```

## 3. Import on Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import repo
2. Framework: **Next.js** (auto-detected)
3. **Environment Variables** (Production + Preview):

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (update after first deploy) |
| `NEXTAUTH_SECRET` | Random string (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | `admin@esy.com` |
| `ADMIN_PASSWORD` | Strong password |

4. Click **Deploy**

## 4. Seed database (once, after first deploy)

On your PC, set production `DATABASE_URL` in `.env`, then:

```bash
npm run db:setup
```

This creates tables and demo products/admin user.

## 5. Update NEXTAUTH_URL

After deploy, set `NEXTAUTH_URL` to your real Vercel URL (e.g. `https://esy.vercel.app`) and **Redeploy**.

## Notes

- **Admin images on Vercel:** Use **Add URL** (paste `https://picsum.photos/seed/...`) — file upload does not persist on serverless.
- **Login:** Admin → `/admin` | Customer → `/account/login`
- **Build:** Runs `prisma generate && next build` automatically.
