# Retrospective Debugging Guide: Resolving Auth and Data Fetching Issues

This document provides a detailed, step-by-step account of the debugging process used to resolve a series of critical authentication and data-fetching issues in the application. It is written from a perspective of hindsight, outlining the optimal path to a solution.

## Initial State of the Problem

The application presented with severe issues upon user login:
1.  The user was successfully authenticated, but was then logged out after a few seconds.
2.  No user-specific data (habits, activity, etc.) was being displayed on any page.
3.  Browser console logs showed repeated authentication events and page re-renders.
4.  The main dashboard page was particularly unstable, consistently triggering the logout.

---

## Part 1: Stabilizing Client-Side Authentication and Rendering

The first priority was to stop the unexpected logouts and stabilize the client-side. The symptoms pointed to problems in the React component lifecycle and state management.

### **Findings & Root Causes**

1.  **Infinite Loop in `useHabits` Hook:** The `fetchHabits` function inside this hook included `user` and `session` objects in its `useCallback` dependency array. Since these objects were recreated on every render of the `AuthProvider`, it caused `fetchHabits` to be recreated, which in turn triggered a `useEffect` hook, leading to an infinite loop of API calls and re-renders.
2.  **Faulty Redirect Logic:** The `HabitsPage` component was attempting to handle unauthenticated users by conditionally rendering a "Sign In" button instead of performing a proper navigation redirect. This left the application in an unstable state.
3.  **Dashboard Logout Bug:** The main dashboard page (`app/page.tsx`) contained a `loadingTimeout` state. After 10 seconds, it would force the component to render the public, logged-out view, even if the user was authenticated, creating the illusion of being logged out.

### **Resolution Steps (The Optimal Path)**

1.  **Fix the `useHabits` Hook (`hooks/use-habits.tsx`):**
    *   Edit the `useCallback` for `fetchHabits` and remove `user` and `session` from the dependency array. The `authLoading` state is the only dependency needed to control re-fetching on auth state changes.
    *   Modify the `useEffect` that calls `fetchHabits`. It should only execute if `user` exists and `authLoading` is false. This prevents API calls from being made without a valid user session.

2.  **Implement Proper Redirects (`app/habits/page.tsx`):**
    *   Import the `useRouter` hook from `next/navigation`.
    *   Create a `useEffect` hook that watches for changes in `user` and `authLoading`.
    *   Inside the effect, if `authLoading` is `false` and `user` is `null`, call `router.push('/auth/sign-in')` to perform a clean, client-side redirect.
    *   Replace the old conditional render with a proper loading indicator that shows while `authLoading` is `true`.

3.  **Remove Timeout Logic (`app/page.tsx`):**
    *   Delete the `loadingTimeout` state variable and its associated `useEffect` hook entirely.
    *   Simplify the render logic: show a loading spinner if `authLoading` is true, show the public page if `!user`, and show the user dashboard if `user` is present.

---

## Part 2: Fixing the Data Fetching Layer

With the client-side stable, the issue of missing data came to the forefront. The user was logged in, but no data was appearing. This pointed to a failure in the API layer.

### **Findings & Root Causes**

1.  **Incorrect Package Manager:** The project was set up to use `pnpm` (indicated by `pnpm-lock.yaml`), but `npm` was being used to install dependencies. This led to `npm` errors (`Cannot read properties of null (reading 'matches')`) and prevented critical packages like `@supabase/ssr` from being installed.
2.  **Flawed API Middleware:** A custom middleware file (`app/api/_middleware.ts`) was attempting to validate Supabase JWTs using the `jose` library. This is not the standard or recommended approach and was failing silently, blocking all API requests from reaching their handlers. It required a `SUPABASE_JWT_SECRET` that is not part of the standard Supabase client-side flow.

### **Resolution Steps (The Optimal Path)**

1.  **Correct the Dependency Management:**
    *   Delete the `package-lock.json` file created by `npm`.
    *   Delete the `node_modules` directory to start fresh.
    *   Run `pnpm install` to install all project dependencies correctly based on `pnpm-lock.yaml`.
    *   Add any new dependencies using `pnpm add [package-name]`. In this case, `pnpm add @supabase/ssr`.

2.  **Replace the API Middleware:**
    *   Delete the incorrect custom middleware file at `app/api/_middleware.ts`.
    *   Create a new, correctly configured `middleware.ts` file in the project's root (`v0-elastic-habits/middleware.ts`).
    *   Implement this middleware using `createServerClient` from `@supabase/ssr`. This is the official Supabase method for handling server-side authentication in Next.js. It correctly reads the auth cookie, validates the session, and allows authenticated requests to proceed.
    *   Ensure the middleware has the correct types for `CookieOptions` to satisfy TypeScript.

## Conclusion

The resolution required a two-pronged approach. First, stabilizing the client-side by fixing state management loops and improper redirects. Second, and most critically, correcting the server-side data fetching by replacing the flawed custom authentication middleware with the standard, robust Supabase server-side client approach and using the correct package manager (`pnpm`) for the project. 