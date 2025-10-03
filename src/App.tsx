import { OAuthProvider } from './hooks/useOAuth';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
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
import RequireAdmin from '@/routes/RequireAdmin';
import LoginOAuth from './pages/LoginOAuth';
import AuthCallback from './pages/AuthCallback';
import TestPage from './pages/TestPage';
import SSRTest from './pages/SSRTest';
import BarePage from './pages/BarePage';
import StaticBare from './pages/StaticBare';
import SSRCanary from './pages/SSRCanary';
import AuthErrorBoundary from './components/auth/AuthErrorBoundary';
import * as R from '@/routes/paths';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminPaths from './pages/admin/AdminPaths';
import AdminCourses from './pages/admin/AdminCourses';
import AdminModules from './pages/admin/AdminModules';
import AdminLessons from './pages/admin/AdminLessons';
import Scoreboard from './pages/dashboard/Scoreboard';

const App = () => {
  try {
    return (
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthErrorBoundary>
          <OAuthProvider>
            <Routes>
              <Route path={R.ROOT} element={<Navigate to={R.DASHBOARD} replace />} />
              <Route element={<PublicLayout />}>
                <Route path={R.OLD_HIDDEN} element={<Professionals />} />
                <Route path={R.COMPANIES} element={<Companies />} />
                <Route path={R.INVESTORS} element={<Investors />} />
              </Route>

              <Route path={R.LOGIN} element={<Login />} />
              <Route path={R.SIGNUP} element={<SignUp />} />
              <Route path={R.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={R.UPDATE_PASSWORD} element={<UpdatePassword />} />
              <Route path="/login-oauth" element={<LoginOAuth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              <Route path="/test" element={<TestPage />} />
              <Route path="/ssr-check" element={<SSRTest />} />
              <Route path="/bare" element={<BarePage />} />
              <Route path="/static-bare" element={<StaticBare />} />
              <Route path="/ssr-canary" element={<SSRCanary />} />

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
                <Route path="scoreboard" element={<Scoreboard />} />
                <Route path="learn/course/:courseId" element={<CourseView />} />
                <Route path="learn/path/:pathId" element={<PathOverview />} />
                <Route
                  path="admin"
                  element={
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route path="paths" element={<AdminPaths />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="modules" element={<AdminModules />} />
                  <Route path="lessons" element={<AdminLessons />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </OAuthProvider>
        </AuthErrorBoundary>
      </TooltipProvider>
    );
  } catch (error) {
    console.error('App SSR error:', error);
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1>SSR Error</h1>
        <p>Erro no App principal: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          textAlign: 'left'
        }}>
          {error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    );
  }
};

export default App;
