-- Seed data for AgriNuel marketplace

-- Insert categories
INSERT INTO categories (name, description, image_url) VALUES
('Grains & Cereals', 'Rice, wheat, corn, millet and other cereal crops', '/images/categories/grains.jpg'),
('Vegetables', 'Fresh vegetables including leafy greens, root vegetables, and more', '/images/categories/vegetables.jpg'),
('Fruits', 'Fresh seasonal fruits and citrus', '/images/categories/fruits.jpg'),
('Legumes', 'Beans, peas, lentils and other protein-rich crops', '/images/categories/legumes.jpg'),
('Tubers', 'Yam, cassava, sweet potato and other root crops', '/images/categories/tubers.jpg'),
('Spices & Herbs', 'Fresh and dried spices, herbs and seasonings', '/images/categories/spices.jpg'),
('Livestock Products', 'Eggs, dairy products and other animal products', '/images/categories/livestock.jpg'),
('Cash Crops', 'Cocoa, coffee, cotton and other export crops', '/images/categories/cash-crops.jpg')
ON CONFLICT DO NOTHING;

-- Insert sample market prices for live tracking
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
    ('Lagos', 450.00, 'kg', 'Mile 12 Market'),
    ('Abuja', 420.00, 'kg', 'Wuse Market'),
    ('Kano', 380.00, 'kg', 'Sabon Gari Market'),
    ('Port Harcourt', 470.00, 'kg', 'Creek Road Market'),
    ('Ibadan', 400.00, 'kg', 'Bodija Market')
) AS prices(location, price, unit, market)
WHERE c.name = 'Grains & Cereals'
ON CONFLICT DO NOTHING;

-- Insert more market prices for vegetables
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
    ('Lagos', 250.00, 'kg', 'Mile 12 Market'),
    ('Abuja', 280.00, 'kg', 'Wuse Market'),
    ('Kano', 200.00, 'kg', 'Sabon Gari Market'),
    ('Port Harcourt', 300.00, 'kg', 'Creek Road Market'),
    ('Ibadan', 220.00, 'kg', 'Bodija Market')
) AS prices(location, price, unit, market)
WHERE c.name = 'Vegetables'
ON CONFLICT DO NOTHING;
