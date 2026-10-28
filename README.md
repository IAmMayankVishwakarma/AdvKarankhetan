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

The API uses Next.js Node.js Route Handlers and Prisma ORM with a local MySQL
database (for example, MySQL/MariaDB started through XAMPP) for development.

1. Start MySQL in XAMPP and create a database named `karankhetan`.
2. Copy `.env.example` to `.env`. The example uses XAMPP's common `root` user
   with no password; update `DATABASE_URL` if your MySQL credentials differ.
3. Run `npx prisma migrate deploy` to apply the checked-in MySQL migrations.
4. Run `npm run dev`.

The active Prisma migration history is in `prisma/migrations-mysql`; the existing
`prisma/migrations` directory contains the original SQLite history and is kept
separate. Switching providers does not copy existing SQLite data into MySQL.

## Accounts and appointments

Visitors can register and log in at `/en/signup` and `/en/login`. New users always
receive the `USER` role. Users can book at `/en/book` and view their own bookings
at `/en/account`; account ownership is checked on the server. The first booking
is made free and consumes eligibility immediately; cancellation does not restore
it. Bookings use the configured business timezone, daily limits, operating hours,
and holidays. Defaults are Asia/Kolkata, 09:00–17:00, and four bookings per day.

To create the first administrator safely:

1. Register the account that should be the administrator.
2. Set `ADMIN_BOOTSTRAP_EMAIL` in `.env` to that account's exact email.
3. Run `npm run admin:promote -- admin@example.com`, replacing the argument with
   that same email.
4. Remove `ADMIN_BOOTSTRAP_EMAIL` from the environment after promotion.

The account can then access `/en/admin`. Admin APIs independently enforce the
`ADMIN` role. The dashboard manages service/pricing, business defaults, daily
availability, holidays, and appointment status/rescheduling. Set per-date
availability to closed or set its capacity to zero to stop bookings that day.

## Razorpay

Paid appointments stay pending until Razorpay confirms a captured payment. Set
these server-only variables in `.env` (never expose them in client code):

```env
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""
```

Configure a Razorpay webhook to
`https://your-domain.example/api/payments/webhook`, using the same webhook secret.
Subscribe to `payment.captured`, `payment.failed`, `refund.processed`, and
`order.paid`. Browser checkout signatures are checked on the server and payment
details are fetched from Razorpay before confirming a booking. Webhook event IDs
are stored uniquely to make deliveries idempotent.

The 15-minute pending reservation expires; a late captured payment is not allowed
to confirm an expired booking and requires support to arrange any refund. Cancelling
a paid appointment does not automatically issue a refund. Email notifications,
automated refunds, password recovery, and built-in login rate limiting are not
implemented; configure rate limiting at the hosting/WAF layer before production.
Set production environment variables and run `npx prisma migrate deploy` during
deployment. Do not push `.env` or provider secrets to Git.

## Validation

Run `npm test`, `npm run lint`, `npx prisma validate`, and `npm run build`.
The automated tests cover the date/timezone helpers; payment-provider behavior
still requires Razorpay test credentials and webhook testing in the provider
dashboard.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
