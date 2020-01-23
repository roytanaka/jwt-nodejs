import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';

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
app.use(cors());

// Route middleware
app.use('/api/user', authRoutes);
app.use('/api', postsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
