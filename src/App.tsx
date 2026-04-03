import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AvatarProvider } from "@/contexts/AvatarContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import Properties from "./pages/admin/Properties.tsx";
import UsersPage from "./pages/admin/Users.tsx";
import Transactions from "./pages/admin/Transactions.tsx";
import Disputes from "./pages/admin/Disputes.tsx";
import AdminSettings from "./pages/admin/Settings.tsx";

// Seeker
import SeekerLayout from "./components/seeker/SeekerLayout.tsx";
import SeekerDashboard from "./pages/seeker/Dashboard.tsx";
import PostNeed from "./pages/seeker/PostNeed.tsx";
import Offers from "./pages/seeker/Offers.tsx";
import Bookings from "./pages/seeker/Bookings.tsx";
import Saved from "./pages/seeker/Saved.tsx";
import SeekerSettings from "./pages/seeker/Settings.tsx";

// Provider
import ProviderLayout from "./components/provider/ProviderLayout.tsx";
import ProviderDashboard from "./pages/provider/Dashboard.tsx";
import LeadInbox from "./pages/provider/Inbox.tsx";
import Listings from "./pages/provider/Listings.tsx";
import Payouts from "./pages/provider/Payouts.tsx";
import ProviderCalendar from "./pages/provider/Calendar.tsx";
import ProviderSettings from "./pages/provider/Settings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AvatarProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Seeker (Tenant) Dashboard */}
          <Route path="/seeker" element={<SeekerLayout />}>
            <Route index element={<SeekerDashboard />} />
            <Route path="post" element={<PostNeed />} />
            <Route path="offers" element={<Offers />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="saved" element={<Saved />} />
            <Route path="settings" element={<SeekerSettings />} />
          </Route>

          {/* Provider (Agent/Landlord) Dashboard */}
          <Route path="/provider" element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="inbox" element={<LeadInbox />} />
            <Route path="listings" element={<Listings />} />
            <Route path="payouts" element={<Payouts />} />
            <Route path="calendar" element={<ProviderCalendar />} />
            <Route path="settings" element={<ProviderSettings />} />
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
