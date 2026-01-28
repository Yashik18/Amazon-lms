const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // process.exit(1); // Keep server running even if DB fails for development
  });

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('Amazon LMS API is running');
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const workflowRoutes = require('./routes/workflow.routes');
const scenarioRoutes = require('./routes/scenario.routes');
const moduleRoutes = require('./routes/module.routes');
const progressRoutes = require('./routes/progress.routes');
const adminRoutes = require('./routes/admin.routes');

// Use Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/scenarios', scenarioRoutes);
app.use('/api/v1/modules', moduleRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
