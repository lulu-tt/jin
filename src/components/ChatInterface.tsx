import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  ExternalLink, 
  ShieldAlert, 
  BookOpen, 
  Globe, 
  ChevronRight,
  RefreshCw,
  Sparkles,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { sendMessage, ChatMessage } from '../services/gemini';
import { cn } from '../lib/utils';

// 최신 3D 디플리 캐릭터 이미지 (제공해주신 디자인 반영)
const DIPLY_AVATAR = "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=200&h=200&auto=format&fit=crop"; // 디플리 느낌의 3D 캐릭터 예시
const DIPLY_FULL = "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=500&h=500&auto=format&fit=crop"; // 대형 디플리 예시

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "안녕하세요! 저는 여러분의 외교부 친구 **디플리**예요! 🌍✨\n\n여권 발급부터 해외 여행 안전 정보까지, 궁금한 건 무엇이든 물어보세요. 제가 반갑게 도와드릴게요!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkApiKey = () => {
    const key = process.env.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
    if (!key) {
      setShowKeyModal(true);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  const saveApiKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', tempKey.trim());
      setShowKeyModal(false);
      setTempKey("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(input, messages);
      setMessages(prev => [...prev, { 
        role: "model", 
        text: response.text,
        groundingMetadata: response.groundingMetadata
      }]);
    } catch (error: any) {
      console.error(error);
      let errorMessage = "앗, 잠시 통신에 문제가 생겼나 봐요. 다시 한번 말씀해 주시겠어요? 제가 금방 알아볼게요! 💙";
      
      if (error.message === "API_KEY_MISSING") {
        errorMessage = "⚠️ **API 키 설정이 필요합니다.**\n\n프로젝트 루트에 `.env` 파일을 생성하고 `GEMINI_API_KEY`를 입력해 주세요. (예: `GEMINI_API_KEY=AIza...`)";
      } else if (error.message === "API_KEY_INVALID") {
        errorMessage = "❌ **유효하지 않은 API 키입니다.**\n\n입력하신 API 키가 정확한지, 혹은 할당량이 만료되지 않았는지 확인해 주세요.";
      } else if (error.message === "API_QUOTA_EXCEEDED") {
        errorMessage = "⏳ **API 할당량이 초과되었습니다.**\n\n현재 계정의 Google AI Studio 무료 할당량이 소진되었거나 설정되지 않았습니다. 할당량(Quota) 설정을 확인해 주세요.";
      } else if (error.message === "MODEL_NOT_FOUND") {
        errorMessage = "🔍 **모델을 찾을 수 없습니다.**\n\n사용 중인 API 키가 선택한 모델(`gemini-2.5-flash`)을 지원하지 않거나 설정이 잘못되었습니다.";
      }

      setMessages(prev => [...prev, { 
        role: "model", 
        text: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickMenus = [
    { icon: <BookOpen className="w-5 h-5" />, label: "여권 발급 안내", query: "아이 여권 처음 만드는데 준비물 알려줘" },
    { icon: <ShieldAlert className="w-5 h-5" />, label: "국가별 안전정보", query: "일본 여행 주의사항 알려줘" },
    { icon: <Globe className="w-5 h-5" />, label: "영사 조력 안내", query: "해외에서 여권을 잃어버렸을 때 대처법" },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE] to-[#DBEAFE] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/50 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-blue-50">
              <img 
                src="https://picsum.photos/seed/diply-face/200/200" 
                alt="Diply"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 flex items-center gap-1.5">
              디플리 AI 비서
              <Sparkles className="w-3 h-3 text-blue-500 fill-blue-500" />
            </h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">Ministry of Foreign Affairs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowKeyModal(true)} 
            className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-blue-600"
            title="API 키 설정"
          >
            <Key className="w-5 h-5" />
          </button>
          <a href="#/admin" className="text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all px-3 py-1.5 bg-white rounded-full shadow-sm border border-blue-100">
            관리자 모드
          </a>
          <button onClick={() => setMessages([messages[0]])} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-md relative z-10 shadow-2xl border border-blue-100"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Key className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-800">Gemini API 키 설정</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    챗봇 기능을 사용하려면 Gemini API 키가 필요합니다.<br/>
                    입력하신 키는 브라우저에만 안전하게 저장됩니다.
                  </p>
                </div>
                <div className="w-full space-y-4 pt-4">
                  <input 
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="API 키를 입력하세요"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowKeyModal(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all"
                    >
                      취소
                    </button>
                    <button 
                      onClick={saveApiKey}
                      disabled={!tempKey.trim()}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-blue-200"
                    >
                      저장하기
                    </button>
                  </div>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-[11px] text-blue-500 font-bold hover:underline"
                  >
                    API 키가 없으신가요? 여기서 무료로 발급받기
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
        {/* Welcome Section */}
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-56 h-56 relative z-10"
              >
                <img 
                  src="https://picsum.photos/seed/diply-full/500/500" 
                  alt="Diply Welcome"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-75 -z-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-blue-900 tracking-tight">"반가워요! 저는 디플리예요"</h2>
              <p className="text-sm text-blue-700/70 font-medium">대한민국 외교부가 여러분의 안전한 여행을 응원합니다</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md overflow-hidden border-2 border-white",
                msg.role === "user" ? "bg-blue-600 text-white" : "bg-white"
              )}>
                {msg.role === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <img 
                    src="https://picsum.photos/seed/diply-face/200/200" 
                    alt="Diply"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="space-y-2">
                <div className={cn(
                  "p-5 rounded-[24px] shadow-sm border",
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none border-blue-500" 
                    : "bg-white/90 backdrop-blur-sm text-slate-800 border-white rounded-tl-none"
                )}>
                  <div className="prose prose-slate max-w-none prose-sm prose-p:leading-relaxed prose-strong:text-blue-700">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>

                {/* Grounding Sources */}
                {msg.groundingMetadata?.groundingChunks && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.groundingMetadata.groundingChunks.map((chunk: any, cIdx: number) => (
                      chunk.web && (
                        <a
                          key={cIdx}
                          href={chunk.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] bg-white/80 hover:bg-white text-blue-600 font-bold px-4 py-2 rounded-full transition-all border border-blue-100 shadow-sm hover:shadow-md"
                        >
                          <Globe className="w-3 h-3" />
                          {chunk.web.title || "공식 정보 확인"}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center shrink-0 shadow-md overflow-hidden">
              <img 
                src="https://picsum.photos/seed/diply-face/200/200" 
                alt="Diply"
                className="w-full h-full object-cover animate-pulse"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-white p-5 rounded-[24px] rounded-tl-none shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              </div>
              <span className="text-[11px] text-blue-500 font-black uppercase tracking-widest">Diply is thinking</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Menu */}
      {messages.length === 1 && !isLoading && (
        <div className="px-6 pb-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickMenus.map((menu, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(menu.query);
                  handleSend();
                }}
                className="flex items-center justify-between p-5 bg-white/60 backdrop-blur-md border border-white rounded-3xl hover:bg-white hover:border-blue-300 hover:shadow-xl transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {menu.icon}
                  </div>
                  <span className="text-sm font-black text-slate-700">{menu.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-white/50 rounded-t-[40px] shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.08)] relative z-20">
        <form onSubmit={handleSend} className="relative flex items-center gap-4 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="디플리에게 무엇이든 물어보세요!"
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-[24px] px-8 py-5 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none font-medium"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              {/* Optional: Voice or Image buttons */}
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-5 rounded-[24px] transition-all shadow-xl",
              input.trim() && !isLoading 
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send className="w-7 h-7" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-1 h-1 bg-blue-300 rounded-full" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Ministry of Foreign Affairs AI Assistant
          </p>
          <div className="w-1 h-1 bg-blue-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
