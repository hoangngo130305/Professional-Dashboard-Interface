import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Settings, User, Bell, Shield, Palette, Link, Save, Key, Mail, Phone, MapPin, Globe, Clock, Zap, Facebook, Instagram, Send as Telegram, MessageSquare, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '../../src/App';

type Integration = {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  color: string;
};

export function SettingsPage() {
  // Get settings from context
  const settings = useSettings();
  const { 
    businessName, 
    setBusinessName, 
    theme, 
    setTheme, 
    primaryColor, 
    setPrimaryColor,
    compactMode,
    setCompactMode,
    language,
    setLanguage
  } = settings;
  
  // Local Settings
  const [timezone, setTimezone] = useState('asia-hcm');
  const [aiAutoMode, setAiAutoMode] = useState(true);

  // Profile Settings
  const [fullName, setFullName] = useState('Admin User');
  const [email, setEmail] = useState('admin@aiagent.com');
  const [phone, setPhone] = useState('0909 xxx xxx');
  const [address, setAddress] = useState('123 Đường ABC, Quận 1, TP.HCM');

  // Notification Settings
  const [notifyNewMessage, setNotifyNewMessage] = useState(true);
  const [notifyPostSuccess, setNotifyPostSuccess] = useState(true);
  const [notifyDailyReport, setNotifyDailyReport] = useState(false);
  const [notifySystemAlert, setNotifySystemAlert] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'facebook', name: 'Facebook', icon: Facebook, connected: true, color: 'bg-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, connected: true, color: 'bg-pink-500' },
    { id: 'zalo', name: 'Zalo', icon: MessageSquare, connected: false, color: 'bg-blue-600' },
    { id: 'telegram', name: 'Telegram', icon: Telegram, connected: true, color: 'bg-cyan-500' },
    { id: 'website', name: 'Website Chat', icon: Globe, connected: true, color: 'bg-purple-500' },
  ]);

  // Appearance Settings are now from context

  const handleSaveGeneral = () => {
    toast.success('Đã lưu cài đặt chung!', {
      description: 'Các thay đổi đã được áp dụng'
    });
  };

  const handleSaveProfile = () => {
    if (!fullName.trim() || !email.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    toast.success('Đã cập nhật hồ sơ!', {
      description: 'Thông tin cá nhân đã được lưu'
    });
  };

  const handleSaveNotifications = () => {
    toast.success('Đã lưu cài đặt thông báo!', {
      description: 'Bạn sẽ nhận thông báo theo cài đặt mới'
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin mật khẩu');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    
    toast.success('Đã đổi mật khẩu thành công!', {
      description: 'Vui lòng đăng nhập lại với mật khẩu mới'
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id 
        ? { ...int, connected: !int.connected }
        : int
    ));

    const integration = integrations.find(int => int.id === id);
    if (integration) {
      if (!integration.connected) {
        toast.success(`Đã kết nối ${integration.name}!`, {
          description: 'Bạn có thể bắt đầu sử dụng kênh này'
        });
      } else {
        toast.info(`Đã ngắt kết nối ${integration.name}`, {
          description: 'Kênh này sẽ không hoạt động'
        });
      }
    }
  };

  const handleSaveAppearance = () => {
    toast.success('Đã lưu giao diện!', {
      description: 'Thay đổi sẽ được áp dụng ngay'
    });
  };

  const handleTestNotification = () => {
    toast.info('🔔 Đây là thông báo thử nghiệm', {
      description: 'Bạn sẽ nhận thông báo theo cách này'
    });
  };

  const handleChangeAvatar = () => {
    toast.info('📸 Tính năng đang phát triển', {
      description: 'Chức năng thay đổi ảnh đại diện sẽ được cập nhật sớm'
    });
  };

  const handleLogoutAllDevices = () => {
    toast.success('🔐 Đã đăng xuất tất cả thiết bị khác', {
      description: 'Chỉ thiết bị hiện tại còn đăng nhập'
    });
  };

  const connectedCount = integrations.filter(int => int.connected).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full" />
          <h1 className="text-slate-900">Cài đặt</h1>
        </div>
        <p className="text-slate-600 ml-5">Quản lý cài đặt hệ thống và tài khoản</p>
      </div>

      <Tabs defaultValue="general" className="space-y-5">
        <TabsList className="bg-slate-100 grid grid-cols-6 lg:w-auto">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Chung</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Hồ sơ</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Thông báo</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Link className="w-4 h-4" />
            <span className="hidden sm:inline">Tích hợp</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Giao diện</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Bảo mật</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Cài đặt chung
                </CardTitle>
                <CardDescription>Cấu hình chung cho hệ thống AI Agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-2">
                  <Label htmlFor="business-name" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Tên doanh nghiệp
                  </Label>
                  <Input 
                    id="business-name"
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ mặc định</Label>
                  <Select 
                    value={language} 
                    onValueChange={(value) => {
                      setLanguage(value);
                      toast.success(value === 'vi' ? '🇻🇳 Đã chuyển sang Tiếng Việt' : '🇬🇧 Switched to English');
                    }}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Múi giờ
                  </Label>
                  <Select 
                    value={timezone} 
                    onValueChange={(value) => {
                      setTimezone(value);
                      const timezoneNames: Record<string, string> = {
                        'asia-hcm': 'Hồ Chí Minh',
                        'asia-hanoi': 'Hà Nội',
                        'asia-danang': 'Đà Nẵng'
                      };
                      toast.success(`🕐 Đã đổi múi giờ sang ${timezoneNames[value]}`);
                    }}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-hcm">GMT+7 (Hồ Chí Minh)</SelectItem>
                      <SelectItem value="asia-hanoi">GMT+7 (Hà Nội)</SelectItem>
                      <SelectItem value="asia-danang">GMT+7 (Đà Nẵng)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">Chế độ AI tự động</Label>
                    <p className="text-xs text-slate-500 mt-1">Cho phép AI tự động trả lời tin nhắn</p>
                  </div>
                  <Switch 
                    checked={aiAutoMode} 
                    onCheckedChange={(checked) => {
                      setAiAutoMode(checked);
                      toast.success(checked ? 'Đã bật AI tự động' : 'Đã tắt AI tự động');
                    }}
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                  onClick={handleSaveGeneral}
                >
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="border-slate-200/60 shadow-sm max-w-3xl">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{fullName}</p>
                  <p className="text-sm text-slate-600">{email}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleChangeAvatar}
                  >
                    Thay đổi ảnh
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Họ và tên
                  </Label>
                  <Input 
                    id="full-name"
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </Label>
                <Input 
                  id="phone"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Địa chỉ
                </Label>
                <Textarea
                  id="address"
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2"
                onClick={handleSaveProfile}
              >
                <Save className="w-4 h-4" />
                Cập nhật hồ sơ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  Cài đặt thông báo
                </CardTitle>
                <CardDescription>Quản lý các thông báo bạn nhận được</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">Tin nhắn mới</Label>
                    <p className="text-xs text-slate-500 mt-1">Nhận thông báo khi có tin nhắn mới</p>
                  </div>
                  <Switch 
                    checked={notifyNewMessage} 
                    onCheckedChange={(checked) => {
                      setNotifyNewMessage(checked);
                      toast.success(checked ? '✅ Đã bật thông báo tin nhắn mới' : '❌ Đã tắt thông báo tin nhắn mới');
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">Đăng bài thành công</Label>
                    <p className="text-xs text-slate-500 mt-1">Thông báo khi bài viết được đăng</p>
                  </div>
                  <Switch 
                    checked={notifyPostSuccess} 
                    onCheckedChange={(checked) => {
                      setNotifyPostSuccess(checked);
                      toast.success(checked ? '✅ Đã bật thông báo đăng bài' : '❌ Đã tắt thông báo đăng bài');
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">Báo cáo hàng ngày</Label>
                    <p className="text-xs text-slate-500 mt-1">Nhận báo cáo tổng hợp mỗi ngày</p>
                  </div>
                  <Switch 
                    checked={notifyDailyReport} 
                    onCheckedChange={(checked) => {
                      setNotifyDailyReport(checked);
                      toast.success(checked ? '✅ Đã bật báo cáo hàng ngày' : '❌ Đã tắt báo cáo hàng ngày');
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">Cảnh báo hệ thống</Label>
                    <p className="text-xs text-slate-500 mt-1">Thông báo về lỗi và cảnh báo</p>
                  </div>
                  <Switch 
                    checked={notifySystemAlert} 
                    onCheckedChange={(checked) => {
                      setNotifySystemAlert(checked);
                      toast.success(checked ? '✅ Đã bật cảnh báo hệ thống' : '❌ Đã tắt cảnh báo hệ thống');
                    }}
                  />
                </div>

                <Separator />

                <Button 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 gap-2"
                  onClick={handleSaveNotifications}
                >
                  <Save className="w-4 h-4" />
                  Lưu cài đặt
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Kênh nhận thông báo
                </CardTitle>
                <CardDescription>Chọn cách bạn muốn nhận thông báo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">Email</Label>
                    <p className="text-xs text-slate-500 mt-1">Gửi thông báo qua email</p>
                  </div>
                  <Switch 
                    checked={notifyEmail} 
                    onCheckedChange={(checked) => {
                      setNotifyEmail(checked);
                      toast.success(checked ? '📧 Đã bật thông báo qua Email' : '❌ Đã tắt thông báo qua Email');
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">SMS</Label>
                    <p className="text-xs text-slate-500 mt-1">Gửi thông báo qua tin nhắn SMS</p>
                  </div>
                  <Switch 
                    checked={notifySMS} 
                    onCheckedChange={(checked) => {
                      setNotifySMS(checked);
                      toast.success(checked ? '📱 Đã bật thông báo qua SMS' : '❌ Đã tắt thông báo qua SMS');
                    }}
                  />
                </div>

                <Separator />

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-purple-900">Thử nghiệm</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleTestNotification}
                    >
                      Gửi thử
                    </Button>
                  </div>
                  <p className="text-sm text-purple-700">Kiểm tra xem bạn có nhận được thông báo không</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-2xl font-semibold text-slate-900">
                      {[notifyNewMessage, notifyPostSuccess, notifyDailyReport, notifySystemAlert].filter(Boolean).length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Đã bật</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-2xl font-semibold text-slate-900">
                      {[notifyEmail, notifySMS].filter(Boolean).length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Kênh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-blue-600" />
                    Tích hợp nền tảng
                  </CardTitle>
                  <CardDescription className="mt-1">Kết nối với các nền tảng mạng xã hội</CardDescription>
                </div>
                <Badge className="bg-green-50 text-green-700 border-0">
                  {connectedCount}/{integrations.length} kết nối
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Card key={platform.id} className="border-slate-200/60">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{platform.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {platform.connected ? (
                                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Đã kết nối
                                  </Badge>
                                ) : (
                                  <Badge className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Chưa kết nối
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant={platform.connected ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleIntegration(platform.id)}
                            className={platform.connected ? '' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}
                          >
                            {platform.connected ? 'Ngắt' : 'Kết nối'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Lưu ý</p>
                    <p className="text-sm text-blue-700">Mỗi nền tảng cần cấu hình riêng. Sau khi kết nối, vui lòng kiểm tra các quyền và thiết lập webhook để đảm bảo hoạt động tốt nhất.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="border-slate-200/60 shadow-sm max-w-2xl">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-600" />
                Giao diện
              </CardTitle>
              <CardDescription>Tùy chỉnh giao diện dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="space-y-2">
                <Label htmlFor="theme">Chủ đề</Label>
                <Select 
                  value={theme} 
                  onValueChange={(value) => {
                    setTheme(value);
                    const themeNames: Record<string, string> = {
                      'light': '☀️ Sáng',
                      'dark': '🌙 Tối',
                      'auto': '🔄 Tự động'
                    };
                    toast.success(`Đã đổi sang chủ đề ${themeNames[value]}`);
                  }}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Sáng</SelectItem>
                    <SelectItem value="dark">🌙 Tối</SelectItem>
                    <SelectItem value="auto">🔄 Tự động</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-color">Màu chủ đạo</Label>
                <Select 
                  value={primaryColor} 
                  onValueChange={(value) => {
                    setPrimaryColor(value);
                    const colorNames: Record<string, string> = {
                      'blue': '🔵 Xanh dương',
                      'green': '🟢 Xanh lá',
                      'purple': '🟣 Tím',
                      'orange': '🟠 Cam',
                      'pink': '🩷 Hồng'
                    };
                    toast.success(`Đã đổi màu chủ đạo: ${colorNames[value]}`);
                  }}
                >
                  <SelectTrigger id="primary-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">🔵 Xanh dương</SelectItem>
                    <SelectItem value="green">🟢 Xanh lá</SelectItem>
                    <SelectItem value="purple">🟣 Tím</SelectItem>
                    <SelectItem value="orange">🟠 Cam</SelectItem>
                    <SelectItem value="pink">🩷 Hồng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label className="font-medium">Chế độ thu gọn</Label>
                  <p className="text-xs text-slate-500 mt-1">Hiển thị giao diện nhỏ gọn hơn</p>
                </div>
                <Switch 
                  checked={compactMode} 
                  onCheckedChange={(checked) => {
                    setCompactMode(checked);
                    toast.success(checked ? '📐 Đã bật chế độ thu gọn' : '📐 Đã tắt chế độ thu gọn');
                  }}
                />
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 gap-2"
                onClick={handleSaveAppearance}
              >
                <Save className="w-4 h-4" />
                Lưu giao diện
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-red-600" />
                  Đổi mật khẩu
                </CardTitle>
                <CardDescription>Cập nhật mật khẩu bảo mật</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  <Input 
                    id="current-password"
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input 
                    id="new-password"
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">Tối thiểu 8 ký tự</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                  <Input 
                    id="confirm-password"
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 gap-2"
                  onClick={handleChangePassword}
                >
                  <Key className="w-4 h-4" />
                  Đổi mật khẩu
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Bảo mật nâng cao
                </CardTitle>
                <CardDescription>Tăng cường bảo mật cho tài khoản</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label className="font-medium">Xác thực hai yếu tố (2FA)</Label>
                    <p className="text-xs text-slate-500 mt-1">Tăng cường bảo mật với mã OTP</p>
                  </div>
                  <Switch 
                    checked={twoFactorAuth} 
                    onCheckedChange={(checked) => {
                      setTwoFactorAuth(checked);
                      toast.success(checked ? 'Đã bật xác thực 2 yếu tố' : 'Đã tắt xác thực 2 yếu tố');
                    }}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Phiên đăng nhập</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-900">Chrome - Windows</p>
                      <Badge className="bg-green-50 text-green-700 border-0 text-xs">Hiện tại</Badge>
                    </div>
                    <p className="text-xs text-slate-600">Hồ Chí Minh, Việt Nam • 5 phút trước</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700" 
                    size="sm"
                    onClick={handleLogoutAllDevices}
                  >
                    <Trash2 className="w-4 h-4" />
                    Đăng xuất tất cả thiết bị khác
                  </Button>
                </div>

                <Separator />

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 mb-1">Bảo mật tốt</p>
                      <p className="text-sm text-green-700">Tài khoản của bạn được bảo vệ tốt. Tiếp tục duy trì các biện pháp bảo mật này.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
