import { OAuthProvider } from './hooks/useOAuth';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Professionals from "./pages/Professionals";
import Companies from "./pages/Companies";
import Investors from "./pages/Investors";
import NotFound from "./pages/NotFound";
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import DashboardLayout from './pages/dashboard/Layout';
import { UpdatePassword } from './pages/UpdatePassword';
import CourseView from './pages/dashboard/CourseView';
import PathOverview from './pages/dashboard/PathOverview';
import { AvailablePaths } from './components/dashboard/AvailablePaths';
import { PublicLayout } from './pages/PublicLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import { MyLearningPaths } from './components/dashboard/MyLearningPaths';
import Profile from './pages/Profile';
import RequireAuth from '@/routes/RequireAuth';
import LoginOAuth from './pages/LoginOAuth';
import AuthCallback from './pages/AuthCallback';
import * as R from '@/routes/paths';

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OAuthProvider>
          <Routes>
              {/* Public routes with Navbar */}
              <Route element={<PublicLayout />}>
                <Route path={R.ROOT} element={<Professionals />} />
                <Route path={R.COMPANIES} element={<Companies />} />
                <Route path={R.INVESTORS} element={<Investors />} />
              </Route>

              {/* Authentication routes without Navbar */}
              <Route path={R.LOGIN} element={<Login />} />
              <Route path={R.SIGNUP} element={<SignUp />} />
              <Route path={R.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={R.UPDATE_PASSWORD} element={<UpdatePassword />} />
              <Route path="/login-oauth" element={<LoginOAuth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Private routes with Sidebar */}
              <Route
                path={R.DASHBOARD}
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="explore" element={<AvailablePaths />} />
                <Route path="profile" element={<Profile />} />
                <Route path="learn/course/:courseId" element={<CourseView />} />
                <Route path="learn/path/:pathId" element={<PathOverview />} />
              </Route>

              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
