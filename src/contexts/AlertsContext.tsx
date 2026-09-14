import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem, DiseaseAlert } from '../types';

interface AlertsContextType {
  notifications: NotificationItem[];
  alerts: DiseaseAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addDiseaseAlert: (alert: Omit<DiseaseAlert, 'id' | 'reportedDate' | 'isVerifiedByOfficer'>) => void;
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

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smart_crop_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [alerts, setAlerts] = useState<DiseaseAlert[]>(() => {
    const saved = localStorage.getItem('smart_crop_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem('smart_crop_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smart_crop_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

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

  return (
    <AlertsContext.Provider
      value={{
        notifications,
        alerts,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addDiseaseAlert,
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
