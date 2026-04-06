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
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

export default function AdminDashboard() {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'settings'>('stats');
  
  // Settings State
  const [settings, setSettings] = useState({
    welcomeMessage: "안녕하세요! 대한민국 외교부 AI 비서입니다. 여권 발급, 영사 서비스, 국가별 안전 정보 등 궁금하신 내용을 물어보세요.",
    systemPrompt: "당신은 대한민국 외교부(MOFA)의 공식 AI 비서입니다. 외교부 홈페이지 정보를 최우선으로 검색하여 답변하세요.",
    safetyFilter: true,
    groundingEnabled: true,
    language: "ko"
  });

  const [showSaveToast, setShowSaveToast] = useState(false);

  const handleSaveSettings = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 font-bold"
          >
            <ShieldCheck className="w-5 h-5" />
            설정이 성공적으로 저장되었습니다!
          </motion.div>
        )}
      </AnimatePresence>
      {/* Admin Header */}
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <SettingsIcon className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">MOFA AI 관리자 센터</h2>
            <div className="flex gap-4 mt-1">
              <button 
                onClick={() => setActiveSubTab('stats')}
                className={`text-xs font-medium transition-colors ${activeSubTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-slate-400 hover:text-slate-600'}`}
              >
                실시간 통계
              </button>
              <button 
                onClick={() => setActiveSubTab('settings')}
                className={`text-xs font-medium transition-colors ${activeSubTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-slate-400 hover:text-slate-600'}`}
              >
                챗봇 설정 관리
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-4 py-2 bg-slate-100 rounded-lg">
            챗봇 서비스로 이동
          </a>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
            AD
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {activeSubTab === 'stats' ? (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: '오늘의 질문', value: '1,284', icon: <MessageSquare className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: '활성 사용자', value: '856', icon: <Users className="w-6 h-6" />, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: '답변 만족도', value: '94.2%', icon: <ThumbsUp className="w-6 h-6" />, color: 'text-green-600', bg: 'bg-green-50' },
                { label: '미해결 질문', value: '12', icon: <AlertCircle className="w-6 h-6" />, color: 'text-red-600', bg: 'bg-red-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                      {stat.icon}
                    </div>
                    <TrendingUp className="text-green-500 w-4 h-4" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6">주요 질문 카테고리</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-xs text-slate-600">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6">일별 질문 트렌드</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Keywords */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">실시간 인기 검색어</h3>
                <Search className="text-slate-400 w-5 h-5" />
              </div>
              <div className="flex flex-wrap gap-3">
                {['여권 재발급', '일본 여행경보', '영사관 연락처', '비자 면제 국가', '해외 사건사고', '긴급 여권', '아포스티유', '재외국민 등록'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="text-blue-600 w-5 h-5" />
                  <h3 className="font-bold text-slate-800">기본 응대 설정</h3>
                </div>
                <button onClick={handleSaveSettings} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                  <Save className="w-4 h-4" />
                  저장하기
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">환영 메시지</label>
                  <textarea 
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
                    className="w-full p-4 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  />
                  <p className="text-xs text-slate-400">사용자가 챗봇을 처음 열었을 때 표시되는 메시지입니다.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">시스템 프롬프트 (AI 성격)</label>
                  <textarea 
                    value={settings.systemPrompt}
                    onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                    className="w-full p-4 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                  />
                  <p className="text-xs text-slate-400">AI가 답변을 생성할 때 따르는 핵심 지침입니다.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-green-600 w-5 h-5" />
                  <h3 className="font-bold text-slate-800">보안 및 기능 제어</h3>
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-700">민감어 필터링</p>
                    <p className="text-xs text-slate-400">부적절한 언어 및 민감 정보 차단</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, safetyFilter: !settings.safetyFilter})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.safetyFilter ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.safetyFilter ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-700">실시간 검색 (Grounding)</p>
                    <p className="text-xs text-slate-400">Google Search 연동 활성화</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, groundingEnabled: !settings.groundingEnabled})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.groundingEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.groundingEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                <RotateCcw className="w-4 h-4" />
                초기화
              </button>
              <button onClick={handleSaveSettings} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                설정 적용하기
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
