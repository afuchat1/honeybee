import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import OurStory from "./pages/OurStory";
import Programs from "./pages/Programs";
import Vision from "./pages/Vision";
import Impact from "./pages/Impact";
import DailyPrayer from "./pages/DailyPrayer";
import Governance from "./pages/Governance";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProgramsManager from "./pages/admin/ProgramsManager";
import DailyPrayerManager from "./pages/admin/DailyPrayerManager";
import ImpactManager from "./pages/admin/ImpactManager";
import ContactMessages from "./pages/admin/ContactMessages";
import GalleryManager from "./pages/admin/GalleryManager";
import GovernanceManager from "./pages/admin/GovernanceManager";
import UsersManager from "./pages/admin/UsersManager";
import SettingsManager from "./pages/admin/SettingsManager";
import ActivityLogs from "./pages/admin/ActivityLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public website */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/daily-prayer" element={<DailyPrayer />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="programs" element={<ProgramsManager />} />
              <Route path="prayers" element={<DailyPrayerManager />} />
              <Route path="impact" element={<ImpactManager />} />
              <Route path="messages" element={<ContactMessages />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="governance" element={<GovernanceManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="logs" element={<ActivityLogs />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
