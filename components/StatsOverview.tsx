import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MessageCircle, Eye } from 'lucide-react';

const postData = [
  { name: 'T2', posts: 12 },
  { name: 'T3', posts: 19 },
  { name: 'T4', posts: 15 },
  { name: 'T5', posts: 22 },
  { name: 'T6', posts: 28 },
  { name: 'T7', posts: 24 },
  { name: 'CN', posts: 18 },
];

const platformData = [
  { name: 'Facebook', value: 45, color: '#3b5998' },
  { name: 'Zalo', value: 25, color: '#0068ff' },
  { name: 'Telegram', value: 15, color: '#0088cc' },
  { name: 'Website', value: 15, color: '#007bff' },
];

const engagementData = [
  { name: 'T2', rate: 12 },
  { name: 'T3', rate: 15 },
  { name: 'T4', rate: 18 },
  { name: 'T5', rate: 14 },
  { name: 'T6', rate: 22 },
  { name: 'T7', rate: 25 },
  { name: 'CN', rate: 20 },
];

const statCards = [
  { title: 'Tổng tương tác', value: '12.5K', change: '+12%', icon: TrendingUp, color: 'text-green-600' },
  { title: 'Người dùng mới', value: '3.2K', change: '+8%', icon: Users, color: 'text-blue-600' },
  { title: 'Tin nhắn', value: '8.7K', change: '+15%', icon: MessageCircle, color: 'text-purple-600' },
  { title: 'Lượt xem', value: '45.3K', change: '+20%', icon: Eye, color: 'text-orange-600' },
];

export function StatsOverview() {
  const gradients = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
  ];

  // Calculate total for percentage
  const totalValue = platformData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
              <div className={`h-1 bg-gradient-to-r ${gradients[index]}`} />
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                    <p className="text-slate-900 mt-2 text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-sm font-semibold ${stat.color}`}>{stat.change}</span>
                      <span className="text-xs text-slate-500">vs tháng trước</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Posts per Day */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
              Bài đăng theo ngày
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={postData}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={13} />
                <YAxis stroke="#64748b" fontSize={13} />
                <Tooltip />
                <Bar dataKey="posts" fill="url(#colorPosts)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Platform Distribution */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
              Phân bố nền tảng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const { name, value } = props;
                    return `${name} ${((value as number / totalValue) * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Engagement Rate */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
              Tỷ lệ tương tác (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={engagementData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={13} />
                <YAxis stroke="#64748b" fontSize={13} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  fill="url(#colorRate)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}