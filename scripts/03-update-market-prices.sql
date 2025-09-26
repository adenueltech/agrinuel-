-- Update market prices with more realistic data and add price history

-- Update existing market prices with more variety
UPDATE market_prices 
SET price_per_unit = CASE 
  WHEN location = 'Lagos' THEN price_per_unit * 1.1
  WHEN location = 'Abuja' THEN price_per_unit * 1.05
  WHEN location = 'Kano' THEN price_per_unit * 0.9
  WHEN location = 'Port Harcourt' THEN price_per_unit * 1.15
  WHEN location = 'Ibadan' THEN price_per_unit * 0.95
  ELSE price_per_unit
END,
updated_at = NOW();

-- Insert additional market prices for more categories
INSERT INTO market_prices (category_id, location, price_per_unit, unit, market_name) 
SELECT 
  c.id,
  location,
  price,
  unit,
  market
FROM categories c
CROSS JOIN (
  VALUES 
    ('Lagos', 180.00, 'kg', 'Mile 12 Market'),
    ('Abuja', 200.00, 'kg', 'Wuse Market'),
    ('Kano', 150.00, 'kg', 'Sabon Gari Market'),
    ('Port Harcourt', 220.00, 'kg', 'Creek Road Market'),
    ('Ibadan', 160.00, 'kg', 'Bodija Market')
) AS prices(location, price, unit, market)
WHERE c.name = 'Fruits'
ON CONFLICT DO NOTHING;

-- Insert prices for Legumes
INSERT INTO market_prices (category_id, location, price_per_unit, unit, market_name) 
SELECT 
  c.id,
  location,
  price,
  unit,
  market
FROM categories c
CROSS JOIN (
  VALUES 
    ('Lagos', 320.00, 'kg', 'Mile 12 Market'),
    ('Abuja', 340.00, 'kg', 'Wuse Market'),
    ('Kano', 280.00, 'kg', 'Sabon Gari Market'),
    ('Port Harcourt', 360.00, 'kg', 'Creek Road Market'),
    ('Ibadan', 300.00, 'kg', 'Bodija Market')
) AS prices(location, price, unit, market)
WHERE c.name = 'Legumes'
ON CONFLICT DO NOTHING;

-- Insert prices for Tubers
INSERT INTO market_prices (category_id, location, price_per_unit, unit, market_name) 
SELECT 
  c.id,
  location,
  price,
  unit,
  market
FROM categories c
CROSS JOIN (
  VALUES 
    ('Lagos', 120.00, 'kg', 'Mile 12 Market'),
    ('Abuja', 130.00, 'kg', 'Wuse Market'),
    ('Kano', 100.00, 'kg', 'Sabon Gari Market'),
    ('Port Harcourt', 140.00, 'kg', 'Creek Road Market'),
    ('Ibadan', 110.00, 'kg', 'Bodija Market')
) AS prices(location, price, unit, market)
WHERE c.name = 'Tubers'
ON CONFLICT DO NOTHING;

-- Create some sample price history data
INSERT INTO price_history (product_id, price, recorded_at)
SELECT 
  p.id,
  p.price_per_unit * (0.8 + random() * 0.4), -- Random price variation
  NOW() - INTERVAL '1 day' * (random() * 30) -- Random date within last 30 days
FROM products p
LIMIT 50;

-- Add more price history entries
INSERT INTO price_history (product_id, price, recorded_at)
SELECT 
  p.id,
  p.price_per_unit * (0.9 + random() * 0.2), -- Smaller variation for recent prices
  NOW() - INTERVAL '1 hour' * (random() * 24) -- Random time within last 24 hours
FROM products p
LIMIT 30;
