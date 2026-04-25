# Backend Architecture Documentation

## Overview
This document outlines the scalable architecture pattern used in the Zivora backend application.

## Project Structure

```
backend/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── configs/               # Configuration files
│   ├── cloudinary.config.js
│   ├── database.config.js
│   ├── email.config.js
│   ├── groq.config.js
│   ├── socket.config.js
│   └── swagger.config.js
├── constants/             # Application constants
│   └── index.js
├── controllers/           # Route controllers (thin layer)
├── middlewares/           # Express middlewares
│   ├── errorHandler.middleware.js
│   ├── multer.middleware.js
│   ├── protect.middleware.js
│   └── validateRequest.middleware.js
├── models/                # Mongoose models
├── routes/                # API routes
├── services/              # Business logic layer
│   ├── auth.service.js
│   ├── user.service.js
│   └── index.js
├── utils/                 # Utility functions
│   ├── responseHandler.js
│   ├── logger.js
│   └── index.js
└── validations/           # Request validation schemas
```

## Key Architectural Decisions

### 1. Service Layer Pattern
**Location:** `src/services/`

All business logic is centralized in the service layer. This provides:
- Separation of concerns from controllers
- Reusable business logic
- Easier testing and mocking
- Single source of truth for operations

**Example Usage:**
```javascript
import { authService } from "../services";

const result = await authService.checkUsernameAvailability(username);
```

### 2. Controller Layer (Thin)
**Location:** `src/controllers/`

Controllers are kept thin and only handle:
- Request/response handling
- Calling service layer
- Returning responses via responseHandler

**Example:**
```javascript
export const loginUser = asyncHandler(async (req, res) => {
  const credentials = req.body;
  const { user, accessToken } = await authService.loginUser(credentials, req.ip, req.headers["user-agent"]);
  return responseHandler.success(res, 200, "Login successful", user, { accessToken });
});
```

### 3. Constants Management
**Location:** `src/constants/`

All configuration values are centralized:
- HTTP status codes
- Error messages
- Validation rules
- JWT configuration
- Environment variables

**Example Usage:**
```javascript
import { HTTP_STATUS, ERROR_MESSAGES, JWT } from "../constants";

if (error) {
  throw new Error(ERROR_MESSAGES.UNAUTHORIZED, { cause: HTTP_STATUS.UNAUTHORIZED });
}
```

### 4. Error Handling
**Location:** `src/middlewares/errorHandler.middleware.js`

Centralized error handling provides:
- Consistent error responses
- Proper error logging
- Type-safe error handling
- Automatic error catching with asyncHandler

**Example Usage:**
```javascript
import { asyncHandler, AppError } from "../middlewares/errorHandler.middleware.js";

export const someController = asyncHandler(async (req, res) => {
  if (!user) {
    throw new AppError("User not found", 404);
  }
});
```

### 5. Response Handler
**Location:** `src/utils/responseHandler.js`

Consistent response formatting across all endpoints:
- Standardized success/error responses
- Helper methods for common status codes
- Consistent structure

**Example Usage:**
```javascript
import { responseHandler } from "../utils";

return responseHandler.success(res, 200, "Success", data);
return responseHandler.created(res, "Created", data);
return responseHandler.notFound(res, "Not found");
```

### 6. Validation
**Location:** `src/validations/`

Request validation using Joi:
- Schema-based validation
- Custom error messages
- Reusable validation schemas

## Best Practices

### Controller Guidelines
- Keep controllers thin (no business logic)
- Use service layer for all operations
- Use asyncHandler to catch errors
- Use responseHandler for consistent responses
- Add JSDoc comments for each function

### Service Layer Guidelines
- Contain all business logic
- Be independent of HTTP layer
- Use models for data access
- Throw AppError for errors
- Be testable and reusable

### Error Handling
- Use AppError class for custom errors
- Use asyncHandler wrapper for async functions
- Log errors appropriately
- Return user-friendly messages
- Hide sensitive info in production

### Database Operations
- Use transactions for multi-step operations
- Handle connection errors
- Use indexes for performance
- Validate data before saving
- Use lean() for read operations when possible

### Security
- Validate all inputs
- Hash passwords with bcrypt
- Use JWT for authentication
- Implement rate limiting
- Sanitize user data in responses
- Use environment variables for secrets

## API Response Format

### Success Response
```json
{
  "status": "Success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "Failure",
  "message": "Error message",
  "errors": { ... }
}
```

## Migration Guide

### Converting Existing Controllers to New Architecture

**Before (Business logic in controller):**
```javascript
export const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  
  if (!user) {
    return res.status(401).json({
      status: FAILURE,
      message: "Invalid credentials",
    });
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  // ... more logic
};
```

**After (Service layer + responseHandler):**
```javascript
import { authService } from "../services";
import { responseHandler } from "../utils";
import { asyncHandler } from "../middlewares/errorHandler.middleware.js";

export const loginUser = asyncHandler(async (req, res) => {
  const credentials = req.body;
  const { user, accessToken } = await authService.loginUser(credentials, req.ip, req.headers["user-agent"]);
  return responseHandler.success(res, 200, "Login successful", user, { accessToken });
});
```

## Performance Optimization

### Database
- Use indexes for frequently queried fields
- Use lean() for read-only operations
- Implement pagination for large datasets
- Use connection pooling
- Cache frequently accessed data

### API
- Implement rate limiting
- Use compression middleware
- Optimize middleware order
- Use async/await properly
- Implement request caching where appropriate

### Code
- Use asyncHandler to avoid try-catch blocks
- Reuse service functions
- Minimize database queries
- Use projection to limit returned fields
- Implement proper logging

## Security Best Practices

### Authentication
- Use strong JWT secrets
- Implement token expiration
- Use httpOnly cookies in production
- Validate tokens on every request
- Implement refresh tokens

### Data Validation
- Validate all inputs
- Sanitize user data
- Use parameterized queries
- Limit request size
- Implement rate limiting

### Environment
- Never commit .env files
- Use environment variables
- Rotate secrets regularly
- Use different configs for environments
- Implement proper CORS

## Testing Strategy

### Unit Tests
- Test service layer functions
- Test utility functions
- Test validation schemas
- Mock database calls

### Integration Tests
- Test API endpoints
- Test database operations
- Test middleware
- Test service integration

### E2E Tests
- Test critical user flows
- Test authentication flow
- Test data consistency
- Test error scenarios

## Monitoring and Logging

### Logging
- Use structured logging
- Log errors with context
- Log performance metrics
- Log security events
- Use different log levels

### Monitoring
- Monitor API response times
- Monitor error rates
- Monitor database performance
- Monitor server health
- Set up alerts

## Future Improvements

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Queue System**: Add Bull/Agenda for background jobs
3. **Rate Limiting**: Implement rate limiting middleware
4. **File Upload**: Add better file upload handling
5. **Search**: Implement Elasticsearch for advanced search
6. **Analytics**: Add analytics tracking
7. **WebSocket**: Real-time features via Socket.io
8. **Testing**: Add comprehensive test coverage
9. **TypeScript**: Migrate to TypeScript for type safety
10. **API Versioning**: Implement proper API versioning

## Contributing Guidelines

When adding new features:
1. Create service layer function for business logic
2. Create controller function for HTTP handling
3. Add validation schema if needed
4. Update documentation
5. Add error handling
6. Write tests for new code
7. Follow existing code patterns
