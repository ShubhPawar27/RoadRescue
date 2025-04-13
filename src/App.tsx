
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderRegister from "./pages/ProviderRegister";
import Services from "./pages/Services";
import ServiceRequest from "./pages/ServiceRequest";
import ActiveRequest from "./pages/ActiveRequest";
import UserRequests from "./pages/UserRequests";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { LocationProvider } from "./contexts/LocationContext";
import { ServiceRequestProvider } from "./contexts/ServiceRequestContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NotificationProvider>
          <LocationProvider>
            <ServiceRequestProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/provider/register" element={<ProviderRegister />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/request" element={<ServiceRequest />} />
                  <Route path="/user/active-request" element={<ActiveRequest />} />
                  <Route path="/user/requests" element={<UserRequests />} />
                  <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/help" element={<Help />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ServiceRequestProvider>
          </LocationProvider>
        </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
