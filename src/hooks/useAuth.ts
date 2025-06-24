import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Custom user interface matching your Firebase structure
export interface CustomUser {
  user_id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  created_at: any; // Firestore timestamp
  last_login: any; // Firestore timestamp
  password_hash?: string; // Not stored in frontend for security
  avatar_url?: string; // Optional avatar URL
}

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not configured. Please check your Firebase project settings.';
    case 'auth/invalid-api-key':
      return 'Invalid Firebase API key. Please check your configuration.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please log in again.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    default:
      return `Authentication error: ${errorCode}`;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Firebase auth is available
  const isFirebaseAvailable = auth !== null;

  // Fetch custom user data from Firestore
  const fetchCustomUserData = async (uid: string): Promise<CustomUser | null> => {
    if (!db) {
      console.log('📝 No Firestore available, skipping custom user data fetch');
      return null;
    }
    
    try {
      console.log(`🔍 Fetching custom user data for UID: ${uid}`);
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as CustomUser;
        console.log('✅ Custom user data fetched successfully:', userData);
        return userData;
      } else {
        console.log('⚠️ No custom user data found for UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      return null;
    }
  };

  // Create custom user data in Firestore
  const createCustomUserData = async (uid: string, email: string, username: string): Promise<CustomUser> => {
    if (!db) throw new Error('Firestore not available');
    
    console.log(`📝 Creating custom user data for UID: ${uid}, Email: ${email}, Username: ${username}`);
    
    const userData: Omit<CustomUser, 'user_id'> = {
      username,
      email,
      role: 'user',
      is_active: true,
      is_verified: false,
      created_at: serverTimestamp(),
      last_login: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', uid), userData);
    console.log('✅ Custom user data created successfully');
    
    return {
      user_id: uid,
      ...userData,
    };
  };

  // Update last login
  const updateLastLogin = async (uid: string) => {
    if (!db) {
      console.log('📝 No Firestore available, skipping last login update');
      return;
    }
    
    try {
      console.log(`🕒 Updating last login for UID: ${uid}`);
      await setDoc(doc(db, 'users', uid), {
        last_login: serverTimestamp()
      }, { merge: true });
      console.log('✅ Last login updated successfully');
    } catch (error) {
      console.error('❌ Error updating last login:', error);
    }
  };

  useEffect(() => {
    if (isFirebaseAvailable) {
      console.log('👀 Setting up Firebase Auth state listener...');
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('🔄 Auth state changed:', user ? `User logged in (${user.email})` : 'User logged out');
        setUser(user);
        
        if (user) {
          // Fetch custom user data
          const customData = await fetchCustomUserData(user.uid);
          setCustomUser(customData);
          
          // Update last login
          await updateLastLogin(user.uid);
        } else {
          setCustomUser(null);
        }
        
        setLoading(false);
      });

      return unsubscribe;
    } else {
      console.log('⚠️ Firebase Auth not available, running in demo mode');
      setLoading(false);
    }
  }, [isFirebaseAvailable]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log(`🔐 Attempting login for email: ${email}`);
      
      if (!isFirebaseAvailable) {
        // Demo mode - simulate login
        console.log('🎭 Demo mode: Simulating login...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const demoUser = {
          uid: 'demo-user-id',
          email: email,
          displayName: email.split('@')[0],
        } as User;
        
        const demoCustomUser: CustomUser = {
          user_id: 'demo-user-id',
          username: email.split('@')[0],
          email: email,
          role: 'user',
          is_active: true,
          is_verified: true,
          created_at: new Date(),
          last_login: new Date(),
        };
        
        setUser(demoUser);
        setCustomUser(demoCustomUser);
        console.log('✅ Demo login successful');
        return demoUser;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase login successful');
      
      // Fetch custom user data
      const customData = await fetchCustomUserData(userCredential.user.uid);
      setCustomUser(customData);
      
      // Update last login
      await updateLastLogin(userCredential.user.uid);
      
      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      const userFriendlyError = getErrorMessage(error.code);
      setError(userFriendlyError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log(`📝 Attempting signup for email: ${email}, username: ${username}`);
      
      if (!isFirebaseAvailable) {
        // Demo mode - simulate signup
        console.log('🎭 Demo mode: Simulating signup...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const demoUser = {
          uid: 'demo-user-id',
          email: email,
          displayName: username,
        } as User;
        
        const demoCustomUser: CustomUser = {
          user_id: 'demo-user-id',
          username: username,
          email: email,
          role: 'user',
          is_active: true,
          is_verified: false,
          created_at: new Date(),
          last_login: new Date(),
        };
        
        setUser(demoUser);
        setCustomUser(demoCustomUser);
        console.log('✅ Demo signup successful');
        return demoUser;
      }

      console.log('🔧 Checking Firebase Auth availability...');
      if (!auth) {
        throw new Error('Firebase Authentication is not available');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase signup successful');
      
      // Create custom user data
      const customData = await createCustomUserData(userCredential.user.uid, email, username);
      setCustomUser(customData);
      
      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      const userFriendlyError = getErrorMessage(error.code);
      setError(userFriendlyError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      
      console.log('🚪 Attempting logout...');
      
      if (!isFirebaseAvailable) {
        // Demo mode - simulate logout
        console.log('🎭 Demo mode: Simulating logout...');
        setUser(null);
        setCustomUser(null);
        console.log('✅ Demo logout successful');
        return;
      }

      await signOut(auth);
      setCustomUser(null);
      console.log('✅ Firebase logout successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      const userFriendlyError = getErrorMessage(error.code);
      setError(userFriendlyError);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log(`🔑 Attempting password reset for email: ${email}`);
      
      if (!isFirebaseAvailable) {
        // Demo mode - simulate password reset
        console.log('🎭 Demo mode: Simulating password reset...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Demo password reset email sent');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent successfully');
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      const userFriendlyError = getErrorMessage(error.code);
      setError(userFriendlyError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      if (!isFirebaseAvailable) {
        // Demo mode: simulate Google login
        await new Promise(resolve => setTimeout(resolve, 1000));
        const demoUser = {
          uid: 'demo-google-user-id',
          email: 'demo@google.com',
          displayName: 'Demo Google User',
        } as User;
        const demoCustomUser: CustomUser = {
          user_id: 'demo-google-user-id',
          username: 'Demo Google User',
          email: 'demo@google.com',
          role: 'user',
          is_active: true,
          is_verified: true,
          created_at: new Date(),
          last_login: new Date(),
        };
        setUser(demoUser);
        setCustomUser(demoCustomUser);
        return demoUser;
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Fetch or create custom user data
      let customData = await fetchCustomUserData(user.uid);
      if (!customData) {
        customData = await createCustomUserData(user.uid, user.email || '', user.displayName || '');
      }
      setCustomUser(customData);
      await updateLastLogin(user.uid);
      return user;
    } catch (error: any) {
      setError(getErrorMessage(error.code));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    customUser,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    signInWithGoogle,
    isDemoMode: !isFirebaseAvailable
  };
}; 