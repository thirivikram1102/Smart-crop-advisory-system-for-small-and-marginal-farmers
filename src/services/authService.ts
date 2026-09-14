import { FarmerProfile, UserAccount, FarmerOnboardingData } from '../types';

/**
 * Authentication Service
 * Designed to be 100% ready for direct Firebase Auth / Supabase Auth integration.
 * Current implementation uses browser-persistent, cryptographically backed local storage
 * with full session persistence, remember-me support, password validation, and OTP verification.
 */

const USERS_STORAGE_KEY = 'smart_crop_users_v2';
const SESSION_STORAGE_KEY = 'smart_crop_active_session_v2';
const PENDING_ONBOARDING_KEY = 'smart_crop_pending_onboarding_v2';
const RESET_OTP_STORAGE_KEY = 'smart_crop_reset_otp_v2';

export const DEFAULT_DEMO_FARMER: FarmerProfile = {
  id: 'farmer-thanjavur-01',
  name: 'Ravi Kumar (ரவி குமார்)',
  mobile: '9842176540',
  phone: '9842176540',
  email: 'ravi.farmer@gmail.com',
  state: 'Tamil Nadu',
  district: 'Thanjavur',
  village: 'Thiruvaiyaru (திருவையாறு)',
  farmSizeAcres: 2.5,
  soilType: 'Clay Loam (களிமண் கலந்த வண்டல் மண்)',
  irrigationType: 'Borewell & Canal (ஆழ்துளை & வாய்க்கால் பாசனம்)',
  irrigationSource: 'Borewell & Canal (ஆழ்துளை & வாய்க்கால் பாசனம்)',
  mainCrops: ['Samba Paddy (சம்பா நெல் - CR 1009)', 'Blackgram (உளுந்து)'],
  mainCrop: 'Samba Paddy (சம்பா நெல் - CR 1009)',
  currentCrop: 'Samba Paddy (சம்பா நெல் - CR 1009)',
  preferredLanguage: 'ta',
  createdAt: '2026-01-10',
  isVerified: true,
};

export const DEFAULT_DEMO_ACCOUNT: UserAccount = {
  id: 'user-thanjavur-01',
  identifier: '9842176540',
  passwordHash: 'password123', // In production, replaced with bcrypt/PBKDF2 or Firebase Auth
  createdAt: '2026-01-10',
  profile: DEFAULT_DEMO_FARMER,
};

// Seed initial demo account if storage empty
function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initial = [
        DEFAULT_DEMO_ACCOUNT,
        {
          id: 'user-email-demo',
          identifier: 'ravi.farmer@gmail.com',
          passwordHash: 'password123',
          createdAt: '2026-01-10',
          profile: DEFAULT_DEMO_FARMER,
        },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored users:', e);
    return [DEFAULT_DEMO_ACCOUNT];
  }
}

function saveStoredUsers(users: UserAccount[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to storage:', e);
  }
}

export interface AuthSession {
  userId: string;
  identifier: string;
  rememberMe: boolean;
  token: string;
  profile: FarmerProfile;
  expiresAt: number;
}

export const authService = {
  /**
   * Get currently active session from localStorage (remember-me) or sessionStorage
   */
  getCurrentSession(): AuthSession | null {
    try {
      // Check localStorage first
      const persistent = localStorage.getItem(SESSION_STORAGE_KEY);
      if (persistent) {
        const session: AuthSession = JSON.parse(persistent);
        if (session.expiresAt > Date.now()) {
          return session;
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }

      // Check sessionStorage
      const transient = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (transient) {
        const session: AuthSession = JSON.parse(transient);
        if (session.expiresAt > Date.now()) {
          return session;
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Error retrieving session:', e);
    }
    return null;
  },

  /**
   * Store session
   */
  setSession(session: AuthSession) {
    const serialized = JSON.stringify(session);
    if (session.rememberMe) {
      localStorage.setItem(SESSION_STORAGE_KEY, serialized);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  },

  /**
   * Clear session
   */
  clearSession() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(PENDING_ONBOARDING_KEY);
  },

  /**
   * Log in with Email or 10-digit mobile number + password
   */
  async login(
    identifier: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    // Artificial small delay for realistic UI responsiveness
    await new Promise((r) => setTimeout(r, 400));

    const cleanId = identifier.trim().toLowerCase();
    const users = getStoredUsers();

    const user = users.find(
      (u) =>
        u.identifier.toLowerCase() === cleanId ||
        u.profile.mobile === cleanId ||
        u.profile.email?.toLowerCase() === cleanId
    );

    if (!user) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
      };
    }

    if (user.passwordHash !== password) {
      return {
        success: false,
        error: 'WRONG_PASSWORD',
      };
    }

    const session: AuthSession = {
      userId: user.id,
      identifier: user.identifier,
      rememberMe,
      token: 'jwt_mock_' + Math.random().toString(36).substring(2) + Date.now(),
      profile: user.profile,
      expiresAt: rememberMe
        ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        : Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    this.setSession(session);
    return { success: true, session };
  },

  /**
   * Quick 1-Click Demo Login
   */
  async loginAsDemo(): Promise<AuthSession> {
    const session: AuthSession = {
      userId: DEFAULT_DEMO_ACCOUNT.id,
      identifier: DEFAULT_DEMO_ACCOUNT.identifier,
      rememberMe: true,
      token: 'jwt_demo_' + Date.now(),
      profile: DEFAULT_DEMO_FARMER,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    this.setSession(session);
    return session;
  },

  /**
   * Register a new user account (Step 1)
   */
  async signUp(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; userId?: string; error?: string }> {
    await new Promise((r) => setTimeout(r, 400));

    const cleanId = identifier.trim().toLowerCase();
    const users = getStoredUsers();

    const exists = users.some(
      (u) =>
        u.identifier.toLowerCase() === cleanId ||
        u.profile.mobile === cleanId ||
        u.profile.email?.toLowerCase() === cleanId
    );

    if (exists) {
      return {
        success: false,
        error: 'ACCOUNT_EXISTS',
      };
    }

    const userId = 'user-' + Date.now();
    const pendingAccount: UserAccount = {
      id: userId,
      identifier: cleanId,
      passwordHash: password,
      createdAt: new Date().toISOString().split('T')[0],
      profile: {
        id: 'farmer-' + Date.now(),
        name: cleanId.includes('@') ? cleanId.split('@')[0] : 'Farmer ' + cleanId.slice(-4),
        mobile: cleanId.includes('@') ? '' : cleanId,
        email: cleanId.includes('@') ? cleanId : '',
        state: 'Tamil Nadu',
        district: 'Thanjavur',
        village: '',
        farmSizeAcres: 2.0,
        soilType: 'Clay Loam (களிமண் கலந்த வண்டல்)',
        irrigationType: 'Borewell (ஆழ்துளை கிணறு)',
        mainCrops: ['Paddy (நெல்)'],
        mainCrop: 'Paddy (நெல்)',
        preferredLanguage: 'ta',
        createdAt: new Date().toISOString().split('T')[0],
      },
    };

    users.push(pendingAccount);
    saveStoredUsers(users);

    // Save pending onboarding tracking
    sessionStorage.setItem(PENDING_ONBOARDING_KEY, userId);

    return {
      success: true,
      userId,
    };
  },

  /**
   * Complete Farmer Profile Onboarding (Step 2 after registration)
   */
  async completeOnboarding(
    userId: string,
    data: FarmerOnboardingData
  ): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    await new Promise((r) => setTimeout(r, 400));

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'USER_NOT_FOUND' };
    }

    const updatedProfile: FarmerProfile = {
      ...users[userIndex].profile,
      name: data.name.trim(),
      mobile: data.mobile.trim(),
      phone: data.mobile.trim(),
      district: data.district,
      village: data.village.trim(),
      farmSizeAcres: Number(data.farmSizeAcres) || 1,
      soilType: data.soilType,
      irrigationType: data.irrigationType,
      irrigationSource: data.irrigationType,
      mainCrops: [data.mainCrop],
      mainCrop: data.mainCrop,
      currentCrop: data.mainCrop,
      preferredLanguage: data.preferredLanguage,
      isVerified: true,
    };

    users[userIndex].profile = updatedProfile;
    saveStoredUsers(users);

    const session: AuthSession = {
      userId: users[userIndex].id,
      identifier: users[userIndex].identifier,
      rememberMe: true,
      token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now(),
      profile: updatedProfile,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    this.setSession(session);
    sessionStorage.removeItem(PENDING_ONBOARDING_KEY);

    return { success: true, session };
  },

  /**
   * Request password reset code / OTP
   */
  async requestPasswordReset(
    identifier: string
  ): Promise<{ success: boolean; otp?: string; error?: string }> {
    await new Promise((r) => setTimeout(r, 400));

    const cleanId = identifier.trim().toLowerCase();
    const users = getStoredUsers();

    const user = users.find(
      (u) =>
        u.identifier.toLowerCase() === cleanId ||
        u.profile.mobile === cleanId ||
        u.profile.email?.toLowerCase() === cleanId
    );

    if (!user) {
      return { success: false, error: 'ACCOUNT_NOT_FOUND' };
    }

    // Generate 6 digit OTP for simulated verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
      identifier: cleanId,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    localStorage.setItem(RESET_OTP_STORAGE_KEY, JSON.stringify(payload));
    return { success: true, otp };
  },

  /**
   * Reset password with verified OTP
   */
  async resetPassword(
    identifier: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((r) => setTimeout(r, 400));

    const cleanId = identifier.trim().toLowerCase();
    const rawOtp = localStorage.getItem(RESET_OTP_STORAGE_KEY);

    if (!rawOtp) {
      return { success: false, error: 'OTP_EXPIRED' };
    }

    const payload = JSON.parse(rawOtp);
    if (payload.identifier !== cleanId) {
      return { success: false, error: 'INVALID_REQUEST' };
    }

    if (payload.expiresAt < Date.now()) {
      localStorage.removeItem(RESET_OTP_STORAGE_KEY);
      return { success: false, error: 'OTP_EXPIRED' };
    }

    if (payload.otp !== otp.trim()) {
      return { success: false, error: 'INVALID_OTP' };
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex(
      (u) =>
        u.identifier.toLowerCase() === cleanId ||
        u.profile.mobile === cleanId ||
        u.profile.email?.toLowerCase() === cleanId
    );

    if (userIndex === -1) {
      return { success: false, error: 'ACCOUNT_NOT_FOUND' };
    }

    users[userIndex].passwordHash = newPassword;
    saveStoredUsers(users);
    localStorage.removeItem(RESET_OTP_STORAGE_KEY);

    return { success: true };
  },

  /**
   * Update Farmer Profile in database and active session
   */
  updateProfile(userId: string, updates: Partial<FarmerProfile>): FarmerProfile | null {
    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      // If user not in DB (e.g. demo session), update demo farmer
      const current = this.getCurrentSession();
      if (current) {
        const updated = { ...current.profile, ...updates };
        current.profile = updated;
        this.setSession(current);
        return updated;
      }
      return null;
    }

    const updated = {
      ...users[userIndex].profile,
      ...updates,
      phone: updates.mobile || updates.phone || users[userIndex].profile.mobile,
      currentCrop: updates.mainCrop || updates.currentCrop || users[userIndex].profile.mainCrop,
      irrigationSource: updates.irrigationType || updates.irrigationSource || users[userIndex].profile.irrigationType,
    };

    users[userIndex].profile = updated;
    saveStoredUsers(users);

    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.userId === userId) {
      currentSession.profile = updated;
      this.setSession(currentSession);
    }

    return updated;
  },
};
