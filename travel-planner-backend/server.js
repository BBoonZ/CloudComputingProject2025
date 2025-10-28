const AWS = require("aws-sdk");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // โฟลเดอร์เก็บรูปใน backend
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// // Multer เก็บไฟล์ในหน่วยความจำ (ไม่ต้องเซฟลงเครื่อง)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// ตั้งค่า S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const express = require("express");
const path = require("path");
const cors = require("cors");
const { initializeTables } = require("./config/initDb");
const userRoutes = require("./routes/userRoutes");
const { validateUser } = require("./middleware/validation");
const sequelize = require("./config/database");
// const { User } = require('./models/user');
// const { Planroom } = require('./models/planroom');
// const { Member } = require('./models/member');
// const { Expend } = require('./models/expends');
const { User, Planroom, Member, Expend, Itinerary, ItineraryDetail, Access, Share } = require('./models'); 


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../build")));
app.use("/uploads", express.static("uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something broke!',
    error: err.message
  });
});

// Routes with validation
// app.use('/api/users', validateUser, userRoutes);
app.use('/api/users', userRoutes);

app.get("/trips", async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const trips = await Planroom.findAll({
      where: { user_id: user_id },
    });
    
    res.json(trips);
    console.log("gooood")
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(500).send("Server error");
  }
});

app.get("/trip_detail", async (req, res) => {
  try {
    const room_id = req.query.room_id;
    const trips = await Planroom.findOne({
      where: { room_id: room_id },
    });
    
    res.json(trips);
    console.log("exceel")
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(500).send("Server error");
  }
});


app.post("/createplan", async (req, res) => {
  try {
    const { name, detail, budget, image, start_date, end_date } = req.body; 


    const user_id = 1; // ตัวอย่าง user_id
    console.log(start_date, end_date);
    // สร้าง planroom ใหม่ด้วย Sequelize
    const newPlan = await Planroom.create({
      user_id,
      title: name,
      description: detail,
      total_budget: budget,
      start_date: start_date,
      end_date: end_date,
      share_status: false, // default เป็น false
      image: image
    });

    console.log("✅ Created room:", newPlan.room_id);

    res.json({ message: "success", roomId: newPlan.room_id });
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(500).send("Server error");
  }
});

app.post("/upload_document", async (req, res) => {
  try {
    const { doc_file } = req.body;

    const user_id = 1; // ตัวอย่าง user_id

    // สร้าง planroom ใหม่ด้วย Sequelize
    const newMember = await Planroom.create({
      user_id,
      title: name,
      description: detail,
      total_budget: budget,
      start_date: startDate,
      end_date: endDate,
      share_status: false, // default เป็น false
      image: image
    });

    console.log("✅ Created room:", newPlan.room_id);

    res.json({ message: "success", roomId: newPlan.room_id });
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(500).send("Server error");
  }
});


app.post("/addMember", upload.single("file"), async (req, res) => {
  try {
    const { name, room_id } = req.body;
    const file = req.file;

    let imageUrl = null;
    if (file) {
      imageUrl = `http://localhost:3001/uploads/${file.filename}`;
      console.log("📁 Saved locally:", imageUrl);
    }

    const newMember = await Member.create({
      room_id,
      member_name: name,
      photo: imageUrl,
    });

    res.json({ message: "success", memberId: newMember.member_id, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// app.post("/addMember", async (req, res) => {
//   try {
//     const { name, room_id, img } = req.body;

//     // สร้าง planroom ใหม่ด้วย Sequelize
//     const newMember = await Member.create({
//       room_id,
//       member_name: name,
//     });

//     console.log("✅ Created member:", newMember.member_id);

//     res.json({ message: "success", memberId: newMember.member_id });
//   } catch (err) {
//     console.error("❌ Error creating member:", err);
//     res.status(500).send("Server error");
//   }
// });

app.put("/editMember", async (req, res) => {
  try {
    const { name, room_id, member_id } = req.body;

    // สร้าง planroom ใหม่ด้วย Sequelize
    const editMember = await Member.update({
        member_name: name,
      },
      {
        where: { member_id }
      }
    );

    console.log("✅ Created member:", editMember.member_id);

    res.json({ message: "success", memberId: editMember.member_id });
  } catch (err) {
    console.error("❌ Error creating member:", err);
    res.status(500).send("Server error");
  }
});

app.get("/members", async (req, res) => {
  try {
    const room_id = req.query.room_id;
    const member = await Member.findAll({
      where: { room_id: room_id },
    });
    
    res.json(member);
    console.log("gooood")
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(500).send("Server error");
  }
});


// DELETE /deleteMember/:member_id - ลบสมาชิก
app.delete("/deleteMember/:member_id", async (req, res) => {
  try {
    const { member_id } = req.params;

    if (!member_id) {
        return res.status(400).json({ message: "Member ID is required" });
    }

    // 1. สั่งลบ และเก็บผลลัพธ์ใส่ตัวแปรชื่อ member (เหมือนเดิม)
    const member = await Member.destroy({ // <--- ใช้ชื่อ member เหมือนเดิม
      where: { member_id: member_id },
    });

    // 2. ตรวจสอบผลลัพธ์ (แต่เช็คตัวแปร member แทน)
    if (member > 0) { // <--- เปลี่ยนมาเช็ค member
      console.log(`✅ Deleted member ID: ${member_id}`);
      res.status(200).json({ message: "Member deleted successfully" });
    } else {
      console.log(`⚠️ Member ID ${member_id} not found for deletion.`);
      res.status(404).json({ message: "Member not found" });
    }

  } catch (err) {
    console.error("❌ Error deleting member:", err);
    res.status(500).json({
        status: 'error',
        message: 'Server error while deleting member',
        error: err.message
    });
  }
});


app.post("/addBudget", async (req, res) => {
  try {
    const { room_id, description, value, type, member_id, dateOnly } = req.body;

    // สร้าง planroom ใหม่ด้วย Sequelize
    const newExpend = await Expend.create({
      room_id,
      member_id: member_id,
      description: description,
      value: value,
      type: type,
      paydate: dateOnly
    });

    console.log("✅ Created expend:", newExpend.expend_id);

    res.json({ message: "success", memberId: newExpend.expend_id });
  } catch (err) {
    console.error("❌ Error creating expend:", err);
    res.status(500).send("Server error");
  }
});

app.put("/editBudget", async (req, res) => {
  try {
    const { expend_id, room_id, description, value, type, member_id, dateOnly } = req.body;

    if (!expend_id) {
      return res.status(400).json({ message: "expend_id is required for edit" });
    }

    // ใช้ update โดยตรง
    const [updatedRows] = await Expend.update(
      {
        room_id,
        member_id,
        description,
        value,
        type,
        paydate: dateOnly
      },
      {
        where: { expend_id }
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Expend not found or no changes" });
    }

    console.log("✅ Updated expend:", expend_id);
    res.json({ message: "success", expend_id });
  } catch (err) {
    console.error("❌ Error updating expend:", err);
    res.status(500).send("Server error");
  }
});

// DELETE /deleteBudget/:expend_id
app.delete("/deleteBudget/:expend_id", async (req, res) => {
  const { expend_id } = req.params;

  try {
    const result = await Expend.destroy({
      where: { expend_id },
    });

    if (result === 0) {
      return res.status(404).json({ message: "ไม่พบค่าใช้จ่ายนี้" });
    }

    res.json({ message: "ลบค่าใช้จ่ายเรียบร้อย!" });
  } catch (err) {
    console.error("❌ Error deleting expend:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบค่าใช้จ่าย" });
  }
});


app.get("/room_expends/:room_id", async (req, res) => {
  try {
    const { room_id } = req.params;

    const result = await Planroom.findOne({
      where: { room_id },
      attributes: ['room_id', 'title', 'total_budget'],
      include: [
        {
          model: Expend,
          as: 'Expends', // ต้องตรงกับ associations
          attributes: ['expend_id', 'description', 'value', 'type', 'paydate', 'member_id'],
          include: [
            {
              model: Member,
              as: 'Member', // ต้องตรงกับ associations
              attributes: ['member_id', 'member_name']
            }
          ]
        }
      ]
    });

    if (!result) return res.status(404).json({ message: "ไม่พบข้อมูล" });
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching expends:", err);
    res.status(500).send("Server error");
  }
});

// POST /addActivity - เพิ่มกิจกรรมใหม่ (Itinerary) พร้อมรายละเอียด (ItineraryDetail)
app.post("/addActivity", async (req, res) => {
  // 1. ดึงข้อมูลจาก request body
  const { 
    room_id,       // ID ของทริป
    main,          // ชื่อกิจกรรม (title)
    time,          // เวลา (e.g., "09:00")
    location,      // ชื่อสถานที่
    locationLink,  // ลิงก์ Google Maps
    details,       // Array ของรายละเอียด [{ text: "..." }, { text: "..." }]
    date           // วันที่ (e.g., "2025-12-01")
  } = req.body;

  // 2. ตรวจสอบข้อมูลที่จำเป็น
  if (!room_id || !main || !date) {
    return res.status(400).json({ 
      message: "ข้อมูล room_id, main (title), และ date ห้ามว่าง" 
    });
  }

  // 3. เริ่ม Transaction (เพราะเราจะบันทึก 2 ตาราง)
  const t = await sequelize.transaction();

  try {
    // 4. สร้าง Itinerary (กิจกรรมหลัก)
    const newItinerary = await Itinerary.create({
      room_id: room_id,
      title: main,
      location: location,
      map: locationLink,
      time: time || null, // ถ้าไม่ส่งมา ให้เป็น null
      date: date
    }, { transaction: t }); // ระบุว่าอยู่ใน transaction นี้

    // 5. ตรวจสอบว่ามี "รายละเอียด" (details) ส่งมาด้วยหรือไม่
    if (details && Array.isArray(details) && details.length > 0) {
      
      // 5.1 เตรียมข้อมูล details array สำหรับ bulkCreate
      const detailData = details
        .filter(d => d.text && d.text.trim() !== "") // กรองอันที่ว่างๆ ออก
        .map((detail, index) => ({ // <-- ใช้ map แบบมี index
          itinerary_id: newItinerary.itinerary_id, // ID จาก Itinerary ที่เพิ่งสร้าง
          description: detail.text,
          order_index: index // <-- บันทึกลำดับ (0, 1, 2, ...)
        }));

      // 5.2 บันทึก details ทั้งหมดทีเดียว (Bulk Create)
      if (detailData.length > 0) {
        await ItineraryDetail.bulkCreate(detailData, { transaction: t });
      }
    }

    // 6. ถ้าทุกอย่างสำเร็จ ให้ Commit transaction
    await t.commit();
    
    console.log("✅ Created activity (Itinerary) ID:", newItinerary.itinerary_id);
    res.status(201).json({ 
      message: "success", 
      data: newItinerary // ส่งข้อมูลที่สร้างใหม่กลับไป
    });

  } catch (err) {
    // 7. ถ้ามีข้อผิดพลาดใดๆ เกิดขึ้น ให้ Rollback
    await t.rollback();
    console.error("❌ Error creating activity:", err);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating activity',
      error: err.message
    });
  }
});

app.get("/itineraries/:room_id", async (req, res) => {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      return res.status(400).json({ message: "room_id is required" });
    }

    const activities = await Itinerary.findAll({
      where: { room_id: room_id },
      include: [
        {
          model: ItineraryDetail,
          attributes: ['description', 'order_index'],
          // ไม่ต้องใส่ as: '...' เพราะคุณไม่ได้ตั้ง as ใน index.js
        }
      ],
      order: [
        ['date', 'ASC'], // 1. เรียงตามวันที่
        ['time', 'ASC'], // 2. เรียงตามเวลา
        [ItineraryDetail, 'order_index', 'ASC'] // 3. เรียงรายละเอียดตามลำดับ
      ]
    });

    if (!activities) {
      // ถ้าไม่เจอก็ส่ง array ว่างกลับไป ไม่ใช่ error
      return res.status(200).json([]);
    }
    
    res.json(activities);

  } catch (err) {
    console.error("❌ Error fetching itineraries:", err);
    res.status(500).send("Server error");
  }
});

// PUT /editActivity/:itinerary_id - แก้ไขกิจกรรม
app.put("/editActivity/:itinerary_id", async (req, res) => {
  const { itinerary_id } = req.params;
  const { main, time, location, locationLink, details, date } = req.body;

  if (!itinerary_id) {
    return res.status(400).json({ message: "Itinerary ID is required" });
  }

  const t = await sequelize.transaction(); // 1. เริ่ม Transaction

  try {
    // 2. อัปเดต Itinerary (กิจกรรมหลัก)
    await Itinerary.update({
      title: main,
      location: location,
      map: locationLink,
      time: time || null,
      date: date
    }, {
      where: { itinerary_id: itinerary_id },
      transaction: t
    });

    // 3. ลบ ItineraryDetail (รายละเอียด) เก่าทั้งหมด
    await ItineraryDetail.destroy({
      where: { itinerary_id: itinerary_id },
      transaction: t
    });

    // 4. สร้าง ItineraryDetail ใหม่ (ถ้ามี)
    if (details && Array.isArray(details) && details.length > 0) {
      const detailData = details
        .filter(d => d.text && d.text.trim() !== "")
        .map((d, index) => ({
          itinerary_id: itinerary_id, // ใช้ ID เดิม
          description: d.text,
          order_index: index
        }));

      if (detailData.length > 0) {
        await ItineraryDetail.bulkCreate(detailData, { transaction: t });
      }
    }

    // 5. ถ้าสำเร็จ... Commit
    await t.commit();
    
    console.log("✅ Updated activity ID:", itinerary_id);
    res.status(200).json({ message: "success", itinerary_id: itinerary_id });

  } catch (err) {
    // 6. ถ้าพัง... Rollback
    await t.rollback();
    console.error("❌ Error updating activity:", err);
    res.status(500).send("Server error");
  }
});

// DELETE /deleteActivity/:itinerary_id - ลบกิจกรรม
app.delete("/deleteActivity/:itinerary_id", async (req, res) => {
  const { itinerary_id } = req.params;

  if (!itinerary_id) {
    return res.status(400).json({ message: "Itinerary ID is required" });
  }

  try {
    // 1. สั่งลบ Itinerary ตัวแม่
    const result = await Itinerary.destroy({
      where: { itinerary_id: itinerary_id },
    });

    if (result === 0) {
      // ถ้าลบไม่สำเร็จ (เพราะหา ID ไม่เจอ)
      return res.status(404).json({ message: "Activity not found" });
    }

    // 2. ไม่ต้องลบ ItineraryDetail...
    // เพราะ Model Itinerary และ ItineraryDetail ของคุณ
    // มี 'onDelete: CASCADE' 
    // ฐานข้อมูลจะลบลูกๆ (Details) ให้เองอัตโนมัติ
    
    console.log("✅ Deleted activity ID:", itinerary_id);
    res.status(200).json({ message: "success", itinerary_id: itinerary_id });

  } catch (err) {
    console.error("❌ Error deleting activity:", err);
    res.status(500).send("Server error");
  }
});

// PUT /editTrip/:room_id - แก้ไขข้อมูลหลักของทริป (Planroom)
app.put("/editTrip/:room_id", async (req, res) => {
  const { room_id } = req.params;
  // ดึงข้อมูลที่อนุญาตให้อัปเดตได้จาก body
  const { title, description, total_budget, start_date, end_date, image } = req.body;

  if (!room_id) {
    return res.status(400).json({ message: "Room ID is required" });
  }

  try {
    // 1. หา Planroom ที่ต้องการแก้ไข
    const planRoom = await Planroom.findByPk(room_id);

    if (!planRoom) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // 2. สร้าง object ข้อมูลที่จะอัปเดต (เฉพาะ field ที่ส่งมาและไม่ undefined)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    // แปลง budget เป็น null ถ้าเป็น string ว่าง หรือ undefined/null
    if (total_budget !== undefined) updateData.total_budget = (total_budget === '' || total_budget == null) ? null : total_budget;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    // ถ้า image ส่งมาเป็น null หรือ string ว่าง ก็อัปเดตเป็น null
    if (image !== undefined) updateData.image = (image === '' || image == null) ? null : image;

    // 3. สั่งอัปเดต
    await planRoom.update(updateData);

    console.log("✅ Updated Planroom ID:", room_id);
    // ส่งข้อมูลที่อัปเดตแล้วกลับไป
    res.status(200).json({ message: "success", data: planRoom.toJSON() });

  } catch (err) {
    console.error("❌ Error updating Planroom:", err);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating trip',
      error: err.message
    });
  }
});

// POST /inviteUser - เชิญผู้ใช้เข้าร่วมทริป (เพิ่ม/อัปเดตในตาราง Access)
app.post("/inviteUser", async (req, res) => {
  // 1. ดึงข้อมูล: emailOrUsername (สิ่งที่ user กรอก), roomId, role ('reader'/'editor')
  const { emailOrUsername, roomId, role } = req.body;

  if (!emailOrUsername || !roomId || !role || !['reader', 'editor'].includes(role)) {
    return res.status(400).json({ message: "Email/Username, Room ID, and a valid Role ('reader'/'editor') are required" });
  }

  const t = await sequelize.transaction(); // ใช้ Transaction เผื่อต้อง Query หลายรอบ

  try {
    // 2. หา User ID จาก Email หรือ Username
    const targetUser = await User.findOne({
      where: {
        [Op.or]: [ // ใช้ Op.or เพื่อหาจากทั้ง email และ username
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      },
      attributes: ['user_id'], // เอาแค่ user_id
      transaction: t
    });

    if (!targetUser) {
      await t.rollback(); // ไม่เจอ User ก็ไม่ต้องทำต่อ
      return res.status(404).json({ message: `User '${emailOrUsername}' not found` });
    }

    const targetUserId = targetUser.user_id;

    // 3. (Optional แต่แนะนำ) เช็คว่า Room ID มีอยู่จริง
    const roomExists = await Planroom.findByPk(roomId, { attributes: ['room_id'], transaction: t });
    if (!roomExists) {
       await t.rollback();
       return res.status(404).json({ message: `Trip room_id ${roomId} not found.` });
    }

    // --- TODO: เช็คว่า User ที่เชิญ ไม่ใช่ Owner ของทริป ---
    // (คุณอาจจะต้องเพิ่ม Logic เช็คว่า targetUserId ไม่ใช่ planRoom.user_id)
    // --------------------------------------------------------


    // 4. ใช้ findOrCreate หรือ update เพื่อเพิ่ม/แก้ไขสิทธิ์ในตาราง Access
    //    หาแถวที่มี room_id และ user_id ตรงกัน
    const [accessEntry, created] = await Access.findOrCreate({
      where: {
        room_id: roomId,
        user_id: targetUserId
      },
      defaults: { // ถ้าไม่เจอ ให้สร้างใหม่ด้วยค่าเหล่านี้
        room_id: roomId,
        user_id: targetUserId,
        role: role // ใส่ role ที่ส่งมา
      },
      transaction: t
    });

    // 5. ถ้าไม่ได้สร้างใหม่ (เจอแถวเดิม) และ Role ไม่ตรง -> ให้อัปเดต Role
    if (!created && accessEntry.role !== role) {
      accessEntry.role = role;
      await accessEntry.save({ transaction: t });
      console.log(`✅ Updated role for user ${targetUserId} in room ${roomId} to ${role}`);
    } else if (created) {
      console.log(`✅ Granted ${role} access to user ${targetUserId} for room ${roomId}`);
    } else {
       console.log(`ℹ️ User ${targetUserId} already has ${role} access in room ${roomId}. No change needed.`);
    }

    // 6. Commit Transaction
    await t.commit();

    res.status(200).json({
       message: `Successfully ${created ? 'granted' : 'updated'} access for ${emailOrUsername}`,
       data: { // ส่งข้อมูล access ที่สร้าง/อัปเดตกลับไป
           access_id: accessEntry.access_id,
           room_id: accessEntry.room_id,
           user_id: accessEntry.user_id,
           role: accessEntry.role
       }
    });

  } catch (err) {
    await t.rollback(); // Rollback ถ้ามีปัญหา
    console.error("❌ Error inviting user:", err);
     if (err.name === 'SequelizeForeignKeyConstraintError') {
         // อาจจะเกิดจาก user_id หรือ room_id ไม่มีอยู่จริง (ถึงแม้จะเช็คไปแล้ว)
         return res.status(400).json({ status: 'error', message: `Invalid user_id or room_id.` });
     }
    res.status(500).json({ status: 'error', message: 'Server error', error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize database tables
    await initializeTables();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();