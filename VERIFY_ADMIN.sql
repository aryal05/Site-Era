-- ============================================================================
-- VERIFY ADMIN USER EXISTS
-- ============================================================================
-- Run this in Supabase SQL Editor to check if admin user exists
-- ============================================================================

-- Check if users table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'users'
) AS users_table_exists;

-- Check if admin user exists
SELECT 
  id,
  username,
  role,
  active,
  created_at,
  last_login,
  CASE 
    WHEN password_hash IS NOT NULL THEN 'Password is set'
    ELSE 'No password'
  END as password_status
FROM users 
WHERE username = 'admin';

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- ============================================================================
-- EXPECTED RESULTS:
-- ============================================================================
-- If admin exists: You'll see one row with username 'admin'
-- If admin doesn't exist: You'll see zero rows
--
-- If you see zero rows, you MUST run: CREATE_ADMIN_USER.sql
-- ============================================================================
