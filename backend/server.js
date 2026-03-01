//server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const donorRoutes = require('./routes/donorRoutes');


// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
// Test Route
app.get('/', (req, res) => {
    res.send('PulseLink Backend API is running...');
});

app.use('/api/admin', require('./routes/adminRoutes'));
// Routes



// Connect to MongoDB
connectDB();
app.use('/api/donors', require('./routes/donorRoutes'));

app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/requests', require('./routes/bloodRequestRoutes'));

app.use("/api/notifications", require("./routes/notificationRoutes"));
// Start Server
const PORT = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Make io accessible in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join private room using userId
  socket.on("registerUser", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});