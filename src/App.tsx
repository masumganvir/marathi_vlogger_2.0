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
import AIChatBot from "@/components/AIChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/review" element={<Review />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/introduction" element={<Showcase />} />
          {/* Clerk Callback Route */}
          <Route 
            path="/sso-callback" 
            element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl="/profile" signInForceRedirectUrl="/profile" />} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
