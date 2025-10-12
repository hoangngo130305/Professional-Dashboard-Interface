import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Send, Facebook, MessageCircle as Zalo, Send as Telegram, Globe, Search, Paperclip, Smile, MoreVertical, Star, Archive, UserCheck, Clock, CheckCheck, Sparkles, X, Zap, MessageSquare, User, Mail, Phone, MapPin, Calendar, Tag, TrendingUp, Activity, Hash, ShoppingCart } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

// Initial conversation data with messages for each
const initialConversationMessages: Record<number, any[]> = {
  1: [
    { id: 1, sender: 'customer', text: 'Cho tôi xem sản phẩm áo thun nam', time: '14:20', status: 'sent' },
    { id: 2, sender: 'ai', text: 'Chào bạn! Chúng tôi có nhiều mẫu áo thun nam đẹp. Bạn thích phong cách nào: basic, form rộng hay fitted?', time: '14:20', status: 'read' },
    { id: 3, sender: 'customer', text: 'Tôi muốn xem form rộng', time: '14:21', status: 'sent' },
    { id: 4, sender: 'ai', text: 'Dạ vâng! Hiện shop có 3 mẫu áo thun nam form rộng hot nhất:\n\n1. Áo thun Oversize Basic - 299K\n2. Áo thun Premium Cotton - 349K\n3. Áo thun Graphic Print - 389K\n\nBạn muốn xem chi tiết mẫu nào ạ?', time: '14:21', status: 'read', suggestions: ['Mẫu 1', 'Mẫu 2', 'Mẫu 3'] },
  ],
  2: [
    { id: 1, sender: 'customer', text: 'Shop ơi, giá sản phẩm bao nhiêu vậy?', time: '10:15', status: 'sent' },
    { id: 2, sender: 'ai', text: 'Xin chào! Tôi có thể giúp bạn kiểm tra giá. Bạn quan tâm đến sản phẩm nào ạ?', time: '10:16', status: 'read' },
    { id: 3, sender: 'customer', text: 'Giá bao nhiêu vậy shop?', time: '10:30', status: 'sent' },
  ],
  3: [
    { id: 1, sender: 'customer', text: 'Sản phẩm chất lượng tốt lắm', time: '09:00', status: 'sent' },
    { id: 2, sender: 'ai', text: 'Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi bạn hài lòng với sản phẩm. Chúc bạn sử dụng hiệu quả!', time: '09:01', status: 'read' },
    { id: 3, sender: 'customer', text: 'Cảm ơn shop nhé', time: '09:05', status: 'sent' },
  ],
  4: [
    { id: 1, sender: 'customer', text: 'Shop có giao hàng tận nơi không?', time: '08:30', status: 'sent' },
    { id: 2, sender: 'ai', text: 'Dạ có ạ! Shop hỗ trợ giao hàng toàn quốc. Bạn ở khu vực nào để shop tư vấn thời gian giao hàng nhé?', time: '08:31', status: 'read' },
    { id: 3, sender: 'customer', text: 'Có ship tận nơi không?', time: '08:45', status: 'sent' },
  ],
  5: [
    { id: 1, sender: 'customer', text: 'Xin chào shop', time: '07:00', status: 'sent' },
    { id: 2, sender: 'ai', text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?', time: '07:01', status: 'read' },
    { id: 3, sender: 'customer', text: 'Sản phẩm còn hàng không?', time: '07:15', status: 'sent' },
  ],
};

const initialConversations = [
  { id: 1, name: 'Nguyễn Văn A', platform: 'facebook', lastMessage: 'Cho tôi xem sản phẩm này', time: '2 phút trước', unread: 3, status: 'online', typing: false, starred: true, email: 'nguyenvana@email.com', phone: '0901234567', location: 'Hà Nội', joinDate: '15/09/2024', tags: ['VIP', 'Khách quen'], orderCount: 8, totalSpent: 5600000, archived: false, assignedTo: '' },
  { id: 2, name: 'Trần Thị B', platform: 'zalo', lastMessage: 'Giá bao nhiêu vậy shop?', time: '15 phút trước', unread: 1, status: 'offline', typing: true, starred: false, email: 'tranthib@email.com', phone: '0912345678', location: 'TP.HCM', joinDate: '20/10/2024', tags: ['Mới'], orderCount: 0, totalSpent: 0, archived: false, assignedTo: '' },
  { id: 3, name: 'Lê Văn C', platform: 'telegram', lastMessage: 'Cảm ơn shop nhé', time: '1 giờ trước', unread: 0, status: 'offline', typing: false, starred: false, email: 'levanc@email.com', phone: '0923456789', location: 'Đà Nẵng', joinDate: '10/08/2024', tags: ['Đã mua'], orderCount: 2, totalSpent: 1200000, archived: false, assignedTo: '' },
  { id: 4, name: 'Phạm Thị D', platform: 'website', lastMessage: 'Có ship tận nơi không?', time: '2 giờ trước', unread: 2, status: 'online', typing: false, starred: true, email: 'phamthid@email.com', phone: '0934567890', location: 'Cần Thơ', joinDate: '05/11/2024', tags: ['Hot'], orderCount: 3, totalSpent: 2800000, archived: false, assignedTo: '' },
  { id: 5, name: 'Hoàng Văn E', platform: 'facebook', lastMessage: 'Sản phẩm còn hàng không?', time: '3 giờ trước', unread: 0, status: 'offline', typing: false, starred: false, email: 'hoangvane@email.com', phone: '0945678901', location: 'Hải Phòng', joinDate: '01/09/2024', tags: ['Tiềm năng'], orderCount: 1, totalSpent: 450000, archived: false, assignedTo: '' },
];

const quickReplies = [
  { id: 1, text: 'Chào bạn! Tôi có thể giúp gì cho bạn?', icon: '👋', category: 'Chào hỏi' },
  { id: 2, text: 'Sản phẩm hiện đang còn hàng ạ', icon: '✅', category: 'Tồn kho' },
  { id: 3, text: 'Thời gian giao hàng 2-3 ngày', icon: '🚚', category: 'Vận chuyển' },
  { id: 4, text: 'Shop có chính sách đổi trả trong 7 ngày', icon: '🔄', category: 'Chính sách' },
  { id: 5, text: 'Bạn cần tư vấn size không ạ?', icon: '📏', category: 'Tư vấn' },
  { id: 6, text: 'Shop đang có chương trình giảm giá 20%', icon: '🎁', category: 'Khuyến mãi' },
];

const platformIcons = {
  facebook: Facebook,
  zalo: Zalo,
  telegram: Telegram,
  website: Globe,
};

const platformColors = {
  facebook: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
  zalo: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-400' },
  telegram: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-300' },
  website: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
};

export function ChatPage() {
  // Conversation management
  const [conversations, setConversations] = useState(initialConversations);
  const [conversationMessages, setConversationMessages] = useState<Record<number, any[]>>(initialConversationMessages);
  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  
  // Chat states
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showCustomerInfo, setShowCustomerInfo] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [aiAutoMode, setAiAutoMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Dialog states
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  
  // Form states
  const [selectedStaff, setSelectedStaff] = useState('');
  const [newTag, setNewTag] = useState('');
  const [customerTags, setCustomerTags] = useState<string[]>(selectedConv.tags || []);
  
  // Get current conversation messages
  const messageList = conversationMessages[selectedConv.id] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  // Switch conversation handler
  const handleSelectConversation = (conv: typeof conversations[0]) => {
    setSelectedConv(conv);
    setCustomerTags(conv.tags || []);
    
    // Mark as read
    if (conv.unread > 0) {
      setConversations(prev => prev.map(c => 
        c.id === conv.id ? { ...c, unread: 0 } : c
      ));
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentMessages = conversationMessages[selectedConv.id] || [];
    
    // Add user message
    const userMsg = {
      id: currentMessages.length + 1,
      sender: 'customer' as const,
      text: text,
      time: timeStr,
      status: 'sent' as const
    };
    
    setConversationMessages(prev => ({
      ...prev,
      [selectedConv.id]: [...(prev[selectedConv.id] || []), userMsg]
    }));
    
    // Update last message in conversation list
    setConversations(prev => prev.map(c => 
      c.id === selectedConv.id ? { ...c, lastMessage: text, time: 'Vừa xong' } : c
    ));
    
    setNewMessage('');
    setShowQuickReplies(false);
    
    // Simulate AI typing and response
    if (aiAutoMode) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiMsg = {
          id: currentMessages.length + 2,
          sender: 'ai' as const,
          text: 'Cảm ơn bạn đã nhắn tin! Tôi đã hiểu yêu cầu của bạn. Để tôi tư vấn chi tiết hơn: Bạn có thể cho tôi biết thêm thông tin về nhu cầu của bạn không ạ?',
          time: timeStr,
          status: 'read' as const
        };
        setConversationMessages(prev => ({
          ...prev,
          [selectedConv.id]: [...(prev[selectedConv.id] || []), aiMsg]
        }));
        toast.success('AI đã phản hồi tự động');
      }, 1500);
    }
  };

  const handleToggleStar = () => {
    const newStarred = !selectedConv.starred;
    setConversations(prev => prev.map(c => 
      c.id === selectedConv.id ? { ...c, starred: newStarred } : c
    ));
    setSelectedConv({...selectedConv, starred: newStarred});
    toast.success(newStarred ? '⭐ Đã gắn sao' : 'Đã bỏ gắn sao');
  };

  const handleAssignStaff = () => {
    if (!selectedStaff) {
      toast.error('Vui lòng chọn nhân viên');
      return;
    }
    setConversations(prev => prev.map(c => 
      c.id === selectedConv.id ? { ...c, assignedTo: selectedStaff } : c
    ));
    setSelectedConv({...selectedConv, assignedTo: selectedStaff});
    toast.success(`✅ Đã gán cho ${selectedStaff}`);
    setShowAssignDialog(false);
    setSelectedStaff('');
  };

  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error('Vui lòng nhập tag');
      return;
    }
    if (customerTags.includes(newTag.trim())) {
      toast.error('Tag này đã tồn tại');
      return;
    }
    const updatedTags = [...customerTags, newTag.trim()];
    setCustomerTags(updatedTags);
    setConversations(prev => prev.map(c => 
      c.id === selectedConv.id ? { ...c, tags: updatedTags } : c
    ));
    setSelectedConv({...selectedConv, tags: updatedTags});
    toast.success(`✅ Đã thêm tag "${newTag}"`);
    setNewTag('');
    setShowTagDialog(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = customerTags.filter(tag => tag !== tagToRemove);
    setCustomerTags(updatedTags);
    setConversations(prev => prev.map(c => 
      c.id === selectedConv.id ? { ...c, tags: updatedTags } : c
    ));
    setSelectedConv({...selectedConv, tags: updatedTags});
    toast.success(`🗑️ Đã xóa tag "${tagToRemove}"`);
  };

  const handleArchive = () => {
    setConversations(prev => prev.map(c => 
      c.id === selectedConv.id ? { ...c, archived: true } : c
    ));
    toast.success('📦 Đã lưu trữ cuộc hội thoại');
    setShowArchiveDialog(false);
    // Select another conversation if available
    const nonArchived = conversations.filter(c => c.id !== selectedConv.id && !c.archived);
    if (nonArchived.length > 0) {
      handleSelectConversation(nonArchived[0]);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    !conv.archived && (
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const unreadCount = conversations.filter(c => !c.archived && c.unread > 0).length;
  const starredCount = conversations.filter(c => !c.archived && c.starred).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            <h1 className="text-slate-900">Chat & Tư vấn bán hàng</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`gap-2 ${aiAutoMode ? 'bg-green-50 border-green-200' : ''}`}
              onClick={() => {
                setAiAutoMode(!aiAutoMode);
                toast.success(aiAutoMode ? 'Đã tắt AI Auto' : 'Đã bật AI Auto');
              }}
              title={aiAutoMode ? 'AI đang tự động trả lời' : 'AI đã tắt'}
            >
              <Sparkles className={`w-4 h-4 ${aiAutoMode ? 'text-green-600' : 'text-slate-400'}`} />
              AI Auto: {aiAutoMode ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
        <p className="text-slate-600 ml-5">Quản lý và trả lời tin nhắn tự động từ khách hàng đa nền tảng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tin nhắn hôm nay</p>
                <p className="text-slate-900 text-2xl mb-1">247</p>
                <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18%
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Đang chờ xử lý</p>
                <p className="text-slate-900 text-2xl mb-1">{unreadCount}</p>
                <Badge className="bg-orange-50 text-orange-700 border-0 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Cần xử lý
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tỷ lệ phản hồi</p>
                <p className="text-slate-900 text-2xl mb-1">98.5%</p>
                <Badge className="bg-green-50 text-green-700 border-0 text-xs">
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Xuất sắc
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Thời gian phản hồi TB</p>
                <p className="text-slate-900 text-2xl mb-1">23s</p>
                <Badge className="bg-purple-50 text-purple-700 border-0 text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Siêu nhanh
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-12 gap-4">
        {/* Conversations List */}
        <div className={showCustomerInfo ? 'col-span-3' : 'col-span-4'}>
          <Card className="border-slate-200/60 h-[680px] flex flex-col shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100 bg-gradient-to-br from-slate-50/50 to-white">
              <div className="flex items-center justify-between mb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Hội thoại
                </CardTitle>
                <Badge className="bg-blue-50 text-blue-700 border-0">
                  {unreadCount} mới
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Tìm kiếm theo tên, tin nhắn..." 
                  className="pl-10 bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <Tabs defaultValue="all" className="h-full flex flex-col">
                <TabsList className="mx-3 mt-3 bg-slate-50">
                  <TabsTrigger value="all" className="text-xs">
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    Chưa đọc ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="starred" className="text-xs gap-1">
                    <Star className="w-3 h-3" />
                    ({starredCount})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="flex-1 overflow-hidden mt-2">
                  <ScrollArea className="h-full">
                    <div className="px-3 pb-4 space-y-2">
                      {filteredConversations.map((conv) => {
                        const Icon = platformIcons[conv.platform as keyof typeof platformIcons];
                        const colors = platformColors[conv.platform as keyof typeof platformColors];
                        const isSelected = selectedConv.id === conv.id;
                        
                        return (
                          <div
                            key={conv.id}
                            onClick={() => handleSelectConversation(conv)}
                            className={`relative p-3 rounded-xl cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm' 
                                : 'hover:bg-slate-50 border-transparent'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                  <AvatarFallback className={`${colors.bg} ${colors.text} font-semibold`}>
                                    {conv.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${colors.bg}`}>
                                  <Icon className={`w-2.5 h-2.5 ${colors.text}`} />
                                </div>
                                {conv.status === 'online' && (
                                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{conv.name}</p>
                                    {conv.starred && (
                                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-400">{conv.time}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  {conv.typing ? (
                                    <span className="flex items-center gap-1.5 text-blue-600 text-xs">
                                      <span className="flex gap-0.5">
                                        <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                      </span>
                                      đang nhập...
                                    </span>
                                  ) : (
                                    <p className={`text-xs truncate flex-1 ${
                                      conv.unread > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'
                                    }`}>
                                      {conv.lastMessage}
                                    </p>
                                  )}
                                  {conv.unread > 0 && (
                                    <Badge className="ml-2 bg-blue-600 text-white text-[10px] h-5 min-w-[20px] px-1.5 shadow-sm">
                                      {conv.unread}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="unread" className="flex-1 overflow-hidden mt-2">
                  <ScrollArea className="h-full">
                    <div className="px-3 pb-4">
                      {conversations.filter(c => c.unread > 0).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-60 text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <CheckCheck className="w-8 h-8 text-green-600" />
                          </div>
                          <p className="font-medium text-slate-900 mb-1">Không có tin nhắn mới</p>
                          <p className="text-sm text-slate-500">Bạn đã đọc hết tin nhắn</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {conversations.filter(c => !c.archived && c.unread > 0).map((conv) => {
                            const Icon = platformIcons[conv.platform as keyof typeof platformIcons];
                            const colors = platformColors[conv.platform as keyof typeof platformColors];
                            
                            return (
                              <div
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv)}
                                className="p-3 rounded-xl cursor-pointer border border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 hover:shadow-sm transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="relative flex-shrink-0">
                                    <Avatar className="w-12 h-12">
                                      <AvatarFallback className={`${colors.bg} ${colors.text}`}>
                                        {conv.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${colors.bg}`}>
                                      <Icon className={`w-2.5 h-2.5 ${colors.text}`} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-sm font-semibold text-slate-900">{conv.name}</p>
                                      <Badge className="bg-blue-600 text-white text-[10px]">{conv.unread}</Badge>
                                    </div>
                                    <p className="text-xs text-slate-700 font-medium truncate">{conv.lastMessage}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="starred" className="flex-1 overflow-hidden mt-2">
                  <ScrollArea className="h-full">
                    <div className="px-3 pb-4">
                      {conversations.filter(c => c.starred).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-60 text-center">
                          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                            <Star className="w-8 h-8 text-yellow-600" />
                          </div>
                          <p className="font-medium text-slate-900 mb-1">Chưa có cuộc hội thoại nào</p>
                          <p className="text-sm text-slate-500">Gắn sao để lưu lại</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {conversations.filter(c => !c.archived && c.starred).map((conv) => {
                            const Icon = platformIcons[conv.platform as keyof typeof platformIcons];
                            const colors = platformColors[conv.platform as keyof typeof platformColors];
                            
                            return (
                              <div
                                key={conv.id}
                                onClick={() => handleSelectConversation(conv)}
                                className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="relative flex-shrink-0">
                                    <Avatar className="w-12 h-12">
                                      <AvatarFallback className={`${colors.bg} ${colors.text}`}>
                                        {conv.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${colors.bg}`}>
                                      <Icon className={`w-2.5 h-2.5 ${colors.text}`} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-medium text-slate-900">{conv.name}</p>
                                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chat Messages */}
        <div className={showCustomerInfo ? 'col-span-6' : 'col-span-8'}>
          <Card className="border-slate-200/60 h-[680px] flex flex-col shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4 bg-gradient-to-br from-slate-50/50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarFallback className={`${platformColors[selectedConv.platform as keyof typeof platformColors].bg} ${platformColors[selectedConv.platform as keyof typeof platformColors].text} font-semibold`}>
                      {selectedConv.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConv.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${platformColors[selectedConv.platform as keyof typeof platformColors].border} capitalize`}>
                        {selectedConv.platform}
                      </Badge>
                      {selectedConv.status === 'online' ? (
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          Online
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Offline</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={handleToggleStar}
                    title={selectedConv.starred ? "Bỏ gắn sao" : "Gắn sao"}
                  >
                    <Star className={selectedConv.starred ? "w-4 h-4 fill-yellow-400 text-yellow-400" : "w-4 h-4"} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => setShowArchiveDialog(true)}
                    title="Lưu trữ cuộc hội thoại"
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                  >
                    {showCustomerInfo ? <X className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </Button>
                  {aiAutoMode && (
                    <Badge className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Auto
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 bg-gradient-to-br from-slate-50/30 to-blue-50/20">
              <ScrollArea className="h-full p-5">
                <div className="space-y-5">
                  {messageList.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'} group`}>
                      <div className={`max-w-[75%] ${msg.sender === 'customer' ? '' : 'flex flex-col items-end'}`}>
                        {msg.sender === 'ai' && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs text-slate-600 font-semibold">AI Assistant</span>
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3.5 shadow-md ${
                            msg.sender === 'customer'
                              ? 'bg-white text-slate-900 border border-slate-200'
                              : 'bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-white'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                        </div>
                        {msg.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.suggestions.map((sug: string, idx: number) => (
                              <Button 
                                key={idx} 
                                size="sm" 
                                variant="outline" 
                                className="text-xs px-3 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-xl shadow-sm"
                                onClick={() => sendMessage(sug)}
                              >
                                {sug}
                              </Button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-400">{msg.time}</span>
                          {msg.sender === 'ai' && msg.status === 'read' && (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="max-w-[75%]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-slate-600 font-medium">AI đang nhập...</span>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl px-4 py-3 shadow-sm">
                          <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="p-4 border-t border-slate-100 bg-white">
              {/* Quick Replies */}
              {showQuickReplies && (
                <div className="mb-3 p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <p className="font-semibold text-slate-900">Câu trả lời nhanh</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => setShowQuickReplies(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => sendMessage(reply.text)}
                        className="text-left px-3 py-2.5 text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all shadow-sm group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{reply.icon}</span>
                          <Badge variant="outline" className="text-[10px] border-slate-300">
                            {reply.category}
                          </Badge>
                        </div>
                        <p className="text-slate-700 group-hover:text-slate-900">{reply.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    title="Đính kèm file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    title="Chọn emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={showQuickReplies ? "default" : "ghost"}
                    size="icon" 
                    className={`h-10 w-10 ${showQuickReplies ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    title="Câu trả lời nhanh"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
                <Input 
                  placeholder="Nhập tin nhắn hoặc để AI tự động trả lời..." 
                  className="flex-1 h-10 border-slate-200 bg-slate-50/50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(newMessage);
                    }
                  }}
                />
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-10 w-10 shadow-lg shadow-blue-500/30"
                  size="icon"
                  onClick={() => sendMessage(newMessage)}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  {aiAutoMode ? 'AI đang tự động trả lời' : 'AI đã tắt'}. Nhấn Enter để gửi
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Customer Info Panel */}
        {showCustomerInfo && (
          <div className="col-span-3">
            <Card className="border-slate-200/60 h-[680px] shadow-sm flex flex-col">
              <CardHeader className="border-b border-slate-100 pb-4 flex-shrink-0 bg-gradient-to-br from-slate-50/50 to-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {/* Customer Avatar & Name */}
                  <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/50">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white text-2xl font-bold">
                        {selectedConv.name.split(' ').pop()?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{selectedConv.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${platformColors[selectedConv.platform as keyof typeof platformColors].border} ${platformColors[selectedConv.platform as keyof typeof platformColors].text}`}
                      >
                        {selectedConv.platform}
                      </Badge>
                      {selectedConv.status === 'online' ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                          Online
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-300">Offline</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {customerTags?.map((tag, idx) => (
                        <Badge key={idx} className="bg-purple-50 text-purple-700 border-purple-200 group cursor-pointer hover:bg-purple-100 transition-colors">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 p-4 border-b border-slate-100 bg-gradient-to-br from-blue-50/30 to-purple-50/20">
                    <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <ShoppingCart className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-slate-900">{selectedConv.orderCount}</p>
                      <p className="text-xs text-slate-600">Đơn hàng</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <Activity className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xl font-bold text-slate-900">{(selectedConv.totalSpent / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-slate-600">Tổng chi</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 space-y-3">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Thông tin liên hệ
                    </h4>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-0.5">Email</p>
                          <p className="text-xs text-slate-900 font-medium truncate">{selectedConv.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-0.5">Điện thoại</p>
                          <p className="text-xs text-slate-900 font-medium">{selectedConv.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-0.5">Địa chỉ</p>
                          <p className="text-xs text-slate-900 font-medium">{selectedConv.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-0.5">Ngày tham gia</p>
                          <p className="text-xs text-slate-900 font-medium">{selectedConv.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-slate-100 space-y-2">
                    <h4 className="font-semibold text-slate-900 mb-3">Hành động</h4>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2 text-sm hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => setShowAssignDialog(true)}
                    >
                      <UserCheck className="w-4 h-4" />
                      Gán nhân viên
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2 text-sm hover:bg-purple-50 hover:border-purple-300"
                      onClick={() => setShowTagDialog(true)}
                    >
                      <Tag className="w-4 h-4" />
                      Thêm tag
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2 text-sm hover:bg-orange-50 hover:border-orange-300"
                      onClick={() => setShowArchiveDialog(true)}
                    >
                      <Archive className="w-4 h-4" />
                      Lưu trữ
                    </Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Assign Staff Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Gán nhân viên
            </DialogTitle>
            <DialogDescription>
              Chọn nhân viên để xử lý cuộc hội thoại với {selectedConv.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="staff">Nhân viên</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Chọn nhân viên..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nguyễn Văn A">Nguyễn Văn A - Sale</SelectItem>
                  <SelectItem value="Trần Thị B">Trần Thị B - Marketing</SelectItem>
                  <SelectItem value="Lê Văn C">Lê Văn C - Support</SelectItem>
                  <SelectItem value="Phạm Thị D">Phạm Thị D - Sale Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 Nhân viên được gán sẽ nhận thông báo và có thể xử lý cuộc hội thoại này.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAssignStaff} className="bg-blue-600 hover:bg-blue-700">
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-600" />
              Thêm tag
            </DialogTitle>
            <DialogDescription>
              Thêm tag để phân loại khách hàng {selectedConv.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tag">Tag mới</Label>
              <Input
                id="tag"
                placeholder="Nhập tên tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tag hiện tại</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[60px]">
                {customerTags.length === 0 ? (
                  <p className="text-xs text-slate-400">Chưa có tag nào</p>
                ) : (
                  customerTags.map((tag, idx) => (
                    <Badge key={idx} className="bg-purple-50 text-purple-700 border-purple-200 group cursor-pointer">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-purple-700 mb-2 font-medium">💡 Gợi ý tag:</p>
              <div className="flex flex-wrap gap-1.5">
                {['VIP', 'Khách quen', 'Tiềm năng', 'Hot', 'Đã mua'].map((suggestedTag) => (
                  <button
                    key={suggestedTag}
                    onClick={() => setNewTag(suggestedTag)}
                    className="text-xs px-2 py-1 bg-white border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
                  >
                    {suggestedTag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              Đóng
            </Button>
            <Button onClick={handleAddTag} className="bg-purple-600 hover:bg-purple-700">
              Thêm tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-orange-600" />
              Lưu trữ cuộc hội thoại
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn lưu trữ cuộc hội thoại với {selectedConv.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 mb-2">
                📦 Cuộc hội thoại sẽ được chuyển vào mục "Đã lưu trữ"
              </p>
              <ul className="text-xs text-orange-700 space-y-1 ml-4 list-disc">
                <li>Bạn vẫn có thể xem lại cuộc hội thoại</li>
                <li>Không nhận thông báo tin nhắn mới</li>
                <li>Có thể khôi phục bất cứ lúc nào</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleArchive} className="bg-orange-600 hover:bg-orange-700">
              Xác nhận lưu trữ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
