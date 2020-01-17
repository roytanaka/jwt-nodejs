import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/auth';
const app = express();

// Connect to DB
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;

mongoose.connect(
  `mongodb+srv://${user}:${pass}@${host}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to DB')
);

// Middleware
app.use(express.json());

// Route middleware
app.use('/api/user', authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
