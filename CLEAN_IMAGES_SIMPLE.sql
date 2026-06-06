-- ========================================
-- SIMPLE IMAGE CLEANUP - SAFE VERSION
-- ========================================
-- Only cleans tables that exist
-- Safe to run multiple times
-- ========================================

-- 1. Clean Projects
UPDATE projects 
SET image = NULL 
WHERE image LIKE 'data:image%';

-- 2. Clean Blog
UPDATE blog 
SET image = NULL 
WHERE image LIKE 'data:image%';

-- 3. Clean Services
UPDATE services 
SET image = NULL 
WHERE image LIKE 'data:image%';

-- 4. Verify Results
SELECT 
  'projects' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END) as base64_remaining,
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END) as cloudinary_urls
FROM projects
UNION ALL
SELECT 
  'blog',
  COUNT(*),
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END),
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END)
FROM blog
UNION ALL
SELECT 
  'services',
  COUNT(*),
  COUNT(CASE WHEN image LIKE 'data:image%' THEN 1 END),
  COUNT(CASE WHEN image LIKE 'http%' THEN 1 END)
FROM services;

-- Done! Portfolio should now load fast ✅
