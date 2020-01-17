import express from 'express';
import User from '../model/User';
import Joi from '@hapi/joi';
const authRoute = express.Router();

// Validation
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

export default authRoute.post('/register', async (req, res) => {
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
