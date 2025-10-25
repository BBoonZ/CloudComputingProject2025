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
const { User, Planroom, Member, Expend } = require('./models'); 


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../build")));

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


app.post("/addMember", async (req, res) => {
  try {
    const { name, room_id } = req.body;

    // สร้าง planroom ใหม่ด้วย Sequelize
    const newMember = await Member.create({
      room_id,
      member_name: name,
    });

    console.log("✅ Created member:", newMember.member_id);

    res.json({ message: "success", memberId: newMember.member_id });
  } catch (err) {
    console.error("❌ Error creating member:", err);
    res.status(500).send("Server error");
  }
});

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


app.delete("/deleteMember/:member_id", async (req, res) => {
  try {
    const { member_id } = req.params;
    const member = await Member.destroy({
      where: { member_id: member_id },
    });
    
    console.log("gooood")
  } catch (err) {
    console.error("❌ Error delete member:", err);
    res.status(500).send("Server error");
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