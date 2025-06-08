# IMPORTANT: PostgreSQL Function Data Type Mismatches

## Recurring Issue Pattern
We've encountered multiple HTTP 400 errors due to PostgreSQL function return types not matching TypeScript interface expectations.

## Common Mismatches:
1. **UUID vs TEXT**: PostgreSQL `uuid` type needs to be cast to `text` for TypeScript `string`
2. **BIGINT vs INTEGER**: PostgreSQL `bigint` needs to be cast to `integer` for TypeScript `number`
3. **TIMESTAMPTZ vs TEXT**: PostgreSQL `timestamptz` needs to be cast to `text` for TypeScript `string`
4. **VARCHAR(255) vs TEXT**: Use `varchar(255)` consistently when TypeScript expects `string`

## Solution Template:
```sql
CREATE OR REPLACE FUNCTION function_name()
RETURNS TABLE (
    user_id text,           -- Cast uuid::text
    email varchar(255),     -- Match exactly
    total_count integer,    -- Cast bigint::integer  
    timestamp_field text    -- Cast timestamptz::text
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
      u.id::text as user_id,
      u.email,
      COUNT(*)::integer as total_count,
      MAX(created_at)::text as timestamp_field
  FROM table_name;
END;
$$;
```

## Files Previously Fixed:
- `get_all_user_roles()` - Fixed email varchar(255) mismatch
- `get_active_users()` - Fixed uuid, bigint, timestamptz mismatches

## Prevention:
Always check TypeScript interface definitions before creating PostgreSQL functions and ensure exact type compatibility with proper casting. 