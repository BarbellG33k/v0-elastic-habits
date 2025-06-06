# Momentum Elastic Habits App - Project Handoff Documentation

## Project Overview

**Project Name:** Momentum - Elastic Habits Tracker**Repository:** v0-elastic-habits (branch: main)**Current Commit:** a3bd18c ("merge commit")**Technology Stack:** Next.js 14, TypeScript, Supabase, Tailwind CSS, shadcn/ui**Deployment:** Vercel

## Project Background

Momentum is a modern habit tracking application built on the "Elastic Habits" concept, which allows users to define flexible habits with multiple activities and achievement levels. The app enables users to create habits with up to 3 different activities, each having 3 achievement tiers (Bronze, Silver, Gold), providing flexibility in how users approach their habit formation.

## Core Architecture

### Frontend

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** React Context API with custom hooks
- **Authentication:** Supabase Auth with email/password and Google OAuth
- **Icons:** Lucide React


### Backend

- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth with JWT sessions
- **Storage:** Supabase Storage for user avatars
- **Security:** Row-level security (RLS) policies


## Current Feature Set

### ✅ Implemented Features

1. **User Authentication System**

1. Email/password registration and login
2. Google OAuth integration (temporarily disabled)
3. User profile management with avatar upload/generation
4. Password reset functionality

2. **Habit Management**

1. Create habits with up to 3 activities
2. Each activity has 3 levels (Bronze, Silver, Gold)
3. Edit and delete existing habits
4. Habit statistics (completion days, streaks)

3. **Daily Habit Tracking**

1. Track habits on any date (past, present, future limited)
2. Visual feedback with colored level buttons
3. Activity-specific tracking with checkmarks
4. Untrack functionality with confirmation dialogs
5. Default tab selection based on previously tracked activities

4. **Admin System**

1. Admin user designation and management
2. User management dashboard with search and filtering
3. Enable/disable user accounts
4. Grant/revoke admin privileges
5. User activity reports (30-day, 90-day inactive users)
6. Admin-only navigation access

5. **User Interface**

1. Responsive design for mobile, tablet, and desktop
2. Dark/light mode toggle
3. Toast notifications for user feedback
4. Loading states and error handling
5. Accessible design with proper ARIA labels

6. **Data Management**

1. User data export/import capabilities
2. Data retention settings
3. Clear all data functionality
4. Database scripts for user data management

## Database Schema

### Core Tables

- `habits` - User habits with activities and levels
- `habit_tracking` - Daily tracking entries
- `user_roles` - Admin status and account management
- Storage buckets for user avatars


### Key Relationships

- Users → Habits (one-to-many)
- Habits → Tracking (one-to-many)
- Users → Roles (one-to-one)


## Current Work Items & Requirements

### 🔄 In Progress / Pending Implementation

1. **End-of-Day Habit Reminders**

1. **Requirement:** Toast notification at 5:00 PM local time if habits are untracked
2. **Specifications:**

1. Check user's local time periodically
2. Show persistent toast requiring manual dismissal
3. Only show once per day (prevent multiple notifications)
4. Include "Track Now" button linking to tracking page
5. User-configurable reminder time in settings


3. **Status:** Implementation provided but not yet integrated

2. **Enhanced Tracking Page Behavior**

1. **Requirement:** When habit already logged, default activity selector to logged activity
2. **Specifications:**

1. Show checkmark on tracked activities in tabs
2. Outline tracked level buttons (black outline in light mode, white/gray in dark mode)
3. Prevent multiple level selections per activity
4. Maintain visual feedback for completed items


3. **Admin System Enhancements**

1. **Requirement:** Only admin users should see admin page access
2. **Current Status:** ✅ Implemented
3. **Additional Requirements:**

1. User activity tracking and reporting
2. Bulk user management operations
3. System-wide analytics and insights


## Technical Implementation Details

### Authentication Flow

- Supabase Auth handles user sessions
- Custom AuthContext provides user state management
- Admin status checked via `user_roles` table
- Disabled users automatically signed out on login attempt


### Habit Tracking Logic

- Unique constraint: `(habit_id, date, activity_index, level_index)`
- Upsert operations for tracking updates
- Real-time state synchronization with database
- Optimistic UI updates with error rollback


### Security Implementation

- Row-level security on all user data tables
- Admin-only policies for user management
- CSRF protection and input validation
- Secure avatar upload with file type restrictions


## Development Environment Setup

### Prerequisites

- Node.js 18.x or later
- Supabase account and project
- Vercel account (for deployment)


### Environment Variables Required

```plaintext
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Database Setup Scripts

Located in `/scripts/` directory:

- `create-habits-tables.sql` - Core habit tables
- `create-user-roles-table.sql` - Admin system
- `create-avatar-storage.sql` - File storage setup
- `make-user-admin.sql` - Admin user creation


## Known Issues & Considerations

### Resolved Issues

- ✅ Infinite recursion in user_roles policies
- ✅ Navigation issues between pages
- ✅ Email confirmation redirect URLs
- ✅ Duplicate habit tracking entries


### Current Considerations

- End-of-day reminder implementation needs integration
- Performance optimization for large tracking datasets
- Mobile app considerations for future development
- Offline functionality requirements


## Next Steps for New Contributors

### Immediate Priorities

1. **Integrate End-of-Day Reminders**

1. Add provided reminder components to main layout
2. Update settings page with reminder configuration
3. Test notification timing and persistence

2. **Complete Tracking Page Enhancements**

1. Implement visual feedback for tracked activities
2. Add proper outlining for completed levels
3. Ensure proper tab defaulting behavior

3. **Admin System Polish**

1. Add bulk operations for user management
2. Implement system-wide analytics
3. Create admin activity logging


### Future Enhancements

- Progressive Web App (PWA) capabilities
- Data export/import functionality
- Social features (habit sharing, challenges)
- Advanced analytics and insights
- Mobile app development


## File Structure Overview

```plaintext
/app - Next.js app router pages
/components - Reusable UI components
/contexts - React context providers
/hooks - Custom React hooks
/lib - Utility functions and configurations
/scripts - Database setup and management scripts
/styles - CSS and styling files
/types - TypeScript type definitions
/documents - Project documentation
/assets - Static assets and images
```

## Contact & Handoff Notes

This project follows modern React/Next.js best practices with a focus on type safety, accessibility, and user experience. The codebase is well-documented with comprehensive error handling and user feedback systems. All major features are implemented with proper testing considerations and scalability in mind.

**Key Success Metrics:**

- User engagement with daily habit tracking
- Admin system effectiveness for user management
- Performance and reliability of real-time updates
- Mobile responsiveness and accessibility compliance


This documentation provides a complete foundation for any developer or team to continue development of the Momentum Elastic Habits application.