# Architectural Refactoring Plan: Monolithic to Distributed Design

**Project**: Momentum Habits App  
**Created**: June 8, 2025  
**Status**: Active Development  
**Target Completion**: Q3 2025  

## Overview

This document outlines the strategic refactoring of the Momentum Habits application from a monolithic Next.js application to a distributed, service-oriented architecture. The refactoring will be executed in four progressive phases to minimize disruption while preparing for future scalability.

## Current Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Server-side functions in Next.js API routes
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (monolithic deployment)

## Target Architecture

- **Frontend**: React SPA with separate deployment
- **API Gateway**: Express.js/Fastify API server
- **Microservices**: Dedicated services (Auth, Habits, Analytics, Admin)
- **Database**: Maintained Supabase with service-level abstractions
- **Message Queue**: Redis/RabbitMQ for inter-service communication
- **Deployment**: Containerized services with independent scaling

---

## Critical Stability Fixes (Completed) ✅

**Timeline**: Recently Completed  
**Goal**: Resolve authentication loops, data fetching failures, and client-side instability issues.

### Application Stability Issues Resolved
- [x] **Fixed `useHabits` infinite loop**: Removed `user` and `session` from `fetchHabits` dependency array
- [x] **Implemented proper auth redirects**: Added `useRouter` redirect logic in `HabitsPage` 
- [x] **Removed dashboard timeout bug**: Deleted `loadingTimeout` logic causing false logouts
- [x] **Fixed dependency management**: Switched from `npm` to `pnpm` for proper package resolution
- [x] **Replaced faulty API middleware**: Implemented proper Supabase SSR middleware using `@supabase/ssr`
- [x] **Resolved JWT validation issues**: Removed custom `jose` middleware blocking API requests

### Technical Debt Addressed
- [x] **Package manager consistency**: Ensured `pnpm` usage throughout project
- [x] **Authentication flow stability**: Fixed client-side auth state management loops
- [x] **API request handling**: Restored proper server-side authentication validation

---

## Phase 1: API Layer Separation (In-Process) 🎯

**Timeline**: 2-3 weeks  
**Goal**: Extract all database operations to a dedicated API service layer while maintaining current deployment structure.

### 1.1 Data Access Layer
- [x] Create `lib/api/` directory structure
- [x] Create base API client class with error handling
- [x] Create typed API response interfaces
- [x] Implement retry logic and timeout handling
- [x] Add request/response logging utilities

### 1.2 Repository Pattern Implementation
- [ ] Create `IHabitsRepository` interface
- [ ] Implement `SupabaseHabitsRepository`
- [x] Create `IAuthRepository` interface (implemented as generic API repository)
- [x] Implement `AuthRepository` (generic API-based, not Supabase-specific)
- [x] Create `BaseRepository` abstract class
- [ ] Create `IUserRepository` interface
- [ ] Implement `SupabaseUserRepository`
- [ ] Create `IAnalyticsRepository` interface
- [ ] Implement `SupabaseAnalyticsRepository`

### 1.3 Service Layer Creation
- [ ] Create `HabitsService` class
- [ ] Create `AuthService` class
- [ ] Create `UserService` class
- [ ] Create `AnalyticsService` class
- [ ] Implement service-level error handling
- [ ] Add service-level caching strategies

### 1.4 Hook Refactoring
- [x] **Critical Fix**: Refactor `useHabits` to prevent infinite loops (completed as stability fix)
- [ ] Refactor `useHabits` to use `HabitsService` (architectural refactor pending)
- [ ] Refactor `useAuth` to use `AuthService`
- [ ] Update admin hooks to use `UserService`
- [ ] Create `useAnalytics` hook with `AnalyticsService`
- [ ] Add service dependency injection to hooks

### 1.5 Testing & Validation
- [x] Create unit tests for API client (`client.test.ts`)
- [x] Set up Jest testing framework
- [ ] Create unit tests for repositories
- [ ] Create unit tests for services
- [ ] Create integration tests for data flow
- [x] Validate no breaking changes in UI (stability fixes completed)
- [ ] Performance testing vs. current implementation

---

## Phase 2: Internal Service Architecture 🔧

**Timeline**: 3-4 weeks  
**Goal**: Implement proper service boundaries and dependency injection while preparing for external API extraction.

### 2.1 Service Container & DI
- [ ] Create IoC container implementation
- [ ] Define service interfaces and contracts
- [ ] Implement dependency injection for services
- [ ] Create service factory patterns
- [ ] Add service lifecycle management

### 2.2 Shared Types & Contracts
- [ ] Create `@momentum/types` internal package
- [ ] Extract all interfaces to shared types
- [ ] Create API contract definitions
- [ ] Implement schema validation (Zod)
- [ ] Add type guards and utilities

### 2.3 Service-Level Features
- [ ] Implement service-level caching (Redis)
- [ ] Add request correlation IDs
- [ ] Implement distributed logging
- [ ] Create service health checks
- [ ] Add service metrics collection

### 2.4 Event System
- [ ] Design domain events structure
- [ ] Implement event bus (in-memory)
- [ ] Create event handlers for habits
- [ ] Create event handlers for user actions
- [ ] Add event persistence and replay

### 2.5 Configuration Management
- [ ] Extract all config to environment variables
- [ ] Create config validation schemas
- [ ] Implement feature flags system
- [ ] Add configuration hot-reloading
- [ ] Create config documentation

---

## Phase 3: External API Preparation 🌐

**Timeline**: 4-5 weeks  
**Goal**: Create production-ready API infrastructure that can be externally deployed while maintaining internal compatibility.

### 3.1 API Server Infrastructure
- [ ] Create Express.js/Fastify API server
- [ ] Implement API versioning (v1, v2, etc.)
- [ ] Add CORS and security middleware
- [ ] Implement rate limiting
- [ ] Add request/response compression

### 3.2 API Documentation & Contracts
- [ ] Generate OpenAPI/Swagger specifications
- [ ] Create interactive API documentation
- [ ] Implement API client generation
- [ ] Add request/response examples
- [ ] Create API testing suite

### 3.3 Authentication & Authorization
- [ ] Implement JWT token validation
- [ ] Create API key management
- [ ] Add role-based access control (RBAC)
- [ ] Implement API scopes and permissions
- [ ] Add OAuth2 provider integration

### 3.4 API Validation & Security
- [ ] Implement request schema validation
- [ ] Add response schema validation
- [ ] Create input sanitization
- [ ] Implement SQL injection protection
- [ ] Add API security headers

### 3.5 Monitoring & Observability
- [ ] Implement API metrics (Prometheus)
- [ ] Add distributed tracing (Jaeger)
- [ ] Create API performance monitoring
- [ ] Add error tracking and alerting
- [ ] Implement API usage analytics

---

## Phase 4: Microservices Transition 🚀

**Timeline**: 6-8 weeks  
**Goal**: Extract services to independent deployments with full microservices capabilities.

### 4.1 Service Extraction
- [ ] Extract Auth Service to independent deployment
- [ ] Extract Habits Service to independent deployment
- [ ] Extract User Service to independent deployment
- [ ] Extract Analytics Service to independent deployment
- [ ] Extract Admin Service to independent deployment

### 4.2 Service Communication
- [ ] Implement service-to-service authentication
- [ ] Add inter-service messaging (RabbitMQ/Redis)
- [ ] Create service discovery mechanism
- [ ] Implement circuit breaker patterns
- [ ] Add service mesh (Istio/Linkerd) evaluation

### 4.3 Data Management
- [ ] Implement database per service
- [ ] Create data synchronization strategies
- [ ] Add distributed transaction handling
- [ ] Implement event sourcing for critical data
- [ ] Create data migration utilities

### 4.4 Deployment & Infrastructure
- [ ] Create Docker containers for each service
- [ ] Implement Kubernetes deployments
- [ ] Add horizontal pod autoscaling
- [ ] Create CI/CD pipelines per service
- [ ] Implement blue-green deployments

### 4.5 Operations & Maintenance
- [ ] Implement centralized logging (ELK stack)
- [ ] Add distributed monitoring (Grafana)
- [ ] Create service health dashboards
- [ ] Implement automated testing pipelines
- [ ] Add disaster recovery procedures

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] All database calls abstracted through service layer
- [ ] No breaking changes in UI functionality
- [ ] Performance within 5% of current implementation
- [ ] 90%+ test coverage for new service layer

### Phase 2 Success Criteria
- [ ] Services properly isolated with clear boundaries
- [ ] Dependency injection fully implemented
- [ ] Caching improves response times by 20%+
- [ ] Event system handling 1000+ events/minute

### Phase 3 Success Criteria
- [ ] External API fully documented and tested
- [ ] API can handle 100+ concurrent requests
- [ ] Security audit passed with zero critical issues
- [ ] API response time < 200ms for 95% of requests

### Phase 4 Success Criteria
- [ ] All services independently deployable
- [ ] System handles 10x current load
- [ ] Service uptime > 99.9%
- [ ] Mean time to recovery < 5 minutes

---

## Risk Mitigation

### Technical Risks
- [ ] Create comprehensive rollback procedures
- [ ] Implement feature flags for gradual rollouts
- [ ] Maintain backward compatibility during transitions
- [ ] Create performance benchmarking suite

### Business Risks
- [ ] Schedule refactoring during low-usage periods
- [ ] Implement A/B testing for new architecture
- [ ] Create user communication plan for changes
- [ ] Maintain staging environment mirror of production

---

## Resource Requirements

### Development Team
- [ ] 1 Senior Full-Stack Developer (Lead)
- [ ] 1 Backend Developer (Services)
- [ ] 1 DevOps Engineer (Infrastructure)
- [ ] 1 QA Engineer (Testing & Validation)

### Infrastructure
- [ ] Development environment scaling
- [ ] Staging environment creation
- [ ] Production infrastructure planning
- [ ] Monitoring and alerting tools

---

## Next Steps

1. **Immediate (This Week)**
   - [ ] Review and approve this planning document
   - [ ] Set up project tracking board (GitHub Projects/Jira)
   - [ ] Create Phase 1 detailed task breakdown
   - [ ] Schedule Phase 1 kickoff meeting

2. **Phase 1 Preparation**
   - [ ] Create development branch for API layer work
   - [ ] Set up local development environment
   - [ ] Create initial project structure
   - [ ] Begin with data access layer implementation

---

## Notes

- Each phase should be completed and validated before moving to the next
- Regular architecture reviews should be scheduled at the end of each phase
- Performance and security testing should be continuous throughout all phases
- Documentation should be updated incrementally with each completed task

---

## Tomorrow's Execution Plan 🚀

**Priority**: Complete Phase 1.2 Repository Pattern Implementation  
**Estimated Time**: Full Day  
**Goal**: Build remaining repositories to complete the data access foundation

### Morning Session (2-3 hours)
1. **Create Habits Repository**
   - [ ] Define `IHabitsRepository` interface in `lib/api/repositories/habits.repository.ts`
   - [ ] Implement `HabitsRepository` extending `BaseRepository`
   - [ ] Add methods: `getHabits()`, `createHabit()`, `updateHabit()`, `deleteHabit()`, `getHabitStats()`
   - [ ] Create unit tests in `lib/api/__tests__/habits.repository.test.ts`

2. **Create User Repository**
   - [ ] Define `IUserRepository` interface in `lib/api/repositories/user.repository.ts`
   - [ ] Implement `UserRepository` extending `BaseRepository`
   - [ ] Add methods: `getProfile()`, `updateProfile()`, `getPreferences()`, `updatePreferences()`
   - [ ] Create unit tests in `lib/api/__tests__/user.repository.test.ts`

### Afternoon Session (3-4 hours)
3. **Create Analytics Repository**
   - [ ] Define `IAnalyticsRepository` interface in `lib/api/repositories/analytics.repository.ts`
   - [ ] Implement `AnalyticsRepository` extending `BaseRepository`
   - [ ] Add methods: `getHabitAnalytics()`, `getStreakData()`, `getCompletionStats()`
   - [ ] Create unit tests in `lib/api/__tests__/analytics.repository.test.ts`

4. **Begin Phase 1.3 Service Layer**
   - [ ] Create `lib/services/` directory structure
   - [ ] Create `HabitsService` class with dependency injection for `IHabitsRepository`
   - [ ] Implement basic CRUD operations with error handling
   - [ ] Add service-level validation and business logic

### End of Day Validation
- [ ] Run all tests: `npm run test`
- [ ] Verify TypeScript compilation: `tsc --noEmit`
- [ ] Update this plan with completed items
- [ ] Commit progress with descriptive messages

### Success Criteria for Tomorrow
- ✅ All repository interfaces and implementations completed
- ✅ Unit tests passing for all repositories  
- ✅ Service layer foundation started
- ✅ No TypeScript compilation errors
- ✅ Clean, well-documented code ready for integration

### Potential Blockers & Mitigation
- **API Endpoint Discovery**: May need to examine existing API routes in `v0-elastic-habits/app/api/`
- **Data Model Clarity**: Review existing database schema and types in the monolith
- **Testing Dependencies**: May need to add testing utilities for mocking API responses

---

**Last Updated**: December 19, 2024  
**Next Review**: Upon Phase 1 completion 