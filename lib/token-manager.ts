import { User } from 'firebase/auth';

const TOKEN_KEY = 'legal_ai_auth_token';
const TOKEN_EXPIRY_KEY = 'legal_ai_auth_token_expiry';

// Store token in localStorage with expiration time (1 hour)
export const storeToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TOKEN_KEY, token);
    // Set expiry to 55 minutes (slightly less than Firebase's 1 hour default)
    const expiryTime = Date.now() + 55 * 60 * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

// Get token from localStorage
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiryTime) return null;
    
    // Check if token has expired
    if (Date.now() > parseInt(expiryTime, 10)) {
      clearStoredToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Clear token from localStorage
export const clearStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

// Update stored token when user refreshes their token
export const refreshStoredToken = async (user: User): Promise<string | null> => {
  if (!user) return null;
  
  try {
    const newToken = await user.getIdToken(true);
    storeToken(newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing auth token:', error);
    return null;
  }
}; 