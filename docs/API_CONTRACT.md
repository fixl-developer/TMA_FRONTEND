# TalentOS API Contract

> Reference for backend integration. Frontend uses mock/seed data when `NEXT_PUBLIC_USE_MOCK_API` is not `"false"`.

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_USE_MOCK_API` | `true` | Set to `"false"` to use real API |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Base URL for REST API |

## API Client

- **Location:** `frontend/lib/api/client.ts`
- **Methods:** `get`, `post`, `put`, `patch`, `delete`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`, `X-Tenant-Id: <tenantId>`

## Endpoints (from overall2.md)

### Auth & Tenancy
- `GET /v1/tenants` – List tenants for user
- `GET /v1/users` – Users (tenant-scoped)
- `POST /v1/auth/login` – Login
- `POST /v1/auth/refresh` – Refresh token

### Talent CRM
- `GET /v1/talents` – List talents
- `GET /v1/talents/:id` – Talent detail
- `POST /v1/talents` – Create talent

### Castings & Bookings
- `GET /v1/castings` – List castings
- `GET /v1/castings/:id` – Casting detail
- `POST /v1/castings` – Create casting
- `GET /v1/bookings` – List bookings
- `GET /v1/bookings/:id` – Booking detail
- `POST /v1/bookings` – Create booking

### Contracts
- `GET /v1/contracts` – List contracts
- `GET /v1/contracts/:id` – Contract detail
- `POST /v1/contracts` – Create contract
- `PATCH /v1/contracts/:id` – Update draft
- `POST /v1/contracts/:id/send` – Send for signature
- `POST /v1/contracts/:id/sign` – Sign

### Finance
- `GET /v1/wallets` – Wallets
- `GET /v1/ledger` – Ledger entries
- `GET /v1/invoices` – Invoices
- `GET /v1/escrows` – Escrows
- `GET /v1/credits` – Credits account
- `GET /v1/statements` – Statements

### Disputes & Notifications
- `GET /v1/disputes` – Disputes
- `GET /v1/notifications` – Notifications
- `PATCH /v1/notifications/:id/read` – Mark read

### Automations
- `GET /v1/automations` – Automations
- `POST /v1/automations` – Create automation
- `PATCH /v1/automations/:id` – Update/toggle

### Admin & Audit
- `GET /v1/admin/settings` – Tenant settings
- `GET /v1/admin/limits` – Usage limits
- `GET /v1/audit` – Audit logs (tenant or platform)

## Service Modules

Services in `frontend/shared/services/` use seed data directly. To switch to real API:

1. Import `apiClient` from `@/lib/api/client`
2. Replace seed calls with `apiClient.get('/v1/...')` etc.
3. Map response shapes to match existing interfaces

## Payloads

Request/response shapes align with seed JSON structure. See `frontend/data/seed/` for reference.
