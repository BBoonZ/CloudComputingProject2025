const express = require('express');
const cors = require('cors');
const { initializeTables } = require('./config/initDb');
const userRoutes = require('./routes/userRoutes');
const { validateUser } = require('./middleware/validation');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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