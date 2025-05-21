-- Create user_roles table to track admin status and account status
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_enabled BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update last_active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_roles 
  SET last_active = NOW(), updated_at = NOW()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update last_active when a user tracks a habit
CREATE TRIGGER update_user_last_active
AFTER INSERT ON habit_tracking
FOR EACH ROW
EXECUTE FUNCTION update_last_active();

-- Create RLS policies for the user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies without recursion
CREATE POLICY "Admins can see all user roles" 
ON user_roles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND is_admin = TRUE
  )
);

-- Users can see their own role
CREATE POLICY "Users can see their own role" 
ON user_roles FOR SELECT 
USING (auth.uid() = user_id);

-- Only admins can update user roles
CREATE POLICY "Only admins can update user roles" 
ON user_roles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND is_admin = TRUE
  )
);

-- Add a policy to allow users to update their own last_active
CREATE POLICY "Users can update their own last_active"
ON user_roles FOR UPDATE
USING (auth.uid() = user_id);

-- Function to create user_role entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user_role when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
