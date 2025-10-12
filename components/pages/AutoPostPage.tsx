import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar as CalendarIcon, Clock, Facebook, Instagram, Send as Telegram, CheckCircle, XCircle, Loader, TrendingUp, Plus, Edit3, Trash2, Eye, Heart, MessageCircle, Share2, BarChart3, Settings2, Zap, Users, Globe, Image as ImageIcon, Video, FileText, ChevronDown, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

type ScheduledPost = {
  id: number;
  content: string;
  platforms: string[];
  scheduledTime: string;
  date: string;
  time: string;
  status: string;
  type: string;
  image: string | null;
};

type PublishedPost = {
  id: number;
  content: string;
  platforms: string[];
  publishedTime: string;
  stats: { views: number; likes: number; comments: number; shares: number };
  status: string;
  type: string;
};

type Campaign = {
  id: number;
  name: string;
  posts: number;
  status: 'active' | 'paused';
  reach: string;
};

const initialScheduledPosts: ScheduledPost[] = [
  {
    id: 1,
    content: 'Flash Sale hôm nay - Giảm 50% toàn bộ sản phẩm! 🎉 Nhanh tay đặt hàng ngay để nhận ưu đãi cực khủng...',
    platforms: ['facebook', 'instagram'],
    scheduledTime: '14:00 - Hôm nay',
    date: '2025-01-11',
    time: '14:00',
    status: 'pending',
    type: 'sale',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
  },
  {
    id: 2,
    content: 'Giới thiệu BST mới - Xu hướng thời trang 2025 🌟 Những thiết kế độc đáo, phong cách hiện đại...',
    platforms: ['facebook', 'telegram', 'instagram'],
    scheduledTime: '18:00 - Hôm nay',
    date: '2025-01-11',
    time: '18:00',
    status: 'pending',
    type: 'product',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  },
  {
    id: 3,
    content: 'Review sản phẩm từ khách hàng - Cảm ơn bạn đã tin tưởng và ủng hộ shop! ❤️',
    platforms: ['instagram'],
    scheduledTime: '10:00 - Ngày mai',
    date: '2025-01-12',
    time: '10:00',
    status: 'scheduled',
    type: 'review',
    image: null,
  },
];

const initialPublishedPosts: PublishedPost[] = [
  {
    id: 1,
    content: 'Chào buổi sáng! Hôm nay shop có ưu đãi đặc biệt dành cho bạn ☀️',
    platforms: ['facebook', 'instagram'],
    publishedTime: '09:00 - Hôm nay',
    stats: { views: 1234, likes: 89, comments: 23, shares: 12 },
    status: 'published',
    type: 'promotion',
  },
  {
    id: 2,
    content: 'Top 5 sản phẩm bán chạy nhất tuần này 🔥 Bạn đã sở hữu chưa?',
    platforms: ['facebook'],
    publishedTime: '08:00 - Hôm qua',
    stats: { views: 2341, likes: 145, comments: 34, shares: 28 },
    status: 'published',
    type: 'blog',
  },
  {
    id: 3,
    content: 'Cảm ơn các bạn đã ủng hộ shop trong thời gian qua! 🙏',
    platforms: ['facebook', 'instagram', 'telegram'],
    publishedTime: '20:00 - 2 ngày trước',
    stats: { views: 3456, likes: 234, comments: 67, shares: 45 },
    status: 'published',
    type: 'thank',
  },
];

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Flash Sale Cuối Tuần', posts: 12, status: 'active', reach: '15.2K' },
  { id: 2, name: 'Giới Thiệu Sản Phẩm Mới', posts: 8, status: 'active', reach: '8.5K' },
  { id: 3, name: 'Review Khách Hàng', posts: 5, status: 'paused', reach: '3.2K' },
];

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  telegram: Telegram,
  zalo: Globe,
};

const platformColors = {
  facebook: 'bg-blue-50 text-blue-700 border-blue-200',
  instagram: 'bg-pink-50 text-pink-700 border-pink-200',
  telegram: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  zalo: 'bg-blue-50 text-blue-800 border-blue-300',
};

export function AutoPostPage() {
  // State management
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(initialScheduledPosts);
  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>(initialPublishedPosts);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [selectedPublishedPost, setSelectedPublishedPost] = useState<PublishedPost | null>(null);
  
  // Form states
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook']);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('14:00');
  const [postType, setPostType] = useState('sale');
  
  // Settings states
  const [autoReply, setAutoReply] = useState(true);
  const [optimizeTime, setOptimizeTime] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);

  // Stats calculations
  const totalScheduled = scheduledPosts.length;
  const todayPublished = publishedPosts.filter(p => p.publishedTime.includes('Hôm nay')).length;
  const totalInteractions = publishedPosts.reduce((sum, p) => sum + p.stats.likes + p.stats.comments + p.stats.shares, 0);
  const successRate = '98.5%';

  // Auto-reply effect
  useEffect(() => {
    if (autoReply) {
      toast.info('Tự động trả lời bình luận đã bật', { duration: 2000 });
    }
  }, [autoReply]);

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast.error('Vui lòng nhập nội dung bài đăng');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nền tảng');
      return;
    }
    if (!scheduleDate) {
      toast.error('Vui lòng chọn ngày đăng');
      return;
    }

    // Format date for display
    const [year, month, day] = scheduleDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const scheduledTimeDisplay = `${scheduleTime} - ${formattedDate}`;

    // Create new post
    const newPost: ScheduledPost = {
      id: Date.now(),
      content: postContent,
      platforms: selectedPlatforms,
      scheduledTime: scheduledTimeDisplay,
      date: scheduleDate,
      time: scheduleTime,
      status: 'pending',
      type: postType,
      image: null,
    };

    setScheduledPosts([newPost, ...scheduledPosts]);

    toast.success('Đã tạo lịch đăng bài thành công!', {
      description: `Bài viết sẽ được đăng vào ${formattedDate} lúc ${scheduleTime}`
    });
    
    setShowCreateDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setPostContent('');
    setSelectedPlatforms(['facebook']);
    setScheduleDate('');
    setScheduleTime('14:00');
    setPostType('sale');
  };

  const handleEditPost = (post: ScheduledPost) => {
    setSelectedPost(post);
    setPostContent(post.content);
    setSelectedPlatforms(post.platforms);
    setScheduleDate(post.date);
    setScheduleTime(post.time);
    setPostType(post.type);
    setShowEditDialog(true);
  };

  const handleUpdatePost = () => {
    if (!selectedPost) return;

    if (!postContent.trim()) {
      toast.error('Vui lòng nhập nội dung bài đăng');
      return;
    }

    const [year, month, day] = scheduleDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const scheduledTimeDisplay = `${scheduleTime} - ${formattedDate}`;

    const updatedPosts = scheduledPosts.map(post =>
      post.id === selectedPost.id
        ? {
            ...post,
            content: postContent,
            platforms: selectedPlatforms,
            scheduledTime: scheduledTimeDisplay,
            date: scheduleDate,
            time: scheduleTime,
            type: postType,
          }
        : post
    );

    setScheduledPosts(updatedPosts);
    toast.success('Đã cập nhật bài đăng');
    setShowEditDialog(false);
    setSelectedPost(null);
    resetForm();
  };

  const handleDeletePost = (id: number) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
    toast.success('Đã xóa bài đăng khỏi lịch');
  };

  const handlePublishNow = (post: ScheduledPost) => {
    // Remove from scheduled
    setScheduledPosts(scheduledPosts.filter(p => p.id !== post.id));

    // Add to published with mock stats
    const newPublishedPost: PublishedPost = {
      id: Date.now(),
      content: post.content,
      platforms: post.platforms,
      publishedTime: 'Vừa xong',
      stats: { views: 0, likes: 0, comments: 0, shares: 0 },
      status: 'published',
      type: post.type,
    };

    setPublishedPosts([newPublishedPost, ...publishedPosts]);
    toast.success('Đã đăng bài thành công!', {
      description: 'Bài viết đang được phát trên các nền tảng đã chọn'
    });
  };

  const handleViewDetail = (post: PublishedPost) => {
    setSelectedPublishedPost(post);
    setShowDetailDialog(true);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleCampaignStatus = (id: number) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
    
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      toast.success(
        campaign.status === 'active' 
          ? `Đã tạm dừng chiến dịch "${campaign.name}"` 
          : `Đã kích hoạt chiến dịch "${campaign.name}"`
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
            <h1 className="text-slate-900">Tự động đăng bài</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCampaignDialog(true)}
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Chiến dịch
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Tạo lịch đăng
            </Button>
          </div>
        </div>
        <p className="text-slate-600 ml-5">Lên lịch và quản lý đăng bài trên các nền tảng mạng xã hội</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Đã lên lịch</p>
                <p className="text-slate-900 text-2xl">{totalScheduled}</p>
                <Badge className="mt-2 bg-orange-50 text-orange-700 border-0 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {scheduledPosts.filter(p => p.scheduledTime.includes('Hôm nay')).length} hôm nay
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Đã đăng hôm nay</p>
                <p className="text-slate-900 text-2xl">{todayPublished}</p>
                <Badge className="mt-2 bg-green-50 text-green-700 border-0 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Thành công
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tỷ lệ thành công</p>
                <p className="text-slate-900 text-2xl">{successRate}</p>
                <Badge className="mt-2 bg-emerald-50 text-emerald-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Xuất sắc
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tổng tương tác</p>
                <p className="text-slate-900 text-2xl">{(totalInteractions / 1000).toFixed(1)}K</p>
                <Badge className="mt-2 bg-purple-50 text-purple-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% tuần
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Quick Actions & Settings */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Đăng bài nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 shadow-lg shadow-green-500/30"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4" />
                Tạo lịch đăng mới
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => toast.info('Tính năng đang phát triển')}
              >
                <FileText className="w-4 h-4" />
                Chọn từ nội dung có sẵn
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => toast.info('Tính năng đang phát triển')}
              >
                <ImageIcon className="w-4 h-4" />
                Đăng từ thư viện
              </Button>
            </CardContent>
          </Card>

          {/* Auto Settings */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-600" />
                Cài đặt tự động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label className="text-sm font-medium">Tự động trả lời bình luận</Label>
                  <p className="text-xs text-slate-500 mt-1">AI tự động phản hồi khách hàng</p>
                </div>
                <Switch 
                  checked={autoReply} 
                  onCheckedChange={(checked) => {
                    setAutoReply(checked);
                    toast.success(checked ? 'Đã bật tự động trả lời' : 'Đã tắt tự động trả lời');
                  }} 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label className="text-sm font-medium">Khung giờ tối ưu</Label>
                  <p className="text-xs text-slate-500 mt-1">Đăng khi hiệu quả cao nhất</p>
                </div>
                <Switch 
                  checked={optimizeTime} 
                  onCheckedChange={(checked) => {
                    setOptimizeTime(checked);
                    toast.success(checked ? 'Đã bật tối ưu thời gian' : 'Đã tắt tối ưu thời gian');
                  }} 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label className="text-sm font-medium">Thông báo email</Label>
                  <p className="text-xs text-slate-500 mt-1">Nhận thông báo khi đăng</p>
                </div>
                <Switch 
                  checked={emailNotification} 
                  onCheckedChange={(checked) => {
                    setEmailNotification(checked);
                    toast.success(checked ? 'Đã bật thông báo email' : 'Đã tắt thông báo email');
                  }} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Campaigns */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Chiến dịch
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCampaignDialog(true)}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-3">
                {campaigns.slice(0, 2).map((campaign) => (
                  <div key={campaign.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-900">{campaign.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${campaign.status === 'active' ? 'border-green-300 text-green-700' : 'border-orange-300 text-orange-700'}`}
                      >
                        {campaign.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>{campaign.posts} bài</span>
                      <span>•</span>
                      <span>{campaign.reach} tiếp cận</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Lists */}
        <div className="lg:col-span-2 space-y-5">
          {/* Scheduled Posts */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Bài viết đã lên lịch
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {scheduledPosts.length} bài đang chờ đăng
                  </CardDescription>
                </div>
                <Badge className="bg-orange-50 text-orange-700 border-0">
                  {scheduledPosts.length} bài
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {scheduledPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-600 mb-1">Chưa có bài đăng nào được lên lịch</p>
                      <p className="text-sm text-slate-500">Tạo lịch đăng mới để bắt đầu</p>
                    </div>
                  ) : (
                    scheduledPosts.map((post) => (
                      <Card key={post.id} className="border-slate-200/60 hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex gap-4">
                            {post.image && (
                              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                <img src={post.image} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-2 flex-wrap">
                                {post.platforms.map((platform) => {
                                  const Icon = platformIcons[platform as keyof typeof platformIcons];
                                  return (
                                    <Badge 
                                      key={platform} 
                                      variant="outline"
                                      className={`text-xs ${platformColors[platform as keyof typeof platformColors]}`}
                                    >
                                      <Icon className="w-3 h-3 mr-1" />
                                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    </Badge>
                                  );
                                })}
                                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {post.scheduledTime}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-900 mb-3 line-clamp-2">{post.content}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs hover:bg-blue-50 hover:text-blue-700"
                                  onClick={() => handleEditPost(post)}
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  Sửa
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs hover:bg-green-50 hover:text-green-700"
                                  onClick={() => handlePublishNow(post)}
                                >
                                  <Zap className="w-3 h-3 mr-1" />
                                  Đăng ngay
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Published Posts */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Bài viết đã đăng
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Hiệu suất và phân tích
                  </CardDescription>
                </div>
                <Badge className="bg-green-50 text-green-700 border-0">
                  {publishedPosts.length} bài
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-3">
                {publishedPosts.map((post) => (
                  <Card key={post.id} className="border-slate-200/60 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2 flex-wrap">
                            {post.platforms.map((platform) => {
                              const Icon = platformIcons[platform as keyof typeof platformIcons];
                              return (
                                <Badge 
                                  key={platform} 
                                  variant="outline"
                                  className={`text-xs ${platformColors[platform as keyof typeof platformColors]}`}
                                >
                                  <Icon className="w-3 h-3 mr-1" />
                                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </Badge>
                              );
                            })}
                            <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã đăng
                            </Badge>
                            <span className="text-xs text-slate-500">{post.publishedTime}</span>
                          </div>
                          <p className="text-sm text-slate-900 mb-3">{post.content}</p>
                          <div className="grid grid-cols-4 gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{post.stats.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Heart className="w-3.5 h-3.5" />
                              <span>{post.stats.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{post.stats.comments}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Share2 className="w-3.5 h-3.5" />
                              <span>{post.stats.shares}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-4 h-8 text-xs"
                          onClick={() => handleViewDetail(post)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Tạo lịch đăng bài mới
            </DialogTitle>
            <DialogDescription>
              Lên lịch đăng bài tự động trên các nền tảng mạng xã hội
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-5 py-4">
              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Nội dung bài đăng
                </Label>
                <Textarea
                  id="content"
                  placeholder="Nhập nội dung bài đăng của bạn..."
                  rows={6}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500">{postContent.length} ký tự</p>
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Nền tảng đăng bài
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {['facebook', 'instagram', 'telegram', 'zalo'].map((platform) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <Button
                        key={platform}
                        type="button"
                        variant="outline"
                        className={`justify-start gap-2 ${isSelected ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                        onClick={() => togglePlatform(platform)}
                      >
                        <Icon className="w-4 h-4" />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Ngày đăng
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Giờ đăng
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Post Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Loại bài đăng</Label>
                <Select value={postType} onValueChange={setPostType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">🎉 Khuyến mãi</SelectItem>
                    <SelectItem value="product">✨ Giới thiệu sản phẩm</SelectItem>
                    <SelectItem value="blog">📝 Bài viết</SelectItem>
                    <SelectItem value="review">⭐ Review</SelectItem>
                    <SelectItem value="promotion">🎁 Ưu đãi</SelectItem>
                    <SelectItem value="thank">🙏 Cảm ơn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo lịch đăng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Chỉnh sửa bài đăng
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bài đăng đã lên lịch
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-content">Nội dung</Label>
                <Textarea
                  id="edit-content"
                  rows={6}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Nền tảng đăng bài</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['facebook', 'instagram', 'telegram', 'zalo'].map((platform) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <Button
                        key={platform}
                        type="button"
                        variant="outline"
                        className={`justify-start gap-2 ${isSelected ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                        onClick={() => togglePlatform(platform)}
                      >
                        <Icon className="w-4 h-4" />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Ngày đăng</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Giờ đăng</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              setSelectedPost(null);
              resetForm();
            }}>
              Hủy
            </Button>
            <Button onClick={handleUpdatePost}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Quản lý chiến dịch
            </DialogTitle>
            <DialogDescription>
              Xem và quản lý các chiến dịch đăng bài
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-slate-200/60">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-900">{campaign.name}</h3>
                        <Badge 
                          variant="outline"
                          className={campaign.status === 'active' ? 'border-green-300 text-green-700' : 'border-orange-300 text-orange-700'}
                        >
                          {campaign.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {campaign.posts} bài đăng
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {campaign.reach} tiếp cận
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleCampaignStatus(campaign.id)}
                      >
                        {campaign.status === 'active' ? (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Tạm dừng
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Kích hoạt
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info('Tính năng đang phát triển')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              Đóng
            </Button>
            <Button onClick={() => toast.info('Tính năng đang phát triển')}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo chiến dịch mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Chi tiết bài đăng
            </DialogTitle>
            <DialogDescription>
              Phân tích hiệu suất bài viết
            </DialogDescription>
          </DialogHeader>
          
          {selectedPublishedPost && (
            <div className="space-y-5 py-4">
              <div>
                <Label className="text-sm text-slate-600 mb-2 block">Nội dung</Label>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-900">{selectedPublishedPost.content}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-slate-600 mb-2 block">Nền tảng</Label>
                <div className="flex gap-2">
                  {selectedPublishedPost.platforms.map((platform) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    return (
                      <Badge 
                        key={platform} 
                        variant="outline"
                        className={platformColors[platform as keyof typeof platformColors]}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-sm text-slate-600 mb-3 block">Thống kê tương tác</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-slate-200/60">
                    <CardContent className="pt-4 pb-4 text-center">
                      <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-slate-900">{selectedPublishedPost.stats.views.toLocaleString()}</p>
                      <p className="text-xs text-slate-600 mt-1">Lượt xem</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200/60">
                    <CardContent className="pt-4 pb-4 text-center">
                      <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-slate-900">{selectedPublishedPost.stats.likes}</p>
                      <p className="text-xs text-slate-600 mt-1">Lượt thích</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200/60">
                    <CardContent className="pt-4 pb-4 text-center">
                      <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-slate-900">{selectedPublishedPost.stats.comments}</p>
                      <p className="text-xs text-slate-600 mt-1">Bình luận</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200/60">
                    <CardContent className="pt-4 pb-4 text-center">
                      <Share2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-slate-900">{selectedPublishedPost.stats.shares}</p>
                      <p className="text-xs text-slate-600 mt-1">Chia sẻ</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Hiệu suất xuất sắc!</p>
                    <p className="text-sm text-blue-700">Bài viết này đang có tương tác tốt. Tỷ lệ engagement cao hơn 15% so với trung bình.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
