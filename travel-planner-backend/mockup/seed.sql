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









-- Insert planroom with share_status = true
INSERT INTO aws.planroom (room_id, user_id, title, description, total_budget, start_date, end_date, share_status)
VALUES 
(1, 'USR0000001', 'ทริปเที่ยวภูเก็ต 3 วัน 2 คืน', 'ทริปครอบครัวพักผ่อนช่วงปีใหม่', 15000.00, '2025-12-30', '2026-01-01', 'public');

-- Insert members
INSERT INTO aws.member (member_id, room_id, member_name, photo)
VALUES 
(1, 1, 'John Doe', 'https://travel-planner-profile-uploads.s3.amazonaws.com/member1.png'),
(2, 1, 'Jane Doe', 'https://travel-planner-profile-uploads.s3.amazonaws.com/member2.png'),
(3, 1, 'Billy Doe', 'https://travel-planner-profile-uploads.s3.amazonaws.com/member3.png');

-- Insert itinerary
INSERT INTO aws.itinerary (itinerary_id, room_id, title, map, location, time)
VALUES 
(1, 1, 'วันที่ 1 - เช็คอินโรงแรม', 'https://maps.google.com/?q=7.9519,98.3381', 'Patong Beach Hotel', '2025-12-30 14:00:00'),
(2, 1, 'วันที่ 1 - ดินเนอร์', 'https://maps.google.com/?q=7.8965,98.2945', 'Blue Elephant Restaurant', '2025-12-30 18:00:00'),
(3, 1, 'วันที่ 2 - ทัวร์เกาะพีพี', 'https://maps.google.com/?q=7.7379,98.7068', 'Phi Phi Islands', '2025-12-31 09:00:00');

-- Insert itinerary details
INSERT INTO aws.itinerary_detail (detail_id, itinerary_id, description)
VALUES 
(1, 1, 'เช็คอินโรงแรม Patong Beach - ห้อง Deluxe Sea View'),
(2, 2, 'อาหารเย็นร้าน Blue Elephant - อาหารไทยต้นตำรับ'),
(3, 3, 'ทัวร์ดำน้ำเกาะพีพี รวมอาหารกลางวัน');

-- Insert expenses
INSERT INTO aws.expend (expend_id, room_id, member_id, description, value, type)
VALUES 
(1, 1, 1, 'ค่าโรงแรม 2 คืน', 6000.00, 'accommodation'),
(2, 1, 2, 'ค่าอาหารเย็น Blue Elephant', 2500.00, 'food'),
(3, 1, 1, 'ค่าทัวร์เกาะพีพี', 4500.00, 'activity');

-- Insert documents
INSERT INTO aws.document (doc_id, room_id, file)
VALUES 
(1, 1, 'https://travel-planner-docs.s3.amazonaws.com/hotel-booking.pdf'),
(2, 1, 'https://travel-planner-docs.s3.amazonaws.com/tour-booking.pdf');

-- Insert share settings
INSERT INTO aws.share (share_id, room_id, mode, link)
VALUES 
(1, 1, 'public', 'https://travelplanner.com/share/trip/1');

-- Insert access permissions
INSERT INTO aws.access (access_id, room_id, user_id, role)
VALUES 
(1, 1, 'USR0000001', 'owner');

ALTER TABLE aws.planroom 
ADD COLUMN plan_url TEXT DEFAULT 'https://travel-planner-profile-uploads.s3.amazonaws.com/default-trip.jpg';

-- Update existing mockup data
UPDATE aws.planroom
SET plan_url = 'https://travel-planner-profile-uploads.s3.amazonaws.com/phuket-trip.jpg'
WHERE room_id = 1;
