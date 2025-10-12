import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download, TrendingUp, TrendingDown, Users, MessageCircle, Eye, Heart, Share2, ShoppingCart, DollarSign, BarChart3, PieChart, LineChart, Calendar, FileText, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart as RechartsLine, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Data sets for different time ranges
const dataByTimeRange = {
  today: {
    conversations: [
      { name: '0h', conversations: 12, responses: 12 },
      { name: '4h', conversations: 8, responses: 8 },
      { name: '8h', conversations: 25, responses: 24 },
      { name: '12h', conversations: 45, responses: 44 },
      { name: '16h', conversations: 38, responses: 37 },
      { name: '20h', conversations: 32, responses: 31 },
      { name: '24h', conversations: 18, responses: 18 },
    ],
    engagement: [
      { time: '00:00', views: 120, likes: 45, comments: 12 },
      { time: '04:00', views: 80, likes: 30, comments: 8 },
      { time: '08:00', views: 340, likes: 120, comments: 35 },
      { time: '12:00', views: 580, likes: 210, comments: 56 },
      { time: '16:00', views: 420, likes: 150, comments: 42 },
      { time: '20:00', views: 680, likes: 245, comments: 68 },
      { time: '23:59', views: 380, likes: 135, comments: 38 },
    ],
    revenue: [
      { month: 'Hôm nay', revenue: 3800000, orders: 12 },
    ],
    topContent: [
      { id: 1, title: 'Flash Sale 50% - Áo thun nam', views: 2345, likes: 189, comments: 45, shares: 23, engagement: 24.5 },
      { id: 2, title: 'Review sản phẩm từ khách hàng', views: 1876, likes: 142, comments: 32, shares: 18, engagement: 21.2 },
      { id: 3, title: 'Giới thiệu BST mới 2025', views: 1654, likes: 125, comments: 28, shares: 15, engagement: 18.9 },
    ],
    topCustomers: [
      { id: 1, name: 'Nguyễn Văn A', messages: 8, orders: 1, revenue: 850000, satisfaction: 98 },
      { id: 2, name: 'Trần Thị B', messages: 6, orders: 1, revenue: 650000, satisfaction: 95 },
      { id: 3, name: 'Lê Văn C', messages: 5, orders: 2, revenue: 1200000, satisfaction: 100 },
    ],
  },
  '7days': {
    conversations: [
      { name: 'T2', conversations: 120, responses: 115 },
      { name: 'T3', conversations: 145, responses: 142 },
      { name: 'T4', conversations: 178, responses: 175 },
      { name: 'T5', conversations: 134, responses: 130 },
      { name: 'T6', conversations: 198, responses: 195 },
      { name: 'T7', conversations: 165, responses: 162 },
      { name: 'CN', conversations: 142, responses: 140 },
    ],
    engagement: [
      { time: '00:00', views: 120, likes: 45, comments: 12 },
      { time: '04:00', views: 80, likes: 30, comments: 8 },
      { time: '08:00', views: 340, likes: 120, comments: 35 },
      { time: '12:00', views: 580, likes: 210, comments: 56 },
      { time: '16:00', views: 420, likes: 150, comments: 42 },
      { time: '20:00', views: 680, likes: 245, comments: 68 },
      { time: '23:59', views: 380, likes: 135, comments: 38 },
    ],
    revenue: [
      { month: '7 ngày', revenue: 18500000, orders: 62 },
    ],
    topContent: [
      { id: 1, title: 'Flash Sale 50% - Áo thun nam', views: 12345, likes: 892, comments: 234, shares: 156, engagement: 23.5 },
      { id: 2, title: 'Review sản phẩm từ khách hàng', views: 9876, likes: 745, comments: 189, shares: 98, engagement: 19.8 },
      { id: 3, title: 'Giới thiệu BST mới 2025', views: 8765, likes: 654, comments: 167, shares: 87, engagement: 18.2 },
      { id: 4, title: 'Top 5 sản phẩm bán chạy', views: 7654, likes: 543, comments: 145, shares: 76, engagement: 16.5 },
      { id: 5, title: 'Hướng dẫn chọn size chuẩn', views: 6543, likes: 478, comments: 123, shares: 65, engagement: 14.8 },
    ],
    topCustomers: [
      { id: 1, name: 'Nguyễn Văn A', messages: 45, orders: 3, revenue: 2500000, satisfaction: 98 },
      { id: 2, name: 'Trần Thị B', messages: 38, orders: 2, revenue: 1800000, satisfaction: 95 },
      { id: 3, name: 'Lê Văn C', messages: 32, orders: 4, revenue: 3200000, satisfaction: 100 },
      { id: 4, name: 'Phạm Thị D', messages: 29, orders: 2, revenue: 1500000, satisfaction: 92 },
      { id: 5, name: 'Hoàng Văn E', messages: 25, orders: 3, revenue: 2100000, satisfaction: 96 },
    ],
  },
  '30days': {
    conversations: [
      { name: 'T1', conversations: 520, responses: 508 },
      { name: 'T2', conversations: 645, responses: 632 },
      { name: 'T3', conversations: 578, responses: 565 },
      { name: 'T4', conversations: 734, responses: 721 },
    ],
    engagement: [
      { time: '00:00', views: 3200, likes: 1150, comments: 280 },
      { time: '04:00', views: 2100, likes: 780, comments: 190 },
      { time: '08:00', views: 5400, likes: 1980, comments: 520 },
      { time: '12:00', views: 8200, likes: 3100, comments: 890 },
      { time: '16:00', views: 6800, likes: 2450, comments: 680 },
      { time: '20:00', views: 9500, likes: 3600, comments: 1020 },
      { time: '23:59', views: 5200, likes: 1890, comments: 510 },
    ],
    revenue: [
      { month: 'T1', revenue: 12500000, orders: 45 },
      { month: 'T2', revenue: 15200000, orders: 52 },
      { month: 'T3', revenue: 18900000, orders: 68 },
      { month: 'T4', revenue: 24800000, orders: 88 },
    ],
    topContent: [
      { id: 1, title: 'Flash Sale 50% - Áo thun nam', views: 45678, likes: 3245, comments: 892, shares: 567, engagement: 25.8 },
      { id: 2, title: 'Review sản phẩm từ khách hàng', views: 38900, likes: 2876, comments: 745, shares: 432, engagement: 22.4 },
      { id: 3, title: 'Giới thiệu BST mới 2025', views: 32540, likes: 2345, comments: 654, shares: 389, engagement: 20.1 },
      { id: 4, title: 'Top 5 sản phẩm bán chạy', views: 28900, likes: 2012, comments: 543, shares: 298, engagement: 18.7 },
      { id: 5, title: 'Hướng dẫn chọn size chuẩn', views: 25600, likes: 1876, comments: 478, shares: 256, engagement: 17.3 },
    ],
    topCustomers: [
      { id: 1, name: 'Nguyễn Văn A', messages: 156, orders: 12, revenue: 9800000, satisfaction: 98 },
      { id: 2, name: 'Trần Thị B', messages: 142, orders: 9, revenue: 7200000, satisfaction: 96 },
      { id: 3, name: 'Lê Văn C', messages: 128, orders: 15, revenue: 11500000, satisfaction: 100 },
      { id: 4, name: 'Phạm Thị D', messages: 115, orders: 8, revenue: 6400000, satisfaction: 94 },
      { id: 5, name: 'Hoàng Văn E', messages: 98, orders: 11, revenue: 8900000, satisfaction: 97 },
    ],
  },
  '90days': {
    conversations: [
      { name: 'T1', conversations: 1520, responses: 1488 },
      { name: 'T2', conversations: 1845, responses: 1812 },
      { name: 'T3', conversations: 2178, responses: 2145 },
    ],
    engagement: [
      { time: '00:00', views: 9800, likes: 3650, comments: 890 },
      { time: '04:00', views: 6700, likes: 2340, comments: 580 },
      { time: '08:00', views: 16500, likes: 6200, comments: 1650 },
      { time: '12:00', views: 25600, likes: 9800, comments: 2890 },
      { time: '16:00', views: 21200, likes: 7890, comments: 2150 },
      { time: '20:00', views: 29800, likes: 11500, comments: 3280 },
      { time: '23:59', views: 16700, likes: 6100, comments: 1680 },
    ],
    revenue: [
      { month: 'T1', revenue: 12500000, orders: 45 },
      { month: 'T2', revenue: 15200000, orders: 52 },
      { month: 'T3', revenue: 18900000, orders: 68 },
      { month: 'T4', revenue: 16700000, orders: 59 },
      { month: 'T5', revenue: 21300000, orders: 75 },
      { month: 'T6', revenue: 24800000, orders: 88 },
    ],
    topContent: [
      { id: 1, title: 'Flash Sale 50% - Áo thun nam', views: 125678, likes: 9245, comments: 2892, shares: 1567, engagement: 28.2 },
      { id: 2, title: 'Review sản phẩm từ khách hàng', views: 108900, likes: 7876, comments: 2145, shares: 1232, engagement: 24.8 },
      { id: 3, title: 'Giới thiệu BST mới 2025', views: 95640, likes: 6845, comments: 1854, shares: 1089, engagement: 22.5 },
      { id: 4, title: 'Top 5 sản phẩm bán chạy', views: 82900, likes: 5912, comments: 1543, shares: 898, engagement: 20.3 },
      { id: 5, title: 'Hướng dẫn chọn size chuẩn', views: 75600, likes: 5276, comments: 1378, shares: 756, engagement: 18.9 },
    ],
    topCustomers: [
      { id: 1, name: 'Nguyễn Văn A', messages: 478, orders: 35, revenue: 28900000, satisfaction: 99 },
      { id: 2, name: 'Trần Thị B', messages: 442, orders: 28, revenue: 22400000, satisfaction: 97 },
      { id: 3, name: 'Lê Văn C', messages: 398, orders: 42, revenue: 34200000, satisfaction: 100 },
      { id: 4, name: 'Phạm Thị D', messages: 365, orders: 25, revenue: 19800000, satisfaction: 95 },
      { id: 5, name: 'Hoàng Văn E', messages: 328, orders: 32, revenue: 26500000, satisfaction: 98 },
    ],
  },
};

const platformData = [
  { name: 'Facebook', value: 45, color: '#3b5998' },
  { name: 'Instagram', value: 25, color: '#E4405F' },
  { name: 'Zalo', value: 20, color: '#0068FF' },
  { name: 'Telegram', value: 10, color: '#0088CC' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export function ReportsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  // Get data based on selected time range
  const currentData = useMemo(() => {
    return dataByTimeRange[timeRange as keyof typeof dataByTimeRange] || dataByTimeRange['7days'];
  }, [timeRange]);

  // Calculate stats based on current data
  const stats = useMemo(() => {
    const totalConversations = currentData.conversations.reduce((sum, day) => sum + day.conversations, 0);
    const totalResponses = currentData.conversations.reduce((sum, day) => sum + day.responses, 0);
    const responseRate = ((totalResponses / totalConversations) * 100).toFixed(1);
    const totalRevenue = currentData.revenue.reduce((sum, month) => sum + month.revenue, 0);
    const totalOrders = currentData.revenue.reduce((sum, month) => sum + month.orders, 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : '0';

    return {
      totalConversations,
      totalResponses,
      responseRate,
      totalRevenue,
      totalOrders,
      avgOrderValue,
    };
  }, [currentData]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    
    const labels: { [key: string]: string } = {
      'today': 'Hôm nay',
      '7days': '7 ngày qua',
      '30days': '30 ngày qua',
      '90days': '90 ngày qua',
    };

    toast.success('Đã chuyển sang ' + labels[value], {
      description: 'Dữ liệu đã được cập nhật'
    });
  };

  const handleExportReport = () => {
    toast.success('Đang xuất báo cáo...', { duration: 2000 });
    setTimeout(() => {
      const reportData = {
        timeRange,
        generatedAt: new Date().toISOString(),
        stats,
        topContent: currentData.topContent,
        topCustomers: currentData.topCustomers,
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${timeRange}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Đã xuất báo cáo thành công!');
    }, 2000);
  };

  const connectedCount = platformData.length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
            <h1 className="text-slate-900">Báo cáo thống kê</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="90days">90 ngày qua</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2"
              onClick={handleExportReport}
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
        <p className="text-slate-600 ml-5">Phân tích hiệu suất và tương tác chi tiết</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tổng hội thoại</p>
                <p className="text-slate-900 text-2xl">{stats.totalConversations.toLocaleString()}</p>
                <Badge className="mt-2 bg-green-50 text-green-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5%
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tỷ lệ phản hồi</p>
                <p className="text-slate-900 text-2xl">{stats.responseRate}%</p>
                <Badge className="mt-2 bg-emerald-50 text-emerald-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.3%
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Doanh thu</p>
                <p className="text-slate-900 text-2xl">{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                <Badge className="mt-2 bg-purple-50 text-purple-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.2%
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Đơn hàng</p>
                <p className="text-slate-900 text-2xl">{stats.totalOrders}</p>
                <Badge className="mt-2 bg-orange-50 text-orange-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.7%
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="conversations" className="space-y-5">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="conversations" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Hội thoại
          </TabsTrigger>
          <TabsTrigger value="engagement" className="gap-2">
            <Heart className="w-4 h-4" />
            Tương tác
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="platforms" className="gap-2">
            <PieChart className="w-4 h-4" />
            Nền tảng
          </TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  Xu hướng hội thoại
                </CardTitle>
                <CardDescription>Số lượng hội thoại theo ngày</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={currentData.conversations}>
                    <defs>
                      <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="conversations" name="Hội thoại" stroke="#3b82f6" fillOpacity={1} fill="url(#colorConv)" />
                    <Area type="monotone" dataKey="responses" name="Phản hồi" stroke="#10b981" fillOpacity={1} fill="url(#colorResp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Top khách hàng
                </CardTitle>
                <CardDescription>Tương tác nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-3">
                  {currentData.topCustomers.slice(0, 5).map((customer, index) => (
                    <div key={customer.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.messages} tin nhắn • {customer.orders} đơn</p>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">
                        {customer.satisfaction}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-pink-600" />
                  Tương tác theo giờ
                </CardTitle>
                <CardDescription>Views, Likes, Comments trong ngày</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentData.engagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" name="Lượt xem" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="likes" name="Lượt thích" fill="#ec4899" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="comments" name="Bình luận" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Top nội dung
                </CardTitle>
                <CardDescription>Hiệu quả cao nhất</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-3">
                  {currentData.topContent.slice(0, 5).map((content, index) => (
                    <div key={content.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-slate-900 line-clamp-1 flex-1">{content.title}</p>
                        <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs ml-2">
                          {content.engagement}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {content.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {content.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {content.comments}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Doanh thu & Đơn hàng
                  </CardTitle>
                  <CardDescription className="mt-1">Theo thời gian đã chọn</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">Giá trị đơn trung bình</p>
                  <p className="text-2xl font-semibold text-slate-900">{parseInt(stats.avgOrderValue).toLocaleString()}đ</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={currentData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'Doanh thu') return [parseInt(value).toLocaleString() + 'đ', name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="orders" name="Đơn hàng" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  Phân bố nền tảng
                </CardTitle>
                <CardDescription>Tỷ lệ sử dụng các kênh</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Chi tiết theo nền tảng
                </CardTitle>
                <CardDescription>Thống kê tương tác</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-4">
                  {platformData.map((platform) => (
                    <div key={platform.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{platform.name}</span>
                        <span className="text-sm text-slate-600">{platform.value}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${platform.value}%`,
                            backgroundColor: platform.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Insight</p>
                      <p className="text-sm text-blue-700">Facebook đang là nền tảng mang lại nhiều tương tác nhất (45%). Nên tăng cường đầu tư nội dung cho kênh này.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detailed Reports */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Content Table */}
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Nội dung hiệu quả nhất
            </CardTitle>
            <CardDescription>Top {currentData.topContent.length} bài đăng có tương tác cao</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-3">
              {currentData.topContent.map((item, index) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 mb-2">{item.title}</p>
                      <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{item.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{item.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          <span>{item.shares}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs flex-shrink-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {item.engagement}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers Table */}
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Khách hàng tích cực
            </CardTitle>
            <CardDescription>Top {currentData.topCustomers.length} khách hàng có giá trị cao</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-3">
              {currentData.topCustomers.map((customer, index) => (
                <div key={customer.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.messages} tin nhắn</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-50 text-blue-700 border-0 text-xs mb-1">
                        {customer.orders} đơn
                      </Badge>
                      <p className="text-xs text-slate-600">{(customer.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${customer.satisfaction}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">{customer.satisfaction}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
