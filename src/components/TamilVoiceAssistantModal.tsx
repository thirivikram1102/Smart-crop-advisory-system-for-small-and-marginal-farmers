import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { speechService } from '../services/speechService';
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
} from 'lucide-react';

interface TamilVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  textEn: string;
  textTa: string;
  timestamp: string;
}

const QUICK_TAMIL_PROMPTS = [
  {
    ta: 'என் வயலுக்கு எந்த பயிர் நல்லது?',
    en: 'Which crop is best for my field?',
    action: 'crop-recommendation',
  },
  {
    ta: 'நாளைக்கு தண்ணீர் பாய்ச்சலாமா?',
    en: 'Can I irrigate tomorrow?',
    action: 'irrigation',
  },
  {
    ta: 'தக்காளி இலை கருகல் நோய்க்கு மருந்து என்ன?',
    en: 'What is the treatment for tomato leaf blight?',
    action: 'disease-detection',
  },
  {
    ta: 'தஞ்சாவூர் நெல் கொள்முதல் விலை என்ன?',
    en: 'What is the paddy procurement price in Thanjavur?',
    action: 'market',
  },
  {
    ta: 'யூரியா உரம் எப்போது இட வேண்டும்?',
    en: 'When should I apply urea fertilizer?',
    action: 'crop-management',
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
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      textTa: 'வணக்கம் உழவர் தோழரே! உங்கள் பயிர், நோய் தடுப்பு, பாசனம் அல்லது சந்தை விலை குறித்து என்னிடம் தமிழில் கேளுங்கள்.',
      textEn: 'Vanakkam, Farmer! Ask me in Tamil or English about crops, pest diseases, irrigation, or market rates.',
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

    const started = speechService.startListening(
      'ta',
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

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speechService.speak(text, 'ta', () => {
      setIsSpeaking(false);
    });
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setInputText('');
    setIsListening(false);

    // Append user message
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      textTa: textToSend,
      textEn: textToSend,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply = await askAssistant(textToSend, 'ta');
      const assistantMsg: ChatMessage = {
        id: 'asst-' + Date.now(),
        sender: 'assistant',
        textTa: reply.textTa,
        textEn: reply.textEn,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically speak the response in Tamil
      handleSpeakText(reply.textTa);
    } catch (err) {
      setErrorMessage(
        language === 'ta'
          ? 'பதில் பெறுவதில் சிரமம் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
          : 'Failed to get answer. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-emerald-900/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-md">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                  {language === 'ta' ? 'தமிழ் குரல் உதவியாளர்' : 'Tamil Agri Voice Assistant'}
                </h3>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {language === 'ta'
                  ? 'விவசாயக் கேள்விகளை தமிழில் கேட்டு குரல் வழியே பதில் பெறுங்கள்'
                  : 'Ask farm questions in Tamil and listen to voice answers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/70">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    🌾
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed font-medium">
                    {language === 'ta' ? msg.textTa : msg.textEn}
                  </p>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleSpeakText(language === 'ta' ? msg.textTa : msg.textEn)}
                        className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-red-500">
                              {language === 'ta' ? 'நிறுத்து' : 'Stop'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{language === 'ta' ? 'குரலில் கேட்க' : 'Listen'}</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-stone-500 italic p-2 bg-white rounded-xl border border-stone-200 max-w-[200px]">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span>{language === 'ta' ? 'பதில் யோசிக்கிறது...' : 'Consulting agronomy AI...'}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {errorMessage}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions for Farmers */}
        <div className="px-4 py-2 bg-white border-t border-stone-100 overflow-x-auto">
          <div className="text-[11px] font-bold text-stone-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{language === 'ta' ? 'உடனடி கேள்விகள் (தட்டினால் கேட்கலாம்):' : 'Suggested quick questions:'}</span>
          </div>
          <div className="flex gap-1.5 pb-1 flex-nowrap overflow-x-auto">
            {QUICK_TAMIL_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(q.ta);
                  handleSendQuery(q.ta);
                }}
                className="whitespace-nowrap text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors font-medium text-left shrink-0"
              >
                {language === 'ta' ? q.ta : q.en}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Voice Controller / Text Input */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200">
          <div className="flex items-center gap-2">
            {/* Big Mic Button */}
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse scale-105 ring-4 ring-red-200'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak in Tamil'}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Text input for fallback */}
            <div className="flex-1 relative">
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
                    ? 'தமிழில் கேள்வி எழுதவும் அல்லது மைக் அழுத்தவும்...'
                    : 'Type farm question or tap mic to speak...'
                }
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-10"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-emerald-700 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Web Speech API (ta-IN) • Tamil Speech Recognition</span>
            </span>
            {isListening && (
              <span className="text-red-600 font-bold animate-pulse">
                ● {language === 'ta' ? 'கேட்கிறது...' : 'Listening...'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
