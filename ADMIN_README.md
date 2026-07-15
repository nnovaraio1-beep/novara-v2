# NOVARA Admin — CRUD Dashboard

Real, database-backed admin screens built on the existing Prisma schema, auth and
RBAC. This turn added functional CRUD for the highest-value resources; every
mutation is permission-checked server-side, validated, audited, and revalidates
the affected public routes.

> **Honest build status.** Authored without network access, so `npm install`,
> `npx prisma generate`, and `npm run build` were **not run here**. The code is
> real and statically audited (all imports resolve, zero unused imports, Prisma
> fields verified against the schema, Json snapshots serialized safely). You must
> run the build on your machine — I do **not** claim it passes.

## Bring it online

```bash
npm install                 # runs prisma generate (postinstall)
# DATABASE_URL must point at your Supabase Postgres in .env.local
npx prisma migrate deploy   # or: npx prisma db push
npm run admin:setup         # first super admin (ADMIN_INITIAL_* env vars)
npm run build
```

## Admin routes implemented this turn

| Route | What works |
|---|---|
| `/admin/login` | Real argon2 login, throttling, session cookie |
| `/admin/dashboard` | Real stats (orders, revenue, customers, unread forms), recent orders + submissions |
| `/admin/services` · `/new` · `/[id]` | Full CRUD: create, edit, duplicate, soft-delete, restore, search, status filter, pagination, bilingual fields, revision-on-edit |
| `/admin/packages` · `/new` · `/[id]` | Full CRUD: all package fields (price, sale price, platforms/posts/stories/reels/AI videos, popular/featured/quote-only/cart/buy-now), category filter, revisions |
| `/admin/orders` · `/[id]` | List with search/status filter; detail with items, totals, payments, customer; status update + internal note |
| `/admin/customers` | List, search, count of orders; create/update actions |
| `/admin/forms` | Submissions: filter by type/unread/spam, mark read/replied/spam, soft-delete, view detail |
| `/admin/audit-logs` | Immutable, searchable event log (actor, action, entity, IP, timestamp) |

Sidebar also links to routes not yet built this turn (portfolio, blog, categories,
add-ons, quotations, coupons, payments, translations, settings, users, legal) —
those items appear for permitted roles but their pages are the **next** slice.
They are not faked; they simply aren't implemented yet.

## Security properties (verified statically)

- Every mutation runs through `runAction()` → `requirePermission()` **server-side**.
  UI hiding is cosmetic; the server is the gate.
- CSRF token (session-bound) required on mutations via `getCsrf()` + `assertCsrf()`.
- Input validated with the existing zero-dep validator before any DB write.
- Soft-delete preserved (`deletedAt`) with trash + restore.
- Edits snapshot the prior row into `Revision` before overwrite.
- Every sensitive action writes an `AuditLog` row with secrets scrubbed.
- Public routes revalidated (`revalidatePath`) after content changes.
- Prices stored/edited as fils in the DB — no frontend code change needed to edit them.

## Still requires external setup (not configured or tested here)

| Requirement | For |
|---|---|
| Supabase `DATABASE_URL` + `npx prisma migrate deploy` | The entire admin |
| `npm run admin:setup` + `ADMIN_INITIAL_*` | First super admin |
| Media provider (Supabase Storage) keys | Media library (not built this turn) |
| Payment provider keys (server env) | Live payments |
| SMTP | Notification / reset emails |
| Owner legal info | Invoices, legal docs |

## Not built this turn (honest scope)

Media library, portfolio/blog CRUD, categories/add-ons editors, quotations,
coupons, payment settings UI, translations manager, theme/animation editors, site
settings, users/roles UI, legal editors, backups. The schema supports all of them;
they're the next block of work. I did not stub them, per your "no TODO-only
screens" instruction.
