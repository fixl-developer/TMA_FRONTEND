# TalentOS — Agency Type → Blueprint Matrix & Role Permission Sets

> **Reference:** Blueprint definitions, must-have modules, default roles per agency type.  
> **Permission levels:** Config/structure only (no RBAC enforcement in initial workflow phase).

---

## 1. Blueprint Overview

| Code | Blueprint Name | Core Focus |
|------|----------------|------------|
| B1 | Roster + Booking | Profiles, booking pipeline, availability, contracts |
| B2 | Casting Pipeline | Casting calls, submissions, shortlist, auditions |
| B3 | Season/Competition | Rounds, tasks, scoring, results (pageants) |
| B4 | Brand Deals + Deliverables | Deal rooms, briefs, deliverables, content approvals |
| B5 | Course/Cohort | Courses, cohorts, lessons, certificates |
| B6 | Project + Assets + Approvals | Projects, tasks, asset library, client approvals |
| B7 | Shift/Staffing | Jobs, rosters, check-ins, timesheets |
| B8 | Community + Monetization | Spaces, governance, moderation, events, rewards |
| B9 | Marketplace/Aggregator | Vendor onboarding, listings, booking |
| B10 | Holding/Group | Multi-tenant, sub-tenants, policy packs |

---

## 2. Agency Type → Blueprint → Modules → Roles

### Modeling Agency
- **Blueprints:** B1, (B8 optional)
- **Modules:** Talent Profiles+Portfolio approvals; Booking pipeline (inquiry→option hold→confirmed); Availability; Contracts/usage rights; Disputes
- **Roles:** Owner, Admin, Agent/Booker, Talent Manager, Talent, Finance, Legal, Moderator (if community)

### Talent Agency (actors/performers)
- **Blueprints:** B1 + B2
- **Modules:** Casting calls intake; Submissions; Auditions (self-tapes); Shortlist/callbacks; Deals/contracts; Disputes
- **Roles:** Owner, Admin, Agent, Casting Coordinator, Talent, Finance, Legal

### Casting Agency / Casting Director Office
- **Blueprints:** B2
- **Modules:** Casting calls; Criteria filters; Submission intake; Shortlist+notes; Audition scheduling; Client viewer room; Offer handoff
- **Roles:** Casting Director, Casting Associate, Coordinator, Client Viewer, Admin

### Production House / Studio
- **Blueprints:** B2 + B6
- **Modules:** Projects; Casting + booking; Vendor management; Contracts; Milestones; Asset approvals; Disputes; Analytics
- **Roles:** Producer, PM, Casting Lead, Client/Stakeholder Viewer, Finance, Legal, Admin

### Influencer Management Agency
- **Blueprints:** B4, (B8 optional)
- **Modules:** Creator roster+media kits; Deal rooms; Deliverables tracker; Content approvals; Reporting; Disputes
- **Roles:** Owner, Admin, Creator Manager, Brand Partnerships, Content Reviewer, Creator, Analyst, Finance

### UGC / Content Production Agency
- **Blueprints:** B6 + B4
- **Modules:** Brief→production→edit→deliver pipeline; Asset library/versioning; Client approvals; Deliverables; Invoicing
- **Roles:** Producer, Creative Director, Editor, Client Approver, Admin, Finance

### Social Media / Growth Marketing Agency
- **Blueprints:** B4 + B8
- **Modules:** Campaigns; Content calendar; Approvals; Community moderation; Sponsored ads reporting
- **Roles:** Strategist, Community Manager, Analyst, Client Viewer/Approver, Admin

### Pageant Organizer / Pageant Agency
- **Blueprints:** B3 + B8 + (B4 optional)
- **Modules:** Season builder (rounds/tasks/scoring); Registrations/eligibility; Judges panels; Submissions; Results publishing; Sponsor placements; Disputes
- **Roles:** Owner, Program Director, Admin, Judges, Moderator, Participant Support, Finance

### Pageant Training/Grooming Agency
- **Blueprints:** B5 + (B1 optional)
- **Modules:** Courses/cohorts; Attendance; Assignments; Certificates; Payments/discounts/loyalty
- **Roles:** Owner, Admin, Trainer, Mentor, Student/Talent, Finance

### Acting/Modeling Academy / Institute
- **Blueprints:** B5 + (B1 optional)
- **Modules:** Courses; Cohorts; Assessments; Certificates; Student progress analytics
- **Roles:** Academic Admin, Trainer, Mentor, Student, Finance

### Speaker Bureau / Public Figure Booking
- **Blueprints:** B1
- **Modules:** Booking requests; Itinerary; Contracts; Invoicing; Disputes
- **Roles:** Booker, Coordinator, Talent/Assistant, Finance, Legal, Admin

### Sports / Esports Talent Agency
- **Blueprints:** B1 + B4
- **Modules:** Deals/sponsorship pipeline; Appearances; Deliverables; Conflicts; Revenue splits
- **Roles:** Agent, Deals Manager, Talent, Analyst, Finance, Admin

### Event/Concert/Festival Promoter
- **Blueprints:** B1 + B6 + B4
- **Modules:** Event ops; Booking; Sponsor placements; Settlements; Vendor deliverables
- **Roles:** Event Director, Ops Manager, Booker, Sponsor Manager, Finance, Admin

### Photography/Videography Agency
- **Blueprints:** B6
- **Modules:** Booking; Shoot schedules; Asset delivery; Revisions; Usage rights licensing
- **Roles:** Producer, Photographer, Editor, Client Approver, Admin, Finance

### Styling/Makeup/Wardrobe Agency
- **Blueprints:** B1 + (B7 optional)
- **Modules:** Service packages; Booking calendar; Team assignment; Disputes
- **Roles:** Lead Stylist, Artists, Scheduler, Finance, Admin

### Event Staffing Agency (hosts/promoters/models)
- **Blueprints:** B7 + (B1 optional)
- **Modules:** Shift rosters; Check-ins/timesheets; Approvals; Payroll-like payouts; Disputes
- **Roles:** Staffing Manager, Coordinator, Staff/Talent, Finance, Admin

### Creative Recruitment Agency
- **Blueprints:** B2 + (B6 optional)
- **Modules:** Listings; Applications; Shortlist; Offers; Contracts; Placement invoicing
- **Roles:** Recruiter, Account Manager, Candidate, Client, Admin, Finance

### Brand / Sponsor Team (as tenant)
- **Blueprints:** B4
- **Modules:** Campaign manager; Partner deal rooms; Approvals; Contracts/usage rights; Reporting
- **Roles:** Brand Manager, Campaign Manager, Legal Approver, Finance, Analyst, Admin

### Media Buying / Ad Agency
- **Blueprints:** B4
- **Modules:** Multi-client partitions; Campaigns; Reporting; Billing/invoicing; Approval workflows
- **Roles:** Account Manager, Media Buyer, Analyst, Client Viewer, Admin, Finance

### Talent Network / Community Operator
- **Blueprints:** B8 + (B1 optional)
- **Modules:** Communities; Governance/moderation; Discovery; Events; Rewards/loyalty; Sponsor placements
- **Roles:** Community Manager, Moderator, Talent/Creator, Sponsor Manager, Admin, Finance

### Marketplace / Aggregator (services)
- **Blueprints:** B9
- **Modules:** Vendor onboarding; Listings; Booking; Disputes; Ratings moderation
- **Roles:** Marketplace Admin, Vendor, Client, Moderator, Finance

### Holding Company (multi-agency group)
- **Blueprints:** B10 (+ underlying blueprints)
- **Modules:** Parent governance; Sub-tenant management; Consolidated analytics; Shared billing; Shared policy packs
- **Roles:** Group Admin, Shared Finance, Shared Legal, Agency Admins

---

## 3. Permission Levels (Reusable)

| Code | Level | Description |
|------|-------|-------------|
| OWN | Own | Full control (settings, billing, policies, exports, delete) |
| ADM | Admin | Manage modules/users, approve/publish, configure workflows |
| OPS | Operations | Day-to-day (create/edit/assign), limited approve |
| CONTRIB | Contributor | Create content/deliverables, submit work, comment |
| VIEW | View | Read-only, can comment if allowed |
| FIN | Finance | Invoices, payouts, escrow, reporting, exports |
| LEGAL | Legal | Contract templates, approvals, dispute decisions |
| MOD | Moderation | Moderation actions in community/content areas |

---

## 4. Role Permission Sets per Blueprint

### B1) Roster + Booking
- **Owner (OWN):** everything
- **Admin (ADM):** manage users/roles, configure pipeline stages, approve portfolio, manage templates, exports
- **Agent/Booker (OPS):** create inquiries, holds, bookings; assign talent; negotiate; request contract
- **Talent Manager (OPS):** roster ops, availability edits, portfolio review requests, internal notes
- **Talent (CONTRIB):** update own profile (approval-gated), upload portfolio (approval-gated), accept/decline bookings
- **Finance (FIN):** invoices, fee settings, escrow release requests, payouts, reconciliation exports
- **Legal (LEGAL):** contract templates, approval gates, dispute adjudication
- **Key gates:** Portfolio publish, contract finalization, escrow release, refunds

### B2) Casting Pipeline
- **Admin (ADM):** configure pipelines, rubrics, forms, privacy settings (redaction), manage users
- **Casting Director/Producer (OPS+):** publish casting calls, shortlist, scoring rubric, approve final shortlist, trigger offers
- **Coordinator/Associate (OPS):** manage submissions, schedule auditions, request self-tapes, communicate, notes
- **Client Viewer (VIEW/COMMENT):** view shortlist, comment/score (optional), no hidden PII if redaction on
- **Talent/Candidate (CONTRIB):** submit application, upload self-tape, availability updates, accept/decline
- **Finance (FIN):** offer fee details, escrow, payouts
- **Legal (LEGAL):** NDAs, contracts, approvals
- **Key options:** Confidential project mode, role-based redaction, scoring audit logs

### B3) Season/Competition (Pageants)
- **Owner/Organizer (OWN/OPS+):** final authority on season config, publish results, override (audited)
- **Program Director (OPS+):** configure rounds/tasks, manage operations, publish announcements
- **Admin (ADM):** users/roles, templates, eligibility rules, exports
- **Judges (CONTRIB-SCORE):** score assigned rounds, comment, cannot edit config
- **Moderator (MOD):** participant content moderation, report handling
- **Participant Support (OPS):** handle queries, validate docs
- **Participants (CONTRIB):** submit tasks, uploads, pay fees, view schedules
- **Finance (FIN):** fee collection, refunds policy execution, payout/prize flows
- **Sponsor Manager (OPS):** sponsor placements, campaign assets approvals
- **Key gates:** Eligibility approval, judge assignment, scoring lock-in, results publish, sponsor creatives

### B4) Brand Deals + Deliverables
- **Admin (ADM):** configure deal templates, deliverable types, approval chain, users
- **Brand Partnerships/Deals Manager (OPS+):** create deals, negotiate terms, assign creators, approve deliverables
- **Creator Manager (OPS):** manage creator roster, schedules, ensure completion
- **Content Reviewer/Compliance (OPS/MOD):** approve/reject content, flag risks, enforce brand safety
- **Creator (CONTRIB):** submit drafts, revisions, final content, performance screenshots/links
- **Brand Client Viewer/Approver (VIEW/APPROVE):** approve final assets, view reports
- **Analyst (VIEW+):** reporting dashboards, exports
- **Finance (FIN):** escrow milestones, payouts, invoices, refunds (policy-gated)
- **Legal (LEGAL):** usage rights clauses, contract approval, dispute decisions
- **Key options:** Multi-step approvals (creator→agency→brand), revision limits, usage rights windows

### B5) Course/Cohort
- **Academic Admin (ADM):** course creation, cohort scheduling, trainer assignment, certificate templates
- **Trainer (OPS/CONTRIB):** create lessons, assignments, grade, mark attendance
- **Mentor (CONTRIB):** feedback, office hours, partial grading (optional)
- **Student (CONTRIB):** enroll, submit assignments, view progress, pay fees
- **Finance (FIN):** fee plans, discounts, refunds, reconciliation
- **Moderator (MOD):** community moderation if course community enabled
- **Key gates:** Certificate issuance requires completion rules + trainer approval

### B6) Project + Assets + Approvals
- **Producer/PM (OPS+):** create projects, assign tasks, set milestones, approve final deliverables
- **Creative Director (OPS+):** creative approvals, revision direction, quality gate
- **Editor/Contributor (CONTRIB):** upload versions, respond to feedback, deliver assets
- **Client Approver (VIEW/APPROVE):** approve/reject deliverables, comment, no internal settings
- **Admin (ADM):** templates, roles, workflow settings
- **Finance (FIN):** milestone invoicing, escrow release, payouts
- **Legal (LEGAL):** contracts, licensing/usage rights approvals
- **Key options:** Revision limits, SLA timers, watermark previews, rights licensing

### B7) Shift/Staffing
- **Staffing Manager (OPS+):** create shifts, assign staff, approve timesheets, enforce penalties (policy-gated)
- **Coordinator (OPS):** roster ops, communications, check-in verification
- **Staff/Talent (CONTRIB):** accept shift, check-in/out, submit proof, dispute timesheets
- **Client Supervisor (VIEW/APPROVE optional):** confirm attendance, rate staff
- **Finance (FIN):** payouts, adjustments (policy-gated), exports
- **Admin (ADM):** templates, role settings, compliance fields

### B8) Community + Monetization
- **Community Admin (ADM):** create spaces, rules, automation rules, member management
- **Moderator (MOD):** reports queue, remove content, mute/ban (audited), escalate disputes
- **Creator/Talent (CONTRIB):** post/comment, host events (optional), earn rewards
- **Member (CONTRIB limited):** participate based on rules
- **Sponsor Manager (OPS):** sponsor posts/placements, approvals workflow
- **Analyst (VIEW+):** engagement analytics
- **Finance (FIN):** paid memberships/credits/refunds (if enabled)
- **Key options:** Strike system, auto-moderation triggers, membership tiers

### B9) Marketplace/Aggregator
- **Marketplace Admin (OWN/ADM):** vendor verification, listing governance, fee rules
- **Vendor (CONTRIB/OPS):** manage listings, accept bookings, deliver work, request payout
- **Client (CONTRIB):** book services, approve deliverables, raise disputes
- **Moderator (MOD):** handle reviews abuse, content reports
- **Finance (FIN):** settlement, payouts, refunds, reconciliation

### B10) Holding/Group
- **Group Admin (OWN):** create/manage sub-tenants, apply policy packs, consolidated reporting
- **Shared Finance (FIN+):** cross-tenant billing, settlement, exports
- **Shared Legal (LEGAL+):** contract templates, dispute escalation, compliance exports
- **Agency Admin (ADM):** operate their tenant within group constraints

---

*This document serves as the single source of truth for agency types, blueprints, and role permission sets. Used for workflow configuration only; permission enforcement (RBAC/ABAC) is out of scope for the initial 12-week workflow phase.*
