-- ============================================================================
-- ADD PRICING TABLE TO DATABASE
-- ============================================================================
-- Run this in Supabase SQL Editor to add the pricing feature
-- ============================================================================

-- Create pricing_plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    price_min INTEGER NOT NULL, -- Minimum price in NPR (thousands), e.g., 50 = 50K
    price_max INTEGER, -- Maximum price in NPR (thousands), null if fixed price
    price_display VARCHAR(100), -- How to display: "50K", "75K - 95K", "95K - 150K+"
    currency VARCHAR(10) DEFAULT 'NPR',
    billing_period VARCHAR(50) DEFAULT 'one-time', -- 'one-time', 'monthly', 'yearly'
    features JSONB DEFAULT '[]', -- Array of feature strings
    highlighted_features JSONB DEFAULT '[]', -- Features to highlight/emphasize
    not_included JSONB DEFAULT '[]', -- Features NOT included in this plan
    badge VARCHAR(100), -- e.g., "Most Popular", "Best Value", "Enterprise"
    badge_color VARCHAR(50) DEFAULT 'primary', -- 'primary', 'green', 'purple', 'orange'
    button_text VARCHAR(100) DEFAULT 'Get Started',
    button_link VARCHAR(500) DEFAULT '/contact',
    is_featured BOOLEAN DEFAULT FALSE, -- If true, this card will be highlighted
    is_popular BOOLEAN DEFAULT FALSE, -- Shows "Most Popular" badge
    is_active BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    icon VARCHAR(100) DEFAULT 'package', -- Icon name for the plan
    gradient_from VARCHAR(50) DEFAULT 'blue-500',
    gradient_to VARCHAR(50) DEFAULT 'cyan-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pricing_plans_slug ON pricing_plans(slug);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON pricing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_order ON pricing_plans("order");

-- Enable Row Level Security
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can read active pricing plans" ON pricing_plans 
    FOR SELECT USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_pricing_plans_updated_at 
    BEFORE UPDATE ON pricing_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSERT DEFAULT PRICING PLANS
-- ============================================================================

INSERT INTO pricing_plans (
    name, slug, tagline, description, 
    price_min, price_max, price_display, 
    features, highlighted_features, not_included,
    badge, is_featured, is_popular, "order",
    icon, gradient_from, gradient_to, button_text
) VALUES 
-- Basic Plan (50K)
(
    'Basic',
    'basic',
    'Perfect for Small Businesses',
    'Get started with a professional website that establishes your online presence. Ideal for startups and small businesses looking for a clean, functional website.',
    50, NULL, '50K',
    '["5-7 Page Responsive Website", "Mobile-Friendly Design", "Basic SEO Setup", "Contact Form Integration", "Social Media Links", "1 Month Free Support", "Basic Analytics Setup", "SSL Security Certificate"]'::jsonb,
    '["5-7 Page Responsive Website", "Mobile-Friendly Design", "1 Month Free Support"]'::jsonb,
    '["Custom Features", "E-commerce", "Advanced Animations", "CMS Integration", "Priority Support"]'::jsonb,
    NULL, false, false, 1,
    'package', 'blue-500', 'cyan-500', 'Get Started'
),
-- Full Advanced Plan (75K - 95K)
(
    'Full Advanced',
    'full-advanced',
    'Most Popular Choice',
    'Complete solution with advanced features, perfect animations, and premium support. Best for growing businesses that need a powerful online presence.',
    75, 95, '75K - 95K',
    '["10-15 Page Dynamic Website", "Advanced UI/UX Design", "Custom Animations & Effects", "Full SEO Optimization", "CMS Integration", "Blog/News Section", "Advanced Contact Forms", "3 Months Free Support", "Performance Optimization", "Google Analytics Integration", "Social Media Integration", "Email Newsletter Setup"]'::jsonb,
    '["10-15 Page Dynamic Website", "Custom Animations & Effects", "CMS Integration", "3 Months Free Support"]'::jsonb,
    '["E-commerce Features", "Custom Backend", "API Integrations", "24/7 Support"]'::jsonb,
    'Most Popular', true, true, 2,
    'zap', 'purple-500', 'pink-500', 'Choose Plan'
),
-- Custom Plan (95K - 150K+)
(
    'Custom Enterprise',
    'custom-enterprise',
    'For Large Scale Projects',
    'Fully customized solution with advanced features, e-commerce capabilities, custom integrations, and dedicated support. Perfect for enterprises and complex projects.',
    95, 150, '95K - 150K+',
    '["Unlimited Pages", "Custom Design & Branding", "E-commerce Integration", "Payment Gateway Setup", "Custom Admin Dashboard", "Advanced Animations", "API Integrations", "Database Design", "6 Months Free Support", "Priority Bug Fixes", "Performance & Security Audit", "Training & Documentation", "Dedicated Project Manager", "Source Code Ownership"]'::jsonb,
    '["Unlimited Pages", "E-commerce Integration", "Custom Admin Dashboard", "6 Months Free Support", "Source Code Ownership"]'::jsonb,
    '[]'::jsonb,
    'Enterprise', true, false, 3,
    'crown', 'orange-500', 'red-500', 'Contact Us'
);

-- ============================================================================
-- VERIFY THE DATA
-- ============================================================================

SELECT 
    name,
    price_display,
    is_featured,
    is_popular,
    badge,
    "order"
FROM pricing_plans
ORDER BY "order";

-- ============================================================================
-- DONE! ✅
-- ============================================================================
-- 
-- Pricing table created with 3 default plans:
-- 1. Basic - 50K
-- 2. Full Advanced - 75K to 95K (Most Popular)
-- 3. Custom Enterprise - 95K to 150K+
--
-- You can edit these from the admin panel after this is set up!
-- ============================================================================
