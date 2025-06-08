-- Create function to get top active users for admin dashboard
DROP FUNCTION IF EXISTS get_active_users;
CREATE OR REPLACE FUNCTION get_active_users(limit_count integer DEFAULT 20)
RETURNS TABLE (
    user_id text,
    email varchar(255),
    full_name text,
    total_activities integer,
    last_activity text,
    streak_days integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_user_admin(auth.uid()) THEN
    RAISE EXCEPTION 'access denied: user is not an admin';
  END IF;

  RETURN QUERY
  SELECT
      u.id::text as user_id,
      u.email::varchar(255),
      COALESCE(u.raw_user_meta_data->>'full_name', 'Unknown User')::text as full_name,
      COALESCE(activity_count.total_activities, 0)::integer as total_activities,
      COALESCE(activity_count.last_activity, '')::text as last_activity,
      COALESCE(activity_count.streak_days, 0)::integer as streak_days
  FROM
      auth.users u
  LEFT JOIN (
      SELECT 
          ht.user_id,
          COUNT(*)::integer as total_activities,
          MAX(ht.timestamp)::text as last_activity,
          COUNT(DISTINCT ht.date)::integer as streak_days
      FROM habit_tracking ht
      WHERE ht.timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY ht.user_id
  ) activity_count ON u.id = activity_count.user_id
  ORDER BY 
      COALESCE(activity_count.total_activities, 0) DESC,
      u.created_at DESC
  LIMIT limit_count;
END;
$$; 