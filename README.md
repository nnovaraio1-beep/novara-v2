# NOVARA — v2

Bilingual (Arabic/English, RTL-first) corporate website and service-commerce
platform for NOVARA (technology, creative & digital marketing, Amman), built on
Next.js 15 with a typed local data layer.

## Run

```bash
npm install
npm run dev      # http://localhost:3000 → /en
npm run build    # the real verification gate
npm run start
```

> **Honest note on verification.** This codebase was authored in an environment
> with **no network access**, so `npm install` / `npm run build` / `npm run dev`
> were **never executed here**. It was audited mechanically instead: all `@/`
> imports resolve; 283 literal + 74 dynamic translation keys resolve in both
> locales; en/ar message files have exact 383-key parity; every referenced image
> exists; no text is below 13px; zero unused imports; RSC client/server
> boundaries and Next-15 async `params` are correct; no new dependencies were
> introduced. What only `npm run build` on your machine adds is the actual
> TypeScript type-check — **run it, and I have not claimed it passes.**

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 (+ @tailwindcss/postcss)
· next-intl · Framer Motion · Lucide React. Single app, npm only. No monorepo,
no database, no auth backend, no live payment integration in this phase.

## Routes

Localized (`/en/*`, `/ar/*`): home, services + `[slug]`, store + `[slug]`,
social-media, portfolio + `[slug]`, about, contact, blog + `[slug]`, faq,
careers, privacy, terms, cart, checkout, order/success, order/failed, login,
register, forgot-password, account. Plus a localized 404 and a global 404.

API: `checkout/session`, `payments/webhook/[provider]`, `orders/[number]`,
`auth/[...action]`. Also `sitemap.ts` and `robots.ts`.

## Commerce & payment architecture (this is the important part)

- **The browser never sets a price.** `src/lib/commerce/catalog.ts` recomputes
  every total on the server in fils from slugs + add-on slugs. A request body
  claiming `total: 1` produces the real amount.
- **Payments fail closed.** No real gateway is implemented (they need vendor
  SDKs). `onlinePaymentAvailable()` returns false, so checkout shows bank
  transfer + quotation — never a card form that does nothing.
- **An order becomes "paid" only via a verified webhook** — signature-checked,
  idempotent, transition-guarded. A browser landing on `/order/success` proves
  nothing; that page fetches real status from `/api/orders/[number]`.
- Provider interface (`createPaymentSession`, `verifyPayment`, `cancelPayment`,
  `refundPayment`, `getPaymentStatus`, `verifyWebhook`) is ready for Stripe /
  PayPal / HyperPay / Tap / MyFatoorah / bank transfer adapters.
- 15 typed domain models (`src/server/models.ts`) + a repository seam
  (`src/server/repository.ts`, **in-memory dev harness — labelled, not
  production storage**).

## Features needing real credentials / services

| Feature | Needs | Until then |
|---|---|---|
| Online card payment | A provider SDK + keys, `PAYMENT_PROVIDER` set | Bank transfer + quotation shown |
| Accounts / login | `AUTH_SECRET` + `DATABASE_URL` + provider | Auth API returns 501; guest checkout works |
| Order persistence | A database behind the repository interface | In-memory dev harness |
| Contact form delivery | `SMTP_URL` | Form is a demo |
| Tax on checkout | `TAX_RATE` (decimal) | 0 |

## Environment variables

See `.env.example`. None are required to run the site. Payment/auth/email stay
off (and say so) until configured. Secrets are server-side only — never
prefix payment or auth secrets with `NEXT_PUBLIC_`.

## Owner-provided information still required

Company legal name · registration details · tax number · physical address ·
contact email · WhatsApp number · real social media links · payment provider
credentials · authentication provider credentials. All are placeholders in the
code and messages; none were invented.

## Honesty notes

- Portfolio items are **concept projects**, labelled bilingually — not client work.
- No fabricated statistics, testimonials, client logos, ratings, or awards.
- Blog posts are starter editorial content the owner can replace.
- Privacy / Terms are templates and must be lawyer-reviewed before launch.
- Advertising-spend disclaimer is present in Arabic and English.
