

# Admin Dashboard — Dwello Real Estate Platform

## What I Understand

You uploaded a detailed UI/UX research brief for a **Nigerian reverse-marketplace real estate platform** where tenants post needs and verified providers respond with offers. You want an **admin dashboard** that shares the same Dwello purple design template as the existing frontend landing page.

The dashboard will cover all four areas: property listings, user/provider management, transactions/payments, and disputes/moderation — all with mock/static data for now.

## Architecture

```text
/admin              → Dashboard overview (stats cards + charts)
/admin/properties   → Property listings table + management
/admin/users        → Users & providers table + verification status
/admin/transactions → Payments, escrow, payouts table
/admin/disputes     → Dispute queue + fraud alerts
```

All admin routes share a sidebar layout component. The landing page (`/`) stays untouched.

## File Plan

| File | Purpose |
|------|---------|
| `src/components/admin/AdminLayout.tsx` | Sidebar + header wrapper using existing SidebarProvider |
| `src/components/admin/AdminSidebar.tsx` | Purple-themed sidebar with nav links |
| `src/pages/admin/Dashboard.tsx` | Overview: stat cards (total properties, users, revenue, disputes), mini charts |
| `src/pages/admin/Properties.tsx` | Table of listings with status badges, search, filters |
| `src/pages/admin/Users.tsx` | Users/providers table with verification badges, role chips |
| `src/pages/admin/Transactions.tsx` | Payments table with escrow status, amounts, payout tracking |
| `src/pages/admin/Disputes.tsx` | Dispute queue with priority, status, type filters |
| `src/App.tsx` | Add `/admin/*` routes |

## Design Approach

- **Same purple primary** (`#7C3AED`) and design tokens as the frontend
- Sidebar: dark purple/navy background with white text, active state highlighted
- Cards, tables, badges, buttons all reuse existing shadcn/ui components
- Stats cards with icons and trend indicators
- Tables use the existing `Table` component with sorting and status badges
- Mock data arrays for all entities (properties, users, transactions, disputes)
- Responsive: sidebar collapses on smaller screens

## Dashboard Overview Page

Four stat cards at top:
- Total Properties (with trend %)
- Active Users
- Monthly Revenue
- Open Disputes

Below: Recent activity table + quick action buttons

## Key UI Elements

- **Property cards**: Status (Active/Pending/Rejected), location, price, agent name
- **User rows**: Name, role (Tenant/Agent/Landlord), verification status (Verified/Pending/Unverified), join date
- **Transaction rows**: ID, amount, type (Rent/Deposit/Short-let), status (Completed/Pending/Escrow/Failed), date
- **Dispute rows**: ID, type (Fraud/Quality/Cancellation), priority badge, status, assigned to

## Technical Details

- Uses existing shadcn components: `Table`, `Card`, `Badge`, `Button`, `Sidebar`
- `NavLink` component for active route highlighting in sidebar
- Lucide icons throughout (LayoutDashboard, Building2, Users, CreditCard, AlertTriangle)
- No backend needed — all static/mock data
- 7 new files, 1 modified file (App.tsx)

