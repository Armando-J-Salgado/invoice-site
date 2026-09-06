# Auth Context Decisions

## 1. Local Storage Token Persistence
- Stores JWT access token and user metadata in browser `localStorage`.
- Auto-injects Authorization Bearer header into every API call.
- Handles 401 response gracefully with auto session wipe and redirect.

## 2. Zustand State Management
- Simple, unbloated state containing authentication status, current user, and login/logout actions.
