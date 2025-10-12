import React, { useState } from 'react';
import { Search, Bell, HelpCircle, X, MessageSquare, FileText, Calendar, Database, BarChart3, Settings } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { ScrollArea } from './ui/scroll-area';

const searchItems = [
  { id: 'chat', title: 'Chat & Tư vấn bán hàng', icon: MessageSquare, description: 'Quản lý tin nhắn khách hàng' },
  { id: 'content', title: 'Làm nội dung', icon: FileText, description: 'Tạo nội dung với AI' },
  { id: 'auto-post', title: 'Tự động đăng bài', icon: Calendar, description: 'Lên lịch đăng bài' },
  { id: 'data', title: 'Quản lý dữ liệu', icon: Database, description: 'Quản lý Q&A và dữ liệu' },
  { id: 'reports', title: 'Báo cáo thống kê', icon: BarChart3, description: 'Xem thống kê chi tiết' },
  { id: 'settings', title: 'Cài đặt', icon: Settings, description: 'Cài đặt hệ thống' },
];

const notifications = [
  { id: 1, title: 'Tin nhắn mới từ khách hàng', description: 'Nguyễn Văn A vừa gửi tin nhắn', time: '2 phút trước', unread: true },
  { id: 2, title: 'Bài viết đã được đăng', description: 'Bài "Flash Sale 50%" đã đăng thành công', time: '1 giờ trước', unread: true },
  { id: 3, title: 'Báo cáo hàng ngày', description: 'Báo cáo thống kê ngày 11/10 đã sẵn sàng', time: '3 giờ trước', unread: true },
  { id: 4, title: 'Nội dung mới được tạo', description: 'AI đã tạo 5 nội dung mới', time: 'Hôm qua', unread: false },
];

const helpItems = [
  { title: 'Hướng dẫn sử dụng', description: 'Tìm hiểu cách sử dụng AI Agent' },
  { title: 'Video tutorials', description: 'Xem video hướng dẫn chi tiết' },
  { title: 'FAQs', description: 'Câu hỏi thường gặp' },
  { title: 'Liên hệ hỗ trợ', description: 'Nhận hỗ trợ từ team' },
];

interface DashboardHeaderProps {
  onNavigate?: (page: string) => void;
}

export function DashboardHeader({ onNavigate }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleNotificationClick = (notifId: number) => {
    // Đánh dấu đã đọc
    setNotificationList(prev => 
      prev.map(n => n.id === notifId ? { ...n, unread: false } : n)
    );
  };

  const handleViewAllNotifications = () => {
    setNotifOpen(false);
    alert('Chức năng xem tất cả thông báo');
  };

  const handleHelpItemClick = (title: string) => {
    setHelpOpen(false);
    if (title === 'Liên hệ hỗ trợ') {
      window.open('mailto:support@aiagent.com', '_blank');
    } else {
      alert(`Đang mở: ${title}`);
    }
  };

  const unreadCount = notificationList.filter(n => n.unread).length;

  const filteredItems = searchItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-8 h-[72px] flex items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <Input
              type="text"
              placeholder="Tìm kiếm tính năng, báo cáo..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setSearchOpen(true)}
              className="pl-11 pr-10 bg-slate-50/50 border-slate-200/60 h-11 text-sm rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {searchOpen && filteredItems.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-xl z-50">
              <ScrollArea className="max-h-96">
                <div className="p-2">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item.id)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ 
                            background: `rgba(var(--primary-color-rgb), 0.1)` 
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-6">
          {/* Notifications */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger className="relative h-11 w-11 hover:bg-slate-100 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-white text-[10px] border-2 border-white dark:border-slate-800 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)`
                  }}
                >
                  {unreadCount}
                </Badge>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 dark:bg-slate-800 dark:border-slate-700" align="end">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-900 dark:text-slate-100">Thông báo</h3>
                  {unreadCount > 0 && (
                    <Badge 
                      className="border-0 text-white"
                      style={{
                        background: `rgba(var(--primary-color-rgb), 0.15)`,
                        color: 'var(--primary-color)'
                      }}
                    >
                      {unreadCount} mới
                    </Badge>
                  )}
                </div>
              </div>
              <ScrollArea className="max-h-96">
                <div className="p-2">
                  {notificationList.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${
                        notif.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notif.unread ? 'bg-blue-600' : 'bg-slate-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{notif.description}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-slate-200">
                <button 
                  onClick={handleViewAllNotifications}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 px-4 rounded-lg transition-colors"
                >
                  Xem tất cả thông báo
                </button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Help */}
          <Popover open={helpOpen} onOpenChange={setHelpOpen}>
            <PopoverTrigger className="h-11 w-11 hover:bg-slate-100 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Trợ giúp & Hỗ trợ</h3>
              </div>
              <div className="p-2">
                {helpItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHelpItemClick(item.title)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-600 text-center">
                  Cần hỗ trợ? Email: <button 
                    onClick={() => window.open('mailto:support@aiagent.com', '_blank')}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    support@aiagent.com
                  </button>
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
