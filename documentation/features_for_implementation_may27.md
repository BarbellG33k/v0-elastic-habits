## 1. Features for Implementation

### 1.1. Rotating Slogans on Homepage

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

### 1.2 "How to Use" Tutorial Page

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

### 1.3. Enhanced "Buy Me a Coffee" Link

* **Requirement:** The "Buy Me a Coffee" link located in the "about section of the main page" should be visually enhanced to be more attention-catching, including an icon.
* **Implementation Details to Verify:**
    * The link is present in the designated "about section" of the main page.
    * The link includes a coffee cup icon (e.g., from Lucide React icons, consistent with footer icon or an improved version).
    * An emoji (e.g., ☕) is included for additional visual appeal.
    * The link is styled to be more prominent than plain text, possibly as an attractive gradient button with hover effects, while maintaining good taste.
    * The implementation is accessible and responsive.

### 1.4. End-of-Day Habit Reminders

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

### 1.5. Optimized Data Retrieval Strategy

* **Requirement:** Implement separate API endpoints for different data use cases to optimize performance and ensure accurate calculations for streaks, insights, and recent activity.
* **Implementation Details:**
    * **Recent Activity Endpoint** (`/api/habits/tracking`): Limited to 20 most recent records for dashboard display
    * **Insights Endpoint** (`/api/habits/tracking/insights`): Fetches 90 days of data for activity pattern analysis
    * **Streaks Endpoint** (`/api/habits/tracking/streaks`): Fetches 365 days of data for accurate streak calculations
    * **Client-side Hooks**: Separate hooks (`useInsights()`, `useStreaks()`) for different data types
    * **Performance Optimization**: Reduced data transfer, faster load times, and scalable architecture
    * **User Transparency**: Clear indicators showing data periods (e.g., "*90 days", "*365 days")
    * **Caching Strategy**: Different cache TTL for different data types (30 minutes for insights, 1 hour for others)
    * **Sorting Enhancement**: Recent Activity sorted by activity date with timestamp tiebreaker