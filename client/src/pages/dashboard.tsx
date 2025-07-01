import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Calendar, Star, Plus, TrendingUp, Users, Eye } from "lucide-react";
import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  const recentTasks = Array.isArray(tasks) ? tasks.slice(0, 5) : [];
  const todayTasks = Array.isArray(tasks) ? tasks.filter((task: any) => {
    const today = new Date();
    const taskDate = new Date(task.createdAt);
    return taskDate.toDateString() === today.toDateString();
  }) : [];
  
  const overdueTasks = Array.isArray(tasks) ? tasks.filter((task: any) => 
    task.status === 'overdue' || 
    (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed')
  ) : [];

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

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">جاري التحميل...</div>
    </div>;
  }

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - نظام إدارة المهام 2025</title>
        <meta name="description" content="لوحة التحكم الرئيسية لنظام إدارة المهام مع الإحصائيات والمتابعة" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
              <p className="text-gray-600">نظرة عامة على المهام والإحصائيات</p>
            </div>

            {/* Progress Overview */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {analytics?.progressPercentage || "0"}%
                        </div>
                        <div className="text-sm text-gray-600">نسبة الإنجاز</div>
                      </div>
                    </div>
                    <Progress 
                      value={parseFloat(analytics?.progressPercentage || "0")} 
                      className="w-32 h-32 rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-r-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المهام المكتملة</p>
                      <p className="text-3xl font-bold text-green-600">
                        {analytics?.metrics?.completed || 0}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المهام المتأخرة</p>
                      <p className="text-3xl font-bold text-red-600">
                        {analytics?.metrics?.overdue || 0}
                      </p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المهام قيد التنفيذ</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {analytics?.metrics?.inProgress || 0}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المهام المجدولة</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {analytics?.metrics?.scheduled || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>تحليل المهام الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>توزيع المهام</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/add-task")}>
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">إضافة مهمة</h3>
                  <p className="text-sm text-gray-600">إنشاء مهمة جديدة</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/employees")}>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">إدارة الموظفين</h3>
                  <p className="text-sm text-gray-600">عرض وإدارة الموظفين</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/tasks")}>
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">عرض المهام</h3>
                  <p className="text-sm text-gray-600">استعراض جميع المهام</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/reports")}>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800">التقارير</h3>
                  <p className="text-sm text-gray-600">عرض التقارير والتحليلات</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{todayTasks.length}</div>
                  <div className="text-sm text-blue-800 font-medium">مهام اليوم</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100">
                  <div className="text-3xl font-bold text-red-600 mb-1">{overdueTasks.length}</div>
                  <div className="text-sm text-red-800 font-medium">مهام متأخرة</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {Array.isArray(users) ? users.length : 0}
                  </div>
                  <div className="text-sm text-green-800 font-medium">إجمالي الموظفين</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {Array.isArray(tasks) ? tasks.length : 0}
                  </div>
                  <div className="text-sm text-purple-800 font-medium">إجمالي المهام</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tasks Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>المهام الحديثة</CardTitle>
                  <Button variant="ghost" onClick={() => setLocation("/tasks")}>
                    عرض الكل
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المهمة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأولوية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المسؤول</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTasks.map((task: any, index: number) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-900">{task.title}</span>
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
