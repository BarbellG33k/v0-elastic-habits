# Data Retrieval Optimization - Separate Endpoints Strategy

## Overview

The Momentum app implements an optimized data retrieval strategy using separate API endpoints for different use cases. This approach ensures optimal performance while providing accurate calculations for streaks, insights, and recent activity.

## Architecture

### API Endpoints

1. **`/api/habits/tracking`** - Recent Activity (20 records)
   - **Purpose**: Display recent habit completions
   - **Data Limit**: 20 most recent records
   - **Cache TTL**: 1 hour
   - **Usage**: Recent Activity component

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

- **`useHabits()`**: Core habits data and recent tracking (20 records)
- **`useInsights()`**: Insights-specific data (90 days)
- **`useStreaks()`**: Streak calculation data (365 days)

## Data Periods by Component

| Component | Data Period | Rationale |
|-----------|-------------|-----------|
| Recent Activity | 20 most recent records | Shows immediate recent activity |
| Insights Card | 90 days | Provides meaningful pattern analysis |
| Current Streak | 365 days | Ensures accurate long-term streak calculation |
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
-- Recent Activity (20 records)
SELECT * FROM habit_tracking 
ORDER BY timestamp DESC 
LIMIT 20

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
- Recent Activity: "*20 most recent"
- Insights: "*90 days"
- Current Streak: "*365 days"

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

## Migration Notes

This optimization maintains backward compatibility while significantly improving performance. Existing user data remains intact, and the user experience is enhanced without any breaking changes. 