import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldCheck, Info, Heart } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="mt-auto bg-stone-900 text-stone-300 border-t border-stone-800 pt-8 pb-20 lg:pb-10 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Safety & Academic Disclaimer Banner */}
        <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-stone-100 text-sm">
              {language === 'ta'
                ? 'வேளாண் பாதுகாப்பு மற்றும் பொறுப்புத் துறப்பு (Safety Advisory)'
                : 'Agricultural Safety & Extension Advisory Notice'}
            </h4>
            <p className="text-stone-300 leading-relaxed text-xs">
              {t.disclaimer}
            </p>
            <p className="text-stone-400 text-[11px] pt-1">
              {language === 'ta'
                ? 'பூச்சிக்கொல்லி மருந்துகளை கையாளும் போது தகுந்த முகக்கவசம் மற்றும் கையுறை அணியவும். அரசு அங்கீகரிக்கப்பட்ட TNAU / KVK பரிந்துரைகளை மட்டுமே பின்பற்றவும்.'
                : 'Always wear protective gear when applying biological or chemical sprays. Calibrate dosages strictly based on registered agricultural extension recommendations.'}
            </p>
          </div>
        </div>

        {/* Project Metadata & Academic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-800">
          <div>
            <div className="flex items-center gap-2 font-black text-stone-100 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Smart Crop Advisory System</span>
            </div>
            <p className="text-stone-400 text-xs mt-1 leading-relaxed">
              {language === 'ta'
                ? 'சிறு மற்றும் குறு விவசாயிகளுக்கான ஒருங்கிணைந்த புத்திசாலி விவசாய வழிகாட்டி அமைப்பு.'
                : 'An intelligent crop advisory platform designed to help small and marginal farmers make better farming decisions in Tamil.'}
            </p>
            <div className="mt-2.5 inline-block text-[10px] bg-stone-800 text-emerald-300 px-2 py-0.5 rounded font-mono">
              Academic Project Prototype v2.4
            </div>
          </div>

          <div>
            <div className="font-bold text-stone-200 text-xs uppercase tracking-wider mb-2">
              {language === 'ta' ? 'அறிவார்ந்த அம்சங்கள்' : 'Core Capabilities'}
            </div>
            <ul className="text-stone-400 space-y-1 text-xs">
              <li>• Tamil Voice Assistant (தமிழ் குரல் உரையாடல்)</li>
              <li>• AI Leaf Pathology Vision Diagnosis</li>
              <li>• Agro-Climatic Multi-Crop Recommendation</li>
              <li>• Village Outbreak Alert Surveillance</li>
              <li>• Precision Soil Moisture Irrigation Guidance</li>
              <li>• Yield & Cultivation Profit Analytics</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-stone-200 text-xs uppercase tracking-wider mb-2">
              {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட வழிகாட்டுதல்கள்' : 'Agronomic Standards'}
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Aligned with Tamil Nadu Agricultural University (TNAU) Agritech Portal, Krishi Vigyan Kendra (KVK) Cauvery Delta protocols, and Agmarknet Mandi daily pricing standards.
            </p>
            <div className="mt-3 text-[11px] text-stone-500 flex items-center gap-1">
              <span>Made with care for Tamil Nadu Farmers</span>
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
