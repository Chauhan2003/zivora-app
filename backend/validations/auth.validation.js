import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must not exceed 50 characters",
    "any.required": "Full name is required",
  }),
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(30)
    .pattern(/^[a-z0-9._]+$/)
    .custom((value, helpers) => {
      if (/^\d+$/.test(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters",
      "string.pattern.base":
        "Username can only contain letters, numbers, dots, and underscores",
      "any.invalid": "Username cannot contain only numbers",
      "any.required": "Username is required",
    }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(64).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must not exceed 64 characters",
    "any.required": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "Username or email is required",
    "string.min": "Username or email must be at least 3 characters",
    "any.required": "Username or email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    country: Joi.string().allow(""),
  }).optional(),
});

export const usernameParamSchema = Joi.object({
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(30)
    .pattern(/^[a-z0-9._]+$/)
    .custom((value, helpers) => {
      if (/^\d+$/.test(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
      "string.pattern.base":
        "Username can only contain letters, numbers, dots, and underscores",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters",
      "any.invalid": "Username cannot contain only numbers",
      "any.required": "Username is required",
    }),
});
