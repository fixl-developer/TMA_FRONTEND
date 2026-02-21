Domain model and bounded contexts
Core bounded contexts (modules)
Identity & Tenancy


Tenants, org units/teams, users, invitations, sessions


RBAC + ABAC, policy evaluation, service identities (automations)


Talent CRM


Talent profiles, portfolio assets, tags/segments, availability, rate cards


Jobs / Casting / Bookings


Job briefs, submissions/shortlists, holds/availability checks, bookings, call sheets


Contracts & E-Signature


Templates, clause library, contract generation, signature workflow, signed artifacts (PDF)


Finance Ledger / Wallet / Credits


Double-entry ledger, balances, credits issuance/consumption, statements


Payments


PSP integration (Stripe/Razorpay/etc.), invoices (v1), webhooks, reconciliation events


Escrow


Escrow accounts per job/contract milestone, state machine, partial release, auto-release


Disputes


Dispute lifecycle, evidence, arbitration decisions, enforcement actions


Notifications


In-app + email/SMS (optional), preferences, templates, delivery logs


Automation Orchestrator (v1)


Trigger/condition/action workflows with guardrails, retries, idempotency, compensation


Analytics & Audit


Audit logs (append-only), event tracking, basic dashboards + exports


Admin & Governance


Tenant admin console + Superadmin governance (enable/disable tenants, risk flags, support tools)



2) Backend & system architecture
Day-1 architecture choice
Modular monolith with strict internal boundaries:
modules/identity


modules/talent


modules/jobs


modules/contracts


modules/ledger


modules/payments


modules/escrow


modules/disputes


modules/notifications


modules/automations


modules/audit_analytics


modules/admin


You implement each module with:
Controllers (HTTP)


Services (domain logic)


Repositories (data access)


DTOs (request/response)


Policies (RBAC/ABAC)


State machines (escrow, disputes, contracts)


Outbox events (reliable async)


Infrastructure components
API server (stateless)


Postgres (primary)


Redis (cache + rate limit + queues)


Queue worker (BullMQ/SQS worker) for emails, PDFs, webhooks processing, timers


Object storage (S3-compatible) for portfolio assets, evidence, signed PDFs


Observability: OpenTelemetry + logs + metrics + alerting


WAF/CDN for edge protection + static assets


Key cross-cutting patterns
a) Transactional Outbox (highly recommended Day-1)
When a transaction changes core data (e.g., escrow release), you write:
the domain rows


an outbox event row
 …in the same DB transaction. Workers drain outbox → queue → integrations/notifications.


b) Idempotency everywhere money touches
Client actions: idempotency key per request


Webhooks: store event IDs, ignore duplicates


State transitions: enforce atomic compare-and-swap


c) State machines for sensitive workflows
Contracts: draft → sent → signed → void


Escrow: created → funded → locked → releasable → released/partial → disputed → resolved


Disputes: opened → evidence → review → decision → closed



3) API design standards
API style
REST JSON for Day-1 speed


Consistent resource naming: /v1/{resource}


Pagination: ?cursor=...&limit=... (or ?page=&pageSize= if you prefer)


Filtering: ?status=&q=&from=&to=


Sorting: ?sort=created_at:desc


Error format:


{ "error": { "code": "POLICY_DENIED", "message": "...", "details": {...}, "requestId": "..." } }

Routing structure (example)
Public/auth: /v1/auth/*


Tenant-scoped: /v1/tenants/{tenantId}/*


OR (cleaner): derive tenant from JWT + X-Tenant-Id header, keep routes shorter:


/v1/talents, /v1/jobs, etc.


Policy middleware validates tenant membership.


Recommendation: use X-Tenant-Id + JWT, and never allow cross-tenant access except via explicit “shared project” constructs later.
Controller responsibilities
Validate input


Call service


Map domain → DTO


Emit audit and outbox as needed


Never embed business rules in controllers



4) Endpoint catalog (Day-1 complete)
Below is the complete required endpoint set for the Day-1 launch scope you defined.
4.1 Identity & Tenancy
Auth
POST /v1/auth/register


POST /v1/auth/login


POST /v1/auth/logout


POST /v1/auth/refresh


POST /v1/auth/forgot-password


POST /v1/auth/reset-password


GET /v1/auth/me


Tenants
POST /v1/tenants (create tenant)


GET /v1/tenants (list my tenants)


GET /v1/tenants/:tenantId


PATCH /v1/tenants/:tenantId


POST /v1/tenants/:tenantId/switch (issue scoped token optional)


Users & Teams
GET /v1/users (tenant users)


POST /v1/users/invite


POST /v1/users/accept-invite


PATCH /v1/users/:userId (profile)


PATCH /v1/users/:userId/roles


GET /v1/teams


POST /v1/teams


PATCH /v1/teams/:teamId


POST /v1/teams/:teamId/members


DELETE /v1/teams/:teamId/members/:userId


Policies
GET /v1/policies/capabilities


GET /v1/policies/roles


POST /v1/policies/roles


PATCH /v1/policies/roles/:roleId


POST /v1/policies/evaluate (admin/debug only)



4.2 Talent CRM
GET /v1/talents


POST /v1/talents


GET /v1/talents/:talentId


PATCH /v1/talents/:talentId


DELETE /v1/talents/:talentId (soft delete recommended)


POST /v1/talents/:talentId/tags


DELETE /v1/talents/:talentId/tags/:tagId


GET /v1/talents/:talentId/availability


PUT /v1/talents/:talentId/availability


Portfolio assets
POST /v1/assets/presign-upload


POST /v1/assets/confirm-upload


GET /v1/talents/:talentId/assets


POST /v1/talents/:talentId/assets


PATCH /v1/talents/:talentId/assets/:assetId


DELETE /v1/talents/:talentId/assets/:assetId



4.3 Jobs / Casting / Bookings
Jobs
GET /v1/jobs


POST /v1/jobs


GET /v1/jobs/:jobId


PATCH /v1/jobs/:jobId


POST /v1/jobs/:jobId/publish


POST /v1/jobs/:jobId/close


Submissions / Shortlists
GET /v1/jobs/:jobId/submissions


POST /v1/jobs/:jobId/submissions (add talent to job)


PATCH /v1/jobs/:jobId/submissions/:submissionId (status, notes)


POST /v1/jobs/:jobId/shortlist (bulk action)


POST /v1/jobs/:jobId/holds (availability hold)


DELETE /v1/jobs/:jobId/holds/:holdId


Bookings
GET /v1/bookings


POST /v1/jobs/:jobId/bookings


GET /v1/bookings/:bookingId


PATCH /v1/bookings/:bookingId (dates, location, status)


POST /v1/bookings/:bookingId/confirm


POST /v1/bookings/:bookingId/cancel


Call sheets
GET /v1/bookings/:bookingId/callsheet


PUT /v1/bookings/:bookingId/callsheet


POST /v1/bookings/:bookingId/callsheet/publish



4.4 Contracts & E-Signature
Templates / clauses
GET /v1/contract-templates


POST /v1/contract-templates


GET /v1/contract-templates/:templateId


PATCH /v1/contract-templates/:templateId


GET /v1/clauses


POST /v1/clauses


Contracts
GET /v1/contracts


POST /v1/contracts (create from booking/job + template)


GET /v1/contracts/:contractId


PATCH /v1/contracts/:contractId (draft edits)


POST /v1/contracts/:contractId/send


POST /v1/contracts/:contractId/void


GET /v1/contracts/:contractId/artifacts (PDFs)


Signatures
POST /v1/contracts/:contractId/signers (add parties)


POST /v1/contracts/:contractId/sign (in-app sign v1)


POST /v1/esign/webhook (provider webhook)



4.5 Ledger / Wallet / Credits
Ledger
GET /v1/wallets (tenant wallets)


GET /v1/wallets/:walletId/balance


GET /v1/wallets/:walletId/ledger (entries)


POST /v1/ledger/transfer (internal, admin-only)


GET /v1/statements (monthly)


GET /v1/statements/:statementId


Credits
POST /v1/credits/issue


POST /v1/credits/revoke


GET /v1/credits/balance


GET /v1/credits/ledger



4.6 Payments (PSP)
Invoices (v1)
POST /v1/invoices


GET /v1/invoices


GET /v1/invoices/:invoiceId


POST /v1/invoices/:invoiceId/finalize


POST /v1/invoices/:invoiceId/pay (creates PSP session)


Webhooks
POST /v1/payments/webhook


GET /v1/payments/events (admin)


POST /v1/payments/reconcile (admin/manual)



4.7 Escrow
POST /v1/escrows (create from contract milestone)


GET /v1/escrows


GET /v1/escrows/:escrowId


POST /v1/escrows/:escrowId/fund (creates invoice/session)


POST /v1/escrows/:escrowId/lock


POST /v1/escrows/:escrowId/release


POST /v1/escrows/:escrowId/release-partial


POST /v1/escrows/:escrowId/dispute


POST /v1/escrows/:escrowId/cancel (guarded)



4.8 Disputes
POST /v1/disputes


GET /v1/disputes


GET /v1/disputes/:disputeId


POST /v1/disputes/:disputeId/evidence (presigned upload flow)


POST /v1/disputes/:disputeId/assign (admin)


POST /v1/disputes/:disputeId/decision (release/refund/redo/close)


POST /v1/disputes/:disputeId/close



4.9 Notifications
GET /v1/notifications


PATCH /v1/notifications/:notificationId (mark read)


GET /v1/notification-preferences


PUT /v1/notification-preferences



4.10 Automation Orchestrator (v1)
GET /v1/automations


POST /v1/automations


GET /v1/automations/:automationId


PATCH /v1/automations/:automationId


POST /v1/automations/:automationId/enable


POST /v1/automations/:automationId/disable


GET /v1/automation-runs


GET /v1/automation-runs/:runId


POST /v1/automation-runs/:runId/retry (admin)



4.11 Audit & Analytics
GET /v1/audit-logs


GET /v1/events (analytics events, admin)


POST /v1/events/ingest (internal)


GET /v1/dashboards/overview


GET /v1/dashboards/jobs


GET /v1/dashboards/finance



4.12 Admin & Superadmin
Tenant Admin
GET /v1/admin/settings


PATCH /v1/admin/settings


GET /v1/admin/limits


PATCH /v1/admin/limits


GET /v1/admin/risk


POST /v1/admin/credits/issue


Superadmin
GET /v1/super/tenants


PATCH /v1/super/tenants/:tenantId (enable/disable/risk flags)


GET /v1/super/audit


GET /v1/super/support/cases (optional v1 stub)



5) Workflow engines & state management
5.1 Orchestrator design (v1)
Goal: reliable automations without building a full BPMN suite.
Entities
automation_definitions


trigger: event type (e.g., contract.signed)


conditions: JSON (simple expression language)


actions: list of steps (notify, create_escrow, set_status, issue_credit, create_invoice)


guardrails: max runs/hour, approval required, allowed roles


automation_runs


state: queued/running/succeeded/failed/cancelled


idempotency key (per trigger event)


retries, last_error, next_attempt_at


automation_steps


step state and outputs


Execution rules
Always execute with an automation service identity (scoped capabilities)


Must be idempotent per trigger event ID


Support compensation for reversible steps (e.g., “unsend notification” isn’t possible → log-only; but “create invoice” can be voided)


5.2 State machine patterns
Use explicit transition tables and enforce:
transition allowed?


actor allowed?


preconditions met?


side effects (outbox events + audit)


Escrow state machine (Day-1)
created → funding_pending → funded → locked


locked → releasable (by contract signed + conditions or manual)


releasable → released | partial_released


any of funded|locked|releasable → disputed


disputed → resolved_release | resolved_refund | resolved_split → closed


Dispute state machine
opened → evidence → review → decision_pending


decision_pending → decided → closed


Contract state machine
draft → sent → partially_signed → signed


draft|sent → void



6) Third-party integrations
Payments (choose one Day-1)
Stripe (global) or Razorpay (India-heavy), etc.


Required pieces:


Payment intent/session creation


Webhook verification & event storage


Refunds (optional Day-1; can be admin/manual)


Critical: webhook idempotency table payment_webhook_events


E-Sign
Fastest Day-1: in-app signature (legal acceptance depends on jurisdiction) + store signed PDF + audit trail


Or integrate DocuSign/Dropbox Sign:


envelope creation


signer emails


webhook for completion


store completion cert + final signed PDF


Storage
S3-compatible with presigned URLs


Optional malware scan pipeline (post-upload queue job)


Email/SMS
Email: SES/SendGrid/Postmark


SMS optional: Twilio


Observability
Sentry (FE/BE error tracking)


OTel to Grafana/Datadog/etc.



7) Database schema design (Postgres) + data strategy
7.1 Multi-tenant isolation strategy
Day-1 recommended: shared DB, shared schema, strict tenant_id everywhere.
Hard isolation options (later)
per-tenant schema


per-tenant DB


hybrid: “VIP tenants” moved to dedicated DB


Enforcement layers (use all three)
Application enforcement: repository requires tenant_id


DB-level (recommended): Postgres Row Level Security policies


Operational: separate encryption keys per tenant for sensitive fields (optional Day-1)


7.2 Core tables (high-level)
identity
tenants(id, name, status, plan, created_at)


tenant_settings(tenant_id, jsonb)


users(id, email, name, status, created_at)


tenant_users(id, tenant_id, user_id, status, created_at)


roles(id, tenant_id, name, is_system)


role_capabilities(role_id, capability)


user_roles(tenant_user_id, role_id)


teams(id, tenant_id, name)


team_members(team_id, tenant_user_id)


invitations(id, tenant_id, email, role_id, token, expires_at, status)


talent
talents(id, tenant_id, public_id, name, status, metadata jsonb, created_at)


talent_profiles(talent_id, measurements jsonb, skills jsonb, socials jsonb, rates jsonb, location, languages)


talent_tags(id, tenant_id, name)


talent_tag_links(talent_id, tag_id)


talent_availability(id, talent_id, from_ts, to_ts, status, notes)


assets(id, tenant_id, owner_type, owner_id, kind, mime, size, storage_key, url, status, metadata jsonb)


jobs
jobs(id, tenant_id, title, status, brief jsonb, budget jsonb, location, start_ts, end_ts, created_by)


job_submissions(id, tenant_id, job_id, talent_id, status, notes, created_at)


holds(id, tenant_id, job_id, talent_id, from_ts, to_ts, status)


bookings(id, tenant_id, job_id, talent_id, status, terms jsonb, schedule jsonb, created_at)


call_sheets(id, tenant_id, booking_id, content jsonb, status, published_at)


contracts
contract_templates(id, tenant_id, name, body_md, variables jsonb, version, status)


clauses(id, tenant_id, key, title, body_md, tags jsonb)


contracts(id, tenant_id, job_id, booking_id, template_id, status, variables jsonb, created_at)


contract_versions(id, contract_id, version, body_rendered, hash, created_at)


contract_signers(id, contract_id, party_type, name, email, status)


contract_artifacts(id, contract_id, kind, storage_key, hash, created_at)


ledger / wallet
wallets(id, tenant_id, owner_type, owner_id, currency, status)


ledger_entries(id, tenant_id, wallet_id, direction, amount, currency, ref_type, ref_id, metadata jsonb, created_at)


ledger_transactions(id, tenant_id, tx_type, idempotency_key, status, created_at)


credits_accounts(id, tenant_id, owner_type, owner_id)


credits_entries(id, tenant_id, account_id, amount, kind, expires_at, ref_type, ref_id, created_at)


payments
invoices(id, tenant_id, ref_type, ref_id, status, amount, currency, due_at, metadata jsonb)


payment_sessions(id, tenant_id, invoice_id, provider, provider_session_id, status, created_at)


payment_webhook_events(id, provider, event_id, received_at, payload jsonb, processed_at, status)


escrow
escrows(id, tenant_id, contract_id, booking_id, status, amount, currency, rules jsonb, created_at)


escrow_events(id, escrow_id, from_status, to_status, actor_id, reason, created_at)


disputes
disputes(id, tenant_id, ref_type, ref_id, status, raised_by, reason, created_at)


dispute_evidence(id, dispute_id, asset_id, note, created_at)


dispute_actions(id, dispute_id, action_type, decision jsonb, actor_id, created_at)


notifications / audit / outbox
notifications(id, tenant_id, user_id, type, payload jsonb, read_at, created_at)


notification_preferences(id, tenant_id, user_id, prefs jsonb)


audit_logs(id, tenant_id, actor_id, action, entity_type, entity_id, before jsonb, after jsonb, ip, ua, created_at)


outbox_events(id, tenant_id, type, payload jsonb, status, created_at, processed_at)


automation_definitions(...)


automation_runs(...)


automation_steps(...)


7.3 Indexing rules (Day-1)
Every table: (tenant_id, created_at desc)


High filters: (tenant_id, status), (tenant_id, job_id), (tenant_id, talent_id)


Webhooks: unique (provider, event_id)


Idempotency: unique (tenant_id, idempotency_key) where applicable


Full-text: optional GIN index on talents.name and jobs.title


7.4 Data retention
Audit logs: keep 12–24 months (configurable)


Webhook payloads: 30–90 days (configurable)


Soft delete for core entities; hard delete only via superadmin policy



8) Multi-tenant governance, roles, permissions
8.1 Capability model (example)
Capabilities are the primitives; roles are bundles.
Core capabilities (sample)
tenant.manage_settings


users.invite, users.assign_roles


talents.read, talents.write, talents.delete


jobs.read, jobs.write, bookings.manage


contracts.create, contracts.send, contracts.void


wallet.read, ledger.transfer, credits.issue


escrow.create, escrow.release, escrow.lock


disputes.raise, disputes.decide


automations.manage, automations.run.retry


audit.read, exports.generate


8.2 ABAC attributes (Day-1)
tenant_id


team_id / pod_id


resource_owner (e.g., talent manager assigned)


risk_tier


amount_limit (finance approvals)


contract_status, escrow_status, dispute_status


Example ABAC policies
Finance release requires:


capability escrow.release


amount <= user.amount_limit


or multi-approval workflow triggers automation “approval_required”


8.3 Governance model (operational)
Tenant Admin owns: templates, limits, roles, finance approvals


Superadmin owns: tenant enable/disable, global risk flags, abuse enforcement, system-wide incident response



9) Production readiness standards (technical + operational)
9.1 Security baseline
MFA optional, but strongly recommended for admins


Rate limiting:


auth endpoints (strict)


file presign (strict)


payments creation (strict)


Secure headers, CORS allowlist


Input validation everywhere (schema-based)


Secrets in vault, rotated


Audit log for all sensitive actions


Optional: field-level encryption for IDs/doc numbers


9.2 Reliability baseline
SLO targets (Day-1):


API availability 99.9%


p95 GET < 300ms; p95 write < 600ms (typical)


Background jobs:


retries with exponential backoff


dead-letter queue + admin replay


Backups:


daily automated + point-in-time recovery if possible


restore drill on staging before launch


9.3 Observability
Correlation IDs for every request


Metrics:


request count, latency, error rate per route


DB connection pool saturation


queue depth + job failures


webhook processing lag


Alerts:


spike in 5xx


webhook verification failures


escrow state transition failures


ledger imbalance detection


9.4 Release management
Environments: dev → staging → prod


CI/CD:


lint + typecheck + unit + integration


E2E on staging nightly


Feature flags per module


Data migrations: forward-only, reversible where possible


Incident runbooks for:


payment webhook outage


queue backlog


DB saturation


signing provider outage



10) Dependency map (module-to-module)
Identity/Tenancy → everything


Talent → Jobs/Bookings


Jobs/Bookings → Contracts


Contracts → Escrow (milestones), Notifications


Payments → Invoices → Escrow funding


Ledger/Wallet underpins Payments, Escrow releases, Credits


Disputes interacts with Escrow + Ledger + Notifications


Automations listens to outbox events from all modules


Audit logs from all sensitive operations



Analytics Event Schema – What to Track Per Dashboard


1. Global Analytics Event Model (Base Schema)
Every tracked event MUST include these base fields.
Field
Type
Description
event_id
UUID
Unique event identifier
event_name
string
Canonical event name
event_category
enum
platform / tenant / talent / payment / community
event_time
timestamp
UTC timestamp
tenant_id
UUID
Tenant context (nullable for platform events)
actor_user_id
UUID
User performing action
actor_role
string
Effective role at time of event
target_entity_type
string
talent / event / pageant / payout / post
target_entity_id
UUID
Entity reference
session_id
string
Web/app session
source
enum
web / mobile / system / api
metadata
JSON
Flexible attributes


2. Platform-Level Dashboard Analytics
2.1 Platform Super Admin Dashboard
KPIs Tracked
Event Name
What It Tracks
Metadata
TENANT_CREATED
New tenant onboarding
plan, country
TENANT_ACTIVATED
Tenant goes live
activation_type
TENANT_SUSPENDED
Tenant disabled
reason
SUBSCRIPTION_STARTED
Paid plan started
plan, amount
SUBSCRIPTION_UPGRADED
Plan upgrade
from_plan, to_plan
PLATFORM_REVENUE_RECORDED
Platform-level revenue
amount, currency
FEATURE_FLAG_TOGGLED
Feature enabled/disabled
flag_name, state


2.2 Platform Ops Dashboard
Event Name
Description
Metadata
INCIDENT_REPORTED
Platform incident
severity, module
ESCALATION_TRIGGERED
Cross-tenant escalation
priority, source
JOB_FAILED
Background job failure
job_type, error
NOTIFICATION_FAILED
Delivery failure
channel, provider
SLA_BREACH
SLA exceeded
sla_type, delay


2.3 Platform Finance Dashboard
Event Name
Description
Metadata
GMV_RECORDED
Gross transaction
amount, tenant_id
PLATFORM_FEE_COLLECTED
Platform commission
fee_rate
CHARGEBACK_RECEIVED
Payment dispute
provider, amount
PAYOUT_PROVIDER_ERROR
External payout error
provider, code


2.4 Platform Trust & Safety Dashboard
Event Name
Description
Metadata
FRAUD_SIGNAL_RAISED
AI/manual fraud flag
signal_type, score
USER_SUSPENDED_PLATFORM
User suspended globally
reason
CONTENT_TAKEDOWN
Forced content removal
policy_id
DISPUTE_ESCALATED
Tenant dispute escalated
dispute_type


3. Tenant-Level Dashboard Analytics
3.1 Tenant Owner Dashboard
Event Name
Description
Metadata
TENANT_REVENUE_RECORDED
Tenant income
source, amount
TENANT_PAYOUT_COMPLETED
Successful payout
amount
TALENT_ONBOARDED
Talent approved
category
EVENT_PUBLISHED
Event/pageant live
event_type
SPONSOR_CONTRACT_SIGNED
Sponsor deal
value


3.2 Tenant Admin Dashboard
Event Name
Description
Metadata
USER_INVITED
User invited
role
ROLE_ASSIGNED
Role granted
role
CONTENT_APPROVED
Content moderation
content_type
CONTENT_REJECTED
Moderation reject
reason


3.3 Tenant Operations Dashboard
Event Name
Description
Metadata
TASK_ASSIGNED
Ops task assigned
task_type
TASK_COMPLETED
Ops task done
duration
EVENT_RESCHEDULED
Schedule change
delta
STAFF_ASSIGNED
Staff mapped
staff_role


3.4 Tenant Finance Dashboard
Event Name
Description
Metadata
PAYMENT_RECEIVED
Incoming payment
method
PAYOUT_REQUESTED
Withdrawal initiated
amount
PAYOUT_APPROVED
Payout approved
approver
REFUND_PROCESSED
Refund issued
reason


4. Talent & Agency Analytics
4.1 Talent Dashboard
Event Name
Description
Metadata
PROFILE_UPDATED
Profile change
completeness
GIG_APPLIED
Applied to gig
gig_type
AUDITION_ATTENDED
Audition attendance
outcome
CONTRACT_SIGNED
Contract accepted
value
WALLET_WITHDRAWN
Funds withdrawn
amount


4.2 Talent Manager / Agency Dashboard
Event Name
Description
Metadata
TALENT_ASSIGNED
Talent added
talent_id
BOOKING_CONFIRMED
Booking success
project_type
COMMISSION_EARNED
Agency commission
amount
AVAILABILITY_CONFLICT
Scheduling clash
date


5. Casting & Pageant Analytics
5.1 Casting Dashboard
Event Name
Description
Metadata
CASTING_CREATED
New casting
role_count
APPLICATION_RECEIVED
New applicant
source
APPLICATION_SHORTLISTED
Shortlist action
stage
AUDITION_SCHEDULED
Audition set
mode


5.2 Pageant Dashboard
Event Name
Description
Metadata
PAGEANT_CREATED
Pageant setup
level
REGISTRATION_SUBMITTED
Contestant applied
city
ROUND_PUBLISHED
Round live
round_no
SCORE_SUBMITTED
Judge score
score
RESULT_PUBLISHED
Winners declared
titles


6. Event Management Analytics
Event Name
Description
Metadata
EVENT_CREATED
Event setup
type
TICKET_SOLD
Ticket purchase
price
ATTENDEE_CHECKED_IN
Attendance
gate
EVENT_COMPLETED
Event ended
duration


7. Sponsor & Campaign Analytics
Event Name
Description
Metadata
CAMPAIGN_CREATED
Brand campaign
objective
TALENT_INVITED
Talent outreach
niche
CONTENT_SUBMITTED
Influencer content
platform
CONTENT_APPROVED
Content approved
turnaround_time
CAMPAIGN_CONVERSION
Measured outcome
metric


8. Community Analytics
Event Name
Description
Metadata
POST_CREATED
Community post
media_type
POST_ENGAGED
Like/comment/share
engagement_type
USER_REPORTED
Abuse report
reason
MOD_ACTION_TAKEN
Moderation action
action


9. Notifications & Workflow Analytics
Event Name
Description
Metadata
NOTIFICATION_SENT
Notification sent
priority, channel
NOTIFICATION_DELIVERED
Delivered
latency
NOTIFICATION_ACKED
Acknowledged
time_to_ack
REMINDER_TRIGGERED
Reminder fired
reminder_type
ESCALATION_SENT
Escalation triggered
level


10. Analytics Best Practices (Important)
Events are append-only (never update)
Use event_name enums (no free text)
Metadata is versioned (schema_version)
PII excluded or hashed
Timezone always UTC
Actor role captured at event time

11. Dashboard → Event Mapping Logic
Each dashboard:
Subscribes to a defined event subset
Computes KPIs via aggregations
Supports:
Real-time widgets (streaming)
Historical charts (batch)


Escrow Working – High Level Flow
Generic Escrow Lifecycle
Agreement Created


Job / booking / sponsorship accepted


Payer Pays → Escrow


Money captured but not released


Service Delivery Phase


Talent submits work / attends event


Verification Phase


Auto + manual checks


Settlement


Escrow releases money


Exception Handling


Dispute / refund / partial release




2. Detailed Working (Booking Example)
Step 1: Booking Accepted
Brand posts job


Talent accepts terms


Contract auto-generated


Status: AWAITING_PAYMENT

Step 2: Payment Goes to Escrow
Brand pays full amount


Payment gateway → Escrow Wallet


Funds are locked


Status: ESCROW_FUNDED
Important:
Funds are not platform revenue yet


Cannot be withdrawn


Only referenceable



Step 3: Service Fulfillment
Examples:
Talent attends shoot


Influencer submits campaign deliverables


Pageant round completed


System captures:
Attendance


Media uploads


Timestamp


GPS (optional)


Organizer confirmation


Status: DELIVERY_SUBMITTED

Step 4: Verification & Approval
Approval paths:
Auto-approval (no objection in X hours)


Manual approval (tenant staff)


Hybrid (auto + random audit)


Status: DELIVERY_APPROVED
Every action logged.

Step 5: Escrow Release (Split Settlement)
Funds released automatically as:
Recipient
%
Talent
X%
Tenant
Y%
Platform
Z%


GST calculated


Invoices generated


Ledger updated


Status: SETTLED

3. Dispute Handling (Critical)
Escrow must support disputes, otherwise it’s useless.
Dispute Trigger
Brand rejects delivery


Talent claims unfair rejection


Missed deadlines


Status: IN_DISPUTE

Dispute Resolution Options
Tenant Resolution


Platform Arbitration


Auto Rules


Partial release


Full refund


Penalty deduction


All outcomes are audited & immutable.

4. Escrow State Machine (Implementation Logic)
CREATED
  ↓
ESCROW_FUNDED
  ↓
IN_PROGRESS
  ↓
DELIVERY_SUBMITTED
  ↓
DELIVERY_APPROVED
  ↓
SETTLED

Alternate paths:
ESCROW_FUNDED → REFUNDED


DELIVERY_SUBMITTED → IN_DISPUTE



5. Backend Implementation (Practical)
Core Tables
escrow_accounts
id


tenant_id


balance


locked_balance


escrow_transactions
id


reference_type (booking / sponsorship)


payer_id


amount


status


escrow_events
escrow_id


event_type


actor


timestamp


metadata



APIs (Must-Have)
POST /escrow/create


POST /escrow/fund


POST /escrow/release


POST /escrow/refund


POST /escrow/dispute


GET /escrow/:id/ledger



6. Payment Gateway Strategy (India)
Phase 1 (Recommended)
Razorpay Route / Stripe Connect (logical escrow)


Platform-controlled settlement delay


Why?
Easier compliance


Faster launch


No RBI escrow license



Phase 2 (Advanced)
Wallet-based escrow


Partner NBFC / payment aggregator


Real escrow compliance



7. Security & Compliance Rules
Mandatory:
No manual DB balance edits


All releases via rules engine


Immutable audit logs


Role-restricted release authority


Time-based auto release safeguards



8. Escrow Configuration (Tenant-Level)
Tenants can configure:
Auto-release time (e.g., 48 hrs)


Partial release allowed (yes/no)


Dispute window


Penalty rules


But:
  They cannot bypass escrow
  They cannot force release

9. Why This Escrow Design Is Strong
Trust-first architecture


Protects all parties


Scales across modules


Audit-ready


Legally defensible


Investor-grade




Escrow Flow – Implementation Reference (Dev Version)
1. High-Level Escrow Lifecycle
[CREATED]
   |
   | fund()
   v
[ESCROW_FUNDED]
   |
   | start_progress()
   v
[IN_PROGRESS]
   |
   | submit_delivery()
   v
[DELIVERY_SUBMITTED]
   |           |
   | approve() | dispute()
   v           v
[DELIVERY_APPROVED]   [IN_DISPUTE]
   |           |
   | settle()  | resolve()
   v           v
[SETTLED]    [SETTLED / REFUNDED]

Alternate Path:
[ESCROW_FUNDED] -- refund() --> [REFUNDED]






2. Step-by-Step Flow (Mapped to Code)
Step 1: Escrow Creation
State: CREATED
Triggered when:
Booking / sponsorship / job accepted


Agreement generated


Actions:
Create escrow record


Amount locked = 0


No payment yet



Step 2: Funding Escrow
Transition: fund()
 State: CREATED → ESCROW_FUNDED
Triggered by:
Payer completes payment via gateway


Actions:
Capture payment


Lock full amount


Log event:


event_type = ESCROW_FUNDED



Step 3: Work Starts
Transition: start_progress()
 State: ESCROW_FUNDED → IN_PROGRESS
Triggered by:
Tenant / system confirms work start


Actions:
Work officially begins


SLA timer starts


Log event:


event_type = WORK_STARTED



Step 4: Delivery Submission
Transition: submit_delivery()
 State: IN_PROGRESS → DELIVERY_SUBMITTED
Triggered by:
Talent submits deliverables


Attendance / media proof uploaded


Actions:
Store delivery artifacts


Start approval window timer


Log event:


event_type = DELIVERY_SUBMITTED



Step 5A: Approval Path (Happy Flow)
Transition: approve_delivery()
 State: DELIVERY_SUBMITTED → DELIVERY_APPROVED
Triggered by:
Tenant approval OR


Auto-approval (timeout)


Actions:
Freeze dispute window


Prepare settlement split


Log event:


event_type = DELIVERY_APPROVED



Step 6A: Settlement
Transition: settle()
 State: DELIVERY_APPROVED → SETTLED
Triggered by:
System (auto) or authorized admin


Actions:
Release funds:


Talent share


Tenant share


Platform fee


Generate invoices


Update ledgers


Log event:


event_type = SETTLED



Step 5B: Dispute Path (Alternate)
Transition: dispute()
 State: DELIVERY_SUBMITTED → IN_DISPUTE
Triggered by:
Buyer rejects delivery


Talent raises objection


Actions:
Freeze funds


Block auto-settlement


Assign resolver


Log event:


event_type = DISPUTE_RAISED



Step 6B: Dispute Resolution
State: IN_DISPUTE → SETTLED / REFUNDED
Resolution Options:
Full settlement


Partial settlement


Full refund


Actions:
Manual override (logged)


Forced settlement/refund


Log resolution event



Step 2B: Refund Before Work (Early Exit)
Transition: refund()
 State: ESCROW_FUNDED → REFUNDED
Triggered by:
Cancellation before work start


SLA breach


Actions:
Reverse payment


Close escrow


Log event:


event_type = REFUNDED



3. Escrow State Rules (Important for Devs)
Allowed Transitions Only
❌ No direct SETTLED from ESCROW_FUNDED


❌ No refund after DELIVERY_APPROVED


❌ No settlement during IN_DISPUTE without resolution



4. Event Logging (Mandatory)
Every transition MUST create an event:
escrow_events
- escrow_id
- event_type
- actor
- timestamp
- metadata

Ledger view is derived, not calculated.

5. Role Control Matrix (Summary)
Action
Talent
Tenant
Platform
submit_delivery
✅
❌
❌
approve_delivery
❌
✅
✅
settle
❌
❌
✅
dispute
✅
✅
❌
refund
❌
❌
✅


6. Why This Flow Is Final-Grade
Matches FSM code exactly


Prevents illegal money movement


Dispute-safe


Audit-ready


Easy to extend (partial settlement, SLA timers)


Common conventions (so the code stays clean)
Controller
Auth/tenant/policy guard runs here


Validate DTO (class-validator)


Return DTO response


No business logic


Service
Domain logic


Calls repositories


Calls other module services (carefully) OR emits outbox events


Enforces state transitions + invariants


Writes audit logs for sensitive actions


Repo
DB-only operations


Must always require tenantId


Never does authorization


Tenant context
A single RequestContext object everywhere:
export type RequestContext = {
  requestId: string;
  tenantId: string;
  actorUserId: string;
  actorTenantUserId: string;
  roles: string[];
  ip?: string;
  userAgent?: string;
};


3) Example: Identity module (Controller + Service skeleton)
3.1 users.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { PolicyGuard } from '../../../common/guards/policy.guard';
import { RequireCapability } from '../../../common/decorators/require-capability.decorator';
import { CurrentContext } from '../../../common/decorators/current-context.decorator';
import { RequestContext } from '../../../common/policies/policy.types';
import { UsersService } from '../services/users.service';
import { InviteUserDto, UpdateUserRolesDto, ListUsersQueryDto } from '../dtos/users.dto';

@Controller('/v1/users')
@UseGuards(JwtAuthGuard, TenantGuard, PolicyGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequireCapability('users.read')
  async listUsers(
    @CurrentContext() ctx: RequestContext,
    @Query() q: ListUsersQueryDto
  ) {
    return this.users.list(ctx, q);
  }

  @Post('/invite')
  @RequireCapability('users.invite')
  async invite(
    @CurrentContext() ctx: RequestContext,
    @Body() dto: InviteUserDto
  ) {
    return this.users.invite(ctx, dto);
  }

  @Patch('/:userId/roles')
  @RequireCapability('users.assign_roles')
  async updateRoles(
    @CurrentContext() ctx: RequestContext,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRolesDto
  ) {
    return this.users.updateRoles(ctx, userId, dto);
  }
}

3.2 users.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../repos/users.repo';
import { RolesRepo } from '../repos/roles.repo';
import { AuditService } from '../../audit_analytics/services/audit.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { InviteUserDto, UpdateUserRolesDto, ListUsersQueryDto } from '../dtos/users.dto';
import { RequestContext } from '../../../common/policies/policy.types';
import { AppError } from '../../../common/errors/app-error';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly rolesRepo: RolesRepo,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async list(ctx: RequestContext, q: ListUsersQueryDto) {
    return this.usersRepo.listByTenant(ctx.tenantId, q);
  }

  async invite(ctx: RequestContext, dto: InviteUserDto) {
    // Validate role belongs to tenant
    const role = await this.rolesRepo.get(ctx.tenantId, dto.roleId);
    if (!role) throw AppError.notFound('ROLE_NOT_FOUND');

    const invite = await this.usersRepo.createInvitation(ctx.tenantId, dto);

    await this.audit.log(ctx, {
      action: 'users.invite',
      entityType: 'invitation',
      entityId: invite.id,
      after: invite,
    });

    await this.notifications.queueEmail(ctx.tenantId, {
      to: dto.email,
      template: 'tenant_invite',
      vars: { token: invite.token, tenantName: invite.tenantName },
    });

    return { ok: true, invitationId: invite.id };
  }

  async updateRoles(ctx: RequestContext, userId: string, dto: UpdateUserRolesDto) {
    // Guard: cannot remove last admin etc.
    const before = await this.usersRepo.getTenantUser(ctx.tenantId, userId);
    if (!before) throw AppError.notFound('USER_NOT_FOUND');

    await this.usersRepo.setRoles(ctx.tenantId, userId, dto.roleIds);

    const after = await this.usersRepo.getTenantUser(ctx.tenantId, userId);

    await this.audit.log(ctx, {
      action: 'users.assign_roles',
      entityType: 'tenant_user',
      entityId: after.id,
      before,
      after,
    });

    return { ok: true };
  }
}


4) Example: Escrow module (Controller + Service + State machine)
4.1 escrows.controller.ts
import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { PolicyGuard } from '../../../common/guards/policy.guard';
import { RequireCapability } from '../../../common/decorators/require-capability.decorator';
import { CurrentContext } from '../../../common/decorators/current-context.decorator';
import { RequestContext } from '../../../common/policies/policy.types';
import { EscrowsService } from '../services/escrows.service';
import { CreateEscrowDto, ReleaseEscrowDto, ListEscrowsQueryDto } from '../dtos/escrows.dto';

@Controller('/v1/escrows')
@UseGuards(JwtAuthGuard, TenantGuard, PolicyGuard)
export class EscrowsController {
  constructor(private readonly escrows: EscrowsService) {}

  @Get()
  @RequireCapability('escrow.read')
  async list(@CurrentContext() ctx: RequestContext, @Query() q: ListEscrowsQueryDto) {
    return this.escrows.list(ctx, q);
  }

  @Post()
  @RequireCapability('escrow.create')
  async create(@CurrentContext() ctx: RequestContext, @Body() dto: CreateEscrowDto) {
    return this.escrows.create(ctx, dto);
  }

  @Post('/:escrowId/release')
  @RequireCapability('escrow.release')
  async release(@CurrentContext() ctx: RequestContext, @Param('escrowId') escrowId: string, @Body() dto: ReleaseEscrowDto) {
    return this.escrows.release(ctx, escrowId, dto);
  }
}

4.2 escrows.service.ts (calls state machine + ledger)
import { Injectable } from '@nestjs/common';
import { EscrowsRepo } from '../repos/escrows.repo';
import { EscrowStateService } from './escrow-state.service';
import { LedgerService } from '../../ledger/services/ledger.service';
import { AuditService } from '../../audit_analytics/services/audit.service';
import { OutboxService } from '../../../outbox/outbox.service';
import { RequestContext } from '../../../common/policies/policy.types';
import { CreateEscrowDto, ReleaseEscrowDto, ListEscrowsQueryDto } from '../dtos/escrows.dto';
import { AppError } from '../../../common/errors/app-error';

@Injectable()
export class EscrowsService {
  constructor(
    private readonly repo: EscrowsRepo,
    private readonly state: EscrowStateService,
    private readonly ledger: LedgerService,
    private readonly audit: AuditService,
    private readonly outbox: OutboxService,
  ) {}

  async list(ctx: RequestContext, q: ListEscrowsQueryDto) {
    return this.repo.list(ctx.tenantId, q);
  }

  async create(ctx: RequestContext, dto: CreateEscrowDto) {
    const escrow = await this.repo.create(ctx.tenantId, dto);

    await this.audit.log(ctx, {
      action: 'escrow.create',
      entityType: 'escrow',
      entityId: escrow.id,
      after: escrow,
    });

    await this.outbox.emit(ctx.tenantId, 'escrow.created', { escrowId: escrow.id });

    return escrow;
  }

  async release(ctx: RequestContext, escrowId: string, dto: ReleaseEscrowDto) {
    const escrow = await this.repo.get(ctx.tenantId, escrowId);
    if (!escrow) throw AppError.notFound('ESCROW_NOT_FOUND');

    // Transition (locks allowed state + writes escrow_events)
    const updated = await this.state.transition(ctx, escrow, 'release', { amount: dto.amount });

    // Ledger: create double-entry transaction
    await this.ledger.releaseEscrowToTalent(ctx, {
      escrowId: updated.id,
      amount: dto.amount,
      currency: updated.currency,
      bookingId: updated.bookingId,
      talentId: updated.talentId,
    });

    await this.audit.log(ctx, {
      action: 'escrow.release',
      entityType: 'escrow',
      entityId: updated.id,
      before: escrow,
      after: updated,
    });

    await this.outbox.emit(ctx.tenantId, 'escrow.released', { escrowId: updated.id, amount: dto.amount });

    return { ok: true, escrow: updated };
  }
}

4.3 escrow-state.service.ts (explicit transitions)
import { Injectable } from '@nestjs/common';
import { EscrowsRepo } from '../repos/escrows.repo';
import { RequestContext } from '../../../common/policies/policy.types';
import { AppError } from '../../../common/errors/app-error';

type EscrowAction = 'fund' | 'lock' | 'release' | 'release_partial' | 'dispute' | 'resolve';

@Injectable()
export class EscrowStateService {
  constructor(private readonly repo: EscrowsRepo) {}

  async transition(ctx: RequestContext, escrow: any, action: EscrowAction, input: any) {
    const { status } = escrow;

    // Example simplified rules
    const allowed: Record<string, EscrowAction[]> = {
      created: ['fund'],
      funded: ['lock', 'dispute'],
      locked: ['release', 'release_partial', 'dispute'],
      disputed: ['resolve'],
    };

    if (!allowed[status]?.includes(action)) {
      throw AppError.conflict('INVALID_ESCROW_TRANSITION', { status, action });
    }

    const next = this.computeNextStatus(status, action, input);

    // Atomic update protects races
    return this.repo.atomicTransition(ctx.tenantId, escrow.id, status, next, ctx.actorTenantUserId, input?.reason);
  }

  private computeNextStatus(status: string, action: EscrowAction, input: any) {
    if (action === 'fund') return 'funded';
    if (action === 'lock') return 'locked';
    if (action === 'release') return 'released';
    if (action === 'release_partial') return 'partial_released';
    if (action === 'dispute') return 'disputed';
    if (action === 'resolve') return 'closed';
    return status;
  }
}

Security Controls, Compliance Mapping & Incident Operations
Security Controls → Compliance Mapping, Incident Runbooks & SLO Alert Mapping

PART 1: Security Controls → Compliance Mapping (SOC 2 / ISO 27001)
1.1 Core Control Domains
Control Domain
Description
Access Control
Authentication, authorization, least privilege
Change Management
Safe & auditable changes
Data Protection
Encryption, isolation, retention
Monitoring & Logging
Visibility & traceability
Incident Response
Detection & recovery
Availability
Reliability & continuity
Vendor Management
Third-party risk


1.2 Control Mapping Table
Security Control
SOC 2
ISO 27001
Implementation in Platform
RBAC + ABAC
CC6.1, CC6.2
A.9.1, A.9.2
Role & permission engine with snapshots
MFA for Privileged Roles
CC6.3
A.9.4
Enforced for admins, finance, trust
Tenant Data Isolation
CC6.6
A.13.1
Tenant-scoped services + RLS
Encryption at Rest
CC6.1
A.10.1
AES-256 for DB & backups
Encryption in Transit
CC6.7
A.13.2
TLS 1.2+ everywhere
Append-Only Ledgers
CC1.2
A.12.4
Wallet & scoring ledgers
Immutable Audit Logs
CC7.2
A.12.4
Write-once logs, long retention
Monitoring & Alerts
CC7.3
A.12.6
Analytics-based alert engine
Incident Response Plan
CC7.4
A.16.1
P0/P1 runbooks (below)
Change Approval
CC8.1
A.12.1
Feature flags + approvals
Backup & DR
CC10.1
A.17.1
Automated backups + DR tests
Vendor Risk Review
CC9.2
A.15.1
Payment/SMS provider reviews


1.3 Audit Evidence You Can Produce
Access logs with role snapshots
Change history (feature flags, config)
Incident timelines & RCA documents
Payment ledger & reconciliation reports
Alert & escalation logs

PART 2: Incident Runbooks (P0 / P1)
2.1 P0 Incident Runbook (Critical)
Examples: payout failure, fraud detected, data leak risk, scoring integrity breach
Response Timeline: ≤ 30 minutes
Runbook Steps
Detect
Alert fires (P0)
Incident auto-created
Acknowledge
On-call owner acknowledges
Stakeholders notified (Ops, Finance, Trust)
Contain
Freeze affected workflows (payouts, publishing)
Isolate tenant/user if required
Investigate
Review audit logs
Validate scope & impact
Communicate
Internal updates every 30–60 min
Tenant/user notification if impacted
Resolve
Apply fix / rollback
Resume operations
Post-Incident
RCA within 48h
Preventive action logged

2.2 P1 Incident Runbook (High)
Examples: payment failure spike, notification delivery drop, judge delays
Response Timeline: ≤ 4 hours
Runbook Steps
Triage alert & confirm impact
Assign owner
Apply mitigation (retry, throttle, reminder)
Monitor metrics
Close incident with notes

2.3 Incident Roles
Role
Responsibility
Incident Commander
Owns resolution
Ops Engineer
Technical mitigation
Finance Lead
Payment-related issues
Trust Lead
Fraud/abuse
Comms Owner
Stakeholder updates


PART 3: SLO → Dashboard → Alert Threshold Mapping
3.1 Mapping Logic
SLO breach → Analytics event → Alert → Dashboard widget → Escalation

3.2 Core Mapping Table
Module
SLO
Dashboard
Alert Threshold
Severity
Core APIs
p95 < 300ms
Platform Ops
>300ms for 5m
P1
Auth
99.95% uptime
Platform Ops
any outage >1m
P0
Notifications
99.9% P0 success
Ops + Notification
<99.5% in 15m
P0
Payments
99.9% success
Finance
failure >1%
P1
Payouts
<24h processing
Finance
>24h pending
P0
Wallet Ledger
100% accuracy
Finance
any mismatch
P0
Pageant Scoring
anomaly <1m
Pageant
anomaly event
P0
Community Moderation
triage <6h
Community Admin
>6h backlog
P1


3.3 Dashboard Visibility
Dashboard
What It Shows
Platform Ops
All P0/P1 SLO breaches
Platform Finance
Payment & wallet SLOs
Trust & Safety
Fraud, abuse, scoring
Tenant Ops
Event/casting/pageant SLOs
Notification Inbox
Assigned incidents




backend/
  package.json
  tsconfig.json
  nest-cli.json
  .env.example
  Dockerfile
  docker-compose.yml

  src/
    main.ts
    app.module.ts

    config/
      config.module.ts
      env.validation.ts
      index.ts

    common/
      constants/
        capabilities.ts
        headers.ts
        errors.ts
        events.ts
      decorators/
        current-user.decorator.ts
        tenant-id.decorator.ts
        req-id.decorator.ts
      dtos/
        pagination.dto.ts
        time-range.dto.ts
      errors/
        app-error.ts
        error-mapper.ts
      filters/
        http-exception.filter.ts
      guards/
        jwt-auth.guard.ts
        tenant.guard.ts
        policy.guard.ts
        rate-limit.guard.ts
      interceptors/
        logging.interceptor.ts
        audit.interceptor.ts
        transform.interceptor.ts
      middleware/
        request-id.middleware.ts
        tenant-context.middleware.ts
      policies/
        policy.engine.ts
        policy.types.ts
        policy.helpers.ts
      utils/
        crypto.ts
        hash.ts
        id.ts
        money.ts
        date.ts
        pagination.ts
        sanitize.ts

    infra/
      db/
        prisma/                     # or typeorm/mikroorm equivalent
          schema.prisma
          migrations/
        prisma.service.ts
        repo.base.ts
        tx.ts                       # transaction helpers
      cache/
        redis.module.ts
        redis.service.ts
      queue/
        queue.module.ts
        queue.service.ts
        jobs.constants.ts
      storage/
        storage.module.ts
        s3.service.ts
        presign.service.ts
      email/
        email.module.ts
        email.service.ts
        templates/
      observability/
        otel.module.ts
        logger.ts
        metrics.service.ts
        tracing.ts
      security/
        rate-limit.service.ts
        webhook-verifier.ts
      integrations/
        payments/
          payments.module.ts
          providers/
            stripe.provider.ts
            razorpay.provider.ts
          payments.service.ts
          payments.webhook.controller.ts
        esign/
          esign.module.ts
          providers/
            docusign.provider.ts
            hellosign.provider.ts
            inapp.provider.ts
          esign.service.ts
          esign.webhook.controller.ts

    modules/
      identity/
        identity.module.ts
        controllers/
          auth.controller.ts
          tenants.controller.ts
          users.controller.ts
          teams.controller.ts
          roles.controller.ts
          policies.controller.ts
        services/
          auth.service.ts
          tenants.service.ts
          users.service.ts
          teams.service.ts
          roles.service.ts
          policy-debug.service.ts
        domain/
          entities.ts
          events.ts
          types.ts
        dtos/
          auth.dto.ts
          tenants.dto.ts
          users.dto.ts
          teams.dto.ts
          roles.dto.ts
        repos/
          tenants.repo.ts
          users.repo.ts
          roles.repo.ts
          teams.repo.ts

      talent/
        talent.module.ts
        controllers/
          talents.controller.ts
          assets.controller.ts
        services/
          talents.service.ts
          talent-assets.service.ts
          availability.service.ts
        domain/
          entities.ts
          events.ts
          types.ts
        dtos/
          talents.dto.ts
          assets.dto.ts
          availability.dto.ts
        repos/
          talents.repo.ts
          assets.repo.ts
          availability.repo.ts

      jobs/
        jobs.module.ts
        controllers/
          jobs.controller.ts
          submissions.controller.ts
          bookings.controller.ts
          callsheets.controller.ts
        services/
          jobs.service.ts
          submissions.service.ts
          holds.service.ts
          bookings.service.ts
          callsheets.service.ts
        domain/
          entities.ts
          events.ts
          types.ts
          state.ts
        dtos/
          jobs.dto.ts
          submissions.dto.ts
          bookings.dto.ts
          callsheets.dto.ts
        repos/
          jobs.repo.ts
          submissions.repo.ts
          holds.repo.ts
          bookings.repo.ts
          callsheets.repo.ts

      contracts/
        contracts.module.ts
        controllers/
          contract-templates.controller.ts
          clauses.controller.ts
          contracts.controller.ts
        services/
          templates.service.ts
          clauses.service.ts
          contracts.service.ts
          rendering.service.ts
          signature.service.ts
        domain/
          entities.ts
          events.ts
          state.ts
          types.ts
        dtos/
          templates.dto.ts
          clauses.dto.ts
          contracts.dto.ts
        repos/
          templates.repo.ts
          clauses.repo.ts
          contracts.repo.ts
          artifacts.repo.ts

      ledger/
        ledger.module.ts
        controllers/
          wallets.controller.ts
          ledger.controller.ts
          credits.controller.ts
          statements.controller.ts
        services/
          wallets.service.ts
          ledger.service.ts
          credits.service.ts
          statements.service.ts
          invariants.service.ts          # ledger balance checks
        domain/
          entities.ts
          events.ts
          types.ts
        dtos/
          wallets.dto.ts
          ledger.dto.ts
          credits.dto.ts
          statements.dto.ts
        repos/
          wallets.repo.ts
          ledger.repo.ts
          credits.repo.ts
          statements.repo.ts

      payments/
        payments.module.ts
        controllers/
          invoices.controller.ts
          payments.controller.ts
        services/
          invoices.service.ts
          payments.service.ts
          reconciliation.service.ts
        domain/
          entities.ts
          events.ts
          types.ts
        dtos/
          invoices.dto.ts
          payments.dto.ts
        repos/
          invoices.repo.ts
          payment-sessions.repo.ts
          payment-events.repo.ts

      escrow/
        escrow.module.ts
        controllers/
          escrows.controller.ts
        services/
          escrows.service.ts
          escrow-state.service.ts        # state machine transitions
          auto-release.service.ts        # timers via queue
        domain/
          entities.ts
          events.ts
          state.ts
          types.ts
        dtos/
          escrows.dto.ts
        repos/
          escrows.repo.ts
          escrow-events.repo.ts

      disputes/
        disputes.module.ts
        controllers/
          disputes.controller.ts
        services/
          disputes.service.ts
          dispute-state.service.ts
          arbitration.service.ts
        domain/
          entities.ts
          events.ts
          state.ts
          types.ts
        dtos/
          disputes.dto.ts
        repos/
          disputes.repo.ts
          evidence.repo.ts
          actions.repo.ts

      notifications/
        notifications.module.ts
        controllers/
          notifications.controller.ts
          preferences.controller.ts
        services/
          notifications.service.ts
          preferences.service.ts
          dispatch.service.ts            # email + in-app fanout
        domain/
          entities.ts
          events.ts
          types.ts
        dtos/
          notifications.dto.ts
          preferences.dto.ts
        repos/
          notifications.repo.ts
          preferences.repo.ts

      automations/
        automations.module.ts
        controllers/
          automations.controller.ts
          runs.controller.ts
        services/
          definitions.service.ts
          runner.service.ts
          executor.service.ts
          guardrails.service.ts
          compensation.service.ts
        domain/
          entities.ts
          types.ts
        dtos/
          automations.dto.ts
          runs.dto.ts
        repos/
          definitions.repo.ts
          runs.repo.ts
          steps.repo.ts

      audit_analytics/
        audit-analytics.module.ts
        controllers/
          audit.controller.ts
          dashboards.controller.ts
        services/
          audit.service.ts
          events.service.ts
          dashboards.service.ts
        domain/
          entities.ts
          types.ts
        dtos/
          audit.dto.ts
          dashboards.dto.ts
        repos/
          audit.repo.ts
          events.repo.ts

      admin/
        admin.module.ts
        controllers/
          tenant-admin.controller.ts
          superadmin.controller.ts
        services/
          tenant-settings.service.ts
          limits.service.ts
          risk.service.ts
          superadmin.service.ts
        dtos/
          admin.dto.ts
        repos/
          tenant-settings.repo.ts
          risk.repo.ts

    workers/
      worker.module.ts
      processors/
        outbox.processor.ts
        email.processor.ts
        pdf.processor.ts
        escrow-autorelease.processor.ts
        webhook-retry.processor.ts

    outbox/
      outbox.module.ts
      outbox.service.ts
      outbox.types.ts

    health/
      health.module.ts
      health.controller.ts

    docs/
      openapi.ts                      # generates swagger/openapi


