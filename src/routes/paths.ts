// Centralized route path constants and labels for the app

// Public routes
export const ROOT = "/";
export const COMPANIES = "/companies";
export const INVESTORS = "/investors";
export const OLD_HIDDEN = "/old/hidden/index";
export const LOGIN = "/login";
export const SIGNUP = "/signup";
export const FORGOT_PASSWORD = "/forgot-password";
export const UPDATE_PASSWORD = "/update-password";

// Dashboard base
export const DASHBOARD = "/dashboard";
export const DASHBOARD_EXPLORE = "/dashboard/explore";
export const DASHBOARD_ADMIN = "/dashboard/admin";

// Dashboard learning routes (builders)
export const DASHBOARD_LEARN_COURSE = (courseId: string) => `/dashboard/learn/course/${courseId}`;
export const DASHBOARD_LEARN_PATH = (pathId: string) => `/dashboard/learn/path/${pathId}`;

// Labels for breadcrumbs and UI
export const ROUTE_LABELS = {
  [DASHBOARD]: "Dashboard",
  [DASHBOARD_EXPLORE]: "Paths",
  [DASHBOARD_ADMIN]: "Admin",
  LEARN: "Learn",
  COURSE: "Course",
  PATH: "Path",
  PROFILE: "My Profile",
  PAGE: "Page",
} as const;
