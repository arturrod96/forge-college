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
export const DASHBOARD_SCOREBOARD = "/dashboard/scoreboard";
export const DASHBOARD_ACHIEVEMENTS = "/dashboard/achievements";
export const DASHBOARD_COMMUNITY_PROJECTS = "/dashboard/community-projects";

// Dashboard learning routes (builders)
export const DASHBOARD_LEARN_COURSE = (courseId: string) => `/dashboard/learn/course/${courseId}`;
export const DASHBOARD_LEARN_PATH = (pathId: string) => `/dashboard/learn/path/${pathId}`;

// Labels for breadcrumbs and UI (translation keys)
export const ROUTE_LABELS = {
  [DASHBOARD]: "nav.dashboard",
  [DASHBOARD_EXPLORE]: "nav.paths",
  [DASHBOARD_ADMIN]: "nav.admin",
  [DASHBOARD_SCOREBOARD]: "nav.scoreboard",
  [DASHBOARD_ACHIEVEMENTS]: "nav.achievements",
  [DASHBOARD_COMMUNITY_PROJECTS]: "nav.communityProjects",
  LEARN: "nav.learn",
  COURSE: "nav.course",
  PATH: "nav.path",
  PROFILE: "nav.myProfile",
  PAGE: "nav.page",
} as const;
