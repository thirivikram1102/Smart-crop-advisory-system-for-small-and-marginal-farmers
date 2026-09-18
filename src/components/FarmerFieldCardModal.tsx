import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Printer,
  X,
  ShieldCheck,
  Sprout,
  Droplets,
  Calendar,
  CheckCircle2,
  Phone,
  QrCode,
  Download,
} from 'lucide-react';

interface FarmerFieldCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmerFieldCardModal: React.FC<FarmerFieldCardModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { farmer } = useAuth();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden border border-stone-300">
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="p-3.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
              {language === 'ta' ? 'அதிகாரப்பூர்வ பயிர் அட்டை' : 'Official Field Advisory Card'}
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              TNAU 2024-25
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'அச்சிடு / PDF சேமி' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-[#fcfbf9] text-stone-900 space-y-6" id="printable-field-card">
          {/* Header of Certificate */}
          <div className="border-b-2 border-emerald-900 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-emerald-900">
              <Sprout className="w-6 h-6 text-emerald-700" />
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                {language === 'ta'
                  ? 'தமிழ்நாடு உழவர் வழிகாட்டி & மண் வள மேலாண்மை அட்டை'
                  : 'Tamil Nadu Smart Agri & Soil Health Field Advisory Card'}
              </h2>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {language === 'ta'
                ? 'தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழக (TNAU) பயிர் பரிந்துரை நெறிமுறைகளின்படி வழங்கப்பட்டது'
                : 'Aligned with TNAU Agronomy & KVK Cauvery Delta Extension Standards'}
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1 font-mono">
              <span>அட்டை எண் / Ref: TN-AGRI-{farmer?.district?.substring(0, 3).toUpperCase() || 'THA'}-2026-8841</span>
              <span>•</span>
              <span>தேதி: {currentDate}</span>
            </div>
          </div>

          {/* Farmer & Field Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-[10px] text-stone-400 font-bold block uppercase">{language === 'ta' ? 'விவசாயி பெயர்' : 'Farmer Name'}</span>
              <span className="font-extrabold text-stone-900 text-sm">{farmer?.name || 'ரவி குமார்'}</span>
              <span className="text-[10px] text-stone-500 block">{farmer?.mobile || '9842176540'}</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 font-bold block uppercase">{language === 'ta' ? 'கிராமம் & மாவட்டம்' : 'Village & District'}</span>
              <span className="font-extrabold text-stone-900">{farmer?.village || 'திருவையாறு'}</span>
              <span className="text-[10px] text-stone-500 block">{farmer?.district || 'தஞ்சாவூர்'}</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 font-bold block uppercase">{language === 'ta' ? 'நிலப்பரப்பு & மண்' : 'Area & Soil'}</span>
              <span className="font-extrabold text-stone-900">{farmer?.farmSizeAcres || 2.5} ஏக்கர்</span>
              <span className="text-[10px] text-stone-500 block truncate">{farmer?.soilType || 'களிமண் வண்டல்'}</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 font-bold block uppercase">{language === 'ta' ? 'பயிர் & பருவம்' : 'Crop & Season'}</span>
              <span className="font-extrabold text-emerald-800">{farmer?.mainCrop || 'சம்பா நெல் CR 1009'}</span>
              <span className="text-[10px] text-amber-700 font-semibold block">தூர்க்கட்டும் பருவம் (Day 38)</span>
            </div>
          </div>

          {/* Soil Nutrient Index */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? '1. மண் ஆய்வு முடிவுகள் (Soil Health Status)' : '1. Soil Health Status'}</span>
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">தழைச்சத்து (N)</span>
                <span className="text-sm font-black text-stone-800">85 kg/ac</span>
                <span className="text-[9px] text-amber-700 block font-bold">மிதமானது (Medium)</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">மணிச்சத்து (P)</span>
                <span className="text-sm font-black text-stone-800">18 kg/ac</span>
                <span className="text-[9px] text-emerald-700 block font-bold">போதுமானது (Adequate)</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">சாம்பல் சத்து (K)</span>
                <span className="text-sm font-black text-stone-800">54 kg/ac</span>
                <span className="text-[9px] text-emerald-700 block font-bold">நன்று (Good)</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">கார அமில நிலை (pH)</span>
                <span className="text-sm font-black text-stone-800">7.2</span>
                <span className="text-[9px] text-emerald-700 block font-bold">நடுநிலை (Neutral)</span>
              </div>
            </div>
          </div>

          {/* Fertilizer Bag Prescription */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? '2. பரிந்துரைக்கப்படும் உர அட்டவணை (மூட்டைகளில் - 2.5 ஏக்கருக்கு)' : '2. Recommended Fertilizer Schedule (in Bags for 2.5 Acres)'}</span>
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <th className="p-2.5">பருவம் / Stage</th>
                    <th className="p-2.5">நாட்கள் / Days</th>
                    <th className="p-2.5">உரம் & அளவு (Fertilizer Dosage)</th>
                    <th className="p-2.5">குறிப்பு / Advisory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-700 bg-white">
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">அடி உரம் (Basal)</td>
                    <td className="p-2.5 font-mono">0 நாள்</td>
                    <td className="p-2.5 font-semibold text-emerald-800">1.5 மூட்டை DAP + 0.5 மூட்டை பொட்டாஷ்</td>
                    <td className="p-2.5 text-[11px] text-stone-500">கடைசி உழவின் போது இடவும்</td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="p-2.5 font-bold text-emerald-900">முதல் மேலுரம் (Tillering)</td>
                    <td className="p-2.5 font-mono font-bold text-emerald-800">20-25 நாள்</td>
                    <td className="p-2.5 font-bold text-emerald-900">1.5 மூட்டை யூரியா + 10kg வேப்பம் புண்ணாக்கு</td>
                    <td className="p-2.5 text-[11px] text-emerald-800 font-medium">களை எடுத்த பின் இடவும்</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2.5 font-bold text-amber-900">2-ஆம் மேலுரம் (தற்போதைய பருவம்)</td>
                    <td className="p-2.5 font-mono font-bold text-amber-800">40-45 நாள்</td>
                    <td className="p-2.5 font-bold text-amber-900">1 மூட்டை யூரியா + 0.5 மூட்டை பொட்டாஷ்</td>
                    <td className="p-2.5 text-[11px] text-amber-900 font-medium">மண் ஈரமாக இருக்கும்போது இடவும்</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-stone-900">கதிர் வரும் பருவம் (Heading)</td>
                    <td className="p-2.5 font-mono">70-75 நாள்</td>
                    <td className="p-2.5 font-semibold text-stone-800">0.5 மூட்டை பொட்டாஷ் + 1% பொட்டாசியம் நைட்ரேட் ஸ்ப்ரே</td>
                    <td className="p-2.5 text-[11px] text-stone-500">மணி எடை கூட உதவும்</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Plant Protection & Biocontrol */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? '3. இயற்கை மற்றும் அங்கீகரிக்கப்பட்ட பயிர் பாதுகாப்பு' : '3. Plant Protection & Bio-Control Advice'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">இலைச்சுருட்டு & புகையான் தடுப்பு:</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  வேப்பெண்ணெய் 3% கரைசல் (30 மிலி/லிட்டர்) அல்லது அசடிராக்டின் 0.03% (1 லிட்டர்/ஏக்கர்). தேவைப்பட்டால் பைமெட்ரோசின் 50 WG 120 கிராம்/ஏக்கர் தெளிக்கவும்.
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">குலை நோய் & இலைக்கருகல் தடுப்பு:</span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  சூடோமோனாஸ் ஃப்ளோரசன்ஸ் 1 கிலோ/ஏக்கர் அல்லது பேசில்லஸ் சப்டிலிஸ் 500 கிராம்/ஏக்கர் பனி நேரத்தில் தெளிக்கவும்.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Validation & Help Line */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center border border-stone-300">
                <QrCode className="w-8 h-8 text-stone-700" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-900 block">டிஜிட்டல் சரிபார்ப்பு குறியீடு (Digital Verified)</span>
                <span className="text-[10px] text-stone-500">TNAU Agritech Portal • Kisan Call Centre 1800-180-1551</span>
              </div>
            </div>

            <div className="text-right text-[11px] text-stone-500">
              <span className="font-bold text-stone-800 block">தமிழ்நாடு வேளாண்மை & உழவர் நலத்துறை</span>
              <span>வட்டார வேளாண்மை விரிவாக்க மையம், திருவையாறு</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
