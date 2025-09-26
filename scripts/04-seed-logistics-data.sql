-- Seed logistics data for testing

-- Insert sample deliveries
INSERT INTO deliveries (
  order_id, 
  driver_name, 
  driver_phone, 
  vehicle_info,
  pickup_location,
  delivery_location,
  estimated_distance,
  estimated_duration,
  status,
  pickup_time,
  delivery_time
) VALUES 
(
  (SELECT id FROM orders LIMIT 1),
  'Adebayo Johnson',
  '+234 803 123 4567',
  '{"type": "Truck", "plate_number": "LAG-456-XY", "capacity": "5 tons"}',
  '{"address": "Farm Road, Ikorodu", "city": "Lagos", "coordinates": {"lat": 6.6018, "lng": 3.5106}}',
  '{"address": "15 Allen Avenue, Ikeja", "city": "Lagos", "coordinates": {"lat": 6.6018, "lng": 3.3515}}',
  25.5,
  45,
  'in_transit',
  NOW() - INTERVAL '2 hours',
  NULL
),
(
  (SELECT id FROM orders LIMIT 1 OFFSET 1),
  'Fatima Abdullahi',
  '+234 805 987 6543',
  '{"type": "Van", "plate_number": "ABJ-789-ZX", "capacity": "2 tons"}',
  '{"address": "Gwagwalada Farm Estate", "city": "Abuja", "coordinates": {"lat": 8.9432, "lng": 7.0836}}',
  '{"address": "Wuse 2 District", "city": "Abuja", "coordinates": {"lat": 9.0579, "lng": 7.4951}}',
  18.2,
  35,
  'picked_up',
  NOW() - INTERVAL '1 hour',
  NULL
),
(
  (SELECT id FROM orders LIMIT 1 OFFSET 2),
  'Chinedu Okafor',
  '+234 807 555 1234',
  '{"type": "Pickup", "plate_number": "KAN-321-AB", "capacity": "1 ton"}',
  '{"address": "Kano Agricultural Zone", "city": "Kano", "coordinates": {"lat": 12.0022, "lng": 8.5920}}',
  '{"address": "Sabon Gari Market", "city": "Kano", "coordinates": {"lat": 12.0022, "lng": 8.5920}}',
  12.8,
  25,
  'delivered',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '2 hours'
),
(
  (SELECT id FROM orders LIMIT 1 OFFSET 3),
  'Blessing Okoro',
  '+234 809 444 7890',
  '{"type": "Truck", "plate_number": "PH-654-CD", "capacity": "3 tons"}',
  '{"address": "Rivers State Farm", "city": "Port Harcourt", "coordinates": {"lat": 4.8156, "lng": 7.0498}}',
  '{"address": "Creek Road Market", "city": "Port Harcourt", "coordinates": {"lat": 4.8156, "lng": 7.0498}}',
  32.1,
  55,
  'assigned',
  NULL,
  NULL
);

-- Update some orders to have corresponding deliveries
UPDATE orders 
SET status = 'in_transit' 
WHERE id IN (
  SELECT order_id FROM deliveries WHERE status IN ('picked_up', 'in_transit')
);

UPDATE orders 
SET status = 'delivered' 
WHERE id IN (
  SELECT order_id FROM deliveries WHERE status = 'delivered'
);
