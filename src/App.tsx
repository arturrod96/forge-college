import { AuthProvider } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Professionals from "./pages/Professionals";
import Companies from "./pages/Companies";
import Investors from "./pages/Investors";
import NotFound from "./pages/NotFound";
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { UpdatePassword } from './pages/UpdatePassword';
import { CourseView } from './pages/CourseView';
import { PathOverview } from './pages/PathOverview';
import { AvailablePaths } from './components/dashboard/AvailablePaths';
import { PublicLayout } from './pages/PublicLayout';
import { DashboardHome } from './pages/DashboardHome';
import { MyLearningPaths } from './components/dashboard/MyLearningPaths';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes with Navbar */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Professionals />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
              </Route>

              {/* Private routes with Sidebar */}
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="my-paths" element={<MyLearningPaths />} />
                <Route path="explore" element={<AvailablePaths />} />
                <Route path="learn/course/:courseId" element={<CourseView />} />
                <Route path="learn/path/:pathId" element={<PathOverview />} />
              </Route>

              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
