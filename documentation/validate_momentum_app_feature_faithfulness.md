# Cursor Prompt: Validate Momentum App Feature Faithfulness Against Documentation

## Objective:

Analyze the Momentum - Elastic Habits Tracker codebase to verify its adherence to the features, architecture, and implementation details outlined in the **Project Handoff Documentation** (provided below this prompt). The goal is to identify any discrepancies, unimplemented features, or deviations from the documented design.

## Context:

The Momentum app is a Next.js 14 application using TypeScript, Supabase, Tailwind CSS, and shadcn/ui. It features user authentication, habit creation and tracking based on the "Elastic Habits" concept, an admin system, and various UI/UX enhancements. Recently, features like rotating homepage slogans, a tutorial page, an enhanced "Buy Me a Coffee" link, and end-of-day habit reminders have been integrated.

## Instructions for Cursor:

You are to act as a code auditor. Using the **Project Handoff Documentation** (updated to reflect recent additions) as the single source of truth, perform a comprehensive review of the application's codebase.

**Key Areas for Validation (Cross-reference with the Handoff Document Sections):**

1.  **Project Overview & Core Architecture:**
    * Confirm the use of Next.js 14 (App Router), TypeScript, Supabase (PostgreSQL, Auth, Storage), Tailwind CSS, shadcn/ui, Lucide React, and React Context API with custom hooks.
    * Verify frontend and backend architectural claims.

2.  **Current Feature Set (Verify full implementation and correctness):**

    * **User Authentication System:**
        * Email/password registration and login.
        * Google OAuth integration (verify setup, even if marked "temporarily disabled").
        * User profile management with avatar upload (Supabase Storage) and generation.
        * Password reset functionality.
    * **Habit Management:**
        * Create habits with up to 3 activities.
        * Each activity having 3 achievement tiers (Bronze, Silver, Gold).
        * Edit and delete existing habits.
        * Habit statistics (completion days, streaks).
    * **Daily Habit Tracking:**
        * Track habits on any date (past, present, future limited).
        * Visual feedback with colored level buttons.
        * Activity-specific tracking with checkmarks.
        * Untrack functionality with confirmation dialogs.
        * Default tab selection based on previously tracked activities.
        * **Enhanced Tracking Page Behavior (as per "Current Work Items"):**
            * When a habit is already logged, does the activity selector default to the logged activity?
            * Are there checkmarks on tracked activities in tabs?
            * Are tracked level buttons outlined (black in light mode, white/gray in dark mode)?
            * Is multiple level selection per activity prevented?
            * Is visual feedback for completed items maintained?
    * **Admin System:**
        * Admin user designation and management (`user_roles` table).
        * User management dashboard with search and filtering.
        * Enable/disable user accounts.
        * Grant/revoke admin privileges.
        * User activity reports (30-day, 90-day inactive users).
        * Admin-only navigation access (verify that only admin users see admin page access).
        * **Admin System Enhancements (as per "Current Work Items"):**
            * User activity tracking and reporting (beyond basic reports).
            * Bulk user management operations.
            * System-wide analytics and insights. (Check if stubs or initial implementations exist).
    * **User Interface:**
        * Responsive design (mobile, tablet, desktop).
        * Dark/light mode toggle.
        * General toast notifications for user feedback.
        * Loading states and error handling.
        * Accessible design with proper ARIA labels.
        * **Rotating Slogans:** `SloganRotator` component on homepage for unauthenticated users, sourcing from JSON, rotating with fade.
        * **"How to Use" Tutorial Page:** Page at `/how-to-use`, linked from homepage, containing specified content sections.
        * **Enhanced "Buy Me a Coffee" Link:** Prominent link in the about section with icon, emoji, and improved styling.
    * **Notifications and Reminders:**
        * **End-of-Day Habit Reminders:**
            * `EnhancedHabitReminder` component in main layout.
            * Checks local time, triggers at user-configurable time (default 5:00 PM) if habits untracked.
            * Persistent toast, manual dismissal, "Track Now" button.
            * Shown once per day (check `localStorage` usage).
            * `ReminderSettings` component on settings page for enabling/disabling and time configuration, persisted in `localStorage`.
    * **Data Management:**
        * User data export/import capabilities (verify if implemented or placeholder).
        * Data retention settings.
        * Clear all data functionality.
        * Database scripts for user data management (check `/scripts/` directory).

3.  **Database Schema:**
    * Verify the existence and structure of core tables: `habits`, `habit_tracking`, `user_roles`.
    * Confirm key relationships: Users → Habits (one-to-many), Habits → Tracking (one-to-many), Users → Roles (one-to-one).
    * Check for Storage buckets for user avatars.

4.  **Technical Implementation Details:**
    * **Authentication Flow:** Supabase Auth for sessions, custom `AuthContext` for user state, admin status check via `user_roles`, disabled users signed out on login attempt.
    * **Habit Tracking Logic:** Unique constraint `(habit_id, date, activity_index, level_index)`, upsert operations, real-time state sync, optimistic UI with error rollback.
    * **Security Implementation:** Row-level security on user data tables, admin-only policies, CSRF protection, input validation, secure avatar upload with file type restrictions.

5.  **Development Environment Setup:**
    * Confirm presence and usage of specified environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
    * Verify database setup scripts in `/scripts/` directory (`create-habits-tables.sql`, `create-user-roles-table.sql`, `create-avatar-storage.sql`, `make-user-admin.sql`).

6.  **Known Issues & Considerations / Next Steps:**
    * Review "Current Considerations". Have any of these been inadvertently addressed or partially implemented?
        * End-of-day reminder integration (should now be marked as complete in the updated documentation).
        * Performance optimization for large tracking datasets.
        * Mobile app considerations.
        * Offline functionality.
    * Review "Immediate Priorities".
        * "Integrate End-of-Day Reminders" (should be complete).
        * "Complete Tracking Page Enhancements" (verify status based on checks above).
        * "Admin System Polish" (bulk operations, system-wide analytics, admin activity logging - check for initial work).

7.  **File Structure Overview:**
    * Does the actual project structure align with the documented overview?

## Output Format:

Provide a structured report based on the sections of the Handoff Documentation. For each feature or architectural point:
* **Status:** (e.g., Fully Implemented, Partially Implemented, Not Implemented, Discrepancy Found).
* **Evidence/File Paths:** Key files/directories/code snippets supporting your finding.
* **Observations:** Detailed notes on how the implementation aligns or deviates. Highlight any code quality, best practice issues, or particularly good implementations relevant to the documented feature.
* **Recommendations (if applicable):** Suggestions for aligning the codebase with the documentation if discrepancies are found.

---

## Project Handoff Documentation (Updated for Current Validation)

**(You would then paste the full, updated content of `MomentumElasticHabitsAppProjectHandoffDocumentation.md` here, incorporating the changes discussed for slogans, tutorial page, "Buy me a coffee" link, and the now-implemented reminder system. Ensure the "End-of-Day Habit Reminders" section under "Current Work Items & Requirements" is updated to reflect its implemented status, and its details are also part of the "Current Feature Set".)**

**Key Updates to Integrate into Handoff Documentation before providing it to Cursor:**

* **Current Feature Set > User Interface:**
    * Add: "Dynamic Rotating Slogans: The homepage greets unauthenticated users with randomly selected, rotating slogans for an engaging first impression, managed by a `SloganRotator` component."
    * Add: "Comprehensive 'How to Use' Page: A dedicated tutorial page at `/how-to-use`, accessible from the homepage, offers a step-by-step guide, explanations of core concepts like 'Elastic Habits,' and usage instructions."
    * Add: "Enhanced 'Buy Me a Coffee' Link: The 'Buy Me a Coffee' link in the About section features an icon, emoji, and improved button-like styling for better visibility and appeal."
* **Current Feature Set > Add new section or integrate:**
    * **"5. Notifications and Reminders"** (or similar)
        * "End-of-Day Habit Reminders: Users receive a toast notification at a configurable time (default 5:00 PM local time) if habits remain untracked for the day. This notification is persistent, requires manual dismissal, includes a 'Track Now' button, and appears only once per day. Settings for enabling/disabling and customizing the reminder time are available and persist via `localStorage`."
* **Current Work Items & Requirements > End-of-Day Habit Reminders:**
    * Change status from "Implementation provided but not yet integrated" to "**Status:** ✅ Implemented and Integrated".
* **Current Work Items & Requirements > Enhanced Tracking Page Behavior:**
    * Keep as is, this is for Cursor to verify the current state of these requirements.
* **Current Work Items & Requirements > Admin System Enhancements:**
    * Keep as is, for Cursor to check for any initial implementation.
* **Technical Implementation Details:**
    * Optionally add a subsection under "Habit Tracking Logic" or create a new one for "Notification System" detailing the `EnhancedHabitReminder` component, `localStorage` for persistence, and `setInterval` usage for the reminder feature.
* **File Structure Overview:**
    * Consider if new key components like `SloganRotator.tsx`, `EnhancedHabitReminder.tsx`, `ReminderSettings.tsx` (likely in `/components`) or data files (e.g. `/assets/slogans.json`) should be explicitly mentioned if they represent significant additions.

**(End of instructions for Cursor prompt: `validate_momentum_app_feature_faithfulness.md`)**