import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { speechService, detectLanguage } from '../services/speechService';
import { askAssistant } from '../services/assistantService';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Sparkles,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  Languages,
  ArrowRight,
  Globe,
  Radio,
} from 'lucide-react';

interface TamilVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  detectedLang?: 'ta' | 'en';
  text: string;
  textTa?: string;
  textEn?: string;
  showTranslation?: boolean;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    ta: 'என் வயலுக்கு எந்த பயிர் நல்லது?',
    en: 'Which crop is best for my field?',
    lang: 'ta' as const,
  },
  {
    ta: 'நாளைக்கு தண்ணீர் பாய்ச்சலாமா?',
    en: 'Can I irrigate tomorrow?',
    lang: 'ta' as const,
  },
  {
    ta: 'தக்காளி இலை கருகல் நோய்க்கு மருந்து என்ன?',
    en: 'What is the medicine for tomato leaf blight?',
    lang: 'ta' as const,
  },
  {
    ta: 'தஞ்சாவூர் நெல் கொள்முதல் விலை என்ன?',
    en: 'What is the paddy procurement price in Thanjavur?',
    lang: 'ta' as const,
  },
  {
    ta: 'When should I apply urea fertilizer for paddy?',
    en: 'When should I apply urea fertilizer for paddy?',
    lang: 'en' as const,
  },
];

export const TamilVoiceAssistantModal: React.FC<TamilVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Language input preference: 'auto' (default), 'ta' (Tamil priority), 'en' (English)
  const [voiceLangMode, setVoiceLangMode] = useState<'auto' | 'ta' | 'en'>('auto');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      detectedLang: 'ta',
      text: 'வணக்கம் உழவர் தோழரே! உங்கள் பயிர், நோய் தடுப்பு, உரம், பாசனம் அல்லது சந்தை விலை குறித்து என்னிடம் தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள். (Ask me in Tamil or English!)',
      textTa:
        'வணக்கம் உழவர் தோழரே! உங்கள் பயிர், நோய் தடுப்பு, உரம், பாசனம் அல்லது சந்தை விலை குறித்து என்னிடம் தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள்.',
      textEn:
        'Welcome, Farmer Friend! Ask me about crops, disease control, fertilizers, irrigation, or mandi prices in Tamil or English.',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      speechService.stopListening();
      speechService.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setErrorMessage(null);
    speechService.stopSpeaking();
    setIsSpeaking(false);
    setCurrentlySpeakingId(null);

    const started = speechService.startListening(
      voiceLangMode,
      (res) => {
        setInputText(res.transcript);
        if (res.isFinal && res.transcript.trim()) {
          setIsListening(false);
          handleSendQuery(res.transcript.trim());
        }
      },
      (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const handleSpeakMessage = (msgId: string, textToSpeak: string, lang: 'ta' | 'en') => {
    if (isSpeaking && currentlySpeakingId === msgId) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
      return;
    }

    setIsSpeaking(true);
    setCurrentlySpeakingId(msgId);

    speechService.speak(textToSpeak, lang, () => {
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    });
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setInputText('');
    setIsListening(false);

    // 1. Detect language of question
    const detected = detectLanguage(textToSend);

    // 2. Append user message
    const userMsgId = 'user-' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      detectedLang: detected,
      text: textToSend,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 3. Ask assistant with auto-detected language
      const result = await askAssistant(textToSend, detected);

      const asstMsgId = 'asst-' + Date.now();
      const assistantMsg: ChatMessage = {
        id: asstMsgId,
        sender: 'assistant',
        detectedLang: result.detectedLanguage,
        text: result.reply,
        textTa: result.replyTa,
        textEn: result.replyEn,
        showTranslation: false,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically speak the response in the user's detected language
      handleSpeakMessage(asstMsgId, result.reply, result.detectedLanguage);
    } catch (err) {
      setErrorMessage(
        detected === 'ta'
          ? 'பதில் பெறுவதில் சிரமம் ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
          : 'Failed to retrieve advice. Please try asking again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTranslation = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, showTranslation: !m.showTranslation } : m
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-emerald-900/10"
        style={{ minWidth: '280px' }}
      >
        {/* Header */}
        <div className="bg-emerald-900 text-white p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Mic className="w-5 h-5 text-emerald-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight truncate">
                  {language === 'ta' ? 'உழவன் குரல் உதவியாளர்' : 'Tamil & English Agri Voice AI'}
                </h3>
                <span className="text-[9px] sm:text-[10px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Auto Lang
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 truncate">
                {language === 'ta'
                  ? 'தமிழில் கேட்டால் தமிழில் பதில் • Speaks in Tamil & English'
                  : 'Automatic Tamil / English detection & voice output'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language auto-detect indicator bar */}
        <div className="bg-emerald-50 px-3.5 py-2 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px] sm:text-xs">
            <Languages className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {language === 'ta'
                ? 'தானியங்கி மொழி கண்டறிதல் இயங்குகிறது:'
                : 'Auto Language Detection:'}
            </span>
            <span className="bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
              {voiceLangMode === 'auto'
                ? 'தமிழ் / English'
                : voiceLangMode === 'ta'
                ? 'தமிழ் (Tamil)'
                : 'English'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setVoiceLangMode('auto')}
              className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition-all min-h-[28px] ${
                voiceLangMode === 'auto'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => setVoiceLangMode('ta')}
              className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition-all min-h-[28px] ${
                voiceLangMode === 'ta'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setVoiceLangMode('en')}
              className={`px-2 py-0.5 text-[10px] rounded-md font-bold transition-all min-h-[28px] ${
                voiceLangMode === 'en'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-stone-50/80">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isMsgSpeaking = isSpeaking && currentlySpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    🌾
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3 sm:p-3.5 shadow-xs text-xs sm:text-sm ${
                    isUser
                      ? 'bg-emerald-800 text-white rounded-tr-xs'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-tl-xs'
                  }`}
                >
                  {/* Language Pill */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        isUser
                          ? 'bg-emerald-950/60 text-emerald-200'
                          : msg.detectedLang === 'ta'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {msg.detectedLang === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isUser ? 'text-emerald-200' : 'text-stone-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message body */}
                  <p className="leading-relaxed font-medium whitespace-pre-wrap">
                    {msg.showTranslation
                      ? msg.detectedLang === 'ta'
                        ? msg.textEn || msg.text
                        : msg.textTa || msg.text
                      : msg.text}
                  </p>

                  {/* Assistant controls: Voice speak & Translation toggle */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => {
                          const activeText = msg.showTranslation
                            ? msg.detectedLang === 'ta'
                              ? msg.textEn || msg.text
                              : msg.textTa || msg.text
                            : msg.text;
                          const activeLang = msg.showTranslation
                            ? msg.detectedLang === 'ta'
                              ? 'en'
                              : 'ta'
                            : msg.detectedLang || 'ta';
                          handleSpeakMessage(msg.id, activeText, activeLang);
                        }}
                        className="min-h-[36px] px-2 py-1 rounded-lg flex items-center gap-1.5 text-emerald-700 hover:bg-emerald-50 font-bold transition-colors"
                      >
                        {isMsgSpeaking ? (
                          <>
                            <VolumeX className="w-4 h-4 text-red-500 animate-pulse" />
                            <span className="text-red-500">
                              {msg.detectedLang === 'ta' ? 'நிறுத்து' : 'Stop'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-emerald-600" />
                            <span>
                              {msg.detectedLang === 'ta'
                                ? 'குரலில் கேட்க'
                                : 'Listen to Voice'}
                            </span>
                          </>
                        )}
                      </button>

                      {/* Translation switch */}
                      {(msg.textTa || msg.textEn) && (
                        <button
                          onClick={() => toggleTranslation(msg.id)}
                          className="min-h-[36px] px-2 py-1 rounded-lg text-stone-600 hover:text-emerald-800 hover:bg-stone-100 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Languages className="w-3.5 h-3.5 text-stone-500" />
                          <span>
                            {msg.showTranslation
                              ? msg.detectedLang === 'ta'
                                ? 'View Tamil'
                                : 'தமிழில் காண்க'
                              : msg.detectedLang === 'ta'
                              ? 'Translate to English'
                              : 'தமிழில் மொழிபெயர்'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-stone-600 italic p-3 bg-white rounded-2xl border border-stone-200 max-w-[240px] shadow-2xs">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>
                {language === 'ta'
                  ? 'பதில் யோசிக்கிறது... காத்திருக்கவும்'
                  : 'Analyzing with Agri AI...'}
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {errorMessage}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions scrollbar */}
        <div className="px-3 sm:px-4 py-2 bg-white border-t border-stone-100 overflow-x-auto">
          <div className="text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {language === 'ta'
                ? 'உடனடி கேள்விகள் (தட்டினால் பதில் கிடைக்கும்):'
                : 'Sample questions (tap to ask):'}
            </span>
          </div>
          <div className="flex gap-2 pb-1 flex-nowrap overflow-x-auto">
            {QUICK_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const prompt = language === 'ta' ? q.ta : q.en;
                  setInputText(prompt);
                  handleSendQuery(prompt);
                }}
                className="whitespace-nowrap text-xs bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-950 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors font-medium shrink-0 min-h-[36px] flex items-center"
              >
                {language === 'ta' ? q.ta : q.en}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Voice Controller / Text Input */}
        <div className="p-3 sm:p-3.5 bg-stone-100 border-t border-stone-200">
          <div className="flex items-center gap-2">
            {/* Big Mic Button with touch target */}
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse scale-105 ring-4 ring-red-200'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title={
                isListening
                  ? 'Stop Recording'
                  : language === 'ta'
                  ? 'தமிழில் பேசவும் (Speak in Tamil)'
                  : 'Speak now'
              }
              aria-label="Microphone"
            >
              {isListening ? (
                <MicOff className="w-6 h-6 animate-spin" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {/* Input field */}
            <div className="flex-1 relative min-w-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuery();
                }}
                placeholder={
                  isListening
                    ? language === 'ta'
                      ? 'உங்கள் குரலை கேட்கிறது... பேசுங்கள்...'
                      : 'Listening to your voice...'
                    : language === 'ta'
                    ? 'தமிழிலோ ஆங்கிலத்திலோ கேள்வி கேட்கவும்...'
                    : 'Ask in Tamil or English...'
                }
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-11 min-h-[44px]"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[38px] min-h-[38px] flex items-center justify-center text-emerald-700 hover:text-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-[10px] sm:text-[11px] text-stone-500 flex-wrap gap-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Auto Language Detection • Tamil & English Voice</span>
            </span>
            {isListening && (
              <span className="text-red-600 font-black animate-pulse flex items-center gap-1">
                <Radio className="w-3 h-3" />
                <span>{language === 'ta' ? 'குரல் கேட்கிறது...' : 'Listening...'}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
