import React from 'react';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Database, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'chat', label: 'Chat & Tư vấn bán hàng', icon: MessageSquare },
  { id: 'content', label: 'Làm nội dung', icon: FileText },
  { id: 'auto-post', label: 'Tự động đăng bài', icon: Calendar },
  { id: 'data', label: 'Quản lý dữ liệu', icon: Database },
  { id: 'reports', label: 'Báo cáo thống kê', icon: BarChart3 },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 h-screen fixed left-0 top-0 flex flex-col shadow-xl shadow-slate-200/50 dark:bg-slate-800/80 dark:border-slate-700/60">
      {/* Logo Section */}
      <div className="px-6 h-[72px] flex items-center border-b border-slate-200/60 dark:border-slate-700/60" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-color-rgb, 59, 130, 246), 0.05) 0%, rgba(var(--primary-color-rgb, 59, 130, 246), 0.02) 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-md opacity-40 animate-pulse primary-accent"></div>
            <div className="relative w-11 h-11 rounded-xl flex items-center justify-center shadow-xl primary-accent">
              <MessageSquare className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-xl leading-tight" style={{ 
              background: `linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              AI Agent
            </h1>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-tight mt-0.5">Marketing & Sales</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm group",
                    isActive
                      ? "text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                  )}
                  style={isActive ? {
                    background: `linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)`,
                    boxShadow: `0 10px 25px -5px rgba(var(--primary-color-rgb), 0.3)`
                  } : {}}
                >
                  <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-white")} />
                  <span className="font-semibold">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-700 cursor-pointer transition-all duration-200 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg primary-accent">
            <span className="text-white text-sm">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-900 dark:text-slate-100 truncate transition-colors" style={{ color: 'var(--foreground)' }}>Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@aiagent.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
