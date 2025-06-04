
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
    subscription: 'premium' as const // Make demo user premium for testing
  },
  {
    id: '2',
    email: 'premium@cyberguard.ai',
    password: 'password123',
    name: 'Premium User',
    subscription: 'premium' as const
  },
  {
    id: '3',
    email: 'free@cyberguard.ai',
    password: 'password123',
    name: 'Free User',
    subscription: 'free' as const
  }
];

// Store the current user session
let currentUser: User | null = null;

/**
 * Simulate login functionality
 */
export const login = async (email: string, password: string): Promise<User> => {
  console.log(`Attempting login for ${email}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const { password: _, ...sessionUser } = user;
  currentUser = sessionUser;
  
  sessionStorage.setItem('cyberguard_user', JSON.stringify(sessionUser));
  console.log(`Login successful for ${email}, subscription: ${sessionUser.subscription}`);
  
  return sessionUser;
};

/**
 * Register a new user
 */
export const register = async (email: string, password: string, name: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (mockUsers.some(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    id: `${mockUsers.length + 1}`,
    email,
    password,
    name,
    subscription: 'premium' as const // New users get premium for demo
  };
  
  mockUsers.push(newUser);
  
  const { password: _, ...sessionUser } = newUser;
  currentUser = sessionUser;
  
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
  console.log('User logged out');
};

/**
 * Check if user has premium subscription
 */
export const isPremiumUser = (): boolean => {
  const user = getCurrentUser();
  const isPremium = user?.subscription === 'premium';
  console.log(`Premium check: ${isPremium} for user ${user?.email || 'none'}`);
  return isPremium;
};

/**
 * Upgrade user to premium (for demo purposes)
 */
export const upgradeToPremium = (): void => {
  const user = getCurrentUser();
  if (user) {
    user.subscription = 'premium';
    currentUser = user;
    sessionStorage.setItem('cyberguard_user', JSON.stringify(user));
    console.log(`User ${user.email} upgraded to premium`);
    toast.success('Upgraded to Premium!', {
      description: 'You now have access to all Pro features'
    });
  }
};
