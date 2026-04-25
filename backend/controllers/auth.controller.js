import { authService } from "../services/auth.service.js";
import { responseHandler } from "../utils/responseHandler.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.middleware.js";

/**
 * Check username availability
 * @route GET /api/v1/auth/check-username/:username
 */
export const checkUsernameAvailability = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const result = await authService.checkUsernameAvailability(username);

  return responseHandler.success(res, 200, result.message, {
    available: result.available,
  });
});

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
export const registerUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  await authService.registerUser(userData);

  return responseHandler.created(res, "User registered successfully");
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const credentials = req.body;
  const { user, accessToken } = await authService.loginUser(
    credentials,
    req.ip,
    req.headers["user-agent"],
  );

  return responseHandler.success(res, 200, "Login successful", user, {
    accessToken,
  });
});
