import React, { useState, createContext, useContext } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { FeatureCard } from './components/FeatureCard';
import { StatsOverview } from './components/StatsOverview';
import { ChatPage } from './components/pages/ChatPage';
import { ContentPage } from './components/pages/ContentPage';
import { AutoPostPage } from './components/pages/AutoPostPage';
import { DataManagementPage } from './components/pages/DataManagementPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Toaster } from './components/ui/sonner';
import { 
  MessageSquare, 
  FileText, 
  Calendar, 
  Database,
  Sparkles,
  Image as ImageIcon,
  Video,
  Facebook,
  Send,
  MessageCircle,
  BarChart3
} from 'lucide-react';

// Settings Context
type SettingsContextType = {
  businessName: string;
  setBusinessName: (name: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // Settings State
  const [businessName, setBusinessName] = useState('Shop ABC');
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('blue');
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState('vi');
  
  // Apply theme to body
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Apply primary color
  React.useEffect(() => {
    const colorMap: Record<string, { main: string; dark: string; rgb: string }> = {
      blue: { main: '#3b82f6', dark: '#2563eb', rgb: '59, 130, 246' },
      green: { main: '#10b981', dark: '#059669', rgb: '16, 185, 129' },
      purple: { main: '#8b5cf6', dark: '#7c3aed', rgb: '139, 92, 246' },
      orange: { main: '#f97316', dark: '#ea580c', rgb: '249, 115, 22' },
      pink: { main: '#ec4899', dark: '#db2777', rgb: '236, 72, 153' },
    };
    const colors = colorMap[primaryColor] || colorMap.blue;
    document.documentElement.style.setProperty('--primary-color', colors.main);
    document.documentElement.style.setProperty('--primary-color-dark', colors.dark);
    document.documentElement.style.setProperty('--primary-color-rgb', colors.rgb);
  }, [primaryColor]);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'chat':
        return <ChatPage />;
      case 'content':
        return <ContentPage />;
      case 'auto-post':
        return <AutoPostPage />;
      case 'data':
        return <DataManagementPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  const features = [
    {
      title: 'Chat và tư vấn bán hàng',
      description: 'Trợ lý AI thông minh hỗ trợ tư vấn và chốt đơn tự động',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-blue-600',
      badge: 'Phổ biến',
      features: [
        'Chat ngôn ngữ tự nhiên trên Facebook, Zalo, Telegram, Website',
        'Hiểu ý định khách hàng và gợi ý sản phẩm phù hợp',
        'Tự động tạo lead và hỗ trợ chốt đơn hàng',
        'Phản hồi nhanh 24/7 với độ chính xác cao'
      ]
    },
    {
      title: 'Làm nội dung',
      description: 'Tạo nội dung marketing chuyên nghiệp với AI',
      icon: FileText,
      gradient: 'from-purple-500 to-purple-600',
      features: [
        'Viết bài Blog, bài bán hàng chuẩn SEO',
        'Tạo hình ảnh quảng cáo theo chủ đề và phong cách',
        'Tạo kịch bản video ngắn với AI',
        'Tạo giọng nói và âm thanh cho video'
      ]
    },
    {
      title: 'Tự động đăng bài',
      description: 'Lên lịch và đăng bài tự động trên mạng xã hội',
      icon: Calendar,
      gradient: 'from-green-500 to-green-600',
      features: [
        'Lên lịch đăng bài tự động theo khung giờ tối ưu',
        'Đăng đa nền tảng: Facebook, Instagram, Zalo, Telegram',
        'Tự động trả lời bình luận theo từ khóa',
        'Quản lý chiến dịch marketing hiệu quả'
      ]
    },
    {
      title: 'Quản lý dữ liệu',
      description: 'Lưu trữ và quản lý dữ liệu thông minh',
      icon: Database,
      gradient: 'from-orange-500 to-orange-600',
      features: [
        'Lưu toàn bộ dữ liệu Q&A và phản hồi khách hàng',
        'AI tra cứu dữ liệu để trả lời chính xác',
        'Quản lý hội thoại trên các nền tảng mạng xã hội',
        'Dashboard thống kê và phân tích chi tiết'
      ]
    }
  ];

  function HomePage() {
    return (
      <>
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
            <h1 className="text-slate-900 dark:text-white">
              Chào mừng đến với {businessName}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-5">
            Nền tảng AI toàn diện cho Marketing và Bán hàng của bạn
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
            <h2 className="text-slate-900 dark:text-white">Tổng quan thống kê</h2>
          </div>
          <StatsOverview />
        </div>

        {/* Features Grid */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
            <h2 className="text-slate-900 dark:text-white">Tính năng chính</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} onClick={() => {
                const tabMap: Record<string, string> = {
                  'Chat và tư vấn bán hàng': 'chat',
                  'Làm nội dung': 'content',
                  'Tự động đăng bài': 'auto-post',
                  'Quản lý dữ liệu': 'data'
                };
                setActiveTab(tabMap[feature.title] || 'home');
              }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const settingsValue = {
    businessName,
    setBusinessName,
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
    compactMode,
    setCompactMode,
    language,
    setLanguage,
  };

  return (
    <SettingsContext.Provider value={settingsValue}>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50'
      }`}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="ml-64">
          <DashboardHeader onNavigate={setActiveTab} />
          
          <main className={`transition-all duration-300 ${compactMode ? 'p-4' : 'p-8'}`}>
            {renderPage()}
          </main>
        </div>
        
        <Toaster position="top-right" richColors />
      </div>
    </SettingsContext.Provider>
  );
}
