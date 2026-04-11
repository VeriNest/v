import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AvatarProvider } from "@/contexts/AvatarContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ConfirmEmail from "./pages/ConfirmEmail.tsx";
import NotFound from "./pages/NotFound.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import RentPage from "./pages/Rent.tsx";
import PropertiesPage from "./pages/Properties.tsx";

// Admin
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import Properties from "./pages/admin/Properties.tsx";
import UsersPage from "./pages/admin/Users.tsx";
import Transactions from "./pages/admin/Transactions.tsx";
import Disputes from "./pages/admin/Disputes.tsx";
import AdminReports from "./pages/admin/Reports.tsx";
import AdminVerifications from "./pages/admin/Verifications.tsx";
import AdminAnnouncements from "./pages/admin/Announcements.tsx";
import NewAnnouncement from "./pages/admin/NewAnnouncement.tsx";
import AdminSettings from "./pages/admin/Settings.tsx";
import LandlordLayout from "./components/landlord/LandlordLayout.tsx";
import LandlordDashboard from "./pages/landlord/Dashboard.tsx";
import LandlordProperties from "./pages/landlord/Properties.tsx";
import LandlordUnits from "./pages/landlord/Units.tsx";
import LandlordNewUnit from "./pages/landlord/NewUnit.tsx";
import LandlordCollections from "./pages/landlord/Collections.tsx";
import LandlordPayouts from "./pages/landlord/Payouts.tsx";
import LandlordMaintenance from "./pages/landlord/Maintenance.tsx";
import LandlordNewMaintenanceIssue from "./pages/landlord/NewMaintenanceIssue.tsx";
import LandlordCalendar from "./pages/landlord/Calendar.tsx";
import LandlordSettings from "./pages/landlord/Settings.tsx";

// Seeker
import SeekerLayout from "./components/seeker/SeekerLayout.tsx";
import SeekerDashboard from "./pages/seeker/Dashboard.tsx";
import PostNeed from "./pages/seeker/PostNeed.tsx";
import Offers from "./pages/seeker/Offers.tsx";
import Bookings from "./pages/seeker/Bookings.tsx";
import Viewings from "./pages/seeker/Viewings.tsx";
import Saved from "./pages/seeker/Saved.tsx";
import SeekerSettings from "./pages/seeker/Settings.tsx";

// Provider
import ProviderLayout from "./components/provider/ProviderLayout.tsx";
import ProviderDashboard from "./pages/provider/Dashboard.tsx";
import LeadInbox from "./pages/provider/Inbox.tsx";
import Listings from "./pages/provider/Listings.tsx";
import AddListing from "./pages/provider/AddListing.tsx";
import Payouts from "./pages/provider/Payouts.tsx";
import ProviderCalendar from "./pages/provider/Calendar.tsx";
import ProviderSettings from "./pages/provider/Settings.tsx";
import LeadDetail from "./pages/provider/LeadDetail.tsx";
import SendOffer from "./pages/provider/SendOffer.tsx";
import DashboardSearch from "./pages/shared/DashboardSearch.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import ScrollToTop from "@/components/router/ScrollToTop";
const queryClient = new QueryClient();

const MarketingThemeScope = () => (
  <ThemeProvider forcedTheme="light">
    <Outlet />
  </ThemeProvider>
);

const DashboardThemeScope = () => (
  <ThemeProvider>
    <Outlet />
  </ThemeProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AvatarProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
          <Route element={<MarketingThemeScope />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
          </Route>

          {/* Admin Dashboard */}
          <Route element={<DashboardThemeScope />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="search" element={<DashboardSearch role="admin" />} />
              <Route path="properties" element={<Properties />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="disputes" element={<Disputes />} />
              <Route path="verifications" element={<AdminVerifications />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="announcements/new" element={<NewAnnouncement />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

          {/* Seeker (Tenant) Dashboard */}
            <Route path="/seeker" element={<SeekerLayout />}>
              <Route index element={<SeekerDashboard />} />
              <Route path="search" element={<DashboardSearch role="seeker" />} />
              <Route path="post" element={<PostNeed />} />
              <Route path="offers" element={<Offers />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="viewings" element={<Viewings />} />
              <Route path="saved" element={<Saved />} />
              <Route path="settings" element={<SeekerSettings />} />
            </Route>

          {/* Provider (Agent/Landlord) Dashboard */}
            <Route path="/provider" element={<ProviderLayout />}>
              <Route index element={<ProviderDashboard />} />
              <Route path="search" element={<DashboardSearch role="provider" />} />
              <Route path="inbox" element={<LeadInbox />} />
              <Route path="inbox/:id" element={<LeadDetail />} />
              <Route path="inbox/:id/offer" element={<SendOffer />} />
              <Route path="listings" element={<Listings />} />
              <Route path="listings/new" element={<AddListing />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="calendar" element={<ProviderCalendar />} />
              <Route path="settings" element={<ProviderSettings />} />
            </Route>

            <Route path="/landlord" element={<LandlordLayout />}>
              <Route index element={<LandlordDashboard />} />
              <Route path="search" element={<DashboardSearch role="landlord" />} />
              <Route path="properties" element={<LandlordProperties />} />
              <Route path="properties/new" element={<AddListing />} />
              <Route path="units" element={<LandlordUnits />} />
              <Route path="units/new" element={<LandlordNewUnit />} />
              <Route path="collections" element={<LandlordCollections />} />
              <Route path="payouts" element={<LandlordPayouts />} />
              <Route path="maintenance" element={<LandlordMaintenance />} />
              <Route path="maintenance/new" element={<LandlordNewMaintenanceIssue />} />
              <Route path="calendar" element={<LandlordCalendar />} />
              <Route path="settings" element={<LandlordSettings />} />
            </Route>
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AvatarProvider>
  </QueryClientProvider>
);

export default App;
