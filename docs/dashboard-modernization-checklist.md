# Dashboard Modernization Checklist

## Goal
- Move the dashboard UI from a collection of good-looking pages to a single product system.
- Standardize layout grammar, status language, control placement, settings structure, and widget behavior.

## Design Direction
- Calm enterprise product UI
- Flatter surfaces
- Clearer density rules
- Fewer decorative containers
- Stronger data-first hierarchy
- Consistent light and dark theme behavior

## Core Rules

### Page Anatomy
- Use one dashboard page structure everywhere:
  - page header
  - optional KPI strip
  - control row
  - primary content
  - optional secondary content
- Keep primary CTA in the page header, not in the control row.

### Control Row
- Left side:
  - tabs or segmented state controls
- Right side:
  - search
  - filter
  - optional view switch
- Keep this pattern consistent across all data-heavy pages.

### Surface Types
- Only use these surface categories:
  - `DashboardStatCard`
  - `DashboardSectionCard`
  - `DataCard`
  - `DataTable`
  - `DashboardSettingsSection`

### Status System
- Use only these shared semantic tones:
  - `neutral`
  - `info`
  - `success`
  - `warning`
  - `danger`
- Avoid page-local badge color logic unless the case is truly unique.

### Widget Rules
- Widget anatomy:
  - title
  - optional one-line description
  - body
  - optional small footer action
- Remove duplicate control systems and heavy widget chrome.

### Settings Rules
- Settings pages should be row-based, not KPI-card-based.
- Each section should contain:
  - section title
  - section description
  - stack of setting rows
- Use the same layout across admin, provider, seeker, and landlord.

## Phases

### Phase 1: Shared Primitives
- [ ] Add `DashboardPageHeader`
- [ ] Add `DashboardControlRow`
- [ ] Add `DashboardStatusBadge`
- [ ] Add `DashboardEmptyState`
- [ ] Add `DashboardSettingsSection`
- [ ] Add `DashboardSettingsRow`
- [ ] Add `DashboardSectionCard`
- [ ] Validate dark-mode appearance of the new primitives

### Phase 2: Shell Normalization
- [ ] Standardize dashboard header spacing in:
  - `src/components/admin/AdminLayout.tsx`
  - `src/components/provider/ProviderLayout.tsx`
  - `src/components/seeker/SeekerLayout.tsx`
  - `src/components/landlord/LandlordLayout.tsx`
- [ ] Standardize header actions:
  - search
  - notifications
  - dark mode
  - profile
- [ ] Standardize content padding and mobile top spacing

### Phase 3: Overview Dashboards
- [ ] Refactor:
  - `src/pages/admin/Dashboard.tsx`
  - `src/pages/provider/Dashboard.tsx`
  - `src/pages/seeker/Dashboard.tsx`
  - `src/pages/landlord/Dashboard.tsx`
- [ ] Use one widget header pattern
- [ ] Use one stat-card rhythm
- [ ] Remove badge and footer drift between widgets

### Phase 4: Data Pages
- [ ] Normalize control rows on:
  - `src/pages/provider/Inbox.tsx`
  - `src/pages/provider/Listings.tsx`
  - `src/pages/seeker/Offers.tsx`
  - `src/pages/seeker/Bookings.tsx`
  - `src/pages/landlord/Properties.tsx`
  - `src/pages/landlord/Units.tsx`
  - `src/pages/landlord/Maintenance.tsx`
  - `src/pages/admin/Properties.tsx`
  - `src/pages/admin/Users.tsx`
  - `src/pages/admin/Verifications.tsx`
  - `src/pages/admin/Disputes.tsx`
- [ ] Prefer table/list-first layouts for high-volume content
- [ ] Keep cards as summary or mobile fallback only

### Phase 5: Settings
- [ ] Refactor:
  - `src/pages/admin/Settings.tsx`
  - `src/pages/provider/Settings.tsx`
  - `src/pages/seeker/Settings.tsx`
  - `src/pages/landlord/Settings.tsx`
- [ ] Use one settings row pattern
- [ ] Use one danger zone pattern
- [ ] Use one activity feed pattern

### Phase 6: Create/Post Flows
- [ ] Normalize:
  - `src/pages/seeker/PostNeed.tsx`
  - `src/pages/provider/AddListing.tsx`
  - `src/pages/provider/SendOffer.tsx`
  - `src/pages/admin/NewAnnouncement.tsx`
  - `src/pages/landlord/NewUnit.tsx`
  - `src/pages/landlord/NewMaintenanceIssue.tsx`
- [ ] Keep consistent:
  - progress header
  - form shell
  - sidebar guidance
  - history tab
  - success state

### Phase 7: Dark Mode and Status Sweep
- [ ] Replace light-only badge styles across dashboard pages
- [ ] Standardize divider contrast in dark mode
- [ ] Review empty states and muted surfaces in dark mode

## Immediate Implementation Order
1. Build shared primitives
2. Refactor settings pages first
3. Refactor control-row system
4. Refactor overview dashboards
5. Refactor data-heavy pages
6. Refactor create/post flows
7. Run dark-mode/status cleanup

## Definition of Done
- Any two dashboard pages feel like part of the same product
- Control rows behave consistently
- Settings pages share one layout grammar
- Status badges share one semantic system
- Widgets share one anatomy
- Dark mode looks designed, not inverted
