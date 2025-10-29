// server/server.js
import express from "express";
import path from "path";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
const __dirname = path.resolve();

// ⚙️ ตั้งค่า PostgreSQL
const pool = new Pool({
  user: "tripmem",          // ชื่อผู้ใช้ PostgreSQL
  host: "localhost",
  database: "webtrip", // ชื่อ database
  password: "1234",          // รหัสผ่าน
  port: 5432,
});

// 🔹 Middleware
app.use(cors());               // อนุญาต React ดึง API
app.use(express.json());       // รองรับ JSON

// ✅ Route ทดสอบ server
app.get("/", async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM "user"'); // await สำคัญ
    console.log(user.rows); // จะได้ข้อมูลจริง
    res.json(user.rows);    // ส่ง JSON กลับไป Postman
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/createplan", async (req, res) => {
  try {
    const { name, detail, range, budget, image } = req.body;
    const [startDateStr, endDateStr] = range.split(" - ");
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const user_id = 1;
    const result = await pool.query(`INSERT INTO planroom ( user_id, title, description, total_budget, start_date, end_date, share_status, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING room_id;`,[user_id,name, detail, budget, startDate, endDate, 0, image]); // await 
    const roomId = result.rows[0].room_id;
    console.log(roomId);
    res.json({message: "success" ,roomId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Route ดึงผู้ใช้ทั้งหมดจาก PostgreSQL
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "user"');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.use(express.static(path.join(__dirname, "../build")));


// 🔹 เริ่ม server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
