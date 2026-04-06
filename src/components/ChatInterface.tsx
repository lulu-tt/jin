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
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { sendMessage, ChatMessage } from '../services/gemini';
import { cn } from '../lib/utils';

import characterTech from '../assets/character_tech.png';

// 외교부 공식 캐릭터 '디플리(Diply)' 자산 적용 (아바타용으로만 사용)
const DIPLY_AVATAR = characterTech; 

interface ChatInterfaceProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, 50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, -80, 0],
        y: [0, 120, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-[100px]"
    />
  </div>
);

export default function ChatInterface({ isDarkMode, toggleDarkMode }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "안녕하세요! 저는 대한민국 외교부의 든든한 AI 비서, **디플리**예요! 🌍✨\n\n무엇을 도와드릴까요? 여권 발급부터 해외 안전 정보까지 무엇이든 물어보세요!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (query?: string) => {
    const textToSend = query || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!query) setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(textToSend, messages);
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
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0f172a] relative overflow-hidden transition-colors duration-500">
      <BackgroundBlobs />

      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/50 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-md overflow-hidden bg-blue-50 dark:bg-slate-800">
              <img 
                src={DIPLY_AVATAR} 
                alt="Diply"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              디플리 AI 비서
              <Sparkles className="w-3 h-3 text-blue-500 fill-blue-500 animate-pulse" />
            </h1>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase">Ministry of Foreign Affairs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-500 dark:text-slate-400"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a href="#/admin" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-blue-100 dark:border-slate-700">
            관리자 모드
          </a>
          <button onClick={() => setMessages([messages[0]])} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {/* Welcome Section */}
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-8"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-2xl rotate-3">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full -z-10 animate-pulse" />
            </div>
            <div className="space-y-4 max-w-lg">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                반가워요!<br/>
                저는 <span className="text-blue-600 dark:text-blue-400 underline decoration-blue-100 dark:decoration-blue-900 underline-offset-8">디플리</span>예요
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                당신의 스마트한 여행 파트너, 대한민국 외교부가<br/>
                여러분의 안전한 여정을 AI와 함께 응원합니다.
              </p>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%] md:max-w-[70%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden border-2 border-white dark:border-slate-800",
                msg.role === "user" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800"
              )}>
                {msg.role === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <img 
                    src={DIPLY_AVATAR} 
                    alt="Diply"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="space-y-3">
                <div className={cn(
                  "p-6 rounded-[32px] shadow-sm border transition-all",
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none border-blue-500 shadow-blue-200/50 dark:shadow-none" 
                    : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-slate-100 border-white/50 dark:border-slate-700/50 rounded-tl-none"
                )}>
                  <div className={cn(
                    "prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-blue-700 dark:prose-strong:text-blue-400 dark:prose-invert",
                    msg.role === "user" ? "text-white" : "text-slate-800 dark:text-slate-200"
                  )}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>

                {/* Grounding Sources */}
                {msg.groundingMetadata?.groundingChunks && (
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingMetadata.groundingChunks.map((chunk: any, cIdx: number) => (
                      chunk.web && (
                        <a
                          key={cIdx}
                          href={chunk.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[11px] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold px-4 py-2 rounded-xl transition-all border border-blue-100 dark:border-slate-700 shadow-sm"
                        >
                          <Globe className="w-3.5 h-3.5" />
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
          <div className="flex gap-4 mr-auto">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-800 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <img 
                src={DIPLY_AVATAR} 
                alt="Diply"
                className="w-full h-full object-cover animate-pulse"
              />
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-slate-700/50 p-6 rounded-[32px] rounded-tl-none shadow-sm flex items-center gap-4">
              <div className="flex gap-2">
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-blue-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-blue-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Diply is thinking</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Menu */}
      {messages.length === 1 && !isLoading && (
        <div className="px-6 pb-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {quickMenus.map((menu, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(menu.query)}
                className="flex items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-[32px] hover:bg-white dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all group text-left shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {menu.icon}
                  </div>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200">{menu.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-t border-white/30 dark:border-slate-800/30 rounded-t-[48px] shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.1)] dark:shadow-none relative z-20">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-4 max-w-5xl mx-auto">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="디플리에게 무엇이든 물어보세요!"
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent rounded-[28px] px-8 py-6 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-400 transition-all outline-none font-medium shadow-inner"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-6 rounded-[28px] transition-all shadow-2xl",
              input.trim() && !isLoading 
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-500/30" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            )}
          >
            <Send className="w-7 h-7" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-1.5 h-1.5 bg-blue-300 dark:bg-blue-700 rounded-full" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            Ministry of Foreign Affairs AI Assistant
          </p>
          <div className="w-1.5 h-1.5 bg-blue-300 dark:bg-blue-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
