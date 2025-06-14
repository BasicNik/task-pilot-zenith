# TaskPilot Zenith

A modern task management application built with React, TypeScript, and Firebase authentication.

## Features

- ✅ **Firebase Authentication** - Secure login and signup with email/password
- ✅ **Task Management** - Create, edit, delete, and organize tasks
- ✅ **Dashboard** - Visual overview of your productivity
- ✅ **Modern UI** - Built with shadcn/ui components
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Form Validation** - Robust form validation with Zod
- ✅ **Loading States** - Smooth user experience with loading indicators
- ✅ **Error Handling** - Comprehensive error handling and user feedback

## Firebase Setup

### Prerequisites

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication in your Firebase project
3. Enable Email/Password authentication method

### Environment Variables

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

### How to Get Firebase Configuration

1. Go to your Firebase Console
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and choose the web icon
7. Copy the configuration values from the provided config object

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-pilot-zenith
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Follow the Firebase setup instructions above
   - Create a `.env` file with your Firebase configuration

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Authentication Features

- **User Registration**: Create new accounts with email and password
- **User Login**: Sign in with existing credentials
- **Persistent Sessions**: Stay logged in across browser sessions
- **Secure Logout**: Safely sign out from the application
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Visual feedback during authentication processes

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Auth.tsx        # Authentication component
│   ├── Navbar.tsx      # Navigation component
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Firebase authentication hook
│   └── use-toast.ts    # Toast notification hook
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   └── utils.ts        # Utility functions
├── pages/              # Page components
│   ├── Index.tsx       # Main application page
│   └── NotFound.tsx    # 404 page
└── App.tsx             # Main application component
```

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Firebase handles password hashing and security automatically
- All authentication is handled server-side by Firebase

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Firebase** - Authentication and backend services
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
