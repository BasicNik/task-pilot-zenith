import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP327VcUgThyUd-ygqOzPQWEovJ6ngTM4",
  authDomain: "taskpilot-141b1.firebaseapp.com",
  projectId: "taskpilot-141b1",
  storageBucket: "taskpilot-141b1.firebasestorage.app",
  messagingSenderId: "1035758698099",
  appId: "1:1035758698099:web:ff7b783c99cbb80a3eb406",
  measurementId: "G-LHSQT08R5V"
};

// Validate Firebase configuration
console.log('🔍 Validating Firebase configuration...');
console.log('📋 Config details:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? '✅ Present' : '❌ Missing',
  appId: firebaseConfig.appId ? '✅ Present' : '❌ Missing'
});

// Check if we have real Firebase credentials
const hasRealCredentials = firebaseConfig.apiKey && 
                          firebaseConfig.apiKey !== "your_api_key_here" &&
                          firebaseConfig.projectId === "taskpilot-141b1";

console.log('🔐 Has real credentials:', hasRealCredentials);

// Initialize Firebase only if we have real credentials
let app;
let auth;
let db;
let analytics;

if (hasRealCredentials) {
  try {
    console.log('🚀 Initializing Firebase with real credentials...');
    
    // Initialize the Firebase app
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
    
    // Initialize Auth with error handling
    try {
      auth = getAuth(app);
      console.log('✅ Firebase Auth initialized successfully');
      console.log('🔗 Auth domain:', auth.config.authDomain);
    } catch (authError) {
      console.error('❌ Firebase Auth initialization failed:', authError);
      throw authError;
    }
    
    // Initialize Firestore
    try {
      db = getFirestore(app);
      console.log('✅ Firestore initialized successfully');
    } catch (firestoreError) {
      console.error('❌ Firestore initialization failed:', firestoreError);
      // Don't throw here, as Firestore is optional for auth
    }
    
    // Initialize Analytics (only in browser environment)
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized successfully');
      } catch (analyticsError) {
        console.warn('⚠️ Firebase Analytics initialization failed:', analyticsError);
      }
    }
    
    console.log('🎉 Firebase setup complete! Ready to use.');
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Fallback to demo mode
    app = null;
    auth = null;
    db = null;
    analytics = null;
  }
} else {
  console.warn('⚠️ Firebase credentials not found or invalid. Running in demo mode.');
  app = null;
  auth = null;
  db = null;
  analytics = null;
}

export { auth, db, analytics };
export default app; 