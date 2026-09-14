import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerProfile, FarmerOnboardingData } from '../types';
import { authService, AuthSession, DEFAULT_DEMO_FARMER } from '../services/authService';

interface AuthContextType {
  farmer: FarmerProfile | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingUserId: string | null;
  setPendingUserId: (id: string | null) => void;
  login: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => Promise<boolean>;
  signUp: (identifier: string, pass: string) => Promise<{ success: boolean; userId?: string; error?: string }>;
  completeOnboarding: (data: FarmerOnboardingData) => Promise<{ success: boolean; error?: string }>;
  register: (profile: Omit<FarmerProfile, 'id' | 'createdAt'>) => Promise<boolean>;
  updateProfile: (updated: Partial<FarmerProfile>) => void;
  updateFarmer: (updated: Partial<FarmerProfile>) => void; // Backward compatibility alias
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
    return sessionStorage.getItem('smart_crop_pending_onboarding_v2');
  });

  // Keep farmer and session synchronized
  useEffect(() => {
    if (session) {
      setFarmer(session.profile);
    } else {
      setFarmer(null);
    }
  }, [session]);

  const login = async (
    identifier: string,
    pass: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
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

  const signUp = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; userId?: string; error?: string }> => {
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

  const completeOnboarding = async (
    data: FarmerOnboardingData
  ): Promise<{ success: boolean; error?: string }> => {
    if (!pendingUserId) {
      return { success: false, error: 'NO_PENDING_REGISTRATION' };
    }
    setIsLoading(true);
    try {
      const result = await authService.completeOnboarding(pendingUserId, data);
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

  // Backward-compatible register method
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

  const updateProfile = (updated: Partial<FarmerProfile>) => {
    if (!farmer) return;
    const activeUserId = session ? session.userId : farmer.id;
    const result = authService.updateProfile(activeUserId, updated);
    if (result) {
      setFarmer(result);
      if (session) {
        setSession({ ...session, profile: result });
      }
    } else {
      setFarmer((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const requestPasswordReset = async (
    identifier: string
  ): Promise<{ success: boolean; otp?: string; error?: string }> => {
    return authService.requestPasswordReset(identifier);
  };

  const resetPasswordWithOtp = async (
    identifier: string,
    otp: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
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
        login,
        loginAsDemo,
        signUp,
        completeOnboarding,
        register,
        updateProfile,
        updateFarmer: updateProfile, // backward compatible alias
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
