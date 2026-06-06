-- ============================================================================
-- RESET ADMIN PASSWORD
-- ============================================================================
-- Run this in Supabase SQL Editor to reset admin password back to default
-- Use this if you forgot your password or want to reset to admin123
-- ============================================================================

-- Update admin password to "admin123"
-- Password hash: $2a$10$rZ8kCKQJEWKV0YF9Jjd7seDqKvZ5GPXV5kVvXvHGVvN5KZ8Fk3Fpm
UPDATE users 
SET 
  password_hash = '$2a$10$rZ8kCKQJEWKV0YF9Jjd7seDqKvZ5GPXV5kVvXvHGVvN5KZ8Fk3Fpm',
  updated_at = NOW()
WHERE username = 'admin';

-- Verify the update
SELECT 
  id,
  username,
  role,
  active,
  CASE 
    WHEN password_hash = '$2a$10$rZ8kCKQJEWKV0YF9Jjd7seDqKvZ5GPXV5kVvXvHGVvN5KZ8Fk3Fpm' 
    THEN '✓ Password reset to admin123'
    ELSE '✗ Password NOT reset'
  END as status
FROM users 
WHERE username = 'admin';

-- ============================================================================
-- AFTER RUNNING THIS:
-- ============================================================================
-- Login with:
--   Username: admin
--   Password: admin123
--
-- IMPORTANT: Change this password after logging in!
-- ============================================================================
