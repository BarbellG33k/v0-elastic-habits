# Fixing Infinite Recursion in Supabase Policies

## The Issue

The infinite recursion error in the "user_roles" table occurs because of circular references in Row Level Security (RLS) policies. This typically happens when:

1. Policy A checks if a user has admin rights
2. To determine admin rights, it queries the same table again
3. This second query triggers the same policy check
4. This creates an infinite loop

## The Solution

Our fix addresses this issue by:

1. Using subqueries in the policy definitions that don't trigger additional policy checks
2. Making the `update_last_active` function use `SECURITY DEFINER` to bypass RLS checks
3. Ensuring that triggers don't create cascading policy evaluations

## Implementation

1. Execute the `fix-infinite-recursion.sql` script to apply these changes
2. The script:
   - Drops and recreates the problematic policies
   - Updates the trigger function to avoid recursion
   - Re-establishes the trigger with the improved function

## Verifying the Fix

After applying the fix:

1. Try tracking habits in the application
2. The error "Infinite recursion detected in policy for relation user_roles" should no longer appear
3. Navigation should continue to work normally after tracking habits

## For Future Reference

When creating RLS policies that need to reference the same table:

1. Consider using subqueries that bypass additional policy checks
2. Use `SECURITY DEFINER` functions where appropriate
3. Test thoroughly with various user scenarios to ensure no recursion occurs
