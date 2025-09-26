-- Seed chat data for testing

-- Insert sample chat messages between users
INSERT INTO chat_messages (sender_id, receiver_id, message, message_type, is_read, created_at) 
SELECT 
  u1.id as sender_id,
  u2.id as receiver_id,
  message,
  'text' as message_type,
  CASE WHEN random() > 0.5 THEN true ELSE false END as is_read,
  NOW() - INTERVAL '1 hour' * (random() * 24) as created_at
FROM users u1
CROSS JOIN users u2
CROSS JOIN (
  VALUES 
    ('Hi! I''m interested in your tomatoes. Are they still available?'),
    ('Yes, they are fresh and organic. When do you need them?'),
    ('I need about 50kg for my restaurant. Can you deliver to Lagos?'),
    ('We can deliver within 2 days. The price is ₦250 per kg.'),
    ('That sounds good. Can we arrange the delivery for tomorrow?'),
    ('Perfect! I''ll prepare the order. What''s your exact location?'),
    ('Thank you for the quick response. Looking forward to doing business!'),
    ('Great quality products as always. Will order again next week.'),
    ('Do you have any discounts for bulk orders?'),
    ('Yes, for orders above 100kg, we offer 10% discount.')
) AS messages(message)
WHERE u1.id != u2.id 
  AND u1.user_type != u2.user_type
  AND random() < 0.3  -- Only create messages for 30% of user pairs
LIMIT 50;

-- Insert some messages related to specific orders
INSERT INTO chat_messages (sender_id, receiver_id, order_id, message, message_type, is_read, created_at)
SELECT 
  o.buyer_id as sender_id,
  o.farmer_id as receiver_id,
  o.id as order_id,
  'Hi, I just placed an order for ' || p.name || '. When can I expect delivery?',
  'text' as message_type,
  false as is_read,
  o.created_at + INTERVAL '5 minutes'
FROM orders o
JOIN products p ON o.product_id = p.id
LIMIT 10;

-- Add farmer responses to order messages
INSERT INTO chat_messages (sender_id, receiver_id, order_id, message, message_type, is_read, created_at)
SELECT 
  o.farmer_id as sender_id,
  o.buyer_id as receiver_id,
  o.id as order_id,
  'Thank you for your order! We will deliver within 2-3 business days. I''ll keep you updated on the progress.',
  'text' as message_type,
  false as is_read,
  o.created_at + INTERVAL '30 minutes'
FROM orders o
LIMIT 10;
