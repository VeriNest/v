import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Properties from "./pages/admin/Properties.tsx";
import UsersPage from "./pages/admin/Users.tsx";
import Transactions from "./pages/admin/Transactions.tsx";
import Disputes from "./pages/admin/Disputes.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="disputes" element={<Disputes />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
