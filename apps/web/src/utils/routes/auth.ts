import { api } from '../api';
import { urls } from '../constants';
import { config } from '../config';

export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// Trigger email OTP dispatch
export const sendOtp = async (email: string) => {
  return api<{ registered: boolean; temp_user_id?: string }>('POST', urls.v1.auth.sendOtp, {
    email,
  });
};

// Verify email OTP
export const verifyOtp = async (email: string, otpCode: string) => {
  return api<{
    registered: boolean;
    session_token?: string;
    temp_user_id?: string;
    user?: User;
  }>('POST', urls.v1.auth.verifyOtp, {
    email,
    otp: otpCode,
  });
};

// Complete new user registration onboarding
export const completeRegister = async (tempUserId: string, username: string) => {
  return api<{ session_token: string; expires_at: string; user?: User }>('POST', urls.v1.auth.completeRegister, {
    temp_user_id: tempUserId,
    username,
  });
};

// Initiate Google OAuth browser redirect flow
export const triggerGoogleLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = `${config.BASE_URL}${urls.v1.auth.googleLogin}`;
  }
};

// Get active logged-in user profile
export const getMe = async () => {
  return api<User>('GET', urls.v1.users.me);
};

// Logout and clear active session
export const logout = async () => {
  return api<null>('POST', urls.v1.auth.logout);
};
