import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { FileText, Image as ImageIcon, Video, Sparkles, Download, Copy, History, Wand2, TrendingUp, Settings2, MoreHorizontal, Clock, Star, Trash2, Edit3, Plus, BookOpen, Megaphone, Search as SearchIcon, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Slider } from '../ui/slider';

const contentTemplates = [
  { id: 1, name: 'Flash Sale', category: 'Bán hàng', icon: '⚡', description: 'Khuyến mãi giới hạn thời gian' },
  { id: 2, name: 'Review sản phẩm', category: 'Blog', icon: '⭐', description: 'Đánh giá chi tiết sản phẩm' },
  { id: 3, name: 'Giới thiệu BST mới', category: 'Bán hàng', icon: '✨', description: 'Ra mắt bộ sưu tập' },
  { id: 4, name: 'Hướng dẫn sử dụng', category: 'Blog', icon: '📖', description: 'Tutorial chi tiết' },
  { id: 5, name: 'Chăm sóc khách hàng', category: 'Tư vấn', icon: '💬', description: 'Tips & tricks' },
  { id: 6, name: 'Quảng cáo Facebook', category: 'Ads', icon: '📢', description: 'Nội dung quảng cáo' },
];

const recentContents = [
  { id: 1, title: 'Flash Sale Cuối Tuần - Giảm 50%', type: 'Bài bán hàng', time: '2 giờ trước', words: 245, starred: true },
  { id: 2, title: 'Review Top 5 Áo Thun Nam Đáng Mua', type: 'Blog SEO', time: '5 giờ trước', words: 1240, starred: false },
  { id: 3, title: 'Bộ Sưu Tập Mùa Hè 2024', type: 'Giới thiệu', time: '1 ngày trước', words: 320, starred: true },
  { id: 4, title: 'Quảng cáo Facebook - Áo Khoác', type: 'Facebook Ads', time: '2 ngày trước', words: 180, starred: false },
  { id: 5, title: 'Hướng Dẫn Chọn Size Áo', type: 'Blog', time: '3 ngày trước', words: 890, starred: false },
];

export function ContentPage() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentType, setContentType] = useState('sale-post');
  const [productName, setProductName] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [contentStyle, setContentStyle] = useState('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [showTemplates, setShowTemplates] = useState(false);
  const [contentLength, setContentLength] = useState([50]);
  const [showHistory, setShowHistory] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [savedContents, setSavedContents] = useState(recentContents);
  
  // Image generation states
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageSize, setImageSize] = useState('square');
  const [imageStyle, setImageStyle] = useState('realistic');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  
  // Video generation states
  const [videoScript, setVideoScript] = useState('');
  const [videoDuration, setVideoDuration] = useState('30s');
  const [videoVoice, setVideoVoice] = useState('female');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState('');

  const handleGenerate = () => {
    if (!productName.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm/chủ đề');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const content = `🎉 RA MẮT SIÊU PHẨM MỚI - GIẢM GIÁ 50% 🎉

Chào các bạn yêu quý! 💙

Hôm nay shop vô cùng hân hạnh giới thiệu đến các bạn ${productName} - Đẹp xuất sắc, Chất lượng đỉnh cao!

✨ Đặc điểm nổi bật:
✅ Chất liệu cao cấp, bền đẹp theo thời gian
✅ Thiết kế hiện đại, bắt kịp xu hướng
✅ Giá cực kỳ ưu đãi, phù hợp mọi túi tiền
✅ Kiểm tra chất lượng kỹ càng trước khi giao

${productDetails ? `📝 Chi tiết:\n${productDetails}\n\n` : ''}🎁 Ưu đãi đặc biệt cho bạn:
💰 GIẢM 50% cho 100 đơn đầu tiên
📦 Freeship toàn quốc cho đơn từ 200K
🎀 Tặng kèm quà tặng xinh xắn
🔄 Đổi trả miễn phí trong 7 ngày

⏰ Chương trình có thời hạn, nhanh tay đặt hàng ngay nhé!

👉 Inbox shop để được tư vấn chi tiết
📞 Hotline: 0909 xxx xxx
🏪 Địa chỉ: [Địa chỉ của bạn]

#sale #giamgia #muasam #${productName.toLowerCase().replace(/\s+/g, '')}`;
      
      setGeneratedContent(content);
      setIsGenerating(false);
      toast.success('Tạo nội dung thành công!');
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Đã sao chép nội dung vào clipboard!');
  };

  const handleUseTemplate = (template: typeof contentTemplates[0]) => {
    setProductName(template.name);
    setProductDetails(template.description);
    setShowTemplates(false);
    toast.success(`Đã áp dụng template: ${template.name}`);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${productName || 'noi-dung'}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Đã tải xuống nội dung!');
  };

  const handlePost = () => {
    toast.success('Đã chuyển sang trang Tự động đăng bài!');
    // Could navigate to auto-post page here
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
    toast.success(isStarred ? 'Đã bỏ lưu nội dung' : 'Đã lưu nội dung vào yêu thích');
  };

  const handleDeleteContent = (id: number) => {
    setSavedContents(savedContents.filter(item => item.id !== id));
    toast.success('Đã xóa nội dung');
  };

  const handleEditContent = (item: typeof recentContents[0]) => {
    setProductName(item.title);
    setActiveTab('text');
    toast.info('Đã tải nội dung để chỉnh sửa');
  };

  const handleCopyContent = (title: string) => {
    navigator.clipboard.writeText(title);
    toast.success('Đã sao chép nội dung');
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Vui lòng nhập mô tả hình ảnh');
      return;
    }

    setIsGeneratingImage(true);
    
    // Simulate AI image generation with Unsplash
    setTimeout(() => {
      // Generate a sample image URL (in real app, this would be AI-generated)
      const sampleImages = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
      ];
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      
      setGeneratedImage(randomImage);
      setIsGeneratingImage(false);
      toast.success('Hình ảnh đã được tạo thành công!', {
        description: 'Bạn có thể xem và tải xuống hình ảnh'
      });
    }, 3000);
  };

  const handleGenerateVideo = () => {
    if (!videoScript.trim()) {
      toast.error('Vui lòng nhập kịch bản video');
      return;
    }

    setIsGeneratingVideo(true);
    setTimeout(() => {
      // Set video thumbnail/preview
      setGeneratedVideo('video-generated');
      setIsGeneratingVideo(false);
      toast.success('Video đã được tạo thành công!', {
        description: 'Bạn có thể xem và tải xuống video'
      });
    }, 5000);
  };

  const handleReset = () => {
    setProductName('');
    setProductDetails('');
    setGeneratedContent('');
    setGeneratedImage('');
    setGeneratedVideo('');
    setImagePrompt('');
    setVideoScript('');
    setIsStarred(false);
    toast.info('Đã xóa form');
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Đã tải xuống hình ảnh!');
    }
  };

  const handleDownloadVideo = () => {
    toast.success('Đã tải xuống video!');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
            <h1 className="text-slate-900">Làm nội dung</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              Lịch sử
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(true)}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Templates
            </Button>
          </div>
        </div>
        <p className="text-slate-600 ml-5">Tạo nội dung marketing chuyên nghiệp với AI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Nội dung đã tạo</p>
                <p className="text-slate-900 text-2xl">1,234</p>
                <Badge className="mt-2 bg-blue-50 text-blue-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% tuần này
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Hình ảnh</p>
                <p className="text-slate-900 text-2xl">456</p>
                <Badge className="mt-2 bg-purple-50 text-purple-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% tuần này
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Video</p>
                <p className="text-slate-900 text-2xl">89</p>
                <Badge className="mt-2 bg-green-50 text-green-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% tuần này
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tuần này</p>
                <p className="text-slate-900 text-2xl">47</p>
                <Badge className="mt-2 bg-orange-50 text-orange-700 border-0 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Đang hot
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Creation */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Input Section - 3 columns */}
        <div className="lg:col-span-3">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-600" />
                    Tạo nội dung mới
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Nhập thông tin để AI tạo nội dung chuyên nghiệp cho bạn
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-11 bg-slate-100">
                  <TabsTrigger value="text" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <FileText className="w-4 h-4" />
                    Văn bản
                  </TabsTrigger>
                  <TabsTrigger value="image" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <ImageIcon className="w-4 h-4" />
                    Hình ảnh
                  </TabsTrigger>
                  <TabsTrigger value="video" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Video className="w-4 h-4" />
                    Video
                  </TabsTrigger>
                </TabsList>

                {/* Text Content Tab */}
                <TabsContent value="text" className="space-y-5 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Loại nội dung
                      </Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale-post">📦 Bài bán hàng</SelectItem>
                          <SelectItem value="blog">📝 Bài Blog</SelectItem>
                          <SelectItem value="seo">🔍 Nội dung SEO</SelectItem>
                          <SelectItem value="ads">📢 Quảng cáo</SelectItem>
                          <SelectItem value="social">💬 Mạng xã hội</SelectItem>
                          <SelectItem value="email">✉️ Email Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        Phong cách
                      </Label>
                      <Select value={contentStyle} onValueChange={setContentStyle}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">😊 Thân thiện</SelectItem>
                          <SelectItem value="professional">💼 Chuyên nghiệp</SelectItem>
                          <SelectItem value="funny">😄 Hài hước</SelectItem>
                          <SelectItem value="luxury">✨ Sang trọng</SelectItem>
                          <SelectItem value="casual">👕 Đời thường</SelectItem>
                          <SelectItem value="urgent">⚡ Khẩn cấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Sản phẩm / Chủ đề
                    </Label>
                    <Input 
                      placeholder="VD: Áo thun nam cao cấp form rộng"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      Thông tin chi tiết
                    </Label>
                    <Textarea
                      placeholder="Mô tả chi tiết về sản phẩm: chất liệu, kích thước, màu sắc, ưu đãi đặc biệt, đặc điểm nổi bật..."
                      rows={5}
                      value={productDetails}
                      onChange={(e) => setProductDetails(e.target.value)}
                      className="resize-none bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        Độ dài nội dung
                      </Label>
                      <span className="text-sm text-slate-600">{contentLength[0]}%</span>
                    </div>
                    <Slider
                      value={contentLength}
                      onValueChange={setContentLength}
                      max={100}
                      step={10}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Ngắn gọn</span>
                      <span>Chi tiết</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/30 h-11"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Đang tạo nội dung...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Tạo nội dung với AI
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11"
                      onClick={() => setShowTemplates(true)}
                    >
                      <BookOpen className="w-5 h-5" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Image Tab */}
                <TabsContent value="image" className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      Mô tả hình ảnh
                    </Label>
                    <Textarea
                      placeholder="VD: Áo thun nam màu đen, form rộng, phong cách streetwear, background đường phố hiện đại, ánh sáng mặt trời buổi sáng..."
                      rows={5}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="resize-none bg-white border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Kích thước</Label>
                      <Select value={imageSize} onValueChange={setImageSize}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">1:1 Square - Instagram</SelectItem>
                          <SelectItem value="portrait">4:5 Portrait</SelectItem>
                          <SelectItem value="landscape">16:9 Landscape</SelectItem>
                          <SelectItem value="story">9:16 Story</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700">Phong cách</Label>
                      <Select value={imageStyle} onValueChange={setImageStyle}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realistic">📷 Realistic</SelectItem>
                          <SelectItem value="minimalist">⚪ Minimalist</SelectItem>
                          <SelectItem value="vibrant">🌈 Vibrant Colors</SelectItem>
                          <SelectItem value="vintage">📼 Vintage</SelectItem>
                          <SelectItem value="modern">✨ Modern</SelectItem>
                          <SelectItem value="artistic">🎨 Artistic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 h-11"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Đang tạo hình ảnh...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Tạo hình ảnh AI
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* Video Tab */}
                <TabsContent value="video" className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Kịch bản video
                    </Label>
                    <Textarea
                      placeholder="Mô tả chi tiết nội dung video: cảnh quay, thông điệp chính, call-to-action, transition effects..."
                      rows={5}
                      value={videoScript}
                      onChange={(e) => setVideoScript(e.target.value)}
                      className="resize-none bg-white border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Thời lượng</Label>
                      <Select value={videoDuration} onValueChange={setVideoDuration}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15s">⏱️ 15 giây (TikTok/Reels)</SelectItem>
                          <SelectItem value="30s">⏱️ 30 giây</SelectItem>
                          <SelectItem value="60s">⏱️ 60 giây</SelectItem>
                          <SelectItem value="3min">⏱️ 3 phút</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700">Giọng nói</Label>
                      <Select value={videoVoice} onValueChange={setVideoVoice}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">👩 Nữ - Miền Bắc</SelectItem>
                          <SelectItem value="male">👨 Nam - Miền Bắc</SelectItem>
                          <SelectItem value="female-south">👩 Nữ - Miền Nam</SelectItem>
                          <SelectItem value="male-south">👨 Nam - Miền Nam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 h-11"
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                  >
                    {isGeneratingVideo ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Đang tạo video...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Tạo video AI
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Output Section - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200/60 shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-slate-100 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Kết quả
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Nội dung được tạo bởi AI
                  </CardDescription>
                </div>
                {generatedContent && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-0">
                    ✓ Hoàn thành
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col overflow-hidden">
              {/* Text Content Result */}
              {activeTab === 'text' && generatedContent && (
                <div className="space-y-4 flex flex-col h-full">
                  <ScrollArea className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-5 border border-slate-200/60">
                    <p className="text-slate-900 whitespace-pre-line leading-relaxed">{generatedContent}</p>
                  </ScrollArea>
                  
                  <div className="flex-shrink-0 space-y-3">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" 
                        onClick={handleCopy}
                      >
                        <Copy className="w-4 h-4" />
                        Sao chép
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4" />
                        Tải xuống
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className={`hover:bg-yellow-50 hover:border-yellow-300 ${isStarred ? 'bg-yellow-50 text-yellow-600 border-yellow-300' : 'hover:text-yellow-700'}`}
                        onClick={handleToggleStar}
                      >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-500' : ''}`} />
                      </Button>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 gap-2"
                      onClick={handlePost}
                    >
                      <Megaphone className="w-4 h-4" />
                      Đăng bài ngay
                    </Button>
                  </div>
                </div>
              )}

              {/* Image Result */}
              {activeTab === 'image' && generatedImage && (
                <div className="space-y-4 flex flex-col h-full">
                  <div className="flex-1 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl p-5 border border-slate-200/60 flex items-center justify-center overflow-hidden">
                    <img 
                      src={generatedImage} 
                      alt="Generated AI Image" 
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="flex-shrink-0 space-y-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-600">Kích thước</span>
                        <Badge variant="outline" className="text-xs">{imageSize}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Phong cách</span>
                        <Badge variant="outline" className="text-xs">{imageStyle}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        onClick={handleDownloadImage}
                      >
                        <Download className="w-4 h-4" />
                        Tải xuống
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className={`hover:bg-yellow-50 hover:border-yellow-300 ${isStarred ? 'bg-yellow-50 text-yellow-600 border-yellow-300' : 'hover:text-yellow-700'}`}
                        onClick={handleToggleStar}
                      >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-500' : ''}`} />
                      </Button>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 gap-2"
                      onClick={handlePost}
                    >
                      <Megaphone className="w-4 h-4" />
                      Đăng bài ngay
                    </Button>
                  </div>
                </div>
              )}

              {/* Video Result */}
              {activeTab === 'video' && generatedVideo && (
                <div className="space-y-4 flex flex-col h-full">
                  <div className="flex-1 bg-gradient-to-br from-slate-50 to-green-50/30 rounded-xl p-5 border border-slate-200/60 flex flex-col items-center justify-center">
                    <div className="w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
                      <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto border border-white/20">
                          <Video className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-white mb-2">Video đã được tạo</p>
                        <p className="text-white/70 text-sm">Thời lượng: {videoDuration}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 space-y-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-600">Thời lượng</span>
                        <Badge variant="outline" className="text-xs">{videoDuration}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Giọng nói</span>
                        <Badge variant="outline" className="text-xs">{videoVoice}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                        onClick={handleDownloadVideo}
                      >
                        <Download className="w-4 h-4" />
                        Tải xuống
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className={`hover:bg-yellow-50 hover:border-yellow-300 ${isStarred ? 'bg-yellow-50 text-yellow-600 border-yellow-300' : 'hover:text-yellow-700'}`}
                        onClick={handleToggleStar}
                      >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-500' : ''}`} />
                      </Button>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 gap-2"
                      onClick={handlePost}
                    >
                      <Megaphone className="w-4 h-4" />
                      Đăng bài ngay
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {((activeTab === 'text' && !generatedContent) || 
                (activeTab === 'image' && !generatedImage) || 
                (activeTab === 'video' && !generatedVideo)) && (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 bg-gradient-to-br from-slate-50 to-blue-50/20 rounded-xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                    {activeTab === 'text' && <FileText className="w-10 h-10 text-purple-600" />}
                    {activeTab === 'image' && <ImageIcon className="w-10 h-10 text-purple-600" />}
                    {activeTab === 'video' && <Video className="w-10 h-10 text-purple-600" />}
                  </div>
                  <p className="text-slate-600 mb-2">Chưa có nội dung</p>
                  <p className="text-sm text-slate-500">
                    {activeTab === 'text' && 'Nhập thông tin và nhấn "Tạo nội dung với AI"'}
                    {activeTab === 'image' && 'Nhập mô tả và nhấn "Tạo hình ảnh AI"'}
                    {activeTab === 'video' && 'Nhập kịch bản và nhấn "Tạo video AI"'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Content */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-slate-600 to-slate-700 rounded-full" />
            <h2 className="text-slate-900">Nội dung gần đây</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowHistory(true)}
          >
            Xem tất cả
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedContents.slice(0, 3).map((item) => (
            <Card key={item.id} className="border-slate-200/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">
                    {item.type}
                  </Badge>
                  {item.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                </div>
                
                <h3 className="text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                  <span>•</span>
                  <span>{item.words} từ</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs h-8 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    onClick={() => handleEditContent(item)}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Chỉnh sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleDeleteContent(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Templates nội dung
            </DialogTitle>
            <DialogDescription>
              Chọn template có sẵn để tạo nội dung nhanh hơn
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {contentTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto p-4 justify-start hover:border-purple-300 hover:bg-purple-50 group"
                onClick={() => handleUseTemplate(template)}
              >
                <div className="text-left w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{template.icon}</span>
                    <span className="font-semibold text-slate-900 group-hover:text-purple-700">
                      {template.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{template.description}</p>
                </div>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplates(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Lịch sử nội dung
            </DialogTitle>
            <DialogDescription>
              Quản lý tất cả nội dung đã tạo
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3 py-4">
              {savedContents.map((item) => (
                <Card key={item.id} className="border-slate-200/60 hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">
                            {item.type}
                          </Badge>
                          {item.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </div>
                        <h3 className="text-slate-900 mb-2">{item.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </span>
                          <span>•</span>
                          <span>{item.words} từ</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditContent(item)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCopyContent(item.title)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteContent(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHistory(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
