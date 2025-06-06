# Momentum App Technology Stack

## Frontend

- **Framework**: [Next.js 14](https://nextjs.org/)
  - React-based framework for building server-rendered applications
  - Uses the App Router for file-based routing
  - Server Components for improved performance and SEO

- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - Strongly typed programming language that builds on JavaScript
  - Provides better tooling, error catching, and documentation

- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
  - Collection of reusable components built with Radix UI and Tailwind CSS
  - Accessible and customizable components

- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  - Utility-first CSS framework
  - Enables rapid UI development with responsive design

- **Icons**: [Lucide React](https://lucide.dev/)
  - Beautiful & consistent icon set with over 1000 icons
  - Lightweight and customizable

- **State Management**:
  - React Context API for global state
  - Custom hooks for domain-specific state (habits, authentication)

## Backend

- **Database**: [Supabase](https://supabase.com/)
  - PostgreSQL database with real-time capabilities
  - Row-level security for fine-grained access control
  - Built-in authentication and storage

- **Authentication**:
  - Supabase Auth for email/password authentication
  - Google OAuth integration (temporarily disabled)
  - JWT-based session management

- **Storage**:
  - Supabase Storage for user avatars
  - Public and private bucket policies

## Development Tools

- **Package Manager**: npm/yarn
  - Dependency management

- **Version Control**: Git
  - Code versioning and collaboration

- **Deployment**: [Vercel](https://vercel.com/)
  - Seamless deployment and hosting
  - Edge functions and serverless architecture
  - Custom domain support

## Key Features Implementation

- **Habit Tracking**:
  - Custom hooks for habit management
  - Real-time database updates
  - Flexible habit structure with activities and levels

- **User Management**:
  - Profile customization
  - Avatar generation and upload
  - Admin controls for user management

- **Data Visualization**:
  - Custom canvas-based charts for progress tracking
  - Streak visualization
  - Activity logging

## Security Features

- **Authentication**:
  - Secure password hashing
  - JWT token-based sessions
  - OAuth integration

- **Database Security**:
  - Row-level security policies
  - User-specific data isolation
  - Admin-only access controls

- **Frontend Security**:
  - CSRF protection
  - XSS prevention
  - Input validation

## Performance Optimizations

- **Server Components**:
  - Reduced client-side JavaScript
  - Improved initial load time

- **Image Optimization**:
  - Lazy loading
  - Proper sizing and formats

- **Code Splitting**:
  - Dynamic imports for route-based code splitting
  - Reduced bundle sizes
