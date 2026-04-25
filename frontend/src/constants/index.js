/**
 * Application Constants
 * Centralized constants for the application
 */

export const APP_NAME = "Zivora";

export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-z0-9._]+$/,
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 64,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

export const DEBOUNCE_TIME = {
  USERNAME_CHECK: 500,
  SEARCH: 300,
  TYPING: 300,
};

export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const COOKIE_CONFIG = {
  ACCESS_TOKEN: "zivora_access_token",
  OPTIONS: {
    expires: 1,
    secure: true,
    sameSite: "Strict",
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/accounts/login",
  REGISTER: "/accounts/signup",
  FORGOT_PASSWORD: "/accounts/forget/password",
  RESET_PASSWORD: "/accounts/reset/password/:token",
  VERIFY_EMAIL: "/accounts/verify/email/:token",
  CHECK_INBOX: "/accounts/check/inbox",
  FEED: "/",
  SEARCH: "/search",
  PROFILE: "/profile/:username",
  NOTIFICATIONS: "/notifications",
};

export const SERVER_ERROR = "Server error. Please try again later.";

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "You need to login to access this resource.",
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  DEFAULT: "Something went wrong. Please try again.",
};
