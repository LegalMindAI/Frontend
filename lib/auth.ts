import { auth, googleProvider } from './firebase';
import {
  User,
  UserCredential,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { clearStoredToken } from './token-manager';

export async function signUpWithEmail(email: string, password: string, name: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function resendEmailVerification(user: User): Promise<void> {
  await sendEmailVerification(user);
}

export async function logout(): Promise<void> {
  clearStoredToken();
  await signOut(auth);
}

export function onAuthStateChangedListener(callback: (user: User | null) => void): () => void {
  return auth.onAuthStateChanged(callback);
} 