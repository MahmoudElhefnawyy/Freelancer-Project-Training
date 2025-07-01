import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Flag,
  Clock,
  CheckCircle,
  MessageSquare,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";

export default function TaskDetails() {
  const params = useParams();
  const taskId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery({
    queryKey: ["/api/tasks", taskId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}`);
      return response.json();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "تم حذف المهمة بنجاح",
        description: "تم حذف المهمة من النظام",
      });
      setLocation("/tasks");
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress: number) => {
      await apiRequest("PUT", `/api/tasks/${taskId}`, { progress: newProgress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "تم تحديث التقدم",
        description: "تم تحديث نسبة إنجاز المهمة",
      });
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      completed: "مكتمل",
      in_progress: "قيد التنفيذ",
      pending: "مجدول",
      overdue: "متأخر"
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      high: "عالية",
      medium: "متوسطة",
      low: "منخفضة"
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  const handleDeleteTask = () => {
    if (window.confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
      deleteTaskMutation.mutate();
    }
  };

  const handleProgressUpdate = (increment: number) => {
    const currentProgress = task?.progress || 0;
    const newProgress = Math.max(0, Math.min(100, currentProgress + increment));
    updateProgressMutation.mutate(newProgress);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "??";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">المهمة غير موجودة</h2>
          <Button onClick={() => setLocation("/tasks")}>العودة إلى قائمة المهام</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{task.title} - تفاصيل المهمة</title>
        <meta name="description" content={`تفاصيل المهمة: ${task.title}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setLocation("/tasks")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    العودة إلى المهام
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                    <p className="text-gray-600">تفاصيل المهمة ومتابعة التقدم</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setLocation(`/tasks/${taskId}/edit`)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteTask}
                    disabled={deleteTaskMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Task Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Task Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات المهمة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">الوصف</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {task.description || "لا يوجد وصف متاح"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          تاريخ الإنشاء
                        </h4>
                        <p className="text-gray-600">
                          {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          تاريخ التسليم
                        </h4>
                        <p className="text-gray-600">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ar-SA') : "غير محدد"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Update */}
                <Card>
                  <CardHeader>
                    <CardTitle>إدارة التقدم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">نسبة الإنجاز</span>
                          <span className="text-2xl font-bold text-primary">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-3" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgressUpdate(-10)}
                          disabled={task.progress <= 0 || updateProgressMutation.isPending}
                        >
                          -10%
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgressUpdate(-5)}
                          disabled={task.progress <= 0 || updateProgressMutation.isPending}
                        >
                          -5%
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgressUpdate(5)}
                          disabled={task.progress >= 100 || updateProgressMutation.isPending}
                        >
                          +5%
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgressUpdate(10)}
                          disabled={task.progress >= 100 || updateProgressMutation.isPending}
                        >
                          +10%
                        </Button>
                        {task.progress < 100 && (
                          <Button
                            size="sm"
                            onClick={() => handleProgressUpdate(100 - task.progress)}
                            disabled={updateProgressMutation.isPending}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                            إنهاء المهمة
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      التعليقات والملاحظات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Textarea
                          placeholder="أضف تعليق أو ملاحظة..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button 
                          className="mt-2 flex items-center gap-2"
                          disabled={!newComment.trim()}
                        >
                          <Plus className="h-4 w-4" />
                          إضافة تعليق
                        </Button>
                      </div>
                      
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>لا توجد تعليقات بعد</p>
                        <p className="text-sm">كن أول من يضيف تعليق على هذه المهمة</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status & Priority */}
                <Card>
                  <CardHeader>
                    <CardTitle>الحالة والأولوية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        الحالة
                      </h4>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        الأولوية
                      </h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityText(task.priority)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Assignee */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      المسؤول
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {task.assignee ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-white">
                            {getInitials(task.assignee.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{task.assignee.fullName}</p>
                          <p className="text-sm text-gray-600">{task.assignee.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">غير مخصص</p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>إجراءات سريعة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setLocation(`/tasks/${taskId}/edit`)}
                    >
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل المهمة
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigator.share?.({ 
                        title: task.title, 
                        text: task.description,
                        url: window.location.href 
                      })}
                    >
                      مشاركة المهمة
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 hover:text-red-800"
                      onClick={handleDeleteTask}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف المهمة
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}