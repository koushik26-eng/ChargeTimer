import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [otpId, setOtpId] = useState(null);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setIsLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });

    return () => unsubscribe();
  }, []);

  const requestMagicLink = async (email) => {
    try {
      try {
        const tempPassword = crypto.randomUUID();
        await pb.collection('users').create({
          email: email,
          password: tempPassword,
          passwordConfirm: tempPassword,
        }, { $autoCancel: false });
      } catch (e) {
        // User already exists - continue
      }

      const result = await pb.collection('users').requestOTP(email, { $autoCancel: false });
      setOtpId(result.otpId);
      return { success: true, otpId: result.otpId };
    } catch (error) {
      console.error('Magic link request failed:', error);
      throw new Error(error.message || 'Failed to send magic link');
    }
  };

  const verifyMagicLink = async (code) => {
    try {
      if (!otpId) {
        throw new Error('No OTP session found. Please request a new code.');
      }

      const authData = await pb.collection('users').authWithOTP(otpId, code, { $autoCancel: false });
      setCurrentUser(authData.record);
      setOtpId(null);
      return { success: true, user: authData.record };
    } catch (error) {
      console.error('Magic link verification failed:', error);
      throw new Error(error.message || 'Invalid or expired code');
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setOtpId(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    otpId,
    requestMagicLink,
    verifyMagicLink,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};