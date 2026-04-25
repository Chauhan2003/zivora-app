import { FAILURE } from "../constants/constant.js";

export const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: FAILURE,
        errors: error.details.map((err) => err.message),
      });
    }

    req[source] = value;
    next();
  };
};
