import express from 'express';
export const authRoute = express.Router();
import User from '../model/User';

// Validation
const Joi = require('@hapi/joi');
const schema = Joi.object({
  name: Joi.string()
    .min(6)
    .required(),
  email: Joi.string()
    .min(6)
    .required()
    .email(),
  password: Joi.string().min(6),
});

authRoute.post('/register', async (req, res) => {
  // Validate user
  const validation = schema.validate(req.body);
  res.send(validation);
  // const user = new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  // });
  // try {
  //   const savedUser = await user.save();
  //   res.send(savedUser);
  // } catch (err) {
  //   res.status(400).send(err.message);
  // }
});
