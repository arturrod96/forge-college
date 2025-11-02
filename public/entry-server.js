var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as React from "react";
import { createContext, useState, useRef, useMemo, useEffect, useContext, Fragment as Fragment$1, useCallback, Component, memo } from "react";
import { FunctionsClient } from "@supabase/functions-js";
import { PostgrestClient } from "@supabase/postgrest-js";
import { RealtimeClient } from "@supabase/realtime-js";
import { StorageClient } from "@supabase/storage-js";
import nodeFetch, { Headers as Headers$1 } from "@supabase/node-fetch";
import { AuthClient } from "@supabase/auth-js";
import "cookie";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, Flame, ArrowRight, Zap, Target, DollarSign, TrendingUp, Code, Briefcase, Trophy, CheckCircle, Users, Coins, BarChart3, PieChart, Shield, Github, Bug, ChevronLeft, ChevronRight, Check, Circle, User, Wallet, LogOut, LayoutDashboard, BookOpen, FolderGit2, Award, Menu, ChevronDown, Play, Bot, ExternalLink, ArrowUpRight, Inbox, FileX, AlertCircle, Search, GraduationCap, Star, Clock, Bell, TrendingDown, ArrowLeft, ChevronUp, Loader2, Mail, Globe, MapPin, Languages, Building, Linkedin, Save, AlertTriangle, RefreshCw, Settings, Layers3, ListChecks, FileText, ShieldCheck, Plus, ArrowUp, ArrowDown, Pencil, Trash2, BookOpenText, Medal, Share2, CheckCircle2, Lock, Sparkles, MessageCircle, Twitter } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2, toast as toast$1 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useLocation, useNavigate, Link, Outlet, useParams, useOutletContext, Navigate, NavLink, Routes, Route } from "react-router-dom";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import ReactMarkdown from "react-markdown";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { formatDistanceToNow } from "date-fns";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useFormContext, FormProvider, Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import MDEditor from "@uiw/react-md-editor";
/* empty css                       */
const common$1 = {
  buttons: {
    login: "Login",
    signIn: "Sign In",
    signUp: "Sign Up",
    cancel: "Cancel",
    "delete": "Delete",
    save: "Save Changes",
    saving: "Saving...",
    loading: "Loading...",
    submit: "Submit",
    tryAgain: "Try Again",
    "continue": "Continue",
    continueLearning: "Continue learning",
    send: "Send",
    edit: "Edit",
    create: "Create",
    update: "Update",
    close: "Close",
    next: "Next",
    previous: "Previous",
    testConnection: "Test Connection",
    testing: "Testing..."
  },
  labels: {
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    country: "Country",
    city: "City",
    languages: "Languages",
    language: "Language",
    user: "User"
  },
  placeholders: {
    email: "m@example.com",
    emailDemo: "demo@example.com",
    enterFullName: "Enter your full name",
    selectCountry: "Select your country",
    enterCity: "Enter your city",
    typeLanguage: "Type a language and press Enter"
  },
  countries: {
    brazil: "Brazil",
    unitedStates: "United States",
    canada: "Canada",
    unitedKingdom: "United Kingdom",
    germany: "Germany",
    france: "France",
    spain: "Spain",
    italy: "Italy",
    netherlands: "Netherlands",
    sweden: "Sweden",
    norway: "Norway",
    denmark: "Denmark",
    finland: "Finland",
    switzerland: "Switzerland",
    austria: "Austria",
    belgium: "Belgium",
    portugal: "Portugal",
    ireland: "Ireland",
    australia: "Australia",
    newZealand: "New Zealand",
    japan: "Japan",
    southKorea: "South Korea",
    singapore: "Singapore",
    india: "India",
    china: "China",
    mexico: "Mexico",
    argentina: "Argentina",
    chile: "Chile",
    colombia: "Colombia",
    peru: "Peru",
    uruguay: "Uruguay",
    paraguay: "Paraguay",
    venezuela: "Venezuela",
    ecuador: "Ecuador",
    bolivia: "Bolivia",
    guyana: "Guyana",
    suriname: "Suriname",
    frenchGuiana: "French Guiana"
  },
  errors: {
    required: "This field is required",
    invalidUrl: "Please enter a valid URL",
    networkError: "Network connection error. Please check your internet connection and try again.",
    unexpectedError: "An unexpected error occurred. Please try again."
  }
};
const nav$1 = {
  forProfessionals: "For Professionals",
  forCompanies: "For Companies",
  forInvestors: "For Investors",
  dashboard: "Dashboard",
  paths: "Paths",
  admin: "Admin",
  scoreboard: "Scoreboard",
  achievements: "Achievements",
  communityProjects: "Community Projects",
  learn: "Learn",
  course: "Course",
  path: "Path",
  myProfile: "My Profile",
  page: "Page"
};
const auth$1 = {
  login: {
    title: "Login",
    submit: "Login",
    ssoGoogle: "Continue with Google",
    ssoGithub: "Continue with GitHub",
    orContinueWith: "Or continue with",
    dontHaveAccount: "Don't have an account?",
    forgotPassword: "Forgot your password?",
    errors: {
      invalidCredentials: "Invalid email or password. Please check your credentials and try again.",
      emailNotConfirmed: "Please check your email and click the confirmation link before signing in.",
      tooManyAttempts: "Too many login attempts. Please wait a moment before trying again.",
      configError: "Authentication service configuration error. Using demo mode - try email: demo@example.com, password: demo123",
      authServiceError: "Authentication service error. The Supabase instance may be misconfigured.",
      cannotConnect: "Cannot connect to authentication service. Please check if Supabase is properly configured.",
      googleFailed: "Google sign-in failed. Please try again.",
      githubFailed: "GitHub sign-in failed. Please try again."
    }
  },
  signup: {
    title: "Create Account",
    submit: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    passwordMismatch: "Passwords do not match",
    success: "Check your email for the confirmation link!",
    notConfigured: "Authentication service not configured. Please contact the administrator."
  },
  forgotPassword: {
    title: "Forgot Password",
    submit: "Send Reset Link",
    rememberedPassword: "Remembered your password?"
  },
  updatePassword: {
    title: "Update Password",
    success: "Password updated successfully! Redirecting to login..."
  },
  logout: {
    button: "Log Out",
    signingOut: "Signing out..."
  }
};
const profile$1 = {
  title: "My Profile",
  subtitle: "Manage your personal and professional information",
  unsavedChanges: "You have unsaved changes",
  loadingProfile: "Loading profile...",
  failedToLoad: "Failed to load profile",
  sections: {
    personal: "Personal Information",
    personalDesc: "Update your basic personal details and contact information",
    professional: "Professional Profile",
    professionalDesc: "Share your work experience, skills, and career information",
    learning: "Learning Progress",
    learningDesc: "Track your learning journey and achievements",
    career: "Career Preferences",
    careerDesc: "Set your job preferences and career goals"
  },
  fields: {
    yearsExperience: "Years of Experience in Technology",
    yearsExperiencePlaceholder: "0",
    positionCompany: "Position & Company",
    positionPlaceholder: "e.g., Senior Backend @ ACME",
    stacksDominated: "Stacks Dominated",
    stacksDesc: "Technologies you're proficient in",
    stacksPlaceholder: "e.g., Java, Python, Solidity, React",
    skillsToDevelop: "Skills to Develop",
    skillsDesc: "Areas you want to improve",
    skillsPlaceholder: "e.g., DeFi, Smart Contracts, Web3",
    linkedinUrl: "LinkedIn URL",
    linkedinPlaceholder: "https://linkedin.com/in/username",
    githubUrl: "GitHub URL",
    githubPlaceholder: "https://github.com/username",
    languagePreference: "Language Preference",
    selectLanguage: "Select your preferred language"
  },
  languageOptions: {
    enUS: "English (US)",
    ptBR: "Portuguese (BR)"
  },
  errors: {
    fullNameRequired: "Full name is required",
    countryRequired: "Country is required",
    invalidLinkedin: "Please enter a valid LinkedIn URL",
    invalidGithub: "Please enter a valid GitHub URL"
  },
  messages: {
    emailNote: "Email can only be changed in your account settings",
    validationError: "Please fix the errors before saving.",
    updateSuccess: "Profile updated successfully!",
    updateError: "Failed to update profile. Please try again."
  },
  comingSoon: {
    title: "Coming Soon",
    learning: "Learning progress tracking will be available in the next update.",
    career: "Career preferences will be available in the next update."
  }
};
const profileDropdown$1 = {
  myAccount: "My Account",
  profile: "Profile",
  admin: "Admin",
  connectWallet: "Connect Wallet"
};
const dashboard$1 = {
  layout: {
    openMenu: "Open menu",
    loading: "Loading dashboard..."
  },
  welcomeBack: "Welcome back",
  loading: "Loading...",
  notFound: "Not found",
  readMore: "Read more",
  readLess: "Read less",
  enrollToStart: "Enroll to start",
  enroll: "Enroll",
  enrolling: "Enrolling...",
  enrolled: "Enrolled",
  viewDetails: "View Details",
  mustLoginToEnroll: "You must be logged in to enroll",
  enrollSuccess: "Successfully enrolled!",
  enrollError: "Failed to enroll",
  loadError: "Failed to load",
  nothingToContinue: "Nothing to continue right now.",
  emptyTitle: "No paths yet",
  emptySubtitle: "Enroll in a path to get started",
  progressSuffix: "complete",
  home: {
    badge: "Welcome back",
    headlineSuffix: ", ready to continue your journey?",
    exploreCta: "View all paths"
  },
  continueLearning: {
    title: "Pick up where you left off",
    subtitle: "You were studying:"
  },
  availablePaths: {
    enrolledBadge: "Enrolled",
    courses_one: "{{count}} course",
    courses_other: "{{count}} courses"
  },
  learningHabits: {
    title: "Study habits",
    currentStreak: "Current streak",
    dayCount_one: "{{count}} day",
    dayCount_other: "{{count}} days",
    keepGoing: "Keep it going daily",
    weeklyGoal: "Weekly goal",
    weekProgress: "{{completed}}/{{goal}} lessons",
    completions_one: "{{count}} completion",
    completions_other: "{{count}} completions",
    loadError: "Failed to load learning habits"
  },
  userStats: {
    totalXp: "Total XP",
    completedLessons: "Completed lessons",
    activePaths: "Active paths",
    studyTime: "Study time",
    studyTimeValue: "{{minutes}} min",
    errors: {
      loadProgress: "Failed to load user progress",
      loadLessons: "Failed to load lessons"
    }
  },
  myLearningPaths: {
    emptyTitle: "You are not enrolled in any path yet.",
    emptySubtitle: "Explore available paths and enroll to get started.",
    progressLabel: "{{progress}}% complete"
  },
  pathOverview: {
    badge: "Path",
    notFound: "Learning path not found.",
    "continue": "Continue",
    courses: "Courses"
  },
  errors: {
    notAuthenticated: "Not authenticated",
    failedToEnroll: "Failed to enroll"
  }
};
const lessons$1 = {
  selectToBegin: "Select a lesson to begin.",
  lessonInfo: "Lesson {{current}} of {{total}} • {{xp}} XP",
  previousLesson: "Previous lesson",
  completeAndContinue: "Complete and Continue",
  markAsCompleted: "Mark as Completed",
  submitAnswer: "Submit Answer",
  loginToTrack: "You need to be logged in to track progress",
  progressSaveFailed: "Failed to save progress",
  lessonCompleted: "Lesson marked as completed!",
  completionError: "Error marking lesson as completed"
};
const admin$1 = {
  layout: {
    kicker: "Admin",
    title: "Content Management",
    subtitle: "Create, organize, and publish learning experiences for the community.",
    nav: {
      overview: "Overview",
      paths: "Learning Paths",
      courses: "Courses",
      modules: "Modules",
      lessons: "Lessons",
      projects: "Projects"
    }
  },
  paths: {
    title: "Learning Paths",
    "new": "New learning path",
    edit: "Edit learning path",
    "delete": "Delete learning path",
    deleteConfirm: 'This action cannot be undone. Deleting a path will remove all associated courses, modules, and lessons. Make sure you really want to remove "{{title}}".',
    created: "Learning path created",
    updated: "Learning path updated",
    deleted: "Learning path deleted",
    validation: {
      titleMin: "Title must have at least 3 characters",
      slugMin: "Slug must have at least 3 characters",
      slugFormat: "Slug must be lowercase with hyphens only"
    }
  },
  courses: {
    title: "Courses",
    "new": "New course",
    edit: "Edit course",
    "delete": "Delete course",
    deleteConfirm: 'This action cannot be undone. Make sure you really want to remove "{{title}}".',
    created: "Course created",
    updated: "Course updated",
    deleted: "Course deleted"
  },
  modules: {
    title: "Modules",
    "new": "New module",
    edit: "Edit module",
    "delete": "Delete module",
    deleteConfirm: 'This action cannot be undone. Make sure you really want to remove "{{title}}".',
    created: "Module created",
    updated: "Module updated",
    deleted: "Module deleted"
  },
  lessons: {
    title: "Lessons",
    "new": "New lesson",
    edit: "Edit lesson",
    "delete": "Delete lesson",
    deleteConfirm: 'This action cannot be undone. Make sure you really want to remove "{{title}}".',
    created: "Lesson created",
    updated: "Lesson updated",
    deleted: "Lesson deleted"
  },
  projects: {
    title: "Projects",
    subtitle: "Link projects to modules to reinforce applied learning at the end of each module.",
    actions: {
      newProject: "New project"
    },
    filters: {
      modulePlaceholder: "Filter by module",
      allModules: "All modules"
    },
    loading: "Loading projects...",
    emptyState: "No projects found for the current filters.",
    unassignedModule: "Unassigned module",
    labels: {
      course: "Course: {{course}}",
      projectNumber: "Project #{{number}}",
      inactive: "Inactive",
      xpValue: "XP {{xp}}"
    },
    markdown: {
      loading: "Loading editor...",
      ariaLabel: "Markdown editor"
    },
    dialog: {
      editTitle: "Edit project",
      createTitle: "Create project",
      description: "Provide details and expectations for the module project."
    },
    form: {
      module: "Module",
      modulePlaceholder: "Select a module",
      title: "Title",
      titlePlaceholder: "Project title",
      description: "Project description",
      descriptionPlaceholder: "Describe the project goals, deliverables, and any resources students should consult. Supports HTML content.",
      descriptionHelp: "You can use HTML to format the content (headings, lists, links, etc.).",
      xpValue: "XP reward",
      xpValuePlaceholder: "Optional XP value",
      xpValueHelp: "Leave empty if this project does not grant XP.",
      activeLabel: "Project visibility",
      activeDescription: "Toggle to hide this project from students while editing."
    },
    validation: {
      moduleRequired: "Select a module",
      titleMin: "Title must have at least 3 characters",
      xpMin: "XP value must be zero or greater"
    },
    notifications: {
      loadError: "Failed to load projects",
      created: "Project created",
      updated: "Project updated",
      saveError: "Failed to save project",
      deleted: "Project deleted",
      deleteError: "Failed to delete project"
    },
    "delete": {
      title: "Delete project",
      description: 'This action cannot be undone. Make sure you really want to remove "{{title}}".',
      confirm: "Delete project"
    }
  }
};
const application$1 = {
  submit: "Submit Application",
  selectTimeline: "Select timeline",
  timelineImmediate: "Immediate (next 30 days)",
  timelineQuarter: "This quarter"
};
const applicationForm$1 = {
  accessibility: {
    close: "Close dialog"
  },
  messages: {
    success: "Thank you for your application! We'll be in touch soon."
  },
  fields: {
    name: "Full name",
    email: "Email address",
    company: "Company / organization",
    experienceLabel: "Current experience level",
    experiencePlaceholder: "Select your level",
    experienceOptions: {
      beginner: "Beginner (0-2 years)",
      intermediate: "Intermediate (2-5 years)",
      advanced: "Advanced (5+ years)"
    },
    portfolio: "Portfolio / LinkedIn URL",
    investmentAmountLabel: "Investment amount range",
    investmentAmountPlaceholder: "Select range",
    investmentAmountOptions: {
      "10k_50k": "$10k - $50k",
      "50k_100k": "$50k - $100k",
      "100k_500k": "$100k - $500k",
      "500k_plus": "$500k+"
    },
    timelineLabel: "Investment timeline",
    timelineOptions: {
      year: "This year",
      exploring: "Just exploring"
    },
    message: "Message",
    messagePlaceholder: "Tell us more about your interest..."
  }
};
const scoreboard$1 = {
  title: "Scoreboard",
  subtitle: "Check out the rankings of students with the most XP",
  global: "Global",
  byPath: "By Path",
  rankingGlobal: "Global Ranking - All Paths",
  ranking: "Ranking - {{pathName}}",
  xp: "XP",
  lessons: "lessons"
};
const achievements$1 = {
  title: "Achievements",
  subtitle: "Complete tasks and earn extra XP to climb the rankings",
  completed: "Completed",
  inProgress: "In Progress",
  xpEarned: "XP Earned",
  xpAvailable: "XP Available",
  xpReward: "XP Reward",
  progress: "Progress",
  all: "All",
  completedBadge: "Completed",
  locked: "Locked",
  overallProgress: "Overall Progress",
  completedOf: "of {{total}} achievements unlocked",
  emptyState: {
    title: "No Achievements Here Yet",
    descriptionAll: "Start your learning journey to unlock achievements and earn XP!",
    descriptionCategory: "Complete tasks in the {{category}} category to unlock achievements here."
  },
  sidebar: {
    overview: "Your Progress",
    nextSuggested: "Suggested Next",
    gettingStarted: "Getting Started",
    keepGoing: "Keep Going!",
    hoverTip: "Hover over any achievement to see detailed information here.",
    inProgressMessage: "You have {{count}} achievements in progress. Great momentum!",
    quickWinsTip: "Start with Profile category achievements for easy wins.",
    halfwayThere: "You're halfway there! Only {{remaining}} more to go.",
    allComplete: "Amazing! You've completed all achievements!"
  },
  categories: {
    community: "Community",
    profile: "Profile",
    learning: "Learning",
    social: "Social"
  },
  tasks: {
    telegramJoin: {
      title: "Join Telegram Group",
      description: "Join our community on Telegram and stay updated with all the news",
      action: "Join Telegram"
    },
    discordJoin: {
      title: "Join Discord",
      description: "Connect with other students and mentors on our Discord server",
      action: "Join Discord"
    },
    firstMessage: {
      title: "First Message",
      description: "Send your first message in any community channel"
    },
    emailVerify: {
      title: "Verify your Email",
      description: "Confirm your email address through the link sent",
      action: "Resend Email"
    },
    completeProfile: {
      title: "Complete your Profile",
      description: "Fill in all your professional profile information",
      action: "Go to Profile"
    },
    githubConnect: {
      title: "Connect your GitHub",
      description: "Link your GitHub account to your profile",
      action: "Connect GitHub"
    },
    linkedinConnect: {
      title: "Connect your LinkedIn",
      description: "Link your LinkedIn account to your profile",
      action: "Connect LinkedIn"
    },
    twitterFollow: {
      title: "Follow on Twitter",
      description: "Follow @ForgeCollege on Twitter to stay updated",
      action: "Follow on Twitter"
    },
    shareProgress: {
      title: "Share your Progress",
      description: "Share your learning journey on social media"
    },
    firstLesson: {
      title: "First Lesson",
      description: "Complete your first lesson in any path"
    },
    weekStreak: {
      title: "7-Day Streak",
      description: "Study for 7 consecutive days"
    },
    completePath: {
      title: "Complete a Path",
      description: "Finish all lessons in a learning path"
    },
    perfectQuiz: {
      title: "Perfect Quiz",
      description: "Score 100% on a quiz"
    }
  }
};
const diagnostics$1 = {
  testPage: {
    title: "🧪 Test Page - Forge College",
    description: "This is a static test page without external dependencies.",
    systemStatus: {
      title: "System status",
      react: "✅ React running",
      typescript: "✅ TypeScript running",
      build: "✅ Build running",
      deploy: "✅ Deployment running",
      ssr: "✅ SSR running (timestamp: {{timestamp}})"
    },
    environment: {
      title: "Environment information (SSR)",
      serverTimestamp: "Server timestamp:",
      noJsMessage: "If you can read this text without JavaScript, SSR is OK."
    },
    clientTest: {
      title: "Client-side JavaScript test",
      instructions: "If JavaScript is working, you will see additional information below:",
      loading: "Loading client information...",
      button: "Test JavaScript"
    },
    alerts: {
      jsWorking: "JavaScript is working!"
    },
    footer: "If you are seeing this page, the issue is not infrastructure related.",
    js: {
      clientReady: "✅ JavaScript running!",
      userAgent: "User agent:",
      url: "URL:",
      clientTimestamp: "Client timestamp:"
    }
  },
  ssrCanary: {
    title: "SSR Canary Test",
    status: "SSR CANARY OK: {{timestamp}}",
    instructions: "If you can see this text, SSR is working.",
    timestamp: "Timestamp: {{timestamp}}",
    renderMode: "This page renders static HTML on the server.",
    runtime: "Runtime: Node.js",
    dynamicMode: "Dynamic: force-dynamic"
  },
  staticBare: {
    title: "Static Bare SSR Test",
    status: "STATIC BARE SSR OK: {{timestamp}}",
    instructions: "If you can see this text, SSR is working.",
    timestamp: "Timestamp: {{timestamp}}",
    renderMode: "This page renders static HTML on the server."
  }
};
const projects$1 = {
  errors: {
    loginRequired: "You need to be logged in to submit projects.",
    required: "Enter the GitHub repository URL.",
    invalidUrl: "Enter a valid URL.",
    githubOnly: "Please submit a GitHub repository link.",
    submitFailed: "Could not submit the project. Try again."
  },
  notifications: {
    fetchError: "Failed to load your project submissions.",
    submitError: "Failed to submit project.",
    submitted: "Project submitted! Great job applying your knowledge.",
    updated: "Project submission updated."
  },
  module: {
    title: "Module projects: {{module}}",
    subtitle: "Apply what you learned in this module by completing one of the projects below.",
    noProjects: "This module does not have projects yet.",
    communityLink: "See community submissions",
    projectOrder: "Project #{{order}}",
    xpValue: "XP {{xp}}",
    startProject: "Start project",
    updateSubmission: "Update submission",
    yourSubmission: "Your submission:",
    dialog: {
      title: "Project: {{project}}",
      subtitle: "Review the description and submit your GitHub repository link.",
      repositoryLabel: "GitHub repository URL",
      repositoryPlaceholder: "https://github.com/username/repository",
      repositoryHelp: "Share a public GitHub repository showcasing your implementation.",
      submitting: "Submitting...",
      submit: "Submit project"
    }
  },
  community: {
    loadError: "Failed to load community projects.",
    loading: "Loading community projects...",
    title: "Community Projects",
    subtitle: "Check what other students are building and get inspired.",
    empty: "No community submissions yet. Be the first to share your solution!",
    courseLabel: "Course: {{course}}",
    unknownCourse: "Unassigned course",
    projectCount: "Projects: {{count}}",
    projectOrder: "Project #{{order}}",
    xpValue: "XP {{xp}}",
    noSubmissions: "No submissions yet.",
    submissions: "Submissions: {{count}}",
    visitRepository: "View repository",
    submittedBy: "Submitted by {{user}} · {{date}}",
    anonymous: "Anonymous",
    dateUnknown: "Date unknown"
  }
};
const errorBoundary$1 = {
  title: "Something went wrong",
  description: "An unexpected error occurred. Please reload the page.",
  reload: "Reload page",
  detailsTitle: "Error details (development)"
};
const enUS = {
  common: common$1,
  nav: nav$1,
  auth: auth$1,
  profile: profile$1,
  profileDropdown: profileDropdown$1,
  dashboard: dashboard$1,
  lessons: lessons$1,
  admin: admin$1,
  application: application$1,
  applicationForm: applicationForm$1,
  scoreboard: scoreboard$1,
  achievements: achievements$1,
  diagnostics: diagnostics$1,
  projects: projects$1,
  errorBoundary: errorBoundary$1
};
const common = {
  buttons: {
    login: "Entrar",
    signIn: "Entrar",
    signUp: "Cadastrar",
    cancel: "Cancelar",
    "delete": "Excluir",
    save: "Salvar Alterações",
    saving: "Salvando...",
    loading: "Carregando...",
    submit: "Enviar",
    tryAgain: "Tentar Novamente",
    "continue": "Continuar",
    continueLearning: "Continuar aprendendo",
    send: "Enviar",
    edit: "Editar",
    create: "Criar",
    update: "Atualizar",
    close: "Fechar",
    next: "Próximo",
    previous: "Anterior",
    testConnection: "Testar Conexão",
    testing: "Testando..."
  },
  labels: {
    email: "E-mail",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    fullName: "Nome Completo",
    country: "País",
    city: "Cidade",
    languages: "Idiomas",
    language: "Idioma",
    user: "Usuário"
  },
  placeholders: {
    email: "m@exemplo.com",
    emailDemo: "demo@exemplo.com",
    enterFullName: "Digite seu nome completo",
    selectCountry: "Selecione seu país",
    enterCity: "Digite sua cidade",
    typeLanguage: "Digite um idioma e pressione Enter"
  },
  errors: {
    required: "Este campo é obrigatório",
    invalidUrl: "Por favor, insira uma URL válida",
    networkError: "Erro de conexão de rede. Por favor, verifique sua conexão com a internet e tente novamente.",
    unexpectedError: "Ocorreu um erro inesperado. Por favor, tente novamente."
  }
};
const nav = {
  forProfessionals: "Para Profissionais",
  forCompanies: "Para Empresas",
  forInvestors: "Para Investidores",
  dashboard: "Painel",
  paths: "Trilhas",
  admin: "Admin",
  scoreboard: "Placar",
  achievements: "Conquistas",
  communityProjects: "Projetos da Comunidade",
  learn: "Aprender",
  course: "Curso",
  path: "Trilha",
  myProfile: "Meu Perfil",
  page: "Página"
};
const auth = {
  login: {
    title: "Entrar",
    submit: "Entrar",
    ssoGoogle: "Continuar com Google",
    ssoGithub: "Continuar com GitHub",
    orContinueWith: "Ou continue com",
    dontHaveAccount: "Não tem uma conta?",
    forgotPassword: "Esqueceu sua senha?",
    errors: {
      invalidCredentials: "E-mail ou senha inválidos. Por favor, verifique suas credenciais e tente novamente.",
      emailNotConfirmed: "Por favor, verifique seu e-mail e clique no link de confirmação antes de fazer login.",
      tooManyAttempts: "Muitas tentativas de login. Por favor, aguarde um momento antes de tentar novamente.",
      configError: "Erro de configuração do serviço de autenticação. Usando modo demo - tente e-mail: demo@exemplo.com, senha: demo123",
      authServiceError: "Erro no serviço de autenticação. A instância do Supabase pode estar mal configurada.",
      cannotConnect: "Não foi possível conectar ao serviço de autenticação. Por favor, verifique se o Supabase está configurado corretamente.",
      googleFailed: "Login com Google falhou. Por favor, tente novamente.",
      githubFailed: "Login com GitHub falhou. Por favor, tente novamente."
    }
  },
  signup: {
    title: "Criar Conta",
    submit: "Cadastrar",
    alreadyHaveAccount: "Já tem uma conta?",
    passwordMismatch: "As senhas não coincidem",
    success: "Verifique seu e-mail para o link de confirmação!",
    notConfigured: "Serviço de autenticação não configurado. Por favor, contate o administrador."
  },
  forgotPassword: {
    title: "Esqueci a Senha",
    submit: "Enviar Link de Redefinição",
    rememberedPassword: "Lembrou sua senha?"
  },
  updatePassword: {
    title: "Atualizar Senha",
    success: "Senha atualizada com sucesso! Redirecionando para o login..."
  },
  logout: {
    button: "Sair",
    signingOut: "Saindo..."
  }
};
const profile = {
  title: "Meu Perfil",
  subtitle: "Gerencie suas informações pessoais e profissionais",
  unsavedChanges: "Você tem alterações não salvas",
  loadingProfile: "Carregando perfil...",
  failedToLoad: "Falha ao carregar perfil",
  sections: {
    personal: "Informações Pessoais",
    personalDesc: "Atualize seus dados pessoais básicos e informações de contato",
    professional: "Perfil Profissional",
    professionalDesc: "Compartilhe sua experiência de trabalho, habilidades e informações de carreira",
    learning: "Progresso de Aprendizado",
    learningDesc: "Acompanhe sua jornada de aprendizado e conquistas",
    career: "Preferências de Carreira",
    careerDesc: "Defina suas preferências de trabalho e objetivos de carreira"
  },
  fields: {
    yearsExperience: "Anos de Experiência em Tecnologia",
    positionCompany: "Cargo e Empresa",
    positionPlaceholder: "ex: Desenvolvedor Sênior @ ACME",
    stacksDominated: "Stacks Dominadas",
    stacksDesc: "Tecnologias nas quais você é proficiente",
    stacksPlaceholder: "ex: Java, Python, Solidity, React",
    skillsToDevelop: "Habilidades a Desenvolver",
    skillsDesc: "Áreas que você quer melhorar",
    skillsPlaceholder: "ex: DeFi, Smart Contracts, Web3",
    linkedinUrl: "URL do LinkedIn",
    linkedinPlaceholder: "https://linkedin.com/in/usuario",
    githubUrl: "URL do GitHub",
    githubPlaceholder: "https://github.com/usuario",
    languagePreference: "Preferência de Idioma",
    selectLanguage: "Selecione seu idioma preferido"
  },
  errors: {
    fullNameRequired: "Nome completo é obrigatório",
    countryRequired: "País é obrigatório",
    invalidLinkedin: "Por favor, insira uma URL válida do LinkedIn",
    invalidGithub: "Por favor, insira uma URL válida do GitHub"
  },
  messages: {
    emailNote: "O e-mail só pode ser alterado nas configurações da conta",
    validationError: "Por favor, corrija os erros antes de salvar.",
    updateSuccess: "Perfil atualizado com sucesso!",
    updateError: "Falha ao atualizar perfil. Por favor, tente novamente."
  },
  comingSoon: {
    title: "Em Breve",
    learning: "O acompanhamento do progresso de aprendizado estará disponível na próxima atualização.",
    career: "As preferências de carreira estarão disponíveis na próxima atualização."
  }
};
const profileDropdown = {
  myAccount: "Minha Conta",
  profile: "Perfil",
  admin: "Admin",
  connectWallet: "Conectar Carteira"
};
const dashboard = {
  layout: {
    openMenu: "Abrir menu",
    loading: "Carregando painel..."
  },
  welcomeBack: "Bem-vindo de volta",
  loading: "Carregando...",
  notFound: "Não encontrado",
  readMore: "Ler mais",
  readLess: "Ler menos",
  enrollToStart: "Inscreva-se para começar",
  enroll: "Inscrever",
  enrolling: "Inscrevendo...",
  enrolled: "Inscrito",
  viewDetails: "Ver Detalhes",
  mustLoginToEnroll: "Você deve estar logado para se inscrever",
  enrollSuccess: "Inscrito com sucesso!",
  enrollError: "Falha ao inscrever",
  loadError: "Falha ao carregar",
  nothingToContinue: "Nada para continuar agora.",
  emptyTitle: "Sem trilhas ainda",
  emptySubtitle: "Inscreva-se em uma trilha para começar",
  progressSuffix: "completo",
  home: {
    badge: "Bem-vindo de volta",
    headlineSuffix: ", pronto para continuar sua jornada?",
    exploreCta: "Ver todas as trilhas"
  },
  continueLearning: {
    title: "Retome de onde parou",
    subtitle: "Você estava estudando:"
  },
  availablePaths: {
    enrolledBadge: "Inscrito",
    courses_one: "{{count}} curso",
    courses_other: "{{count}} cursos"
  },
  learningHabits: {
    title: "Hábitos de estudo",
    currentStreak: "Sequência atual",
    dayCount_one: "{{count}} dia",
    dayCount_other: "{{count}} dias",
    keepGoing: "Mantenha o ritmo diariamente",
    weeklyGoal: "Meta semanal",
    weekProgress: "{{completed}}/{{goal}} lições",
    completions_one: "{{count}} conclusão",
    completions_other: "{{count}} conclusões",
    loadError: "Falha ao carregar hábitos de aprendizado"
  },
  userStats: {
    totalXp: "XP total",
    completedLessons: "Lições concluídas",
    activePaths: "Trilhas ativas",
    studyTime: "Tempo de estudo",
    studyTimeValue: "{{minutes}} min",
    errors: {
      loadProgress: "Falha ao carregar progresso do usuário",
      loadLessons: "Falha ao carregar lições"
    }
  },
  myLearningPaths: {
    emptyTitle: "Você ainda não está inscrito em nenhuma trilha.",
    emptySubtitle: "Explore as trilhas disponíveis e inscreva-se para começar.",
    progressLabel: "{{progress}}% concluído"
  },
  pathOverview: {
    badge: "Trilha",
    notFound: "Trilha de aprendizado não encontrada.",
    "continue": "Continuar",
    courses: "Cursos"
  },
  errors: {
    notAuthenticated: "Não autenticado",
    failedToEnroll: "Falha ao inscrever"
  }
};
const lessons = {
  selectToBegin: "Selecione uma lição para começar.",
  lessonInfo: "Lição {{current}} de {{total}} • {{xp}} XP",
  previousLesson: "Lição anterior",
  completeAndContinue: "Completar e Continuar",
  markAsCompleted: "Marcar como Concluído",
  submitAnswer: "Enviar Resposta",
  loginToTrack: "Você precisa estar logado para acompanhar o progresso",
  progressSaveFailed: "Falha ao salvar progresso",
  lessonCompleted: "Lição marcada como concluída!",
  completionError: "Erro ao marcar lição como concluída"
};
const admin = {
  layout: {
    kicker: "Admin",
    title: "Gestão de Conteúdo",
    subtitle: "Crie, organize e publique experiências de aprendizado para a comunidade.",
    nav: {
      overview: "Visão geral",
      paths: "Trilhas",
      courses: "Cursos",
      modules: "Módulos",
      lessons: "Lições",
      projects: "Projetos"
    }
  },
  paths: {
    title: "Trilhas de Aprendizado",
    "new": "Nova trilha de aprendizado",
    edit: "Editar trilha de aprendizado",
    "delete": "Excluir trilha de aprendizado",
    deleteConfirm: 'Esta ação não pode ser desfeita. Excluir uma trilha removerá todos os cursos, módulos e lições associados. Tem certeza de que deseja remover "{{title}}"?',
    created: "Trilha de aprendizado criada",
    updated: "Trilha de aprendizado atualizada",
    deleted: "Trilha de aprendizado excluída",
    validation: {
      titleMin: "O título deve ter pelo menos 3 caracteres",
      slugMin: "O slug deve ter pelo menos 3 caracteres",
      slugFormat: "O slug deve ser minúsculo apenas com hífens"
    }
  },
  courses: {
    title: "Cursos",
    "new": "Novo curso",
    edit: "Editar curso",
    "delete": "Excluir curso",
    deleteConfirm: 'Esta ação não pode ser desfeita. Tem certeza de que deseja remover "{{title}}"?',
    created: "Curso criado",
    updated: "Curso atualizado",
    deleted: "Curso excluído"
  },
  modules: {
    title: "Módulos",
    "new": "Novo módulo",
    edit: "Editar módulo",
    "delete": "Excluir módulo",
    deleteConfirm: 'Esta ação não pode ser desfeita. Tem certeza de que deseja remover "{{title}}"?',
    created: "Módulo criado",
    updated: "Módulo atualizado",
    deleted: "Módulo excluído"
  },
  lessons: {
    title: "Lições",
    "new": "Nova lição",
    edit: "Editar lição",
    "delete": "Excluir lição",
    deleteConfirm: 'Esta ação não pode ser desfeita. Tem certeza de que deseja remover "{{title}}"?',
    created: "Lição criada",
    updated: "Lição atualizada",
    deleted: "Lição excluída"
  },
  projects: {
    title: "Projetos",
    subtitle: "Associe projetos aos módulos para reforçar o aprendizado aplicado ao final de cada módulo.",
    actions: {
      newProject: "Novo projeto"
    },
    filters: {
      modulePlaceholder: "Filtrar por módulo",
      allModules: "Todos os módulos"
    },
    loading: "Carregando projetos...",
    emptyState: "Nenhum projeto encontrado para os filtros atuais.",
    unassignedModule: "Módulo sem atribuição",
    labels: {
      course: "Curso: {{course}}",
      projectNumber: "Projeto #{{number}}",
      inactive: "Inativo",
      xpValue: "XP {{xp}}"
    },
    markdown: {
      loading: "Carregando editor...",
      ariaLabel: "Editor de Markdown"
    },
    dialog: {
      editTitle: "Editar projeto",
      createTitle: "Criar projeto",
      description: "Descreva expectativas e orientações para o projeto do módulo."
    },
    form: {
      module: "Módulo",
      modulePlaceholder: "Selecione um módulo",
      title: "Título",
      titlePlaceholder: "Título do projeto",
      description: "Descrição do projeto",
      descriptionPlaceholder: "Descreva objetivos, entregáveis e recursos que os estudantes devem consultar. Suporta conteúdo HTML.",
      descriptionHelp: "Você pode usar HTML para formatar o conteúdo (títulos, listas, links, etc.).",
      xpValue: "Recompensa de XP",
      xpValuePlaceholder: "XP opcional",
      xpValueHelp: "Deixe em branco se este projeto não conceder XP.",
      activeLabel: "Visibilidade do projeto",
      activeDescription: "Use para ocultar o projeto dos alunos enquanto realiza ajustes."
    },
    validation: {
      moduleRequired: "Selecione um módulo",
      titleMin: "O título deve ter pelo menos 3 caracteres",
      xpMin: "O XP deve ser zero ou maior"
    },
    notifications: {
      loadError: "Falha ao carregar projetos",
      created: "Projeto criado",
      updated: "Projeto atualizado",
      saveError: "Falha ao salvar projeto",
      deleted: "Projeto excluído",
      deleteError: "Falha ao excluir projeto"
    },
    "delete": {
      title: "Excluir projeto",
      description: 'Esta ação não pode ser desfeita. Tem certeza de que deseja remover "{{title}}"?',
      confirm: "Excluir projeto"
    }
  }
};
const application = {
  submit: "Enviar Inscrição",
  selectTimeline: "Selecionar prazo",
  timelineImmediate: "Imediato (próximos 30 dias)",
  timelineQuarter: "Este trimestre"
};
const applicationForm = {
  accessibility: {
    close: "Fechar janela"
  },
  messages: {
    success: "Obrigado pela sua aplicação! Entraremos em contato em breve."
  },
  fields: {
    name: "Nome completo",
    email: "Endereço de e-mail",
    company: "Empresa / organização",
    experienceLabel: "Nível de experiência atual",
    experiencePlaceholder: "Selecione seu nível",
    experienceOptions: {
      beginner: "Iniciante (0-2 anos)",
      intermediate: "Intermediário (2-5 anos)",
      advanced: "Avançado (5+ anos)"
    },
    portfolio: "URL do portfólio / LinkedIn",
    investmentAmountLabel: "Faixa de investimento",
    investmentAmountPlaceholder: "Selecione a faixa",
    investmentAmountOptions: {
      "10k_50k": "$10k - $50k",
      "50k_100k": "$50k - $100k",
      "100k_500k": "$100k - $500k",
      "500k_plus": "$500k+"
    },
    timelineLabel: "Prazo de investimento",
    timelineOptions: {
      year: "Este ano",
      exploring: "Apenas explorando"
    },
    message: "Mensagem",
    messagePlaceholder: "Conte-nos mais sobre o seu interesse..."
  }
};
const scoreboard = {
  title: "Scoreboard",
  subtitle: "Confira os rankings dos estudantes com maior XP",
  global: "Global",
  byPath: "Por Path",
  rankingGlobal: "Ranking Global - Todos os Paths",
  ranking: "Ranking - {{pathName}}",
  xp: "XP",
  lessons: "lições"
};
const achievements = {
  title: "Achievements",
  subtitle: "Complete tarefas e ganhe XP extra para subir no ranking",
  completed: "Concluídos",
  inProgress: "Em Progresso",
  xpEarned: "XP Ganho",
  xpAvailable: "XP Disponível",
  progress: "Progresso",
  all: "Todos",
  completedBadge: "✓ Concluído",
  locked: "🔒 Bloqueado",
  categories: {
    community: "Comunidade",
    profile: "Perfil",
    learning: "Aprendizado",
    social: "Social"
  },
  tasks: {
    telegramJoin: {
      title: "Entre no Grupo Telegram",
      description: "Junte-se à nossa comunidade no Telegram e fique por dentro de todas as novidades",
      action: "Entrar no Telegram"
    },
    discordJoin: {
      title: "Entre no Discord",
      description: "Conecte-se com outros estudantes e mentores no nosso servidor Discord",
      action: "Entrar no Discord"
    },
    firstMessage: {
      title: "Primeira Mensagem",
      description: "Envie sua primeira mensagem em qualquer canal da comunidade"
    },
    emailVerify: {
      title: "Verifique seu Email",
      description: "Confirme seu endereço de email através do link enviado",
      action: "Reenviar Email"
    },
    completeProfile: {
      title: "Complete seu Perfil",
      description: "Preencha todas as informações do seu perfil profissional",
      action: "Ir para Perfil"
    },
    githubConnect: {
      title: "Conecte seu GitHub",
      description: "Vincule sua conta do GitHub ao seu perfil",
      action: "Conectar GitHub"
    },
    linkedinConnect: {
      title: "Conecte seu LinkedIn",
      description: "Vincule sua conta do LinkedIn ao seu perfil",
      action: "Conectar LinkedIn"
    },
    twitterFollow: {
      title: "Siga no Twitter",
      description: "Siga @ForgeCollege no Twitter para ficar atualizado",
      action: "Seguir no Twitter"
    },
    shareProgress: {
      title: "Compartilhe seu Progresso",
      description: "Compartilhe sua jornada de aprendizado nas redes sociais"
    },
    firstLesson: {
      title: "Primeira Lição",
      description: "Complete sua primeira lição em qualquer path"
    },
    weekStreak: {
      title: "Sequência de 7 Dias",
      description: "Estude por 7 dias consecutivos"
    },
    completePath: {
      title: "Complete um Path",
      description: "Finalize todas as lições de um learning path"
    },
    perfectQuiz: {
      title: "Quiz Perfeito",
      description: "Acerte 100% das questões em um quiz"
    }
  }
};
const diagnostics = {
  testPage: {
    title: "🧪 Página de Teste - Forge College",
    description: "Esta é uma página de teste estática sem dependências externas.",
    systemStatus: {
      title: "Status do sistema",
      react: "✅ React funcionando",
      typescript: "✅ TypeScript funcionando",
      build: "✅ Build funcionando",
      deploy: "✅ Deploy funcionando",
      ssr: "✅ SSR funcionando (timestamp: {{timestamp}})"
    },
    environment: {
      title: "Informações do ambiente (SSR)",
      serverTimestamp: "Timestamp do servidor:",
      noJsMessage: "Se você vê este texto sem JavaScript, o SSR está OK."
    },
    clientTest: {
      title: "Teste de JavaScript (client-side)",
      instructions: "Se o JavaScript estiver funcionando, você verá informações adicionais abaixo:",
      loading: "Carregando informações do cliente...",
      button: "Testar JavaScript"
    },
    alerts: {
      jsWorking: "JavaScript está funcionando!"
    },
    footer: "Se você está vendo esta página, o problema não é de infraestrutura.",
    js: {
      clientReady: "✅ JavaScript funcionando!",
      userAgent: "User agent:",
      url: "URL:",
      clientTimestamp: "Timestamp do cliente:"
    }
  },
  ssrCanary: {
    title: "Teste Canary de SSR",
    status: "SSR CANARY OK: {{timestamp}}",
    instructions: "Se você vê este texto, o SSR está funcionando.",
    timestamp: "Timestamp: {{timestamp}}",
    renderMode: "Esta página renderiza HTML estático no servidor.",
    runtime: "Runtime: Node.js",
    dynamicMode: "Dinâmico: force-dynamic"
  },
  staticBare: {
    title: "Teste Static Bare SSR",
    status: "STATIC BARE SSR OK: {{timestamp}}",
    instructions: "Se você vê este texto, o SSR está funcionando.",
    timestamp: "Timestamp: {{timestamp}}",
    renderMode: "Esta página renderiza HTML estático no servidor."
  }
};
const projects = {
  errors: {
    loginRequired: "Você precisa estar logado para enviar projetos.",
    required: "Informe a URL do repositório no GitHub.",
    invalidUrl: "Insira uma URL válida.",
    githubOnly: "Envie um link de repositório do GitHub.",
    submitFailed: "Não foi possível enviar o projeto. Tente novamente."
  },
  notifications: {
    fetchError: "Falha ao carregar seus envios de projeto.",
    submitError: "Falha ao enviar projeto.",
    submitted: "Projeto enviado! Excelente aplicação do que você aprendeu.",
    updated: "Envio do projeto atualizado."
  },
  module: {
    title: "Projetos do módulo: {{module}}",
    subtitle: "Coloque em prática o que aprendeu neste módulo completando um dos projetos abaixo.",
    noProjects: "Este módulo ainda não possui projetos.",
    communityLink: "Ver envios da comunidade",
    projectOrder: "Projeto #{{order}}",
    xpValue: "XP {{xp}}",
    startProject: "Iniciar projeto",
    updateSubmission: "Atualizar envio",
    yourSubmission: "Seu envio:",
    dialog: {
      title: "Projeto: {{project}}",
      subtitle: "Revise a descrição e envie o link do seu repositório no GitHub.",
      repositoryLabel: "URL do repositório no GitHub",
      repositoryPlaceholder: "https://github.com/usuario/repositorio",
      repositoryHelp: "Compartilhe um repositório público no GitHub mostrando sua implementação.",
      submitting: "Enviando...",
      submit: "Enviar projeto"
    }
  },
  community: {
    loadError: "Falha ao carregar projetos da comunidade.",
    loading: "Carregando projetos da comunidade...",
    title: "Projetos da Comunidade",
    subtitle: "Veja o que outros estudantes estão construindo e inspire-se.",
    empty: "Ainda não há envios da comunidade. Seja o primeiro a compartilhar sua solução!",
    courseLabel: "Curso: {{course}}",
    unknownCourse: "Curso não atribuído",
    projectCount: "Projetos: {{count}}",
    projectOrder: "Projeto #{{order}}",
    xpValue: "XP {{xp}}",
    noSubmissions: "Nenhum envio ainda.",
    submissions: "Envios: {{count}}",
    visitRepository: "Ver repositório",
    submittedBy: "Enviado por {{user}} · {{date}}",
    anonymous: "Anônimo",
    dateUnknown: "Data desconhecida"
  }
};
const errorBoundary = {
  title: "Algo deu errado",
  description: "Ocorreu um erro inesperado. Por favor, recarregue a página.",
  reload: "Recarregar página",
  detailsTitle: "Detalhes do erro (desenvolvimento)"
};
const ptBR = {
  common,
  nav,
  auth,
  profile,
  profileDropdown,
  dashboard,
  lessons,
  admin,
  application,
  applicationForm,
  scoreboard,
  achievements,
  diagnostics,
  projects,
  errorBoundary
};
const LANGUAGE_COOKIE = "app_language";
const getLanguageFromCookie = () => {
  const cookies = document.cookie.split(";");
  const langCookie = cookies.find((cookie) => cookie.trim().startsWith(`${LANGUAGE_COOKIE}=`));
  return langCookie ? langCookie.split("=")[1] : "en-US";
};
const saveLanguageToCookie = (language) => {
  const expires = /* @__PURE__ */ new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${LANGUAGE_COOKIE}=${language};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};
i18n.use(initReactI18next).init({
  resources: {
    "en-US": { translation: enUS },
    "pt-BR": { translation: ptBR }
  },
  lng: getLanguageFromCookie(),
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false
  }
});
i18n.on("languageChanged", (lng) => {
  saveLanguageToCookie(lng);
});
const version = "2.56.0";
let JS_ENV = "";
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
} else if (typeof document !== "undefined") {
  JS_ENV = "web";
} else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  JS_ENV = "react-native";
} else {
  JS_ENV = "node";
}
const DEFAULT_HEADERS = { "X-Client-Info": `supabase-js-${JS_ENV}/${version}` };
const DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS
};
const DEFAULT_DB_OPTIONS = {
  schema: "public"
};
const DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
const DEFAULT_REALTIME_OPTIONS = {};
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = nodeFetch;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return Headers$1;
  }
  return Headers;
};
const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
  const fetch2 = resolveFetch(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init) => __awaiter$2(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey);
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch2(input, Object.assign(Object.assign({}, init), { headers }));
  });
};
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
function applySettingDefaults(options, defaults) {
  var _a, _b;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  const result = {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    storage: {},
    global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS2 === null || DEFAULT_GLOBAL_OPTIONS2 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS2.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
    accessToken: () => __awaiter$1(this, void 0, void 0, function* () {
      return "";
    })
  };
  if (options.accessToken) {
    result.accessToken = options.accessToken;
  } else {
    delete result.accessToken;
  }
  return result;
}
class SupabaseAuthClient extends AuthClient {
  constructor(options) {
    super(options);
  }
}
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.storage Options passed along to the storage-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    var _a, _b, _c;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = ensureTrailingSlash(supabaseUrl);
    const baseUrl = new URL(_supabaseUrl);
    this.realtimeUrl = new URL("realtime/v1", baseUrl);
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
    this.authUrl = new URL("auth/v1", baseUrl);
    this.storageUrl = new URL("storage/v1", baseUrl);
    this.functionsUrl = new URL("functions/v1", baseUrl);
    const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
    this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
    if (!settings.accessToken) {
      this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
    } else {
      this.accessToken = settings.accessToken;
      this.auth = new Proxy({}, {
        get: (_, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        }
      });
    }
    this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
    this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
      headers: this.headers,
      schema: settings.db.schema,
      fetch: this.fetch
    });
    this.storage = new StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
    if (!settings.accessToken) {
      this._listenForAuthEvents();
    }
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    return this.rest.from(relation);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.schema
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return this.rest.schema(schema);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.rpc
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, options = {}) {
    return this.rest.rpc(fn, args, options);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (this.accessToken) {
        return yield this.accessToken();
      }
      const { data } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug }, headers, fetch2) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl.href,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      lock,
      debug,
      fetch: fetch2,
      // auth checks if there is a custom authorizaiton header using this flag
      // so it knows whether to return an error when getUser is called with no session
      hasCustomAuthorizationHeader: "Authorization" in this.headers
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
      this.changedAccessToken = token;
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth();
      if (source == "STORAGE")
        this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
}
const createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};
function shouldShowDeprecationWarning() {
  if (typeof window !== "undefined") {
    return false;
  }
  if (typeof process === "undefined") {
    return false;
  }
  const processVersion = process["version"];
  if (processVersion === void 0 || processVersion === null) {
    return false;
  }
  const versionMatch = processVersion.match(/^v(\d+)\./);
  if (!versionMatch) {
    return false;
  }
  const majorVersion = parseInt(versionMatch[1], 10);
  return majorVersion <= 18;
}
if (shouldShowDeprecationWarning()) {
  console.warn(`⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217`);
}
const TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
const IGNORE_BASE64URL = " 	\n\r=".split("");
(() => {
  const charMap = new Array(128);
  for (let i = 0; i < charMap.length; i += 1) {
    charMap[i] = -1;
  }
  for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
    charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
  }
  for (let i = 0; i < TO_BASE64URL.length; i += 1) {
    charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
  }
  return charMap;
})();
const getSupabaseConfig = () => {
  const url = "https://fdeblavnrrnoyqivydsg.supabase.co";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI";
  {
    return { url, anonKey };
  }
};
let supabaseConfig;
try {
  supabaseConfig = getSupabaseConfig();
} catch (error) {
  console.error("Supabase config error:", error);
  throw error;
}
let browserClient = null;
function createClientBrowser() {
  if (browserClient) return browserClient;
  const { url, anonKey } = supabaseConfig;
  browserClient = createClient(
    url,
    anonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        debug: process.env.NODE_ENV === "development"
      },
      global: {
        headers: {
          "X-Client-Info": "forge-college-web"
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  );
  return browserClient;
}
const AuthContext = createContext(void 0);
function OAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Starting sign out process...");
      const { error } = await supabase2.auth.signOut();
      if (error) throw error;
      console.log("Supabase sign out successful");
      setUser(null);
      setSession(null);
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("supabase.auth.refreshToken");
      const googleTokens = Object.keys(localStorage).filter(
        (key) => key.includes("google") || key.includes("oauth") || key.includes("auth")
      );
      googleTokens.forEach((key) => {
        console.log("Removing Google/OAuth token:", key);
        localStorage.removeItem(key);
      });
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + (/* @__PURE__ */ new Date()).toUTCString() + ";path=/");
      });
      sessionStorage.clear();
      console.log("Local storage cleared, redirecting...");
      window.location.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setUser(null);
      setSession(null);
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data: { session: session2 }, error } = await supabase2.auth.getSession();
      if (error) throw error;
      setSession(session2);
      setUser((session2 == null ? void 0 : session2.user) ?? null);
    } catch (error) {
      console.error("Error refreshing session:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    mountedRef.current = true;
    const initializeAuth = async () => {
      try {
        const { data: { session: session2 }, error } = await supabase2.auth.getSession();
        if (error) throw error;
        if (mountedRef.current) {
          setSession(session2);
          setUser((session2 == null ? void 0 : session2.user) ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };
    initializeAuth();
    const { data: { subscription } } = supabase2.auth.onAuthStateChange(
      async (event, session2) => {
        var _a, _b, _c;
        if (!mountedRef.current) return;
        console.log("Auth state changed:", event, (_a = session2 == null ? void 0 : session2.user) == null ? void 0 : _a.email, "Provider:", (_c = (_b = session2 == null ? void 0 : session2.user) == null ? void 0 : _b.app_metadata) == null ? void 0 : _c.provider);
        switch (event) {
          case "SIGNED_IN":
          case "TOKEN_REFRESHED":
          case "INITIAL_SESSION":
            if (session2 == null ? void 0 : session2.user) {
              setSession(session2);
              setUser(session2.user);
              setLoading(false);
            }
            break;
          case "SIGNED_OUT":
            setSession(null);
            setUser(null);
            setLoading(false);
            break;
          default:
            setSession(session2);
            setUser((session2 == null ? void 0 : session2.user) ?? null);
            setLoading(false);
        }
      }
    );
    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);
  const value = useMemo(() => ({
    user,
    session,
    loading,
    signOut,
    refreshSession
  }), [user, session, loading, signOut, refreshSession]);
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useOAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useOAuth must be used within an OAuthProvider");
  }
  return context;
}
function useAuth() {
  const { user, session, loading } = useOAuth();
  return {
    isAuthenticated: !!user && !loading,
    user: user || null,
    session: session || null,
    loading: loading || false
  };
}
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getOAuthRedirectUrl() {
  try {
    if (typeof window === "undefined") return "/auth/callback";
    const origin = window.location.origin;
    const host = window.location.hostname;
    if (host.includes("localhost") || host.startsWith("127.")) {
      return `${origin}/auth/callback`;
    }
    if (host === "forge.college") {
      return `https://app.forge.college/auth/callback`;
    }
    return `${origin}/auth/callback`;
  } catch {
    return "/auth/callback";
  }
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const ApplicationForm = ({ isOpen, onClose, title, formType }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    experience: "",
    portfolio: "",
    investmentAmount: "",
    timeline: ""
  });
  if (!isOpen) return null;
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
    alert(t("applicationForm.messages.success"));
    onClose();
  };
  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };
  const requiredMarker = /* @__PURE__ */ jsx("span", { className: "text-red-500", children: " *" });
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsx("div", { className: "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: title }),
      /* @__PURE__ */ jsxs("button", { onClick: onClose, className: "text-gray-400 transition-colors hover:text-gray-600", children: [
        /* @__PURE__ */ jsx(X, { size: 24, "aria-hidden": true }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("applicationForm.accessibility.close") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          t("applicationForm.fields.name"),
          requiredMarker
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "name",
            required: true,
            value: formData.name,
            onChange: handleInputChange,
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          t("applicationForm.fields.email"),
          requiredMarker
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            name: "email",
            required: true,
            value: formData.email,
            onChange: handleInputChange,
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      formType !== "professional" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: [
          t("applicationForm.fields.company"),
          requiredMarker
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "company",
            required: true,
            value: formData.company,
            onChange: handleInputChange,
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      formType === "professional" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: t("applicationForm.fields.experienceLabel") }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "experience",
              value: formData.experience,
              onChange: handleInputChange,
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: t("applicationForm.fields.experiencePlaceholder") }),
                /* @__PURE__ */ jsx("option", { value: "beginner", children: t("applicationForm.fields.experienceOptions.beginner") }),
                /* @__PURE__ */ jsx("option", { value: "intermediate", children: t("applicationForm.fields.experienceOptions.intermediate") }),
                /* @__PURE__ */ jsx("option", { value: "advanced", children: t("applicationForm.fields.experienceOptions.advanced") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: t("applicationForm.fields.portfolio") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              name: "portfolio",
              value: formData.portfolio,
              onChange: handleInputChange,
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            }
          )
        ] })
      ] }),
      formType === "investor" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: t("applicationForm.fields.investmentAmountLabel") }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "investmentAmount",
              value: formData.investmentAmount,
              onChange: handleInputChange,
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: t("applicationForm.fields.investmentAmountPlaceholder") }),
                /* @__PURE__ */ jsx("option", { value: "10k-50k", children: t("applicationForm.fields.investmentAmountOptions.10k_50k") }),
                /* @__PURE__ */ jsx("option", { value: "50k-100k", children: t("applicationForm.fields.investmentAmountOptions.50k_100k") }),
                /* @__PURE__ */ jsx("option", { value: "100k-500k", children: t("applicationForm.fields.investmentAmountOptions.100k_500k") }),
                /* @__PURE__ */ jsx("option", { value: "500k+", children: t("applicationForm.fields.investmentAmountOptions.500k_plus") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: t("applicationForm.fields.timelineLabel") }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "timeline",
              value: formData.timeline,
              onChange: handleInputChange,
              className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: t("application.selectTimeline") }),
                /* @__PURE__ */ jsx("option", { value: "immediate", children: t("application.timelineImmediate") }),
                /* @__PURE__ */ jsx("option", { value: "quarter", children: t("application.timelineQuarter") }),
                /* @__PURE__ */ jsx("option", { value: "year", children: t("applicationForm.fields.timelineOptions.year") }),
                /* @__PURE__ */ jsx("option", { value: "exploring", children: t("applicationForm.fields.timelineOptions.exploring") })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: t("applicationForm.fields.message") }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "message",
            rows: 4,
            value: formData.message,
            onChange: handleInputChange,
            placeholder: t("applicationForm.fields.messagePlaceholder"),
            className: "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700",
          children: t("application.submit")
        }
      )
    ] })
  ] }) }) });
};
const Reveal = ({
  children,
  delay = 0,
  direction = "up",
  className = ""
}) => {
  const directionOffset = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { y: 0, x: 24 },
    right: { y: 0, x: -24 }
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: {
        opacity: 0,
        ...directionOffset[direction],
        filter: "blur(6px)"
      },
      whileInView: {
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)"
      },
      viewport: { once: true, margin: "-80px" },
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut"
      },
      className,
      children
    }
  );
};
const MagneticButton = ({
  children,
  className = "",
  onClick,
  strength = 6
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dx = useSpring(x, { stiffness: 300, damping: 20 });
  const dy = useSpring(y, { stiffness: 300, damping: 20 });
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / strength);
    y.set((e.clientY - centerY) / strength);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return /* @__PURE__ */ jsx(
    motion.button,
    {
      ref,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick,
      style: { x: dx, y: dy },
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 17 },
      className,
      children
    }
  );
};
const Marquee = ({
  children,
  speed = 22,
  direction = "left",
  className = ""
}) => {
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `inline-flex gap-10 ${animationClass}`,
          style: { animationDuration: `${speed}s` },
          children: [
            children,
            children
          ]
        }
      )
    }
  );
};
const StickyStory = ({ title, codeBlock, steps }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref,
      className: "relative grid lg:grid-cols-2 gap-16 min-h-[200vh] px-6 max-w-7xl mx-auto py-20",
      children: [
        /* @__PURE__ */ jsx("div", { className: "sticky top-24 self-start", children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            style: { rotate, scale },
            className: "rounded-3xl shadow-2xl p-6 bg-forge-dark text-forge-cream overflow-hidden relative border border-forge-orange/20",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-forge-orange/5 to-transparent pointer-events-none" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-forge-orange animate-pulse" }),
                  /* @__PURE__ */ jsx("span", { className: "text-forge-orange font-medium text-sm", children: "Live Code" })
                ] }),
                /* @__PURE__ */ jsx("pre", { className: "text-sm overflow-auto text-forge-cream/90 leading-relaxed", children: /* @__PURE__ */ jsx("code", { children: codeBlock }) })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-32 py-24", children: [
          /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-8", children: title }) }),
          steps.map((step, i) => /* @__PURE__ */ jsx(Reveal, { delay: i * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "max-w-prose", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-2xl lg:text-3xl font-bold text-forge-dark mb-4", children: [
              step.title,
              step.highlight && /* @__PURE__ */ jsx("span", { className: "text-forge-orange ml-2", children: step.highlight })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: step.description })
          ] }) }, step.title))
        ] })
      ]
    }
  );
};
const AnimatedBackground = ({
  variant = "hero",
  className = ""
}) => {
  const backgrounds = {
    hero: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,122,71,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(45,58,46,0.1),transparent_50%),radial-gradient(circle_at_40%_70%,rgba(245,242,232,0.2),transparent_50%)]",
          animate: {
            background: [
              "radial-gradient(circle_at_20%_30%,rgba(232,122,71,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(45,58,46,0.1),transparent_50%),radial-gradient(circle_at_40%_70%,rgba(245,242,232,0.2),transparent_50%)",
              "radial-gradient(circle_at_40%_20%,rgba(232,122,71,0.2),transparent_50%),radial-gradient(circle_at_60%_40%,rgba(45,58,46,0.15),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(245,242,232,0.25),transparent_50%)",
              "radial-gradient(circle_at_60%_60%,rgba(232,122,71,0.18),transparent_50%),radial-gradient(circle_at_20%_70%,rgba(45,58,46,0.12),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(245,242,232,0.22),transparent_50%)"
            ]
          },
          transition: {
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.015] mix-blend-overlay [background-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" }),
      [...Array(12)].map((_, i) => /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute w-1 h-1 bg-forge-orange/20 rounded-full",
          style: {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          },
          animate: {
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5]
          },
          transition: {
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2
          }
        },
        i
      ))
    ] }),
    subtle: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute inset-0 bg-gradient-to-br from-forge-cream/50 to-transparent",
        animate: { opacity: [0.3, 0.6, 0.3] },
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }
    ),
    dark: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute inset-0 bg-gradient-to-br from-forge-dark via-forge-dark to-forge-dark/90",
        animate: {
          background: [
            "linear-gradient(135deg, #2D3A2E 0%, #2D3A2E 50%, rgba(45,58,46,0.9) 100%)",
            "linear-gradient(135deg, rgba(45,58,46,0.95) 0%, #2D3A2E 50%, #2D3A2E 100%)"
          ]
        },
        transition: { duration: 10, repeat: Infinity, repeatType: "reverse" }
      }
    )
  };
  return /* @__PURE__ */ jsx("div", { className: `absolute inset-0 overflow-hidden ${className}`, children: backgrounds[variant] });
};
const Professionals = () => {
  const [showForm, setShowForm] = useState(false);
  const stats = [
    { value: "6", label: "Month Program", suffix: "", icon: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8" }) },
    { value: "$6K", label: "Monthly Salary", suffix: "/mo", icon: /* @__PURE__ */ jsx(DollarSign, { className: "w-8 h-8" }) },
    { value: "95%", label: "Job Placement", suffix: "", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8" }) }
  ];
  const features = [
    {
      icon: /* @__PURE__ */ jsx(DollarSign, { className: "w-6 h-6" }),
      title: "Get Paid to Learn",
      description: "Receive $6,000 USDC monthly while mastering Web3 development",
      highlight: "$36,000"
    },
    {
      icon: /* @__PURE__ */ jsx(Code, { className: "w-6 h-6" }),
      title: "Real Projects",
      description: "Build actual DeFi protocols, NFT platforms, and blockchain infrastructure",
      highlight: "Live Code"
    },
    {
      icon: /* @__PURE__ */ jsx(Briefcase, { className: "w-6 h-6" }),
      title: "Guaranteed Placement",
      description: "Access our exclusive network of Web3 companies hiring developers",
      highlight: "95% Success"
    }
  ];
  const companies = [
    "Uniswap",
    "Chainlink",
    "Polygon",
    "Solana",
    "Ethereum Foundation",
    "ConsenSys",
    "Compound",
    "Aave",
    "OpenSea",
    "Metamask"
  ];
  const testimonials = [
    { quote: '"Changed my life completely. From zero to Web3 developer in 6 months."', author: "Sarah Chen" },
    { quote: '"The ISA model meant I could focus 100% on learning."', author: "Marcus Rodriguez" },
    { quote: '"Landed a $120k job right after graduation."', author: "Alex Thompson" }
  ];
  const codeBlock = `// Forge College Smart Contract
contract ForgeCollege {
  // Student program details
  struct Student {
    address wallet;
    uint256 stipendAmount;
    uint256 completedProjects;
    bool jobPlaced;
  }
  
  // Company sponsor mapping
  mapping(address => uint256) sponsors;
  
  // ISA terms and repayment logic
  function startLearning() public {
    // Begin 6-month program
    // Receive monthly stipend
    // Work on real projects
  }
  
  function completeProgram() public {
    // Portfolio validation
    // Job matching algorithm
    // ISA activation only on job placement
  }
}`;
  const storySteps = [
    {
      title: "Smart Contracts",
      description: "Learn to build and deploy smart contracts that power DeFi protocols, NFT marketplaces, and DAOs. Master Solidity, security best practices, and gas optimization.",
      highlight: "Real Impact"
    },
    {
      title: "DeFi Development",
      description: "Build actual trading protocols, yield farming platforms, and lending systems. Work with real liquidity and understand how billions flow through Web3.",
      highlight: "$2B+ TVL"
    },
    {
      title: "Job Guarantee",
      description: "Our ISA model means we only succeed when you do. Get placed in top Web3 companies or pay nothing. It's that simple.",
      highlight: "Zero Risk"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center pt-28 pb-10 px-6", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "hero" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30, filter: "blur(8px)" },
            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            transition: { duration: 0.8, ease: "easeOut" },
            className: "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight",
            children: [
              "Get Paid",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
                "to Learn.",
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { rotate: [0, 10, -10, 0] },
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    children: /* @__PURE__ */ jsx(Flame, { className: "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.6 },
            className: "text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed",
            children: [
              "Master Web3 development, earn $6,000 USDC monthly for 6 months,",
              /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
              "and only pay us when we land you a job."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: "inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                children: [
                  "Apply to Next Cohort",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("p", { className: "text-center text-forge-gray font-medium mb-8", children: "Learn the skills to work at companies like:" }) }),
      /* @__PURE__ */ jsx(Marquee, { className: "text-2xl font-bold text-forge-dark/60", children: companies.map((company, i) => /* @__PURE__ */ jsx("span", { className: "mx-8 hover:text-forge-orange transition-colors", children: company }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Program by the Numbers" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Real outcomes, real careers, real impact" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center bg-forge-cream p-8 rounded-3xl border border-forge-orange/20 group hover:border-forge-orange/40 transition-all duration-300",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-forge-orange mb-4 flex justify-center group-hover:scale-110 transition-transform", children: stat.icon }),
            /* @__PURE__ */ jsxs("div", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-2", children: [
              stat.value,
              /* @__PURE__ */ jsx("span", { className: "text-forge-orange text-2xl lg:text-3xl", children: stat.suffix })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-lg text-forge-gray font-medium", children: stat.label })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      StickyStory,
      {
        title: "Learn by Building Real Web3 Products",
        codeBlock,
        steps: storySteps
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Why Forge College?" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "The only Web3 education program where you earn while you learn" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
          whileHover: { y: -8 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-forge-orange-light transition-all duration-200 shadow-lg", children: feature.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-forge-orange bg-forge-orange/10 px-3 py-1 rounded-full", children: feature.highlight })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: feature.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { className: "text-center mb-12", children: /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark", children: "What Our Students Say" }) }),
      /* @__PURE__ */ jsx(Marquee, { speed: 30, className: "text-lg", children: testimonials.map((testimonial, i) => /* @__PURE__ */ jsxs("div", { className: "mx-8 max-w-md", children: [
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray italic mb-2", children: testimonial.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-forge-dark font-semibold", children: [
          "— ",
          testimonial.author
        ] })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-cream relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "subtle" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight", children: [
          "No upfront cost.",
          /* @__PURE__ */ jsx("br", {}),
          "Pay only when you land a job."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed", children: "Our Income Share Agreement means you focus on learning, not debt. We only succeed when you do." }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden border-4 border-forge-orange",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    animate: { scale: [1, 1.05, 1] },
                    transition: { duration: 2, repeat: Infinity },
                    className: "inline-flex items-center gap-2 text-forge-orange mb-6",
                    children: [
                      /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Next Cohort Starting Soon" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold mb-6 text-forge-cream", children: "April 2026" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80 mb-8", children: "Limited to 10 students" }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                    children: "Secure Your Spot"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold mb-8 leading-tight text-forge-cream", children: [
          "Ready to forge",
          /* @__PURE__ */ jsx("br", {}),
          "your future?"
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-forge-cream/80 mb-12 leading-relaxed", children: [
          "Join the next generation of Web3 developers.",
          /* @__PURE__ */ jsx("br", {}),
          "Apply now for the April 2026 cohort."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          MagneticButton,
          {
            onClick: () => setShowForm(true),
            className: "inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
            children: [
              "Apply Now",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.6, children: /* @__PURE__ */ jsx("div", { className: "mt-8 text-sm text-forge-cream/60", children: "No upfront cost • Pay only when you get hired" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ApplicationForm,
      {
        isOpen: showForm,
        onClose: () => setShowForm(false),
        title: "Apply to Join the Next Cohort",
        formType: "professional"
      }
    )
  ] });
};
const Companies = () => {
  const [showForm, setShowForm] = useState(false);
  const stats = [
    { value: "95%", label: "Job Placement Rate", suffix: "", icon: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8" }) },
    { value: "6", label: "Month Training", suffix: "mo", icon: /* @__PURE__ */ jsx(Briefcase, { className: "w-8 h-8" }) },
    { value: "Real", label: "Project Experience", suffix: "", icon: /* @__PURE__ */ jsx(Code, { className: "w-8 h-8" }) }
  ];
  const features = [
    {
      icon: /* @__PURE__ */ jsx(Target, { className: "w-6 h-6" }),
      title: "Qualified Talent Pool",
      description: "Access developers who have completed real Web3 projects and proven their skills through hands-on experience",
      highlight: "Pre-vetted"
    },
    {
      icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }),
      title: "Fast Hiring Process",
      description: "Streamlined recruitment with candidates who are ready to contribute from day one",
      highlight: "Day 1 Ready"
    },
    {
      icon: /* @__PURE__ */ jsx(Code, { className: "w-6 h-6" }),
      title: "Project-Based Vetting",
      description: "Our graduates have worked on actual Web3 projects, giving you confidence in their practical abilities",
      highlight: "Proven Skills"
    }
  ];
  const partnershipTiers = [
    {
      tier: "Project Partner",
      highlight: "Start Here",
      features: ["2-3 project submissions per cohort", "Access to student portfolios", "Hiring pipeline access"],
      cta: "Join as Partner"
    },
    {
      tier: "Curriculum Sponsor",
      highlight: "Most Popular",
      features: ["Curriculum influence", "Sponsor 3-5 students", "Dedicated hiring events", "Brand partnership benefits"],
      cta: "Become Sponsor",
      featured: true
    },
    {
      tier: "Ecosystem Partner",
      highlight: "Full Access",
      features: ["Full curriculum partnership", "Sponsor entire cohort track", "Exclusive hiring window", "Advisory board seat"],
      cta: "Join Ecosystem"
    }
  ];
  const companies = [
    "Uniswap",
    "Chainlink",
    "Polygon",
    "Solana",
    "Ethereum Foundation",
    "ConsenSys",
    "Compound",
    "Aave",
    "OpenSea",
    "Metamask"
  ];
  const testimonials = [
    { quote: '"Hired 3 developers from Forge College. Best hiring decision we made this year."', author: "Sarah Kim, CTO at DeFi Protocol" },
    { quote: '"The candidates came with real project experience. No training period needed."', author: "Marcus Chen, Engineering Lead at Web3 Startup" },
    { quote: '"Forge College graduates understand the Web3 ecosystem better than traditional bootcamp grads."', author: "Elena Rodriguez, VP Engineering at NFT Platform" }
  ];
  const codeBlock = `// Partnership Integration Example
contract ForgePartnership {
  // Company partnership details
  struct Partner {
    address company;
    uint256 sponsoredStudents;
    bytes32[] projectIds;
    bool exclusiveHiring;
  }
  
  // Student project assignments
  mapping(address => bytes32[]) studentProjects;
  
  // Partnership benefits and ROI
  function sponsorStudent(address student) public {
    // Fund student salary during learning
    // Assign real company projects
    // Track performance metrics
  }
  
  function hireGraduate(address student) public {
    // Validate project completion
    // Execute hiring agreement
    // Activate partnership benefits
  }
  
  // Partnership ROI calculation
  function calculateROI() public view returns (uint256) {
    // Hiring success rate
    // Time to productivity
    // Cost savings vs traditional recruiting
  }
}`;
  const storySteps = [
    {
      title: "Real Project Experience",
      description: "Our students work on actual company projects during their 6-month program. This means they understand your business challenges and have proven their ability to deliver.",
      highlight: "Business Ready"
    },
    {
      title: "Reduced Hiring Risk",
      description: "Skip the uncertainty of traditional hiring. Our graduates have portfolios of completed projects and verified skills from working with real companies.",
      highlight: "Zero Risk"
    },
    {
      title: "Faster Time to Value",
      description: "Candidates hit the ground running from day one. No lengthy onboarding or training periods. They understand Web3 development and your business needs.",
      highlight: "Immediate Impact"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center pt-28 pb-10 px-6", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "hero" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30, filter: "blur(8px)" },
            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            transition: { duration: 0.8, ease: "easeOut" },
            className: "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight",
            children: [
              "Hire Web3-Ready",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
                "Talents.",
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { rotate: [0, 10, -10, 0] },
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    children: /* @__PURE__ */ jsx(Trophy, { className: "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.6 },
            className: "text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed",
            children: [
              "Access skilled developers from our intensive 6-month program.",
              /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
              "Pre-vetted, project-tested, and ready to build from day one."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: "inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                children: [
                  "Partner With Us",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("p", { className: "text-center text-forge-gray font-medium mb-8", children: "Join companies already building the future workforce" }) }),
      /* @__PURE__ */ jsx(Marquee, { className: "text-2xl font-bold text-forge-dark/60", children: companies.map((company, i) => /* @__PURE__ */ jsx("span", { className: "mx-8 hover:text-forge-orange transition-colors", children: company }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Hiring Success Metrics" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Real results from companies who partner with us" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center bg-forge-cream p-8 rounded-3xl border border-forge-orange/20 group hover:border-forge-orange/40 transition-all duration-300",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-forge-orange mb-4 flex justify-center group-hover:scale-110 transition-transform", children: stat.icon }),
            /* @__PURE__ */ jsxs("div", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-2", children: [
              stat.value,
              /* @__PURE__ */ jsx("span", { className: "text-forge-orange text-2xl lg:text-3xl", children: stat.suffix })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-lg text-forge-gray font-medium", children: stat.label })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      StickyStory,
      {
        title: "Why Companies Choose Forge College",
        codeBlock,
        steps: storySteps
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Partnership Benefits" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Transform your hiring strategy by investing in talent development" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
          whileHover: { y: -8 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-forge-orange-light transition-all duration-200 shadow-lg", children: feature.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-forge-orange bg-forge-orange/10 px-3 py-1 rounded-full", children: feature.highlight })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: feature.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Partnership Tiers" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Choose the partnership level that fits your hiring needs" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: partnershipTiers.map((tier, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: `p-8 rounded-3xl transition-all duration-300 group relative overflow-hidden ${tier.featured ? "bg-forge-dark text-white border-4 border-forge-orange shadow-xl" : "bg-forge-cream border border-forge-orange/20 hover:border-forge-orange/40"}`,
          whileHover: { y: -8, scale: tier.featured ? 1.02 : 1 },
          children: [
            tier.featured && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx("span", { className: "bg-forge-orange text-white px-3 py-1 rounded-full text-sm font-bold", children: tier.highlight }) }),
            /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-2 ${tier.featured ? "text-forge-cream" : "text-forge-dark"}`, children: tier.tier }),
            /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("span", { className: `text-sm font-medium px-3 py-1 rounded-full ${tier.featured ? "bg-forge-orange/20 text-forge-orange" : "bg-forge-orange/10 text-forge-orange"}`, children: tier.highlight }) }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-8", children: tier.features.map((feature, i) => /* @__PURE__ */ jsxs("li", { className: `flex items-start gap-3 ${tier.featured ? "text-forge-cream/90" : "text-forge-gray"}`, children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-forge-orange flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: feature })
            ] }, i)) }),
            /* @__PURE__ */ jsx(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: `w-full py-3 rounded-full font-semibold transition-all duration-200 ${tier.featured ? "bg-forge-orange text-white border-2 border-forge-orange hover:border-forge-orange-light" : "bg-forge-orange text-white border-2 border-forge-orange hover:border-forge-orange-light"}`,
                children: tier.cta
              }
            )
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { className: "text-center mb-12", children: /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark", children: "What Partner Companies Say" }) }),
      /* @__PURE__ */ jsx(Marquee, { speed: 35, className: "text-lg", children: testimonials.map((testimonial, i) => /* @__PURE__ */ jsxs("div", { className: "mx-8 max-w-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray italic mb-2", children: testimonial.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-forge-dark font-semibold", children: [
          "— ",
          testimonial.author
        ] })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-cream relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "subtle" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight", children: [
          "Ready to hire",
          /* @__PURE__ */ jsx("br", {}),
          "the best Web3 talent?"
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed", children: "Join leading Web3 companies who are building their teams through Forge College partnerships." }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden border-4 border-forge-orange",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    animate: { scale: [1, 1.05, 1] },
                    transition: { duration: 2, repeat: Infinity },
                    className: "inline-flex items-center gap-2 text-forge-orange mb-6",
                    children: [
                      /* @__PURE__ */ jsx(Users, { className: "w-6 h-6" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Next Hiring Cycle" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold mb-6 text-forge-cream", children: "April 2026" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80 mb-8", children: "10 graduating developers ready for placement" }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                    children: "Become a Partner"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold mb-8 leading-tight text-forge-cream", children: [
          "Let's build the future",
          /* @__PURE__ */ jsx("br", {}),
          "of Web3 together."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-forge-cream/80 mb-12 leading-relaxed", children: [
          "Partner with Forge College and get first access",
          /* @__PURE__ */ jsx("br", {}),
          "to the most skilled Web3 developers."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          MagneticButton,
          {
            onClick: () => setShowForm(true),
            className: "inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
            children: [
              "Start Partnership",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.6, children: /* @__PURE__ */ jsx("div", { className: "mt-8 text-sm text-forge-cream/60", children: "Pre-vetted talent • Real project experience • Immediate impact" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ApplicationForm,
      {
        isOpen: showForm,
        onClose: () => setShowForm(false),
        title: "Partner With Forge College",
        formType: "company"
      }
    )
  ] });
};
const Investors = () => {
  const [showForm, setShowForm] = useState(false);
  const stats = [
    { value: "8-12%", label: "Target IRR", suffix: "", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8" }) },
    { value: "3-5", label: "Year Payback", suffix: "yr", icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-8 h-8" }) },
    { value: "92%", label: "Job Placement", suffix: "", icon: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8" }) }
  ];
  const features = [
    {
      icon: /* @__PURE__ */ jsx(PieChart, { className: "w-6 h-6" }),
      title: "Diversified RWA Exposure",
      description: "Invest in human capital through stablecoin-backed Income Share Agreements as a new asset class",
      highlight: "New Asset Class"
    },
    {
      icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-6 h-6" }),
      title: "Transparent Metrics",
      description: "Access real-time performance data, repayment rates, and ROI analytics through our investor dashboard",
      highlight: "Live Analytics"
    },
    {
      icon: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6" }),
      title: "Stable Returns",
      description: "Generate yield from high-demand Web3 talent with historical repayment rates exceeding traditional education loans",
      highlight: "Proven Model"
    }
  ];
  const marketData = [
    { metric: "$1.2T", label: "Web3 Market Cap", description: "Total value locked across DeFi and Web3 protocols" },
    { metric: "3.7M", label: "Developer Shortage", description: "Unfilled Web3 developer positions globally" },
    { metric: "$140K", label: "Average Salary", description: "Starting salary for Web3 developers" }
  ];
  const performanceData = [
    { metric: "Target IRR", value: "8-12%", description: "Based on Web3 salary growth trends", trend: "up" },
    { metric: "Avg. Payback Period", value: "3-5 years", description: "Capped at 10% of income annually", trend: "neutral" },
    { metric: "Job Placement Rate", value: "92%", description: "Within 6 months of graduation", trend: "up" }
  ];
  const roadmapSteps = [
    { quarter: "Q2", title: "Fund Launch", description: "Initial investor round and first cohort funding" },
    { quarter: "Q3", title: "Performance Data", description: "First graduation metrics and repayment initiation" },
    { quarter: "Q4", title: "Secondary Market", description: "ISA trading platform and liquidity options" }
  ];
  const funds = [
    "Andreessen Horowitz",
    "Coinbase Ventures",
    "Paradigm",
    "Sequoia",
    "Tiger Global",
    "Pantera Capital",
    "Union Square Ventures",
    "Binance Labs"
  ];
  const testimonials = [
    { quote: '"Human capital ISAs represent the next evolution of RWA investments."', author: "Sarah Johnson, Partner at Web3 Fund" },
    { quote: '"The alignment of incentives in this model creates sustainable returns."', author: "Michael Chen, LP at DeFi Capital" },
    { quote: '"Finally, an investment that generates returns while solving real problems."', author: "Elena Rodriguez, Managing Director" }
  ];
  const codeBlock = `// ISA Investment Smart Contract
contract ForgeISAFund {
  // Investment and return structures
  struct Investment {
    address investor;
    uint256 amountUSDC;
    uint256 expectedReturn;
    uint256 timeframe;
    bool isActive;
  }
  
  // Student income share agreements
  mapping(address => ISATerms) studentISAs;
  
  // Performance tracking
  struct PerformanceMetrics {
    uint256 totalDeployed;
    uint256 totalReturned;
    uint256 currentIRR;
    uint256 activeISAs;
  }
  
  // Investment deployment
  function deployCapital(uint256 amount) public {
    // Fund student salaries (6 months)
    // Track investment allocation
    // Begin performance monitoring
  }
  
  // Return distribution
  function distributeReturns() public {
    // Calculate quarterly distributions
    // Process ISA collections
    // Pay investors based on stake
  }
  
  // Real-time analytics
  function getPortfolioMetrics() public view returns (PerformanceMetrics) {
    // Live IRR calculation
    // Risk-adjusted returns
    // Liquidity positions
  }
}`;
  const storySteps = [
    {
      title: "Human Capital as RWA",
      description: "Web3 has created a new asset class: human capital. Our ISA model tokenizes education investment, creating yield-generating assets backed by high-earning Web3 careers.",
      highlight: "Next-Gen RWA"
    },
    {
      title: "Aligned Incentives",
      description: "Unlike traditional education loans, ISAs align investor and student success. Returns are tied to job placement and salary growth, creating sustainable economics for all parties.",
      highlight: "Win-Win Model"
    },
    {
      title: "Liquidity & Scale",
      description: "Our roadmap includes secondary market infrastructure for ISA trading, fractional ownership, and automated portfolio management. Scale meets liquidity.",
      highlight: "DeFi Integration"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center pt-28 pb-10 px-6", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "hero" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30, filter: "blur(8px)" },
            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
            transition: { duration: 0.8, ease: "easeOut" },
            className: "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight",
            children: [
              "Invest in",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
                "People's Future.",
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { rotate: [0, 15, -15, 0] },
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.6 },
            className: "text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed",
            children: [
              "Generate stable returns by investing in Web3 talent",
              /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
              "through innovative stablecoin-backed Income Share Agreements."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(
              MagneticButton,
              {
                onClick: () => setShowForm(true),
                className: "inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                children: [
                  "Join Investment Round",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("p", { className: "text-center text-forge-gray font-medium mb-8", children: "Join institutional investors backing the future of work" }) }),
      /* @__PURE__ */ jsx(Marquee, { className: "text-2xl font-bold text-forge-dark/60", children: funds.map((fund, i) => /* @__PURE__ */ jsx("span", { className: "mx-8 hover:text-forge-orange transition-colors", children: fund }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Investment Performance" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Stable returns from a growing market" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center bg-forge-cream p-8 rounded-3xl border border-forge-orange/20 group hover:border-forge-orange/40 transition-all duration-300",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-forge-orange mb-4 flex justify-center group-hover:scale-110 transition-transform", children: stat.icon }),
            /* @__PURE__ */ jsxs("div", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-2", children: [
              stat.value,
              /* @__PURE__ */ jsx("span", { className: "text-forge-orange text-2xl lg:text-3xl", children: stat.suffix })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-lg text-forge-gray font-medium", children: stat.label })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-20 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto relative z-10", children: [
        /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-cream mb-6", children: "Market Opportunity" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80", children: "The Web3 talent shortage creates unprecedented opportunity" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: marketData.map((item, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "text-center p-8 rounded-3xl border border-forge-orange/20 bg-white/5 backdrop-blur-sm hover:border-forge-orange/40 transition-all duration-300 group",
            whileHover: { y: -5, scale: 1.02 },
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-4xl lg:text-5xl font-bold text-forge-orange mb-3 group-hover:scale-110 transition-transform", children: item.metric }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-forge-cream mb-2", children: item.label }),
              /* @__PURE__ */ jsx("p", { className: "text-forge-cream/70", children: item.description })
            ]
          }
        ) }, index)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      StickyStory,
      {
        title: "A New Asset Class is Born",
        codeBlock,
        steps: storySteps
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Why Invest in Human Capital?" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Web3 has created new opportunities for yield generation" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
          whileHover: { y: -8 },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-forge-orange-light transition-all duration-200 shadow-lg", children: feature.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-forge-orange bg-forge-orange/10 px-3 py-1 rounded-full", children: feature.highlight })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-forge-gray leading-relaxed", children: feature.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Investment Metrics" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Transparent performance data you can trust" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: performanceData.map((item, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-cream p-6 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group",
            whileHover: { x: 5 },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-forge-gray font-medium", children: item.metric }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-forge-dark", children: item.value }),
                  item.trend === "up" && /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-green-500" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray/80", children: item.description })
            ]
          }
        ) }, index)) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark text-white p-8 rounded-3xl border-4 border-forge-orange relative overflow-hidden",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold mb-6 text-forge-cream", children: "Investment Structure" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-forge-orange pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Minimum Investment" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "$10,000 USDC/USDT" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-blue-400 pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Fund Duration" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "7-year fund life with extension options" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-green-400 pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Distribution Schedule" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "Quarterly distributions based on collections" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-purple-400 pl-4", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-forge-cream", children: "Management Fee" }),
                    /* @__PURE__ */ jsx("p", { className: "text-forge-cream/80", children: "2% annually + 20% performance fee" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "w-full bg-forge-orange text-white py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200 mt-8",
                    children: "Join Investment Round"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-forge-cream", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-bold text-forge-dark mb-6", children: "Roadmap to Liquidity" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray", children: "Clear path to returns and secondary market access" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: roadmapSteps.map((step, index) => /* @__PURE__ */ jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group text-center",
          whileHover: { y: -5 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-forge-orange rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xl", children: step.quarter }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark mb-4", children: step.title }),
            /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: step.description })
          ]
        }
      ) }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsx(Reveal, { className: "text-center mb-12", children: /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-forge-dark", children: "What Investors Say" }) }),
      /* @__PURE__ */ jsx(Marquee, { speed: 40, className: "text-lg", children: testimonials.map((testimonial, i) => /* @__PURE__ */ jsxs("div", { className: "mx-8 max-w-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray italic mb-2", children: testimonial.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-forge-dark font-semibold", children: [
          "— ",
          testimonial.author
        ] })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-cream relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "subtle" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight", children: [
          "Ready to generate",
          /* @__PURE__ */ jsx("br", {}),
          "stable returns?"
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed", children: "Join institutional investors backing the next generation of Web3 builders through innovative ISA investments." }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden border-4 border-forge-orange",
            whileHover: { scale: 1.02 },
            transition: { type: "spring", stiffness: 300 },
            children: [
              /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    animate: { scale: [1, 1.05, 1] },
                    transition: { duration: 2, repeat: Infinity },
                    className: "inline-flex items-center gap-2 text-forge-orange mb-6",
                    children: [
                      /* @__PURE__ */ jsx(Coins, { className: "w-6 h-6" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Next Investment Round" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold mb-6 text-forge-cream", children: "$2M Target" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl text-forge-cream/80 mb-8", children: "Funding the April 2026 cohort" }),
                /* @__PURE__ */ jsx(
                  MagneticButton,
                  {
                    onClick: () => setShowForm(true),
                    className: "bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
                    children: "Invest Now"
                  }
                )
              ] })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-32 px-6 bg-forge-dark text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(AnimatedBackground, { variant: "dark" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center relative z-10", children: [
        /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("h2", { className: "text-5xl lg:text-6xl font-bold mb-8 leading-tight text-forge-cream", children: [
          "Invest in impact.",
          /* @__PURE__ */ jsx("br", {}),
          "Generate returns."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.2, children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-forge-cream/80 mb-12 leading-relaxed", children: [
          "Join the future of education funding through",
          /* @__PURE__ */ jsx("br", {}),
          "innovative stablecoin-backed ISA investments."
        ] }) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.4, children: /* @__PURE__ */ jsxs(
          MagneticButton,
          {
            onClick: () => setShowForm(true),
            className: "inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200",
            children: [
              "Join Investment Round",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(Reveal, { delay: 0.6, children: /* @__PURE__ */ jsx("div", { className: "mt-8 text-sm text-forge-cream/60", children: "Minimum $10K USDC • Quarterly distributions • Secondary market access" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ApplicationForm,
      {
        isOpen: showForm,
        onClose: () => setShowForm(false),
        title: "Join the Investment Round",
        formType: "investor"
      }
    )
  ] });
};
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-4", children: "Oops! Page not found" }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "text-blue-500 hover:text-blue-700 underline", children: "Return to Home" })
  ] }) });
};
function createDebugClient() {
  const { url, anonKey } = supabaseConfig;
  console.log("Debug: Supabase URL:", url);
  console.log("Debug: Supabase Key (first 20 chars):", anonKey.substring(0, 20) + "...");
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      // Disable auto refresh for debugging
      persistSession: false,
      // Disable session persistence for debugging
      detectSessionInUrl: false,
      // Disable URL detection for debugging
      flowType: "implicit",
      debug: true
    },
    global: {
      headers: {
        "X-Client-Info": "forge-college-debug"
      },
      fetch: (url2, options = {}) => {
        console.log("Debug: Fetch request to:", url2);
        console.log("Debug: Fetch options:", options);
        return fetch(url2, {
          ...options,
          headers: {
            ...options.headers,
            "User-Agent": "forge-college-debug/1.0"
          }
        }).then((response) => {
          console.log("Debug: Response status:", response.status);
          console.log("Debug: Response headers:", Object.fromEntries(response.headers.entries()));
          const clonedResponse = response.clone();
          clonedResponse.text().then((text) => {
            console.log("Debug: Response body:", text.substring(0, 200) + (text.length > 200 ? "..." : ""));
          }).catch((err) => {
            console.log("Debug: Could not read response body:", err);
          });
          return response;
        }).catch((error) => {
          console.error("Debug: Fetch error:", error);
          throw error;
        });
      }
    }
  });
}
async function testSupabaseConnection() {
  try {
    const client = createDebugClient();
    const { url, anonKey } = supabaseConfig;
    console.log("Testing Supabase connection...");
    const healthResponse = await fetch(`${url}/rest/v1/`, {
      headers: {
        "apikey": anonKey
      }
    });
    console.log("Health check status:", healthResponse.status);
    if (!healthResponse.ok) {
      throw new Error(`Supabase health check failed: ${healthResponse.status}`);
    }
    let authResponse;
    let authStatus = "unknown";
    let authResponseText = "Could not read response";
    try {
      authResponse = await fetch(`${url}/auth/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": anonKey
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "test123456"
        })
      });
      authStatus = authResponse.status.toString();
      console.log("Auth endpoint status:", authResponse.status);
      const clonedResponse = authResponse.clone();
      try {
        authResponseText = await clonedResponse.text();
        console.log("Auth response:", authResponseText.substring(0, 200));
      } catch (textError) {
        console.log("Could not read auth response text:", textError);
        authResponseText = `Error reading response: ${textError}`;
      }
    } catch (fetchError) {
      console.error("Auth endpoint fetch failed:", fetchError);
      authStatus = "fetch_failed";
      authResponseText = `Fetch error: ${fetchError}`;
    }
    return {
      success: true,
      healthStatus: healthResponse.status,
      authStatus,
      authResponse: authResponseText
    };
  } catch (error) {
    console.error("Supabase connection test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
const mockAuth = {
  signInWithPassword: async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    if (email === "demo@example.com" && password === "demo123") {
      return {
        data: {
          user: {
            id: "mock-user-id",
            email: "demo@example.com",
            user_metadata: {
              name: "Demo User"
            }
          },
          session: {
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token"
          }
        },
        error: null
      };
    }
    return {
      data: { user: null, session: null },
      error: {
        message: "Invalid login credentials",
        status: 400
      }
    };
  },
  signInWithOAuth: async ({ provider }) => {
    console.log(`Mock OAuth redirect for ${provider}`);
    window.location.href = `/auth/callback?provider=${provider}&mock=true`;
    return { data: null, error: null };
  },
  signOut: async () => {
    return { error: null };
  },
  getSession: async () => {
    return {
      data: { session: null },
      error: null
    };
  },
  onAuthStateChange: () => {
    return {
      data: {
        subscription: {
          unsubscribe: () => {
          }
        }
      }
    };
  }
};
function shouldUseMockAuth() {
  return false;
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const ROOT = "/";
const COMPANIES = "/companies";
const INVESTORS = "/investors";
const OLD_HIDDEN = "/old/hidden/index";
const LOGIN = "/login";
const SIGNUP = "/signup";
const FORGOT_PASSWORD = "/forgot-password";
const UPDATE_PASSWORD = "/update-password";
const DASHBOARD = "/dashboard";
const DASHBOARD_EXPLORE = "/dashboard/explore";
const DASHBOARD_FORMATIONS = "/dashboard/formations";
const DASHBOARD_FORMATION_DETAIL = (formationId) => `/dashboard/formations/${formationId}`;
const DASHBOARD_COMING_SOON = "/dashboard/coming-soon";
const DASHBOARD_ADMIN = "/dashboard/admin";
const DASHBOARD_SCOREBOARD = "/dashboard/scoreboard";
const DASHBOARD_ACHIEVEMENTS = "/dashboard/achievements";
const DASHBOARD_COMMUNITY_PROJECTS = "/dashboard/community-projects";
const DASHBOARD_LEARN_COURSE = (courseId) => `/dashboard/learn/course/${courseId}`;
const DASHBOARD_LEARN_PATH = (pathId) => `/dashboard/learn/path/${pathId}`;
const ROUTE_LABELS = {
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
  PAGE: "nav.page"
};
function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testing, setTesting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogin = async (e) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (shouldUseMockAuth()) ;
      console.log("Attempting Supabase authentication...");
      const supabase2 = createClientBrowser();
      const { data, error: error2 } = await supabase2.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      console.log("Login response:", { data: !!data, error: error2 == null ? void 0 : error2.message });
      if (error2) {
        if ((_a = error2.message) == null ? void 0 : _a.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        } else if ((_b = error2.message) == null ? void 0 : _b.includes("Email not confirmed")) {
          throw new Error("Please check your email and click the confirmation link before signing in.");
        } else if ((_c = error2.message) == null ? void 0 : _c.includes("Too many requests")) {
          throw new Error("Too many login attempts. Please wait a moment before trying again.");
        } else if ((_d = error2.message) == null ? void 0 : _d.includes("body stream already read")) {
          console.log("Supabase error detected, falling back to mock auth...");
          const { data: mockData, error: mockError } = await mockAuth.signInWithPassword({
            email: email.trim(),
            password
          });
          if (mockError) {
            throw new Error(mockError.message);
          }
          if (mockData == null ? void 0 : mockData.user) {
            localStorage.setItem("mock-auth-user", JSON.stringify(mockData.user));
            const from = ((_f = (_e = location.state) == null ? void 0 : _e.from) == null ? void 0 : _f.pathname) || DASHBOARD;
            navigate(from, { replace: true });
          }
          return;
        } else {
          throw new Error(error2.message || "Login failed");
        }
      }
      if (data == null ? void 0 : data.user) {
        console.log("Login successful, redirecting...");
        const from = ((_h = (_g = location.state) == null ? void 0 : _g.from) == null ? void 0 : _h.pathname) || DASHBOARD;
        navigate(from, { replace: true });
      }
    } catch (error2) {
      console.error("Login error:", error2);
      if ((_i = error2.message) == null ? void 0 : _i.includes("body stream already read")) {
        setError("Authentication service configuration error. Using demo mode - try email: demo@example.com, password: demo123");
      } else if (((_j = error2.message) == null ? void 0 : _j.includes("fetch")) || ((_k = error2.message) == null ? void 0 : _k.includes("network"))) {
        setError("Network connection error. Please check your internet connection and try again.");
      } else if ((_l = error2.message) == null ? void 0 : _l.includes("Failed to execute")) {
        setError("Authentication service error. The Supabase instance may be misconfigured.");
      } else if ((_m = error2.message) == null ? void 0 : _m.includes("Supabase connection failed")) {
        setError("Cannot connect to authentication service. Please check if Supabase is properly configured.");
      } else {
        setError(error2.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getOAuthRedirectUrl()
        }
      });
      if (error2) {
        console.error("Google OAuth error:", error2);
        throw new Error("Google sign-in failed. Please try again.");
      }
    } catch (error2) {
      console.error("Google login error:", error2);
      setError(error2.message || "Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };
  const handleGithubLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: getOAuthRedirectUrl()
        }
      });
      if (error2) {
        console.error("GitHub OAuth error:", error2);
        throw new Error("GitHub sign-in failed. Please try again.");
      }
    } catch (error2) {
      console.error("GitHub login error:", error2);
      setError(error2.message || "GitHub sign-in failed. Please try again.");
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Login" }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        shouldUseMockAuth(),
        /* @__PURE__ */ jsx("form", { onSubmit: handleLogin, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-forge-dark font-medium", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                placeholder: "m@example.com",
                required: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-forge-dark font-medium", children: "Password" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "password",
                type: "password",
                required: true,
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
              }
            )
          ] }),
          error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
              disabled: loading,
              children: loading ? "Loading..." : "Login"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-forge-orange/20" }) }),
            /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-white px-2 text-forge-gray", children: "Or continue with" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleGoogleLogin,
                className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
                disabled: loading,
                children: [
                  /* @__PURE__ */ jsxs("svg", { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110", viewBox: "0 0 24 24", children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        fill: "#4285F4",
                        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        fill: "#34A853",
                        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        fill: "#FBBC05",
                        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        fill: "#EA4335",
                        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      }
                    )
                  ] }),
                  "Continue with Google"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleGithubLogin,
                className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
                disabled: loading,
                children: [
                  /* @__PURE__ */ jsx(Github, { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110" }),
                  "Continue with GitHub"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-forge-gray", children: "Don't have an account?" }),
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/signup", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Sign up" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-center text-sm", children: /* @__PURE__ */ jsx(Link, { to: "/forgot-password", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Forgot your password?" }) }),
          process.env.NODE_ENV === "development" && /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: async () => {
                setTesting(true);
                try {
                  const result = await testSupabaseConnection();
                  alert(`Connection test ${result.success ? "passed" : "failed"}: ${JSON.stringify(result, null, 2)}`);
                } catch (err) {
                  alert(`Connection test error: ${err}`);
                } finally {
                  setTesting(false);
                }
              },
              disabled: testing,
              className: "text-xs",
              children: [
                /* @__PURE__ */ jsx(Bug, { className: "w-3 h-3 mr-1" }),
                testing ? "Testing..." : "Test Connection"
              ]
            }
          ) })
        ] }) })
      ] })
    ] })
  ] });
}
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    setMessage("");
    try {
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signUp({ email, password });
      if (error2) throw new Error(error2.message || "Sign up failed");
      setMessage("Check your email for the confirmation link!");
    } catch (error2) {
      if (error2.message.includes("fetch") || error2.message.includes("network")) {
        setError("Authentication service not configured. Please contact the administrator.");
      } else {
        setError(error2.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignUp = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getOAuthRedirectUrl()
        }
      });
      if (error2) throw new Error(error2.message || "OAuth sign-in failed");
    } catch (error2) {
      setError(error2.message);
      setLoading(false);
    }
  };
  const handleGithubSignUp = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: getOAuthRedirectUrl()
        }
      });
      if (error2) throw new Error(error2.message || "OAuth sign-in failed");
    } catch (error2) {
      setError(error2.message);
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Create Account" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("form", { onSubmit: handleSignUp, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-forge-dark font-medium", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "m@example.com",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-forge-dark font-medium", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirm-password", className: "text-forge-dark font-medium", children: "Confirm Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "confirm-password",
              type: "password",
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
        message && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200", children: message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
            disabled: loading,
            children: loading ? "Creating account..." : "Sign Up"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-forge-orange/20" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-white px-2 text-forge-gray", children: "Or continue with" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleGoogleSignUp,
              className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
              disabled: loading,
              children: [
                /* @__PURE__ */ jsxs("svg", { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#4285F4",
                      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#34A853",
                      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#FBBC05",
                      d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "#EA4335",
                      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    }
                  )
                ] }),
                "Continue with Google"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleGithubSignUp,
              className: "w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group",
              disabled: loading,
              children: [
                /* @__PURE__ */ jsx(Github, { className: "w-6 h-6 mr-3 transition-transform group-hover:scale-110" }),
                "Continue with GitHub"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-forge-gray", children: "Already have an account?" }),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Login" })
        ] })
      ] }) }) })
    ] })
  ] });
}
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setLoading(true);
    try {
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });
      if (error2) throw new Error(error2.message || "Failed to send reset email");
      setMessage("Check your email for a password reset link.");
    } catch (error2) {
      setError(error2.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Forgot Password" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("form", { onSubmit: handlePasswordReset, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-forge-dark font-medium", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "m@example.com",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
        message && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200", children: message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
            disabled: loading,
            children: loading ? "Sending..." : "Send Reset Link"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-forge-gray", children: "Remembered your password?" }),
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors", children: "Login" })
        ] })
      ] }) }) })
    ] })
  ] });
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(SheetPrimitive.Title, { className: "sr-only", children: "Menu" }),
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
const skeletonVariants = cva("bg-muted", {
  variants: {
    variant: {
      pulse: "animate-pulse",
      shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent"
    },
    shape: {
      default: "rounded-md",
      circle: "rounded-full",
      rectangle: "rounded-none",
      lg: "rounded-lg",
      xl: "rounded-xl"
    }
  },
  defaultVariants: {
    variant: "shimmer",
    shape: "default"
  }
});
function Skeleton({ className, variant, shape, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(skeletonVariants({ variant, shape }), className),
      role: "status",
      "aria-label": "Loading...",
      ...props
    }
  );
}
function SkeletonText({
  className,
  lines = 1,
  ...props
}) {
  return /* @__PURE__ */ jsx("div", { className: cn("space-y-2", className), ...props, children: Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ jsx(
    Skeleton,
    {
      className: cn("h-4", i === lines - 1 && lines > 1 ? "w-4/5" : "w-full")
    },
    i
  )) });
}
function SkeletonCircle({
  className,
  size = "md",
  ...props
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };
  return /* @__PURE__ */ jsx(Skeleton, { shape: "circle", className: cn(sizes[size], className), ...props });
}
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = React.forwardRef(
  ({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const state = open ? "expanded" : "collapsed";
    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );
    return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsx(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        }
      ) });
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: "group peer hidden md:block text-sidebar-foreground",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, state } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick == null ? void 0 : onClick(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: cn(
          "transition-transform duration-200",
          state === "collapsed" ? "rotate-180" : ""
        ) }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Input,
    {
      ref,
      "data-sidebar": "input",
      className: cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-action",
      className: cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full text-sm", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative", className),
    ...props
  }
));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const SidebarMenuButton = React.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("rounded-md h-8 flex gap-2 px-2 items-center", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "h-4 flex-1 max-w-[--skeleton-width]",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu-sub",
    className: cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
function ProfileDropdown() {
  var _a, _b;
  const { t } = useTranslation();
  const { user } = useAuth();
  const { signOut: oAuthSignOut, loading: signOutLoading } = useOAuth();
  let mockUser = null;
  const isAdmin = Boolean(((_a = user == null ? void 0 : user.app_metadata) == null ? void 0 : _a.is_admin) || (mockUser == null ? void 0 : mockUser.is_admin));
  const handleLogout = async () => {
    try {
      await oAuthSignOut();
    } catch (error) {
      console.error("Error during logout:", error);
      window.location.href = "/";
    }
  };
  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };
  const getUserDisplayName = () => {
    var _a2, _b2;
    if ((_a2 = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a2.full_name) {
      return user.user_metadata.full_name;
    }
    if ((_b2 = user == null ? void 0 : user.user_metadata) == null ? void 0 : _b2.name) {
      return user.user_metadata.name;
    }
    if (user == null ? void 0 : user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };
  if (!user) {
    return null;
  }
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "w-full justify-start gap-2 px-2", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: (_b = user == null ? void 0 : user.user_metadata) == null ? void 0 : _b.avatar_url }),
        /* @__PURE__ */ jsx(AvatarFallback, { children: getInitials(user == null ? void 0 : user.email) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start text-left group-data-[collapsible=icon]:hidden", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: getUserDisplayName() }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: user == null ? void 0 : user.email })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: t("profileDropdown.myAccount") }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/profile", children: [
        /* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: t("profileDropdown.profile") })
      ] }) }),
      isAdmin && /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/admin", children: [
        /* @__PURE__ */ jsx(Shield, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: t("profileDropdown.admin") })
      ] }) }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { children: [
        /* @__PURE__ */ jsx(Wallet, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: t("profileDropdown.connectWallet") })
      ] }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleLogout, disabled: signOutLoading, children: [
        /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { children: signOutLoading ? t("auth.logout.signingOut") : t("auth.logout.button") })
      ] })
    ] })
  ] });
}
const Breadcrumb = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ol",
  {
    ref,
    className: cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    ),
    ...props
  }
));
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "span",
  {
    ref,
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    className: cn("font-normal text-foreground", className),
    ...props
  }
));
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:size-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
function MobileMenuButton() {
  const { toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: "md:hidden p-2 rounded-lg border border-forge-orange/20 bg-forge-cream/90 text-forge-dark hover:text-forge-orange shadow-sm",
      "aria-label": t("dashboard.layout.openMenu"),
      onClick: toggleSidebar,
      children: /* @__PURE__ */ jsx(Menu, { size: 22 })
    }
  );
}
function DashboardLayout() {
  var _a;
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const isDashboard = location.pathname === DASHBOARD;
  const isExplore = location.pathname.startsWith(DASHBOARD_EXPLORE);
  const isAdminRoute = location.pathname.startsWith(DASHBOARD_ADMIN);
  const isScoreboard = location.pathname.startsWith(DASHBOARD_SCOREBOARD);
  const isAchievements = location.pathname.startsWith(DASHBOARD_ACHIEVEMENTS);
  const isCommunityProjects = location.pathname.startsWith(DASHBOARD_COMMUNITY_PROJECTS);
  const [headerBreadcrumb, setHeaderBreadcrumb] = useState(null);
  let mockUser = null;
  const isAdmin = Boolean(((_a = user == null ? void 0 : user.app_metadata) == null ? void 0 : _a.is_admin) || (mockUser == null ? void 0 : mockUser.is_admin));
  const defaultBreadcrumbItems = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const items = [];
    items.push({ label: t(ROUTE_LABELS[DASHBOARD]), to: DASHBOARD });
    if (segments.length <= 1) return items;
    const second = segments[1];
    if (second === "explore") {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_EXPLORE]) });
    } else if (second === "profile") {
      items.push({ label: t(ROUTE_LABELS.PROFILE) });
    } else if (second === "scoreboard") {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_SCOREBOARD]) });
    } else if (second === "achievements") {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_ACHIEVEMENTS]) });
    } else if (second === "community-projects") {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_COMMUNITY_PROJECTS]) });
    } else if (second === "admin") {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_ADMIN]) });
      const third = segments[2];
      if (third) {
        const labelMap = {
          paths: t("admin.layout.nav.paths"),
          courses: t("admin.layout.nav.courses"),
          modules: t("admin.layout.nav.modules"),
          lessons: t("admin.layout.nav.lessons"),
          projects: t("admin.layout.nav.projects")
        };
        const label = labelMap[third];
        if (label) {
          items.push({ label });
        }
      }
    } else if (second === "learn") {
      const third = segments[2];
      if (third === "course") {
        items.push({ label: t(ROUTE_LABELS.LEARN), to: DASHBOARD_EXPLORE });
        items.push({ label: t(ROUTE_LABELS.COURSE) });
      } else if (third === "path") {
        items.push({ label: t(ROUTE_LABELS.LEARN), to: DASHBOARD_EXPLORE });
        items.push({ label: t(ROUTE_LABELS.PATH) });
      }
    }
    return items;
  }, [location.pathname, t]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-forge-orange mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: t("dashboard.layout.loading") })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(SidebarProvider, { defaultOpen: false, children: [
    /* @__PURE__ */ jsxs(Sidebar, { collapsible: "icon", children: [
      /* @__PURE__ */ jsx(SidebarRail, {}),
      /* @__PURE__ */ jsx(SidebarHeader, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full", children: [
        /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "flex items-center gap-3", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800",
            alt: "Forge College",
            className: "h-10 w-auto"
          }
        ) }),
        /* @__PURE__ */ jsx(SidebarTrigger, { className: "h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800" })
      ] }) }),
      /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsxs(SidebarMenu, { children: [
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, isActive: isDashboard, tooltip: t("nav.dashboard"), children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD, children: [
          /* @__PURE__ */ jsx(LayoutDashboard, {}),
          /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: t("nav.dashboard") })
        ] }) }) }),
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, isActive: isExplore, tooltip: t("nav.paths"), children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_EXPLORE, children: [
          /* @__PURE__ */ jsx(BookOpen, {}),
          /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: t("nav.paths") })
        ] }) }) }),
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
          SidebarMenuButton,
          {
            asChild: true,
            isActive: isCommunityProjects,
            tooltip: t("nav.communityProjects"),
            children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_COMMUNITY_PROJECTS, children: [
              /* @__PURE__ */ jsx(FolderGit2, {}),
              /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: t("nav.communityProjects") })
            ] })
          }
        ) }),
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, isActive: isScoreboard, tooltip: t("nav.scoreboard"), children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_SCOREBOARD, children: [
          /* @__PURE__ */ jsx(Trophy, {}),
          /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: t("nav.scoreboard") })
        ] }) }) }),
        /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, isActive: isAchievements, tooltip: t("nav.achievements"), children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_ACHIEVEMENTS, children: [
          /* @__PURE__ */ jsx(Award, {}),
          /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: t("nav.achievements") })
        ] }) }) }),
        isAdmin && /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, isActive: isAdminRoute, tooltip: t("nav.admin"), children: /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_ADMIN, children: [
          /* @__PURE__ */ jsx(Shield, {}),
          /* @__PURE__ */ jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: t("nav.admin") })
        ] }) }) })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(SidebarFooter, { className: "p-2", children: /* @__PURE__ */ jsx(ProfileDropdown, {}) })
    ] }),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between px-4 sm:px-6 border-b bg-white border-forge-cream", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(MobileMenuButton, {}),
          headerBreadcrumb ? /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: headerBreadcrumb }) : /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsx(BreadcrumbList, { children: defaultBreadcrumbItems.map((item, index) => {
            const isLast = index === defaultBreadcrumbItems.length - 1;
            return /* @__PURE__ */ jsxs(Fragment$1, { children: [
              /* @__PURE__ */ jsx(BreadcrumbItem, { children: isLast || !item.to ? /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.label }) : /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: item.to, children: item.label }) }) }),
              !isLast && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
            ] }, `${item.label}-${index}`);
          }) }) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-8 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10 pointer-events-none", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-6 right-6 w-32 h-32 bg-forge-cream rounded-full blur-2xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-10 w-24 h-24 bg-forge-orange/10 rounded-full blur-2xl" })
        ] }),
        /* @__PURE__ */ jsx(Outlet, { context: { setHeaderBreadcrumb } })
      ] })
    ] })
  ] });
}
function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    setMessage("");
    try {
      const supabase2 = createClientBrowser();
      const { error: error2 } = await supabase2.auth.updateUser({ password });
      if (error2) throw new Error(error2.message || "Failed to update password");
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3e3);
    } catch (error2) {
      setError(error2.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark text-2xl font-bold", children: "Update Your Password" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("form", { onSubmit: handleUpdatePassword, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-forge-dark font-medium", children: "New Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirm-password", className: "text-forge-dark font-medium", children: "Confirm New Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "confirm-password",
              type: "password",
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: "border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
            }
          )
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200", children: error }),
        message && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200", children: message }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl",
            disabled: loading,
            children: loading ? "Updating..." : "Update Password"
          }
        )
      ] }) }) })
    ] })
  ] });
}
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
function CourseTableOfContents({ course, currentLessonId, onLessonClick }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const allLessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
      const { data, error } = await supabase.from("user_progress").select("lesson_id, status").eq("user_id", user.id).in("lesson_id", allLessonIds);
      if (error) {
        console.error("Error fetching progress:", error);
        return;
      }
      const progressMap = {};
      data.forEach((item) => {
        progressMap[item.lesson_id] = item.status;
      });
      allLessonIds.forEach((lessonId) => {
        if (!progressMap[lessonId]) {
          progressMap[lessonId] = "not_started";
        }
      });
      setProgress(progressMap);
    };
    fetchProgress();
  }, [user, course]);
  const getProgressIcon = (lessonId) => {
    const status = progress[lessonId] || "not_started";
    switch (status) {
      case "completed":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
      case "in_progress":
        return /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 text-blue-600" });
      default:
        return /* @__PURE__ */ jsx(Circle, { className: "h-4 w-4 text-gray-400" });
    }
  };
  const getModuleProgress = (module) => {
    const totalLessons = module.lessons.length;
    const completedLessons = module.lessons.filter(
      (lesson) => progress[lesson.id] === "completed"
    ).length;
    return { completed: completedLessons, total: totalLessons };
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2", children: course.title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: course.description }),
    /* @__PURE__ */ jsx(Accordion, { type: "multiple", defaultValue: course.modules.map((m) => m.id), className: "w-full", children: course.modules.map((module) => {
      const moduleProgress = getModuleProgress(module);
      return /* @__PURE__ */ jsxs(AccordionItem, { value: module.id, children: [
        /* @__PURE__ */ jsx(AccordionTrigger, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full pr-4", children: [
          /* @__PURE__ */ jsx("span", { children: module.title }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
            moduleProgress.completed,
            "/",
            moduleProgress.total
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx("ul", { children: module.lessons.map((lesson) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onLessonClick(lesson),
            className: `w-full text-left p-2 rounded-md flex items-center gap-2 transition-colors ${lesson.id === currentLessonId ? "bg-blue-100 border-l-4 border-blue-500" : "hover:bg-gray-100"}`,
            children: [
              getProgressIcon(lesson.id),
              /* @__PURE__ */ jsx("span", { className: "flex-1", children: lesson.title }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                lesson.xp_value,
                " XP"
              ] })
            ]
          }
        ) }, lesson.id)) }) })
      ] }, module.id);
    }) })
  ] });
}
function TextLesson({ content }) {
  return /* @__PURE__ */ jsx("div", { className: "prose prose-slate max-w-none", children: /* @__PURE__ */ jsx(
    ReactMarkdown,
    {
      components: {
        a: ({ node, ...props }) => /* @__PURE__ */ jsx("a", { ...props, target: "_blank", rel: "noopener noreferrer" })
      },
      children: content
    }
  ) });
}
function VideoLesson({ videoUrl }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const getYouTubeVideoId = (url) => {
    if (!url || typeof url !== "string") return null;
    url = url.trim();
    const patterns = [
      // youtube.com/watch?v=VIDEO_ID
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      // youtu.be/VIDEO_ID
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      // youtube.com/embed/VIDEO_ID
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      // m.youtube.com/watch?v=VIDEO_ID
      /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };
  const getYouTubeEmbedUrl = (videoId2) => {
    const params = new URLSearchParams({
      // Parâmetros baseados na documentação YouTube Player Parameters
      rel: "0",
      // Não mostrar vídeos relacionados ao final
      modestbranding: "1",
      // Branding mínimo do YouTube
      controls: "1",
      // Mostrar controles do player
      showinfo: "0",
      // Não mostrar informações do vídeo (título, uploader)
      fs: "1",
      // Permitir botão de fullscreen
      cc_load_policy: "1",
      // Carregar legendas por padrão
      hl: "pt-BR",
      // Idioma da interface em português brasileiro
      autoplay: "0",
      // Não iniciar autoplay
      disablekb: "0",
      // Permitir controles de teclado
      enablejsapi: "1",
      // Habilitar JavaScript API
      widget_referrer: window.location.origin
      // Referrer para analytics
    });
    return `https://www.youtube.com/embed/${videoId2}?${params.toString()}`;
  };
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-600 font-medium mb-2", children: "URL de vídeo inválida" }),
      /* @__PURE__ */ jsxs("div", { className: "text-red-500 text-sm text-center", children: [
        "Por favor, forneça uma URL válida do YouTube. Formatos suportados:",
        /* @__PURE__ */ jsxs("ul", { className: "mt-2 text-xs space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "• youtube.com/watch?v=ID_DO_VIDEO" }),
          /* @__PURE__ */ jsx("li", { children: "• youtu.be/ID_DO_VIDEO" }),
          /* @__PURE__ */ jsx("li", { children: "• youtube.com/embed/ID_DO_VIDEO" })
        ] })
      ] })
    ] });
  }
  const embedUrl = getYouTubeEmbedUrl(videoId);
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", style: { paddingBottom: "56.25%", height: 0 }, children: [
      isLoading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Carregando vídeo..." })
      ] }) }),
      hasError && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-red-600 font-medium mb-2", children: "Erro ao carregar vídeo" }),
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: "Não foi possível carregar o vídeo. Verifique a URL e sua conexão." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setIsLoading(true);
              setHasError(false);
              const iframe = document.querySelector("iframe[data-youtube-iframe]");
              if (iframe) {
                iframe.src = embedUrl;
              }
            },
            className: "mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm",
            children: "Tentar novamente"
          }
        )
      ] }) }),
      !hasError && /* @__PURE__ */ jsx(
        "iframe",
        {
          "data-youtube-iframe": true,
          src: embedUrl,
          frameBorder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          className: "absolute top-0 left-0 w-full h-full rounded-lg shadow-lg",
          title: "YouTube video player",
          onLoad: handleIframeLoad,
          onError: handleIframeError,
          loading: "lazy"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 text-xs text-gray-500 text-center", children: "Player otimizado para experiência de aprendizado" })
  ] });
}
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
function QuizLesson({ quizData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const currentQuestion = quizData[currentQuestionIndex];
  const handleSubmit = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };
  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz Finished! Your score: ${score}/${quizData.length}`);
    }
  };
  if (!currentQuestion) {
    return /* @__PURE__ */ jsx("div", { className: "text-red-500", children: "No quiz data available." });
  }
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Quiz" }),
      /* @__PURE__ */ jsxs(CardDescription, { children: [
        "Question ",
        currentQuestionIndex + 1,
        " of ",
        quizData.length
      ] })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: currentQuestion.question }),
      /* @__PURE__ */ jsx(RadioGroup, { onValueChange: setSelectedAnswer, value: selectedAnswer, children: currentQuestion.options.map((option, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
        /* @__PURE__ */ jsx(RadioGroupItem, { value: option, id: `option-${index}`, disabled: showResult }),
        /* @__PURE__ */ jsx(Label, { htmlFor: `option-${index}`, children: option })
      ] }, index)) }),
      !showResult && /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: !selectedAnswer, className: "mt-6", children: "Submit Answer" }),
      showResult && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        selectedAnswer === currentQuestion.correctAnswer ? /* @__PURE__ */ jsx("p", { className: "text-green-600 font-semibold", children: "Correct!" }) : /* @__PURE__ */ jsxs("p", { className: "text-red-600 font-semibold", children: [
          "Incorrect. The correct answer was: ",
          currentQuestion.correctAnswer
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: handleNextQuestion, className: "mt-4", children: currentQuestionIndex < quizData.length - 1 ? "Next Question" : "Finish Quiz" })
      ] })
    ] })
  ] });
}
function LessonViewer({ lesson, course, onLessonChange }) {
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);
  const supabase2 = createClientBrowser();
  if (!lesson) {
    return /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { children: "Select a lesson to begin." }) });
  }
  const getAllLessons = () => {
    if (!course) return [];
    return course.modules.flatMap((module) => module.lessons);
  };
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const markAsComplete = async () => {
    if (!user) {
      toast$1.error("You need to be logged in to track progress");
      return;
    }
    setIsCompleting(true);
    try {
      const { error } = await supabase2.from("user_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lesson.id,
          status: "completed",
          completed_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        { onConflict: "user_id,lesson_id" }
      );
      if (error) throw new Error(error.message || "Failed to save progress");
      toast$1.success("Lesson marked as completed!");
      if (nextLesson) {
        onLessonChange(nextLesson);
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      toast$1.error("Error marking lesson as completed");
    } finally {
      setIsCompleting(false);
    }
  };
  const renderLessonContent = () => {
    switch (lesson.lesson_type) {
      case "text":
        return /* @__PURE__ */ jsx(TextLesson, { content: lesson.content });
      case "video":
        return /* @__PURE__ */ jsx(VideoLesson, { videoUrl: lesson.content });
      case "quiz":
        return /* @__PURE__ */ jsx(QuizLesson, { quizData: typeof lesson.content === "string" ? JSON.parse(lesson.content) : lesson.content });
      default:
        return /* @__PURE__ */ jsxs("div", { className: "text-red-500", children: [
          "Unsupported lesson type: ",
          lesson.lesson_type
        ] });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col p-6 bg-white", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: lesson.title }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mt-2", children: [
        "Lesson ",
        currentIndex + 1,
        " of ",
        allLessons.length,
        " • ",
        lesson.xp_value,
        " XP"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: renderLessonContent() }),
    /* @__PURE__ */ jsxs("footer", { className: "mt-6 border-t pt-4 flex justify-between", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: () => previousLesson && onLessonChange(previousLesson),
          disabled: !previousLesson,
          children: "Previous lesson"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: markAsComplete,
          disabled: isCompleting,
          children: isCompleting ? "Saving..." : nextLesson ? "Complete and Continue" : "Mark as Completed"
        }
      )
    ] })
  ] });
}
const __vite_import_meta_env__ = {};
function normalizeContext({ courseTitle, lessonTitle, lessonType, lessonContent }) {
  let body = "";
  if (typeof lessonContent === "string") body = lessonContent;
  else if (lessonContent) body = JSON.stringify(lessonContent);
  const header = `Course: ${courseTitle || ""}
Lesson: ${lessonTitle || ""}
Type: ${lessonType || ""}`.trim();
  return `${header}

${body}`.slice(0, 8e3);
}
function LessonAIChat(props) {
  const contextText = useMemo(() => normalizeContext(props), [props.courseTitle, props.lessonTitle, props.lessonType, props.lessonContent]);
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const listRef = useRef(null);
  const clientKey = __vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_OPENAI_API_KEY;
  const clientModel = (__vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_OPENAI_MODEL) || "gpt-4o-mini";
  const fetchSuggestionsClient = async () => {
    var _a, _b, _c, _d;
    if (!clientKey) return null;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${clientKey}` },
        body: JSON.stringify({
          model: clientModel,
          messages: [
            { role: "system", content: "You are an expert course assistant. Generate three concise, distinct, helpful questions based on the provided lesson context. Return ONLY a JSON array of three strings." },
            { role: "user", content: `Lesson context (may be truncated):

${contextText}` }
          ],
          temperature: 0.7,
          max_tokens: 256
        })
      });
      const raw = await res.text();
      if (!res.ok) {
        console.error("AI suggest client error:", raw);
        return null;
      }
      let text = "";
      try {
        text = ((_d = (_c = (_b = (_a = JSON.parse(raw)) == null ? void 0 : _a.choices) == null ? void 0 : _b[0]) == null ? void 0 : _c.message) == null ? void 0 : _d.content) || "";
      } catch {
        text = "";
      }
      const cleaned = text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
      let list = [];
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          const arr = JSON.parse(match[0]);
          if (Array.isArray(arr)) list = arr;
        } catch {
        }
      }
      if (!list.length) {
        list = cleaned.split("\n").map((s) => s.replace(/^[-*\d.\s]+/, "").replace(/^\"|\",?$/g, "").replace(/,$/, "").trim()).filter(Boolean);
      }
      return list.map((s) => s.replace(/^\"|\"$/g, "").trim()).slice(0, 3);
    } catch (e) {
      console.error("AI suggest client exception:", e);
      return null;
    }
  };
  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      setSuggestions([]);
      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "suggest", lessonContext: contextText })
        });
        if (!res.ok) {
          console.error("AI suggest error status:", res.status, res.statusText);
          const fallback = await fetchSuggestionsClient();
          if (fallback) setSuggestions(fallback);
          return;
        }
        let data = null;
        try {
          data = await res.json();
        } catch (err) {
          console.error("AI suggest parse error (json)");
          return;
        }
        if (Array.isArray(data == null ? void 0 : data.suggestions)) setSuggestions(data.suggestions);
      } catch (e) {
        console.error("AI suggest exception:", e);
        const fallback = await fetchSuggestionsClient();
        if (fallback) setSuggestions(fallback);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, [contextText]);
  useEffect(() => {
    var _a;
    (_a = listRef.current) == null ? void 0 : _a.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  const send = async (text) => {
    var _a, _b, _c;
    if (!text.trim()) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          lessonContext: contextText,
          messages: [{ role: "user", content: text.trim() }]
        })
      });
      if (!res.ok) {
        if (clientKey) {
          try {
            const cres = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${clientKey}` },
              body: JSON.stringify({
                model: clientModel,
                messages: [
                  { role: "system", content: 'You are "AI Instructor", a concise, friendly tutor for software and blockchain courses.' },
                  { role: "system", content: `Lesson context: ${contextText}` },
                  { role: "user", content: text.trim() }
                ],
                temperature: 0.5,
                max_tokens: 700
              })
            });
            if (cres.ok) {
              const cjson = await cres.json().catch(() => null);
              const reply2 = ((_c = (_b = (_a = cjson == null ? void 0 : cjson.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) || "";
              setMessages((m) => [...m, { role: "assistant", content: reply2 || "No reply" }]);
              return;
            }
          } catch (fe) {
            console.error("AI chat client exception:", fe);
          }
        }
        const msg = `Error: ${res.status} ${res.statusText}`;
        setMessages((m) => [...m, { role: "assistant", content: msg }]);
        return;
      }
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      const reply = (data == null ? void 0 : data.reply) || "Sorry, I could not generate an answer.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error("AI chat exception:", e);
      setMessages((m) => [...m, { role: "assistant", content: "There was an error contacting the AI service." }]);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "h-full max-h-full flex flex-col text-xs", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4 text-forge-dark" }),
      /* @__PURE__ */ jsx("span", { children: "AI Instructor" })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex-1 min-h-0 flex flex-col gap-3 text-xs", children: [
      /* @__PURE__ */ jsxs("div", { ref: listRef, className: "flex-1 min-h-0 overflow-y-auto rounded-md border p-3 bg-white flex flex-col gap-2", children: [
        suggestionsLoading && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: "Loading suggestions..." }),
        !!suggestions.length && !suggestionsLoading && /* @__PURE__ */ jsx("div", { className: "grid gap-2", children: suggestions.map((q, i) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => send(q),
            className: "w-full text-left border rounded-lg p-3 bg-white hover:bg-forge-cream transition-colors shadow-sm",
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground mb-1", children: "Suggestion" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: q })
            ]
          },
          i
        )) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        messages.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Hint: Click on a suggested question or ask yours." }),
        messages.map((m, i) => /* @__PURE__ */ jsxs("div", { className: m.role === "user" ? "text-right" : "text-left", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1 text-muted-foreground", children: m.role === "user" ? "Me:" : "Instructor:" }),
          /* @__PURE__ */ jsx("div", { className: "inline-block rounded-lg px-3 py-2 text-xs break-words whitespace-pre-wrap text-left " + (m.role === "user" ? "bg-forge-orange text-white max-w-[70%]" : "bg-forge-cream text-forge-dark"), children: m.content })
        ] }, i)),
        loading && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Thinking..." })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            send(input);
          },
          className: "flex gap-2",
          children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Ask me about this lesson...",
                value: input,
                onChange: (e) => setInput(e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: "Send" })
          ]
        }
      )
    ] })
  ] });
}
const Dialog = SheetPrimitive.Root;
const DialogPortal = SheetPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = SheetPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = SheetPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = SheetPrimitive.Description.displayName;
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // New semantic variants
        success: "border-transparent bg-success text-white hover:bg-success/80",
        warning: "border-transparent bg-warning text-white hover:bg-warning/80",
        info: "border-transparent bg-info text-white hover:bg-info/80",
        error: "border-transparent bg-error text-white hover:bg-error/80",
        // Brand variants
        brand: "border-transparent bg-forge-orange text-white hover:bg-forge-orange-500",
        "brand-subtle": "border-forge-orange/20 bg-forge-orange-50 text-forge-orange-600 hover:bg-forge-orange-100",
        // Additional variants
        "coming-soon": "border-transparent bg-info-100 text-info-700 hover:bg-info-200",
        enrolled: "border-transparent bg-forge-orange-100 text-forge-orange-700 hover:bg-forge-orange-200 ring-1 ring-forge-orange/20"
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm"
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rounded"
    }
  }
);
function Badge({
  className,
  variant,
  size,
  shape,
  icon: Icon,
  iconPosition = "left",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn(badgeVariants({ variant, size, shape }), className), ...props, children: [
    Icon && iconPosition === "left" && /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
    children,
    Icon && iconPosition === "right" && /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" })
  ] });
}
const sanitizeHtml = (value) => (value ?? "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
function ModuleProjectsPanel({
  moduleTitle,
  projects: projects2,
  submissions,
  submittingProjectId,
  onSubmit,
  communityLink
}) {
  const { t } = useTranslation();
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [error, setError] = useState(null);
  const activeProject = useMemo(() => projects2.find((project) => project.id === activeProjectId) ?? null, [
    activeProjectId,
    projects2
  ]);
  useEffect(() => {
    if (!activeProject) {
      setRepositoryUrl("");
      setError(null);
      return;
    }
    const submission = submissions[activeProject.id];
    setRepositoryUrl((submission == null ? void 0 : submission.repository_url) ?? "");
    setError(null);
  }, [activeProject, submissions]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!activeProject) return;
    if (!repositoryUrl.trim()) {
      setError(t("projects.errors.required"));
      return;
    }
    try {
      const parsed = new URL(repositoryUrl.trim());
      if (!parsed.hostname.includes("github.com")) {
        setError(t("projects.errors.githubOnly"));
        return;
      }
    } catch (error2) {
      console.error("Invalid repository url", error2);
      setError(t("projects.errors.invalidUrl"));
      return;
    }
    setError(null);
    try {
      await onSubmit(activeProject.id, repositoryUrl.trim());
      setActiveProjectId(null);
    } catch (error2) {
      console.error("Project submission failed", error2);
      setError(t("projects.errors.submitFailed"));
    }
  };
  if (projects2.length === 0) {
    return /* @__PURE__ */ jsx(Card, { className: "border border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center justify-between gap-3 p-5 text-sm text-forge-gray", children: [
      /* @__PURE__ */ jsx("span", { children: t("projects.module.noProjects") }),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: communityLink, children: [
        t("projects.module.communityLink"),
        /* @__PURE__ */ jsx(ExternalLink, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(Card, { className: "border border-forge-cream/70 bg-white/90", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-forge-dark", children: [
          /* @__PURE__ */ jsx(FolderGit2, { className: "h-5 w-5 text-forge-orange" }),
          t("projects.module.title", { module: moduleTitle })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: t("projects.module.subtitle") })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: communityLink, children: [
        t("projects.module.communityLink"),
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: projects2.map((project) => {
      const submission = submissions[project.id];
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "rounded-lg border border-forge-cream/60 bg-white/80 p-4 shadow-sm",
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "rounded-full bg-forge-orange/10 px-2 py-0.5 text-xs font-medium text-forge-orange", children: t("projects.module.projectOrder", { order: project.order }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-forge-dark", children: project.title }),
                typeof project.xp_value === "number" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-forge-cream text-forge-dark", children: t("projects.module.xpValue", { xp: project.xp_value }) })
              ] }),
              project.description && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "prose prose-sm max-w-none text-forge-gray",
                  dangerouslySetInnerHTML: { __html: sanitizeHtml(project.description) }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-2 md:items-end", children: [
              /* @__PURE__ */ jsx(Button, { onClick: () => setActiveProjectId(project.id), children: submission ? t("projects.module.updateSubmission") : t("projects.module.startProject") }),
              submission && /* @__PURE__ */ jsxs("div", { className: "text-xs text-forge-gray/80", children: [
                t("projects.module.yourSubmission"),
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: submission.repository_url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "font-medium text-forge-orange hover:underline",
                    children: submission.repository_url
                  }
                )
              ] })
            ] })
          ] })
        },
        project.id
      );
    }) }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(activeProject), onOpenChange: (open) => !open && setActiveProjectId(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: activeProject ? t("projects.module.dialog.title", { project: activeProject.title }) : "" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: t("projects.module.dialog.subtitle") })
      ] }),
      activeProject && /* @__PURE__ */ jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [
        activeProject.description && /* @__PURE__ */ jsx("div", { className: "max-h-64 overflow-y-auto rounded-md border border-forge-cream/60 bg-forge-cream/20 p-4 text-sm text-forge-dark", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: sanitizeHtml(activeProject.description) } }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-forge-dark", htmlFor: "repository-url", children: t("projects.module.dialog.repositoryLabel") }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "repository-url",
              value: repositoryUrl,
              onChange: (event) => setRepositoryUrl(event.target.value),
              placeholder: t("projects.module.dialog.repositoryPlaceholder")
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-forge-gray/80", children: t("projects.module.dialog.repositoryHelp") })
        ] }),
        error && /* @__PURE__ */ jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx(AlertDescription, { children: error }) }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setActiveProjectId(null), children: t("common.buttons.cancel") }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: submittingProjectId === activeProject.id, children: submittingProjectId === activeProject.id ? t("projects.module.dialog.submitting") : t("projects.module.dialog.submit") })
        ] })
      ] })
    ] }) })
  ] });
}
function CourseView() {
  var _a;
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(null);
  const supabase2 = createClientBrowser();
  const queryClient = useQueryClient();
  const { setHeaderBreadcrumb } = useOutletContext();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: course, isLoading } = useQuery({
    queryKey: ["courseView", courseId],
    enabled: Boolean(courseId),
    queryFn: async () => {
      const { data: courseData, error } = await supabase2.from("courses").select(`
          id, title, description,
          modules:modules(id, title, order,
            lessons:lessons(id, title, content, lesson_type, order, xp_value),
            projects:module_projects(id, title, description, xp_value, is_active, created_at)
          )
        `).eq("id", courseId).single();
      if (error) throw new Error(error.message || "Failed to load course");
      const typedCourse = courseData;
      const normalized = {
        id: typedCourse.id,
        title: typedCourse.title,
        description: typedCourse.description,
        modules: (typedCourse.modules ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((module) => ({
          id: module.id,
          title: module.title,
          lessons: (module.lessons ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            lesson_type: lesson.lesson_type,
            xp_value: lesson.xp_value ?? 0
          })),
          projects: (module.projects ?? []).slice().filter((project) => project.is_active ?? true).sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            if (dateA !== dateB) return dateA - dateB;
            return a.title.localeCompare(b.title);
          }).map((project, index) => ({
            id: project.id,
            title: project.title,
            description: project.description ?? "",
            order: index + 1,
            xp_value: project.xp_value ?? null
          }))
        }))
      };
      if (normalized.modules.length && normalized.modules[0].lessons.length) {
        setCurrentLesson(normalized.modules[0].lessons[0]);
      }
      return normalized;
    }
  });
  const projectIds = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((module) => module.projects.map((project) => project.id));
  }, [course]);
  const sortedProjectIds = useMemo(() => {
    if (projectIds.length === 0) return [];
    return Array.from(new Set(projectIds)).sort();
  }, [projectIds]);
  const projectIdsKey = useMemo(() => sortedProjectIds.join(","), [sortedProjectIds]);
  const { data: submissionsMap = {} } = useQuery({
    queryKey: ["module-project-submissions", user == null ? void 0 : user.id, projectIdsKey],
    enabled: Boolean(user && sortedProjectIds.length > 0),
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase2.from("module_project_submissions").select("project_id, repository_url, submitted_at").eq("user_id", user.id).in("project_id", sortedProjectIds);
      if (error) throw error;
      const map = {};
      for (const item of data ?? []) {
        map[item.project_id] = {
          repository_url: item.repository_url,
          submitted_at: item.submitted_at
        };
      }
      return map;
    },
    onError: (error) => {
      console.error("Failed to load project submissions", error);
      toast$1.error(t("projects.notifications.fetchError"));
    }
  });
  const submitMutation = useMutation({
    mutationFn: async ({ projectId, repositoryUrl }) => {
      if (!user) throw new Error("AUTH_REQUIRED");
      const { error } = await supabase2.from("module_project_submissions").upsert(
        {
          project_id: projectId,
          user_id: user.id,
          repository_url: repositoryUrl,
          submitted_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        { onConflict: "project_id,user_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["module-project-submissions", user == null ? void 0 : user.id, projectIdsKey] });
      toast$1.success(
        t(variables.isUpdate ? "projects.notifications.updated" : "projects.notifications.submitted")
      );
    },
    onError: (error) => {
      if (error instanceof Error && error.message === "AUTH_REQUIRED") {
        toast$1.error(t("projects.errors.loginRequired"));
        return;
      }
      console.error("Project submission failed", error);
      toast$1.error(t("projects.notifications.submitError"));
    }
  });
  const handleProjectSubmit = useCallback(
    async (projectId, repositoryUrl) => {
      const isUpdate = Boolean(submissionsMap[projectId]);
      await submitMutation.mutateAsync({ projectId, repositoryUrl, isUpdate });
    },
    [submissionsMap, submitMutation]
  );
  const submittingProjectId = ((_a = submitMutation.variables) == null ? void 0 : _a.projectId) ?? null;
  useEffect(() => {
    if (!course) return;
    const crumb = /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD, children: t("nav.dashboard") }) }) }),
      /* @__PURE__ */ jsx(BreadcrumbSeparator, {}),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD_EXPLORE, children: t("nav.paths") }) }) }),
      /* @__PURE__ */ jsx(BreadcrumbSeparator, {}),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: course.title }) }),
      currentLesson && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(BreadcrumbSeparator, {}),
        /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: currentLesson.title }) })
      ] })
    ] }) });
    setHeaderBreadcrumb(crumb);
    return () => setHeaderBreadcrumb(null);
  }, [course == null ? void 0 : course.title, currentLesson == null ? void 0 : currentLesson.title, setHeaderBreadcrumb, t]);
  const currentModule = useMemo(() => {
    if (!course || !currentLesson) return null;
    return course.modules.find((module) => module.lessons.some((lesson) => lesson.id === currentLesson.id)) ?? null;
  }, [course, currentLesson]);
  const isLastLessonInModule = useMemo(() => {
    if (!currentModule || !currentLesson) return false;
    if (currentModule.lessons.length === 0) return false;
    const lastLesson = currentModule.lessons[currentModule.lessons.length - 1];
    return lastLesson.id === currentLesson.id;
  }, [currentLesson, currentModule]);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 xl:flex-row", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full xl:w-80 xl:shrink-0 xl:border xl:rounded-md xl:bg-white", children: isLoading || !course ? /* @__PURE__ */ jsx("div", { className: "p-4 text-gray-500", children: t("common.buttons.loading") }) : /* @__PURE__ */ jsx(
      CourseTableOfContents,
      {
        course,
        currentLessonId: currentLesson == null ? void 0 : currentLesson.id,
        onLessonClick: setCurrentLesson
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "border rounded-md bg-white min-h-[60vh]", children: /* @__PURE__ */ jsx(LessonViewer, { lesson: currentLesson, course: course ?? null, onLessonChange: setCurrentLesson }) }),
      currentModule && isLastLessonInModule && /* @__PURE__ */ jsx(
        ModuleProjectsPanel,
        {
          moduleTitle: currentModule.title,
          projects: currentModule.projects,
          submissions: submissionsMap,
          submittingProjectId,
          onSubmit: handleProjectSubmit,
          communityLink: DASHBOARD_COMMUNITY_PROJECTS
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden w-full xl:flex xl:flex-col xl:w-96 xl:shrink-0 xl:sticky xl:top-6 xl:self-start xl:h-[calc(100vh-7rem)] xl:max-h-[calc(100vh-7rem)]", children: /* @__PURE__ */ jsx(
      LessonAIChat,
      {
        courseTitle: course == null ? void 0 : course.title,
        lessonTitle: currentLesson == null ? void 0 : currentLesson.title,
        lessonType: currentLesson == null ? void 0 : currentLesson.lesson_type,
        lessonContent: currentLesson == null ? void 0 : currentLesson.content
      }
    ) })
  ] });
}
const getButtonClasses = (variant, size) => {
  const baseClasses = "relative group inline-flex items-center justify-center overflow-hidden rounded-2xl font-semibold transition-all duration-200 transform hover:scale-[1.02]";
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  const variantClasses = {
    primary: "bg-forge-orange text-white hover:bg-forge-orange-light shadow-lg hover:shadow-xl",
    secondary: "bg-forge-dark text-white hover:bg-forge-dark/90 shadow-lg hover:shadow-xl",
    outline: "border-2 border-forge-orange text-forge-orange hover:bg-forge-orange hover:text-white",
    ghost: "text-forge-dark hover:bg-forge-cream/50"
  };
  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};
const EnhancedButton = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  withGradient = false,
  withIcon = false,
  className,
  asChild = false,
  ...props
}) => {
  var _a, _b;
  const gradientOverlay = withGradient && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-forge-orange to-forge-orange-light opacity-0 group-hover:opacity-100 transition-opacity duration-200" });
  const defaultIcon = withIcon && !icon && /* @__PURE__ */ jsx(Flame, { size: 16 });
  const displayIcon = icon || defaultIcon;
  if (asChild && React.isValidElement(children)) {
    const childElement = children;
    const mergedClassName = cn(
      getButtonClasses(variant, size),
      (_a = childElement.props) == null ? void 0 : _a.className,
      className
    );
    return React.cloneElement(
      childElement,
      {
        ...props,
        className: mergedClassName
      },
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "relative z-10 inline-flex items-center gap-2", children: [
          displayIcon,
          (_b = childElement.props) == null ? void 0 : _b.children
        ] }),
        gradientOverlay
      ] })
    );
  }
  return /* @__PURE__ */ jsxs("button", { className: cn(getButtonClasses(variant, size), className), ...props, children: [
    /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-2", children: [
      displayIcon,
      children
    ] }),
    gradientOverlay
  ] });
};
function PathOverview() {
  const { pathId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const supabase2 = createClientBrowser();
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["pathOverview", pathId, user == null ? void 0 : user.id],
    enabled: Boolean(pathId),
    queryFn: async () => {
      const { data: pathData, error: pathError } = await supabase2.from("learning_paths").select("id, title, description, courses(id, title, description)").eq("id", pathId).single();
      if (pathError) throw pathError;
      const path2 = {
        id: pathData.id,
        title: pathData.title,
        description: pathData.description,
        courses: (pathData.courses || []).map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description
        }))
      };
      let isEnrolled2 = false;
      if (user) {
        const { data: enroll, error: enrollErr } = await supabase2.from("user_enrollments").select("learning_path_id").eq("user_id", user.id).eq("learning_path_id", pathId).eq("is_active", true).maybeSingle();
        if (!enrollErr) isEnrolled2 = Boolean(enroll);
      }
      return { path: path2, isEnrolled: isEnrolled2 };
    }
  });
  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user || !pathId) throw new Error(t("dashboard.errors.notAuthenticated"));
      const { error: error2 } = await supabase2.from("user_enrollments").insert({ user_id: user.id, learning_path_id: pathId });
      if (error2) throw new Error(error2.message || t("dashboard.errors.failedToEnroll"));
    },
    onSuccess: () => {
      toast$1.success(t("dashboard.pathOverview.continue"));
      queryClient.invalidateQueries({ queryKey: ["availablePaths"] });
      queryClient.invalidateQueries({ queryKey: ["myPaths"] });
      queryClient.invalidateQueries({ queryKey: ["pathOverview"] });
    },
    onError: () => toast$1.error(t("dashboard.enrollError"))
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [...Array(2)].map((_, i) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "h-20 bg-gray-100 rounded" })
    ] }) }) }, i)) });
  }
  if (error) {
    console.error("Supabase error loading path overview:", error);
  }
  if (!data) {
    return /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: t("dashboard.pathOverview.notFound") });
  }
  const { path, isEnrolled } = data;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center px-2 py-1 rounded bg-forge-orange/10 text-forge-orange text-xs font-medium", children: t("dashboard.pathOverview.badge") }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mt-2 text-forge-dark", children: path.title }),
      path.description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-forge-gray", children: path.description })
    ] }),
    !isEnrolled ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      EnhancedButton,
      {
        onClick: () => enrollMutation.mutate(),
        disabled: !user || enrollMutation.isPending,
        withGradient: true,
        children: enrollMutation.isPending ? t("dashboard.enrolling") : t("dashboard.enroll")
      }
    ) }) : /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(EnhancedButton, { asChild: true, withGradient: true, children: /* @__PURE__ */ jsx(Link, { to: path.courses[0] ? DASHBOARD_LEARN_COURSE(path.courses[0].id) : "#", children: t("dashboard.pathOverview.continue") }) }) }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: t("dashboard.pathOverview.courses") }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: path.courses.map((course) => /* @__PURE__ */ jsxs(Card, { className: "border-forge-cream", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark", children: course.title }),
          course.description && /* @__PURE__ */ jsx(CardDescription, { className: "text-forge-gray", children: course.description })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(EnhancedButton, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_COURSE(course.id), children: t("dashboard.viewDetails") }) }) })
      ] }, course.id)) })
    ] })
  ] });
}
function LoadingCard({
  className,
  showHeader = true,
  showFooter = false,
  contentLines = 3,
  showAvatar = false,
  ...props
}) {
  return /* @__PURE__ */ jsxs(Card, { className: cn("", className), ...props, children: [
    showHeader && /* @__PURE__ */ jsx(CardHeader, { className: "space-y-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/2" })
      ] }),
      showAvatar && /* @__PURE__ */ jsx(SkeletonCircle, { size: "md" })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: showHeader ? "pt-0" : "", children: /* @__PURE__ */ jsx(SkeletonText, { lines: contentLines }) }),
    showFooter && /* @__PURE__ */ jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-24" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-24" })
    ] }) })
  ] });
}
function LoadingGrid({
  className,
  count: count2 = 6,
  columns = { sm: 1, md: 2, lg: 3 },
  aspectRatio = "video",
  showContent = true,
  ...props
}) {
  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]"
  };
  const gridClasses = [
    columns.sm && `grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("div", { className: cn("grid gap-card-gap", gridClasses, className), ...props, children: Array.from({ length: count2 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: cn("w-full", aspectRatios[aspectRatio]), shape: "lg" }),
    showContent && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-3/4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/2" })
    ] })
  ] }, i)) });
}
function AvailablePaths({ limit, className }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [enrollingId, setEnrollingId] = useState(null);
  const queryClient = useQueryClient();
  const supabase2 = createClientBrowser();
  const { data: paths = [], isLoading } = useQuery({
    queryKey: ["availablePaths", user == null ? void 0 : user.id],
    enabled: true,
    staleTime: 6e4,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async () => {
      const { data: pathsData, error: pathsError } = await supabase2.from("learning_paths").select(`
          id, title, description, status,
          courses!inner(id)
        `).eq("status", "published");
      if (pathsError) throw pathsError;
      let enrolledPaths = [];
      if (user) {
        const { data: enrollments, error: enrollmentError } = await supabase2.from("user_enrollments").select("learning_path_id").eq("user_id", user.id).eq("is_active", true);
        if (enrollmentError) {
          console.error("Error fetching enrollments:", enrollmentError);
        } else {
          enrolledPaths = (enrollments || []).map((e) => e.learning_path_id);
        }
      }
      return (pathsData || []).map((path) => ({
        id: path.id,
        title: path.title,
        description: path.description,
        status: path.status,
        isEnrolled: enrolledPaths.includes(path.id),
        courseCount: path.courses.length
      }));
    }
  });
  const enrollMutation = useMutation({
    mutationFn: async (pathId) => {
      if (!user) throw new Error(t("dashboard.errors.notAuthenticated"));
      const { error } = await supabase2.from("user_enrollments").insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw new Error(error.message || t("dashboard.errors.failedToEnroll"));
      return pathId;
    },
    onMutate: (pathId) => {
      setEnrollingId(pathId);
    },
    onSuccess: () => {
      toast$1.success(t("dashboard.enrollSuccess"));
      queryClient.invalidateQueries({ queryKey: ["availablePaths"] });
      queryClient.invalidateQueries({ queryKey: ["myPaths"] });
    },
    onError: (error) => {
      console.error("Error enrolling:", error);
      toast$1.error(t("dashboard.enrollError"));
    },
    onSettled: () => setEnrollingId(null)
  });
  const handleEnroll = async (pathId) => {
    if (!user) {
      toast$1.error(t("dashboard.mustLoginToEnroll"));
      return;
    }
    enrollMutation.mutate(pathId);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(
      LoadingGrid,
      {
        count: limit || 6,
        columns: { sm: 1, md: 2, lg: 3 },
        aspectRatio: "portrait",
        showContent: true
      }
    );
  }
  const visiblePaths = typeof limit === "number" && limit > 0 ? paths.slice(0, limit) : paths;
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch", children: visiblePaths.map((path) => /* @__PURE__ */ jsxs(
    Card,
    {
      className: `relative overflow-hidden border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[300px] flex flex-col ${path.isEnrolled ? "ring-1 ring-forge-orange/20" : ""}`,
      children: [
        path.isEnrolled && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "enrolled",
            size: "sm",
            icon: Flame,
            iconPosition: "left",
            children: t("dashboard.availablePaths.enrolledBadge")
          }
        ) }),
        /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 mt-0.5 text-forge-orange shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: path.title })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-[13px] text-forge-gray line-clamp-3 min-h-[3.75rem]", children: path.description }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-forge-gray", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5 text-forge-orange" }),
            t("dashboard.availablePaths.courses", { count: path.courseCount || 0 })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-2 mt-auto", children: path.isEnrolled ? /* @__PURE__ */ jsx(EnhancedButton, { className: "w-full text-sm py-2", size: "sm", withGradient: true, asChild: true, children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_PATH(path.id), children: t("common.buttons.continueLearning") }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            EnhancedButton,
            {
              onClick: () => handleEnroll(path.id),
              disabled: enrollingId === path.id || !user,
              className: "w-full text-sm py-2",
              variant: "outline",
              size: "sm",
              children: enrollingId === path.id ? t("dashboard.enrolling") : t("dashboard.enroll")
            }
          ),
          user && /* @__PURE__ */ jsx(EnhancedButton, { variant: "ghost", size: "sm", className: "w-full", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_PATH(path.id), children: t("dashboard.viewDetails") }) })
        ] }) })
      ]
    },
    path.id
  )) }) });
}
function LogoutButton({
  className = "",
  variant = "default",
  children
}) {
  const { signOut, loading } = useOAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  if (variant === "minimal") {
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSignOut,
        disabled: loading,
        className: `text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 ${className}`,
        children: children || "Sign out"
      }
    );
  }
  if (variant === "icon") {
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSignOut,
        disabled: loading,
        className: `p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full disabled:opacity-50 ${className}`,
        title: "Sign out",
        children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: handleSignOut,
      disabled: loading,
      className: `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-forge-orange hover:bg-forge-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forge-orange disabled:opacity-50 disabled:cursor-not-allowed ${className}`,
      children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
        ] }),
        "Signing out..."
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) }),
        children || "Sign out"
      ] })
    }
  );
}
const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  if (loading) {
    return null;
  }
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname === "/login-oauth";
  if (isDashboardRoute) {
    return null;
  }
  if (isLoginPage) {
    return /* @__PURE__ */ jsx("nav", { className: "fixed top-4 left-0 right-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "flex justify-start items-center h-20", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800",
        alt: "Forge College",
        className: "h-12 w-auto",
        style: { minWidth: "120px" }
      }
    ) }) }) }) });
  }
  const landingPageNavItems = [
    { path: "/old/hidden/index", label: t("nav.forProfessionals") },
    { path: "/companies", label: t("nav.forCompanies") },
    { path: "/investors", label: t("nav.forInvestors") }
  ];
  return /* @__PURE__ */ jsx("nav", { className: "fixed top-4 left-0 right-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsOpen(!isOpen),
            className: "text-forge-dark hover:text-forge-orange transition-colors p-2 bg-forge-cream/95 backdrop-blur-sm rounded-xl border border-forge-orange/20 shadow-lg",
            "aria-label": isOpen ? "Close menu" : "Open menu",
            children: isOpen ? /* @__PURE__ */ jsx(X, { size: 24 }) : /* @__PURE__ */ jsx(Menu, { size: 24 })
          }
        ) }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800",
            alt: "Forge College",
            className: "h-12 w-auto",
            style: { minWidth: "120px" }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center bg-forge-cream/95 backdrop-blur-sm rounded-2xl border border-forge-orange/20 shadow-lg overflow-hidden", children: landingPageNavItems.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.path,
            className: `px-6 py-3 text-sm font-semibold transition-all duration-300 relative group ${location.pathname === item.path ? "text-white" : "text-forge-gray hover:text-forge-dark"}`,
            children: [
              location.pathname === item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-orange rounded-full m-1 -z-10" }),
              location.pathname !== item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
              item.label
            ]
          }
        ),
        index < landingPageNavItems.length - 1 && /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-forge-gray/30" })
      ] }, item.path)) }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center space-x-3", children: user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/dashboard",
            className: "bg-forge-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-dark/80 transition-colors shadow-lg",
            children: t("nav.dashboard")
          }
        ),
        /* @__PURE__ */ jsx(ProfileDropdown, {})
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/login",
            className: "text-forge-orange transition-colors px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-cream/50",
            children: t("common.buttons.signIn")
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/signup",
            className: "bg-forge-orange text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-forge-orange-dark transition-colors shadow-lg border border-forge-orange",
            children: t("common.buttons.signUp")
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden w-6" })
    ] }),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden py-6 bg-forge-cream/95 backdrop-blur-sm rounded-2xl mx-4 mt-4 border border-forge-orange/20 shadow-lg overflow-hidden", children: [
      landingPageNavItems.map((item, index) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.path,
            onClick: () => setIsOpen(false),
            className: `block py-4 px-6 text-base font-semibold transition-colors relative group ${location.pathname === item.path ? "text-white" : "text-forge-gray hover:text-forge-dark"}`,
            children: [
              location.pathname === item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-orange rounded-full m-1 -z-10" }),
              location.pathname !== item.path && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-forge-dark/20 rounded-full m-1 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
              item.label
            ]
          }
        ),
        index < landingPageNavItems.length - 1 && /* @__PURE__ */ jsx("div", { className: "h-px bg-forge-gray/30 mx-6" })
      ] }, item.path)),
      user ? /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-4 space-y-3 px-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/dashboard",
            onClick: () => setIsOpen(false),
            className: "block text-center py-3 px-6 rounded-lg text-base font-medium bg-forge-dark text-white hover:bg-forge-dark/80 transition-colors shadow-lg",
            children: t("nav.dashboard")
          }
        ),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ProfileDropdown, {}) }),
        /* @__PURE__ */ jsx(LogoutButton, { className: "w-full py-3 rounded-lg" })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-4 space-y-3 px-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/login",
            onClick: () => setIsOpen(false),
            className: "block text-center py-3 px-6 rounded-lg text-base font-medium text-forge-orange hover:bg-forge-orange/10 transition-colors",
            children: t("common.buttons.signIn")
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/signup",
            onClick: () => setIsOpen(false),
            className: "block text-center py-3 px-6 rounded-full text-base font-semibold bg-forge-orange text-white hover:bg-forge-orange-dark transition-colors shadow-lg border border-forge-orange",
            children: t("common.buttons.signUp")
          }
        )
      ] })
    ] })
  ] }) });
};
function PublicLayout() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
const emptyStateVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    size: {
      sm: "py-8 px-4",
      md: "py-12 px-6",
      lg: "py-16 px-8"
    }
  },
  defaultVariants: {
    size: "md"
  }
});
const emptyStateIconVariants = cva("rounded-full flex items-center justify-center mb-4", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      search: "bg-info-100 text-info-600",
      error: "bg-error-100 text-error-600",
      "no-data": "bg-muted text-muted-foreground",
      success: "bg-success-100 text-success-600"
    },
    size: {
      sm: "h-12 w-12",
      md: "h-16 w-16",
      lg: "h-20 w-20"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
});
const defaultIcons = {
  default: Inbox,
  search: Search,
  error: AlertCircle,
  "no-data": FileX,
  success: Inbox
};
const EmptyState = React.forwardRef(
  ({
    className,
    size = "md",
    variant = "default",
    icon,
    title,
    description,
    action,
    secondaryAction,
    iconSize,
    ...props
  }, ref) => {
    const Icon = icon || defaultIcons[variant || "default"];
    const effectiveIconSize = iconSize || size;
    const iconSizes = {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10"
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: cn(emptyStateVariants({ size }), className),
        role: "status",
        "aria-live": "polite",
        ...props,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(emptyStateIconVariants({ variant, size: effectiveIconSize })),
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx(Icon, { className: iconSizes[effectiveIconSize || "md"] })
            }
          ),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: cn(
                "font-semibold tracking-tight text-foreground",
                size === "sm" && "text-lg",
                size === "md" && "text-xl",
                size === "lg" && "text-2xl"
              ),
              children: title
            }
          ),
          description && /* @__PURE__ */ jsx(
            "p",
            {
              className: cn(
                "mt-2 text-muted-foreground max-w-md",
                size === "sm" && "text-sm",
                size === "md" && "text-base",
                size === "lg" && "text-lg"
              ),
              children: description
            }
          ),
          (action || secondaryAction) && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center", children: [
            action && /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: action.onClick,
                variant: action.variant || "default",
                className: "w-full sm:w-auto",
                "aria-label": action.label,
                children: [
                  action.icon && /* @__PURE__ */ jsx(action.icon, { className: "mr-2 h-4 w-4" }),
                  action.label
                ]
              }
            ),
            secondaryAction && /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: secondaryAction.onClick,
                variant: secondaryAction.variant || "outline",
                className: "w-full sm:w-auto",
                "aria-label": secondaryAction.label,
                children: [
                  secondaryAction.icon && /* @__PURE__ */ jsx(secondaryAction.icon, { className: "mr-2 h-4 w-4" }),
                  secondaryAction.label
                ]
              }
            )
          ] })
        ]
      }
    );
  }
);
EmptyState.displayName = "EmptyState";
function FormationsList({ limit, className }) {
  const supabase2 = createClientBrowser();
  const { data: formations = [], isLoading } = useQuery({
    queryKey: ["formations"],
    enabled: true,
    staleTime: 6e4,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async () => {
      const { data, error } = await supabase2.from("formations").select(`
          id, title, description, thumbnail_url, created_at, status,
          formation_paths(
            order,
            learning_paths(id, title)
          )
        `).in("status", ["published", "coming_soon"]).order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      return rows.map((formation) => {
        const paths = (formation.formation_paths ?? []).map((fp) => {
          if (!fp.learning_paths) return null;
          return {
            id: fp.learning_paths.id,
            title: fp.learning_paths.title,
            order: fp.order ?? 0
          };
        }).filter((path) => Boolean(path)).sort((a, b) => a.order - b.order);
        return {
          id: formation.id,
          title: formation.title,
          description: formation.description,
          thumbnail_url: formation.thumbnail_url,
          status: formation.status,
          paths_count: paths.length,
          paths,
          created_at: formation.created_at
        };
      });
    }
  });
  const displayFormations = limit ? formations.slice(0, limit) : formations;
  if (isLoading) {
    return /* @__PURE__ */ jsx(
      LoadingGrid,
      {
        count: limit || 3,
        columns: { sm: 1, md: 2, lg: 3 },
        aspectRatio: "portrait",
        showContent: true
      }
    );
  }
  if (displayFormations.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "no-data",
        icon: GraduationCap,
        title: "No formations available",
        description: "Comprehensive learning programs will be available soon. Check back later!",
        size: "md"
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className), children: displayFormations.map((formation) => {
    const createdAtDistance = formation.created_at ? formatDistanceToNow(new Date(formation.created_at)) : null;
    return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden hover:shadow-lg transition-shadow", children: [
      /* @__PURE__ */ jsx("div", { className: "h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center", children: formation.thumbnail_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: formation.thumbnail_url,
          alt: formation.title,
          className: "w-full h-full object-cover"
        }
      ) : /* @__PURE__ */ jsx(GraduationCap, { className: "h-16 w-16 text-blue-400" }) }),
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-xl", children: [
          formation.title,
          /* @__PURE__ */ jsx(Badge, { variant: formation.status === "published" ? "default" : formation.status === "coming_soon" ? "secondary" : "outline", children: formation.status === "published" ? "Published" : formation.status === "coming_soon" ? "Coming Soon" : "Draft" })
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-sm line-clamp-3", children: formation.description || "A comprehensive learning program to advance your skills." })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }),
            formation.paths_count,
            " paths"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Star, { className: "h-4 w-4" }),
            "Program"
          ] })
        ] }),
        formation.paths && formation.paths.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm text-gray-900", children: "Learning Paths:" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            formation.paths.slice(0, 3).map((path, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-blue-500 font-medium", children: [
                index + 1,
                "."
              ] }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: path.title })
            ] }, path.id)),
            formation.paths.length > 3 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
              "+",
              formation.paths.length - 3,
              " more paths"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: DASHBOARD_FORMATION_DETAIL(formation.id), children: /* @__PURE__ */ jsx(EnhancedButton, { className: "w-full", children: formation.status === "coming_soon" ? "Join Waitlist" : "View Formation" }) }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 text-center", children: createdAtDistance ? `Created ${createdAtDistance} ago` : "Recently added" })
      ] })
    ] }, formation.id);
  }) });
}
function FormationsPage() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-100 rounded-lg", children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-8 w-8 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Learning Formations" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Comprehensive learning programs designed to advance your career" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "What are Formations?" }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-800 text-sm", children: "Formations are structured learning programs that combine multiple learning paths into a comprehensive curriculum. Each formation is carefully designed to take you from beginner to advanced level in specific career tracks." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FormationsList, {}),
    /* @__PURE__ */ jsxs("div", { className: "text-center pt-8 border-t", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-3", children: "Are you an instructor? Create and manage formations." }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/dashboard/admin/formations",
          className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
          children: "Admin Panel"
        }
      )
    ] })
  ] });
}
function ComingSoonPaths({ limit, className }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [joiningId, setJoiningId] = useState(null);
  const queryClient = useQueryClient();
  const supabase2 = createClientBrowser();
  const { data: paths = [], isLoading } = useQuery({
    queryKey: ["comingSoonPaths", user == null ? void 0 : user.id],
    enabled: true,
    staleTime: 6e4,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async () => {
      const { data: pathsData, error: pathsError } = await supabase2.from("learning_paths").select(`
          id, title, description,
          courses(id)
        `).eq("status", "coming_soon");
      if (pathsError) throw pathsError;
      const rows = pathsData ?? [];
      const pathIds = rows.map((path) => path.id);
      let waitingListCounts = {};
      if (pathIds.length > 0) {
        const results = await Promise.all(
          pathIds.map(async (id) => {
            const { data: count2, error: countError } = await supabase2.rpc("get_waiting_list_count", {
              p_learning_path_id: id
            });
            if (countError) {
              console.error("Error fetching waitlist count", countError);
              return { id, count: 0 };
            }
            return { id, count: count2 ?? 0 };
          })
        );
        waitingListCounts = results.reduce((acc, { id, count: count2 }) => {
          acc[id] = count2;
          return acc;
        }, {});
      }
      return rows.map((path) => ({
        id: path.id,
        title: path.title,
        description: path.description ?? "",
        courseCount: Array.isArray(path.courses) ? path.courses.length : 0,
        waitingListCount: waitingListCounts[path.id] || 0
      }));
    }
  });
  const joinWaitingListMutation = useMutation({
    mutationFn: async (pathId) => {
      if (!user) throw new Error("Must be logged in to join waiting list");
      const { error } = await supabase2.from("waiting_list").insert({
        user_id: user.id,
        learning_path_id: pathId,
        email: user.email || ""
      });
      if (error) {
        if (error.code === "23505") {
          throw new Error("You are already on this waiting list");
        }
        throw new Error(error.message || "Failed to join waiting list");
      }
      return pathId;
    },
    onMutate: (pathId) => {
      setJoiningId(pathId);
    },
    onSuccess: () => {
      toast$1.success("You have been added to the waiting list!");
      queryClient.invalidateQueries({ queryKey: ["comingSoonPaths"] });
    },
    onError: (error) => {
      console.error("Error joining waiting list:", error);
      const message = error instanceof Error ? error.message : "Failed to join waiting list";
      toast$1.error(message);
    },
    onSettled: () => setJoiningId(null)
  });
  const handleJoinWaitingList = async (pathId) => {
    if (!user) {
      toast$1.error("You must be logged in to join the waiting list");
      return;
    }
    joinWaitingListMutation.mutate(pathId);
  };
  const displayPaths = limit ? paths.slice(0, limit) : paths;
  if (isLoading) {
    return /* @__PURE__ */ jsx(
      LoadingGrid,
      {
        count: limit || 3,
        columns: { sm: 1, md: 2, lg: 3 },
        aspectRatio: "portrait",
        showContent: true
      }
    );
  }
  if (displayPaths.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        variant: "no-data",
        icon: Clock,
        title: t("dashboard.comingSoonPaths.empty.title"),
        description: t("dashboard.comingSoonPaths.empty.description"),
        size: "md"
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: `grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`, children: displayPaths.map((path) => /* @__PURE__ */ jsxs(Card, { className: "border-blue-200 bg-blue-50/30", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
        path.title,
        /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "coming-soon",
            size: "md",
            icon: Clock,
            iconPosition: "left",
            children: "Coming Soon"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-sm", children: path.description || "Get ready for an amazing learning journey!" })
    ] }) }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }),
          path.courseCount,
          " courses"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
          path.waitingListCount,
          " on waitlist"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        EnhancedButton,
        {
          onClick: () => handleJoinWaitingList(path.id),
          disabled: joiningId === path.id,
          className: "w-full",
          variant: "outline",
          children: joiningId === path.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" }),
            "Joining..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4 mr-2" }),
            "Join Waiting List"
          ] })
        }
      )
    ] })
  ] }, path.id)) });
}
function ComingSoonPage() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-orange-100 rounded-lg", children: /* @__PURE__ */ jsx(Clock, { className: "h-8 w-8 text-orange-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Coming Soon" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Be the first to know when new learning paths launch" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-orange-900 mb-2", children: "Join the Waiting List" }),
        /* @__PURE__ */ jsx("p", { className: "text-orange-800 text-sm", children: "Get notified as soon as these learning paths become available. Join the waiting list to secure your spot and receive exclusive updates." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ComingSoonPaths, {}),
    /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-6 text-center", children: [
      /* @__PURE__ */ jsx(Bell, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Stay Updated" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-md mx-auto", children: "We're constantly working on new learning paths. Check back regularly or join our waiting lists to be the first to know when new content is available." })
    ] })
  ] });
}
const enhancedCardVariants = cva(
  "rounded-xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border shadow-sm hover:shadow-md",
        elevated: "bg-card text-card-foreground shadow-md hover:shadow-lg",
        outlined: "bg-transparent border-2 hover:border-forge-orange",
        ghost: "bg-transparent hover:bg-accent/50",
        gradient: "bg-gradient-soft-blue text-card-foreground border-0 shadow-sm",
        "gradient-brand": "bg-gradient-brand text-white border-0 shadow-md",
        "gradient-success": "bg-gradient-soft-green text-card-foreground border-0 shadow-sm",
        "gradient-warning": "bg-gradient-soft-yellow text-card-foreground border-0 shadow-sm",
        "gradient-purple": "bg-gradient-soft-purple text-card-foreground border-0 shadow-sm",
        "gradient-orange": "bg-gradient-soft-orange text-card-foreground border-0 shadow-sm"
      },
      size: {
        sm: "p-4",
        md: "p-card-padding",
        lg: "p-card-padding-lg"
      },
      hover: {
        true: "cursor-pointer hover:scale-[1.02]",
        false: ""
      },
      interactive: {
        true: "hover:shadow-lg active:scale-[0.98]",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: false,
      interactive: false
    }
  }
);
const EnhancedCard = React.forwardRef(
  ({ className, variant, size, hover, interactive, as: Component2 = "div", ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      Component2,
      {
        ref,
        className: cn(enhancedCardVariants({ variant, size, hover, interactive }), className),
        ...props
      }
    );
  }
);
EnhancedCard.displayName = "EnhancedCard";
const enhancedCardHeaderVariants = cva("flex flex-col", {
  variants: {
    spacing: {
      none: "space-y-0",
      sm: "space-y-1",
      md: "space-y-1.5",
      lg: "space-y-2"
    }
  },
  defaultVariants: {
    spacing: "md"
  }
});
const EnhancedCardHeader = React.forwardRef(
  ({ className, spacing, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(enhancedCardHeaderVariants({ spacing }), className),
      ...props
    }
  )
);
EnhancedCardHeader.displayName = "EnhancedCardHeader";
const enhancedCardTitleVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl lg:text-2xl",
      lg: "text-2xl lg:text-3xl"
    }
  },
  defaultVariants: {
    size: "md"
  }
});
const EnhancedCardTitle = React.forwardRef(
  ({ className, size, as: Component2 = "h3", ...props }, ref) => /* @__PURE__ */ jsx(
    Component2,
    {
      ref,
      className: cn(enhancedCardTitleVariants({ size }), className),
      ...props
    }
  )
);
EnhancedCardTitle.displayName = "EnhancedCardTitle";
const enhancedCardDescriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
});
const EnhancedCardDescription = React.forwardRef(
  ({ className, size, ...props }, ref) => /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      className: cn(enhancedCardDescriptionVariants({ size }), className),
      ...props
    }
  )
);
EnhancedCardDescription.displayName = "EnhancedCardDescription";
const enhancedCardContentVariants = cva("", {
  variants: {
    spacing: {
      none: "pt-0",
      sm: "pt-2",
      md: "pt-4",
      lg: "pt-6"
    }
  },
  defaultVariants: {
    spacing: "md"
  }
});
const EnhancedCardContent = React.forwardRef(
  ({ className, spacing, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(enhancedCardContentVariants({ spacing }), className),
      ...props
    }
  )
);
EnhancedCardContent.displayName = "EnhancedCardContent";
const enhancedCardFooterVariants = cva("flex items-center", {
  variants: {
    spacing: {
      none: "pt-0",
      sm: "pt-2",
      md: "pt-4",
      lg: "pt-6"
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between"
    }
  },
  defaultVariants: {
    spacing: "md",
    justify: "start"
  }
});
const EnhancedCardFooter = React.forwardRef(
  ({ className, spacing, justify, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(enhancedCardFooterVariants({ spacing, justify }), className),
      ...props
    }
  )
);
EnhancedCardFooter.displayName = "EnhancedCardFooter";
function ContinueLearningCard({ className }) {
  const { user } = useAuth();
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const { t } = useTranslation();
  const [recentCourse, setRecentCourse] = useState(null);
  const { isLoading } = useQuery({
    queryKey: ["continueLearning", user == null ? void 0 : user.id],
    enabled: !!(user == null ? void 0 : user.id),
    queryFn: async () => {
      const { data: progressData } = await supabase2.from("user_progress").select("lesson_id").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(1).maybeSingle();
      if (!progressData) return null;
      const { data: lessonData, error: lessonError } = await supabase2.from("lessons").select("modules(courses(id, title, description))").eq("id", progressData.lesson_id).single();
      if (lessonError || !lessonData) return null;
      const moduleEntry = Array.isArray(lessonData.modules) ? lessonData.modules[0] : lessonData.modules;
      const courseEntry = moduleEntry ? Array.isArray(moduleEntry.courses) ? moduleEntry.courses[0] : moduleEntry.courses : null;
      if (!courseEntry) return null;
      const course = {
        id: courseEntry.id,
        title: courseEntry.title,
        description: courseEntry.description
      };
      setRecentCourse(course);
      return course;
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx(
      LoadingCard,
      {
        className,
        showHeader: true,
        contentLines: 2,
        showFooter: true
      }
    );
  }
  if (!recentCourse) {
    return /* @__PURE__ */ jsx(
      EnhancedCard,
      {
        variant: "gradient",
        size: "lg",
        className,
        children: /* @__PURE__ */ jsx(
          EmptyState,
          {
            variant: "no-data",
            icon: BookOpen,
            title: t("dashboard.continueLearning.empty.title"),
            description: t("dashboard.continueLearning.empty.description"),
            size: "sm"
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    EnhancedCard,
    {
      variant: "gradient",
      size: "lg",
      className,
      "aria-label": t("dashboard.continueLearning.ariaLabel", { course: recentCourse.title }),
      children: [
        /* @__PURE__ */ jsxs(EnhancedCardHeader, { children: [
          /* @__PURE__ */ jsx(EnhancedCardTitle, { size: "lg", children: t("dashboard.continueLearning.title") }),
          /* @__PURE__ */ jsx(EnhancedCardDescription, { size: "md", children: t("dashboard.continueLearning.subtitle") }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold pt-2 text-foreground", children: recentCourse.title })
        ] }),
        /* @__PURE__ */ jsx(EnhancedCardContent, { children: /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_COURSE(recentCourse.id), children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "lg",
            className: "w-full md:w-auto",
            "aria-label": t("common.buttons.continueLearning") + " - " + recentCourse.title,
            children: t("common.buttons.continueLearning")
          }
        ) }) })
      ]
    }
  );
}
const statCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      gradient: "",
      minimal: ""
    },
    colorScheme: {
      blue: "bg-gradient-soft-blue",
      green: "bg-gradient-soft-green",
      yellow: "bg-gradient-soft-yellow",
      purple: "bg-gradient-soft-purple",
      orange: "bg-gradient-soft-orange",
      brand: "bg-gradient-brand text-white"
    },
    size: {
      sm: "",
      md: "",
      lg: ""
    }
  },
  defaultVariants: {
    variant: "default",
    colorScheme: "blue",
    size: "md"
  }
});
const StatCard = React.forwardRef(
  ({
    className,
    variant = "default",
    colorScheme,
    size = "md",
    icon: Icon,
    label,
    value,
    description,
    trend,
    isLoading = false,
    iconColor,
    cardVariant,
    ...props
  }, ref) => {
    const effectiveCardVariant = cardVariant || (variant === "gradient" ? "gradient" : "default");
    const iconSizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12"
    };
    const valueSizes = {
      sm: "text-2xl font-bold",
      md: "text-3xl font-bold",
      lg: "text-4xl font-bold"
    };
    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    };
    const getIconColor = () => {
      if (iconColor) return iconColor;
      const colorMap = {
        blue: "text-info",
        green: "text-success",
        yellow: "text-warning",
        purple: "text-purple-600",
        orange: "text-forge-orange",
        brand: "text-white"
      };
      return colorMap[colorScheme || "blue"];
    };
    if (isLoading) {
      return /* @__PURE__ */ jsx(
        EnhancedCard,
        {
          ref,
          variant: effectiveCardVariant,
          className: cn(statCardVariants({ variant, colorScheme }), className),
          ...props,
          children: /* @__PURE__ */ jsx(EnhancedCardContent, { spacing: "md", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted animate-pulse rounded w-20" }),
              /* @__PURE__ */ jsx("div", { className: "h-8 bg-muted animate-pulse rounded w-24" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: cn("rounded-full bg-muted animate-pulse", iconSizes[size || "md"]) })
          ] }) })
        }
      );
    }
    return /* @__PURE__ */ jsxs(
      EnhancedCard,
      {
        ref,
        variant: effectiveCardVariant,
        className: cn(statCardVariants({ variant, colorScheme }), "relative overflow-hidden", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx(EnhancedCardContent, { spacing: "md", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: cn("font-medium text-muted-foreground", labelSizes[size || "md"]), children: label }),
              /* @__PURE__ */ jsx("p", { className: cn(valueSizes[size || "md"], "tracking-tight"), children: value }),
              description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: description }),
              trend && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2", children: [
                trend.direction === "up" && /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-success" }),
                trend.direction === "down" && /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-error" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "text-xs font-medium",
                      trend.direction === "up" && "text-success",
                      trend.direction === "down" && "text-error",
                      trend.direction === "neutral" && "text-muted-foreground"
                    ),
                    children: trend.value
                  }
                ),
                trend.label && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: trend.label })
              ] })
            ] }),
            Icon && /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "rounded-full p-2 bg-background/50",
                  iconSizes[size || "md"]
                ),
                children: /* @__PURE__ */ jsx(Icon, { className: cn("h-full w-full", getIconColor()) })
              }
            )
          ] }) }),
          variant === "gradient" && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" })
        ]
      }
    );
  }
);
StatCard.displayName = "StatCard";
const MOCK_STATS = {
  totalXP: 1320,
  completedLessons: 9,
  inProgressPaths: 2,
  totalTimeSpent: 210
};
function UserStats() {
  const { user } = useAuth();
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalXP: 0,
    completedLessons: 0,
    inProgressPaths: 0,
    totalTimeSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(true);
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const fetchStats = async () => {
      const start = Date.now();
      if (isMounted) setLoading(true);
      try {
        const { data: progressRows, error: progressError } = await supabase2.from("user_progress").select("lesson_id, status").eq("user_id", user.id).in("status", ["in_progress", "completed"]);
        if (progressError) throw new Error(progressError.message || t("dashboard.userStats.errors.loadProgress"));
        const rows = progressRows || [];
        const completedLessons = rows.filter((r) => r.status === "completed").length;
        const lessonIds = Array.from(new Set(rows.map((r) => r.lesson_id).filter(Boolean)));
        const chunkSize = 50;
        let lessons2 = [];
        if (lessonIds.length > 0) {
          for (let i = 0; i < lessonIds.length; i += chunkSize) {
            const chunk = lessonIds.slice(i, i + chunkSize);
            const { data: ldata, error: lerr } = await supabase2.from("lessons").select("id, xp_value, modules(courses(path_id))").in("id", chunk);
            if (lerr) throw new Error(lerr.message || t("dashboard.userStats.errors.loadLessons"));
            lessons2 = lessons2.concat(ldata || []);
          }
        }
        let totalXP = 0;
        const pathIds = /* @__PURE__ */ new Set();
        lessons2.forEach((l) => {
          var _a, _b, _c;
          totalXP += (l == null ? void 0 : l.xp_value) || 0;
          const pid = ((_b = (_a = l == null ? void 0 : l.modules) == null ? void 0 : _a.courses) == null ? void 0 : _b.path_id) || ((_c = l == null ? void 0 : l.modules) == null ? void 0 : _c.path_id);
          if (pid) pathIds.add(pid);
        });
        const inProgressPaths = pathIds.size;
        if (isMounted) {
          const computed = {
            totalXP,
            completedLessons,
            inProgressPaths,
            totalTimeSpent: Math.max(0, Math.floor(completedLessons * 15))
          };
          setStats(computed);
          setUseMock(!(computed.totalXP || computed.completedLessons || computed.inProgressPaths));
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching user statistics:", (error == null ? void 0 : error.message) || error);
        setStats({ totalXP: 0, completedLessons: 0, inProgressPaths: 0, totalTimeSpent: 0 });
        setUseMock(true);
      } finally {
        if (!isMounted) return;
        const elapsed = Date.now() - start;
        const MIN_SKELETON_MS = 600;
        const delay = Math.max(0, MIN_SKELETON_MS - elapsed);
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, delay);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [user, supabase2]);
  const display = useMock || loading ? MOCK_STATS : stats;
  const statCards = [
    {
      label: t("dashboard.userStats.totalXp"),
      value: display.totalXP,
      icon: Trophy,
      colorScheme: "yellow"
    },
    {
      label: t("dashboard.userStats.completedLessons"),
      value: display.completedLessons,
      icon: BookOpen,
      colorScheme: "green"
    },
    {
      label: t("dashboard.userStats.activePaths"),
      value: display.inProgressPaths,
      icon: Target,
      colorScheme: "blue"
    },
    {
      label: t("dashboard.userStats.studyTime"),
      value: t("dashboard.userStats.studyTimeValue", { minutes: display.totalTimeSpent }),
      icon: Clock,
      colorScheme: "purple"
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid gap-card-gap md:grid-cols-4", children: statCards.map((stat, index) => /* @__PURE__ */ jsx(
    StatCard,
    {
      label: stat.label,
      value: stat.value,
      icon: stat.icon,
      colorScheme: stat.colorScheme,
      variant: "gradient",
      isLoading: loading,
      "aria-label": `${stat.label}: ${stat.value}`
    },
    index
  )) });
}
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const WEEKLY_GOAL = 5;
function LearningHabits({ className }) {
  const { user } = useAuth();
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const { t } = useTranslation();
  const { data: completions = [], isLoading } = useQuery({
    queryKey: ["learningHabits", user == null ? void 0 : user.id],
    enabled: !!(user == null ? void 0 : user.id),
    staleTime: 6e4,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    keepPreviousData: true,
    queryFn: async () => {
      const { data, error } = await supabase2.from("user_progress").select("completed_at").eq("user_id", user.id).eq("status", "completed").not("completed_at", "is", null).order("completed_at", { ascending: false }).limit(200);
      if (error) throw new Error(error.message || t("dashboard.learningHabits.loadError"));
      return data;
    }
  });
  const { streakDays, weekCount, weekSeries } = useMemo(() => {
    const byDay = /* @__PURE__ */ new Map();
    for (const row of completions) {
      if (!row.completed_at) continue;
      const date = new Date(row.completed_at);
      const key = date.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) || 0) + 1);
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    for (let d = new Date(today); ; d.setDate(d.getDate() - 1)) {
      const key = d.toISOString().slice(0, 10);
      const count2 = byDay.get(key) || 0;
      if (streak === 0 && count2 === 0) {
        break;
      }
      if (count2 > 0) {
        streak += 1;
      } else {
        break;
      }
    }
    const last7 = [];
    let weekSum = 0;
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      const count2 = byDay.get(key) || 0;
      last7.push(count2);
      weekSum += count2;
    }
    return {
      streakDays: streak,
      weekCount: weekSum,
      weekSeries: last7
    };
  }, [completions]);
  const streakText = isLoading ? "-" : t("dashboard.learningHabits.dayCount", { count: streakDays });
  const weeklyProgressText = isLoading ? "-" : t("dashboard.learningHabits.weekProgress", { completed: weekCount, goal: WEEKLY_GOAL });
  return /* @__PURE__ */ jsxs(Card, { className: `h-full min-h-[220px] flex flex-col ${className || ""}`, children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: t("dashboard.learningHabits.title") }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: t("dashboard.learningHabits.currentStreak") }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold", children: streakText })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t("dashboard.learningHabits.keepGoing") })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: t("dashboard.learningHabits.weeklyGoal") }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: weeklyProgressText })
        ] }),
        /* @__PURE__ */ jsx(Progress, { value: Math.min(100, weekCount / WEEKLY_GOAL * 100) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1", children: weekSeries.map((v, idx) => /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-1", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-6 rounded bg-forge-orange/20",
          style: { height: Math.max(6, Math.min(28, v * 8)) },
          title: t("dashboard.learningHabits.completions", { count: v })
        }
      ) }, idx)) })
    ] })
  ] });
}
function DashboardHome() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const getUserDisplayName = () => {
    var _a, _b;
    console.log("User data:", user);
    console.log("User metadata:", user == null ? void 0 : user.user_metadata);
    if ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.full_name) {
      return user.user_metadata.full_name;
    }
    if ((_b = user == null ? void 0 : user.user_metadata) == null ? void 0 : _b.name) {
      return user.user_metadata.name;
    }
    if (user == null ? void 0 : user.email) {
      return user.email.split("@")[0];
    }
    return t("common.labels.user");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxs("div", { className: "text-gray-500", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 text-sm rounded-full bg-forge-cream text-forge-dark px-2 py-0.5 mr-2", children: t("dashboard.home.badge") }),
      /* @__PURE__ */ jsx("span", { className: "font-medium text-forge-dark", children: getUserDisplayName() }),
      t("dashboard.home.headlineSuffix")
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-12 gap-6", children: /* @__PURE__ */ jsxs("div", { className: "col-span-12 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-12 xl:col-span-8", children: /* @__PURE__ */ jsx(ContinueLearningCard, { className: "mb-0" }) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-12 xl:col-span-4", children: /* @__PURE__ */ jsx(LearningHabits, { className: "mb-0" }) })
      ] }),
      /* @__PURE__ */ jsx(UserStats, {})
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold tracking-tight", children: "Learning Formations" }),
          /* @__PURE__ */ jsx(Link, { to: DASHBOARD_FORMATIONS, className: "text-forge-orange hover:underline", children: "View all formations" })
        ] }),
        /* @__PURE__ */ jsx(FormationsList, { limit: 3, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold tracking-tight", children: t(ROUTE_LABELS[DASHBOARD_EXPLORE]) }),
          /* @__PURE__ */ jsx(Link, { to: DASHBOARD_EXPLORE, className: "text-forge-orange hover:underline", children: t("dashboard.home.exploreCta") })
        ] }),
        /* @__PURE__ */ jsx(AvailablePaths, { limit: 6, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold tracking-tight", children: "Coming Soon" }),
          /* @__PURE__ */ jsx(Link, { to: DASHBOARD_COMING_SOON, className: "text-forge-orange hover:underline", children: "View all upcoming paths" })
        ] }),
        /* @__PURE__ */ jsx(ComingSoonPaths, { limit: 3, className: "mt-2" })
      ] })
    ] })
  ] });
}
const isPostgrestError = (value) => typeof value === "object" && value !== null && "code" in value && "message" in value;
function FormationDetailPage() {
  const { formationId } = useParams();
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    data: formation,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["formation-detail", formationId, user == null ? void 0 : user.id],
    enabled: Boolean(formationId),
    queryFn: async () => {
      if (!formationId) throw new Error("Formation not found");
      const { data, error: formationError } = await supabase2.from("formations").select(`
          id, title, description, thumbnail_url, created_at, published_at, status,
          formation_paths(
            order,
            learning_paths(id, title, status)
          )
        `).eq("id", formationId).single();
      if (formationError || !data) throw formationError ?? new Error("Formation not found");
      const formationRow = data;
      const paths = (formationRow.formation_paths ?? []).map((fp) => {
        if (!fp.learning_paths) return null;
        return {
          id: fp.learning_paths.id,
          title: fp.learning_paths.title,
          order: fp.order ?? 0,
          status: fp.learning_paths.status
        };
      }).filter((path) => Boolean(path)).sort((a, b) => a.order - b.order);
      const { data: waitingListCount, error: waitingListError } = await supabase2.rpc(
        "get_formation_waiting_list_count",
        { p_formation_id: formationId }
      );
      if (waitingListError) throw waitingListError;
      let isUserOnWaitlist = false;
      if (user == null ? void 0 : user.id) {
        const { data: existing, error: existingError } = await supabase2.from("waiting_list").select("id").eq("formation_id", formationId).eq("user_id", user.id).maybeSingle();
        if (existingError) throw existingError;
        isUserOnWaitlist = Boolean(existing);
      }
      return {
        id: formationRow.id,
        title: formationRow.title,
        description: formationRow.description,
        thumbnail_url: formationRow.thumbnail_url,
        created_at: formationRow.created_at,
        published_at: formationRow.published_at,
        status: formationRow.status,
        paths,
        waitingListCount: waitingListCount ?? 0,
        isUserOnWaitlist
      };
    }
  });
  const joinWaitingListMutation = useMutation({
    mutationFn: async () => {
      if (!formationId) throw new Error("Formation not found");
      if (!user) {
        throw new Error("You need to be logged in to join the waiting list");
      }
      const { error: insertError } = await supabase2.from("waiting_list").insert({
        formation_id: formationId,
        user_id: user.id,
        email: user.email ?? ""
      });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      toast$1.success("You have been added to the waiting list for this formation");
      queryClient.invalidateQueries({ queryKey: ["formation-detail", formationId, user == null ? void 0 : user.id] });
    },
    onError: (mutationError) => {
      if (isPostgrestError(mutationError) && mutationError.code === "23505") {
        toast$1.info("You are already on the waiting list for this formation");
        queryClient.invalidateQueries({ queryKey: ["formation-detail", formationId, user == null ? void 0 : user.id] });
        return;
      }
      const message = isPostgrestError(mutationError) ? mutationError.message : mutationError instanceof Error ? mutationError.message : "Failed to join waiting list";
      toast$1.error(message);
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-40 rounded bg-gray-200" }),
        /* @__PURE__ */ jsx("div", { className: "h-10 w-2/3 rounded bg-gray-200" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-1/2 rounded bg-gray-200" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: [...Array(2)].map((_, index) => /* @__PURE__ */ jsxs(Card, { className: "animate-pulse", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx("div", { className: "h-5 w-1/2 rounded bg-gray-200" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-2/3 rounded bg-gray-100" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "h-10 w-full rounded bg-gray-100" }) })
      ] }, index)) })
    ] });
  }
  if (isError || !formation) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_FORMATIONS, className: "inline-flex items-center gap-2 text-sm text-forge-orange hover:underline", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to formations"
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 text-center text-forge-gray", children: error instanceof Error ? error.message : "We could not load this formation." }) })
    ] });
  }
  const createdAtDistance = formation.created_at ? formatDistanceToNow(new Date(formation.created_at), { addSuffix: true }) : null;
  const publishedAtDistance = formation.published_at ? formatDistanceToNow(new Date(formation.published_at), { addSuffix: true }) : null;
  const isComingSoon = formation.status === "coming_soon";
  const joinDisabled = joinWaitingListMutation.isPending || formation.isUserOnWaitlist;
  const firstPublishedPath = formation.paths.find((path) => path.status === "published");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(Link, { to: DASHBOARD_FORMATIONS, className: "inline-flex items-center gap-2 text-sm text-forge-orange hover:underline", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to formations"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:justify-between md:items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-forge-dark", children: formation.title }),
            /* @__PURE__ */ jsx(Badge, { variant: isComingSoon ? "secondary" : formation.status === "published" ? "default" : "outline", children: isComingSoon ? "Coming soon" : formation.status === "published" ? "Published" : "Draft" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-forge-gray max-w-2xl", children: formation.description || "Explore the curated learning paths included in this formation." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm text-forge-gray", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }),
              formation.paths.length,
              " learning paths"
            ] }),
            isComingSoon && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
              formation.waitingListCount,
              " on waiting list"
            ] }),
            createdAtDistance && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
              "Created ",
              createdAtDistance
            ] }),
            publishedAtDistance && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-forge-orange", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
              "Published ",
              publishedAtDistance
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: isComingSoon ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            EnhancedButton,
            {
              onClick: () => joinWaitingListMutation.mutate(),
              disabled: joinDisabled || !user,
              className: "min-w-[220px]",
              variant: formation.isUserOnWaitlist ? "outline" : "primary",
              children: formation.isUserOnWaitlist ? "You are on the waiting list" : joinWaitingListMutation.isPending ? "Joining..." : user ? "Join the waiting list" : "Sign in to join"
            }
          ),
          !user && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-right", children: "You must be signed in to join the waiting list." }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "We will notify you as soon as this formation opens for enrollment." })
        ] }) : firstPublishedPath ? /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_PATH(firstPublishedPath.id), children: /* @__PURE__ */ jsx(EnhancedButton, { className: "min-w-[220px]", withGradient: true, children: "Start learning" }) }) : /* @__PURE__ */ jsx(EnhancedButton, { className: "min-w-[220px]", variant: "outline", disabled: true, children: "Paths coming soon" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-forge-dark", children: "Included learning paths" }),
      formation.paths.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/70", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 text-center text-forge-gray", children: "Learning paths will be added to this formation soon." }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: formation.paths.map((path, index) => /* @__PURE__ */ jsxs(Card, { className: "flex flex-col border border-forge-cream/70 bg-white/80", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-forge-orange", children: index + 1 }),
            /* @__PURE__ */ jsx(Badge, { variant: path.status === "published" ? "default" : path.status === "coming_soon" ? "secondary" : "outline", children: path.status === "published" ? "Published" : path.status === "coming_soon" ? "Coming soon" : "Draft" })
          ] }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg leading-tight text-forge-dark", children: path.title })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "mt-auto", children: path.status === "published" ? /* @__PURE__ */ jsx(Link, { to: DASHBOARD_LEARN_PATH(path.id), children: /* @__PURE__ */ jsx(EnhancedButton, { variant: "outline", className: "w-full", children: "View path" }) }) : /* @__PURE__ */ jsx(EnhancedButton, { variant: "ghost", className: "w-full", disabled: true, children: path.status === "coming_soon" ? "Coming soon" : "Not yet published" }) })
      ] }, path.id)) })
    ] })
  ] });
}
const DEFAULT_LANGUAGE = "pt-BR";
const mapRowToProfile = (row, email) => ({
  fullName: row.full_name,
  email,
  country: row.country,
  city: row.city,
  languages: row.languages,
  communicationLanguage: row.communication_language ?? DEFAULT_LANGUAGE,
  yearsExperience: row.years_experience,
  stacks: row.stacks,
  skillsToDevelop: row.skills_to_develop,
  positionCompany: row.position_company,
  linkedinUrl: row.linkedin_url ?? void 0,
  githubUrl: row.github_url ?? void 0,
  walletAddress: row.wallet_address ?? void 0
});
const mapProfileToPayload = (profile2, userId) => ({
  user_id: userId,
  wallet_address: profile2.walletAddress ?? null,
  full_name: profile2.fullName,
  country: profile2.country,
  city: profile2.city,
  languages: profile2.languages,
  years_experience: profile2.yearsExperience,
  stacks: profile2.stacks,
  skills_to_develop: profile2.skillsToDevelop,
  position_company: profile2.positionCompany,
  linkedin_url: profile2.linkedinUrl ?? null,
  github_url: profile2.githubUrl ?? null,
  communication_language: profile2.communicationLanguage
});
const buildEmptyProfile = (email, language) => ({
  fullName: "",
  email,
  country: "",
  city: "",
  languages: [],
  communicationLanguage: language,
  yearsExperience: 0,
  stacks: [],
  skillsToDevelop: [],
  positionCompany: "",
  linkedinUrl: void 0,
  githubUrl: void 0,
  walletAddress: void 0
});
async function getProfile() {
  var _a;
  const supabase2 = createClientBrowser();
  const {
    data: { user },
    error: userError
  } = await supabase2.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (!user) {
    throw new Error("User not authenticated");
  }
  const preferredLanguage = ((_a = user.user_metadata) == null ? void 0 : _a.communication_language) ?? DEFAULT_LANGUAGE;
  const { data, error } = await supabase2.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    const emptyProfile = buildEmptyProfile(user.email ?? "", preferredLanguage);
    const insertPayload = mapProfileToPayload(emptyProfile, user.id);
    const { error: insertError } = await supabase2.from("profiles").insert(insertPayload);
    if (insertError) {
      throw insertError;
    }
    return emptyProfile;
  }
  return mapRowToProfile(data, user.email ?? "");
}
async function updateProfile(data) {
  var _a;
  const supabase2 = createClientBrowser();
  const {
    data: { user },
    error: userError
  } = await supabase2.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (!user) {
    throw new Error("User not authenticated");
  }
  const payload = mapProfileToPayload(data, user.id);
  const { error } = await supabase2.from("profiles").upsert(payload, { onConflict: "user_id" });
  if (error) {
    throw error;
  }
  const existingLanguage = (_a = user.user_metadata) == null ? void 0 : _a.communication_language;
  if (existingLanguage !== data.communicationLanguage) {
    const { error: metadataError } = await supabase2.auth.updateUser({
      data: { communication_language: data.communicationLanguage }
    });
    if (metadataError) {
      console.warn("Failed to sync communication language with auth metadata", metadataError);
    }
  }
}
function ProfileSidebar({ activeTab, onTabChange }) {
  const { t } = useTranslation();
  const tabs = useMemo(
    () => [
      {
        id: "personal",
        label: t("profile.sections.personal"),
        icon: User,
        description: t("profile.sections.personalDesc")
      },
      {
        id: "professional",
        label: t("profile.sections.professional"),
        icon: Briefcase,
        description: t("profile.sections.professionalDesc")
      },
      {
        id: "learning",
        label: t("profile.sections.learning"),
        icon: BookOpen,
        description: t("profile.sections.learningDesc")
      },
      {
        id: "career",
        label: t("profile.sections.career"),
        icon: Target,
        description: t("profile.sections.careerDesc")
      }
    ],
    [t]
  );
  return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tabs.map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onTabChange(tab.id),
        className: cn(
          "w-full text-left p-4 rounded-lg transition-all duration-200",
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
          isActive ? "bg-orange-500 text-white shadow-md" : "bg-white text-gray-700 hover:text-gray-900"
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Icon, { className: cn("h-5 w-5", isActive ? "text-white" : "text-gray-500") }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: tab.label }),
            /* @__PURE__ */ jsx("div", { className: cn("text-sm mt-1", isActive ? "text-orange-100" : "text-gray-500"), children: tab.description })
          ] })
        ] })
      },
      tab.id
    );
  }) });
}
function SectionCard({ title, description, children, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: description })
    ] }),
    children
  ] });
}
function FormField$1({ label, required = false, error, description, children, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-2", className), children: [
    /* @__PURE__ */ jsxs("label", { className: "text-sm font-medium text-gray-700", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
    ] }),
    children,
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: description }),
    error && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: error })
  ] });
}
function TagInput({ value, onChange, placeholder = "Type and press Enter", className, disabled }) {
  const [inputValue, setInputValue] = useState("");
  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue("");
    }
  };
  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: cn("space-y-2", className), children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500", children: [
    value.map((tag, index) => /* @__PURE__ */ jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-md",
        children: [
          tag,
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => removeTag(tag),
              disabled,
              className: "text-orange-600 hover:text-orange-800 disabled:opacity-50",
              children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
            }
          )
        ]
      },
      index
    )),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: value.length === 0 ? placeholder : "",
        disabled,
        className: "flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder-gray-400"
      }
    )
  ] }) });
}
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const COUNTRY_LIST = [
  { value: "Brazil", key: "brazil" },
  { value: "United States", key: "unitedStates" },
  { value: "Canada", key: "canada" },
  { value: "United Kingdom", key: "unitedKingdom" },
  { value: "Germany", key: "germany" },
  { value: "France", key: "france" },
  { value: "Spain", key: "spain" },
  { value: "Italy", key: "italy" },
  { value: "Netherlands", key: "netherlands" },
  { value: "Sweden", key: "sweden" },
  { value: "Norway", key: "norway" },
  { value: "Denmark", key: "denmark" },
  { value: "Finland", key: "finland" },
  { value: "Switzerland", key: "switzerland" },
  { value: "Austria", key: "austria" },
  { value: "Belgium", key: "belgium" },
  { value: "Portugal", key: "portugal" },
  { value: "Ireland", key: "ireland" },
  { value: "Australia", key: "australia" },
  { value: "New Zealand", key: "newZealand" },
  { value: "Japan", key: "japan" },
  { value: "South Korea", key: "southKorea" },
  { value: "Singapore", key: "singapore" },
  { value: "India", key: "india" },
  { value: "China", key: "china" },
  { value: "Mexico", key: "mexico" },
  { value: "Argentina", key: "argentina" },
  { value: "Chile", key: "chile" },
  { value: "Colombia", key: "colombia" },
  { value: "Peru", key: "peru" },
  { value: "Uruguay", key: "uruguay" },
  { value: "Paraguay", key: "paraguay" },
  { value: "Venezuela", key: "venezuela" },
  { value: "Ecuador", key: "ecuador" },
  { value: "Bolivia", key: "bolivia" },
  { value: "Guyana", key: "guyana" },
  { value: "Suriname", key: "suriname" },
  { value: "French Guiana", key: "frenchGuiana" }
];
function Profile() {
  const { t, i18n: i18n2 } = useTranslation();
  const { user } = useAuth();
  const { toast: toast2 } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [profile2, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const countryOptions = useMemo(
    () => COUNTRY_LIST.map(({ value, key }) => ({
      value,
      label: t(`common.countries.${key}`)
    })),
    [t]
  );
  const languageOptions = useMemo(
    () => [
      { value: "en-US", label: t("profile.languageOptions.enUS") },
      { value: "pt-BR", label: t("profile.languageOptions.ptBR") }
    ],
    [t]
  );
  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (user == null ? void 0 : user.email) {
        data.email = user.email;
      }
      if (data.communicationLanguage && data.communicationLanguage !== i18n2.language) {
        i18n2.changeLanguage(data.communicationLanguage);
      }
      setProfile(data);
      setHasChanges(false);
    } catch (error) {
      toast2({
        title: t("common.errors.unexpectedError"),
        description: t("profile.messages.updateError")
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    if (!profile2) return;
    const newErrors = {};
    if (!profile2.fullName.trim()) {
      newErrors.fullName = t("profile.errors.fullNameRequired");
    }
    if (!profile2.country.trim()) {
      newErrors.country = t("profile.errors.countryRequired");
    }
    if (profile2.linkedinUrl && !isValidUrl(profile2.linkedinUrl)) {
      newErrors.linkedinUrl = t("profile.errors.invalidLinkedin");
    }
    if (profile2.githubUrl && !isValidUrl(profile2.githubUrl)) {
      newErrors.githubUrl = t("profile.errors.invalidGithub");
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast2({
        title: t("common.errors.unexpectedError"),
        description: t("profile.messages.validationError")
      });
      return;
    }
    try {
      setSaving(true);
      await updateProfile(profile2);
      setErrors({});
      setHasChanges(false);
      toast2({
        title: t("common.buttons.save"),
        description: t("profile.messages.updateSuccess")
      });
    } catch (error) {
      toast2({
        title: t("common.errors.unexpectedError"),
        description: t("profile.messages.updateError")
      });
    } finally {
      setSaving(false);
    }
  };
  const updateField = (field, value) => {
    if (!profile2) return;
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
    setHasChanges(true);
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: void 0
      });
    }
  };
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-orange-500" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: t("profile.loadingProfile") })
    ] }) });
  }
  if (!profile2) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("profile.failedToLoad") }),
      /* @__PURE__ */ jsx(Button, { onClick: loadProfile, className: "mt-4", children: t("common.buttons.tryAgain") })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: t("profile.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: t("profile.subtitle") })
    ] }),
    hasChanges && /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-yellow-800", children: [
      /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t("profile.unsavedChanges") })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx(ProfileSidebar, { activeTab, onTabChange: setActiveTab }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3", children: [
        activeTab === "personal" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: t("profile.sections.personal"),
            description: t("profile.sections.personalDesc"),
            children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsx(FormField$1, { label: t("common.labels.fullName"), required: true, error: errors.fullName, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile2.fullName,
                    onChange: (e) => updateField("fullName", e.target.value),
                    placeholder: t("common.placeholders.enterFullName"),
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs(FormField$1, { label: t("common.labels.email"), required: true, children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      value: profile2.email,
                      disabled: true,
                      className: "pl-10 bg-gray-50"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: t("profile.messages.emailNote") })
              ] }),
              /* @__PURE__ */ jsx(FormField$1, { label: t("common.labels.country"), required: true, error: errors.country, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Globe, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsxs(Select, { value: profile2.country, onValueChange: (value) => updateField("country", value), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "pl-10", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("common.placeholders.selectCountry") }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: countryOptions.map(({ value, label }) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(FormField$1, { label: t("common.labels.city"), children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile2.city,
                    onChange: (e) => updateField("city", e.target.value),
                    placeholder: t("common.placeholders.enterCity"),
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FormField$1, { label: t("common.labels.languages"), description: t("profile.sections.personalDesc"), children: /* @__PURE__ */ jsx(
                TagInput,
                {
                  value: profile2.languages,
                  onChange: (value) => updateField("languages", value),
                  placeholder: t("common.placeholders.typeLanguage")
                }
              ) }) }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FormField$1, { label: t("profile.fields.languagePreference"), description: t("profile.fields.selectLanguage"), children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Languages, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: profile2.communicationLanguage,
                    onValueChange: (value) => {
                      updateField("communicationLanguage", value);
                      i18n2.changeLanguage(value);
                    },
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "pl-10", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("profile.fields.selectLanguage") }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: languageOptions.map(({ value, label }) => /* @__PURE__ */ jsx(SelectItem, { value, children: label }, value)) })
                    ]
                  }
                )
              ] }) }) })
            ] })
          }
        ),
        activeTab === "professional" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: t("profile.sections.professional"),
            description: t("profile.sections.professionalDesc"),
            children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsx(FormField$1, { label: t("profile.fields.yearsExperience"), children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Briefcase, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    min: "0",
                    value: profile2.yearsExperience,
                    onChange: (e) => updateField("yearsExperience", parseInt(e.target.value) || 0),
                    placeholder: t("profile.fields.yearsExperiencePlaceholder"),
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(FormField$1, { label: t("profile.fields.positionCompany"), children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Building, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile2.positionCompany,
                    onChange: (e) => updateField("positionCompany", e.target.value),
                    placeholder: t("profile.fields.positionPlaceholder"),
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FormField$1, { label: t("profile.fields.stacksDominated"), description: t("profile.fields.stacksDesc"), children: /* @__PURE__ */ jsx(
                TagInput,
                {
                  value: profile2.stacks,
                  onChange: (value) => updateField("stacks", value),
                  placeholder: t("profile.fields.stacksPlaceholder")
                }
              ) }) }),
              /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FormField$1, { label: t("profile.fields.skillsToDevelop"), description: t("profile.fields.skillsDesc"), children: /* @__PURE__ */ jsx(
                TagInput,
                {
                  value: profile2.skillsToDevelop,
                  onChange: (value) => updateField("skillsToDevelop", value),
                  placeholder: t("profile.fields.skillsPlaceholder")
                }
              ) }) }),
              /* @__PURE__ */ jsx(FormField$1, { label: t("profile.fields.linkedinUrl"), error: errors.linkedinUrl, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Linkedin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile2.linkedinUrl,
                    onChange: (e) => updateField("linkedinUrl", e.target.value),
                    placeholder: t("profile.fields.linkedinPlaceholder"),
                    className: "pl-10"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(FormField$1, { label: t("profile.fields.githubUrl"), error: errors.githubUrl, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Github, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: profile2.githubUrl,
                    onChange: (e) => updateField("githubUrl", e.target.value),
                    placeholder: t("profile.fields.githubPlaceholder"),
                    className: "pl-10"
                  }
                )
              ] }) })
            ] })
          }
        ),
        activeTab === "learning" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: t("profile.sections.learning"),
            description: t("profile.sections.learningDesc"),
            children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: t("profile.comingSoon.title") }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("profile.comingSoon.learning") })
            ] })
          }
        ),
        activeTab === "career" && /* @__PURE__ */ jsx(
          SectionCard,
          {
            title: t("profile.sections.career"),
            description: t("profile.sections.careerDesc"),
            children: /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
              /* @__PURE__ */ jsx(Target, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: t("profile.comingSoon.title") }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("profile.comingSoon.career") })
            ] })
          }
        ),
        activeTab === "personal" || activeTab === "professional" ? /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleSave,
            disabled: saving || !hasChanges,
            className: "bg-orange-500 hover:bg-orange-600 text-white",
            children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }),
              t("common.buttons.saving")
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-2" }),
              t("common.buttons.save")
            ] })
          }
        ) }) : null
      ] })
    ] })
  ] });
}
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading && true) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[40vh] flex items-center justify-center text-gray-500", children: "Loading..." });
  }
  if (!user && true) {
    return /* @__PURE__ */ jsx(Navigate, { to: LOGIN, replace: true, state: { from: location } });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
const stripHtml$1 = (value) => {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, "").trim();
};
function CommunityProjects() {
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const { t } = useTranslation();
  const { data: projects2 = [], isLoading } = useQuery({
    queryKey: ["community-projects"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("module_projects").select(
        `id, title, description, xp_value, is_active, created_at,
           module:modules(id, title, order, course:courses(id, title)),
           submissions:module_project_submissions(repository_url, submitted_at, user_id)`
      );
      if (error) throw error;
      return data ?? [];
    },
    onError: (error) => {
      console.error("Error loading community projects", error);
      toast$1.error(t("projects.community.loadError"));
    }
  });
  const grouped = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    projects2.forEach((project) => {
      if (!project.module) return;
      const key = project.module.id;
      if (!map.has(key)) {
        map.set(key, { module: project.module, projects: [] });
      }
      map.get(key).projects.push(project);
    });
    return Array.from(map.values()).sort((a, b) => {
      var _a, _b;
      const courseOrder = (((_a = a.module.course) == null ? void 0 : _a.title) ?? "").localeCompare(((_b = b.module.course) == null ? void 0 : _b.title) ?? "");
      if (courseOrder !== 0) return courseOrder;
      const orderA = a.module.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.module.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.module.title.localeCompare(b.module.title);
    });
  }, [projects2]);
  if (isLoading) {
    return /* @__PURE__ */ jsx(Card, { className: "border border-dashed border-forge-cream/70 bg-white/90", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-8 text-forge-gray", children: [
      /* @__PURE__ */ jsx(FolderGit2, { className: "h-5 w-5 animate-pulse text-forge-orange" }),
      t("projects.community.loading")
    ] }) });
  }
  if (grouped.length === 0) {
    return /* @__PURE__ */ jsx(Card, { className: "border border-dashed border-forge-cream/70 bg-white/90", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2 p-8 text-center text-forge-gray", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-forge-dark", children: t("projects.community.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: t("projects.community.empty") })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-forge-dark", children: t("projects.community.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: t("projects.community.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-5", children: grouped.map(({ module, projects: projects22 }) => {
      var _a;
      return /* @__PURE__ */ jsxs(Card, { className: "border border-forge-cream/70 bg-white/90", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xl text-forge-dark", children: module.title }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-forge-cream text-forge-dark", children: t("projects.community.courseLabel", { course: ((_a = module.course) == null ? void 0 : _a.title) ?? t("projects.community.unknownCourse") }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-forge-gray/80", children: t("projects.community.projectCount", { count: projects22.length }) })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: projects22.slice().filter((project) => project.is_active ?? true).sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (dateA !== dateB) return dateA - dateB;
          return a.title.localeCompare(b.title);
        }).map((project, index) => {
          const submissions = project.submissions ?? [];
          const order = index + 1;
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: "rounded-lg border border-forge-cream/60 bg-white/80 p-4 shadow-sm",
              children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "border-forge-orange text-forge-orange", children: t("projects.community.projectOrder", { order }) }),
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-forge-dark", children: project.title }),
                  typeof project.xp_value === "number" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-forge-cream text-forge-dark", children: t("projects.community.xpValue", { xp: project.xp_value }) })
                ] }),
                project.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray/90", children: stripHtml$1(project.description) }),
                submissions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed border-forge-cream/70 bg-forge-cream/30 p-4 text-sm text-forge-gray", children: t("projects.community.noSubmissions") }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-forge-dark", children: t("projects.community.submissions", { count: submissions.length }) }),
                  /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: submissions.map((submission, index2) => /* @__PURE__ */ jsxs(
                    "li",
                    {
                      className: "flex flex-col gap-1 rounded-md border border-forge-cream/60 bg-white/70 p-3 text-sm text-forge-gray",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                          /* @__PURE__ */ jsx(
                            "a",
                            {
                              href: submission.repository_url,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "font-medium text-forge-orange hover:underline",
                              children: submission.repository_url
                            }
                          ),
                          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(
                            "a",
                            {
                              href: submission.repository_url,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "flex items-center gap-1 text-xs",
                              children: [
                                t("projects.community.visitRepository"),
                                /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
                              ]
                            }
                          ) })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-forge-gray/70", children: t("projects.community.submittedBy", {
                          user: submission.user_id ? `${submission.user_id.slice(0, 6)}…${submission.user_id.slice(-4)}` : t("projects.community.anonymous"),
                          date: submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : t("projects.community.dateUnknown")
                        }) })
                      ]
                    },
                    `${project.id}-${index2}-${submission.repository_url}`
                  )) })
                ] })
              ] })
            },
            project.id
          );
        }) })
      ] }, module.id);
    }) })
  ] });
}
function RequireAdmin({ children }) {
  var _a;
  const { user, loading } = useAuth();
  const location = useLocation();
  let mockUser = null;
  const isAdmin = Boolean(((_a = user == null ? void 0 : user.app_metadata) == null ? void 0 : _a.is_admin) || (mockUser == null ? void 0 : mockUser.is_admin));
  if (loading && true) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-[40vh] flex items-center justify-center text-gray-500", children: "Checking admin permissions..." });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsx(Navigate, { to: DASHBOARD, replace: true, state: { from: location } });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function LoginOAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const supabase2 = createClientBrowser();
  async function signInWith(provider) {
    try {
      setIsLoading(true);
      setError(null);
      const { error: error2 } = await supabase2.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getOAuthRedirectUrl()
        }
      });
      if (error2) {
        throw error2;
      }
    } catch (err) {
      console.error("OAuth error:", err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to Forge College" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Choose your preferred authentication method" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => signInWith("google"),
          disabled: isLoading,
          className: "group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forge-orange disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5 mr-3", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
              /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
              /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
              /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
            ] }),
            "Continue with Google"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => signInWith("github"),
          disabled: isLoading,
          className: "group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 mr-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z", clipRule: "evenodd" }) }),
            "Continue with GitHub"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mt-4 bg-red-50 border border-red-200 rounded-md p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-800", children: error }) })
    ] }) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center", children: [
      /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-forge-orange", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Redirecting to authentication..." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate("/"),
        className: "text-forge-orange hover:text-forge-orange-dark text-sm font-medium",
        children: "← Back to Home"
      }
    ) })
  ] }) });
}
function AuthCallback() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Signing you in...");
  const navigate = useNavigate();
  const supabase2 = createClientBrowser();
  useEffect(() => {
    async function handleCallback() {
      var _a;
      try {
        const initial = await supabase2.auth.getSession();
        if ((_a = initial.data.session) == null ? void 0 : _a.user) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          await new Promise((r) => setTimeout(r, 800));
          navigate("/dashboard", { replace: true });
          return;
        }
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase2.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
        const { data: { session }, error } = await supabase2.auth.getSession();
        if (error) throw error;
        if (session == null ? void 0 : session.user) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");
          await new Promise((r) => setTimeout(r, 800));
          navigate("/dashboard", { replace: true });
        } else {
          throw new Error("No session found after OAuth completion");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        setTimeout(() => navigate("/login"), 3e3);
      }
    }
    handleCallback();
  }, [navigate, supabase2]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-forge-cream relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl rounded-2xl p-8 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      status === "loading" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-4 border-forge-orange border-t-transparent" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-forge-dark", children: "Processing Authentication" }),
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: message })
      ] }),
      status === "success" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-forge-orange/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-forge-orange", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-forge-dark", children: "Welcome to Forge College!" }),
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: message })
      ] }),
      status === "error" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-forge-dark", children: "Authentication Failed" }),
        /* @__PURE__ */ jsx("p", { className: "text-forge-gray", children: message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/login"),
            className: "mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-forge-orange hover:bg-forge-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forge-orange transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl",
            children: "Try Again"
          }
        )
      ] })
    ] }) })
  ] });
}
const TestPage = () => {
  const serverTimestamp = (/* @__PURE__ */ new Date()).toISOString();
  const { t } = useTranslation();
  const clientScript = useMemo(() => {
    return `
      document.addEventListener('DOMContentLoaded', function() {
        const jsTest = document.getElementById('js-test');
        if (jsTest) {
          jsTest.innerHTML = \`
            <p><strong>${t("diagnostics.testPage.js.clientReady")}</strong></p>
            <p><strong>${t("diagnostics.testPage.js.userAgent")}</strong> \${navigator.userAgent}</p>
            <p><strong>${t("diagnostics.testPage.js.url")}</strong> \${window.location.href}</p>
            <p><strong>${t("diagnostics.testPage.js.clientTimestamp")}</strong> \${new Date().toISOString()}</p>
          \`;
        }
      });
    `;
  }, [t]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "800px",
        margin: "0 auto"
      },
      children: [
        /* @__PURE__ */ jsx("h1", { children: t("diagnostics.testPage.title") }),
        /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.description") }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              backgroundColor: "#f0f8ff",
              padding: "1rem",
              borderRadius: "8px",
              margin: "1rem 0"
            },
            children: [
              /* @__PURE__ */ jsx("h2", { children: t("diagnostics.testPage.systemStatus.title") }),
              /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.systemStatus.react") }),
              /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.systemStatus.typescript") }),
              /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.systemStatus.build") }),
              /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.systemStatus.deploy") }),
              /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.systemStatus.ssr", { timestamp: serverTimestamp }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              backgroundColor: "#f0fff0",
              padding: "1rem",
              borderRadius: "8px",
              margin: "1rem 0"
            },
            children: [
              /* @__PURE__ */ jsx("h3", { children: t("diagnostics.testPage.environment.title") }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: t("diagnostics.testPage.environment.serverTimestamp") }),
                " ",
                serverTimestamp
              ] }),
              /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.environment.noJsMessage") })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              backgroundColor: "#fff8f0",
              padding: "1rem",
              borderRadius: "8px",
              margin: "1rem 0"
            },
            children: [
              /* @__PURE__ */ jsx("h3", { children: t("diagnostics.testPage.clientTest.title") }),
              /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.clientTest.instructions") }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  id: "js-test",
                  style: {
                    backgroundColor: "#e8f5e8",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    margin: "0.5rem 0"
                  },
                  children: /* @__PURE__ */ jsx("p", { children: t("diagnostics.testPage.clientTest.loading") })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => alert(t("diagnostics.testPage.alerts.jsWorking")),
                  style: {
                    padding: "0.5rem 1rem",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  },
                  children: t("diagnostics.testPage.clientTest.button")
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { style: { marginTop: "2rem", color: "#666" }, children: t("diagnostics.testPage.footer") }),
        /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: clientScript } })
      ]
    }
  );
};
const SSRTest = () => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("pre", { children: [
      "SSR OK: ",
      (/* @__PURE__ */ new Date()).toISOString()
    ] }),
    /* @__PURE__ */ jsx("p", { children: "Se você está vendo este texto sem JavaScript, o SSR está funcionando." }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Timestamp do servidor: ",
      (/* @__PURE__ */ new Date()).toLocaleString()
    ] })
  ] });
};
const BarePage = () => {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "Bare SSR Test" }),
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs("pre", { children: [
        "BARE SSR OK: ",
        (/* @__PURE__ */ new Date()).toISOString()
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Se você vê este texto, o SSR básico está funcionando." }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Timestamp: ",
        (/* @__PURE__ */ new Date()).toLocaleString()
      ] })
    ] })
  ] });
};
const StaticBare = () => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const { t, i18n: i18n2 } = useTranslation();
  return /* @__PURE__ */ jsxs("html", { lang: i18n2.language, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: t("diagnostics.staticBare.title") }),
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("pre", { children: t("diagnostics.staticBare.status", { timestamp }) }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.staticBare.instructions") }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.staticBare.timestamp", { timestamp: (/* @__PURE__ */ new Date()).toLocaleString() }) }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.staticBare.renderMode") })
    ] })
  ] });
};
const SSRCanary = () => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const { t, i18n: i18n2 } = useTranslation();
  return /* @__PURE__ */ jsxs("html", { lang: i18n2.language, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: t("diagnostics.ssrCanary.title") }),
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("pre", { children: t("diagnostics.ssrCanary.status", { timestamp }) }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.ssrCanary.instructions") }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.ssrCanary.timestamp", { timestamp: (/* @__PURE__ */ new Date()).toLocaleString() }) }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.ssrCanary.renderMode") }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.ssrCanary.runtime") }),
      /* @__PURE__ */ jsx("p", { children: t("diagnostics.ssrCanary.dynamicMode") })
    ] })
  ] });
};
class AuthErrorBoundary extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "handleRetry", () => {
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.reload();
    });
    __publicField(this, "handleReset", () => {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + (/* @__PURE__ */ new Date()).toUTCString() + ";path=/");
      });
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.href = "/";
    });
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Authentication Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (this.state.hasError) {
      const isAuthError = ((_b = (_a = this.state.error) == null ? void 0 : _a.message) == null ? void 0 : _b.includes("body stream")) || ((_d = (_c = this.state.error) == null ? void 0 : _c.message) == null ? void 0 : _d.includes("json")) || ((_f = (_e = this.state.error) == null ? void 0 : _e.message) == null ? void 0 : _f.includes("auth")) || ((_h = (_g = this.state.error) == null ? void 0 : _g.message) == null ? void 0 : _h.includes("fetch"));
      return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-forge-cream p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-white/95 backdrop-blur-sm border border-red-200 shadow-xl", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-red-600 text-xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5" }),
          "Authentication Error"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: isAuthError ? /* @__PURE__ */ jsx("p", { children: "An authentication error occurred. This might be due to a network issue or temporary service problem." }) : /* @__PURE__ */ jsx("p", { children: "An unexpected error occurred in the authentication system." }) }),
          process.env.NODE_ENV === "development" && this.state.error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 p-3 rounded-lg border border-red-200", children: /* @__PURE__ */ jsxs("p", { className: "text-xs font-mono text-red-700", children: [
            "Error: ",
            this.state.error.message
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: this.handleRetry,
                className: "w-full bg-forge-orange hover:bg-forge-orange-light",
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                  "Try Again"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: this.handleReset,
                variant: "outline",
                className: "w-full border-red-200 text-red-600 hover:bg-red-50",
                children: "Reset & Go Home"
              }
            )
          ] })
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
function AdminLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const navItems = useMemo(
    () => [
      { to: "/dashboard/admin", label: t("admin.layout.nav.overview"), icon: Settings, end: true },
      { to: "/dashboard/admin/formations", label: "Formations", icon: GraduationCap },
      { to: "/dashboard/admin/paths", label: t("admin.layout.nav.paths"), icon: Layers3 },
      { to: "/dashboard/admin/courses", label: t("admin.layout.nav.courses"), icon: BookOpen },
      { to: "/dashboard/admin/modules", label: t("admin.layout.nav.modules"), icon: ListChecks },
      { to: "/dashboard/admin/lessons", label: t("admin.layout.nav.lessons"), icon: FileText },
      { to: "/dashboard/admin/projects", label: t("admin.layout.nav.projects"), icon: FolderGit2 }
    ],
    [t]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-forge-orange", children: t("admin.layout.kicker") }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-forge-dark", children: t("admin.layout.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: t("admin.layout.subtitle") })
      ] }) }),
      /* @__PURE__ */ jsx("nav", { className: "flex flex-wrap gap-2 pt-2", children: navItems.map(({ to, label, icon: Icon, end }) => {
        const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
        return /* @__PURE__ */ jsxs(
          NavLink,
          {
            to,
            end,
            className: cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all",
              isActive ? "border-forge-orange bg-forge-orange/10 text-forge-orange shadow-sm" : "border-transparent bg-white text-forge-gray hover:border-forge-cream hover:bg-forge-cream/40 hover:text-forge-dark"
            ),
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
              label
            ]
          },
          to
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "space-y-6", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
const overviewItems = [
  {
    label: "Learning Paths",
    description: "Create thematic journeys and bundle courses together.",
    icon: Layers3
  },
  {
    label: "Courses",
    description: "Organize syllabus, outcomes, and prerequisites.",
    icon: BookOpen
  },
  {
    label: "Modules",
    description: "Group lessons under clear learning milestones.",
    icon: ListChecks
  },
  {
    label: "Lessons",
    description: "Publish text, video, or quiz content for builders.",
    icon: FileText
  }
];
function AdminOverview() {
  const { user } = useAuth();
  return /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-2", children: /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-2 border-forge-cream/80 bg-white/80", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-forge-dark", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-forge-orange" }),
        "Admin Access Granted"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: (user == null ? void 0 : user.email) ? `Managing content as ${user.email}.` : "Manage platform content." })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: "grid gap-4 md:grid-cols-2", children: overviewItems.map((item) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex gap-3 rounded-xl border border-dashed border-forge-cream/60 bg-forge-cream/20 p-4",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-forge-orange/10 text-forge-orange", children: /* @__PURE__ */ jsx(item.icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-forge-dark", children: item.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: item.description })
          ] })
        ]
      },
      item.label
    )) })
  ] }) });
}
const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error == null ? void 0 : error.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-sm font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("overflow-y-auto", className),
      ...props,
      children
    }
  );
});
ScrollArea.displayName = "ScrollArea";
function LearningPathSelector({ formationId, selectedPaths, onPathsChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const supabase2 = createClientBrowser();
  const { data: availablePaths, isLoading } = useQuery({
    queryKey: ["available-learning-paths", formationId],
    queryFn: async () => {
      const { data: allPaths, error: allPathsError } = await supabase2.from("learning_paths").select("id, title, slug, status").eq("status", "published").order("title");
      if (allPathsError) throw allPathsError;
      const { data: existingPaths, error: existingError } = await supabase2.from("formation_paths").select("learning_path_id").eq("formation_id", formationId);
      if (existingError) throw existingError;
      const selectedIds = new Set((existingPaths == null ? void 0 : existingPaths.map((p) => p.learning_path_id)) || []);
      return (allPaths == null ? void 0 : allPaths.filter((path) => !selectedIds.has(path.id))) || [];
    }
  });
  const addPathMutation = useMutation({
    mutationFn: async ({ path, order }) => {
      const { error } = await supabase2.from("formation_paths").insert({
        formation_id: formationId,
        learning_path_id: path.id,
        order
      });
      if (error) throw error;
      return path;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-learning-paths", formationId] });
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
      toast$1.success("Path added to formation");
    },
    onError: (error) => {
      toast$1.error("Failed to add path: " + error.message);
    }
  });
  const removePathMutation = useMutation({
    mutationFn: async (pathId) => {
      const { error } = await supabase2.from("formation_paths").delete().eq("formation_id", formationId).eq("learning_path_id", pathId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-learning-paths", formationId] });
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
      toast$1.success("Path removed from formation");
    },
    onError: (error) => {
      toast$1.error("Failed to remove path: " + error.message);
    }
  });
  const reorderPathMutation = useMutation({
    mutationFn: async ({ pathId, newOrder }) => {
      const { error } = await supabase2.from("formation_paths").update({ order: newOrder }).eq("formation_id", formationId).eq("learning_path_id", pathId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
      toast$1.success("Path order updated");
    },
    onError: (error) => {
      toast$1.error("Failed to reorder path: " + error.message);
    }
  });
  const handleAddPath = async (path) => {
    const nextOrder = selectedPaths.length + 1;
    try {
      await addPathMutation.mutateAsync({ path, order: nextOrder });
      onPathsChange((current) => [
        ...current,
        { id: path.id, title: path.title, order: nextOrder }
      ]);
    } catch {
    }
  };
  const handleRemovePath = async (pathId) => {
    try {
      await removePathMutation.mutateAsync(pathId);
      onPathsChange((current) => {
        const remaining = current.filter((path) => path.id !== pathId);
        return remaining.map((path, index) => ({
          ...path,
          order: index + 1
        }));
      });
    } catch {
    }
  };
  const handleMovePath = (pathId, direction) => {
    const currentIndex = selectedPaths.findIndex((p) => p.id === pathId);
    if (currentIndex === -1) return;
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedPaths.length) return;
    const reorderedPaths = [...selectedPaths];
    const [movedPath] = reorderedPaths.splice(currentIndex, 1);
    reorderedPaths.splice(newIndex, 0, movedPath);
    const updatedPaths = reorderedPaths.map((path, index) => ({
      ...path,
      order: index + 1
    }));
    onPathsChange(updatedPaths);
    reorderPathMutation.mutate({ pathId, newOrder: newIndex + 1 });
  };
  const filteredPaths = (availablePaths == null ? void 0 : availablePaths.filter(
    (path) => {
      var _a;
      return path.title.toLowerCase().includes(searchTerm.toLowerCase()) || ((_a = path.slug) == null ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  )) || [];
  const sortedSelectedPaths = useMemo(
    () => [...selectedPaths].sort((a, b) => a.order - b.order),
    [selectedPaths]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "search-paths", children: "Add Learning Paths" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "search-paths",
          placeholder: "Search paths...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className: "mt-1"
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) }) : /* @__PURE__ */ jsx(ScrollArea, { className: "h-48 border rounded-md p-2", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filteredPaths.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: searchTerm ? "No paths found" : "All available paths are already added" }) : filteredPaths.map((path) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-between p-2 hover:bg-accent rounded",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: path.title }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: path.slug })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => handleAddPath(path),
              disabled: addPathMutation.isPending,
              children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ]
      },
      path.id
    )) }) }),
    selectedPaths.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { children: [
          "Selected Paths (",
          selectedPaths.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-2", children: sortedSelectedPaths.map((path, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between p-2 border rounded",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: () => handleMovePath(path.id, "up"),
                      disabled: index === 0 || reorderPathMutation.isPending,
                      children: /* @__PURE__ */ jsx(ArrowUp, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: () => handleMovePath(path.id, "down"),
                      disabled: index === selectedPaths.length - 1 || reorderPathMutation.isPending,
                      children: /* @__PURE__ */ jsx(ArrowDown, { className: "h-3 w-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: path.title }),
                  /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                    "Order: ",
                    path.order
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => handleRemovePath(path.id),
                  disabled: removePathMutation.isPending,
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ]
          },
          path.id
        )) })
      ] })
    ] })
  ] });
}
const slugify$4 = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const formationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean(),
  status: z.enum(["draft", "published", "coming_soon"])
});
function AdminFormations() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [deletingFormation, setDeletingFormation] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [selectedPathsState, setSelectedPathsState] = useState([]);
  const queryClient = useQueryClient();
  const supabase2 = createClientBrowser();
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(formationSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      thumbnail_url: "",
      is_published: false,
      status: "draft"
    }
  });
  const buildFormationPayload = (values) => {
    var _a, _b;
    const baseStatus = values.status;
    const statusFromSelection = baseStatus === "published" || baseStatus === "coming_soon";
    const effectiveStatus = statusFromSelection ? baseStatus : values.is_published ? "published" : "draft";
    const isPublishedFlag = effectiveStatus !== "draft";
    return {
      title: values.title.trim(),
      description: ((_a = values.description) == null ? void 0 : _a.trim()) ? values.description.trim() : null,
      slug: values.slug.trim(),
      thumbnail_url: ((_b = values.thumbnail_url) == null ? void 0 : _b.trim()) ? values.thumbnail_url.trim() : null,
      status: effectiveStatus,
      is_published: isPublishedFlag
    };
  };
  const resetFormForCreate = useCallback(() => {
    form.reset({
      title: "",
      description: "",
      slug: "",
      thumbnail_url: "",
      is_published: false,
      status: "draft"
    });
    setSlugManuallyEdited(false);
    setSelectedPathsState([]);
  }, [form]);
  useEffect(() => {
    var _a;
    if (dialogOpen && editingFormation) {
      form.reset({
        title: editingFormation.title,
        description: editingFormation.description || "",
        slug: editingFormation.slug || "",
        thumbnail_url: editingFormation.thumbnail_url || "",
        is_published: editingFormation.is_published,
        status: editingFormation.status ?? "draft"
      });
      const orderedPaths = ((_a = editingFormation.paths) == null ? void 0 : _a.slice().sort((a, b) => a.order - b.order)) ?? [];
      setSelectedPathsState(orderedPaths);
    } else if (dialogOpen) {
      resetFormForCreate();
    }
  }, [dialogOpen, editingFormation, form, resetFormForCreate]);
  useEffect(() => {
    if (!dialogOpen) {
      resetFormForCreate();
      setEditingFormation(null);
      setDeletingFormation(null);
    }
  }, [dialogOpen, resetFormForCreate]);
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const insertPayload = {
        ...payload,
        created_by: (user == null ? void 0 : user.id) ?? void 0,
        updated_by: (user == null ? void 0 : user.id) ?? void 0,
        published_at: payload.is_published ? (/* @__PURE__ */ new Date()).toISOString() : null
      };
      const { error } = await supabase2.from("formations").insert(insertPayload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
      setDialogOpen(false);
      resetFormForCreate();
      toast$1.success("Formation created successfully");
    },
    onError: (error) => {
      toast$1.error("Failed to create formation: " + error.message);
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
      previous
    }) => {
      const updatePayload = {
        ...payload,
        updated_by: (user == null ? void 0 : user.id) ?? void 0,
        published_at: payload.is_published ? previous.published_at ?? (/* @__PURE__ */ new Date()).toISOString() : null
      };
      const { error } = await supabase2.from("formations").update(updatePayload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
      setDialogOpen(false);
      setEditingFormation(null);
      resetFormForCreate();
      toast$1.success("Formation updated successfully");
    },
    onError: (error) => {
      toast$1.error("Failed to update formation: " + error.message);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase2.from("formations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-formations"] });
      setDeleteDialogOpen(false);
      setDeletingFormation(null);
      toast$1.success("Formation deleted successfully");
    },
    onError: (error) => {
      toast$1.error("Failed to delete formation: " + error.message);
    }
  });
  const watchedTitle = form.watch("title");
  const watchedSlug = form.watch("slug");
  useEffect(() => {
    if (!slugManuallyEdited && !editingFormation) {
      const generated = slugify$4(watchedTitle ?? "");
      if (generated && generated !== watchedSlug) {
        form.setValue("slug", generated, { shouldValidate: false });
      }
    }
  }, [watchedTitle, slugManuallyEdited, editingFormation, watchedSlug, form]);
  const { data: formations, isLoading } = useQuery({
    queryKey: ["admin-formations"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("formations").select(`
          id, title, slug, description, is_published, status, published_at, created_at, updated_at,
          formation_paths(
            order,
            learning_paths(id, title)
          )
        `).order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      return rows.map((formation) => {
        const { formation_paths: rawPaths = [], ...rest } = formation;
        const paths = rawPaths.map((fp) => {
          if (!fp.learning_paths) return null;
          return {
            id: fp.learning_paths.id,
            title: fp.learning_paths.title,
            order: fp.order ?? 0
          };
        }).filter((path) => Boolean(path)).sort((a, b) => a.order - b.order);
        return {
          ...rest,
          paths_count: paths.length,
          paths
        };
      });
    }
  });
  const handleSubmit = (data) => {
    const payload = buildFormationPayload(data);
    if (editingFormation) {
      updateMutation.mutate({
        id: editingFormation.id,
        payload,
        previous: editingFormation
      });
    } else {
      createMutation.mutate(payload);
    }
  };
  const handleEdit = (formation) => {
    setEditingFormation(formation);
    setDialogOpen(true);
  };
  const handleDelete = (formation) => {
    setDeletingFormation(formation);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (deletingFormation) {
      deleteMutation.mutate(deletingFormation.id);
    }
  };
  const handleAddNew = () => {
    setEditingFormation(null);
    resetFormForCreate();
    setDialogOpen(true);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Formations" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage learning formations and their paths" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleAddNew, children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Add Formation"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: formations == null ? void 0 : formations.map((formation) => /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            formation.title,
            formation.status === "published" ? /* @__PURE__ */ jsx(Badge, { variant: "default", children: "Published" }) : formation.status === "coming_soon" ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Coming Soon" }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Draft" })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: formation.description || "No description provided" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleEdit(formation),
              children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleDelete(formation),
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }),
            formation.paths_count,
            " paths"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "Created ",
            formatDistanceToNow(new Date(formation.created_at)),
            " ago"
          ] }),
          formation.published_at && /* @__PURE__ */ jsxs("div", { children: [
            "Published ",
            formatDistanceToNow(new Date(formation.published_at)),
            " ago"
          ] })
        ] }),
        formation.paths && formation.paths.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2", children: "Learning Paths:" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formation.paths.map((path) => /* @__PURE__ */ jsx(Badge, { variant: "outline", children: path.title }, path.id)) })
        ] })
      ] })
    ] }, formation.id)) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[640px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editingFormation ? "Edit Formation" : "Create Formation" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: editingFormation ? "Update the formation details below." : "Fill in the details to create a new formation." })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "title",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Title" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Formation title", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "slug",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Slug" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "formation-slug",
                  ...field,
                  onChange: (e) => {
                    field.onChange(e);
                    setSlugManuallyEdited(true);
                  }
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "description",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Description" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Formation description",
                  className: "resize-none",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "thumbnail_url",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Thumbnail URL" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "https://example.com/image.jpg", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "status",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Status" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  value: field.value,
                  onChange: (event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    form.setValue("is_published", value !== "draft", {
                      shouldDirty: true
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
                    /* @__PURE__ */ jsx("option", { value: "published", children: "Published" }),
                    /* @__PURE__ */ jsx("option", { value: "coming_soon", children: "Coming Soon" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Draft formations stay private. Coming soon keeps it visible but routes users to the waiting list." }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "is_published",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: "Published" }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Make this formation visible to users" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: field.value,
                  onCheckedChange: (checked) => {
                    field.onChange(checked);
                    const currentStatus = form.getValues("status");
                    if (checked && currentStatus === "draft") {
                      form.setValue("status", "published", { shouldDirty: true });
                    }
                    if (!checked && currentStatus !== "draft") {
                      form.setValue("status", "draft", { shouldDirty: true });
                    }
                  }
                }
              ) })
            ] })
          }
        ),
        editingFormation ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-forge-dark", children: "Learning paths" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Add or reorder learning paths for this formation. Changes are saved immediately." }),
            /* @__PURE__ */ jsx(
              LearningPathSelector,
              {
                formationId: editingFormation.id,
                selectedPaths: selectedPathsState,
                onPathsChange: setSelectedPathsState
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Save the formation first to associate learning paths." })
        ] }),
        /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: createMutation.isPending || updateMutation.isPending, children: [
          (createMutation.isPending || updateMutation.isPending) && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          editingFormation ? "Update" : "Create"
        ] }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Are you sure?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          'This action cannot be undone. This will permanently delete the formation "',
          deletingFormation == null ? void 0 : deletingFormation.title,
          '" and remove all associated path assignments.'
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxs(AlertDialogAction, { onClick: confirmDelete, disabled: deleteMutation.isPending, children: [
          deleteMutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Delete"
        ] })
      ] })
    ] }) })
  ] });
}
const slugify$3 = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const pathSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  is_published: z.boolean(),
  status: z.enum(["draft", "published", "coming_soon"])
});
function AdminPaths() {
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingPath, setEditingPath] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const form = useForm({
    resolver: zodResolver(pathSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      is_published: false,
      status: "draft"
    }
  });
  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEditingPath(null);
      setSlugManuallyEdited(false);
    }
  }, [dialogOpen, form]);
  const watchedTitle = form.watch("title");
  const watchedSlug = form.watch("slug");
  useEffect(() => {
    if (!slugManuallyEdited && !editingPath) {
      const generated = slugify$3(watchedTitle ?? "");
      if (generated && generated !== watchedSlug) {
        form.setValue("slug", generated, { shouldValidate: false });
      }
    }
  }, [watchedTitle, slugManuallyEdited, editingPath, watchedSlug, form]);
  const { data: paths, isLoading } = useQuery({
    queryKey: ["admin-paths"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("learning_paths").select("id, title, slug, description, is_published, published_at, created_at, updated_at, status, courses:courses(id)").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        ...item,
        courses_count: Array.isArray(item.courses) ? item.courses.length : 0
      }));
    }
  });
  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      var _a;
      const trimmedTitle = values.title.trim();
      const trimmedSlug = values.slug.trim();
      const trimmedDescription = ((_a = values.description) == null ? void 0 : _a.trim()) ? values.description.trim() : null;
      const baseStatus = values.status;
      const statusFromSelection = baseStatus === "published" || baseStatus === "coming_soon";
      const effectiveStatus = statusFromSelection ? baseStatus : values.is_published ? "published" : "draft";
      const shouldPublish = effectiveStatus !== "draft";
      const payload = {
        title: trimmedTitle,
        slug: trimmedSlug,
        description: trimmedDescription,
        is_published: shouldPublish,
        status: effectiveStatus,
        published_at: shouldPublish ? (editingPath == null ? void 0 : editingPath.published_at) ?? (/* @__PURE__ */ new Date()).toISOString() : null
      };
      if (editingPath) {
        const { error } = await supabase2.from("learning_paths").update(payload).eq("id", editingPath.id);
        if (error) throw error;
      } else {
        const { error } = await supabase2.from("learning_paths").insert({
          ...payload,
          published_at: shouldPublish ? (/* @__PURE__ */ new Date()).toISOString() : null
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-paths"] });
      toast$1.success(editingPath ? "Learning path updated" : "Learning path created");
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error saving learning path", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to save learning path");
    }
  });
  const publishMutation = useMutation({
    mutationFn: async ({
      id,
      publish,
      previousStatus,
      previousPublishedAt
    }) => {
      const nextStatus = publish ? previousStatus === "coming_soon" ? "coming_soon" : "published" : "draft";
      const nextIsPublished = nextStatus !== "draft";
      const { error } = await supabase2.from("learning_paths").update({
        is_published: nextIsPublished,
        status: nextStatus,
        published_at: nextIsPublished ? previousPublishedAt ?? (/* @__PURE__ */ new Date()).toISOString() : null
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-paths"] });
      toast$1.success("Publish state updated");
    },
    onError: (error) => {
      console.error("Error toggling publish", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to toggle publish state");
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase2.from("learning_paths").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-paths"] });
      toast$1.success("Learning path deleted");
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Error deleting learning path", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to delete learning path");
    }
  });
  const openForCreate = () => {
    setEditingPath(null);
    setSlugManuallyEdited(false);
    form.reset({ title: "", slug: "", description: "", is_published: false, status: "draft" });
    setDialogOpen(true);
  };
  const openForEdit = (path) => {
    setEditingPath(path);
    setSlugManuallyEdited(true);
    form.reset({
      title: path.title ?? "",
      slug: path.slug ?? "",
      description: path.description ?? "",
      is_published: path.is_published,
      status: path.status ?? "draft"
    });
    setDialogOpen(true);
  };
  const onSubmit = (values) => {
    upsertMutation.mutate(values);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-forge-dark", children: "Learning Paths" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: "Group courses into curated journeys. Control slug, visibility, and descriptions from here." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: openForCreate, className: "self-start sm:self-auto", children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "New Path"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-8 text-forge-gray", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      " Loading learning paths..."
    ] }) }) : paths && paths.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: paths.map((path) => /* @__PURE__ */ jsxs(Card, { className: "border border-forge-cream/70 bg-white/80", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-forge-dark", children: [
            path.title,
            path.status === "published" ? /* @__PURE__ */ jsx(Badge, { variant: "default", className: "bg-forge-orange text-white hover:bg-forge-orange/90", children: "Published" }) : path.status === "coming_soon" ? /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-800 hover:bg-blue-200", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 mr-1" }),
              "Coming Soon"
            ] }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Draft" })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-sm text-forge-gray", children: path.description || "No description" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openForEdit(path), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "text-red-500 hover:text-red-600",
              onClick: () => setDeleteTarget(path),
              children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm text-forge-gray", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Slug:" }),
            " ",
            path.slug
          ] }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Courses:" }),
            " ",
            path.courses_count
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-forge-gray/80", children: [
          "Updated ",
          path.updated_at ? formatDistanceToNow(new Date(path.updated_at), { addSuffix: true }) : "N/A"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardFooter, { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(
          Switch,
          {
            id: `publish-${path.id}`,
            checked: path.is_published,
            onCheckedChange: (checked) => publishMutation.mutate({
              id: path.id,
              publish: checked,
              previousStatus: path.status,
              previousPublishedAt: path.published_at ?? null
            }),
            disabled: publishMutation.isPending
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: `publish-${path.id}`, className: "text-forge-gray", children: path.is_published ? "Unpublish" : "Publish" })
      ] }) })
    ] }, path.id)) }) : /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/70", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 text-center text-forge-gray", children: "No learning paths yet. Create your first path to start structuring content." }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editingPath ? "Edit learning path" : "New learning path" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: editingPath ? "Update title, slug, or publication state. Changes go live immediately." : "Define the high-level journey for learners. You can add courses after saving." })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "title",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Title" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g. Web Development Accelerator", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "slug",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Slug" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "web-development-accelerator",
                  ...field,
                  onChange: (event) => {
                    setSlugManuallyEdited(true);
                    field.onChange(event);
                  }
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "description",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Description" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  rows: 4,
                  placeholder: "Summarize the journey learners will experience.",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "status",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Status" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  value: field.value,
                  onChange: (event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    form.setValue("is_published", value !== "draft", {
                      shouldDirty: true
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
                    /* @__PURE__ */ jsx("option", { value: "published", children: "Published" }),
                    /* @__PURE__ */ jsx("option", { value: "coming_soon", children: "Coming Soon" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "is_published",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: "Publish immediately" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: field.value ? "The path is visible to all enrolled learners." : "Keep as draft until you are ready to publish." })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: field.value,
                  onCheckedChange: (checked) => {
                    field.onChange(checked);
                    const currentStatus = form.getValues("status");
                    if (checked && currentStatus === "draft") {
                      form.setValue("status", "published", { shouldDirty: true });
                    }
                    if (!checked && currentStatus !== "draft") {
                      form.setValue("status", "draft", { shouldDirty: true });
                    }
                  },
                  disabled: form.formState.isSubmitting
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), disabled: form.formState.isSubmitting, children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: form.formState.isSubmitting, children: form.formState.isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            " Saving..."
          ] }) : editingPath ? "Save changes" : "Create path" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: Boolean(deleteTarget), onOpenChange: (open) => !open && setDeleteTarget(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete learning path" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "This action cannot be undone. Deleting a path will remove all associated courses, modules, and lessons. Make sure you really want to remove “",
          deleteTarget == null ? void 0 : deleteTarget.title,
          "”."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: deleteMutation.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => deleteTarget && deleteMutation.mutate(deleteTarget.id),
            className: "bg-red-500 hover:bg-red-600",
            disabled: deleteMutation.isPending,
            children: deleteMutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Deleting..."
            ] }) : "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
const slugify$2 = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const courseFormSchema = z.object({
  path_id: z.string().uuid("Select a learning path"),
  title: z.string().min(3, "Title must have at least 3 characters"),
  slug: z.string().min(3, "Slug must have at least 3 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().max(200, "Summary is too long").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int("Order must be an integer").min(1, "Order must be at least 1"),
  duration_minutes: z.union([z.coerce.number().int().min(0), z.literal("")]).optional().transform((value) => value === "" || value === void 0 ? null : Number(value)),
  thumbnail_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_published: z.boolean().default(false),
  status: z.enum(["draft", "published", "coming_soon"])
});
function AdminCourses() {
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const queryClient = useQueryClient();
  const [selectedPathFilter, setSelectedPathFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      path_id: "",
      title: "",
      slug: "",
      summary: "",
      description: "",
      order: 1,
      duration_minutes: null,
      thumbnail_url: "",
      is_published: false,
      status: "draft"
    }
  });
  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEditingCourse(null);
      setSlugManuallyEdited(false);
    }
  }, [dialogOpen, form]);
  const watchedTitle = form.watch("title");
  const watchedSlug = form.watch("slug");
  useEffect(() => {
    if (!slugManuallyEdited && !editingCourse) {
      const generated = slugify$2(watchedTitle ?? "");
      if (generated && generated !== watchedSlug) {
        form.setValue("slug", generated, { shouldValidate: false });
      }
    }
  }, [watchedTitle, watchedSlug, slugManuallyEdited, editingCourse, form]);
  const { data: learningPaths = [] } = useQuery({
    queryKey: ["admin-courses-paths"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("learning_paths").select("id, title, slug").order("title", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const pathLookup = useMemo(() => {
    return learningPaths.reduce((acc, path) => {
      acc[path.id] = path;
      return acc;
    }, {});
  }, [learningPaths]);
  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("courses").select(
        "id, title, slug, summary, description, path_id, order, duration_minutes, status, is_published, published_at, thumbnail_url, updated_at, modules:modules(id)"
      ).order("order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        ...item,
        moduleCount: Array.isArray(item.modules) ? item.modules.length : 0
      }));
    }
  });
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (selectedPathFilter === "all") return courses;
    return courses.filter((course) => course.path_id === selectedPathFilter);
  }, [courses, selectedPathFilter]);
  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      var _a, _b, _c;
      const baseStatus = values.status;
      const statusFromSelection = baseStatus === "published" || baseStatus === "coming_soon";
      const effectiveStatus = statusFromSelection ? baseStatus : values.is_published ? "published" : "draft";
      const isPublishedFlag = effectiveStatus !== "draft";
      const payload = {
        path_id: values.path_id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        summary: ((_a = values.summary) == null ? void 0 : _a.trim()) ? values.summary.trim() : null,
        description: ((_b = values.description) == null ? void 0 : _b.trim()) ? values.description.trim() : null,
        order: values.order,
        duration_minutes: values.duration_minutes ?? null,
        thumbnail_url: ((_c = values.thumbnail_url) == null ? void 0 : _c.trim()) ? values.thumbnail_url.trim() : null,
        status: effectiveStatus,
        is_published: isPublishedFlag,
        published_at: isPublishedFlag ? (editingCourse == null ? void 0 : editingCourse.published_at) ?? (/* @__PURE__ */ new Date()).toISOString() : null
      };
      if (editingCourse) {
        const { error } = await supabase2.from("courses").update(payload).eq("id", editingCourse.id);
        if (error) throw error;
      } else {
        const { error } = await supabase2.from("courses").insert({
          ...payload,
          published_at: isPublishedFlag ? (/* @__PURE__ */ new Date()).toISOString() : null
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast$1.success(editingCourse ? "Course updated" : "Course created");
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error saving course", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to save course");
    }
  });
  const publishMutation = useMutation({
    mutationFn: async ({
      id,
      publish,
      previousStatus,
      previousPublishedAt
    }) => {
      const nextStatus = publish ? previousStatus === "coming_soon" ? "coming_soon" : "published" : "draft";
      const nextIsPublished = nextStatus !== "draft";
      const { error } = await supabase2.from("courses").update({
        status: nextStatus,
        is_published: nextIsPublished,
        published_at: nextIsPublished ? previousPublishedAt ?? (/* @__PURE__ */ new Date()).toISOString() : null
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast$1.success("Publish state updated");
    },
    onError: (error) => {
      console.error("Error toggling publish", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to toggle publish state");
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase2.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast$1.success("Course deleted");
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Error deleting course", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to delete course");
    }
  });
  const openForCreate = () => {
    setEditingCourse(null);
    setSlugManuallyEdited(false);
    form.reset({
      path_id: selectedPathFilter !== "all" ? selectedPathFilter : "",
      title: "",
      slug: "",
      summary: "",
      description: "",
      order: 1,
      duration_minutes: null,
      thumbnail_url: "",
      is_published: false,
      status: "draft"
    });
    setDialogOpen(true);
  };
  const openForEdit = (course) => {
    setEditingCourse(course);
    setSlugManuallyEdited(true);
    form.reset({
      path_id: course.path_id ?? "",
      title: course.title ?? "",
      slug: course.slug ?? "",
      summary: course.summary ?? "",
      description: course.description ?? "",
      order: course.order ?? 1,
      duration_minutes: course.duration_minutes ?? null,
      thumbnail_url: course.thumbnail_url ?? "",
      is_published: course.is_published,
      status: course.status ?? "draft"
    });
    setDialogOpen(true);
  };
  const onSubmit = (values) => {
    upsertMutation.mutate(values);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-forge-dark", children: "Courses" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: "Manage courses inside each learning path. Adjust order, metadata, and publish state." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedPathFilter,
            onValueChange: (value) => setSelectedPathFilter(value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[240px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by path" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All paths" }),
                learningPaths.map((path) => /* @__PURE__ */ jsx(SelectItem, { value: path.id, children: path.title }, path.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Button, { onClick: openForCreate, className: "sm:w-auto", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "New Course"
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-8 text-forge-gray", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      " Loading courses..."
    ] }) }) : filteredCourses && filteredCourses.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: filteredCourses.map((course) => {
      var _a;
      return /* @__PURE__ */ jsxs(Card, { className: "border border-forge-cream/70 bg-white/80", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex flex-wrap items-center gap-2 text-forge-dark", children: [
              "#",
              course.order,
              " · ",
              course.title,
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: course.status === "published" ? "default" : course.status === "coming_soon" ? "secondary" : "outline",
                  className: course.status === "published" ? "bg-forge-orange text-white hover:bg-forge-orange/90" : "",
                  children: course.status === "published" ? "Published" : course.status === "coming_soon" ? "Coming Soon" : "Draft"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { className: "text-sm text-forge-gray", children: course.summary || "No summary" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openForEdit(course), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                className: "text-red-500 hover:text-red-600",
                onClick: () => setDeleteTarget(course),
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm text-forge-gray", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Path:" }),
              " ",
              course.path_id ? ((_a = pathLookup[course.path_id]) == null ? void 0 : _a.title) ?? "Unknown path" : "Unassigned"
            ] }),
            /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Slug:" }),
              " ",
              course.slug
            ] }),
            /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Modules:" }),
              " ",
              course.moduleCount
            ] }),
            course.duration_minutes != null && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Duration:" }),
                " ",
                course.duration_minutes,
                " min"
              ] })
            ] })
          ] }),
          course.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-forge-gray/90", children: course.description }),
          course.thumbnail_url && /* @__PURE__ */ jsx(
            "a",
            {
              href: course.thumbnail_url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xs font-medium text-forge-orange hover:underline",
              children: "View thumbnail"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-forge-gray/80", children: [
            "Updated ",
            course.updated_at ? formatDistanceToNow(new Date(course.updated_at), { addSuffix: true }) : "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: `course-publish-${course.id}`,
              checked: course.is_published,
              onCheckedChange: (checked) => publishMutation.mutate({
                id: course.id,
                publish: checked,
                previousStatus: course.status ?? "draft",
                previousPublishedAt: course.published_at ?? null
              }),
              disabled: publishMutation.isPending
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: `course-publish-${course.id}`, className: "text-forge-gray", children: course.is_published ? "Unpublish" : "Publish" })
        ] }) })
      ] }, course.id);
    }) }) : /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/70", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 text-center text-forge-gray", children: "No courses found for this filter. Create a new course to start building structure." }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editingCourse ? "Edit course" : "New course" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: editingCourse ? "Update metadata, ordering, and visibility for this course." : "Create a course inside a learning path. You can attach modules after saving." })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "path_id",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Learning path" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(Select, { value: field.value, onValueChange: field.onChange, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a learning path" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: learningPaths.map((path) => /* @__PURE__ */ jsx(SelectItem, { value: path.id, children: path.title }, path.id)) })
              ] }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "title",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Title" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g. React & TypeScript Foundations", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "slug",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Slug" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "react-typescript-foundations",
                    ...field,
                    onChange: (event) => {
                      setSlugManuallyEdited(true);
                      field.onChange(event);
                    }
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "summary",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Summary" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Short one-liner for dashboards", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "description",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Description" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Textarea, { rows: 4, placeholder: "Detailed course description", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "order",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Order" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 1, ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "duration_minutes",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Duration (minutes)" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 0, placeholder: "Optional", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "thumbnail_url",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Thumbnail URL" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "https://...", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Use a Supabase Storage public URL or any accessible image. Media uploads will be integrated soon." }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "status",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Status" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  value: field.value,
                  onChange: (event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    form.setValue("is_published", value !== "draft", {
                      shouldDirty: true
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
                    /* @__PURE__ */ jsx("option", { value: "published", children: "Published" }),
                    /* @__PURE__ */ jsx("option", { value: "coming_soon", children: "Coming Soon" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Coming soon keeps the course visible while you collect early interest." }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "is_published",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: "Publish immediately" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: field.value ? "Published courses are visible to learners enrolled in the path." : "Keep as draft until modules and lessons are ready." })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: field.value,
                  onCheckedChange: (checked) => {
                    field.onChange(checked);
                    const currentStatus = form.getValues("status");
                    if (checked && currentStatus === "draft") {
                      form.setValue("status", "published", { shouldDirty: true });
                    }
                    if (!checked && currentStatus !== "draft") {
                      form.setValue("status", "draft", { shouldDirty: true });
                    }
                  },
                  disabled: form.formState.isSubmitting
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), disabled: form.formState.isSubmitting, children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: form.formState.isSubmitting, children: form.formState.isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            " Saving..."
          ] }) : editingCourse ? "Save changes" : "Create course" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: Boolean(deleteTarget), onOpenChange: (open) => !open && setDeleteTarget(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete course" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Deleting a course will also remove its modules and lessons. This cannot be undone. Continue deleting “",
          deleteTarget == null ? void 0 : deleteTarget.title,
          "”?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: deleteMutation.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => deleteTarget && deleteMutation.mutate(deleteTarget.id),
            className: "bg-red-500 hover:bg-red-600",
            disabled: deleteMutation.isPending,
            children: deleteMutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Deleting..."
            ] }) : "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
const slugify$1 = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const moduleFormSchema = z.object({
  course_id: z.string().uuid("Select a course"),
  title: z.string().min(3, "Title must have at least 3 characters"),
  slug: z.string().min(3, "Slug must have at least 3 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int("Order must be an integer").min(1, "Order must be at least 1"),
  is_published: z.boolean().default(false)
});
function AdminModules() {
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const queryClient = useQueryClient();
  const [selectedPathFilter, setSelectedPathFilter] = useState("all");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const form = useForm({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      course_id: "",
      title: "",
      slug: "",
      summary: "",
      order: 1,
      is_published: false
    }
  });
  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEditingModule(null);
      setSlugManuallyEdited(false);
    }
  }, [dialogOpen, form]);
  const watchedTitle = form.watch("title");
  const watchedSlug = form.watch("slug");
  useEffect(() => {
    if (!slugManuallyEdited && !editingModule) {
      const generated = slugify$1(watchedTitle ?? "");
      if (generated && generated !== watchedSlug) {
        form.setValue("slug", generated, { shouldValidate: false });
      }
    }
  }, [watchedTitle, watchedSlug, slugManuallyEdited, editingModule, form]);
  const { data: learningPaths = [] } = useQuery({
    queryKey: ["admin-modules-paths"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("learning_paths").select("id, title").order("title", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["admin-modules-courses"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("courses").select("id, title, path_id, order").order("path_id", { ascending: true }).order("order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const pathLookup = useMemo(() => {
    return learningPaths.reduce((acc, path) => {
      acc[path.id] = path;
      return acc;
    }, {});
  }, [learningPaths]);
  const courseLookup = useMemo(() => {
    return courses.reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});
  }, [courses]);
  const filteredCourses = useMemo(() => {
    if (selectedPathFilter === "all") return courses;
    return courses.filter((course) => course.path_id === selectedPathFilter);
  }, [courses, selectedPathFilter]);
  const { data: modules, isLoading } = useQuery({
    queryKey: ["admin-modules"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("modules").select("id, title, slug, summary, order, course_id, is_published, published_at, updated_at, lessons:lessons(id)").order("course_id", { ascending: true }).order("order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        ...item,
        lessonCount: Array.isArray(item.lessons) ? item.lessons.length : 0
      }));
    }
  });
  const filteredModules = useMemo(() => {
    if (!modules) return [];
    return modules.filter((module) => {
      if (selectedPathFilter !== "all") {
        const course = module.course_id ? courseLookup[module.course_id] : null;
        if (!course || course.path_id !== selectedPathFilter) return false;
      }
      if (selectedCourseFilter !== "all" && module.course_id !== selectedCourseFilter) {
        return false;
      }
      return true;
    });
  }, [modules, selectedPathFilter, selectedCourseFilter, courseLookup]);
  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      var _a;
      const payload = {
        course_id: values.course_id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        summary: ((_a = values.summary) == null ? void 0 : _a.trim()) ? values.summary.trim() : null,
        order: values.order,
        is_published: values.is_published,
        published_at: values.is_published ? (editingModule == null ? void 0 : editingModule.published_at) ?? (/* @__PURE__ */ new Date()).toISOString() : null
      };
      if (editingModule) {
        const { error } = await supabase2.from("modules").update(payload).eq("id", editingModule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase2.from("modules").insert({
          ...payload,
          published_at: values.is_published ? (/* @__PURE__ */ new Date()).toISOString() : null
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast$1.success(editingModule ? "Module updated" : "Module created");
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error saving module", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to save module");
    }
  });
  const publishMutation = useMutation({
    mutationFn: async ({ id, publish }) => {
      const { error } = await supabase2.from("modules").update({ is_published: publish, published_at: publish ? (/* @__PURE__ */ new Date()).toISOString() : null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast$1.success("Publish state updated");
    },
    onError: (error) => {
      console.error("Error toggling publish", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to toggle publish state");
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase2.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-modules"] });
      toast$1.success("Module deleted");
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Error deleting module", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to delete module");
    }
  });
  const openForCreate = () => {
    setEditingModule(null);
    setSlugManuallyEdited(false);
    form.reset({
      course_id: selectedCourseFilter !== "all" ? selectedCourseFilter : "",
      title: "",
      slug: "",
      summary: "",
      order: 1,
      is_published: false
    });
    setDialogOpen(true);
  };
  const openForEdit = (module) => {
    setEditingModule(module);
    setSlugManuallyEdited(true);
    form.reset({
      course_id: module.course_id ?? "",
      title: module.title ?? "",
      slug: module.slug ?? "",
      summary: module.summary ?? "",
      order: module.order ?? 1,
      is_published: module.is_published
    });
    setDialogOpen(true);
  };
  const onSubmit = (values) => {
    upsertMutation.mutate(values);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-forge-dark", children: "Modules" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: "Structure lessons within courses. Manage ordering and publish visibility for each module." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center", children: [
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedPathFilter,
            onValueChange: (value) => {
              setSelectedPathFilter(value);
              setSelectedCourseFilter("all");
            },
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[220px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by path" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All paths" }),
                learningPaths.map((path) => /* @__PURE__ */ jsx(SelectItem, { value: path.id, children: path.title }, path.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedCourseFilter,
            onValueChange: (value) => setSelectedCourseFilter(value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[220px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by course" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All courses" }),
                filteredCourses.map((course) => /* @__PURE__ */ jsx(SelectItem, { value: course.id, children: course.title }, course.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Button, { onClick: openForCreate, className: "md:w-auto", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "New Module"
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-8 text-forge-gray", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      " Loading modules..."
    ] }) }) : filteredModules && filteredModules.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: filteredModules.map((module) => {
      const course = module.course_id ? courseLookup[module.course_id] : null;
      const path = (course == null ? void 0 : course.path_id) ? pathLookup[course.path_id] : null;
      return /* @__PURE__ */ jsxs(Card, { className: "border border-forge-cream/70 bg-white/80", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex flex-wrap items-center gap-2 text-forge-dark", children: [
              "#",
              module.order,
              " · ",
              module.title,
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: module.is_published ? "default" : "outline",
                  className: module.is_published ? "bg-forge-orange text-white hover:bg-forge-orange/90" : "",
                  children: module.is_published ? "Published" : "Draft"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { className: "text-sm text-forge-gray", children: module.summary || "No summary" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openForEdit(module), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                className: "text-red-500 hover:text-red-600",
                onClick: () => setDeleteTarget(module),
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm text-forge-gray", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Course:" }),
              " ",
              course ? course.title : "Unassigned"
            ] }),
            /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Path:" }),
              " ",
              path ? path.title : "Unassigned"
            ] }),
            /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Slug:" }),
              " ",
              module.slug
            ] }),
            /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Lessons:" }),
              " ",
              module.lessonCount
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-forge-gray/80", children: [
            "Updated ",
            module.updated_at ? formatDistanceToNow(new Date(module.updated_at), { addSuffix: true }) : "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: `module-publish-${module.id}`,
              checked: module.is_published,
              onCheckedChange: (checked) => publishMutation.mutate({ id: module.id, publish: checked }),
              disabled: publishMutation.isPending
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: `module-publish-${module.id}`, className: "text-forge-gray", children: module.is_published ? "Unpublish" : "Publish" })
        ] }) })
      ] }, module.id);
    }) }) : /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/70", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 text-center text-forge-gray", children: "No modules found for this filter. Create a new module to organize lessons." }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editingModule ? "Edit module" : "New module" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: editingModule ? "Adjust module metadata, ordering, and publish visibility." : "Create a module within a course to group related lessons." })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "course_id",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Course" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(Select, { value: field.value, onValueChange: field.onChange, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a course" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: courses.map((course) => /* @__PURE__ */ jsx(SelectItem, { value: course.id, children: course.title }, course.id)) })
              ] }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "title",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Title" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g. React Fundamentals", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "slug",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Slug" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "react-fundamentals",
                    ...field,
                    onChange: (event) => {
                      setSlugManuallyEdited(true);
                      field.onChange(event);
                    }
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "summary",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Summary" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Optional highlight for the module", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "order",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Order" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 1, ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "is_published",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: "Publish immediately" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: field.value ? "Published modules are available inside the course." : "Keep as draft until lessons are ready." })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: field.value,
                  onCheckedChange: field.onChange,
                  disabled: form.formState.isSubmitting
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), disabled: form.formState.isSubmitting, children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: form.formState.isSubmitting, children: form.formState.isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            " Saving..."
          ] }) : editingModule ? "Save changes" : "Create module" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: Boolean(deleteTarget), onOpenChange: (open) => !open && setDeleteTarget(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete module" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Deleting a module will remove all its lessons. This action cannot be undone. Continue deleting “",
          deleteTarget == null ? void 0 : deleteTarget.title,
          "”?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: deleteMutation.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => deleteTarget && deleteMutation.mutate(deleteTarget.id),
            className: "bg-red-500 hover:bg-red-600",
            disabled: deleteMutation.isPending,
            children: deleteMutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Deleting..."
            ] }) : "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function MarkdownEditor({
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
  onBlur
}) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return /* @__PURE__ */ jsx("div", { className: cn("rounded-md border p-4 text-sm text-muted-foreground", className), children: t("admin.projects.markdown.loading") });
  }
  return /* @__PURE__ */ jsx("div", { className: cn("w-full rounded-md border bg-white", className), "data-color-mode": "light", children: /* @__PURE__ */ jsx(
    MDEditor,
    {
      value,
      preview: "edit",
      height: 300,
      onChange: (val) => onChange(val ?? ""),
      textareaProps: {
        placeholder,
        disabled,
        onBlur
      },
      "aria-label": t("admin.projects.markdown.ariaLabel")
    }
  ) });
}
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const lessonFormSchema = z.object({
  module_id: z.string().uuid("Select a module"),
  title: z.string().min(3, "Title must have at least 3 characters"),
  slug: z.string().min(3, "Slug must have at least 3 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  lesson_type: z.enum(["text", "video", "quiz"]),
  text_content: z.string().optional().or(z.literal("")),
  video_url: z.string().optional().or(z.literal("")),
  quiz_json: z.string().optional().or(z.literal("")),
  xp_value: z.coerce.number().int().min(0, "XP must be zero or greater"),
  order: z.coerce.number().int().min(1, "Order must be at least 1"),
  duration_minutes: z.union([z.coerce.number().int().min(0), z.literal("")]).optional().transform((value) => value === "" || value === void 0 ? null : Number(value)),
  thumbnail_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_published: z.boolean().default(false)
}).refine(
  (data) => {
    var _a;
    return data.lesson_type !== "text" || Boolean((_a = data.text_content) == null ? void 0 : _a.trim());
  },
  {
    path: ["text_content"],
    message: "Provide content for the text lesson"
  }
).refine(
  (data) => {
    var _a;
    return data.lesson_type !== "video" || Boolean((_a = data.video_url) == null ? void 0 : _a.trim());
  },
  {
    path: ["video_url"],
    message: "Provide a video URL"
  }
).refine(
  (data) => {
    var _a;
    if (data.lesson_type !== "quiz") return true;
    if (!((_a = data.quiz_json) == null ? void 0 : _a.trim())) return false;
    try {
      const parsed = JSON.parse(data.quiz_json);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  },
  {
    path: ["quiz_json"],
    message: "Provide a valid JSON array of quiz questions"
  }
);
function AdminLessons() {
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const queryClient = useQueryClient();
  const [selectedPathFilter, setSelectedPathFilter] = useState("all");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const form = useForm({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      module_id: "",
      title: "",
      slug: "",
      lesson_type: "text",
      text_content: "",
      video_url: "",
      quiz_json: "",
      xp_value: 10,
      order: 1,
      duration_minutes: null,
      thumbnail_url: "",
      is_published: false
    }
  });
  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEditingLesson(null);
      setSlugManuallyEdited(false);
    }
  }, [dialogOpen, form]);
  const watchedTitle = form.watch("title");
  const watchedSlug = form.watch("slug");
  useEffect(() => {
    if (!slugManuallyEdited && !editingLesson) {
      const generated = slugify(watchedTitle ?? "");
      if (generated && generated !== watchedSlug) {
        form.setValue("slug", generated, { shouldValidate: false });
      }
    }
  }, [watchedTitle, watchedSlug, slugManuallyEdited, editingLesson, form]);
  const { data: learningPaths = [] } = useQuery({
    queryKey: ["admin-lessons-paths"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("learning_paths").select("id, title").order("title", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["admin-lessons-courses"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("courses").select("id, title, path_id, order").order("path_id", { ascending: true }).order("order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: modules = [] } = useQuery({
    queryKey: ["admin-lessons-modules"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("modules").select("id, title, course_id, order").order("course_id", { ascending: true }).order("order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const moduleLookup = useMemo(() => {
    return modules.reduce((acc, module) => {
      acc[module.id] = module;
      return acc;
    }, {});
  }, [modules]);
  const courseLookup = useMemo(() => {
    return courses.reduce((acc, course) => {
      acc[course.id] = course;
      return acc;
    }, {});
  }, [courses]);
  const pathLookup = useMemo(() => {
    return learningPaths.reduce((acc, path) => {
      acc[path.id] = path;
      return acc;
    }, {});
  }, [learningPaths]);
  const filteredCourses = useMemo(() => {
    if (selectedPathFilter === "all") return courses;
    return courses.filter((course) => course.path_id === selectedPathFilter);
  }, [courses, selectedPathFilter]);
  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      if (selectedPathFilter !== "all") {
        const course = module.course_id ? courseLookup[module.course_id] : null;
        if (!course || course.path_id !== selectedPathFilter) return false;
      }
      if (selectedCourseFilter !== "all" && module.course_id !== selectedCourseFilter) {
        return false;
      }
      return true;
    });
  }, [modules, selectedPathFilter, selectedCourseFilter, courseLookup]);
  const { data: lessons2, isLoading } = useQuery({
    queryKey: ["admin-lessons"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("lessons").select(
        "id, title, slug, lesson_type, module_id, order, content, xp_value, duration_minutes, thumbnail_url, is_published, published_at, updated_at"
      ).order("module_id", { ascending: true }).order("order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const filteredLessons = useMemo(() => {
    if (!lessons2) return [];
    return lessons2.filter((lesson) => {
      const module = lesson.module_id ? moduleLookup[lesson.module_id] : null;
      const course = (module == null ? void 0 : module.course_id) ? courseLookup[module.course_id] : null;
      const pathId = (course == null ? void 0 : course.path_id) ?? null;
      if (selectedPathFilter !== "all" && pathId !== selectedPathFilter) return false;
      if (selectedCourseFilter !== "all" && (module == null ? void 0 : module.course_id) !== selectedCourseFilter) return false;
      if (selectedModuleFilter !== "all" && lesson.module_id !== selectedModuleFilter) return false;
      return true;
    });
  }, [lessons2, selectedPathFilter, selectedCourseFilter, selectedModuleFilter, moduleLookup, courseLookup]);
  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      var _a, _b, _c;
      let content = null;
      if (values.lesson_type === "text") {
        content = ((_a = values.text_content) == null ? void 0 : _a.trim()) ?? "";
      } else if (values.lesson_type === "video") {
        content = ((_b = values.video_url) == null ? void 0 : _b.trim()) ?? "";
      } else {
        content = JSON.parse(values.quiz_json ?? "[]");
      }
      const payload = {
        module_id: values.module_id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        lesson_type: values.lesson_type,
        content,
        xp_value: values.xp_value,
        order: values.order,
        duration_minutes: values.duration_minutes ?? null,
        thumbnail_url: ((_c = values.thumbnail_url) == null ? void 0 : _c.trim()) ? values.thumbnail_url.trim() : null,
        is_published: values.is_published,
        published_at: values.is_published ? (editingLesson == null ? void 0 : editingLesson.published_at) ?? (/* @__PURE__ */ new Date()).toISOString() : null
      };
      if (editingLesson) {
        const { error } = await supabase2.from("lessons").update(payload).eq("id", editingLesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase2.from("lessons").insert({
          ...payload,
          published_at: values.is_published ? (/* @__PURE__ */ new Date()).toISOString() : null
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast$1.success(editingLesson ? "Lesson updated" : "Lesson created");
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error saving lesson", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to save lesson");
    }
  });
  const publishMutation = useMutation({
    mutationFn: async ({ id, publish }) => {
      const { error } = await supabase2.from("lessons").update({ is_published: publish, published_at: publish ? (/* @__PURE__ */ new Date()).toISOString() : null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast$1.success("Publish state updated");
    },
    onError: (error) => {
      console.error("Error toggling publish", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to toggle publish state");
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase2.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lessons"] });
      toast$1.success("Lesson deleted");
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Error deleting lesson", error);
      toast$1.error(error instanceof Error ? error.message : "Failed to delete lesson");
    }
  });
  const openForCreate = () => {
    setEditingLesson(null);
    setSlugManuallyEdited(false);
    form.reset({
      module_id: selectedModuleFilter !== "all" ? selectedModuleFilter : "",
      title: "",
      slug: "",
      lesson_type: "text",
      text_content: "",
      video_url: "",
      quiz_json: "",
      xp_value: 10,
      order: 1,
      duration_minutes: null,
      thumbnail_url: "",
      is_published: false
    });
    setDialogOpen(true);
  };
  const openForEdit = (lesson) => {
    setEditingLesson(lesson);
    setSlugManuallyEdited(true);
    const moduleId = lesson.module_id ?? "";
    const content = lesson.content;
    let textContent = "";
    let videoUrl = "";
    let quizJson = "";
    if (lesson.lesson_type === "text") {
      textContent = typeof content === "string" ? content : "";
    } else if (lesson.lesson_type === "video") {
      videoUrl = typeof content === "string" ? content : "";
    } else if (content) {
      try {
        quizJson = JSON.stringify(content, null, 2);
      } catch {
        quizJson = "";
      }
    }
    form.reset({
      module_id: moduleId,
      title: lesson.title ?? "",
      slug: lesson.slug ?? "",
      lesson_type: lesson.lesson_type,
      text_content: textContent,
      video_url: videoUrl,
      quiz_json: quizJson,
      xp_value: lesson.xp_value ?? 0,
      order: lesson.order ?? 1,
      duration_minutes: lesson.duration_minutes ?? null,
      thumbnail_url: lesson.thumbnail_url ?? "",
      is_published: lesson.is_published
    });
    setDialogOpen(true);
  };
  const onSubmit = (values) => {
    try {
      upsertMutation.mutate(values);
    } catch (error) {
      if (error instanceof Error) {
        toast$1.error(error.message);
      }
    }
  };
  const getLessonPreview = (lesson) => {
    if (lesson.lesson_type === "text") {
      const content = typeof lesson.content === "string" ? lesson.content : "";
      return content.slice(0, 160);
    }
    if (lesson.lesson_type === "video") {
      return typeof lesson.content === "string" ? lesson.content : "";
    }
    return "Quiz lesson contents";
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-forge-dark", children: "Lessons" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: "Create and manage lesson content across modules. Support for text, video, and quiz formats." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedPathFilter,
            onValueChange: (value) => {
              setSelectedPathFilter(value);
              setSelectedCourseFilter("all");
              setSelectedModuleFilter("all");
            },
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by path" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All paths" }),
                learningPaths.map((path) => /* @__PURE__ */ jsx(SelectItem, { value: path.id, children: path.title }, path.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedCourseFilter,
            onValueChange: (value) => {
              setSelectedCourseFilter(value);
              setSelectedModuleFilter("all");
            },
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by course" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All courses" }),
                filteredCourses.map((course) => /* @__PURE__ */ jsx(SelectItem, { value: course.id, children: course.title }, course.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedModuleFilter,
            onValueChange: (value) => setSelectedModuleFilter(value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by module" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All modules" }),
                filteredModules.map((module) => /* @__PURE__ */ jsxs(SelectItem, { value: module.id, children: [
                  "#",
                  module.order,
                  " · ",
                  module.title
                ] }, module.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Button, { onClick: openForCreate, className: "w-full", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "New Lesson"
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-8 text-forge-gray", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      " Loading lessons..."
    ] }) }) : filteredLessons && filteredLessons.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: filteredLessons.map((lesson) => {
      const module = lesson.module_id ? moduleLookup[lesson.module_id] : null;
      const course = (module == null ? void 0 : module.course_id) ? courseLookup[module.course_id] : null;
      const path = (course == null ? void 0 : course.path_id) ? pathLookup[course.path_id] : null;
      return /* @__PURE__ */ jsxs(Card, { className: "border border-forge-cream/70 bg-white/80", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex flex-wrap items-center gap-2 text-forge-dark", children: [
              "#",
              lesson.order,
              " · ",
              lesson.title,
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: lesson.is_published ? "default" : "outline",
                  className: lesson.is_published ? "bg-forge-orange text-white hover:bg-forge-orange/90" : "",
                  children: lesson.is_published ? "Published" : "Draft"
                }
              ),
              /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "flex items-center gap-1 text-xs", children: [
                /* @__PURE__ */ jsx(BookOpenText, { className: "h-3.5 w-3.5" }),
                " ",
                lesson.lesson_type.toUpperCase()
              ] })
            ] }),
            /* @__PURE__ */ jsxs(CardDescription, { className: "text-sm text-forge-gray", children: [
              module ? `${module.title} · ` : "",
              course ? `${course.title} · ` : "",
              path ? path.title : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openForEdit(lesson), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                className: "text-red-500 hover:text-red-600",
                onClick: () => setDeleteTarget(lesson),
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm text-forge-gray", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Slug:" }),
              " ",
              lesson.slug
            ] }),
            /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "XP:" }),
              " ",
              lesson.xp_value
            ] }),
            lesson.duration_minutes != null && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-forge-dark", children: "Duration:" }),
                " ",
                lesson.duration_minutes,
                " min"
              ] })
            ] }),
            lesson.thumbnail_url && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "hidden h-4 sm:block" }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: lesson.thumbnail_url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs font-medium text-forge-orange hover:underline",
                  children: "Thumbnail"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-forge-gray/90 line-clamp-3", children: getLessonPreview(lesson) }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-forge-gray/80", children: [
            "Updated ",
            lesson.updated_at ? formatDistanceToNow(new Date(lesson.updated_at), { addSuffix: true }) : "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: `lesson-publish-${lesson.id}`,
              checked: lesson.is_published,
              onCheckedChange: (checked) => publishMutation.mutate({ id: lesson.id, publish: checked }),
              disabled: publishMutation.isPending
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: `lesson-publish-${lesson.id}`, className: "text-forge-gray", children: lesson.is_published ? "Unpublish" : "Publish" })
        ] }) })
      ] }, lesson.id);
    }) }) : /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/70", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 text-center text-forge-gray", children: "No lessons found for this filter. Create a lesson to deliver content to learners." }) }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editingLesson ? "Edit lesson" : "New lesson" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: editingLesson ? "Update lesson metadata, content, and publication state." : "Compose new content and attach it to a module. Choose the appropriate lesson format." })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "module_id",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Module" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(Select, { value: field.value, onValueChange: field.onChange, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a module" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: (filteredModules.length > 0 ? filteredModules : modules).map((module) => /* @__PURE__ */ jsxs(SelectItem, { value: module.id, children: [
                  "#",
                  module.order,
                  " · ",
                  module.title
                ] }, module.id)) })
              ] }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "title",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Title" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g. Understanding Components", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "slug",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Slug" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "understanding-components",
                    ...field,
                    onChange: (event) => {
                      setSlugManuallyEdited(true);
                      field.onChange(event);
                    }
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "lesson_type",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Lesson type" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(Select, { value: field.value, onValueChange: field.onChange, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "text", children: "Text" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "video", children: "Video" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "quiz", children: "Quiz" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "order",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Order" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 1, ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "xp_value",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "XP value" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 0, ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        form.watch("lesson_type") === "text" && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "text_content",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Markdown content" }),
              /* @__PURE__ */ jsxs(Tabs, { defaultValue: "edit", className: "w-full", children: [
                /* @__PURE__ */ jsxs(TabsList, { children: [
                  /* @__PURE__ */ jsx(TabsTrigger, { value: "edit", children: "Edit" }),
                  /* @__PURE__ */ jsx(TabsTrigger, { value: "preview", children: "Preview" })
                ] }),
                /* @__PURE__ */ jsx(TabsContent, { value: "edit", children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  MarkdownEditor,
                  {
                    value: field.value ?? "",
                    onChange: field.onChange,
                    onBlur: field.onBlur,
                    placeholder: "Write lesson content in Markdown"
                  }
                ) }) }),
                /* @__PURE__ */ jsx(TabsContent, { value: "preview", children: /* @__PURE__ */ jsx("div", { className: "rounded-md border p-4 bg-white", children: /* @__PURE__ */ jsx("div", { className: "prose prose-slate max-w-none", children: /* @__PURE__ */ jsx(
                  ReactMarkdown,
                  {
                    components: {
                      a: ({ node, ...props }) => /* @__PURE__ */ jsx("a", { ...props, target: "_blank", rel: "noopener noreferrer" })
                    },
                    children: field.value || "Nothing to preview yet."
                  }
                ) }) }) })
              ] }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Supports Markdown syntax (headings, lists, code blocks, links, images)." }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        form.watch("lesson_type") === "video" && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "video_url",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Video URL" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "https://www.youtube.com/watch?v=...", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        form.watch("lesson_type") === "quiz" && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "quiz_json",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Quiz JSON" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  rows: 8,
                  placeholder: '[\n  {\n    "question": "What is React?",\n    "options": ["Library", "Framework"],\n    "correctAnswer": "Library"\n  }\n]',
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "duration_minutes",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Duration (minutes)" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", min: 0, placeholder: "Optional", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "thumbnail_url",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Thumbnail URL" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "https://...", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Store media in Supabase Storage and paste the public URL here. Upload widgets are planned for a next iteration." }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "is_published",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: "Publish immediately" }),
                /* @__PURE__ */ jsx(DialogDescription, { children: field.value ? "Published lessons appear instantly in the learner experience." : "Keep as draft until you are ready to release." })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: field.value,
                  onCheckedChange: field.onChange,
                  disabled: form.formState.isSubmitting
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), disabled: form.formState.isSubmitting, children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: form.formState.isSubmitting, children: form.formState.isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            " Saving..."
          ] }) : editingLesson ? "Save changes" : "Create lesson" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: Boolean(deleteTarget), onOpenChange: (open) => !open && setDeleteTarget(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete lesson" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Deleting a lesson cannot be undone. Learner progress for this lesson will be lost. Continue deleting “",
          deleteTarget == null ? void 0 : deleteTarget.title,
          "”?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: deleteMutation.isPending, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => deleteTarget && deleteMutation.mutate(deleteTarget.id),
            className: "bg-red-500 hover:bg-red-600",
            disabled: deleteMutation.isPending,
            children: deleteMutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Deleting..."
            ] }) : "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
const stripHtml = (value) => {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, "").trim();
};
function AdminProjects() {
  const { t } = useTranslation();
  const supabase2 = useMemo(() => createClientBrowser(), []);
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState("all");
  const formSchema = useMemo(
    () => z.object({
      module_id: z.string().uuid(t("admin.projects.validation.moduleRequired")),
      title: z.string().min(3, t("admin.projects.validation.titleMin")),
      description: z.string().optional().or(z.literal("")),
      xp_value: z.union([z.literal(""), z.coerce.number().int().min(0, t("admin.projects.validation.xpMin"))]).transform((value) => value === "" ? null : value),
      is_active: z.boolean()
    }),
    [t]
  );
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      module_id: "",
      title: "",
      description: "",
      xp_value: null,
      is_active: true
    }
  });
  useEffect(() => {
    if (!dialogOpen) {
      setEditingProject(null);
      form.reset({
        module_id: "",
        title: "",
        description: "",
        xp_value: null,
        is_active: true
      });
    }
  }, [dialogOpen, form]);
  const { data: modules = [], isLoading: loadingModules } = useQuery({
    queryKey: ["admin-module-projects-modules"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("modules").select("id, title, order, course:courses(id, title)").order("order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        ...item,
        course: item.course ?? null
      }));
    }
  });
  const { data: projects2 = [], isLoading } = useQuery({
    queryKey: ["admin-module-projects"],
    queryFn: async () => {
      const { data, error } = await supabase2.from("module_projects").select(
        "id, module_id, title, description, xp_value, is_active, module:modules(id, title, order, course:courses(id, title))"
      ).order("module_id", { ascending: true }).order("created_at", { ascending: true }).order("title", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        ...item,
        module: item.module ?? null
      }));
    },
    onError: (error) => {
      console.error("Error loading projects", error);
      toast$1.error(t("admin.projects.notifications.loadError"));
    }
  });
  const filteredProjects = useMemo(() => {
    if (selectedModuleFilter === "all") return projects2;
    return projects2.filter((project) => project.module_id === selectedModuleFilter);
  }, [projects2, selectedModuleFilter]);
  const grouped = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    filteredProjects.forEach((project) => {
      const key = project.module_id || "unassigned";
      if (!map.has(key)) {
        map.set(key, { module: project.module ?? null, items: [] });
      }
      map.get(key).items.push(project);
    });
    return Array.from(map.entries()).sort((a, b) => {
      var _a, _b, _c, _d;
      const moduleAOrder = ((_a = a[1].module) == null ? void 0 : _a.order) ?? Number.MAX_SAFE_INTEGER;
      const moduleBOrder = ((_b = b[1].module) == null ? void 0 : _b.order) ?? Number.MAX_SAFE_INTEGER;
      if (moduleAOrder !== moduleBOrder) return moduleAOrder - moduleBOrder;
      const titleA = ((_c = a[1].module) == null ? void 0 : _c.title) ?? "";
      const titleB = ((_d = b[1].module) == null ? void 0 : _d.title) ?? "";
      return titleA.localeCompare(titleB);
    }).map(([key, value]) => ({ key, ...value }));
  }, [filteredProjects]);
  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      var _a;
      const payload = {
        module_id: values.module_id,
        title: values.title.trim(),
        description: ((_a = values.description) == null ? void 0 : _a.trim()) ? values.description.trim() : null,
        xp_value: values.xp_value,
        is_active: values.is_active
      };
      if (editingProject) {
        const { error } = await supabase2.from("module_projects").update(payload).eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase2.from("module_projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-module-projects"] });
      toast$1.success(
        editingProject ? t("admin.projects.notifications.updated") : t("admin.projects.notifications.created")
      );
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error saving project", error);
      toast$1.error(t("admin.projects.notifications.saveError"));
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase2.from("module_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-module-projects"] });
      toast$1.success(t("admin.projects.notifications.deleted"));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Error deleting project", error);
      toast$1.error(t("admin.projects.notifications.deleteError"));
    }
  });
  const openForCreate = useCallback(() => {
    setEditingProject(null);
    form.reset({
      module_id: "",
      title: "",
      description: "",
      xp_value: null,
      is_active: true
    });
    setDialogOpen(true);
  }, [form, setDialogOpen]);
  const openForEdit = useCallback(
    (project) => {
      setEditingProject(project);
      form.reset({
        module_id: project.module_id,
        title: project.title,
        description: project.description ?? "",
        xp_value: project.xp_value ?? null,
        is_active: project.is_active ?? true
      });
      setDialogOpen(true);
    },
    [form, setDialogOpen]
  );
  const handleDeleteClick = useCallback(
    (project) => {
      setDeleteTarget(project);
      setDeleteDialogOpen(true);
    },
    []
  );
  const onSubmit = (values) => {
    upsertMutation.mutate(values);
  };
  const moduleOptions = useMemo(() => {
    return modules.slice().sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  }, [modules]);
  const renderedGroups = useMemo(
    () => grouped.map(({ key, module, items }) => /* @__PURE__ */ jsxs(Card, { className: "border border-forge-cream/70 bg-white/80", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-forge-dark", children: module ? `${module.title}` : t("admin.projects.unassignedModule") }),
        (module == null ? void 0 : module.course) && /* @__PURE__ */ jsx(CardDescription, { className: "text-sm text-forge-gray", children: t("admin.projects.labels.course", { course: module.course.title }) })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: items.map((project, index) => {
        const sequence = index + 1;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: "rounded-lg border border-forge-cream/60 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md",
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "rounded-full bg-forge-orange/10 px-2 py-0.5 text-xs font-medium text-forge-orange", children: t("admin.projects.labels.projectNumber", { number: sequence }) }),
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-forge-dark", children: project.title }),
                  !project.is_active && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "border-red-200 text-red-600", children: t("admin.projects.labels.inactive") }),
                  typeof project.xp_value === "number" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-forge-cream text-forge-dark", children: t("admin.projects.labels.xpValue", { xp: project.xp_value }) })
                ] }),
                project.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray/90 line-clamp-2", children: stripHtml(project.description) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openForEdit(project), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "icon",
                    className: "text-red-500 hover:text-red-600",
                    onClick: () => handleDeleteClick(project),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          },
          project.id
        );
      }) })
    ] }, key)),
    [grouped, handleDeleteClick, openForEdit, t]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-forge-dark", children: t("admin.projects.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-forge-gray", children: t("admin.projects.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center", children: [
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: selectedModuleFilter,
            onValueChange: (value) => setSelectedModuleFilter(value),
            disabled: loadingModules,
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[240px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("admin.projects.filters.modulePlaceholder") }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: t("admin.projects.filters.allModules") }),
                moduleOptions.map((module) => /* @__PURE__ */ jsx(SelectItem, { value: module.id, children: module.course ? `${module.course.title} · ${module.title}` : module.title }, module.id))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Button, { onClick: openForCreate, disabled: loadingModules || moduleOptions.length === 0, className: "md:w-auto", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          t("admin.projects.actions.newProject")
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx(Card, { className: "border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-8 text-forge-gray", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      t("admin.projects.loading")
    ] }) }) : grouped.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "border border-dashed border-forge-cream/70 bg-white/80", children: /* @__PURE__ */ jsx(CardContent, { className: "p-8 text-center text-sm text-forge-gray", children: t("admin.projects.emptyState") }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: renderedGroups }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: editingProject ? t("admin.projects.dialog.editTitle") : t("admin.projects.dialog.createTitle") }),
        /* @__PURE__ */ jsx(DialogDescription, { children: t("admin.projects.dialog.description") })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: form.handleSubmit(onSubmit), children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "module_id",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("admin.projects.form.module") }),
              /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("admin.projects.form.modulePlaceholder") }) }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: moduleOptions.map((module) => /* @__PURE__ */ jsx(SelectItem, { value: module.id, children: module.course ? `${module.course.title} · ${module.title}` : module.title }, module.id)) })
              ] }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "title",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("admin.projects.form.title") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { ...field, placeholder: t("admin.projects.form.titlePlaceholder") }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "description",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("admin.projects.form.description") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Textarea, { rows: 6, ...field, placeholder: t("admin.projects.form.descriptionPlaceholder") }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: t("admin.projects.form.descriptionHelp") }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "xp_value",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: t("admin.projects.form.xpValue") }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  value: field.value ?? "",
                  onChange: (event) => {
                    const value = event.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  },
                  placeholder: t("admin.projects.form.xpValuePlaceholder")
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: t("admin.projects.form.xpValueHelp") }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "is_active",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border border-forge-cream/70 bg-forge-cream/10 p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: t("admin.projects.form.activeLabel") }),
                /* @__PURE__ */ jsx(FormDescription, { children: t("admin.projects.form.activeDescription") })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), children: t("common.buttons.cancel") }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: upsertMutation.isPending, children: upsertMutation.isPending ? t("common.buttons.saving") : editingProject ? t("common.buttons.update") : t("common.buttons.create") })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: t("admin.projects.delete.title") }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: t("admin.projects.delete.description", { title: (deleteTarget == null ? void 0 : deleteTarget.title) ?? "" }) })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => setDeleteTarget(null), children: t("common.buttons.cancel") }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            className: "bg-red-500 hover:bg-red-600",
            disabled: deleteMutation.isPending,
            onClick: () => {
              if (deleteTarget) {
                deleteMutation.mutate(deleteTarget.id);
              }
            },
            children: deleteMutation.isPending ? t("common.buttons.loading") : t("admin.projects.delete.confirm")
          }
        )
      ] })
    ] }) })
  ] });
}
const MOCK_GLOBAL_SCOREBOARD = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    xp: 3420,
    completedLessons: 28,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos.santos@email.com",
    xp: 3180,
    completedLessons: 26,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    xp: 2950,
    completedLessons: 24,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: "4",
    name: "João Pedro",
    email: "joao.pedro@email.com",
    xp: 2820,
    completedLessons: 23,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: "5",
    name: "Lucia Costa",
    email: "lucia.costa@email.com",
    xp: 2650,
    completedLessons: 22,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: "6",
    name: "Rafael Mendes",
    email: "rafael.mendes@email.com",
    xp: 2480,
    completedLessons: 20,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: "7",
    name: "Fernanda Lima",
    email: "fernanda.lima@email.com",
    xp: 2320,
    completedLessons: 19,
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: "8",
    name: "Thiago Rocha",
    email: "thiago.rocha@email.com",
    xp: 2180,
    completedLessons: 18,
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face"
  }
];
const MOCK_PATH_SCOREBOARDS = {
  "blockchain-web3": {
    name: "Blockchain e Web3",
    entries: [
      {
        id: "1",
        name: "Ana Silva",
        email: "ana.silva@email.com",
        xp: 1850,
        completedLessons: 15,
        pathName: "Blockchain e Web3",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "2",
        name: "Carlos Santos",
        email: "carlos.santos@email.com",
        xp: 1720,
        completedLessons: 14,
        pathName: "Blockchain e Web3",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "4",
        name: "João Pedro",
        email: "joao.pedro@email.com",
        xp: 1650,
        completedLessons: 13,
        pathName: "Blockchain e Web3",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "6",
        name: "Rafael Mendes",
        email: "rafael.mendes@email.com",
        xp: 1480,
        completedLessons: 12,
        pathName: "Blockchain e Web3",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "8",
        name: "Thiago Rocha",
        email: "thiago.rocha@email.com",
        xp: 1320,
        completedLessons: 11,
        pathName: "Blockchain e Web3",
        avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face"
      }
    ]
  },
  "defi-protocols": {
    name: "Protocolos DeFi",
    entries: [
      {
        id: "3",
        name: "Maria Oliveira",
        email: "maria.oliveira@email.com",
        xp: 1680,
        completedLessons: 14,
        pathName: "Protocolos DeFi",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "5",
        name: "Lucia Costa",
        email: "lucia.costa@email.com",
        xp: 1520,
        completedLessons: 13,
        pathName: "Protocolos DeFi",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "7",
        name: "Fernanda Lima",
        email: "fernanda.lima@email.com",
        xp: 1420,
        completedLessons: 12,
        pathName: "Protocolos DeFi",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "2",
        name: "Carlos Santos",
        email: "carlos.santos@email.com",
        xp: 1380,
        completedLessons: 11,
        pathName: "Protocolos DeFi",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "1",
        name: "Ana Silva",
        email: "ana.silva@email.com",
        xp: 1280,
        completedLessons: 10,
        pathName: "Protocolos DeFi",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      }
    ]
  },
  "smart-contracts": {
    name: "Smart Contracts Avançados",
    entries: [
      {
        id: "6",
        name: "Rafael Mendes",
        email: "rafael.mendes@email.com",
        xp: 980,
        completedLessons: 8,
        pathName: "Smart Contracts Avançados",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "4",
        name: "João Pedro",
        email: "joao.pedro@email.com",
        xp: 920,
        completedLessons: 7,
        pathName: "Smart Contracts Avançados",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "8",
        name: "Thiago Rocha",
        email: "thiago.rocha@email.com",
        xp: 860,
        completedLessons: 7,
        pathName: "Smart Contracts Avançados",
        avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "3",
        name: "Maria Oliveira",
        email: "maria.oliveira@email.com",
        xp: 820,
        completedLessons: 6,
        pathName: "Smart Contracts Avançados",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      },
      {
        id: "7",
        name: "Fernanda Lima",
        email: "fernanda.lima@email.com",
        xp: 780,
        completedLessons: 6,
        pathName: "Smart Contracts Avançados",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"
      }
    ]
  }
};
function getRankIcon(position) {
  switch (position) {
    case 1:
      return /* @__PURE__ */ jsx(Trophy, { className: "h-6 w-6 text-yellow-500" });
    case 2:
      return /* @__PURE__ */ jsx(Medal, { className: "h-6 w-6 text-gray-400" });
    case 3:
      return /* @__PURE__ */ jsx(Award, { className: "h-6 w-6 text-amber-600" });
    default:
      return /* @__PURE__ */ jsxs("div", { className: "h-6 w-6 flex items-center justify-center text-sm font-bold text-gray-500", children: [
        "#",
        position
      ] });
  }
}
function getRankBadgeColor(position) {
  switch (position) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    case 3:
      return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
function ScoreboardList({ entries, title }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Trophy, { className: "h-5 w-5 text-forge-orange" }),
      title
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "space-y-0", children: entries.map((entry, index) => {
      const position = index + 1;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center justify-between p-4 border-b last:border-b-0 transition-colors hover:bg-gray-50 ${position <= 3 ? "bg-gradient-to-r from-orange-50 to-transparent" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs(Badge, { className: `${getRankBadgeColor(position)} font-bold px-2 py-1`, children: [
                  "#",
                  position
                ] }),
                getRankIcon(position)
              ] }),
              /* @__PURE__ */ jsxs(Avatar, { className: "h-10 w-10", children: [
                /* @__PURE__ */ jsx(AvatarImage, { src: entry.avatar, alt: entry.name }),
                /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-forge-orange text-white", children: entry.name.split(" ").map((n) => n[0]).join("").toUpperCase() })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900", children: entry.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: entry.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxs("div", { className: "font-bold text-lg text-forge-orange", children: [
                entry.xp.toLocaleString(),
                " ",
                t("scoreboard.xp")
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
                entry.completedLessons,
                " ",
                t("scoreboard.lessons")
              ] })
            ] })
          ]
        },
        entry.id
      );
    }) }) })
  ] });
}
function Scoreboard() {
  const { t } = useTranslation();
  const [selectedPath, setSelectedPath] = useState("blockchain-web3");
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-gray-900", children: t("scoreboard.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("scoreboard.subtitle") })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "global", className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "global", children: t("scoreboard.global") }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "by-path", children: t("scoreboard.byPath") })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "global", className: "space-y-6", children: /* @__PURE__ */ jsx(
        ScoreboardList,
        {
          entries: MOCK_GLOBAL_SCOREBOARD,
          title: t("scoreboard.rankingGlobal")
        }
      ) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "by-path", className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: Object.entries(MOCK_PATH_SCOREBOARDS).map(([key, path]) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedPath(key),
            className: `px-4 py-2 rounded-lg font-medium transition-colors ${selectedPath === key ? "bg-forge-orange text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
            children: path.name
          },
          key
        )) }),
        /* @__PURE__ */ jsx(
          ScoreboardList,
          {
            entries: MOCK_PATH_SCOREBOARDS[selectedPath].entries,
            title: t("scoreboard.ranking", { pathName: MOCK_PATH_SCOREBOARDS[selectedPath].name })
          }
        )
      ] })
    ] })
  ] });
}
const CATEGORY_CONFIGS = {
  community: {
    label: "achievements.categories.community",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Users
  },
  profile: {
    label: "achievements.categories.profile",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Target
  },
  learning: {
    label: "achievements.categories.learning",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: BookOpen
  },
  social: {
    label: "achievements.categories.social",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    icon: Share2
  }
};
function AchievementProgress({ current, max }) {
  const { t } = useTranslation();
  const percentage = Math.round(current / max * 100);
  const progressColor = percentage >= 75 ? "bg-green-500" : percentage >= 50 ? "bg-blue-500" : "bg-forge-orange";
  const textColor = percentage >= 75 ? "text-green-600" : percentage >= 50 ? "text-blue-600" : "text-forge-orange";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600 font-medium", children: t("achievements.progress") }),
      /* @__PURE__ */ jsxs("span", { className: cn("font-semibold", textColor), children: [
        current,
        "/",
        max,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
          "(",
          percentage,
          "%)"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "h-full transition-all duration-500 ease-out rounded-full",
          progressColor,
          percentage >= 90 && "animate-pulse"
        ),
        style: { width: `${percentage}%` }
      }
    ) })
  ] });
}
const AchievementCard = memo(({
  achievement,
  onActionClick,
  onHover,
  isSelected = false
}) => {
  const { t } = useTranslation();
  const Icon = achievement.icon;
  const config = CATEGORY_CONFIGS[achievement.category];
  const CategoryIcon = config.icon;
  const isCompleted = achievement.status === "completed";
  const isLocked = achievement.status === "locked";
  const cardClassName = cn(
    "relative overflow-hidden transition-all duration-300 cursor-pointer",
    "h-full flex flex-col",
    // Equal height cards with flex layout
    "hover:shadow-lg hover:scale-[1.02]",
    isSelected && "ring-2 ring-forge-orange shadow-lg scale-[1.02]",
    isCompleted && "border-green-300 bg-green-50/30",
    isLocked && "opacity-60 border-gray-200",
    !isCompleted && !isLocked && "border-forge-cream"
  );
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cardClassName,
      onMouseEnter: () => onHover == null ? void 0 : onHover(achievement),
      onMouseLeave: () => onHover == null ? void 0 : onHover(null),
      onClick: () => onHover == null ? void 0 : onHover(achievement),
      children: [
        isCompleted && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6 text-green-600 animate-in zoom-in duration-300" }) }) }),
        isLocked && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6 text-gray-400" }) }),
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: cn(
            config.bgColor,
            "p-3.5 rounded-xl shadow-sm flex-shrink-0 transition-all duration-300",
            isCompleted && "ring-2 ring-green-300",
            !isLocked && !isCompleted && "ring-1 ring-gray-200 hover:ring-2 hover:ring-forge-orange/50"
          ), children: /* @__PURE__ */ jsx(Icon, { className: cn("h-7 w-7", config.color) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xl font-semibold leading-tight mb-2 min-h-[28px]", children: achievement.title }),
            /* @__PURE__ */ jsx(CardDescription, { className: "text-sm leading-relaxed line-clamp-2 min-h-[40px]", children: achievement.description })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "flex-1 flex flex-col space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: cn(config.borderColor, config.color), children: [
              CategoryIcon && /* @__PURE__ */ jsx(CategoryIcon, { className: "h-3 w-3 mr-1" }),
              t(config.label)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-forge-orange" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-forge-orange", children: [
                achievement.xpReward,
                " XP"
              ] })
            ] })
          ] }),
          achievement.progress !== void 0 && achievement.maxProgress && /* @__PURE__ */ jsx(
            AchievementProgress,
            {
              current: achievement.progress,
              max: achievement.maxProgress
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto space-y-2", children: [
            achievement.action && !isCompleted && !isLocked && /* @__PURE__ */ jsx(
              Button,
              {
                className: "w-full bg-forge-orange hover:bg-forge-orange/90",
                onClick: () => onActionClick(achievement),
                children: achievement.action.label
              }
            ),
            isCompleted && /* @__PURE__ */ jsx("div", { className: "text-center text-sm font-medium text-green-700 bg-green-100 py-2 rounded-md", children: t("achievements.completedBadge") }),
            isLocked && /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-gray-500 bg-gray-100 py-2 rounded-md", children: t("achievements.locked") })
          ] })
        ] })
      ]
    }
  );
});
AchievementCard.displayName = "AchievementCard";
function AchievementTabs({
  selectedCategory,
  onCategoryChange,
  achievements: achievements2,
  onAchievementAction,
  onAchievementHover,
  selectedAchievementId
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs(
    Tabs,
    {
      value: selectedCategory,
      onValueChange: (v) => onCategoryChange(v),
      className: "space-y-6",
      children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-5", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "all", children: t("achievements.all") }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "community", children: t("achievements.categories.community") }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "profile", children: t("achievements.categories.profile") }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "learning", children: t("achievements.categories.learning") }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "social", children: t("achievements.categories.social") })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: selectedCategory, className: "space-y-4", children: achievements2.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "border-dashed border-2 border-gray-300", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-16 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-8 h-8 text-gray-400" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: t("achievements.emptyState.title") }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-md", children: selectedCategory === "all" ? t("achievements.emptyState.descriptionAll") : t("achievements.emptyState.descriptionCategory", {
            category: t(`achievements.categories.${selectedCategory}`)
          }) })
        ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr", children: achievements2.map((achievement) => /* @__PURE__ */ jsx(
          AchievementCard,
          {
            achievement,
            onActionClick: onAchievementAction,
            onHover: onAchievementHover,
            isSelected: achievement.id === selectedAchievementId
          },
          achievement.id
        )) }) })
      ]
    }
  );
}
function AchievementsSidebar({
  stats,
  selectedAchievement,
  suggestedAchievement,
  onActionClick
}) {
  const { t } = useTranslation();
  if (selectedAchievement) {
    const Icon = selectedAchievement.icon;
    const config = CATEGORY_CONFIGS[selectedAchievement.category];
    const CategoryIcon = config.icon;
    const isCompleted = selectedAchievement.status === "completed";
    const isLocked = selectedAchievement.status === "locked";
    return /* @__PURE__ */ jsxs("div", { className: "w-96 shrink-0 hidden lg:block sticky top-6 self-start space-y-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: cn(
        "border-2",
        isCompleted && "border-green-300 bg-green-50/20",
        isLocked && "border-gray-200",
        !isCompleted && !isLocked && "border-forge-orange/30"
      ), children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: cn(
              config.bgColor,
              "p-4 rounded-xl shadow-sm",
              isCompleted && "ring-2 ring-green-300",
              !isLocked && !isCompleted && "ring-1 ring-gray-200"
            ), children: /* @__PURE__ */ jsx(Icon, { className: cn("h-8 w-8", config.color) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: cn(config.borderColor, config.color, "mb-2"), children: [
                CategoryIcon && /* @__PURE__ */ jsx(CategoryIcon, { className: "h-3 w-3 mr-1" }),
                t(config.label)
              ] }),
              isCompleted && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-green-600", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: t("achievements.completedBadge") })
              ] }),
              isLocked && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-gray-400", children: [
                /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: t("achievements.locked") })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl leading-tight", children: selectedAchievement.title }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-sm leading-relaxed mt-2", children: selectedAchievement.description })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: t("achievements.xpReward") }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-forge-orange" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-forge-orange", children: [
                selectedAchievement.xpReward,
                " XP"
              ] })
            ] })
          ] }),
          selectedAchievement.progress !== void 0 && selectedAchievement.maxProgress && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            AchievementProgress,
            {
              current: selectedAchievement.progress,
              max: selectedAchievement.maxProgress
            }
          ) }),
          selectedAchievement.action && !isCompleted && !isLocked && /* @__PURE__ */ jsx(
            Button,
            {
              className: "w-full bg-forge-orange hover:bg-forge-orange/90",
              onClick: () => onActionClick(selectedAchievement),
              children: selectedAchievement.action.label
            }
          ),
          isCompleted && /* @__PURE__ */ jsxs("div", { className: "text-center text-sm font-medium text-green-700 bg-green-100 py-3 rounded-md", children: [
            "✓ ",
            t("achievements.completedBadge")
          ] }),
          isLocked && /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-gray-500 bg-gray-100 py-3 rounded-md", children: [
            "🔒 ",
            t("achievements.locked")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-forge-orange" }),
          t("achievements.sidebar.tips")
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "text-xs text-gray-600 space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "• ",
            t("achievements.sidebar.tip1")
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            "• ",
            t("achievements.sidebar.tip2")
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            "• ",
            t("achievements.sidebar.tip3")
          ] })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-96 shrink-0 hidden lg:block sticky top-6 self-start space-y-4", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-5 w-5 text-forge-orange" }),
        t("achievements.sidebar.overview")
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-600 mb-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("achievements.overallProgress") }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-forge-orange", children: [
              stats.completionPercentage,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative h-2 w-full overflow-hidden rounded-full bg-gray-200", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full transition-all duration-500 ease-out rounded-full bg-forge-orange",
              style: { width: `${stats.completionPercentage}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: t("achievements.completed") }),
          /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold", children: [
            stats.completed,
            /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
              "/",
              stats.total
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: t("achievements.inProgress") }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-blue-600", children: stats.inProgress })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2 border-t", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "XP" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-forge-orange" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-forge-orange", children: stats.totalXP })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
              "of ",
              stats.totalXP + stats.availableXP
            ] })
          ] })
        ] })
      ] })
    ] }),
    suggestedAchievement && /* @__PURE__ */ jsxs(Card, { className: "border-2 border-forge-orange/40 bg-orange-50/30", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-forge-orange" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: t("achievements.sidebar.nextSuggested") })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: cn(
            CATEGORY_CONFIGS[suggestedAchievement.category].bgColor,
            "p-2.5 rounded-lg"
          ), children: /* @__PURE__ */ jsx(
            suggestedAchievement.icon,
            {
              className: cn("h-5 w-5", CATEGORY_CONFIGS[suggestedAchievement.category].color)
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm leading-tight mb-1", children: suggestedAchievement.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 line-clamp-2", children: suggestedAchievement.description })
          ] })
        ] }),
        suggestedAchievement.progress !== void 0 && suggestedAchievement.maxProgress && /* @__PURE__ */ jsx(
          AchievementProgress,
          {
            current: suggestedAchievement.progress,
            max: suggestedAchievement.maxProgress
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-forge-orange" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-forge-orange", children: [
              suggestedAchievement.xpReward,
              " XP"
            ] })
          ] }),
          suggestedAchievement.action && /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              className: "bg-forge-orange hover:bg-forge-orange/90",
              onClick: () => onActionClick(suggestedAchievement),
              children: suggestedAchievement.action.label
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-blue-200 bg-blue-50/30", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-blue-600" }),
        stats.completed === 0 ? t("achievements.sidebar.gettingStarted") : t("achievements.sidebar.keepGoing")
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "text-xs text-gray-700 space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: /* @__PURE__ */ jsx("strong", { children: t("achievements.sidebar.hoverTip") }) }),
        stats.inProgress > 0 && /* @__PURE__ */ jsx("p", { className: "text-blue-700 font-medium", children: t("achievements.sidebar.inProgressMessage", { count: stats.inProgress }) }),
        stats.completed === 0 && /* @__PURE__ */ jsx("p", { className: "text-forge-orange font-medium", children: t("achievements.sidebar.quickWinsTip") }),
        stats.completionPercentage >= 50 && stats.completionPercentage < 100 && /* @__PURE__ */ jsx("p", { className: "text-green-700 font-medium", children: t("achievements.sidebar.halfwayThere", {
          remaining: stats.total - stats.completed
        }) }),
        stats.completionPercentage === 100 && /* @__PURE__ */ jsxs("p", { className: "text-green-700 font-medium", children: [
          "🎉 ",
          t("achievements.sidebar.allComplete")
        ] })
      ] })
    ] })
  ] });
}
const getAchievementsData = (t) => [
  // Community Achievements
  {
    id: "telegram-join",
    title: t("achievements.tasks.telegramJoin.title"),
    description: t("achievements.tasks.telegramJoin.description"),
    xpReward: 100,
    status: "in_progress",
    category: "community",
    icon: MessageCircle,
    action: {
      label: t("achievements.tasks.telegramJoin.action"),
      url: "https://t.me/forgecollege",
      type: "external"
    }
  },
  {
    id: "discord-join",
    title: t("achievements.tasks.discordJoin.title"),
    description: t("achievements.tasks.discordJoin.description"),
    xpReward: 100,
    status: "in_progress",
    category: "community",
    icon: Users,
    action: {
      label: t("achievements.tasks.discordJoin.action"),
      url: "https://discord.gg/forgecollege",
      type: "external"
    }
  },
  {
    id: "first-message",
    title: t("achievements.tasks.firstMessage.title"),
    description: t("achievements.tasks.firstMessage.description"),
    xpReward: 50,
    status: "locked",
    category: "community",
    icon: MessageCircle
  },
  // Profile Achievements
  {
    id: "email-verify",
    title: t("achievements.tasks.emailVerify.title"),
    description: t("achievements.tasks.emailVerify.description"),
    xpReward: 150,
    status: "completed",
    category: "profile",
    icon: Mail,
    action: {
      label: t("achievements.tasks.emailVerify.action")
    }
  },
  {
    id: "complete-profile",
    title: t("achievements.tasks.completeProfile.title"),
    description: t("achievements.tasks.completeProfile.description"),
    xpReward: 200,
    status: "in_progress",
    category: "profile",
    progress: 7,
    maxProgress: 10,
    icon: Target,
    action: {
      label: t("achievements.tasks.completeProfile.action"),
      url: "/dashboard/profile",
      type: "internal"
    }
  },
  {
    id: "github-connect",
    title: t("achievements.tasks.githubConnect.title"),
    description: t("achievements.tasks.githubConnect.description"),
    xpReward: 100,
    status: "in_progress",
    category: "profile",
    icon: Github,
    action: {
      label: t("achievements.tasks.githubConnect.action")
    }
  },
  {
    id: "linkedin-connect",
    title: t("achievements.tasks.linkedinConnect.title"),
    description: t("achievements.tasks.linkedinConnect.description"),
    xpReward: 100,
    status: "in_progress",
    category: "profile",
    icon: Linkedin,
    action: {
      label: t("achievements.tasks.linkedinConnect.action")
    }
  },
  // Social Achievements
  {
    id: "twitter-follow",
    title: t("achievements.tasks.twitterFollow.title"),
    description: t("achievements.tasks.twitterFollow.description"),
    xpReward: 75,
    status: "in_progress",
    category: "social",
    icon: Twitter,
    action: {
      label: t("achievements.tasks.twitterFollow.action"),
      url: "https://twitter.com/forgecollege",
      type: "external"
    }
  },
  {
    id: "share-progress",
    title: t("achievements.tasks.shareProgress.title"),
    description: t("achievements.tasks.shareProgress.description"),
    xpReward: 150,
    status: "locked",
    category: "social",
    icon: Sparkles
  },
  // Learning Achievements
  {
    id: "first-lesson",
    title: t("achievements.tasks.firstLesson.title"),
    description: t("achievements.tasks.firstLesson.description"),
    xpReward: 50,
    status: "completed",
    category: "learning",
    icon: BookOpen
  },
  {
    id: "week-streak",
    title: t("achievements.tasks.weekStreak.title"),
    description: t("achievements.tasks.weekStreak.description"),
    xpReward: 300,
    status: "in_progress",
    category: "learning",
    progress: 4,
    maxProgress: 7,
    icon: Clock
  },
  {
    id: "complete-path",
    title: t("achievements.tasks.completePath.title"),
    description: t("achievements.tasks.completePath.description"),
    xpReward: 500,
    status: "in_progress",
    category: "learning",
    progress: 12,
    maxProgress: 28,
    icon: Star
  },
  {
    id: "perfect-quiz",
    title: t("achievements.tasks.perfectQuiz.title"),
    description: t("achievements.tasks.perfectQuiz.description"),
    xpReward: 200,
    status: "locked",
    category: "learning",
    icon: Target
  }
];
function filterAchievements(achievements2, filters) {
  let results = achievements2;
  if (filters.category !== "all") {
    results = results.filter((a) => a.category === filters.category);
  }
  if (filters.status && filters.status.length > 0) {
    results = results.filter((a) => filters.status.includes(a.status));
  }
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(
      (a) => a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
    );
  }
  if (filters.sortBy === "xp") {
    results = results.sort((a, b) => b.xpReward - a.xpReward);
  } else if (filters.sortBy === "progress") {
    results = results.sort((a, b) => {
      const progressA = a.progress && a.maxProgress ? a.progress / a.maxProgress : 0;
      const progressB = b.progress && b.maxProgress ? b.progress / b.maxProgress : 0;
      return progressB - progressA;
    });
  } else if (filters.sortBy === "status") {
    const statusPriority = { in_progress: 1, locked: 2, completed: 3 };
    results = results.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  }
  return results;
}
function useAchievements(filters) {
  const { t } = useTranslation();
  const rawAchievements = useMemo(() => getAchievementsData(t), [t]);
  const filteredAchievements = useMemo(() => {
    if (!filters) return rawAchievements;
    return filterAchievements(rawAchievements, filters);
  }, [rawAchievements, filters]);
  return {
    achievements: filteredAchievements,
    isLoading: false,
    error: null
  };
}
function useAchievementStats(achievements2) {
  return useMemo(() => {
    const completed = achievements2.filter((a) => a.status === "completed");
    const inProgress = achievements2.filter((a) => a.status === "in_progress");
    const locked = achievements2.filter((a) => a.status === "locked");
    const totalXP = completed.reduce((sum, a) => sum + a.xpReward, 0);
    const availableXP = achievements2.filter((a) => a.status !== "completed").reduce((sum, a) => sum + a.xpReward, 0);
    const completionPercentage = achievements2.length > 0 ? Math.round(completed.length / achievements2.length * 100) : 0;
    return {
      total: achievements2.length,
      completed: completed.length,
      inProgress: inProgress.length,
      locked: locked.length,
      totalXP,
      availableXP,
      completionPercentage
    };
  }, [achievements2]);
}
function useAchievementActions() {
  const navigate = useNavigate();
  const handleAchievementAction = useCallback((achievement) => {
    if (!achievement.action) return;
    const { url, type, handler } = achievement.action;
    if (handler) {
      handler();
      return;
    }
    if (url) {
      if (type === "external" || url.startsWith("http")) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        navigate(url);
      }
    }
  }, [navigate]);
  return {
    handleAchievementAction
  };
}
function useAchievementFilters() {
  const [filters, setFilters] = useState({
    category: "all",
    sortBy: "status"
  });
  const setCategory = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);
  const setSearchQuery = useCallback((searchQuery) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);
  const resetFilters = useCallback(() => {
    setFilters({ category: "all", sortBy: "status" });
  }, []);
  return {
    filters,
    setCategory,
    setSearchQuery,
    resetFilters
  };
}
function AchievementsPage() {
  const { t } = useTranslation();
  const { filters, setCategory } = useAchievementFilters();
  const { achievements: achievements2 } = useAchievements(filters);
  const stats = useAchievementStats(achievements2);
  const { handleAchievementAction } = useAchievementActions();
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const { achievements: allAchievements } = useAchievements();
  const suggestedAchievement = useMemo(() => {
    const inProgress = allAchievements.filter((a) => a.status === "in_progress").sort((a, b) => {
      const progressA = a.progress && a.maxProgress ? a.progress / a.maxProgress : 0;
      const progressB = b.progress && b.maxProgress ? b.progress / b.maxProgress : 0;
      return progressB - progressA;
    });
    if (filters.category === "all") {
      return null;
    }
    const suggestionFromOtherCategory = inProgress.find((a) => a.category !== filters.category);
    return suggestionFromOtherCategory || null;
  }, [allAchievements, filters.category]);
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-6 max-w-[1800px] mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight text-gray-900", children: t("achievements.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: t("achievements.subtitle") })
      ] }),
      /* @__PURE__ */ jsx(
        AchievementTabs,
        {
          selectedCategory: filters.category,
          onCategoryChange: setCategory,
          achievements: achievements2,
          onAchievementAction: handleAchievementAction,
          onAchievementHover: setSelectedAchievement,
          selectedAchievementId: selectedAchievement == null ? void 0 : selectedAchievement.id
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      AchievementsSidebar,
      {
        stats,
        selectedAchievement,
        suggestedAchievement,
        onActionClick: handleAchievementAction
      }
    )
  ] });
}
const App = () => {
  try {
    return /* @__PURE__ */ jsxs(TooltipProvider, { children: [
      /* @__PURE__ */ jsx(Toaster$1, {}),
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(AuthErrorBoundary, { children: /* @__PURE__ */ jsx(OAuthProvider, { children: /* @__PURE__ */ jsxs(Routes, { children: [
        /* @__PURE__ */ jsx(Route, { path: ROOT, element: /* @__PURE__ */ jsx(Navigate, { to: DASHBOARD, replace: true }) }),
        /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(PublicLayout, {}), children: [
          /* @__PURE__ */ jsx(Route, { path: OLD_HIDDEN, element: /* @__PURE__ */ jsx(Professionals, {}) }),
          /* @__PURE__ */ jsx(Route, { path: COMPANIES, element: /* @__PURE__ */ jsx(Companies, {}) }),
          /* @__PURE__ */ jsx(Route, { path: INVESTORS, element: /* @__PURE__ */ jsx(Investors, {}) })
        ] }),
        /* @__PURE__ */ jsx(Route, { path: LOGIN, element: /* @__PURE__ */ jsx(Login, {}) }),
        /* @__PURE__ */ jsx(Route, { path: SIGNUP, element: /* @__PURE__ */ jsx(SignUp, {}) }),
        /* @__PURE__ */ jsx(Route, { path: FORGOT_PASSWORD, element: /* @__PURE__ */ jsx(ForgotPassword, {}) }),
        /* @__PURE__ */ jsx(Route, { path: UPDATE_PASSWORD, element: /* @__PURE__ */ jsx(UpdatePassword, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/login-oauth", element: /* @__PURE__ */ jsx(LoginOAuth, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/auth/callback", element: /* @__PURE__ */ jsx(AuthCallback, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/test", element: /* @__PURE__ */ jsx(TestPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ssr-check", element: /* @__PURE__ */ jsx(SSRTest, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bare", element: /* @__PURE__ */ jsx(BarePage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/static-bare", element: /* @__PURE__ */ jsx(StaticBare, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ssr-canary", element: /* @__PURE__ */ jsx(SSRCanary, {}) }),
        /* @__PURE__ */ jsxs(
          Route,
          {
            path: DASHBOARD,
            element: /* @__PURE__ */ jsx(RequireAuth, { children: /* @__PURE__ */ jsx(DashboardLayout, {}) }),
            children: [
              /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(DashboardHome, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "explore", element: /* @__PURE__ */ jsx(AvailablePaths, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "formations", element: /* @__PURE__ */ jsx(FormationsPage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "formations/:formationId", element: /* @__PURE__ */ jsx(FormationDetailPage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "coming-soon", element: /* @__PURE__ */ jsx(ComingSoonPage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "profile", element: /* @__PURE__ */ jsx(Profile, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "community-projects", element: /* @__PURE__ */ jsx(CommunityProjects, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "scoreboard", element: /* @__PURE__ */ jsx(Scoreboard, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "achievements", element: /* @__PURE__ */ jsx(AchievementsPage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "learn/course/:courseId", element: /* @__PURE__ */ jsx(CourseView, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "learn/path/:pathId", element: /* @__PURE__ */ jsx(PathOverview, {}) }),
              /* @__PURE__ */ jsxs(
                Route,
                {
                  path: "admin",
                  element: /* @__PURE__ */ jsx(RequireAdmin, { children: /* @__PURE__ */ jsx(AdminLayout, {}) }),
                  children: [
                    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(AdminOverview, {}) }),
                    /* @__PURE__ */ jsx(Route, { path: "formations", element: /* @__PURE__ */ jsx(AdminFormations, {}) }),
                    /* @__PURE__ */ jsx(Route, { path: "paths", element: /* @__PURE__ */ jsx(AdminPaths, {}) }),
                    /* @__PURE__ */ jsx(Route, { path: "courses", element: /* @__PURE__ */ jsx(AdminCourses, {}) }),
                    /* @__PURE__ */ jsx(Route, { path: "modules", element: /* @__PURE__ */ jsx(AdminModules, {}) }),
                    /* @__PURE__ */ jsx(Route, { path: "lessons", element: /* @__PURE__ */ jsx(AdminLessons, {}) }),
                    /* @__PURE__ */ jsx(Route, { path: "projects", element: /* @__PURE__ */ jsx(AdminProjects, {}) })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
      ] }) }) })
    ] });
  } catch (error) {
    console.error("App SSR error:", error);
    return /* @__PURE__ */ jsxs("div", { style: {
      padding: "2rem",
      textAlign: "center",
      fontFamily: "system-ui, sans-serif"
    }, children: [
      /* @__PURE__ */ jsx("h1", { children: "SSR Error" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Erro no App principal: ",
        error instanceof Error ? error.message : "Erro desconhecido"
      ] }),
      /* @__PURE__ */ jsx("pre", { style: {
        backgroundColor: "#f5f5f5",
        padding: "1rem",
        borderRadius: "4px",
        textAlign: "left"
      }, children: error instanceof Error ? error.stack : String(error) })
    ] });
  }
};
async function render(url) {
  try {
    const html = renderToString(
      /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) })
    );
    return html;
  } catch (error) {
    console.error("SSR render error:", error);
    return `
      <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
        <h1>SSR Error</h1>
        <p>Erro ao renderizar: ${error instanceof Error ? error.message : "Erro desconhecido"}</p>
        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
}
export {
  render
};
