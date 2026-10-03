import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { NotificationItem, DiseaseAlert } from '../types';
import { useAuth } from './AuthContext';
import {
  CROP_DISEASE_PREVENTION_CATALOGUE,
  CropDiseasePreventionTip,
  getDiseasePreventionTipForCrops,
} from '../services/diseasePreventionTips';

export interface PushNotificationToast {
  id: string;
  notifId: string;
  titleEn: string;
  titleTa: string;
  messageEn: string;
  messageTa: string;
  cropEn: string;
  cropTa: string;
  diseaseEn: string;
  diseaseTa: string;
  actionEn: string;
  actionTa: string;
  severity: 'info' | 'warning' | 'alert';
  timestamp: string;
}

interface AlertsContextType {
  notifications: NotificationItem[];
  alerts: DiseaseAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addDiseaseAlert: (alert: Omit<DiseaseAlert, 'id' | 'reportedDate' | 'isVerifiedByOfficer'>) => void;
  
  // Push Notification Simulation
  simulateDailyPushNotification: (customCropName?: string) => NotificationItem;
  activeToast: PushNotificationToast | null;
  dismissToast: () => void;
  isPushSimulationActive: boolean;
  togglePushSimulation: () => void;
  browserPermission: NotificationPermission;
  requestBrowserPermission: () => Promise<NotificationPermission>;
  trackedCrops: string[];
}

const INITIAL_ALERTS: DiseaseAlert[] = [
  {
    id: 'alert-01',
    diseaseEn: 'Brown Plant Hopper (BPH)',
    diseaseTa: 'புகையான் பூச்சி தாக்குதல்',
    cropEn: 'Paddy',
    cropTa: 'நெல்',
    district: 'Thanjavur',
    village: 'Thiruvaiyaru & Orathanadu',
    severity: 'High',
    reportedDate: '2 days ago',
    activeCasesCount: 14,
    recommendationEn: 'Drain standing water for 3 days. Install light traps and spray Neem Seed Kernel Extract (NSKE 5%) or recommended bio-formulations.',
    recommendationTa: 'வயலில் தேங்கி நிற்கும் தண்ணீரை 3 நாட்களுக்கு வடிக்கவும். விளக்கு பொறி அமைக்கவும் மற்றும் 5% வேப்பங்கொட்டை சாறு தெளிக்கவும்.',
    isVerifiedByOfficer: true,
  },
  {
    id: 'alert-02',
    diseaseEn: 'Tomato Leaf Curl Virus',
    diseaseTa: 'தக்காளி இலை சுருட்டு வைரஸ்',
    cropEn: 'Tomato',
    cropTa: 'தக்காளி',
    district: 'Dindigul',
    village: 'Oddanchatram & Palani',
    severity: 'High',
    reportedDate: 'Yesterday',
    activeCasesCount: 9,
    recommendationEn: 'Control whitefly vectors using yellow sticky traps (12 traps/acre). Uproot severely affected stunted plants immediately.',
    recommendationTa: 'வெள்ளை ஈக்களை கட்டுப்படுத்த மஞ்சள் நிற ஒட்டும் பொறிகளை (ஏக்கருக்கு 12) வைக்கவும். கடுமையான பாதிக்கப்பட்ட செடிகளை பிடுங்கி எரிக்கவும்.',
    isVerifiedByOfficer: true,
  },
  {
    id: 'alert-03',
    diseaseEn: 'Banana Sigatoka Leaf Spot',
    diseaseTa: 'வாழை சிகடோகா இலைப்புள்ளி நோய்',
    cropEn: 'Banana',
    cropTa: 'வாழை',
    district: 'Tiruchirappalli',
    village: 'Musiri & Lalgudi',
    severity: 'Moderate',
    reportedDate: '3 days ago',
    activeCasesCount: 6,
    recommendationEn: 'Remove and burn heavily dried lower leaves. Ensure proper drainage and avoid water stagnation.',
    recommendationTa: 'காய்ந்த கீழ் இலைகளை வெட்டி அழிக்கவும். வடிகால் வசதியை சீரமைத்து நீர் தேங்காமல் பார்த்துக் கொள்ளவும்.',
    isVerifiedByOfficer: true,
  },
  {
    id: 'alert-04',
    diseaseEn: 'Groundnut Tikka Leaf Spot',
    diseaseTa: 'நிலக்கடலை டிக்கா இலைப்புள்ளி நோய்',
    cropEn: 'Groundnut',
    cropTa: 'நிலக்கடலை',
    district: 'Villupuram',
    village: 'Gingee & Vikravandi',
    severity: 'Moderate',
    reportedDate: '4 days ago',
    activeCasesCount: 5,
    recommendationEn: 'Spray Carbendazim or Mancozeb as recommended by local extension officer. Maintain field sanitation.',
    recommendationTa: 'பரிந்துரைக்கப்பட்ட அளவு கார்பென்டாசிம் தெளிக்கவும். நிலத்தை தூய்மையாக பராமரிக்கவும்.',
    isVerifiedByOfficer: false,
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    category: 'disease',
    titleEn: 'High Disease Outbreak Warning',
    titleTa: 'அதி தீவிர பூச்சி தாக்குதல் எச்சரிக்கை',
    messageEn: 'Brown Plant Hopper reported in 14 farms near Thiruvaiyaru, Thanjavur. Inspect tiller bases now.',
    messageTa: 'தஞ்சாவூர் திருவையாறு அருகில் 14 வயல்களில் புகையான் பூச்சி தாக்குதல் பதிவாகியுள்ளது. தூர்களை உடனடியாக கவனிக்கவும்.',
    severity: 'alert',
    timestamp: '15 mins ago',
    read: false,
  },
  {
    id: 'notif-02',
    category: 'weather',
    titleEn: 'Thunderstorm & Rain Alert',
    titleTa: 'இடி மின்னலுடன் கூடிய மழை எச்சரிக்கை',
    messageEn: 'Moderate rainfall (25-35mm) forecast for Cauvery Delta in next 48 hrs. Postpone fertilizer application.',
    messageTa: 'அடுத்த 48 மணி நேரத்தில் காவிரி டெல்டா பகுதியில் மிதமான மழை வாய்ப்பு. உரமிடுவதை தற்காலிகமாக ஒத்திவைக்கவும்.',
    severity: 'warning',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-03',
    category: 'irrigation',
    titleEn: 'Irrigation Timing Reminder',
    titleTa: 'பாசன நேரம் நினைவூட்டல்',
    messageEn: 'Your Paddy crop is in Tillering stage. Maintain 2-3 cm shallow water layer.',
    messageTa: 'உங்கள் நெற்பயிர் தூர்க்கட்டும் பருவத்தில் உள்ளது. 2-3 செ.மீ அளவு நீர்மட்டம் பராமரிக்கவும்.',
    severity: 'info',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: 'notif-04',
    category: 'market',
    titleEn: 'Paddy Procurement Price Update',
    titleTa: 'நெல் கொள்முதல் விலை நிலவரம்',
    messageEn: 'Grade A Paddy modal rate at Thanjavur Mandi reached ₹2,350/quintal today (+3.2%).',
    messageTa: 'தஞ்சாவூர் ஒழுங்குமுறை விற்பனைக்கூடத்தில் சன்ன ரக நெல் விலை குவிண்டாலுக்கு ₹2,350 ஆக உயர்ந்துள்ளது.',
    severity: 'info',
    timestamp: '1 day ago',
    read: true,
  },
];

// Gentle Web Audio Chime generator (No external MP3 files needed)
function playPushNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell tone 1 (E5 = 659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Harmonic bell tone 2 (B5 = 987Hz) slightly delayed for double ping
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.1);
    gain2.gain.setValueAtTime(0, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.15, now + 0.13);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch {
    // Autoplay restrictions or test environment
  }
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { farmer } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smart_crop_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [alerts, setAlerts] = useState<DiseaseAlert[]>(() => {
    const saved = localStorage.getItem('smart_crop_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Active in-app floating push notification toast
  const [activeToast, setActiveToast] = useState<PushNotificationToast | null>(null);

  // Background automated push simulation toggle
  const [isPushSimulationActive, setIsPushSimulationActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('smart_crop_push_sim_active');
    return saved !== null ? saved === 'true' : true;
  });

  // Browser system push notification permission
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // Last simulated tip ID to prevent immediate repetition
  const [lastTipId, setLastTipId] = useState<string>('');

  // Persist notifications & alerts
  useEffect(() => {
    try {
      localStorage.setItem('smart_crop_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_crop_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_crop_push_sim_active', String(isPushSimulationActive));
    } catch (e) {
      console.error(e);
    }
  }, [isPushSimulationActive]);

  // Dynamically resolve currently tracked crops from user profile and crop schedules
  const trackedCrops = useMemo(() => {
    const crops = new Set<string>();

    // 1. From User Profile mainCrop
    if (farmer?.mainCrop && farmer.mainCrop.trim().length > 0) {
      crops.add(farmer.mainCrop.trim());
    }

    // 2. From Harvest Scheduler stored plots
    try {
      const savedSchedules = localStorage.getItem(`crop_schedules_${farmer?.id || 'demo'}`);
      if (savedSchedules) {
        const parsed = JSON.parse(savedSchedules);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (item.cropName) crops.add(item.cropName);
            if (item.cropId) crops.add(item.cropId);
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Fallback default if empty
    if (crops.size === 0) {
      crops.add('Samba Paddy (நெல்)');
    }

    return Array.from(crops);
  }, [farmer?.mainCrop, farmer?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const addDiseaseAlert = (newAlertData: Omit<DiseaseAlert, 'id' | 'reportedDate' | 'isVerifiedByOfficer'>) => {
    const newAlert: DiseaseAlert = {
      ...newAlertData,
      id: 'alert-' + Date.now(),
      reportedDate: 'Just now',
      isVerifiedByOfficer: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Also push a notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      category: 'disease',
      titleEn: `New Disease Report: ${newAlert.diseaseEn}`,
      titleTa: `புதிய நோய் எச்சரிக்கை: ${newAlert.diseaseTa}`,
      messageEn: `Reported in ${newAlert.village}, ${newAlert.district}. Severity: ${newAlert.severity}.`,
      messageTa: `${newAlert.district} மாவட்டம் ${newAlert.village} பகுதியில் பதிவானது. தீவிரம்: ${newAlert.severity}.`,
      severity: newAlert.severity === 'High' || newAlert.severity === 'Severe' ? 'alert' : 'warning',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Request browser Notification permission
  const requestBrowserPermission = async (): Promise<NotificationPermission> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        return perm;
      } catch (err) {
        console.error('Error requesting notification permission:', err);
      }
    }
    return 'default';
  };

  /**
   * Push Notification Simulation engine:
   * Selects an intelligent, contextual disease prevention tip matching
   * the specific crops currently tracked in the user's dashboard.
   */
  const simulateDailyPushNotification = useCallback((customCropName?: string): NotificationItem => {
    const cropsToSearch = customCropName ? [customCropName] : trackedCrops;
    const tip = getDiseasePreventionTipForCrops(cropsToSearch, lastTipId);
    setLastTipId(tip.id);

    const notifId = 'push_' + Date.now();
    const newNotif: NotificationItem = {
      id: notifId,
      category: 'disease',
      titleEn: `${tip.titleEn} (${tip.cropNameEn})`,
      titleTa: `${tip.titleTa} (${tip.cropNameTa})`,
      messageEn: `${tip.preventionTipEn} Protocol: ${tip.actionProtocolEn}`,
      messageTa: `${tip.preventionTipTa} களப்பணி: ${tip.actionProtocolTa}`,
      severity: tip.urgency,
      timestamp: 'Just now',
      read: false,
      actionUrl: 'alerts',
    };

    // Update notifications list
    setNotifications((prev) => [newNotif, ...prev]);

    // Play pleasant push notification chime
    playPushNotificationChime();

    // Trigger visual in-app push notification toast banner
    const toastObj: PushNotificationToast = {
      id: 'toast_' + Date.now(),
      notifId,
      titleEn: tip.titleEn,
      titleTa: tip.titleTa,
      messageEn: tip.preventionTipEn,
      messageTa: tip.preventionTipTa,
      cropEn: tip.cropNameEn,
      cropTa: tip.cropNameTa,
      diseaseEn: tip.diseaseEn,
      diseaseTa: tip.diseaseTa,
      actionEn: tip.actionProtocolEn,
      actionTa: tip.actionProtocolTa,
      severity: tip.urgency,
      timestamp: 'Just now',
    };
    setActiveToast(toastObj);

    // If browser notifications are permitted, dispatch desktop notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🌾 ${tip.cropNameEn}: ${tip.diseaseEn} Prevention Tip`, {
          body: tip.preventionTipEn,
          icon: '/favicon.ico',
          tag: 'daily_crop_disease_prevention',
        });
      } catch (err) {
        console.error('Browser push error:', err);
      }
    }

    return newNotif;
  }, [trackedCrops, lastTipId]);

  // Toggle push simulation on / off
  const togglePushSimulation = () => {
    setIsPushSimulationActive((prev) => !prev);
  };

  // Automated initial daily tip simulation:
  // If user hasn't received a daily tip today, trigger one after short initial delay (4 seconds)
  useEffect(() => {
    if (!isPushSimulationActive) return;

    const todayDateStr = new Date().toISOString().split('T')[0];
    const lastDailyDate = localStorage.getItem('last_simulated_daily_tip_date');

    if (lastDailyDate !== todayDateStr) {
      const timer = setTimeout(() => {
        simulateDailyPushNotification();
        localStorage.setItem('last_simulated_daily_tip_date', todayDateStr);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isPushSimulationActive, simulateDailyPushNotification]);

  return (
    <AlertsContext.Provider
      value={{
        notifications,
        alerts,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addDiseaseAlert,
        simulateDailyPushNotification,
        activeToast,
        dismissToast,
        isPushSimulationActive,
        togglePushSimulation,
        browserPermission,
        requestBrowserPermission,
        trackedCrops,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};
