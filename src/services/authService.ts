
// Authentication service for CyberGuard AI
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'free' | 'premium';
}

// Simulate a database of users
const mockUsers = [
  {
    id: '1',
    email: 'demo@cyberguard.ai',
    password: 'password123',
    name: 'Demo User',
    subscription: 'free' as const
  },
  {
    id: '2',
    email: 'premium@cyberguard.ai',
    password: 'password123',
    name: 'Premium User',
    subscription: 'premium' as const
  }
];

// Store the current user session
let currentUser: User | null = null;

/**
 * Simulate login functionality
 */
export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Create session user (omitting password)
  const { password: _, ...sessionUser } = user;
  currentUser = sessionUser;
  
  // Store in session storage for persistence
  sessionStorage.setItem('cyberguard_user', JSON.stringify(sessionUser));
  
  return sessionUser;
};

/**
 * Register a new user
 */
export const register = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser = {
    id: `${mockUsers.length + 1}`,
    email,
    password,
    name,
    subscription: 'free' as const
  };
  
  // In a real app, we would save to a database
  mockUsers.push(newUser);
  
  // Create session user (omitting password)
  const { password: _, ...sessionUser } = newUser;
  currentUser = sessionUser;
  
  // Store in session storage for persistence
  sessionStorage.setItem('cyberguard_user', JSON.stringify(sessionUser));
  
  return sessionUser;
};

/**
 * Get the current user from session
 */
export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  const storedUser = sessionStorage.getItem('cyberguard_user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

/**
 * Logout current user
 */
export const logout = (): void => {
  currentUser = null;
  sessionStorage.removeItem('cyberguard_user');
};

/**
 * Check if user has premium subscription
 */
export const isPremiumUser = (): boolean => {
  const user = getCurrentUser();
  return user?.subscription === 'premium';
};
