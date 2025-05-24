# Data Management Guide

This document explains how to use the SQL scripts for managing user data and cleaning up duplicate entries in the Momentum app.

## Removing User Data

The `remove-user-data.sql` script allows you to completely remove all data associated with a specific user. This is useful for testing or when a user requests their data to be deleted.

### How to Use

1. Open the script in the Supabase SQL Editor
2. Replace `'user_email@example.com'` with the actual email of the user whose data you want to remove
3. Run the script
4. Check the notices in the output to confirm the operation was successful

### What Gets Deleted

The script removes:
- All habit tracking data
- All habits created by the user
- User role information
- Storage objects (like avatars)
- Authentication sessions and tokens
- OAuth connections (identities)

By default, the script does not delete the user from `auth.users`. If you want to completely remove the user, uncomment the last DELETE statement in the script.

### Safety Considerations

- This operation cannot be undone
- Make sure you have a backup before running this script in production
- Consider using this primarily in development/testing environments

## Cleaning Duplicate Habit Tracking

The `clean-duplicate-habit-tracking.sql` script identifies and removes duplicate habit tracking entries. According to the app's rules, a user should not have more than one level tracked for the same activity on the same day.

### How It Works

1. The script identifies cases where multiple levels are tracked for the same habit activity on the same day
2. It keeps only the entry with the highest level_index (assuming higher is better)
3. It removes all other duplicate entries

### When to Use

Run this script when:
- You've identified inconsistencies in tracking data
- After fixing bugs that might have allowed duplicate tracking
- As part of regular database maintenance

### Verification

The script includes verification steps that:
1. Count how many duplicates were found and removed
2. Check if any duplicates remain after cleanup
3. Provide notices about the results

## Best Practices

- Always back up your database before running these scripts
- Run these scripts during low-traffic periods
- Test on a staging environment first if possible
- Monitor the application after running these scripts to ensure everything works correctly
