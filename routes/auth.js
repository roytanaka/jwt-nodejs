import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { registerVal, loginVal } from '../utils/validation';
const router = express.Router();

const generateAccessToken = userObject =>
  jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30sec',
  });

const generateRefreshToken = userObject =>
  jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1min',
  });

router.post('/register', async (req, res) => {
  // Validate user
  const { error } = registerVal(req.body);
  if (error) return res.status(400).send(error.details);
  // Check if user exists
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send('email already exists');
  // Hash Password
  let hashPassword;
  try {
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(req.body.password, salt);
  } catch (error) {
    return res.status(500).send('Server error: hashing password');
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const { _id } = await user.save();
    res.send({ userId: _id });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/login', async (req, res) => {
  // Validate user
  const { error } = loginVal(req.body);
  if (error) return res.status(400).send(error.details);
  // Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');
  // Check if password matches
  const passwordValid = await bcrypt.compare(req.body.password, user.password);
  if (!passwordValid) return res.status(400).send('Invalid email or password');
  const userInfo = {
    _id: user._id,
    role: user.role,
    email: user.email,
    name: user.name,
  };
  // Create and assign token
  const accessToken = generateAccessToken({ _id: user._id });
  const refreshToken = generateRefreshToken({ _id: user._id });
  res.status(200).json({ accessToken, refreshToken, user: userInfo });
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken({
      _id: verified._id,
    });
    const newRefreshToken = generateRefreshToken({
      _id: verified._id,
    });
    console.log('log: newRefreshToken', newRefreshToken);
    res.status(201).json({ accessToken, newRefreshToken });
  } catch (error) {
    res.sendStatus(401);
  }
});

export default router;
