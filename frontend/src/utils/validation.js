// Validation utility functions matching backend validation schemas

export const validateFullName = (fullName) => {
  const errors = [];
  
  if (!fullName || fullName.trim() === "") {
    errors.push("Full name is required");
  } else {
    const trimmed = fullName.trim();
    if (trimmed.length < 2) {
      errors.push("Full name must be at least 2 characters");
    }
    if (trimmed.length > 50) {
      errors.push("Full name must not exceed 50 characters");
    }
  }
  
  return errors;
};

export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || username.trim() === "") {
    errors.push("Username is required");
    return errors;
  }
  
  const trimmed = username.trim().toLowerCase();
  
  if (trimmed.length < 3) {
    errors.push("Username must be at least 3 characters");
  }
  
  if (trimmed.length > 30) {
    errors.push("Username must not exceed 30 characters");
  }
  
  if (!/^[a-z0-9._]+$/.test(trimmed)) {
    errors.push("Username can only contain letters, numbers, dots, and underscores");
  }
  
  if (/^\d+$/.test(trimmed)) {
    errors.push("Username cannot contain only numbers");
  }
  
  return errors;
};

export const validateEmail = (email) => {
  const errors = [];
  
  if (!email || email.trim() === "") {
    errors.push("Email is required");
    return errors;
  }
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    errors.push("Please provide a valid email address");
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password === "") {
    errors.push("Password is required");
    return errors;
  }
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  
  if (password.length > 64) {
    errors.push("Password must not exceed 64 characters");
  }
  
  return errors;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = [];
  
  if (!confirmPassword || confirmPassword === "") {
    errors.push("Please confirm your password");
    return errors;
  }
  
  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }
  
  return errors;
};

export const validateUsernameOrEmail = (usernameOrEmail) => {
  const errors = [];
  
  if (!usernameOrEmail || usernameOrEmail.trim() === "") {
    errors.push("Username or email is required");
    return errors;
  }
  
  const trimmed = usernameOrEmail.trim();
  
  if (trimmed.length < 3) {
    errors.push("Username or email must be at least 3 characters");
  }
  
  if (trimmed.length > 255) {
    errors.push("Username or email must not exceed 255 characters");
  }
  
  return errors;
};

export const validateRegisterPayload = (payload) => {
  const errors = {};
  
  const fullNameErrors = validateFullName(payload.fullName);
  if (fullNameErrors.length > 0) {
    errors.fullName = fullNameErrors[0];
  }
  
  const usernameErrors = validateUsername(payload.username);
  if (usernameErrors.length > 0) {
    errors.username = usernameErrors[0];
  }
  
  const emailErrors = validateEmail(payload.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors[0];
  }
  
  const passwordErrors = validatePassword(payload.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  
  const confirmPasswordErrors = validateConfirmPassword(payload.password, payload.confirmPassword);
  if (confirmPasswordErrors.length > 0) {
    errors.confirmPassword = confirmPasswordErrors[0];
  }
  
  return errors;
};

export const validateLoginPayload = (payload) => {
  const errors = {};
  
  const usernameOrEmailErrors = validateUsernameOrEmail(payload.usernameOrEmail);
  if (usernameOrEmailErrors.length > 0) {
    errors.usernameOrEmail = usernameOrEmailErrors[0];
  }
  
  const passwordErrors = validatePassword(payload.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  
  return errors;
};
