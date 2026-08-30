# Vercel Deployment Guide (MongoDB)

## Before deploy — MongoDB Atlas

1. Open [MongoDB Atlas](https://cloud.mongodb.com) → your cluster
2. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Vercel IPs change; without this the site will fail to connect to DB
3. Confirm database user password works (connection string already in local `.env`)

## Deploy steps

### 1. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import GitHub repo: `sheikhsayeed0003-collab/E-commers-5`
3. Framework: **Next.js** (auto)
4. Root directory: leave default

### 2. Environment Variables (Production + Preview)

| Name | Value |
|------|--------|
| `DATABASE_URL` | `mongodb+srv://USER:PASS@cluster0.ieavyiz.mongodb.net/esy?retryWrites=true&w=majority&appName=Cluster0` |
| `NEXTAUTH_URL` | `https://e-commers-5.vercel.app` (must include `https://`) |
| `NEXTAUTH_SECRET` | Long random string (e.g. generate: `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | `admin@esy.com` |
| `ADMIN_PASSWORD` | Your admin password |

Use the **same** MongoDB URL as local (database name `esy` must be in the path).

### 3. Deploy

Click **Deploy**. Build runs: `prisma generate && next build`.

### 4. After first deploy

1. Copy your Vercel URL (e.g. `https://e-commers-5.vercel.app`)
2. Set env `NEXTAUTH_URL` = that URL
3. **Redeploy** (Deployments → … → Redeploy)

Database is already seeded on Atlas — no need to seed again unless empty.

## Login

| Role | URL | Email | Password |
|------|-----|-------|----------|
| Admin | `/admin` | `admin@esy.com` | (your ADMIN_PASSWORD) |
| Customer | `/account/login` | `customer@esy.com` | `customer123` |

## Notes

- Admin product images: paste image **URL** (file upload does not persist on Vercel serverless)
- Do **not** commit `.env` — secrets only in Vercel dashboard
- If home page errors: check Atlas Network Access allows `0.0.0.0/0`
