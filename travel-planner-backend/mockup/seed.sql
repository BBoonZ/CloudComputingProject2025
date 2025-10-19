-- Insert test user
INSERT INTO aws.user (user_id, email, username, name, surname, phone_number, profile_uri)
VALUES 
('USR0000001', 'john@example.com', 'johndoe', 'John', 'Doe', '0812345678', 'https://travel-planner-profile-uploads.s3.amazonaws.com/default-avatar.png');

-- Insert additional trip plans
INSERT INTO aws.planroom (room_id, user_id, title, description, total_budget, start_date, end_date, share_status, plan_url)
VALUES 
(1, 'USR0000001', 'ทริปเที่ยวภูเก็ต 3 วัน 2 คืน', 'ทริปครอบครัวพักผ่อนช่วงปีใหม่ พร้อมดำน้ำดูปะการัง', 15000.00, '2025-12-30', '2026-01-01', 'public', 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5'),

(2, 'USR0000001', 'เที่ยวเชียงใหม่ หน้าหนาว', 'สัมผัสอากาศหนาว ชมดอกไม้เมืองหนาว ม่อนแจ่ม ดอยสุเทพ', 12000.00, '2025-11-15', '2025-11-18', 'public', 'https://images.unsplash.com/photo-1598008663918-6dd0025d9d85'),

(3, 'USR0000001', 'เกาะช้าง ทะเลตะวันออก', 'ดำน้ำ ชมปะการัง พักรีสอร์ทริมทะเล BBQ ซีฟู้ด', 8500.00, '2025-10-10', '2025-10-12', 'public', 'https://images.unsplash.com/photo-1583149577728-9695a2644053'),

(4, 'USR0000001', 'เที่ยวครบรสพัทยา', 'เที่ยวสวนน้ำ ล่องเรือเกาะล้าน ช้อปปิ้งเซ็นทรัล', 7500.00, '2025-09-20', '2025-09-22', 'public', 'https://images.unsplash.com/photo-1528181304800-259b08848526'),

(5, 'USR0000001', 'ขอนแก่น-อุดรธานี 4 วัน', 'ไหว้พระธาตุขามแก่น ช้อปปิ้งไนท์มาร์เก็ต ทะเลบัวแดง', 10000.00, '2025-08-01', '2025-08-04', 'public', 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a'),

(6, 'USR0000001', 'เขาใหญ่ พักผ่อนสุดชิล', 'พักรีสอร์ทท่ามกลางธรรมชาติ ชมวิวทะเลหมอก ไร่องุ่น', 9500.00, '2025-07-15', '2025-07-17', 'public', 'https://images.unsplash.com/photo-1592364395695-b3e83575ed56');

-- Insert members for each trip
INSERT INTO aws.member (room_id, member_name, photo)
SELECT 
  room_id,
  'Member ' || room_id || '-' || generate_series,
  'https://i.pravatar.cc/150?img=' || (room_id * 3 + generate_series)
FROM generate_series(1, 3), aws.planroom;

-- Insert itinerary entries for each trip
INSERT INTO aws.itinerary (room_id, title, map, location, time)
SELECT 
  room_id,
  'Day ' || generate_series || ' - Main Activity',
  'https://maps.google.com/?q=' || RANDOM() * 10 + 10 || ',' || RANDOM() * 10 + 100,
  'Location ' || room_id || '-' || generate_series,
  start_date + (generate_series || ' days')::INTERVAL
FROM generate_series(1, 2), aws.planroom;

-- Insert expenses for each trip
INSERT INTO aws.expend (room_id, member_id, description, value, type)
SELECT 
  p.room_id,
  m.member_id,
  CASE (RANDOM() * 3)::INT
    WHEN 0 THEN 'ค่าที่พัก'
    WHEN 1 THEN 'ค่าอาหาร'
    ELSE 'ค่ากิจกรรม'
  END,
  (RANDOM() * 2000 + 1000)::NUMERIC(12,2),
  CASE (RANDOM() * 3)::INT
    WHEN 0 THEN 'accommodation'
    WHEN 1 THEN 'food'
    ELSE 'activity'
  END
FROM aws.planroom p
JOIN aws.member m ON p.room_id = m.room_id;

-- Insert additional users
INSERT INTO aws.user (user_id, email, username, name, surname, phone_number, profile_uri)
VALUES 
('USR0000002', 'jane@example.com', 'janedoe', 'Jane', 'Smith', '0898765432', 'https://i.pravatar.cc/150?img=5'),
('USR0000003', 'bob@example.com', 'bobwilson', 'Bob', 'Wilson', '0871234567', 'https://i.pravatar.cc/150?img=12');

-- Insert more trip plans
INSERT INTO aws.planroom (room_id, user_id, title, description, total_budget, start_date, end_date, share_status, plan_url)
VALUES 
(7, 'USR0000002', 'เที่ยวสมุย-เต็มอิ่ม 4 วัน', 'ดำน้ำเกาะเต่า เกาะนางยวน พักรีสอร์ทหรู', 25000.00, '2025-09-15', '2025-09-18', 'public', 'https://images.unsplash.com/photo-1537956965359-7573183d1f57'),

(8, 'USR0000002', 'ล่องใต้ หาดใหญ่-สงขลา', 'ชิมอาหารถิ่น เที่ยวตลาดกิมหยง ทะเลสาบสงขลา', 8000.00, '2025-10-20', '2025-10-22', 'public', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a'),

(9, 'USR0000002', 'แม่ฮ่องสอน-ปาย 5 วัน', 'ขี่จักรยานเที่ยวปาย ล่องแพ ชมสะพานไม้', 18000.00, '2025-11-10', '2025-11-14', 'public', 'https://images.unsplash.com/photo-1598008663919-a481c70f2404'),

(10, 'USR0000003', 'เกาะกูด สวรรค์ตะวันออก', 'ดำน้ำ ตกปลา พักบังกะโลริมทะเล', 12000.00, '2025-12-05', '2025-12-08', 'public', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'),

(11, 'USR0000003', 'เที่ยวระยอง-จันทบุรี', 'ชิมผลไม้ เที่ยวทะเล ตลาดเก่า', 9500.00, '2026-01-15', '2026-01-17', 'public', 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5'),

(12, 'USR0000003', 'เลย-เชียงคาน 3 วัน', 'ชมทะเลหมอก ภูเรือ ถนนคนเดินเชียงคาน', 7500.00, '2026-02-10', '2026-02-12', 'public', 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c'),

(13, 'USR0000001', 'ทริปกาญจนบุรี-ผจญภัย', 'ล่องแพ เที่ยวน้ำตก ขี่ช้าง ปีนเขา', 13500.00, '2026-03-20', '2026-03-23', 'public', 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'),

(14, 'USR0000001', 'เที่ยวอยุธยา-วัดวาอาราม', 'ไหว้พระ 9 วัด ล่องเรือชมเมืองเก่า', 5500.00, '2026-04-05', '2026-04-06', 'public', 'https://images.unsplash.com/photo-1528181304800-259b08848526'),

(15, 'USR0000002', 'หัวหิน-ชะอำ ชิลล์', 'ตลาดน้ำ สวนน้ำ พักรีสอร์ทริมทะเล', 11000.00, '2026-05-01', '2026-05-03', 'public', 'https://images.unsplash.com/photo-1566438480900-0609be27a4be'),

(16, 'USR0000003', 'เขาค้อ-ภูทับเบิก', 'ชมไร่สตรอเบอร์รี่ แคมป์ปิ้ง ดูดาว', 8500.00, '2026-06-15', '2026-06-17', 'public', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e');

-- Insert members for new trips
INSERT INTO aws.member (room_id, member_name, photo)
SELECT 
  room_id,
  'Member ' || room_id || '-' || generate_series,
  'https://i.pravatar.cc/150?img=' || (room_id * 3 + generate_series)
FROM generate_series(1, 3), 
(SELECT room_id FROM aws.planroom WHERE room_id > 6) AS new_trips;

-- Insert itineraries for new trips
INSERT INTO aws.itinerary (room_id, title, map, location, time)
SELECT 
  p.room_id,
  'วันที่ ' || generate_series || ' - กิจกรรมหลัก',
  'https://maps.google.com/?q=' || (RANDOM() * 5 + 13) || ',' || (RANDOM() * 5 + 100),
  'สถานที่ท่องเที่ยว ' || p.room_id || '-' || generate_series,
  p.start_date + ((generate_series - 1) || ' days')::INTERVAL
FROM generate_series(1, 3),
(SELECT room_id, start_date FROM aws.planroom WHERE room_id > 6) AS p;

-- Insert expenses for new trips
INSERT INTO aws.expend (room_id, member_id, description, value, type)
SELECT 
  p.room_id,
  m.member_id,
  CASE floor(RANDOM() * 4)::INT
    WHEN 0 THEN 'ค่าที่พัก'
    WHEN 1 THEN 'ค่าอาหาร'
    WHEN 2 THEN 'ค่าเดินทาง'
    ELSE 'ค่ากิจกรรม'
  END,
  (RANDOM() * 3000 + 1000)::NUMERIC(12,2),
  CASE floor(RANDOM() * 4)::INT
    WHEN 0 THEN 'accommodation'
    WHEN 1 THEN 'food'
    WHEN 2 THEN 'transport'
    ELSE 'activity'
  END
FROM aws.planroom p
JOIN aws.member m ON p.room_id = m.room_id
WHERE p.room_id > 6;
