# Frontend Architecture Documentation

## Overview
This document outlines the scalable architecture pattern used in the Zivora frontend application.

## Project Structure

```
frontend/src/
├── assets/              # Static assets (images, icons, fonts)
├── components/          # Reusable UI components
│   └── ui/             # Base UI components (buttons, inputs, etc.)
├── constants/          # Application-wide constants
├── context/            # React Context providers (Redux, Socket, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Third-party library configurations
├── pages/              # Page components
│   └── layouts/       # Layout components (AuthLayout, MainLayout)
├── services/           # API service layer
├── utils/              # Utility functions (validation, error handling, etc.)
├── App.jsx             # Main application component with routing
├── index.css           # Global styles
└── main.jsx            # Application entry point
```

## Key Architectural Decisions

### 1. Service Layer Pattern
**Location:** `src/services/`

All API calls are centralized in the service layer. This provides:
- Single source of truth for API endpoints
- Easy testing and mocking
- Consistent error handling
- Reusability across components

**Example Usage:**
```javascript
import { authService } from "../services";

const response = await authService.login(credentials);
```

### 2. Custom Hooks
**Location:** `src/hooks/`

Reusable logic is extracted into custom hooks:
- `useAuth` - Authentication operations
- `useForm` - Form state management
- `useDebounce` - Debounced values
- `useLocalStorage` - Local storage management

**Example Usage:**
```javascript
import { useAuth } from "../hooks";

const { login, logout, loading } = useAuth();
```

### 3. Constants Management
**Location:** `src/constants/`

All magic numbers, strings, and configuration values are centralized:
- Validation rules
- API status codes
- Cookie configurations
- Route paths
- Error messages

**Example Usage:**
```javascript
import { VALIDATION, ROUTES } from "../constants";

if (username.length < VALIDATION.USERNAME.MIN_LENGTH) {
  // handle error
}
```

### 4. Error Handling
**Location:** `src/utils/errorHandler.js`

Centralized error handling provides:
- Consistent error messages
- Proper error logging
- User-friendly error display
- Type-safe error objects

**Example Usage:**
```javascript
import { handleApiError, showErrorToast } from "../utils/errorHandler";

try {
  await someApiCall();
} catch (error) {
  const { message } = handleApiError(error);
  showErrorToast(error, toast);
}
```

### 5. Validation
**Location:** `src/utils/validation.js`

Client-side validation matches backend validation:
- Consistent validation rules
- Early error detection
- Better user experience
- Reduced server load

## Best Practices

### Component Organization
- **UI Components** (`components/ui/`): Base, reusable components without business logic
- **Feature Components** (`components/`): Components with specific business logic
- **Page Components** (`pages/`): Top-level components for routes
- **Layout Components** (`pages/layouts/`): Page layout wrappers

### State Management
- **Global State**: Redux for user authentication and global app state
- **Local State**: React useState for component-specific state
- **Server State**: Custom hooks for API data fetching
- **Form State**: useForm hook for complex forms

### API Calls
- Always use service layer functions
- Never call axios directly in components
- Handle errors consistently
- Use proper loading states

### Code Style
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use meaningful variable names
- Add JSDoc comments for complex functions

## Migration Guide

### Converting Existing Pages to New Architecture

**Before (Direct API calls):**
```javascript
import axios from "axios";
import { authRoute } from "../utils/routes";

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${authRoute}/login`, payload);
    // handle success
  } catch (err) {
    // handle error
  }
};
```

**After (Service Layer + Hooks):**
```javascript
import { useAuth } from "../hooks";

const LoginPage = () => {
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(payload, navigate);
    } catch (err) {
      // error handled by hook
    }
  };
};
```

## Performance Optimization

### Code Splitting
- Use React.lazy() for route-based code splitting
- Load heavy components only when needed

### Memoization
- Use React.memo for expensive components
- Use useMemo/useCallback for expensive computations
- Debounce search inputs and API calls

### Bundle Size
- Tree-shake unused code
- Optimize images and assets
- Use lazy loading for images

## Security

### Authentication
- Store tokens in httpOnly cookies (backend)
- Use CSRF protection
- Validate tokens on every request

### Data Validation
- Validate all user inputs
- Sanitize data before display
- Use Content Security Policy

### API Security
- Never expose API keys in frontend
- Use environment variables for sensitive data
- Implement rate limiting

## Testing Strategy

### Unit Tests
- Test utility functions
- Test custom hooks
- Test service layer functions

### Integration Tests
- Test component interactions
- Test API integrations
- Test user flows

### E2E Tests
- Test critical user journeys
- Test authentication flow
- Test form submissions

## Future Improvements

1. **TypeScript Migration**: Add type safety across the application
2. **State Management**: Consider RTK Query for server state
3. **Internationalization**: Add i18n support for multiple languages
4. **Analytics**: Add tracking for user behavior
5. **Performance Monitoring**: Add performance monitoring tools
6. **Accessibility**: Improve WCAG compliance
7. **PWA**: Convert to Progressive Web App
8. **Testing**: Add comprehensive test coverage

## Contributing Guidelines

When adding new features:
1. Create service layer function in appropriate service file
2. Create custom hook if logic is reusable
3. Add constants if needed
4. Update documentation
5. Follow existing code patterns
6. Write tests for new code
