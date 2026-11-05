# HyperPay COPYandPAY — test integration only

No deployment, live payments, refunds, recurring debits or webhook activation is included.
The provider remains disabled by default. Its only host is `https://eu-test.oppwa.com`.
Confirm this test region with HyperPay for the merchant test entity; do not substitute a live host.

## Repository review

- Next.js 15 / Prisma 6 / PostgreSQL. `/api/checkout/session` recomputes catalogue totals in integer JOD fils (1000 fils/JOD), records an order and a payment.
- `src/lib/payments/registry.ts` previously implemented bank transfer only. HyperPay now requires explicit test configuration.
- Prisma has orders, payments and invoices, but no subscription lifecycle or gateway event ledger. Monthly catalogue items are not subscriptions in the database.
- Browser success pages only read status. The new return handler queries the gateway using the stored checkout, never a supplied `resourcePath` or claimed success.
- There is no existing Prisma migration history in this repository. For an existing **test** DB, review/apply `prisma/sql/hyperpay-test.sql` once, or use the project's schema-push workflow for a disposable database. Do not use a partial migration history as a baseline for production.

## Server settings

Set these only in the private server environment / secret manager. Never paste their values into chat, source control, client bundles or logs:

```dotenv
PAYMENT_PROVIDER=hyperpay
HYPERPAY_MODE=test
HYPERPAY_ACCESS_TOKEN=
HYPERPAY_ENTITY_ID=
NEXT_PUBLIC_SITE_URL=https://your-test-site.example
ORDER_ACCESS_SECRET=
DATABASE_URL=
DIRECT_URL=
```

Obtain a test access token, VISA/MASTER enabled entity, supported JOD processing, test cards and 3DS instructions directly from HyperPay. Use a separate test database and site. Keep `PAYMENT_PROVIDER` blank elsewhere. A live mode value disables this implementation. The local widget response has a dedicated CSP limited to the test host and uses the gateway-provided script integrity. If a test 3DS flow requires additional origins, investigate the exact HyperPay-documented origins before widening the policy.

## Merchant-specific sandbox checklist (Nov 2026)

The merchant support email supplied the **EU test** endpoint, JOD, VISA/MASTER and 3DS2:
- The checkout POST includes `testMode=EXTERNAL`, `customParameters[3DS2_enrolled]=true`, `merchantTransactionId`, customer email/name and complete billing street/city/state/postcode/country.
- `billing.country` is two-letter uppercase ISO 3166-1; the checkout form asks for it separately.
- Only amounts exactly expressible to **two decimals** are sent (e.g. `12.34`); non-representable fils totals fail closed instead of rounding or changing the charged value. Recheck tax/discount catalog prices before real testing.
- Only use test cards supplied in official support documentation. 3DS2 challenge may need review of iframe/CSP restrictions.
- The access token was visible in a shared screenshot: request a replacement, and do not use the exposed token.

## Isolated hosting and database (not yet provisioned)

1. Create a separate, nonproduction Netlify **site** pointing to branch `feat/hyperpay-copyandpay-test`, not merely a preview of the production site. Verify no production domain, custom domain alias, or production environment variable inheritance. Keep this test site access restricted.
2. Provision an **independent disposable PostgreSQL** database, with new credentials and no production data. Review `prisma/schema.prisma` and `prisma/sql/hyperpay-test.sql`. Apply schema initialization on the isolated DB only, then inspect the `Payment` table fields and unique constraints.
3. In that site's private Netlify environment variables, set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS test origin, `DATABASE_URL`, `DIRECT_URL`, a unique `ORDER_ACCESS_SECRET` and `AUTH_SECRET`, `HYPERPAY_MODE=test`, `HYPERPAY_ENTITY_ID`, `HYPERPAY_ACCESS_TOKEN`, `PAYMENT_PROVIDER=hyperpay`. Confirm build and functions contexts inherit these exact values **only in the test site**. No secrets in Git, chat, commit logs, public build output or `NEXT_PUBLIC_` keys except site origin.
4. Do not set or re-enable payment webhooks: this implementation rejects them. Review 3DS2 CSP/iframe behavior in the deployed test site before attempting card tests.
5. Execute sandbox cases using only nonproduction cards and record provider transaction IDs, server logs (redacted) and database states. Never merge/release on the basis of unit tests alone. Resolve the existing npm audit issues separately before production.
6. Do not enable sandbox transactions until the **rotated** token is configured privately and the isolated database/site are verified.

## Verification and state

1. Create a server-priced order, prepare `DB` checkout with order ID as `merchantTransactionId`, persist checkout ID and widget integrity, and mark the payment processing.
2. Render hosted VISA/MASTER fields; no local card collection. The guest order access token binds the widget/return to its order.
3. Return/status checks query the fixed `/v1/checkouts/{persistedId}/payment` path with server credentials. Compare transaction ID, order ID, exact amount, currency, debit type and brand; accept only the explicit settled-result allowlist. Other results leave the order pending.
4. A database transaction conditionally updates processing → paid and pending_payment → confirmed together, records an audit entry, and stores a unique gateway transaction reference. Repeated returns do not confirm twice. A durable per-payment lease limits queries to at most two/minute, including across app instances.
5. HyperPay's generic webhook adapter always rejects callbacks. Do not point notifications at it as a completion mechanism. Browser parameters can trigger a status inquiry but cannot establish payment success.

Timeouts or indeterminate results stay pending. Do not blindly retry checkout creation or charge again. Support must reconcile with the HyperPay test dashboard/transaction reports: the checkout status endpoint may become unavailable after its first successful retrieval. A crash between status retrieval and DB commit therefore requires reconciliation. Automatic recovery/polling, authenticated encrypted webhooks, reporting reconciliation and refunds are follow-up scope, required before any production proposal.

## Subscriptions

Online payment is unavailable for monthly/mixed carts; quotation and enabled bank-transfer paths remain available. No initial debit is presented as a subscription, no token is stored, and no renewal is scheduled. A future recurring implementation needs an explicit consent/card-on-file agreement, token storage controls, subscription schema and lifecycle, renewal failures/retries/cancellation and verified recurring events.

## Validation

Run `npx prisma generate`, `npm run typecheck`, `npm run lint`, `npx tsx --test tests/hyperpay.test.ts`, and `npm run build`.
Before test acceptance, exercise the full flow against a disposable PostgreSQL DB and HyperPay test account: success, 3DS, decline, abandon, timeout, forged callback, amount/currency/order/type mismatch, concurrent duplicate returns, cancelled order and monthly/mixed cart. Unit checks do not replace these credential-dependent checks.

## Official references reviewed

- https://hyperpay.docs.oppwa.com/integrations/widget — checkout, hosted form, status validation, two status requests/minute and checkout expiry.
- https://hyperpay.docs.oppwa.com/reference/resultCodes — distinguish settled, pending and review outcomes.
- https://hyperpay.docs.oppwa.com/integrations/subscriptions — tokenization, card-on-file agreement and scheduled recurring lifecycle.

## Results for this PR

Local Prisma generation, TypeScript, ESLint, all 3 security-focused unit tests and the Next.js production build passed. No gateway credentials or test database were configured, so the external end-to-end matrix and SQL application remain unexecuted. `npm audit --omit=dev` reports 4 pre-existing production dependency findings (1 critical, 3 high: next, nodemailer, sharp, source-map-js). The lockfile and dependency versions are unchanged; the existing CI audit gate may fail until these are addressed separately.
