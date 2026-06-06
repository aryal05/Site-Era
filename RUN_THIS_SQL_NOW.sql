-- ========================================
-- CLEAN BASE64 IMAGES FROM DATABASE
-- ========================================
-- This removes slow base64 images and keeps fast Cloudinary URLs
-- Run this in your Supabase SQL Editor
-- Time: 2-5 minutes
-- ========================================

-- 1. BACKUP CHECK (Optional but recommended)
-- See what will be affected
SELECT 
  'projects' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END) as base64_images,
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END) as url_images,
  COUNT(CASE WHEN image IS NULL THEN 1 END) as no_image
FROM projects
UNION ALL
SELECT 
  'blog',
  COUNT(*),
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END),
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END),
  COUNT(CASE WHEN image IS NULL THEN 1 END)
FROM blog
UNION ALL
SELECT 
  'services',
  COUNT(*),
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END),
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END),
  COUNT(CASE WHEN image IS NULL THEN 1 END)
FROM services;

-- 2. CLEAN PROJECTS TABLE
-- Removes base64, keeps Cloudinary URLs
UPDATE projects 
SET image = NULL 
WHERE image IS NOT NULL 
  AND image LIKE 'data:image%';

-- 3. CLEAN BLOG TABLE
UPDATE blog 
SET image = NULL 
WHERE image IS NOT NULL 
  AND image LIKE 'data:image%';

-- 4. CLEAN SERVICES TABLE
UPDATE services 
SET image = NULL 
WHERE image IS NOT NULL 
  AND image LIKE 'data:image%';

-- 5. CLEAN TEAM TABLE (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'team') THEN
    UPDATE team 
    SET avatar = NULL 
    WHERE avatar IS NOT NULL 
      AND avatar LIKE 'data:image%';
  END IF;
END $$;

-- 6. CLEAN TESTIMONIALS TABLE (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'testimonials') THEN
    UPDATE testimonials 
    SET avatar = NULL 
    WHERE avatar IS NOT NULL 
      AND avatar LIKE 'data:image%';
  END IF;
END $$;

-- 7. VERIFY RESULTS
-- Should show 0 base64 images after cleanup
SELECT 
  'projects' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END) as base64_remaining,
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END) as cloudinary_urls,
  COUNT(CASE WHEN image IS NULL THEN 1 END) as no_image
FROM projects
UNION ALL
SELECT 
  'blog',
  COUNT(*),
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END),
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END),
  COUNT(CASE WHEN image IS NULL THEN 1 END)
FROM blog
UNION ALL
SELECT 
  'services',
  COUNT(*),
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END),
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END),
  COUNT(CASE WHEN image IS NULL THEN 1 END)
FROM services;

-- 8. CHECK DATABASE SIZE REDUCTION
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'blog', 'services', 'team', 'testimonials')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ========================================
-- EXPECTED RESULTS:
-- ========================================
-- Before: base64_remaining = 5-10 (SLOW)
-- After:  base64_remaining = 0 (FAST ✅)
-- 
-- Database size should drop by 90-95%
-- Portfolio page should load in < 2 seconds
-- ========================================

-- ========================================
-- NEXT STEPS:
-- ========================================
-- 1. Refresh your portfolio page - should be FAST now
-- 2. Go to /admin/dashboard/projects
-- 3. Re-upload images for items showing gradients
-- 4. New uploads will use Cloudinary automatically
-- ========================================
