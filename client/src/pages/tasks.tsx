import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Star, Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Tasks() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<any[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "تم حذف المهمة بنجاح",
        description: "تم حذف المهمة من النظام",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في حذف المهمة",
        description: "حدث خطأ أثناء محاولة حذف المهمة",
        variant: "destructive",
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

  const filteredTasks = Array.isArray(tasks) ? tasks.filter((task: any) => {
    const matchesSearch = !searchTerm || task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus = !statusFilter || statusFilter === "all" || task.status === statusFilter;
    const matchesAssignee = !assigneeFilter || assigneeFilter === "all" || task.assigneeId?.toString() === assigneeFilter;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
  }) : [];

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleViewTask = (taskId: number) => {
    setLocation(`/tasks/${taskId}`);
  };

  const handleEditTask = (taskId: number) => {
    setLocation(`/tasks/${taskId}/edit`);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">جاري التحميل...</div>
    </div>;
  }

  return (
    <>
      <Helmet>
        <title>إدارة المهام - نظام إدارة المهام 2025</title>
        <meta name="description" content="إدارة وتتبع جميع المهام في النظام مع إمكانيات الفلترة والبحث" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">إدارة المهام</h2>
                  <p className="text-gray-600">إدارة وتتبع جميع المهام</p>
                </div>
                <Button
                  onClick={() => setLocation("/add-task")}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة مهام +
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input 
                      placeholder="البحث في المهام..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الأولويات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأولويات</SelectItem>
                        <SelectItem value="high">عالية</SelectItem>
                        <SelectItem value="medium">متوسطة</SelectItem>
                        <SelectItem value="low">منخفضة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="pending">مجدول</SelectItem>
                        <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                        <SelectItem value="completed">مكتمل</SelectItem>
                        <SelectItem value="overdue">متأخر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="جميع المسؤولين" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المسؤولين</SelectItem>
                        {Array.isArray(users) && users.map((user: any) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Table */}
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المهام</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإضافة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأولوية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المسؤول</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التقدم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأفعال</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTasks.map((task: any, index: number) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                <div className="text-xs text-gray-500">{task.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                              {getPriorityText(task.priority)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                              {getStatusText(task.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {task.assignee?.fullName || 'غير محدد'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{task.progress}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleViewTask(task.id)}
                                title="عرض تفاصيل المهمة"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-600 hover:text-green-800"
                                onClick={() => handleEditTask(task.id)}
                                title="تعديل المهمة"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteTask(task.id)}
                                disabled={deleteTaskMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
