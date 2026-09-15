# Fruitstand Waitlist

An in-house restaurant waitlist app: a kiosk screen (for an iPad at the host stand) where
customers enter their name, party size, and phone number, and a staff dashboard where
employees can text a customer when their table is ready.

- `/` — kiosk entry screen
- `/dashboard` — staff dashboard (list of waiting parties, Notify / Seated / Remove)

## Stack

- Next.js (App Router, TypeScript, Tailwind)
- Supabase (Postgres) for storing waitlist entries
- Twilio for sending "your table is ready" texts

## Setup

1. Create a Supabase project.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Log in and link the Supabase CLI to your project, then push the schema:

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

   (`<your-project-ref>` is in your Supabase project's URL/Settings → General.) This creates
   the `waitlist_entries` table from [`supabase/migrations`](supabase/migrations).
4. Create a Twilio account and buy/configure a phone number that can send SMS.
5. Copy the env example and fill in your keys:

   ```bash
   cp .env.local.example .env.local
   ```

6. Run the dev server:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000` on the iPad (kiosk) and `http://localhost:3000/dashboard`
   on the staff device.

## Changing the schema

Add a new file to [`supabase/migrations`](supabase/migrations) (or run
`npx supabase migration new <name>` to scaffold one), then `npx supabase db push` to apply it.
Don't edit past migrations — add a new one.

## Notes

- The dashboard has no login yet — treat its URL as staff-only until you add one.
- Phone numbers are normalized to E.164 assuming US numbers (10-digit input becomes `+1XXXXXXXXXX`).
