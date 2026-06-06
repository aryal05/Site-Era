-- ========================================
-- CREATE ADMIN USER
-- ========================================
-- Creates admin user with default credentials
-- Username: admin
-- Password: admin123
-- ========================================

-- Delete existing admin user if any (optional, comment out if you want to keep existing)
-- DELETE FROM users WHERE username = 'admin';

-- Create admin user
-- Password hash for 'admin123' (bcrypt with salt rounds = 10)
INSERT INTO users (
  username,
  email,
  password_hash,
  role,
  active,
  created_at
)
VALUES (
  'admin',
  'admin@codeverse.com',
  '$2a$10$rZ8kCKQJEWKV0YF9Jjd7seDqKvZ5GPXV5kVvXvHGVvN5KZ8Fk3Fpm',
  'admin',
  true,
  NOW()
)
ON CONFLICT (username) 
DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  active = true,
  role = 'admin';

-- Verify user was created
SELECT 
  id,
  username,
  email,
  role,
  active,
  created_at,
  '✅ Admin user ready!' as status
FROM users 
WHERE username = 'admin';

-- ========================================
-- LOGIN CREDENTIALS:
-- ========================================
-- URL: http://localhost:3000/admin
-- Username: admin
-- Password: admin123
-- 
-- ⚠️ IMPORTANT: Change password after first login!
-- ========================================
