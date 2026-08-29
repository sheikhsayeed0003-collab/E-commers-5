# esy.com — E-commerce Platform

Bangladesh-focused online shopping platform inspired by modern marketplace UX patterns. Built with Next.js 15, TypeScript, Prisma, and Tailwind CSS.

## Features

- **Storefront**: Homepage, shop, categories, search, product details, deals
- **Cart & Checkout**: Persistent cart, COD + online payment, coupon codes
- **Account**: Register, login, profile, order history
- **Admin Panel**: Dashboard, product list, order management with status updates
- **SEO**: Sitemap, robots.txt, meta tags, clean URLs
- **Responsive**: Mobile, tablet, desktop layouts

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
```

Edit `.env` and set a secure `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`).

### 3. Database setup

```bash
npm run db:setup
```

This creates the SQLite database and seeds sample data.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role     | Email              | Password      |
|----------|--------------------|---------------|
| Admin    | admin@esy.com      | admin123456   |
| Customer | customer@esy.com   | customer123   |

## Coupon Codes

| Code       | Discount              |
|------------|-----------------------|
| WELCOME10  | 10% off (min ৳500)   |
| ESY50      | ৳50 off (min ৳1000)  |
| FREESHIP   | Free shipping (min ৳800) |

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API
│   ├── admin/        # Admin dashboard
│   ├── account/      # Customer account
│   ├── api/          # REST API routes
│   ├── product/      # Product detail
│   ├── category/     # Category listing
│   └── ...
├── components/       # React components
│   ├── layout/       # Header, Footer, Nav
│   ├── product/      # ProductCard, ProductGrid
│   ├── home/         # Homepage sections
│   └── ui/           # Button, Toast
├── lib/              # Utilities, auth, prisma
└── stores/           # Zustand cart store
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Sample data
```

## API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /api/products      | List/search products |
| GET    | /api/categories    | Category list        |
| POST   | /api/checkout      | Place order          |
| GET    | /api/orders        | Customer orders      |
| PATCH  | /api/orders        | Admin status update  |
| POST   | /api/auth/register | Register user        |

## Production Deployment (Vercel)

Uses **MongoDB Atlas** (same connection as local).

1. In Vercel → Environment Variables:
   ```
   DATABASE_URL=mongodb+srv://USER:PASS@cluster....mongodb.net/esy?retryWrites=true&w=majority
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=<strong-random-secret>
   ADMIN_EMAIL=admin@esy.com
   ADMIN_PASSWORD=admin123456
   ```

2. Deploy (Git push or Vercel import).

3. Seed once (with production `DATABASE_URL` in `.env`):
   ```bash
   npm run db:seed
   ```

## Payment Gateway Integration

Online payment currently uses a mock gateway. To integrate real payment:

1. **SSLCommerz** (Bangladesh): Add credentials to `.env` and implement in `src/lib/payment/`
2. **bKash/Nagad**: Use their merchant API with server-side token generation

Never expose payment credentials in frontend code.

## License

Private — esy.com
