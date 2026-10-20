This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend setup

The API uses Next.js Node.js Route Handlers and Prisma ORM with a local SQLite
database for development.

1. Copy `.env.example` to `.env`.
2. Run `npm run db:migrate` to create/update the local database.
3. Run `npm run dev`.

Available starter endpoints:

- `GET /api/health` — API and database readiness.
- `POST /api/contact` — validates and stores contact enquiries.
- `POST /api/auth/signup` and `POST /api/auth/login` — creates accounts and starts
  secure, server-stored sessions.
- `GET /api/auth/session` and `POST /api/auth/logout` — reads or ends the current session.

The Prisma schema includes the initial booking, price, payment, availability, and
admin audit data models. Razorpay, Google Calendar, and Resend credentials are
placeholders only; payment processing, calendar synchronization, email delivery,
password recovery, and admin endpoints are not enabled yet. Configure production
credentials and a production database before deploying; the local SQLite database
is intended for development, not production hosting.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
