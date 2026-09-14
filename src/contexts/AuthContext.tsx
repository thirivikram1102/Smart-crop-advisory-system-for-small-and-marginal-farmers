import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerProfile } from '../types';

interface AuthContextType {
  farmer: FarmerProfile | null;
  isAuthenticated: boolean;
  login: (mobileOrEmail: string, pass: string) => Promise<boolean>;
  register: (profile: Omit<FarmerProfile, 'id' | 'createdAt'>) => Promise<boolean>;
  updateProfile: (updated: Partial<FarmerProfile>) => void;
  logout: () => void;
  resetToDemo: () => void;
}

const DEFAULT_DEMO_FARMER: FarmerProfile = {
  id: 'farmer-thanjavur-01',
  name: 'Ravi Kumar (ரவி குமார்)',
  mobile: '9842176540',
  email: 'ravi.thanjavur.farmer@gmail.com',
  state: 'Tamil Nadu',
  district: 'Thanjavur',
  village: 'Thiruvaiyaru (திருவையாறு)',
  farmSizeAcres: 2.5,
  soilType: 'Clay Loam (களிமண் கலந்த வண்டல் மண்)',
  irrigationType: 'Borewell & Canal (ஆழ்துளை & பாசன வாய்க்கால்)',
  mainCrops: ['Paddy (சம்பா நெல் - CR 1009)', 'Blackgram (உளுந்து)'],
  preferredLanguage: 'ta',
  createdAt: '2026-01-10',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(() => {
    const saved = localStorage.getItem('smart_crop_farmer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved farmer profile', e);
      }
    }
    return DEFAULT_DEMO_FARMER;
  });

  useEffect(() => {
    if (farmer) {
      localStorage.setItem('smart_crop_farmer', JSON.stringify(farmer));
    } else {
      localStorage.removeItem('smart_crop_farmer');
    }
  }, [farmer]);

  const login = async (mobileOrEmail: string, _pass: string): Promise<boolean> => {
    // In prototype, simulate fast successful authentication
    if (farmer && (farmer.mobile === mobileOrEmail || farmer.email === mobileOrEmail)) {
      return true;
    }
    const newProfile: FarmerProfile = {
      ...DEFAULT_DEMO_FARMER,
      name: mobileOrEmail.includes('@') ? mobileOrEmail.split('@')[0] : 'Farmer ' + mobileOrEmail.slice(-4),
      mobile: mobileOrEmail.includes('@') ? '9876543210' : mobileOrEmail,
    };
    setFarmer(newProfile);
    return true;
  };

  const register = async (profileData: Omit<FarmerProfile, 'id' | 'createdAt'>): Promise<boolean> => {
    const newFarmer: FarmerProfile = {
      ...profileData,
      id: 'farmer-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFarmer(newFarmer);
    return true;
  };

  const updateProfile = (updated: Partial<FarmerProfile>) => {
    setFarmer((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const logout = () => {
    setFarmer(null);
  };

  const resetToDemo = () => {
    setFarmer(DEFAULT_DEMO_FARMER);
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        isAuthenticated: !!farmer,
        login,
        register,
        updateProfile,
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
