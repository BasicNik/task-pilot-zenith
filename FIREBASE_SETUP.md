# Firebase Authentication Setup

## Prerequisites

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication in your Firebase project
3. Enable Email/Password authentication method

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
# Replace these values with your actual Firebase project configuration
# You can find these values in your Firebase project settings

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## How to Get Firebase Configuration

1. Go to your Firebase Console
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and choose the web icon
7. Copy the configuration values from the provided config object

## Features

- ✅ Email/Password Authentication
- ✅ User Registration
- ✅ User Login
- ✅ User Logout
- ✅ Persistent Authentication State
- ✅ Form Validation with Zod
- ✅ Loading States
- ✅ Error Handling
- ✅ Responsive UI with shadcn/ui components

## Usage

The authentication system is now integrated into your app. Users can:

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Login with existing credentials
3. **Stay Logged In**: Authentication state persists across browser sessions
4. **Logout**: Securely sign out from the application

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Firebase handles password hashing and security automatically
- All authentication is handled server-side by Firebase

## Next Steps

You can extend this authentication system by:

1. Adding social login providers (Google, Facebook, etc.)
2. Implementing password reset functionality
3. Adding email verification
4. Creating user profiles
5. Adding role-based access control 