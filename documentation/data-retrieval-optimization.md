# Data Retrieval Optimization - Separate Endpoints Strategy

## Overview

The Momentum app implements an optimized data retrieval strategy using separate API endpoints for different use cases. This approach ensures optimal performance while providing accurate calculations for streaks, insights, and recent activity.

## Architecture

### API Endpoints

1. **`/api/habits/tracking/recent`** - Recent Activity (last 7 days)
   - **Purpose**: Display recent habit completions and power Current Streak
   - **Data Limit**: All tracking data from last 7 days
   - **Cache TTL**: 5 minutes
   - **Usage**: Recent Activity component, Current Streak visualization

2. **`/api/habits/tracking/insights`** - Insights Data (90 days)
   - **Purpose**: Calculate activity patterns and achievements
   - **Data Limit**: Last 90 days
   - **Cache TTL**: 30 minutes
   - **Usage**: Habit Insights component

3. **`/api/habits/tracking/streaks`** - Streak Calculations (365 days)
   - **Purpose**: Calculate accurate streak data
   - **Data Limit**: Last 365 days
   - **Cache TTL**: 1 hour
   - **Usage**: Dashboard streak calculations

### Client-Side Hooks

- **`useHabits()`**: Core habits data and basic tracking functionality
- **`useRecentActivity()`**: Recent activity data (last 7 days)
- **`useInsights()`**: Insights-specific data (90 days)
- **`useStreaks()`**: Streak calculation data (365 days)

## Data Periods by Component

| Component | Data Period | Rationale |
|-----------|-------------|-----------|
| Recent Activity | Last 7 days | Shows all recent activity with predictable data volume |
| Current Streak | Last 7 days | Displays accurate daily streak for the week |
| Insights Card | 90 days | Provides meaningful pattern analysis |
| Long-term Streaks | 365 days | Ensures accurate long-term streak calculation |
| Gold Achievements | 90 days | Recent achievement tracking |

## Performance Benefits

### Before Optimization
- Single endpoint fetching all tracking data
- Potential for thousands of records per request
- Slow page loads for long-time users
- Inaccurate calculations with artificial limits

### After Optimization
- ✅ **Reduced Data Transfer**: Each endpoint fetches only necessary data
- ✅ **Faster Load Times**: Smaller payloads improve performance
- ✅ **Accurate Calculations**: No artificial limits affecting accuracy
- ✅ **Better Caching**: Different cache strategies for different data types
- ✅ **Scalable**: Performance remains consistent as user data grows

## Implementation Details

### Database Queries

```sql
-- Recent Activity (last 7 days)
SELECT * FROM habit_tracking 
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY timestamp DESC

-- Insights (90 days)
SELECT * FROM habit_tracking 
WHERE timestamp >= NOW() - INTERVAL '90 days'
ORDER BY timestamp DESC

-- Streaks (365 days)
SELECT habit_id, date, timestamp FROM habit_tracking 
WHERE timestamp >= NOW() - INTERVAL '365 days'
ORDER BY date DESC
```

### Client-Side Processing

- **Recent Activity**: Client-side sorting by activity date with timestamp tiebreaker
- **Insights**: Pattern analysis and achievement counting
- **Streaks**: Complex streak calculation algorithms

## User Experience

### Dashboard Indicators

Users see clear indicators of data periods:
- Recent Activity: "*last 7 days"
- Current Streak: "*last 7 days"
- Insights: "*90 days"
- Long-term Streaks: "*365 days"

This transparency helps users understand what data they're seeing and builds trust in the accuracy of the metrics.

## Future Considerations

### Potential Enhancements
1. **Dynamic Limits**: Adjust limits based on user activity patterns
2. **Pagination**: Add pagination for power users with extensive data
3. **Real-time Updates**: WebSocket integration for live updates
4. **Advanced Caching**: Redis integration for server-side caching

### Monitoring
- Track API response times for each endpoint
- Monitor cache hit rates
- Analyze user engagement with different data periods

## Data Refresh Coordination

### Automatic Refresh After Tracking

When users track or untrack habits, the application automatically refreshes all related data:

1. **Immediate State Updates**: The `useHabits` hook updates its local state immediately
2. **Cache Updates**: Local cache is updated with new tracking data
3. **Coordinated Refresh**: A 100ms delayed refresh triggers updates to:
   - Recent activity data (last 7 days)
   - Insights data (90-day calculations)
   - Streaks data (365-day calculations)
4. **Cache Clearing**: All data caches are cleared to force fresh data retrieval

### Implementation Details

```typescript
// DataRefreshContext coordinates updates across hooks
const { triggerRefresh } = useDataRefresh()

// After tracking a habit
await trackHabit(trackingData)
triggerRefresh() // Refreshes insights and streaks data
```

This ensures the dashboard always shows current data after any tracking activity, eliminating the need for manual page refreshes.

## Migration Notes

This optimization maintains backward compatibility while significantly improving performance. Existing user data remains intact, and the user experience is enhanced without any breaking changes. 