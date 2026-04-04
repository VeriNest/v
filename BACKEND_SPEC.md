# Dwello Backend Specification

## Purpose

This document defines the backend required to support the current Dwello frontend in this repository.

It is based on the implemented application structure, not an older product concept. The spec reflects the current split between:

- public marketing pages
- authentication and onboarding
- seeker dashboard
- provider dashboard
- landlord dashboard
- admin dashboard

This version replaces the earlier backend assumption that landlord should be treated as only a provider subtype in the UI layer. The current frontend has a dedicated landlord route group and therefore requires landlord-specific backend capabilities.

## Current Frontend Route Map

Top-level routes from [src/App.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/App.tsx):

- `/`
- `/login`
- `/signup`
- `/onboarding`
- `/properties`
- `/rent`
- `/about`
- `/contact`
- `/seeker/*`
- `/provider/*`
- `/landlord/*`
- `/admin/*`

### Seeker routes

- `/seeker`
- `/seeker/post`
- `/seeker/offers`
- `/seeker/bookings`
- `/seeker/saved`
- `/seeker/settings`

### Provider routes

- `/provider`
- `/provider/inbox`
- `/provider/inbox/:id`
- `/provider/inbox/:id/offer`
- `/provider/listings`
- `/provider/listings/new`
- `/provider/payouts`
- `/provider/calendar`
- `/provider/settings`

### Landlord routes

- `/landlord`
- `/landlord/properties`
- `/landlord/properties/new`
- `/landlord/units`
- `/landlord/collections`
- `/landlord/payouts`
- `/landlord/maintenance`
- `/landlord/calendar`
- `/landlord/settings`

### Admin routes

- `/admin`
- `/admin/properties`
- `/admin/users`
- `/admin/transactions`
- `/admin/disputes`
- `/admin/verifications`
- `/admin/reports`
- `/admin/announcements`
- `/admin/settings`

## Product Roles

The backend should support these primary roles:

- `seeker`
- `agent`
- `landlord`
- `admin`

Do not model the UI-facing authorization layer as only `seeker | provider | admin`.

The frontend currently routes agent and landlord to different dashboard surfaces, so the backend should expose role-aware APIs directly for both:

- `agent`
  - pipeline-first
  - leads
  - offers
  - listings
  - payouts
  - availability calendar
- `landlord`
  - portfolio-first
  - owned properties
  - units
  - collections
  - owner payouts
  - maintenance
  - lease and operational calendar

Recommended auth token claims:

```json
{
  "sub": "usr_123",
  "role": "landlord",
  "permissions": ["properties:read", "units:write", "collections:read"]
}
```

## Recommended Backend Stack

- Runtime: `Node.js`
- Framework: `NestJS`
- API style: `REST JSON`
- Database: `PostgreSQL`
- ORM: `Prisma`
- Cache and queues: `Redis`
- Background jobs: `BullMQ`
- File storage: `S3-compatible object storage`
- Auth: `JWT access token + refresh token`
- Validation: request DTO validation plus schema-level validation

## Onboarding Reality Check

The current onboarding UI in [src/pages/Onboarding.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/Onboarding.tsx) supports:

- role choice:
  - `tenant`
  - `agent`
  - `landlord`
- contact and city collection
- seeker preference collection
- agent professional profile collection
- landlord ownership profile collection
- provider KYC upload

Current landlord onboarding fields in the UI:

- phone
- city
- property count range
- property types
- current agent status

Current agent onboarding fields in the UI:

- phone
- city
- company name
- years of experience
- specialization tags
- bio

Current seeker onboarding fields in the UI:

- phone
- preferred city
- accommodation type
- budget range
- move-in timeline

Current KYC document expectations:

- agent:
  - `nin`
  - `cac_certificate`
- landlord:
  - `nin`
  - `property_deed_or_cofo`

## Core Domain Model

The backend should center on the following entities.

### 1. User

Fields:

- `id`
- `email`
- `password_hash`
- `role` = `seeker | agent | landlord | admin`
- `status` = `active | suspended | pending`
- `email_verified_at`
- `phone_verified_at`
- `last_login_at`
- `created_at`
- `updated_at`

### 2. Profile

Shared profile table for all users.

Fields:

- `id`
- `user_id`
- `full_name`
- `phone`
- `city`
- `avatar_url`
- `bio`
- `onboarding_completed`
- `created_at`
- `updated_at`

### 3. SeekerProfile

Fields:

- `user_id`
- `preferred_city`
- `preferred_accommodation_type`
- `preferred_budget_label`
- `move_in_timeline`

### 4. AgentProfile

Fields:

- `user_id`
- `company_name`
- `experience_range`
- `bio`
- `specializations_json`

### 5. LandlordProfile

Fields:

- `user_id`
- `property_count_range`
- `property_types_json`
- `current_agent_status`
- `ownership_label` nullable for future use

### 6. Verification

Fields:

- `id`
- `user_id`
- `status` = `not_started | submitted | in_review | approved | rejected | expired`
- `submitted_at`
- `reviewed_at`
- `reviewed_by`
- `rejection_reason`
- `notes`
- `created_at`
- `updated_at`

### 7. VerificationDocument

Fields:

- `id`
- `verification_id`
- `document_type`
- `file_url`
- `file_key`
- `mime_type`
- `status` = `uploaded | verified | rejected`
- `created_at`

Document types implied by current UI:

- `nin`
- `cac_certificate`
- `property_deed_or_cofo`

### 8. Property

A landlord-owned or agent-managed property record.

Fields:

- `id`
- `owner_user_id`
- `manager_user_id` nullable
- `listing_code`
- `title`
- `description`
- `listing_type` = `rent | shortlet | sale`
- `property_category`
- `bedrooms_label`
- `bathrooms`
- `city`
- `address_line`
- `price_amount`
- `price_currency`
- `price_period` = `year | month | night | total`
- `available_from`
- `status` = `draft | pending_review | active | paused | archived | rejected`
- `operational_status` = `vacant | partially_occupied | occupied | under_maintenance`
- `created_at`
- `updated_at`

### 9. PropertyAmenity

- `property_id`
- `amenity_key`

### 10. PropertyMedia

Fields:

- `id`
- `property_id`
- `media_type` = `image | video`
- `file_url`
- `file_key`
- `sort_order`
- `is_cover`
- `created_at`

### 11. Unit

Landlord pages require a real unit model.

Fields:

- `id`
- `property_id`
- `unit_code`
- `name`
- `unit_type`
- `bedrooms_label`
- `rent_amount`
- `rent_currency`
- `rent_period`
- `occupancy_status` = `vacant | occupied | reserved | notice | maintenance`
- `listing_status` = `unlisted | listed | paused`
- `tenant_user_id` nullable
- `lease_id` nullable
- `created_at`
- `updated_at`

### 12. NeedPost

Seeker housing request.

Fields:

- `id`
- `user_id`
- `title`
- `property_type` = `rent | shortlet | shared`
- `bedrooms_label`
- `preferred_location_text`
- `budget_min`
- `budget_max`
- `budget_currency`
- `budget_period` = `year | night`
- `move_in_date`
- `urgency` = `flexible | soon | urgent`
- `notes`
- `boost_enabled`
- `status` = `draft | active | paused | matched | closed | expired`
- `created_at`
- `updated_at`

### 13. NeedAmenity

- `need_post_id`
- `amenity_key`

### 14. LeadMatch

Agent-visible lead generated from a seeker need.

Fields:

- `id`
- `agent_user_id`
- `need_post_id`
- `matched_property_id`
- `match_score`
- `status` = `new | viewed | responded | skipped | expired`
- `sla_expires_at`
- `created_at`
- `updated_at`

Landlord should not be forced into the same lead inbox model if the product later diverges, but current reuse means the domain should remain flexible.

### 15. Offer

Fields:

- `id`
- `need_post_id`
- `provider_user_id`
- `provider_role` = `agent | landlord`
- `property_id`
- `lead_match_id` nullable
- `offer_price_amount`
- `offer_price_currency`
- `offer_price_period`
- `move_in_date`
- `custom_terms`
- `message`
- `priority_send`
- `status` = `sent | viewed | shortlisted | negotiated | accepted | declined | expired | withdrawn`
- `sent_at`
- `viewed_at`
- `accepted_at`
- `declined_at`
- `created_at`
- `updated_at`

### 16. SavedProperty

Fields:

- `id`
- `user_id`
- `property_id`
- `created_at`

### 17. Booking

Used for seeker booking history and provider scheduling.

Fields:

- `id`
- `offer_id`
- `property_id`
- `unit_id` nullable
- `seeker_user_id`
- `provider_user_id`
- `booking_type` = `viewing | hold | move_in | shortlet`
- `scheduled_for`
- `status` = `pending | confirmed | completed | cancelled | no_show`
- `notes`
- `created_at`
- `updated_at`

### 18. Lease

Landlord dashboard requires lease-level data.

Fields:

- `id`
- `unit_id`
- `tenant_user_id`
- `landlord_user_id`
- `rent_amount`
- `currency`
- `service_charge_amount` nullable
- `deposit_amount` nullable
- `start_date`
- `end_date`
- `status` = `draft | active | renewal_due | expired | terminated`
- `agreement_file_url` nullable
- `created_at`
- `updated_at`

### 19. RentCharge

Tracks expected landlord collections.

Fields:

- `id`
- `lease_id`
- `unit_id`
- `tenant_user_id`
- `due_date`
- `amount`
- `currency`
- `status` = `due | paid | overdue | part_paid | waived`
- `paid_amount`
- `created_at`
- `updated_at`

### 20. Transaction

Fields:

- `id`
- `reference`
- `user_id`
- `booking_id` nullable
- `offer_id` nullable
- `lease_id` nullable
- `rent_charge_id` nullable
- `type` = `charge | escrow_hold | escrow_release | refund | fee | payout | rent_collection`
- `amount`
- `currency`
- `status` = `pending | processing | succeeded | failed | reversed`
- `provider`
- `provider_reference`
- `metadata_json`
- `created_at`
- `updated_at`

### 21. Payout

Supports both agent and landlord payout surfaces.

Fields:

- `id`
- `recipient_user_id`
- `recipient_role` = `agent | landlord`
- `transaction_id`
- `amount`
- `currency`
- `status` = `pending | queued | processing | paid | failed`
- `requested_at`
- `paid_at`
- `failure_reason`

### 22. MaintenanceRequest

Required for landlord maintenance page.

Fields:

- `id`
- `property_id`
- `unit_id` nullable
- `tenant_user_id` nullable
- `landlord_user_id`
- `title`
- `description`
- `severity` = `low | medium | high | urgent`
- `status` = `open | assigned | in_progress | resolved | closed`
- `assigned_vendor_name` nullable
- `scheduled_for` nullable
- `estimated_cost` nullable
- `actual_cost` nullable
- `created_at`
- `updated_at`

### 23. CalendarEvent

Optional but recommended normalized schedule table for landlord operations.

Fields:

- `id`
- `user_id`
- `property_id` nullable
- `unit_id` nullable
- `type` = `booking | rent_followup | lease_review | inspection | maintenance | document_audit`
- `title`
- `starts_at`
- `ends_at`
- `status` = `scheduled | pending | completed | cancelled`
- `metadata_json`
- `created_at`
- `updated_at`

### 24. Dispute

Fields:

- `id`
- `reference`
- `reporter_user_id`
- `subject_user_id`
- `property_id` nullable
- `offer_id` nullable
- `booking_id` nullable
- `transaction_id` nullable
- `type` = `fraud | quality | cancellation | payment | impersonation | listing_misrepresentation`
- `priority` = `low | medium | high | critical`
- `status` = `open | in_review | escalated | resolved | closed`
- `title`
- `description`
- `assigned_admin_id`
- `resolution_summary`
- `resolved_at`
- `created_at`
- `updated_at`

### 25. Announcement

Fields:

- `id`
- `title`
- `body`
- `audience` = `all | seekers | agents | landlords | admins`
- `status` = `draft | published | archived`
- `published_at`
- `created_by`
- `created_at`
- `updated_at`

### 26. Notification

Fields:

- `id`
- `user_id`
- `type`
- `title`
- `body`
- `data_json`
- `read_at`
- `created_at`

## Workflow Requirements

### Authentication and onboarding

Supported frontend flow:

1. User signs up.
2. User logs in.
3. User completes onboarding.
4. Provider roles may upload KYC docs.
5. App routes to seeker, provider, or landlord dashboard.

Backend requirements:

- create account
- issue access and refresh tokens
- persist onboarding state
- persist role-specific profile data
- create verification record for agent or landlord
- track KYC status

### Seeker flow

Supported frontend flow:

1. Seeker posts a need.
2. Providers respond with offers.
3. Seeker reviews offers.
4. Seeker tracks bookings.
5. Seeker saves properties.

Backend requirements:

- need post CRUD
- matching pipeline
- seeker offer inbox
- booking history
- saved properties

### Agent flow

Supported frontend flow:

1. Agent creates listings.
2. Agent sees matched leads.
3. Agent opens lead detail.
4. Agent sends offer.
5. Agent tracks payouts.
6. Agent uses booking-oriented calendar.

Backend requirements:

- listing CRUD
- lead inbox
- lead detail
- offer send
- payout ledger
- schedule feed

### Landlord flow

Supported frontend flow:

1. Landlord manages properties.
2. Landlord manages units.
3. Landlord tracks collections.
4. Landlord tracks payouts.
5. Landlord tracks maintenance.
6. Landlord uses operational calendar.

Backend requirements:

- landlord property feed
- unit management
- lease and occupancy data
- rent ledger and collection statuses
- landlord remittance history
- maintenance queue
- operational events feed

### Admin flow

Supported frontend flow:

- overview metrics
- property moderation
- user management
- transaction review
- disputes
- verifications
- reports
- announcements

Backend requirements:

- admin dashboard metrics
- moderation queues
- verification review
- dispute resolution
- report feeds
- announcement publish flow

## State Machines

### Verification

- `not_started`
- `submitted`
- `in_review`
- `approved`
- `rejected`
- `expired`

### Property

- `draft`
- `pending_review`
- `active`
- `paused`
- `archived`
- `rejected`

### NeedPost

- `draft`
- `active`
- `paused`
- `matched`
- `closed`
- `expired`

### Offer

- `sent`
- `viewed`
- `shortlisted`
- `negotiated`
- `accepted`
- `declined`
- `expired`
- `withdrawn`

### Booking

- `pending`
- `confirmed`
- `completed`
- `cancelled`
- `no_show`

### Lease

- `draft`
- `active`
- `renewal_due`
- `expired`
- `terminated`

### RentCharge

- `due`
- `paid`
- `overdue`
- `part_paid`
- `waived`

### MaintenanceRequest

- `open`
- `assigned`
- `in_progress`
- `resolved`
- `closed`

### Payout

- `pending`
- `queued`
- `processing`
- `paid`
- `failed`

## API Surface

Recommended route prefix:

- `/api/v1`

## Authentication API

### `POST /api/v1/auth/register`

Request:

```json
{
  "email": "jane@example.com",
  "password": "strong-password",
  "fullName": "Jane Doe",
  "role": "seeker"
}
```

### `POST /api/v1/auth/login`

### `POST /api/v1/auth/refresh`

### `POST /api/v1/auth/logout`

### `GET /api/v1/auth/me`

Must return:

- user
- base profile
- role-specific profile
- verification summary if role is `agent` or `landlord`

## Onboarding API

### `PUT /api/v1/onboarding/profile`

Payload should accept role-specific branches.

Seeker example:

```json
{
  "role": "seeker",
  "phone": "+2348012345678",
  "city": "Lagos",
  "preferredCity": "Lagos",
  "preferredAccommodationType": "Rent",
  "preferredBudgetLabel": "500k-1m",
  "moveInTimeline": "Within 1 month"
}
```

Agent example:

```json
{
  "role": "agent",
  "phone": "+2348012345678",
  "city": "Lagos",
  "companyName": "Prime Realtors Ltd",
  "experienceRange": "3-5 years",
  "specializations": ["Residential", "Luxury"],
  "bio": "Focused on premium residential leasing."
}
```

Landlord example:

```json
{
  "role": "landlord",
  "phone": "+2348012345678",
  "city": "Lagos",
  "propertyCountRange": "2-5",
  "propertyTypes": ["Flat / Apartment", "Duplex"],
  "currentAgentStatus": "No"
}
```

### `POST /api/v1/verifications`

Create or submit verification application.

### `POST /api/v1/verifications/:id/documents`

Upload metadata registration or signed upload init.

### `GET /api/v1/verifications/me`

## Public Property API

### `GET /api/v1/properties`

Supports public listing feed and filters.

Query params:

- `q`
- `city`
- `listingType`
- `minPrice`
- `maxPrice`
- `bedrooms`
- `status`
- `page`
- `limit`
- `sort`

### `GET /api/v1/properties/:id`

## Agent Listing API

### `POST /api/v1/agent/properties`

### `GET /api/v1/agent/properties`

### `GET /api/v1/agent/properties/:id`

### `PATCH /api/v1/agent/properties/:id`

### `POST /api/v1/agent/properties/:id/submit`

### `POST /api/v1/agent/properties/:id/media`

## Landlord Property API

The frontend currently reuses the add-listing screen for `/landlord/properties/new`, but the backend should still expose landlord-scoped endpoints.

### `POST /api/v1/landlord/properties`

### `GET /api/v1/landlord/properties`

### `GET /api/v1/landlord/properties/:id`

### `PATCH /api/v1/landlord/properties/:id`

## Unit API

### `POST /api/v1/landlord/units`

### `GET /api/v1/landlord/units`

### `GET /api/v1/landlord/units/:id`

### `PATCH /api/v1/landlord/units/:id`

### `PATCH /api/v1/landlord/units/:id/status`

## Need Post API

### `POST /api/v1/seeker/needs`

### `GET /api/v1/seeker/needs`

### `GET /api/v1/seeker/needs/:id`

### `PATCH /api/v1/seeker/needs/:id`

### `PATCH /api/v1/seeker/needs/:id/status`

## Lead API

### `GET /api/v1/agent/leads`

### `GET /api/v1/agent/leads/:id`

### `PATCH /api/v1/agent/leads/:id/status`

## Offer API

### `POST /api/v1/offers`

### `GET /api/v1/seeker/offers`

### `GET /api/v1/offers/:id`

### `PATCH /api/v1/offers/:id/status`

Allowed seeker status transitions:

- `viewed`
- `shortlisted`
- `accepted`
- `declined`

Allowed provider status transitions:

- `withdrawn`

## Saved Property API

### `POST /api/v1/seeker/saved-properties`

### `DELETE /api/v1/seeker/saved-properties/:propertyId`

### `GET /api/v1/seeker/saved-properties`

## Booking API

### `POST /api/v1/bookings`

### `GET /api/v1/seeker/bookings`

### `GET /api/v1/agent/bookings`

### `PATCH /api/v1/bookings/:id/status`

## Lease API

### `POST /api/v1/landlord/leases`

### `GET /api/v1/landlord/leases`

### `GET /api/v1/landlord/leases/:id`

### `PATCH /api/v1/landlord/leases/:id`

### `PATCH /api/v1/landlord/leases/:id/status`

## Collections API

### `GET /api/v1/landlord/collections`

Returns rent ledger rows, summary cards, and filterable states:

- `paid`
- `due`
- `overdue`
- `part_paid`

### `GET /api/v1/landlord/collections/:id`

### `POST /api/v1/landlord/collections/:id/record-payment`

### `POST /api/v1/landlord/collections/:id/remind`

## Payout API

### `GET /api/v1/agent/payouts`

### `POST /api/v1/agent/payouts/request`

### `GET /api/v1/landlord/payouts`

### `POST /api/v1/landlord/payouts/request`

## Maintenance API

### `POST /api/v1/landlord/maintenance`

### `GET /api/v1/landlord/maintenance`

### `GET /api/v1/landlord/maintenance/:id`

### `PATCH /api/v1/landlord/maintenance/:id`

### `PATCH /api/v1/landlord/maintenance/:id/status`

## Calendar API

### `GET /api/v1/agent/calendar`

Returns booking-oriented schedule data for provider calendar.

### `GET /api/v1/landlord/calendar`

Returns landlord operational events:

- rent follow-ups
- lease reviews
- inspections
- maintenance visits
- document audits

Suggested response:

```json
{
  "stats": {
    "thisWeek": 5,
    "scheduled": 4,
    "pending": 1,
    "trackedCollections": 2300000
  },
  "board": [
    {
      "day": 0,
      "startHour": 3,
      "duration": 2,
      "title": "Palm Residence A1",
      "subtitle": "Rent follow-up",
      "status": "scheduled"
    }
  ],
  "upcoming": [
    {
      "id": "evt_123",
      "title": "Palm Residence A1",
      "location": "Victoria Island",
      "startsOn": "2026-04-08",
      "endsOn": "2026-04-08",
      "label": "N850,000",
      "status": "scheduled"
    }
  ]
}
```

## Admin API

### `GET /api/v1/admin/metrics/overview`

Must support current dashboard needs:

- total properties
- active users
- monthly revenue
- open disputes

### `GET /api/v1/admin/metrics/revenue`

### `GET /api/v1/admin/metrics/property-activity`

### `GET /api/v1/admin/activity`

### `GET /api/v1/admin/users`

### `PATCH /api/v1/admin/users/:id/status`

### `GET /api/v1/admin/properties`

### `PATCH /api/v1/admin/properties/:id/moderation`

### `GET /api/v1/admin/verifications`

### `PATCH /api/v1/admin/verifications/:id`

### `GET /api/v1/admin/disputes`

### `POST /api/v1/admin/disputes`

### `PATCH /api/v1/admin/disputes/:id`

### `GET /api/v1/admin/transactions`

### `GET /api/v1/admin/reports`

### `GET /api/v1/admin/announcements`

### `POST /api/v1/admin/announcements`

### `PATCH /api/v1/admin/announcements/:id`

## Notification API

### `GET /api/v1/notifications`

### `PATCH /api/v1/notifications/:id/read`

### `PATCH /api/v1/notifications/read-all`

## Access Control

### Seeker

Can:

- manage own profile
- manage own need posts
- read own offers
- manage own bookings
- manage own saved properties

### Agent

Can:

- manage own profile
- manage own listings
- read and update own leads
- send own offers
- view own payouts
- read own calendar

### Landlord

Can:

- manage own profile
- manage own properties
- manage own units
- read and update own collections
- read own payouts
- manage own maintenance items
- read own calendar

### Admin

Can:

- full moderation and reporting access

Additional rules:

- only `agent` and `landlord` can create verification submissions
- only verified agent or landlord accounts can submit listings for activation
- seekers cannot access provider or landlord scoped data
- agents cannot access landlord collection ledgers unless explicitly added later by product decision

## Validation Rules

### Account

- email unique
- password minimum strength
- role required

### Property

- title required
- listing type required
- city required
- price required unless explicitly price-on-request in future
- amenity keys must be from catalog

### Unit

- must belong to a property owned by current landlord
- occupancy status required
- rent amount required for leasable inventory

### NeedPost

- property type required
- preferred location required
- budget min must be less than or equal to budget max

### Offer

- provider must own or control referenced property
- property must be active
- need post must be active

### RentCharge

- amount must be positive
- due date required
- status transitions must be valid

## Search and Filtering Requirements

### Public properties

- keyword
- city
- listing type
- price range
- bedrooms

### Seeker offers

- status
- provider role
- location

### Agent leads

- status
- location
- property type
- urgency

### Landlord collections

- state
- property
- unit
- tenant
- due date range

### Landlord maintenance

- status
- severity
- property
- unit

### Admin

- moderation status
- verification status
- dispute status
- transaction status

## File Upload Strategy

Use signed uploads.

Upload categories:

- avatars
- property media
- verification documents
- lease agreements
- maintenance attachments

Recommended flow:

1. client requests signed upload URL
2. client uploads directly to object storage
3. backend stores metadata and ownership

## Background Jobs

Required async jobs:

- lead generation after seeker need creation
- lead generation after property activation
- notification fanout
- email and SMS delivery
- provider SLA expiry
- offer expiry
- verification review reminders
- payout processing
- rent overdue reminders
- maintenance reminder and escalation jobs

## Observability and Audit

Minimum audit events:

- login success and failure
- onboarding completed
- verification submitted, approved, rejected
- property submitted, approved, rejected
- offer sent, accepted, declined
- payment recorded
- payout requested, paid, failed
- maintenance status changed
- admin moderation actions

Recommended supporting tables:

- `audit_logs`
- `job_runs`

## Suggested Database Schema Outline

- `users`
- `profiles`
- `seeker_profiles`
- `agent_profiles`
- `landlord_profiles`
- `verifications`
- `verification_documents`
- `properties`
- `property_media`
- `property_amenities`
- `units`
- `need_posts`
- `need_amenities`
- `lead_matches`
- `offers`
- `saved_properties`
- `bookings`
- `leases`
- `rent_charges`
- `transactions`
- `payouts`
- `maintenance_requests`
- `calendar_events`
- `disputes`
- `announcements`
- `notifications`
- `audit_logs`

## Delivery Phases

### Phase 1: Auth and onboarding

- auth
- shared profiles
- role-specific profile persistence
- verification record creation

### Phase 2: Public properties and agent listing engine

- public property feed
- property CRUD
- media upload
- moderation statuses

### Phase 3: Seeker needs and agent matching

- need post CRUD
- lead generation
- agent inbox
- lead detail

### Phase 4: Offers and bookings

- offer creation
- seeker offers
- booking history
- saved properties

### Phase 5: Landlord operations

- landlord property feed
- units
- leases
- collections
- maintenance
- landlord calendar
- landlord payouts

### Phase 6: Admin operations

- admin metrics
- verification review
- disputes
- reports
- announcements
- audit logging

## Minimum Viable API Set

If the backend needs to make the current frontend useful quickly, start here:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `PUT /api/v1/onboarding/profile`
- `POST /api/v1/verifications`
- `POST /api/v1/verifications/:id/documents`
- `GET /api/v1/verifications/me`
- `GET /api/v1/properties`
- `POST /api/v1/agent/properties`
- `GET /api/v1/agent/properties`
- `POST /api/v1/seeker/needs`
- `GET /api/v1/seeker/needs`
- `GET /api/v1/agent/leads`
- `POST /api/v1/offers`
- `GET /api/v1/seeker/offers`
- `GET /api/v1/seeker/bookings`
- `GET /api/v1/landlord/properties`
- `GET /api/v1/landlord/units`
- `GET /api/v1/landlord/collections`
- `GET /api/v1/landlord/payouts`
- `GET /api/v1/landlord/maintenance`
- `GET /api/v1/landlord/calendar`
- `GET /api/v1/admin/metrics/overview`
- `GET /api/v1/admin/verifications`
- `PATCH /api/v1/admin/verifications/:id`

## Frontend to Backend Mapping

Current frontend pages imply these backend contracts:

- [src/pages/Onboarding.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/Onboarding.tsx)
  - role selection
  - role-specific onboarding persistence
  - KYC submission
- [src/pages/Properties.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/Properties.tsx)
  - public listing feed and search
- [src/pages/provider/AddListing.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/provider/AddListing.tsx)
  - agent and landlord listing draft creation
- [src/pages/provider/Listings.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/provider/Listings.tsx)
  - agent listing management
- [src/pages/provider/Inbox.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/provider/Inbox.tsx)
  - agent lead inbox
- [src/pages/provider/LeadDetail.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/provider/LeadDetail.tsx)
  - lead detail
- [src/pages/provider/SendOffer.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/provider/SendOffer.tsx)
  - offer submission
- [src/pages/seeker/PostNeed.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/seeker/PostNeed.tsx)
  - seeker need creation
- [src/pages/seeker/Offers.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/seeker/Offers.tsx)
  - seeker offer inbox
- [src/pages/seeker/Bookings.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/seeker/Bookings.tsx)
  - booking history
- [src/pages/landlord/Properties.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/landlord/Properties.tsx)
  - landlord property portfolio feed
- [src/pages/landlord/Units.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/landlord/Units.tsx)
  - unit feed and occupancy states
- [src/pages/landlord/Collections.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/landlord/Collections.tsx)
  - rent ledger
- [src/pages/landlord/Payouts.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/landlord/Payouts.tsx)
  - owner remittance history
- [src/pages/landlord/Maintenance.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/landlord/Maintenance.tsx)
  - maintenance queue
- [src/pages/landlord/Calendar.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/landlord/Calendar.tsx)
  - landlord operational events
- [src/pages/admin/Dashboard.tsx](/c:/Users/USER/Projects/Verinest/divinely-built/src/pages/admin/Dashboard.tsx)
  - admin overview metrics and activity

## Open Decisions

These decisions still need to be made before implementation starts:

- whether landlord listing creation should continue reusing the provider listing form long-term
- whether agents should ever access unit- or lease-level landlord operations
- whether landlord payouts and collections should share one ledger or remain separate projections
- whether shortlet bookings should remain under the same booking model as rent viewings and move-ins
- whether notifications are in-app only or also email, SMS, or WhatsApp

## Implementation Notes

- Build against the current route system, not an earlier provider-only abstraction.
- Treat `agent` and `landlord` as separate first-class roles in access control and service boundaries.
- Keep landlord operations data normalized: properties, units, leases, rent charges, maintenance.
- Add audit logging from the beginning for admin, verification, payout, and maintenance actions.
- Design all list endpoints with pagination, filtering, and stable enum values from day one.
