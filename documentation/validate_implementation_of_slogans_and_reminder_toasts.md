# PRD: Validate Implementation of Slogans, Tutorial, "Buy Me a Coffee" Link, and Reminder Toasts

## 1. Introduction

**Product:** Momentum - Elastic Habits Tracker
**Purpose:** This document outlines the requirements for validating the implementation of recently added features: rotating homepage slogans, a "How to Use" tutorial page, an enhanced "Buy Me a Coffee" link, and end-of-day habit reminder toasts. The goal is to ensure these features are correctly implemented in the codebase as per their specifications, using Cursor for code analysis.

---

## 2. Features for Implementation

### 2.1. Rotating Slogans on Homepage

* **Requirement:** Display randomly chosen slogans from a JSON file on the homepage, rotating them to provide a welcoming message for unauthenticated users.
* **Implementation Details to Verify:**
    * A `SloganRotator` component exists and is responsible for this functionality.
    * Slogans are sourced from a JSON file located within the project's assets (e.g., `/assets/slogans.json`).
    * The component randomly selects a slogan from the loaded list.
    * Slogans rotate at a predefined interval (e.g., every 4 seconds).  
    	- This is a setting the administrator of the app can set within the admin page.  This will necessitate the use of a storage structure that allows for application level settings to be managed, initially likely just a environment or file based configuration setting.
    * A smooth fade transition effect is applied during slogan changes.
    * This feature is displayed on the homepage, specifically on the welcome screen for unauthenticated users.
    * It should be displayed bellow the sign in and create account buttons, with sufficient buffer space between it and the buttons above and it and 3 boxes below.
    * The implementation is accessible, including appropriate ARIA labels.
    * The feature is responsive across different screen sizes.
* **Validation Steps for Cursor:**
    1.  **Locate Component:** Find the `SloganRotator` component (likely in `/components`).
    2.  **Data Source:** Verify that the component fetches slogans from a JSON file. Confirm the file path and structure.
    3.  **Logic Review:**
        * Examine the code for random slogan selection logic.
        * Check the implementation of the rotation timer (e.g., `setInterval` or `setTimeout` loop) and its interval (e.g., 4 seconds).
    4.  **Animation/Transition:** Inspect the CSS or component styling for a fade transition effect.
    5.  **Homepage Integration:** Confirm the `SloganRotator` component is rendered on the homepage for users who are not logged in.
    6.  **Accessibility & Responsiveness:** Check for the presence of ARIA attributes and review CSS for responsive design.

---

### 2.2. "How to Use" Tutorial Page

* **Requirement:** A dedicated page, accessible via a link or button on the homepage and navigation bar and footer, that provides users with comprehensive guidance on how to use the application.
* **Implementation Details to Verify:**
    * The tutorial page exists at the route `/how-to-use`.
    * A clear link or button with text like "Show me how to use the app" is present on the homepage and correctly navigates to `/how-to-use`.
    * The content of the `/how-to-use` page includes:
        * A step-by-step guide for getting started with the app.
        * An explanation of the "Elastic Habits" concept.
        * Detailed instructions for creating habits (including activities and levels).
        * Guidance on daily habit tracking.
        * Explanation of how to monitor progress.
        * Success tips and best practices for habit formation.
        * Call-to-action buttons (e.g., "Start Tracking," "Create a Habit").
    * The page is accessible and responsive.
* **Validation Steps for Cursor:**
    1.  **Route and Page Component:** Verify the existence of the `/how-to-use` route in the Next.js app router setup (likely in `/app/how-to-use/page.tsx`). Identify the main component rendering this page.
    2.  **Homepage Link:** Locate the "Show me how to use the app" link/button on the homepage component and confirm its `href` attribute points to `/how-to-use`.
    3.  **Content Verification:** Review the JSX and content of the `/how-to-use` page component to ensure all specified informational sections are present and accurate.
    4.  **Accessibility & Responsiveness:** Check for ARIA attributes, semantic HTML, and review CSS for responsive design.

---

### 2.3. Enhanced "Buy Me a Coffee" Link

* **Requirement:** The "Buy Me a Coffee" link located in the "about section of the main page" should be visually enhanced to be more attention-catching, including an icon.
* **Implementation Details to Verify:**
    * The link is present in the designated "about section" of the main page.
    * The link includes a coffee cup icon (e.g., from Lucide React icons, consistent with footer icon or an improved version).
    * An emoji (e.g., ☕) is included for additional visual appeal.
    * The link is styled to be more prominent than plain text, possibly as an attractive gradient button with hover effects, while maintaining good taste.
    * The implementation is accessible and responsive.
* **Validation Steps for Cursor:**
    1.  **Locate Element:** Find the "about section" component/markup on the main page and identify the "Buy Me a Coffee" link.
    2.  **Icon and Emoji:** Verify the presence of the coffee cup icon component (e.g., `<Coffee />`) and the emoji within the link's text or structure.
    3.  **Styling Review:** Inspect the Tailwind CSS classes or custom styles applied to the link. Look for gradient properties, hover effect styles, and button-like styling. Compare its visual weight to a standard text link.
    4.  **Accessibility & Responsiveness:** Check for ARIA attributes (e.g., `aria-label` if the link is icon-only or needs more description) and ensure its presentation is suitable on various screen sizes.

---

### 2.4. End-of-Day Habit Reminders

* **Requirement:** Implement a toast notification system to remind users at 5:00 PM local time if they have at least one habit with no activities logged for the day. The toast must require manual dismissal. This feature should now be fully integrated.
* **Implementation Details to Verify:**
    * An `EnhancedHabitReminder` component (or similarly named) is integrated into the main application layout (e.g., `layout.tsx`) to run globally.
    * The system periodically checks the user's local time (e.g., every minute using `setInterval`).
    * At 5:00 PM local time (or a user-configured time), the system checks if any habits remain untracked for the current day.
    * If untracked habits exist, a persistent toast notification is displayed, requiring manual user dismissal.
    * The reminder is shown only once per day for a user (e.g., using `localStorage` to track if shown).
    * The toast notification includes a "Track Now" button that links directly to the habit tracking page.
    * A `ReminderSettings` component (or similarly named) is available on the user settings page.
    * Users can enable/disable reminders and configure the reminder time via these settings.
    * Reminder settings are persisted (e.g., in `localStorage`).
* **Validation Steps for Cursor:**
    1.  **Core Reminder Component:**
        * Locate the `EnhancedHabitReminder` component. Verify its inclusion in the main app layout.
        * Review its logic for:
            * Periodic time checking (`setInterval`).
            * Fetching user's local time.
            * Condition to trigger at 5:00 PM (or configured time).
            * Logic to query habit tracking data to identify untracked habits for the day.
            * Use of `localStorage` to ensure the "once per day" rule.
    2.  **Toast Implementation:**
        * Confirm that a toast notification (e.g., from `shadcn/ui`'s Toast component) is triggered.
        * Verify the toast is persistent (does not auto-dismiss) and requires a manual close action.
        * Check for the "Track Now" button and its navigation target.
    3.  **Settings Page Integration:**
        * Locate the `ReminderSettings` component. Verify its presence on the user settings page.
        * Examine the controls for enabling/disabling reminders and setting the time.
        * Confirm that these settings are saved to and loaded from `localStorage`.
    4.  **State Management:** Ensure reminder preferences from settings are correctly used by the `EnhancedHabitReminder` component.

---

## 3. General Instructions for Cursor Analysis

For each feature listed above:
* Identify all relevant files (components, hooks, contexts, utility functions, TypeScript types, styles).
* Verify that the implemented code directly corresponds to the specified requirements and implementation details.
* Look for descriptive code comments that clarify complex logic.
* Ensure that the implementation adheres to the project's existing technology stack and coding patterns (Next.js 14 App Router, TypeScript, Supabase, Tailwind CSS, shadcn/ui, React Context API, Lucide React).
* Confirm that all new UI elements are responsive and meet basic accessibility standards (e.g., appropriate ARIA labels, keyboard navigability).
* Report any deviations, bugs, or areas where the implementation does not align with the requirements.

---