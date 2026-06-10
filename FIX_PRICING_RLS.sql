-- ============================================================================
-- FIX PRICING TABLE - ALLOW ALL OPERATIONS
-- ============================================================================
-- Run this ENTIRE script in Supabase SQL Editor (Dashboard -> SQL Editor)
-- Copy ALL the code below and paste it, then click "Run"
-- ============================================================================

-- Step 1: Drop ALL existing policies on pricing_plans (handles conflicts)
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'pricing_plans'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON pricing_plans', policy_record.policyname);
    END LOOP;
END $$;

-- Step 2: Make sure RLS is enabled
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Step 3: Create fresh policies that allow all operations
-- Policy for SELECT (anyone can read)
CREATE POLICY "pricing_select_policy" ON pricing_plans 
    FOR SELECT USING (true);

-- Policy for INSERT (anyone can insert - service role handles this)
CREATE POLICY "pricing_insert_policy" ON pricing_plans 
    FOR INSERT WITH CHECK (true);

-- Policy for UPDATE (anyone can update - service role handles this)
CREATE POLICY "pricing_update_policy" ON pricing_plans 
    FOR UPDATE USING (true) WITH CHECK (true);

-- Policy for DELETE (anyone can delete - service role handles this)
CREATE POLICY "pricing_delete_policy" ON pricing_plans 
    FOR DELETE USING (true);

-- Step 4: Verify the policies are created
SELECT 
    policyname as "Policy Name",
    cmd as "Operation",
    permissive as "Permissive"
FROM pg_policies 
WHERE tablename = 'pricing_plans';

-- Step 5: Show existing pricing plans
SELECT 
    id,
    name,
    price_display,
    is_active,
    "order"
FROM pricing_plans
ORDER BY "order";

-- ============================================================================
-- ✅ DONE! 
-- ============================================================================
-- 
-- After running this, you can:
-- ✓ Read all pricing plans (public)
-- ✓ Create new plans (admin panel)
-- ✓ Update existing plans (admin panel)
-- ✓ Delete plans (admin panel)
--
-- Go back to your admin panel and try editing a pricing plan now!
-- ============================================================================
