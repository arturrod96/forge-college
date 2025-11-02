# Knip Analysis - Prioritized Cleanup Plan

## Summary of Issues Found
- **40 unused files** - Files not imported anywhere in the project
- **2 unused devDependencies** - Dependencies listed in package.json but not used
- **3 unlisted dependencies** - Dependencies used in code but not listed in package.json
- **97 unused exports** - Exported functions/components that are not imported anywhere

## High Priority (Critical Issues - Fix First)

### 1. Unlisted Dependencies (Critical - May Break Functionality)
- `next/headers` - Used in `src/lib/supabase.ts` but not in package.json
- `chai` - Used in `test/ForgeCollege.test.js` but not in package.json  
- `@vitest/coverage-v8` - Used in `vitest.config.ts` but not in package.json

### 2. Unused DevDependencies (High Priority - Clean Package Management)
- `@openzeppelin/contracts` - Listed in package.json but not used anywhere (likely related to smart contracts that may not be implemented yet)
- `supabase` cli tool - Listed in package.json but not used in codebase

## Medium Priority (Cleanup for Maintainability)

### 3. Unused Files - API Routes (Medium Priority)
- `api/ai-chat.ts`
- `api/edge-ping.ts`
- `api/index.ts`
- `api/node-ping.ts`
- `api/ssr.ts`

### 4. Unused Files - Build/Deployment (Medium Priority)
- `scripts/deploy.cjs`
- `scripts/test-config.cjs`
- `public/entry-server.js` (likely a build artifact)
- `public/assets/*` (build artifacts - remove and re-build)

### 5. Unused Files - UI Components (Medium Priority)
- `src/components/FAQ.tsx`
- `src/components/FeatureCard.tsx`
- `src/components/Hero.tsx`
- `src/components/ui/design-badge.tsx`
- `src/components/ui/hero-section.tsx`
- `src/components/ui/process-section.tsx`
- `src/components/ui/section.tsx`
- `src/components/ui/stats-section.tsx`

### 6. Unused Files - Pages (Medium Priority)
- `src/pages/Dashboard.tsx`

### 7. Unused Files - Other (Medium Priority)
- `src/App.css`
- `src/entry-server.tsx`
- `packages/site/styles.css`
- `supabase/functions/email-notification/index.ts`

## Low Priority (Refactoring - Safe to Remove)

### 8. Unused Exports (Low Priority - Clean Up Code)
97 exports that are not used anywhere in the codebase, including:
- UI component exports (AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, etc.)
- Utility function exports
- Type definitions that are not imported
- Constants that are not referenced

## Recommended Action Plan

### Phase 1: Critical Fixes (Address First)
1. Add unlisted dependencies to package.json:
   - `npm install chai` (for tests)
   - `npm install @vitest/coverage-v8` (for coverage)
   - `npm install next` (for headers)

### Phase 2: Dependency Cleanup
2. Remove unused devDependencies:
   - `npm uninstall @openzeppelin/contracts supabase`

### Phase 3: File Cleanup (After Verification)
3. Remove unused files after confirming they are not needed:
   - Verify API routes are truly unused (check routing configuration)
   - Remove unused UI components
   - Clean up build artifacts

### Phase 4: Code Cleanup
4. Remove unused exports from components (be careful with exports that might be used in other projects or for public API)
5. Rebuild the project and run tests to ensure nothing is broken

## Notes
- Some "unused" files might be entry points for certain parts of the application
- Before removing any UI components, verify they're not conditionally rendered or used in routes
- Be careful with exports that might be part of a public API or used for future development
- After each phase, run tests to ensure no functionality is broken
- Keep the git history clean with separate commits for each type of change