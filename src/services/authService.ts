
// Authentication service for CyberGuard AI
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'free' | 'premium';
}

// Store the current user session
let currentUser: User | null = null;

// Store OTP codes temporarily
const otpStore: { [email: string]: { code: string; expires: number } } = {};

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to email (simulated)
 */
export const sendOTP = async (email: string): Promise<{ success: boolean; otp?: string }> => {
  console.log(`Sending OTP to ${email}`);
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const otp = generateOTP();
  otpStore[email] = {
    code: otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };
  
  console.log(`OTP for ${email}: ${otp}`);
  
  // Return OTP for demo purposes (in real app, this would be sent via email)
  return { success: true, otp };
};

/**
 * Verify OTP and login
 */
export const verifyOTPAndLogin = async (email: string, otp: string): Promise<User> => {
  console.log(`Verifying OTP for ${email}: ${otp}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const storedOTP = otpStore[email];
  if (!storedOTP) {
    throw new Error('No OTP found for this email. Please request a new one.');
  }
  
  if (Date.now() > storedOTP.expires) {
    delete otpStore[email];
    throw new Error('OTP has expired. Please request a new one.');
  }
  
  if (storedOTP.code !== otp) {
    throw new Error('Invalid OTP. Please check and try again.');
  }
  
  // Clean up used OTP
  delete otpStore[email];
  
  // Create user from email
  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    subscription: 'premium' // Give all users premium for demo
  };
  
  currentUser = newUser;
  sessionStorage.setItem('cyberguard_user', JSON.stringify(newUser));
  console.log(`Login successful for ${email}, subscription: ${newUser.subscription}`);
  
  return newUser;
};

/**
 * Simulate login functionality (for backward compatibility)
 */
export const login = async (email: string, password: string): Promise<User> => {
  console.log(`Attempting login for ${email}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const sessionUser: User = {
    id: Date.now().toString(),
    email,
    name,
    subscription: 'premium'
  };
  
  currentUser = sessionUser;
  sessionStorage.setItem('cyberguard_user', JSON.stringify(sessionUser));
  console.log(`Login successful for ${email}, subscription: ${sessionUser.subscription}`);
  
  return sessionUser;
};

/**
 * Google login simulation
 */
export const googleLogin = async (): Promise<User> => {
  console.log('Attempting Google login');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate getting user info from Google
  const mockGoogleUser: User = {
    id: 'google-' + Date.now(),
    email: 'user@gmail.com',
    name: 'Google User',
    subscription: 'premium'
  };
  
  currentUser = mockGoogleUser;
  sessionStorage.setItem('cyberguard_user', JSON.stringify(mockGoogleUser));
  console.log(`Google login successful for ${mockGoogleUser.email}`);
  
  return mockGoogleUser;
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
