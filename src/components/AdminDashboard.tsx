import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle,
  TrendingUp,
  Search,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  Sun,
  Moon
} from 'lucide-react';
import characterTech from '../assets/character_tech.png';
import characterEdu from '../assets/character_edu.png';

interface AdminDashboardProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const data = [
  { name: '여권/영사', value: 45 },
  { name: '안전정보', value: 30 },
  { name: '외교정책', value: 15 },
  { name: '기타', value: 10 },
];

const trendData = [
  { day: '월', count: 120 },
  { day: '화', count: 150 },
  { day: '수', count: 180 },
  { day: '목', count: 140 },
  { day: '금', count: 210 },
  { day: '토', count: 90 },
  { day: '일', count: 70 },
];

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

export default function AdminDashboard({ isDarkMode, toggleDarkMode }: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'settings'>('stats');
  
  // Settings State
  const [settings, setSettings] = useState({
    welcomeMessage: "안녕하세요! 대한민국 외교부 AI 비서입니다. 여권 발급, 영사 서비스, 국가별 안전 정보 등 궁금하신 내용을 물어보세요.",
    systemPrompt: "당신은 대한민국 외교부(MOFA)의 공식 AI 비서입니다. 외교부 홈페이지 정보를 최우선으로 검색하여 답변하세요.",
    safetyFilter: true,
    groundingEnabled: true,
    language: "ko"
  });

  const handleSaveSettings = () => {
    alert("설정이 성공적으로 저장되었습니다.");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      {/* Admin Header */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-8 py-4 flex items-center justify-between shrink-0 z-10 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border-2 border-blue-100 dark:border-slate-700 shadow-sm">
            <img src={characterTech} alt="MOFA Mascot" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">MOFA AI 관리자 센터</h2>
            <div className="flex gap-4 mt-1">
              <button 
                onClick={() => setActiveSubTab('stats')}
                className={`text-xs font-bold transition-all ${activeSubTab === 'stats' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                실시간 통계
              </button>
              <button 
                onClick={() => setActiveSubTab('settings')}
                className={`text-xs font-bold transition-all ${activeSubTab === 'settings' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                챗봇 설정 관리
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a href="#/" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            챗봇 서비스로 이동
          </a>
          <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20">
            AD
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {activeSubTab === 'stats' ? (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: '오늘의 질문', value: '1,284', icon: <MessageSquare className="w-6 h-6" />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: '활성 사용자', value: '856', icon: <Users className="w-6 h-6" />, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                { label: '답변 만족도', value: '94.2%', icon: <ThumbsUp className="w-6 h-6" />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                { label: '미해결 질문', value: '12', icon: <AlertCircle className="w-6 h-6" />, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 transition-transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3.5 rounded-2xl", stat.bg, stat.color)}>
                      {stat.icon}
                    </div>
                    <div className="flex items-center gap-1 text-green-500 font-bold text-xs bg-green-500/10 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +12%
                    </div>
                  </div>
                  <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1.5">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-slate-800 dark:text-white mb-8 text-lg">주요 질문 카테고리</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          borderColor: isDarkMode ? '#334155' : '#f1f5f9',
                          borderRadius: '16px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: isDarkMode ? '#f8fafc' : '#1e293b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-slate-800 dark:text-white mb-8 text-lg">일별 질문 트렌드</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      />
                      <Tooltip 
                        cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                          borderColor: isDarkMode ? '#334155' : '#f1f5f9',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                        }}
                        itemStyle={{ color: isDarkMode ? '#f8fafc' : '#1e293b', fontWeight: 700 }}
                      />
                      <Bar dataKey="count" fill={isDarkMode ? '#3b82f6' : '#2563eb'} radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Keywords */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800 dark:text-white text-lg">실시간 인기 검색어</h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full">
                  Updated Live
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {['여권 재발급', '일본 여행경보', '영사관 연락처', '비자 면제 국가', '해외 사건사고', '긴급 여권', '아포스티유', '재외국민 등록'].map((tag, i) => (
                  <span key={i} className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-[18px] text-xs font-black hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white cursor-pointer transition-all border border-slate-100 dark:border-slate-700/50 shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800 dark:text-white text-lg">기본 응대 설정</h3>
                </div>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  <Save className="w-4 h-4" />
                  설정 저장
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">환영 메시지</label>
                  <textarea 
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-[24px] text-sm text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none h-32 resize-none transition-all shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold italic px-1">사용자가 챗봇을 처음 열었을 때 표시되는 메시지입니다.</p>
                </div>
                <div className="relative p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/20 flex items-center gap-8 overflow-hidden group">
                  <div className="flex-1 relative z-10">
                    <h4 className="font-black text-blue-900 dark:text-blue-400 mb-2 text-lg">디플리 지능 가이드 🚀</h4>
                    <p className="text-xs text-blue-700/80 dark:text-blue-400/70 leading-relaxed font-bold">디플리의 답변 톤앤매너와 시스템 가이드를 설정하여<br/>사용자에게 더 따뜻한 경험을 선물해 주세요.</p>
                  </div>
                  <img src={characterEdu} alt="Mascot Edu" className="w-24 h-24 object-contain drop-shadow-2xl relative z-10 transition-transform group-hover:scale-110 duration-500" />
                  <div className="absolute right-0 top-0 w-32 h-32 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl -mr-10 -mt-10" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">시스템 프롬프트 (AI 성격)</label>
                  <textarea 
                    value={settings.systemPrompt}
                    onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-[24px] text-sm text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none h-40 resize-none transition-all shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold italic px-1">AI가 답변을 생성할 때 따르는 핵심 지침입니다.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800 dark:text-white text-lg">보안 및 기능 제어</h3>
                </div>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-[24px] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                  <div>
                    <p className="font-black text-slate-700 dark:text-slate-200 mb-0.5">민감어 필터링</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Safety & Privacy</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, safetyFilter: !settings.safetyFilter})}
                    className={`w-14 h-8 rounded-full transition-all relative ${settings.safetyFilter ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full font-black text-[8px] flex items-center justify-center transition-all ${settings.safetyFilter ? 'right-1.5' : 'left-1.5'}`}>
                      {settings.safetyFilter ? 'ON' : ''}
                    </div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-[24px] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                  <div>
                    <p className="font-black text-slate-700 dark:text-slate-200 mb-0.5">실시간 검색 연동</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Grounding Search</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, groundingEnabled: !settings.groundingEnabled})}
                    className={`w-14 h-8 rounded-full transition-all relative ${settings.groundingEnabled ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full font-black text-[8px] flex items-center justify-center transition-all ${settings.groundingEnabled ? 'right-1.5' : 'left-1.5'}`}>
                      {settings.groundingEnabled ? 'ON' : ''}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 pb-4">
              <button className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[24px] text-sm font-black text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900/30 transition-all">
                <RotateCcw className="w-4 h-4" />
                설정 초기화
              </button>
              <button onClick={handleSaveSettings} className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-[24px] text-sm font-black hover:bg-blue-700 shadow-2xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                최종 설정 적용하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for cn in this file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
