export const DASHBOARD_STRINGS = {
  dashboardHome: {
    badge: 'Welcome back',
    headlineSuffix: ', ready to continue your journey?',
    subheadline: 'Choose where to start today:',
    exploreCta: 'View all paths',
    myPathsCta: 'My paths',
  },
  availablePaths: {
    loadingError: 'Error loading learning paths',
    mustLoginToEnroll: 'You must be logged in to enroll',
    enrolledBadge: 'Enrolled',
    enroll: 'Enroll',
    enrolling: 'Enrolling...',
    enrollSuccess: 'Enrolled successfully!',
    enrollError: 'Error while enrolling',
    continueLearning: 'Continue learning',
    viewDetails: 'View details',
    courses: (count: number) => `${count} course${count !== 1 ? 's' : ''}`,
  },
  pathOverview: {
    loading: 'Loading learning path...',
    notFound: 'Learning path not found.',
    badge: 'Path',
    readMore: 'Read more',
    readLess: 'Read less',
    continue: 'Continue',
    enrollToStart: 'Enroll to get started',
    enroll: 'Enroll',
    enrolling: 'Enrolling...',
    nothingToContinue: 'Nothing to continue right now.',
    loadError: 'Error loading the learning path.',
    metrics: {
      basic: 'Basic',
      hoursShort: 'h',
      videos: 'videos',
      exercises: 'exercises',
      xp: 'XP',
    },
    socialProof: 'Thousands of participants are already learning in this path.',
  },
  myLearningPaths: {
    emptyTitle: 'You are not enrolled in any path yet.',
    emptySubtitle: 'Explore available paths and enroll to get started.',
    progressSuffix: '% complete',
  },
} as const


