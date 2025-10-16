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
import { Calendar as CalendarIcon, Clock, Facebook, Instagram, Send as Telegram, CheckCircle, XCircle, Loader, TrendingUp, Plus, Edit3, Trash2, Eye, Heart, MessageCircle, Share2, BarChart3, Settings2, Zap, Users, Globe, Image as ImageIcon, Video, FileText, ChevronDown, AlertCircle, Copy, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useMediaLibrary } from '../../src/App';

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
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaGallery?: Array<{url: string; type: 'image' | 'video'}>;
};

type PublishedPost = {
  id: number;
  content: string;
  platforms: string[];
  publishedTime: string;
  stats: { views: number; likes: number; comments: number; shares: number };
  status: string;
  type: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaGallery?: Array<{url: string; type: 'image' | 'video'}>;
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
    mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    mediaType: 'image',
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
    mediaUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    mediaType: 'image',
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
    mediaUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    mediaType: 'image',
  },
  {
    id: 2,
    content: 'Top 5 sản phẩm bán chạy nhất tuần này 🔥 Bạn đã sở hữu chưa?',
    platforms: ['facebook'],
    publishedTime: '08:00 - Hôm qua',
    stats: { views: 2341, likes: 145, comments: 34, shares: 28 },
    status: 'published',
    type: 'blog',
    mediaUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    mediaType: 'image',
  },
  {
    id: 3,
    content: 'Cảm ơn các bạn đã ủng hộ shop trong thời gian qua! 🙏',
    platforms: ['facebook', 'instagram', 'telegram'],
    publishedTime: '20:00 - 2 ngày trước',
    stats: { views: 3456, likes: 234, comments: 67, shares: 45 },
    status: 'published',
    type: 'thank',
    mediaUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
    mediaType: 'image',
  },
];

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Flash Sale Cuối Tuần', posts: 12, status: 'active', reach: '15.2K' },
  { id: 2, name: 'Giới Thiệu Sản Phẩm Mới', posts: 8, status: 'active', reach: '8.5K' },
  { id: 3, name: 'Review Khách Hàng', posts: 5, status: 'paused', reach: '3.2K' },
];

// Mock content library
const contentLibrary = [
  {
    id: 1,
    title: 'Giới thiệu sản phẩm mới - Xu hướng 2025',
    content: 'Ra mắt BST mới với phong cách hiện đại, trẻ trung 🌟 Những thiết kế độc đáo phù hợp với mọi lứa tuổi. Đặc biệt giảm 30% cho khách hàng đặt sớm!',
    type: 'product',
    date: '10/01/2025',
    hasMedia: true,
    mediaUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  },
  {
    id: 2,
    title: 'Flash Sale - Ưu đãi đặc biệt',
    content: 'Flash Sale hôm nay - Giảm đến 50% toàn bộ sản phẩm! 🎉 Nhanh tay đặt hàng để nhận ưu đãi cực khủng. Chỉ trong hôm nay thôi nhé!',
    type: 'sale',
    date: '09/01/2025',
    hasMedia: true,
    mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
  },
  {
    id: 3,
    title: 'Review khách hàng - Chị Lan Anh',
    content: 'Cảm ơn chị Lan Anh đã tin tưởng và ủng hộ shop! ❤️ Rất vui khi sản phẩm đã làm chị hài lòng. Shop luôn cam kết mang đến chất lượng tốt nhất!',
    type: 'review',
    date: '08/01/2025',
    hasMedia: false,
  },
  {
    id: 4,
    title: 'Mẹo chọn size chuẩn',
    content: '5 mẹo chọn size quần áo chuẩn không cần chỉnh sửa 👗 Đặc biệt dành cho khách mua online. Tham khảo ngay để tránh đổi trả phiền phức nhé!',
    type: 'blog',
    date: '07/01/2025',
    hasMedia: true,
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  },
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

type PendingPost = {
  content: string;
  platforms: string[];
  type: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
} | null;

interface AutoPostPageProps {
  pendingPost?: PendingPost;
  onClearPendingPost?: () => void;
}

export function AutoPostPage({ pendingPost, onClearPendingPost }: AutoPostPageProps) {
  const { mediaLibrary, contentLibrary, removeFromMediaLibrary, removeFromContentLibrary } = useMediaLibrary();
  
  // Debug: Log library contents
  useEffect(() => {
    console.log('📚 Content Library:', contentLibrary);
    console.log('🖼️ Media Library:', mediaLibrary);
  }, [contentLibrary, mediaLibrary]);
  
  // State management
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(initialScheduledPosts);
  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>(initialPublishedPosts);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditCampaignDialog, setShowEditCampaignDialog] = useState(false);
  const [showCreateCampaignDialog, setShowCreateCampaignDialog] = useState(false);
  const [showCampaignDetailDialog, setShowCampaignDetailDialog] = useState(false);
  const [showMediaLightbox, setShowMediaLightbox] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [selectedPublishedPost, setSelectedPublishedPost] = useState<PublishedPost | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showContentLibraryDialog, setShowContentLibraryDialog] = useState(false);
  const [showMediaLibraryDialog, setShowMediaLibraryDialog] = useState(false);
  const [showMediaGalleryDialog, setShowMediaGalleryDialog] = useState(false);
  const [selectedMediaItems, setSelectedMediaItems] = useState<Array<{id: number; url: string; type: 'image' | 'video'; title: string}>>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewingGallery, setViewingGallery] = useState<Array<{url: string; type: 'image' | 'video'}>>([]);
  const [libraryTab, setLibraryTab] = useState<'saved' | 'upload'>('saved');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{url: string; type: 'image' | 'video'; name: string}>>([]);
  
  // Track items selected from library to remove after scheduling
  const [selectedContentIdFromLibrary, setSelectedContentIdFromLibrary] = useState<number | null>(null);
  const [selectedMediaIdsFromLibrary, setSelectedMediaIdsFromLibrary] = useState<number[]>([]);
  
  // Helper function to reset form before filling from library
  const resetFormForLibraryContent = () => {
    setPostContent('');
    setPostType('product');
    setPostMediaUrl(undefined);
    setPostMediaType(undefined);
    setPostMediaGallery([]);
    setSelectedContentIdFromLibrary(null);
    setSelectedMediaIdsFromLibrary([]);
  };
  
  // Form states
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook']);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('14:00');
  const [postType, setPostType] = useState('sale');
  const [postMediaUrl, setPostMediaUrl] = useState<string | undefined>(undefined);
  const [postMediaType, setPostMediaType] = useState<'image' | 'video' | undefined>(undefined);
  const [postMediaGallery, setPostMediaGallery] = useState<Array<{url: string; type: 'image' | 'video'}>>([]);
  
  // Campaign form states
  const [campaignName, setCampaignName] = useState('');
  const [campaignPosts, setCampaignPosts] = useState('0');
  
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

  // Handle pending post from ContentPage
  useEffect(() => {
    if (pendingPost) {
      // Set form with pending post data
      setPostContent(pendingPost.content);
      setSelectedPlatforms(pendingPost.platforms);
      setPostType(pendingPost.type);
      setPostMediaUrl(pendingPost.mediaUrl);
      setPostMediaType(pendingPost.mediaType);
      
      // Set default schedule to today at 14:00
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      setScheduleDate(dateString);
      setScheduleTime('14:00');
      
      // Open create dialog
      setShowCreateDialog(true);
      
      // Clear pending post
      if (onClearPendingPost) {
        onClearPendingPost();
      }
      
      // Show success toast
      const mediaInfo = pendingPost.mediaType ? ` với ${pendingPost.mediaType === 'image' ? 'hình ảnh' : 'video'}` : '';
      toast.success(`Nội dung đã được tải vào form${mediaInfo}!`, {
        description: 'Bạn có thể chỉnh sửa và lên lịch đăng bài'
      });
    }
  }, [pendingPost, onClearPendingPost]);

  const handleViewMedia = (url: string, type: 'image' | 'video', gallery?: Array<{url: string; type: 'image' | 'video'}>, startIndex?: number) => {
    if (gallery && gallery.length > 1) {
      setViewingGallery(gallery);
      setCurrentImageIndex(startIndex || 0);
      setLightboxMedia({ url: gallery[startIndex || 0].url, type: gallery[startIndex || 0].type });
    } else {
      setViewingGallery([]);
      setCurrentImageIndex(0);
      setLightboxMedia({ url, type });
    }
    setShowMediaLightbox(true);
  };

  const handleNextImage = () => {
    if (viewingGallery.length > 0) {
      const nextIndex = (currentImageIndex + 1) % viewingGallery.length;
      setCurrentImageIndex(nextIndex);
      setLightboxMedia({ url: viewingGallery[nextIndex].url, type: viewingGallery[nextIndex].type });
    }
  };

  const handlePrevImage = () => {
    if (viewingGallery.length > 0) {
      const prevIndex = (currentImageIndex - 1 + viewingGallery.length) % viewingGallery.length;
      setCurrentImageIndex(prevIndex);
      setLightboxMedia({ url: viewingGallery[prevIndex].url, type: viewingGallery[prevIndex].type });
    }
  };

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
      mediaUrl: postMediaUrl,
      mediaType: postMediaType,
      mediaGallery: postMediaGallery.length > 0 ? postMediaGallery : undefined,
    };

    setScheduledPosts([newPost, ...scheduledPosts]);

    // Remove items from library if they were selected from library
    if (selectedContentIdFromLibrary) {
      removeFromContentLibrary(selectedContentIdFromLibrary);
      console.log('🗑️ Đã xóa content khỏi thư viện:', selectedContentIdFromLibrary);
    }
    if (selectedMediaIdsFromLibrary.length > 0) {
      selectedMediaIdsFromLibrary.forEach(id => {
        removeFromMediaLibrary(id);
      });
      console.log('🗑️ Đã xóa media khỏi thư viện:', selectedMediaIdsFromLibrary);
    }

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
    setPostMediaUrl(undefined);
    setPostMediaType(undefined);
    setPostMediaGallery([]);
    setSelectedContentIdFromLibrary(null);
    setSelectedMediaIdsFromLibrary([]);
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
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType,
      mediaGallery: post.mediaGallery,
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

  const handleViewCampaignDetail = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignDetailDialog(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCampaignName(campaign.name);
    setCampaignPosts(campaign.posts.toString());
    setShowEditCampaignDialog(true);
  };

  const handleUpdateCampaign = () => {
    if (!selectedCampaign) return;
    
    if (!campaignName.trim()) {
      toast.error('Vui lòng nhập tên chiến dịch');
      return;
    }

    const updatedCampaigns = campaigns.map(c =>
      c.id === selectedCampaign.id
        ? { ...c, name: campaignName, posts: parseInt(campaignPosts) || 0 }
        : c
    );

    setCampaigns(updatedCampaigns);
    toast.success('Đã cập nhật chiến dịch', {
      description: `Chiến dịch "${campaignName}" đã được cập nhật`
    });
    
    setShowEditCampaignDialog(false);
    setSelectedCampaign(null);
    setCampaignName('');
    setCampaignPosts('0');
  };

  const handleDeleteCampaign = (id: number, name: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success('Đã xóa chiến dịch', {
      description: `Chiến dịch "${name}" đã bị xóa`
    });
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      id: Date.now(),
      name: `${campaign.name} (Copy)`,
      posts: campaign.posts,
      status: 'paused',
      reach: '0'
    };
    
    setCampaigns([newCampaign, ...campaigns]);
    toast.success('Đã sao chép chiến dịch', {
      description: `Chiến dịch "${newCampaign.name}" đã được tạo`
    });
  };

  const handleCreateCampaign = () => {
    if (!campaignName.trim()) {
      toast.error('Vui lòng nhập tên chiến dịch');
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now(),
      name: campaignName,
      posts: parseInt(campaignPosts) || 0,
      status: 'active',
      reach: '0'
    };

    setCampaigns([newCampaign, ...campaigns]);
    toast.success('Đã tạo chiến dịch mới', {
      description: `Chiến dịch "${campaignName}" đã được tạo thành công`
    });
    
    setShowCreateCampaignDialog(false);
    setCampaignName('');
    setCampaignPosts('0');
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
                variant="outline" 
                className="w-full gap-2"
                onClick={() => setShowContentLibraryDialog(true)}
              >
                <FileText className="w-4 h-4" />
                Chọn từ nội dung có sẵn
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => setShowMediaLibraryDialog(true)}
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
                          <div className="flex items-start gap-3">
                            {/* Media Thumbnail */}
                            {post.mediaUrl && (
                              <div 
                                className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                                onClick={() => {
                                  if (post.mediaGallery && post.mediaGallery.length > 1) {
                                    setPostMediaGallery(post.mediaGallery);
                                    setShowMediaGalleryDialog(true);
                                  } else {
                                    handleViewMedia(post.mediaUrl!, post.mediaType!);
                                  }
                                }}
                              >
                                {post.mediaType === 'image' ? (
                                  <img 
                                    src={post.mediaUrl} 
                                    alt="Post media" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                    <Video className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                {post.mediaGallery && post.mediaGallery.length > 1 && (
                                  <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-lg">
                                    {post.mediaGallery.length}+
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
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
                      <div className="flex items-start gap-3">
                        {/* Media Thumbnail */}
                        {post.mediaUrl && (
                          <div 
                            className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                            onClick={() => {
                              if (post.mediaGallery && post.mediaGallery.length > 1) {
                                setPostMediaGallery(post.mediaGallery);
                                setShowMediaGalleryDialog(true);
                              } else {
                                handleViewMedia(post.mediaUrl!, post.mediaType!);
                              }
                            }}
                          >
                            {post.mediaType === 'image' ? (
                              <img 
                                src={post.mediaUrl} 
                                alt="Post media" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <Video className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {post.mediaGallery && post.mediaGallery.length > 1 && (
                              <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-lg">
                                {post.mediaGallery.length}+
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
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
                            <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã đăng
                            </Badge>
                            <span className="text-xs text-slate-500">{post.publishedTime}</span>
                          </div>
                          <p className="text-sm text-slate-900 mb-3 line-clamp-2">{post.content}</p>
                          <div className="grid grid-cols-4 gap-3 mb-2">
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={() => handleViewDetail(post)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Chi tiết
                          </Button>
                        </div>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Tạo lịch đăng bài mới
            </DialogTitle>
            <DialogDescription>
              Lên lịch đăng bài tự động trên các nền tảng mạng xã hội
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 flex-1">
            <div className="space-y-5 pb-4">
              {/* Media Preview - Compact */}
              {postMediaUrl && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {postMediaType === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {postMediaGallery.length > 1 ? `${postMediaGallery.length} Hình ảnh/Video` : (postMediaType === 'image' ? 'Hình ảnh' : 'Video')}
                  </Label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    {/* Thumbnail */}
                    <div 
                      className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => {
                        if (postMediaGallery.length > 1) {
                          handleViewMedia(postMediaUrl, postMediaType!, postMediaGallery, 0);
                        } else {
                          handleViewMedia(postMediaUrl, postMediaType!);
                        }
                      }}
                    >
                      {postMediaType === 'image' ? (
                        <img 
                          src={postMediaUrl} 
                          alt="Media preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                      )}
                      {postMediaGallery.length > 1 && (
                        <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-lg">
                          {postMediaGallery.length}+
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 truncate">
                        {postMediaGallery.length > 1 
                          ? `Album ${postMediaGallery.length} ảnh`
                          : `${postMediaType === 'image' ? 'Hình ảnh' : 'Video'} được tạo từ AI`
                        }
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {postMediaGallery.length > 1 ? 'Click để xem tất cả' : 'Click để xem full'}
                      </p>
                    </div>
                    
                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setPostMediaUrl(undefined);
                        setPostMediaType(undefined);
                        setPostMediaGallery([]);
                        toast.info('Đã xóa media');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

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
          </div>

          <DialogFooter className="border-t pt-4 px-6 pb-6 shrink-0">
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Chỉnh sửa bài đăng
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bài đăng đã lên lịch
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 flex-1">
            <div className="space-y-5 pb-4">
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
          </div>

          <DialogFooter className="border-t pt-4 px-6 pb-6 shrink-0">
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              setSelectedPost(null);
              resetForm();
            }}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdatePost}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Quản lý chiến dịch
            </DialogTitle>
            <DialogDescription>
              Xem và quản lý các chiến dịch đăng bài
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 flex-1">
            <div className="space-y-3 pb-4">
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
                        className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                        onClick={() => handleViewCampaignDetail(campaign)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleCampaignStatus(campaign.id)}
                      >
                        {campaign.status === 'active' ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>

          <DialogFooter className="border-t pt-4 px-6 pb-6 shrink-0">
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              Đóng
            </Button>
            <Button 
              onClick={() => {
                setShowCampaignDialog(false);
                setShowCreateCampaignDialog(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo chiến dịch mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Chi tiết bài đăng
            </DialogTitle>
            <DialogDescription>
              Phân tích hiệu suất bài viết
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 flex-1">
          {selectedPublishedPost && (
            <div className="space-y-5 pb-4">
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
          </div>

          <DialogFooter className="border-t pt-4 px-6 pb-6 shrink-0">
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaignDialog} onOpenChange={setShowCreateCampaignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Tạo chiến dịch mới
            </DialogTitle>
            <DialogDescription>
              Tạo chiến dịch đăng bài mới
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Tên chiến dịch</Label>
              <Input
                id="campaign-name"
                placeholder="VD: Flash Sale Cuối Tuần"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-posts">Số bài đăng dự kiến</Label>
              <Input
                id="campaign-posts"
                type="number"
                placeholder="0"
                value={campaignPosts}
                onChange={(e) => setCampaignPosts(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateCampaignDialog(false);
              setCampaignName('');
              setCampaignPosts('0');
            }}>
              Hủy
            </Button>
            <Button onClick={handleCreateCampaign} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tạo chiến dịch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={showEditCampaignDialog} onOpenChange={setShowEditCampaignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-600" />
              Chỉnh sửa chiến dịch
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chiến dịch
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-campaign-name">Tên chiến dịch</Label>
              <Input
                id="edit-campaign-name"
                placeholder="VD: Flash Sale Cuối Tuần"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-campaign-posts">Số bài đăng</Label>
              <Input
                id="edit-campaign-posts"
                type="number"
                placeholder="0"
                value={campaignPosts}
                onChange={(e) => setCampaignPosts(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditCampaignDialog(false);
              setSelectedCampaign(null);
              setCampaignName('');
              setCampaignPosts('0');
            }}>
              Hủy
            </Button>
            <Button onClick={handleUpdateCampaign} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <Edit3 className="w-4 h-4 mr-2" />
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Detail Dialog */}
      <Dialog open={showCampaignDetailDialog} onOpenChange={setShowCampaignDetailDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Chi tiết chiến dịch
            </DialogTitle>
            <DialogDescription>
              Thông tin và thống kê chi tiết
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 flex-1">
          {selectedCampaign && (
            <div className="space-y-5 pb-4">
              <div>
                <Label className="text-sm text-slate-600 mb-2 block">Tên chiến dịch</Label>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-slate-900">{selectedCampaign.name}</p>
                    <Badge 
                      variant="outline"
                      className={selectedCampaign.status === 'active' ? 'border-green-300 text-green-700' : 'border-orange-300 text-orange-700'}
                    >
                      {selectedCampaign.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-slate-600 mb-3 block">Thống kê</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-slate-200/60">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-slate-900">{selectedCampaign.posts}</p>
                          <p className="text-xs text-slate-600">Bài đăng</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200/60">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-slate-900">{selectedCampaign.reach}</p>
                          <p className="text-xs text-slate-600">Tiếp cận</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900 mb-1">Hoạt động tốt!</p>
                    <p className="text-sm text-purple-700">Chiến dịch đang chạy ổn định. Tiếp tục theo dõi để tối ưu hiệu quả.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => handleDuplicateCampaign(selectedCampaign)}
                >
                  <Copy className="w-4 h-4" />
                  Sao chép
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => {
                    setShowCampaignDetailDialog(false);
                    handleEditCampaign(selectedCampaign);
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
          </div>

          <DialogFooter className="border-t pt-4 px-6 pb-6 shrink-0">
            <Button variant="outline" onClick={() => setShowCampaignDetailDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Library Dialog - Show Published Posts */}
      <Dialog open={showContentLibraryDialog} onOpenChange={setShowContentLibraryDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Chọn nội dung có sẵn
            </DialogTitle>
            <DialogDescription>
              Chọn bài đã đăng để tạo lịch đăng lại
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 flex-1">
            <div className="space-y-3 pb-4">
              {publishedPosts.length > 0 ? (
                publishedPosts.map((item) => (
                  <Card 
                    key={item.id} 
                    className="border-slate-200/60 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      setPostContent(item.content);
                      setPostType(item.type);
                      if (item.mediaUrl) {
                        setPostMediaUrl(item.mediaUrl);
                        setPostMediaType(item.mediaType || 'image');
                      }
                      setShowContentLibraryDialog(false);
                      setShowCreateDialog(true);
                      toast.success('Đã chọn nội dung', {
                        description: 'Vui lòng điền thêm thông tin để tạo lịch đăng'
                      });
                    }}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex gap-3">
                        {item.mediaUrl && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <img 
                              src={item.mediaUrl} 
                              alt="Post media"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm text-slate-600 line-clamp-2 mb-2">{item.content}</p>
                            <Badge 
                              variant="outline" 
                              className="text-xs shrink-0"
                            >
                              {item.type === 'product' && '🏷️ Sản phẩm'}
                              {item.type === 'sale' && '🔥 Khuyến mãi'}
                              {item.type === 'review' && '⭐ Review'}
                              {item.type === 'blog' && '📝 Blog'}
                              {item.type === 'promotion' && '🎁 Ưu đãi'}
                              {item.type === 'thank' && '🙏 Cảm ơn'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.publishedTime}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{item.stats.views}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{item.stats.likes}</span>
                            </div>
                            <span>•</span>
                            <div className="flex gap-1">
                              {item.platforms.slice(0, 2).map((platform) => {
                                const Icon = platformIcons[platform as keyof typeof platformIcons];
                                return <Icon key={platform} className="w-3 h-3" />;
                              })}
                              {item.platforms.length > 2 && (
                                <span className="text-xs">+{item.platforms.length - 2}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Chưa có bài đăng nào</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="border-t pt-4 px-6 pb-6 shrink-0">
            <Button variant="outline" onClick={() => setShowContentLibraryDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Library Dialog - Updated with 2 tabs */}
      <Dialog open={showMediaLibraryDialog} onOpenChange={(open) => {
        setShowMediaLibraryDialog(open);
        if (!open) {
          setSelectedMediaItems([]);
          setUploadedFiles([]);
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 flex flex-col gap-0" aria-describedby={undefined}>
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Đăng từ thư viện
            </DialogTitle>
            <DialogDescription>
              Chọn nội dung, hình ảnh hoặc video từ thư viện hoặc upload từ máy tính
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 flex-1">
          <Tabs value={libraryTab} onValueChange={(v) => setLibraryTab(v as 'saved' | 'upload')} className="w-full pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="saved" className="gap-2">
                <FileText className="w-4 h-4" />
                Từ thư viện
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Plus className="w-4 h-4" />
                Từ máy tính
              </TabsTrigger>
            </TabsList>
            
            {/* Tab 1: From Library */}
            <TabsContent value="saved" className="mt-4">
              <div className="pr-4">
                {/* Text Content Library */}
                {contentLibrary.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Nội dung văn bản ({contentLibrary.length})
                    </h3>
                    <div className="space-y-2">
                      {contentLibrary.map((content) => (
                        <div
                          key={content.id}
                          className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition-all group"
                          onClick={() => {
                            // Reset form first
                            resetFormForLibraryContent();
                            
                            // Track content ID to remove from library after scheduling
                            setSelectedContentIdFromLibrary(content.id);
                            
                            // Fill content into form
                            setPostContent(content.content);
                            setPostType(content.type);
                            
                            // If content has media, add it too
                            if (content.hasMedia && content.mediaUrl) {
                              setPostMediaUrl(content.mediaUrl);
                              setPostMediaType('image');
                              setPostMediaGallery([{ url: content.mediaUrl, type: 'image' }]);
                            }
                            
                            // Set default schedule to today
                            const today = new Date();
                            const dateString = today.toISOString().split('T')[0];
                            setScheduleDate(dateString);
                            setScheduleTime('14:00');
                            
                            // Close library dialog and open create dialog
                            setShowMediaLibraryDialog(false);
                            setShowCreateDialog(true);
                            
                            const mediaInfo = content.hasMedia ? ' kèm hình ảnh' : '';
                            toast.success(`Đã tải nội dung${mediaInfo} vào form!`, {
                              description: 'Chọn nền tảng và thời gian để lên lịch đăng bài'
                            });
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                              {content.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">{content.type}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">{content.content}</p>
                          <p className="text-xs text-slate-500">{content.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Library */}
                {mediaLibrary.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Hình ảnh & Video ({mediaLibrary.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {mediaLibrary.map((media) => {
                const isSelected = selectedMediaItems.some(item => item.id === media.id);
                return (
                  <div
                    key={media.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected 
                        ? 'border-purple-500 ring-2 ring-purple-300' 
                        : 'border-slate-200 hover:border-blue-400'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMediaItems(selectedMediaItems.filter(item => item.id !== media.id));
                      } else {
                        setSelectedMediaItems([...selectedMediaItems, media]);
                      }
                    }}
                  >
                    <div className="aspect-square">
                      {media.type === 'image' ? (
                        <img 
                          src={media.url} 
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <p className="text-sm font-medium line-clamp-1">{media.title}</p>
                        <p className="text-xs text-slate-300">{media.date}</p>
                      </div>
                    </div>
                    <div className={`absolute top-2 right-2 rounded-full p-1.5 transition-all ${
                      isSelected 
                        ? 'bg-purple-600 opacity-100' 
                        : 'bg-white opacity-0 group-hover:opacity-100'
                    }`}>
                      <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-green-600'}`} />
                    </div>
                  </div>
                );
              })}
                    </div>
                  </div>
                )}

                {contentLibrary.length === 0 && mediaLibrary.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 mb-2">Chưa có nội dung trong thư viện</p>
                    <p className="text-sm text-slate-500">Tạo nội dung mới ở trang "Làm nội dung"</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 2: Upload from Computer */}
            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4 pr-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => {
                        const url = URL.createObjectURL(file);
                        const type = file.type.startsWith('image/') ? 'image' : 'video';
                        setUploadedFiles(prev => [...prev, { url, type, name: file.name }]);
                      });
                      toast.success(`Đã upload ${files.length} file`);
                    }}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-slate-900 font-medium mb-1">Click để chọn file</p>
                    <p className="text-sm text-slate-500">Hỗ trợ hình ảnh và video</p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                      File đã chọn ({uploadedFiles.length})
                    </h3>
                    <div className="max-h-[300px] overflow-y-auto">
                      <div className="grid grid-cols-3 gap-4">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border border-slate-200"
                          >
                            {file.type === 'image' ? (
                              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <Video className="w-8 h-8 text-white" />
                              </div>
                            )}
                            <button
                              onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          </div>
          
          <DialogFooter className="border-t pt-4 px-6 pb-6 shrink-0 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {libraryTab === 'saved' && selectedMediaItems.length > 0 && `Đã chọn ${selectedMediaItems.length} media`}
              {libraryTab === 'upload' && uploadedFiles.length > 0 && `${uploadedFiles.length} file đã upload`}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setShowMediaLibraryDialog(false);
                setSelectedMediaItems([]);
                setUploadedFiles([]);
              }}>
                Đóng
              </Button>
              {libraryTab === 'saved' && selectedMediaItems.length > 0 && (
                <Button 
                  onClick={() => {
                    // Reset form first
                    resetFormForLibraryContent();
                    
                    // Track media IDs to remove from library after scheduling
                    setSelectedMediaIdsFromLibrary(selectedMediaItems.map(item => item.id));
                    
                    // Fill media into form
                    setPostMediaUrl(selectedMediaItems[0].url);
                    setPostMediaType(selectedMediaItems[0].type);
                    
                    setPostMediaGallery(selectedMediaItems.map(item => ({
                      url: item.url,
                      type: item.type
                    })));
                    
                    // Set default schedule to today
                    const today = new Date();
                    const dateString = today.toISOString().split('T')[0];
                    setScheduleDate(dateString);
                    setScheduleTime('14:00');
                    
                    // Close library dialog and open create dialog
                    setShowMediaLibraryDialog(false);
                    setShowCreateDialog(true);
                    
                    toast.success(
                      selectedMediaItems.length === 1 
                        ? 'Đã tải media vào form!' 
                        : `Đã tải ${selectedMediaItems.length} media vào form!`,
                      {
                        description: 'Nhập nội dung và chọn thời gian để lên lịch đăng bài'
                      }
                    );
                    setSelectedMediaItems([]);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Chọn ({selectedMediaItems.length})
                </Button>
              )}
              {libraryTab === 'upload' && uploadedFiles.length > 0 && (
                <Button 
                  onClick={() => {
                    // Reset form first
                    resetFormForLibraryContent();
                    
                    // Fill uploaded files into form
                    setPostMediaUrl(uploadedFiles[0].url);
                    setPostMediaType(uploadedFiles[0].type);
                    
                    setPostMediaGallery(uploadedFiles.map(file => ({
                      url: file.url,
                      type: file.type
                    })));
                    
                    // Set default schedule to today
                    const today = new Date();
                    const dateString = today.toISOString().split('T')[0];
                    setScheduleDate(dateString);
                    setScheduleTime('14:00');
                    
                    // Close library dialog and open create dialog
                    setShowMediaLibraryDialog(false);
                    setShowCreateDialog(true);
                    
                    toast.success(`Đã tải ${uploadedFiles.length} file vào form!`, {
                      description: 'Nhập nội dung và chọn thời gian để lên lịch đăng bài'
                    });
                    setUploadedFiles([]);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Sử dụng ({uploadedFiles.length})
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Gallery Dialog - View all selected images */}
      <Dialog open={showMediaGalleryDialog} onOpenChange={setShowMediaGalleryDialog}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Album hình ảnh ({postMediaGallery.length} ảnh)
            </DialogTitle>
            <DialogDescription>
              Tất cả hình ảnh/video đã chọn cho bài đăng
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[600px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pr-4">
              {postMediaGallery.map((media, index) => (
                <div 
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 hover:border-purple-400 transition-all cursor-pointer group"
                  onClick={() => {
                    setLightboxMedia({ url: media.url, type: media.type });
                    setShowMediaGalleryDialog(false);
                    setShowMediaLightbox(true);
                  }}
                >
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}/{postMediaGallery.length}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2">
                      <Search className="w-5 h-5 text-slate-900" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMediaGalleryDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Lightbox Dialog */}
      <Dialog open={showMediaLightbox} onOpenChange={setShowMediaLightbox}>
        <DialogContent className="sm:max-w-5xl p-0 bg-slate-900 border-slate-800" aria-describedby={undefined}>
          <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              {lightboxMedia?.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              {viewingGallery.length > 1 
                ? `Ảnh ${currentImageIndex + 1}/${viewingGallery.length}`
                : (lightboxMedia?.type === 'image' ? 'Xem hình ảnh' : 'Xem video')
              }
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMediaLightbox(false)} 
              className="text-white hover:bg-slate-800 h-8 w-8 shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>
          
          <div className="px-6 pb-6 relative">
            {lightboxMedia?.type === 'image' ? (
              <img 
                src={lightboxMedia.url} 
                alt="Full size media" 
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto border border-white/20">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white mb-2">Video Preview</p>
                  <p className="text-white/70 text-sm">Video player không khả dụng trong demo</p>
                </div>
              </div>
            )}

            {/* Navigation Arrows for Gallery */}
            {viewingGallery.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>
          
          <DialogFooter className="border-t border-slate-800 pt-4 px-6 pb-6">
            {viewingGallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
                {viewingGallery.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setLightboxMedia({ url: media.url, type: media.type });
                    }}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-purple-500 ring-2 ring-purple-300' 
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img src={media.url} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowMediaLightbox(false)} 
              className="bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-slate-900 ml-auto"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
