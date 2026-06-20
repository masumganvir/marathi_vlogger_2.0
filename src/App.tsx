import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import Review from "./pages/Review.tsx";
import Profile from "./pages/Profile.tsx";
import Booking from "./pages/Booking.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import Showcase from "./pages/Showcase.tsx";
import AdminRoute from "@/components/AdminRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import AIChatBot from "@/components/AIChatBot";
import SecurityProvider from "@/components/SecurityProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SecurityProvider>
        <Routes>
          {/* ── Public Routes ─────────────────────────────────── */}
          <Route path="/" element={<Index />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/introduction" element={<Showcase />} />

          {/* ── Protected Routes (auth required) ──────────────── */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={<Booking />}
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thank-you"
            element={
              <ProtectedRoute>
                <ThankYou />
              </ProtectedRoute>
            }
          />

          {/* ── Admin Route (email allowlist + auth) ──────────── */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* ── Clerk SSO Callback ─────────────────────────────── */}
          <Route
            path="/sso-callback"
            element={
              <AuthenticateWithRedirectCallback
                signUpForceRedirectUrl="/profile"
                signInForceRedirectUrl="/profile"
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatBot />
        </SecurityProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
