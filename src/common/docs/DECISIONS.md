# Common Module Decisions

## 1. Mobile-First Atomic Components
- Touch-friendly minimum height targets (44px) for inputs, selects, and buttons.
- BottomSheet optimized for mobile slide-up interaction with auto backdrop lock.
- Modal designed for centered desktop/tablet popups.

## 2. Notification System
- Standalone `ToastProvider` with `useToast()` hook to avoid heavy external notification libraries.
