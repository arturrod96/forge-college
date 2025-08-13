import { AuthProvider } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
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
import { MyLearningPaths } from './components/dashboard/MyLearningPaths';
import { AvailablePaths } from './components/dashboard/AvailablePaths';
import { ContinueLearningCard } from './components/dashboard/ContinueLearningCard';
import { UserStats } from './components/dashboard/UserStats';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<Professionals />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={
                  <div className="space-y-6">
                    <ContinueLearningCard />
                    <UserStats />
                  </div>
                } />
                <Route path="my-paths" element={<MyLearningPaths />} />
                <Route path="explore" element={<AvailablePaths />} />
              </Route>
              <Route path="/learn/course/:courseId" element={<CourseView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;