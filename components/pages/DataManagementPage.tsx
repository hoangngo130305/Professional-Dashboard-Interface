import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Upload, Download, RefreshCw, Database, FileText, MessageSquare, Plus, Edit3, Trash2, FolderOpen, Tag, TrendingUp, AlertCircle, CheckCircle, FileUp, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

type QAItem = {
  id: number;
  question: string;
  answer: string;
  category: string;
  usage: number;
  lastUsed: string;
};

type Document = {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'failed';
};

type Category = {
  name: string;
  count: number;
  color: string;
};

const initialQAData: QAItem[] = [
  {
    id: 1,
    question: 'Sản phẩm có bảo hành không?',
    answer: 'Có, tất cả sản phẩm đều được bảo hành 12 tháng',
    category: 'Bảo hành',
    usage: 234,
    lastUsed: '2 giờ trước',
  },
  {
    id: 2,
    question: 'Thời gian giao hàng mất bao lâu?',
    answer: 'Giao hàng trong vòng 2-3 ngày với nội thành, 3-5 ngày với tỉnh xa',
    category: 'Vận chuyển',
    usage: 189,
    lastUsed: '5 giờ trước',
  },
  {
    id: 3,
    question: 'Có chính sách đổi trả không?',
    answer: 'Chấp nhận đổi trả trong vòng 7 ngày nếu sản phẩm lỗi',
    category: 'Chính sách',
    usage: 156,
    lastUsed: '1 ngày trước',
  },
  {
    id: 4,
    question: 'Phí vận chuyển là bao nhiêu?',
    answer: 'Freeship cho đơn hàng trên 500K, dưới 500K phí ship 30K',
    category: 'Vận chuyển',
    usage: 145,
    lastUsed: '1 ngày trước',
  },
  {
    id: 5,
    question: 'Có hỗ trợ thanh toán COD không?',
    answer: 'Có, chúng tôi hỗ trợ COD, chuyển khoản và thanh toán qua ví điện tử',
    category: 'Thanh toán',
    usage: 98,
    lastUsed: '2 ngày trước',
  },
];

const initialDocuments: Document[] = [
  { id: 1, name: 'Catalog_Products_2025.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '10/01/2025', status: 'processed' },
  { id: 2, name: 'Policy_Return.docx', type: 'DOCX', size: '156 KB', uploadDate: '09/01/2025', status: 'processed' },
  { id: 3, name: 'FAQ_Common.xlsx', type: 'XLSX', size: '89 KB', uploadDate: '08/01/2025', status: 'processing' },
];

export function DataManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [qaList, setQaList] = useState<QAItem[]>(initialQAData);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  
  // Dialog states
  const [showAddQADialog, setShowAddQADialog] = useState(false);
  const [showEditQADialog, setShowEditQADialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);
  
  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Bảo hành');
  
  // Stats
  const totalQA = qaList.length;
  const totalDocs = documents.length;
  const totalStorage = '4.2 GB';
  const recentUpdates = qaList.filter(q => q.lastUsed.includes('giờ')).length;

  // Categories with counts
  const categories: Category[] = [
    { name: 'Bảo hành', count: qaList.filter(q => q.category === 'Bảo hành').length, color: 'bg-blue-500' },
    { name: 'Vận chuyển', count: qaList.filter(q => q.category === 'Vận chuyển').length, color: 'bg-green-500' },
    { name: 'Chính sách', count: qaList.filter(q => q.category === 'Chính sách').length, color: 'bg-purple-500' },
    { name: 'Thanh toán', count: qaList.filter(q => q.category === 'Thanh toán').length, color: 'bg-orange-500' },
    { name: 'Sản phẩm', count: qaList.filter(q => q.category === 'Sản phẩm').length, color: 'bg-pink-500' },
  ];

  const filteredQaData = qaList.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddQA = () => {
    if (!question.trim() || !answer.trim()) {
      toast.error('Vui lòng nhập đầy đủ câu hỏi và câu trả lời');
      return;
    }

    const newQA: QAItem = {
      id: Date.now(),
      question,
      answer,
      category,
      usage: 0,
      lastUsed: 'Chưa sử dụng',
    };

    setQaList([newQA, ...qaList]);
    toast.success('Đã thêm Q&A mới thành công!');
    setShowAddQADialog(false);
    resetForm();
  };

  const handleEditQA = (qa: QAItem) => {
    setSelectedQA(qa);
    setQuestion(qa.question);
    setAnswer(qa.answer);
    setCategory(qa.category);
    setShowEditQADialog(true);
  };

  const handleUpdateQA = () => {
    if (!selectedQA) return;

    if (!question.trim() || !answer.trim()) {
      toast.error('Vui lòng nhập đầy đủ câu hỏi và câu trả lời');
      return;
    }

    const updatedList = qaList.map(qa =>
      qa.id === selectedQA.id
        ? { ...qa, question, answer, category }
        : qa
    );

    setQaList(updatedList);
    toast.success('Đã cập nhật Q&A thành công!');
    setShowEditQADialog(false);
    setSelectedQA(null);
    resetForm();
  };

  const handleDeleteQA = (id: number) => {
    setQaList(qaList.filter(item => item.id !== id));
    toast.success('Đã xóa Q&A');
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success('Đã xóa tài liệu');
  };

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setCategory('Bảo hành');
  };

  const handleUploadFile = () => {
    const newDoc: Document = {
      id: Date.now(),
      name: 'new_document.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      status: 'processing',
    };

    setDocuments([newDoc, ...documents]);
    
    toast.success('Đang xử lý tài liệu...', {
      description: 'AI đang phân tích và trích xuất thông tin'
    });

    // Simulate processing
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === newDoc.id ? { ...doc, status: 'processed' as const } : doc
      ));
      toast.success('Tài liệu đã được xử lý thành công!');
    }, 3000);

    setShowUploadDialog(false);
  };

  const handleExportQA = () => {
    const dataStr = JSON.stringify(qaList, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa_data_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất dữ liệu Q&A thành công!');
  };

  const handleSyncWebsite = () => {
    toast.info('Đang đồng bộ dữ liệu từ website...', { duration: 2000 });
    setTimeout(() => {
      toast.success('Đã đồng bộ 15 Q&A mới từ website!');
    }, 2000);
  };

  const handleTrainAI = () => {
    toast.info('Đang huấn luyện lại AI với dữ liệu mới...', { duration: 2000 });
    setTimeout(() => {
      toast.success('AI đã được huấn luyện lại thành công!', {
        description: 'Model đã được cập nhật với 2,345 Q&A'
      });
    }, 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
          <h1 className="text-slate-900">Quản lý dữ liệu</h1>
        </div>
        <p className="text-slate-600 ml-5">Quản lý cơ sở dữ liệu kiến thức cho AI Agent</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tổng Q&A</p>
                <p className="text-slate-900 text-2xl">{totalQA.toLocaleString()}</p>
                <Badge className="mt-2 bg-blue-50 text-blue-700 border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{recentUpdates} mới
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Tài liệu</p>
                <p className="text-slate-900 text-2xl">{totalDocs}</p>
                <Badge className="mt-2 bg-purple-50 text-purple-700 border-0 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {documents.filter(d => d.status === 'processed').length} đã xử lý
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Dung lượng</p>
                <p className="text-slate-900 text-2xl">{totalStorage}</p>
                <Badge className="mt-2 bg-green-50 text-green-700 border-0 text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  42% sử dụng
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Database className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 mb-1">Cập nhật gần đây</p>
                <p className="text-slate-900 text-2xl">{recentUpdates}</p>
                <Badge className="mt-2 bg-orange-50 text-orange-700 border-0 text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Hôm nay
                </Badge>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Tải lên dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2 shadow-lg shadow-blue-500/30"
              onClick={() => setShowUploadDialog(true)}
            >
              <FileUp className="w-4 h-4" />
              Tải file Q&A (CSV, Excel)
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => setShowUploadDialog(true)}
            >
              <FileText className="w-4 h-4" />
              Tải tài liệu (PDF, DOCX)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              Xuất dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={handleExportQA}
            >
              <Download className="w-4 h-4" />
              Xuất toàn bộ Q&A
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => toast.info('Tính năng đang phát triển')}
            >
              <FileText className="w-4 h-4" />
              Xuất lịch sử hội thoại
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              Đồng bộ & Huấn luyện
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={handleSyncWebsite}
            >
              <RefreshCw className="w-4 h-4" />
              Đồng bộ từ website
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={handleTrainAI}
            >
              <Database className="w-4 h-4" />
              Huấn luyện lại AI
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <Tabs defaultValue="qa" className="space-y-5">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="qa" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Cơ sở dữ liệu Q&A
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Tag className="w-4 h-4" />
            Danh mục
          </TabsTrigger>
        </TabsList>

        {/* Q&A Tab */}
        <TabsContent value="qa">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Cơ sở dữ liệu Q&A
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {qaList.length} câu hỏi và câu trả lời
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Tìm kiếm..." 
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                    onClick={() => setShowAddQADialog(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Thêm Q&A
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="w-[30%]">Câu hỏi</TableHead>
                      <TableHead className="w-[35%]">Câu trả lời</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Lượt dùng</TableHead>
                      <TableHead>Gần nhất</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQaData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-600 mb-1">
                            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có Q&A nào'}
                          </p>
                          <p className="text-sm text-slate-500">
                            {searchQuery ? 'Thử từ khóa khác' : 'Thêm Q&A mới để bắt đầu'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQaData.map((item) => (
                        <TableRow key={item.id} className="border-slate-200 hover:bg-slate-50">
                          <TableCell>
                            <p className="text-sm text-slate-900 line-clamp-2">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-slate-600 line-clamp-2">{item.answer}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-300">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-50 text-blue-700 border-0">{item.usage}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-500">{item.lastUsed}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => handleEditQA(item)}
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Sửa
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 text-xs hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleDeleteQA(item.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Xóa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Tài liệu đã tải lên
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {documents.length} tài liệu
                  </CardDescription>
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="w-4 h-4" />
                  Tải lên tài liệu
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-3">
                {documents.map((doc) => (
                  <Card key={doc.id} className="border-slate-200/60">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{doc.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>{doc.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {doc.status === 'processed' && (
                            <Badge className="bg-green-50 text-green-700 border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã xử lý
                            </Badge>
                          )}
                          {doc.status === 'processing' && (
                            <Badge className="bg-orange-50 text-orange-700 border-0">
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Đang xử lý
                            </Badge>
                          )}
                          {doc.status === 'failed' && (
                            <Badge className="bg-red-50 text-red-700 border-0">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Thất bại
                            </Badge>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                Danh mục dữ liệu
              </CardTitle>
              <CardDescription className="mt-1">
                Phân loại theo chủ đề
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <Card key={cat.name} className="border-slate-200/60 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-5 pb-5">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                          <FolderOpen className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-slate-900 mb-1">{cat.name}</p>
                        <p className="text-2xl font-semibold text-slate-900 mb-1">{cat.count}</p>
                        <p className="text-xs text-slate-500">câu hỏi</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Q&A Dialog */}
      <Dialog open={showAddQADialog} onOpenChange={setShowAddQADialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Thêm Q&A mới
            </DialogTitle>
            <DialogDescription>
              Thêm câu hỏi và câu trả lời mới vào cơ sở dữ liệu
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Câu hỏi</Label>
              <Input
                id="question"
                placeholder="Nhập câu hỏi..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Câu trả lời</Label>
              <Textarea
                id="answer"
                placeholder="Nhập câu trả lời..."
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bảo hành">Bảo hành</SelectItem>
                  <SelectItem value="Vận chuyển">Vận chuyển</SelectItem>
                  <SelectItem value="Chính sách">Chính sách</SelectItem>
                  <SelectItem value="Thanh toán">Thanh toán</SelectItem>
                  <SelectItem value="Sản phẩm">Sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddQADialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddQA}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Q&A
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Q&A Dialog */}
      <Dialog open={showEditQADialog} onOpenChange={setShowEditQADialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Chỉnh sửa Q&A
            </DialogTitle>
            <DialogDescription>
              Cập nhật câu hỏi và câu trả lời
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question">Câu hỏi</Label>
              <Input
                id="edit-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-answer">Câu trả lời</Label>
              <Textarea
                id="edit-answer"
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Danh mục</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bảo hành">Bảo hành</SelectItem>
                  <SelectItem value="Vận chuyển">Vận chuyển</SelectItem>
                  <SelectItem value="Chính sách">Chính sách</SelectItem>
                  <SelectItem value="Thanh toán">Thanh toán</SelectItem>
                  <SelectItem value="Sản phẩm">Sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditQADialog(false);
              setSelectedQA(null);
              resetForm();
            }}>
              Hủy
            </Button>
            <Button onClick={handleUpdateQA}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600" />
              Tải lên tài liệu
            </DialogTitle>
            <DialogDescription>
              Tải lên file để AI phân tích và trích xuất thông tin
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-900 mb-1">Kéo thả file vào đây</p>
              <p className="text-sm text-slate-500 mb-4">hoặc click để chọn file</p>
              <p className="text-xs text-slate-400">Hỗ trợ: PDF, DOCX, XLSX, CSV (tối đa 10MB)</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleUploadFile}>
              <Upload className="w-4 h-4 mr-2" />
              Tải lên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
