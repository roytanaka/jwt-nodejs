import Joi from '@hapi/joi';

// Register validation
export const registerVal = data => {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
  });
  return schema.validate(data);
};

// Login validation
export const loginVal = data => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
