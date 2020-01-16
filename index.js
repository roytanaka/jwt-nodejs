require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to DB
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;

mongoose.connect(
  `mongodb+srv://${user}:${pass}@${host}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connect to DB')
);

// Middleware
app.use(express.json());

// Import routes
const authRoute = require('./routes/auth');

// Route middleware
app.use('/api/user', authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
