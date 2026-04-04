# Dwello

Real estate marketplace frontend for Dwello.

## Project Tree

The tree below reflects the current app structure and intentionally excludes generated or dependency directories like `node_modules`, `dist`, and `.git`.

```text
divinely-built/
+-- components.json
+-- eslint.config.js
+-- index.html
+-- package.json
+-- package-lock.json
+-- bun.lockb
+-- postcss.config.js
+-- tailwind.config.ts
+-- tsconfig.json
+-- tsconfig.app.json
+-- tsconfig.node.json
+-- vite.config.ts
+-- vitest.config.ts
+-- playwright.config.ts
+-- playwright-fixture.ts
+-- public/
|   +-- placeholder.svg
|   `-- robots.txt
`-- src/
    +-- App.tsx
    +-- App.css
    +-- index.css
    +-- main.tsx
    +-- vite-env.d.ts
    +-- components/
    |   +-- DashboardSkeleton.tsx
    |   +-- Features.tsx
    |   +-- Footer.tsx
    |   +-- Hero.tsx
    |   +-- KycAlertBanner.tsx
    |   +-- NavLink.tsx
    |   +-- Navbar.tsx
    |   +-- Newsletter.tsx
    |   +-- PropertyListings.tsx
    |   +-- ValueProposition.tsx
    |   +-- admin/
    |   |   +-- AdminBottomNav.tsx
    |   |   +-- AdminLayout.tsx
    |   |   `-- AdminSidebar.tsx
    |   +-- dashboard/
    |   |   `-- DashboardCustomizer.tsx
    |   +-- layout/
    |   |   `-- MarketingShell.tsx
    |   +-- provider/
    |   |   +-- AddListingSheet.tsx
    |   |   +-- ProviderBottomNav.tsx
    |   |   +-- ProviderLayout.tsx
    |   |   +-- ProviderSidebar.tsx
    |   |   `-- SendOfferSheet.tsx
    |   +-- seeker/
    |   |   +-- SeekerBottomNav.tsx
    |   |   +-- SeekerLayout.tsx
    |   |   `-- SeekerSidebar.tsx
    |   `-- ui/
    |       +-- accordion.tsx
    |       +-- alert-dialog.tsx
    |       +-- alert.tsx
    |       +-- aspect-ratio.tsx
    |       +-- avatar.tsx
    |       +-- badge.tsx
    |       +-- breadcrumb.tsx
    |       +-- button.tsx
    |       +-- calendar.tsx
    |       +-- card.tsx
    |       +-- carousel.tsx
    |       +-- chart.tsx
    |       +-- checkbox.tsx
    |       +-- collapsible.tsx
    |       +-- command.tsx
    |       +-- context-menu.tsx
    |       +-- dialog.tsx
    |       +-- drawer.tsx
    |       +-- dropdown-menu.tsx
    |       +-- form.tsx
    |       +-- hover-card.tsx
    |       +-- input-otp.tsx
    |       +-- input.tsx
    |       +-- label.tsx
    |       +-- menubar.tsx
    |       +-- navigation-menu.tsx
    |       +-- pagination.tsx
    |       +-- popover.tsx
    |       +-- progress.tsx
    |       +-- radio-group.tsx
    |       +-- resizable.tsx
    |       +-- scroll-area.tsx
    |       +-- select.tsx
    |       +-- separator.tsx
    |       +-- sheet.tsx
    |       +-- sidebar.tsx
    |       +-- skeleton.tsx
    |       +-- slider.tsx
    |       +-- sonner.tsx
    |       +-- switch.tsx
    |       +-- table.tsx
    |       +-- tabs.tsx
    |       +-- textarea.tsx
    |       +-- toast.tsx
    |       +-- toaster.tsx
    |       +-- toggle-group.tsx
    |       +-- toggle.tsx
    |       +-- tooltip.tsx
    |       `-- use-toast.ts
    +-- contexts/
    |   `-- AvatarContext.tsx
    +-- hooks/
    |   +-- use-dashboard-layout.ts
    |   +-- use-mobile.tsx
    |   `-- use-toast.ts
    +-- lib/
    |   `-- utils.ts
    +-- pages/
    |   +-- About.tsx
    |   +-- Contact.tsx
    |   +-- Index.tsx
    |   +-- Login.tsx
    |   +-- NotFound.tsx
    |   +-- Onboarding.tsx
    |   +-- Properties.tsx
    |   +-- Rent.tsx
    |   +-- Signup.tsx
    |   +-- admin/
    |   |   +-- Announcements.tsx
    |   |   +-- Dashboard.tsx
    |   |   +-- Disputes.tsx
    |   |   +-- Properties.tsx
    |   |   +-- Reports.tsx
    |   |   +-- Settings.tsx
    |   |   +-- Transactions.tsx
    |   |   +-- Users.tsx
    |   |   `-- Verifications.tsx
    |   +-- provider/
    |   |   +-- AddListing.tsx
    |   |   +-- Calendar.tsx
    |   |   +-- Dashboard.tsx
    |   |   +-- Inbox.tsx
    |   |   +-- LeadDetail.tsx
    |   |   +-- Listings.tsx
    |   |   +-- Payouts.tsx
    |   |   +-- SendOffer.tsx
    |   |   `-- Settings.tsx
    |   `-- seeker/
    |       +-- Bookings.tsx
    |       +-- Dashboard.tsx
    |       +-- Offers.tsx
    |       +-- PostNeed.tsx
    |       +-- Saved.tsx
    |       `-- Settings.tsx
    `-- test/
        +-- example.test.ts
        `-- setup.ts
```
