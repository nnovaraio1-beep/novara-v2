# NOVARA Admin — Setup

This document covers the admin dashboard **foundation**: real authentication,
role-based access control, and the database schema. Content-management screens
(page builder, media library, CMS) build on top of this layer in later phases.

> **Honest scope note.** This foundation was authored without network access, so
> `npm install`, `prisma generate`, `prisma migrate`, and `npm run build` were
> **not run here**. The schema, auth, RBAC, sessions and CSRF are real code, not
> mocks — but you must run the steps below on your machine to bring the admin
> online, and nothing here is "tested" until you do.

## 1. Database (§30)

The admin requires **PostgreSQL**. The public website runs without it — only
`/admin` needs the database.

```bash
# 1. Set the connection string
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/novara"' >> .env.local

# 2. Install deps (runs `prisma generate` via postinstall)
npm install

# 3. Create the schema
npx prisma migrate dev --name init      # development
# or, in production:
npx prisma migrate deploy
```

If you change `prisma/schema.prisma`, re-run `prisma migrate dev`.

## 2. First super admin (§34)

```bash
# Set once, in your environment (never commit real values):
export ADMIN_INITIAL_EMAIL="you@company.com"
export ADMIN_INITIAL_PASSWORD="a-long-passphrase-min-12-chars"
export ADMIN_INITIAL_NAME="Your Name"

npm run admin:setup
```

This creates the super admin **only if no admin user exists**, hashes the
password with argon2id, and flags the account to require a password change on
first login. Then sign in at `/admin/login`.

## 3. Authentication model (§2)

- Passwords: argon2id (`@node-rs/argon2`), OWASP parameters.
- Sessions: random token in an **HttpOnly, Secure, SameSite=Lax** cookie; the
  database stores only a SHA-256 hash of the token, so a DB leak can't be
  replayed. 8-hour expiry; revocable per-session and "all devices".
- CSRF: a per-session token, constant-time compared on mutations.
- Login throttling: 5 failed attempts → 15-minute lockout, per account.
- Generic "invalid email or password" (never reveals which accounts exist),
  with timing equalized between unknown-email and wrong-password paths.

## 4. Authorization (§2, §20)

Six roles: `super_admin`, `admin`, `content_manager`, `store_manager`,
`support_agent`, `viewer`. Checks are on **granular permissions**
(`content.write`, `orders.read`, `users.manage`, …), not role names. Roles map
to a default permission set; per-user grants/revokes layer on top. All checks
run **server-side** (`requirePermission`, `requireSuperAdmin`) — there is no
client-only authorization. `super_admin` alone can manage users, payments,
settings, backups.

## 5. Media storage (§8)

`MEDIA_PROVIDER` selects the backend (`local` for dev; `s3` / `r2` /
`cloudinary` / `vercel_blob` for production). Files are stored by key/URL —
**never** as base64 in the database. Provider adapters are stubs in this
foundation phase; wire your provider's SDK before uploads work in production.

## 6. Payment provider config (§21)

`PaymentProviderConfig` stores only display metadata (name, mode, currency,
publishable id, bank-transfer instructions). **Secret keys are never stored in
the database** — they stay in server env vars. A provider is never marked active
unless its required configuration exists.

## 7. Audit logs (§25)

Every login, logout, failed login, and mutation writes an append-only
`AuditLog` row with actor, action, entity, IP, and user agent. Values are
scrubbed of anything matching `password|secret|token|key|cvv|card|…` before write.

## What still requires external setup

| Requirement | Needed for | Status |
|---|---|---|
| PostgreSQL + `DATABASE_URL` | The entire admin area | Not provisioned |
| `npm run admin:setup` + env creds | First super admin | Not run |
| Media provider SDK + keys | Uploads in production | Adapter stubbed |
| Payment provider keys (server env) | Live payments | Not configured |
| SMTP | Password-reset + notification emails | Not configured |
| Owner legal info | Invoices, legal pages | Placeholders only |

Nothing above is configured or tested here — it can't be without real
credentials and a database.
