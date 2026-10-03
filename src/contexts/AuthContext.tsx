import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { FarmerProfile, FarmerOnboardingData } from '../types';
import { authService, AuthSession } from '../services/authService';
import { firestoreService } from '../services/firestoreService';

interface AuthContextType {
  farmer: FarmerProfile | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingUserId: string | null;
  setPendingUserId: (id: string | null) => void;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; otp?: string; phone?: string; error?: string }>;
  verifyOtp: (phone: string, otp: string, name?: string, district?: string, village?: string) => Promise<{ success: boolean; error?: string }>;
  login: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => Promise<boolean>;
  signUp: (identifier: string, pass: string) => Promise<{ success: boolean; userId?: string; error?: string }>;
  completeOnboarding: (data: FarmerOnboardingData) => Promise<{ success: boolean; error?: string }>;
  register: (profile: Omit<FarmerProfile, 'id' | 'createdAt'>) => Promise<boolean>;
  updateProfile: (updated: Partial<FarmerProfile>) => Promise<void>;
  updateFarmer: (updated: Partial<FarmerProfile>) => Promise<void>;
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; otp?: string; error?: string }>;
  resetPasswordWithOtp: (identifier: string, otp: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetToDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    return authService.getCurrentSession();
  });
  const [farmer, setFarmer] = useState<FarmerProfile | null>(() => {
    const existing = authService.getCurrentSession();
    return existing ? existing.profile : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(() => {
    return sessionStorage.getItem('smart_crop_pending_onboarding_v4');
  });

  // Real-time Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If current session does not match this firebaseUser, load or create their profile
        if (!session || session.userId !== firebaseUser.uid) {
          const profile = await firestoreService.getUserProfile(firebaseUser.uid);
          if (profile) {
            const token = await firebaseUser.getIdToken();
            const newSession: AuthSession = {
              userId: firebaseUser.uid,
              identifier: firebaseUser.email || firebaseUser.uid,
              rememberMe: true,
              token,
              profile,
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            };
            setSession(newSession);
            setFarmer(profile);
            authService.setSession(newSession);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [session]);

  // Synchronize farmer with session
  useEffect(() => {
    if (session) {
      setFarmer(session.profile);
    } else {
      setFarmer(null);
    }
  }, [session]);

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res.success && res.session) {
        setSession(res.session);
        setFarmer(res.session.profile);
        return { success: true };
      }
      return { success: false, error: res.error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phone: string) => {
    setIsLoading(true);
    try {
      return await authService.sendOtp(phone);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string, name?: string, district?: string, village?: string) => {
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(phone, otp, name, district, village);
      if (res.success && res.session) {
        setSession(res.session);
        setFarmer(res.session.profile);
        return { success: true };
      }
      return { success: false, error: res.error };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, pass: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      const result = await authService.login(identifier, pass, rememberMe);
      if (result.success && result.session) {
        setSession(result.session);
        setFarmer(result.session.profile);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (e: any) {
      return { success: false, error: e.message || 'LOGIN_FAILED' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const demoSession = await authService.loginAsDemo();
      setSession(demoSession);
      setFarmer(demoSession.profile);
      return true;
    } catch (e) {
      console.error('Demo login failed:', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (identifier: string, pass: string) => {
    setIsLoading(true);
    try {
      const result = await authService.signUp(identifier, pass);
      if (result.success && result.userId) {
        setPendingUserId(result.userId);
        return { success: true, userId: result.userId };
      }
      return { success: false, error: result.error };
    } catch (e: any) {
      return { success: false, error: e.message || 'SIGNUP_FAILED' };
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (data: FarmerOnboardingData) => {
    if (!pendingUserId && !farmer?.id) {
      return { success: false, error: 'NO_PENDING_REGISTRATION' };
    }
    const targetId = pendingUserId || farmer!.id;
    setIsLoading(true);
    try {
      const result = await authService.completeOnboarding(targetId, data);
      if (result.success && result.session) {
        setSession(result.session);
        setFarmer(result.session.profile);
        setPendingUserId(null);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (e: any) {
      return { success: false, error: e.message || 'ONBOARDING_FAILED' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (profileData: Omit<FarmerProfile, 'id' | 'createdAt'>): Promise<boolean> => {
    const fakeId = profileData.mobile || 'farmer_' + Date.now();
    const result = await signUp(fakeId, 'password123');
    if (result.success && result.userId) {
      const onboard = await completeOnboarding({
        name: profileData.name,
        mobile: profileData.mobile,
        district: profileData.district,
        village: profileData.village,
        farmSizeAcres: profileData.farmSizeAcres,
        soilType: profileData.soilType,
        irrigationType: profileData.irrigationType,
        mainCrop: profileData.mainCrops[0] || 'Paddy',
        preferredLanguage: profileData.preferredLanguage,
      });
      return onboard.success;
    }
    return false;
  };

  const updateProfile = async (updated: Partial<FarmerProfile>) => {
    if (!farmer) return;
    const activeUserId = session ? session.userId : farmer.id;
    const result = await authService.updateProfile(activeUserId, updated);
    if (result) {
      setFarmer(result);
      if (session) {
        setSession({ ...session, profile: result });
      }
    } else {
      setFarmer((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const requestPasswordReset = async (identifier: string) => {
    return authService.requestPasswordReset(identifier);
  };

  const resetPasswordWithOtp = async (identifier: string, otp: string, newPass: string) => {
    return authService.resetPassword(identifier, otp, newPass);
  };

  const logout = () => {
    authService.clearSession();
    setSession(null);
    setFarmer(null);
    setPendingUserId(null);
  };

  const resetToDemo = () => {
    loginAsDemo();
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        session,
        isAuthenticated: !!farmer,
        isLoading,
        pendingUserId,
        setPendingUserId,
        signInWithGoogle,
        sendOtp,
        verifyOtp,
        login,
        loginAsDemo,
        signUp,
        completeOnboarding,
        register,
        updateProfile,
        updateFarmer: updateProfile,
        requestPasswordReset,
        resetPasswordWithOtp,
        logout,
        resetToDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
