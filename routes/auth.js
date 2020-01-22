import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { registerVal, loginVal } from '../utils/validation';
const router = express.Router();

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

const generateAccessToken = userObject =>
  jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '3min',
  });

const generateRefreshToken = userObject =>
  jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1h',
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

  const userInfo = { _id: user._id, role: user.role };

  // Create and assign token
  const accessToken = generateAccessToken(userInfo);
  const refreshToken = generateRefreshToken(userInfo);

  res.json({ accessToken, refreshToken });
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(verified);
    const accessToken = generateAccessToken({
      _id: verified._id,
      role: verified.role,
    });
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
  }
});

export default router;
