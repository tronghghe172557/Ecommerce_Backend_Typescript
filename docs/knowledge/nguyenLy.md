# Express Error Handling Flow

## Overview
This document explains the error handling flow in our Express.js application, particularly focusing on how errors are caught, processed, and responded to clients.

## Components

### 1. Error Throwing in Services
```typescript
// In access.service.ts
throw new BadRequestResponse('Email already exists');
```
When an error occurs, we throw custom error objects that extend from our base error classes.

### 2. Express Error Middleware
```typescript
// In server.ts
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = 500;
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error'
  });
});
```

### 3. Async Handler Wrapper
```typescript
// In routes/access/index.ts
router.post('/shop/signUp', asyncHandler(AccessController.signUp));
```

## Error Flow Diagram
```mermaid
graph LR
    A[Client Request] --> B[Route Handler]
    B --> C[Controller]
    C --> D[Service Layer]
    D --> E[Error Thrown]
    E --> F[AsyncHandler Catches]
    F --> G[Error Middleware]
    G --> H[Client Response]
```

## Process Explanation

1. **Initial Error**
   - Error occurs in service layer
   - Custom error object is thrown

2. **AsyncHandler**
   - Wraps async route handlers
   - Catches any thrown errors
   - Passes errors to Express error middleware

3. **Error Middleware**
   - Receives the error
   - Processes error details
   - Formats error response
   - Sends to client

4. **Response Format**
```json
{
  "status": "error",
  "code": 500,
  "message": "Error message here",
  "stack": "Error stack trace (in development)"
}
```

## Best Practices

1. Always use `asyncHandler` for async routes
2. Throw custom error objects with proper status codes
3. Keep error messages clear and consistent
4. Use appropriate HTTP status codes
5. Handle both sync and async errors

## Common Error Types
- BadRequestResponse (400)
- UnauthorizedResponse (401)
- ForbiddenResponse (403)
- NotFoundResponse (404)
- InternalServerResponse (500)