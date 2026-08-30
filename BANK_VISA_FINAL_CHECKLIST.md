# NOVARA final bank and Visa readiness checklist

This checklist records website readiness work. It is not a claim of approval, certification, or legal compliance by Capital Bank, Visa, PCI SSC, or any other organization.

## Production security checks completed

- [x] Nonce-based production Content Security Policy is applied per request and propagated to the Next.js renderer.
- [x] Production CSP excludes `unsafe-eval`; framing and object embedding are denied.
- [x] HSTS, MIME-sniffing protection, referrer policy, permissions policy, and clickjacking headers are enabled.
- [x] Admin and customer sessions use strong random tokens, hashed server-side storage, expiry and revocation.
- [x] Sensitive session cookies are `HttpOnly`, `Secure` in production, and `SameSite=Lax`.
- [x] State-changing authenticated operations retain server-side authorization and CSRF/origin protections.
- [x] Checkout prices and totals are recomputed from the server-side catalogue.
- [x] Online payment remains disabled until a reviewed provider is configured.
- [x] No local form collects card numbers, CVV/CVC, PINs, or full card credentials.
- [x] Public vulnerability-reporting instructions are published at `/.well-known/security.txt`.
- [x] CI checks lint, types, production build, and production dependency advisories.

## Website and legal checks completed

- [x] Arabic and English marketing, store, contact, and legal routes are available.
- [x] Privacy, terms, refund/cancellation, and service delivery/fulfillment policies are linked publicly and at checkout.
- [x] Checkout requires explicit policy consent and records the shared policy version.
- [x] Contact details consistently identify NOVARA in Amman, Jordan.
- [x] Sensitive and transactional routes are excluded from the sitemap, marked against indexing where applicable, and disallowed for crawlers as hygiene only.
- [x] No active expired promotion, simulated payment success, card-data form, or certification badge is present.

## Production environment configuration still required

- [ ] Set unique production `AUTH_SECRET` and `ORDER_ACCESS_SECRET` values in the hosting environment.
- [ ] Configure production `DATABASE_URL` and `DIRECT_URL` and apply reviewed Prisma migrations.
- [ ] Configure `SMTP_URL`, `MAIL_FROM`, and `CONTACT_TO_EMAIL`; verify delivery and SPF/DKIM/DMARC with the mail provider.
- [ ] Confirm `NEXT_PUBLIC_SITE_URL=https://nnovara.io`, production tax treatment, and bank-transfer availability.
- [ ] Keep `PAYMENT_PROVIDER` and `CSP_PAYMENT_ORIGINS` empty until the hosted gateway implementation is reviewed.
- [ ] Confirm production backups, restore testing, monitoring, incident contacts, and access reviews.

## Capital Bank integration information still required

- [ ] Official hosted/redirect checkout API documentation and supported environments.
- [ ] Merchant identifier, credential format, credential lifecycle, and approved storage requirements.
- [ ] Exact session, return, cancel, callback, and webhook parameters.
- [ ] Official webhook authentication/signature algorithm, replay window, and source-network guidance.
- [ ] Amount/currency representation, transaction status mapping, idempotency rules, refunds, and reconciliation process.
- [ ] Exact provider origins required by CSP and the bank-approved production URLs.
- [ ] Test credentials, certification test cases, go-live procedure, support channel, and incident/escalation contacts.

## Merchant documents for the owner to prepare

- [ ] Current business registration and ownership documents requested by the acquiring bank.
- [ ] Authorized signatory identification and bank account evidence requested by the bank.
- [ ] Business address, contact details, domain ownership, and service/pricing evidence.
- [ ] Privacy, terms, refund/cancellation, fulfillment, and complaint-handling policies for bank review.
- [ ] Expected transaction volumes, average/highest ticket values, currencies, markets, and fulfillment timelines.
- [ ] Any tax registration or licenses that genuinely apply; do not create or publish identifiers that have not been issued.

## External validation

- [ ] Confirm the applicable PCI DSS merchant scope, SAQ type, scanning, and any ASV requirements directly with Capital Bank/acquirer after the hosted payment flow is selected.
- [ ] Complete staging and production end-to-end payment, webhook, duplicate-event, failure, cancellation, refund, and reconciliation tests using official bank documentation.
- [ ] Obtain owner/legal review of policies and verify all official business details before onboarding submission.

NOVARA must not be described as “Visa approved,” “Capital Bank approved,” “PCI DSS certified,” or “100% secure” unless current independent evidence explicitly supports that statement.
