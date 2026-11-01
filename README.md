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

The API uses Next.js Node.js Route Handlers and Prisma ORM with Supabase
PostgreSQL. Database access is server-side; the browser talks only to the
application API. Do not expose `SUPABASE_DB_URL` to client code.

1. Create a Supabase project and copy the server-side PostgreSQL connection
   string from Project Settings > Database into `.env` as `SUPABASE_DB_URL`.
   Keep the password secret. Use the connection mode recommended for the
   deployment host; a transaction pooler may be needed on serverless hosts.
2. Copy `.env.example` to `.env` and set the required variables.
3. Install the Supabase CLI if needed, authenticate, and link this repository to
   the intended project:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Review the migration, then apply it to the linked project:

   ```bash
   npx supabase db push
   ```

5. Run `npm run dev`.

The active database schema is versioned under `supabase/migrations`. The
`prisma/migrations` and `prisma/migrations-mysql` directories are retained as
historical SQLite/MySQL records only; do not apply them to Supabase. Prisma
remains the application ORM, while Supabase PostgreSQL is the only persistent
database.

The migration creates an empty schema; it does not copy records from the former
SQLite or MySQL databases. Before moving existing data, make a verified backup
of each source database, import into a separate Supabase project or staging
schema, preserve the current string IDs, and reconcile row counts and key
relationships for every table before switching production traffic. Test booking
capacity and payment state after import. Do not delete or modify source data
during this process. No production database credentials or data dump were
provided, so a data transfer has not been run.

RLS is enabled and forced for all application tables. `anon` and `authenticated`
Supabase API roles have no table privileges and receive explicit deny policies;
the existing application uses its server-side custom sessions and user/admin
authorization checks. The privileged database connection must therefore remain
server-only. No Supabase Auth, browser database client, storage bucket, or
service-role key is configured by this migration. Requests to expose database
tables directly to Supabase clients require a separate RLS design and security
review.

The Next.js server adds `nosniff`, frame denial, referrer, and permissions
headers. Configure HSTS at the HTTPS deployment edge.

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
Set the production `SUPABASE_DB_URL` and Razorpay variables in the hosting
provider's secret store. Apply reviewed schema changes with `npx supabase db
push` before deploying application code. Keep a database backup before every
production migration; rollback should use a reviewed forward migration or
restore into a separate project, not an unreviewed destructive reset.

## Validation

Run `npm test`, `npm run lint`, `npx prisma validate`, and `npm run build`.
Prisma generation and production builds do not need a reachable database;
database migrations and CRUD/RLS integration tests do.
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
