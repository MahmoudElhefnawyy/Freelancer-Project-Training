import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Search, TrendingUp, Users, Clock, Star, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";

export default function Reports() {
  const { toast } = useToast();
  
  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (!Array.isArray(data) || data.length === 0) {
      toast({
        title: "لا توجد بيانات للتصدير",
        description: "لا توجد بيانات متاحة لإنشاء التقرير",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم تصدير التقرير بنجاح",
      description: `تم حفظ ${filename}.csv على جهازك`,
    });
  };

  const exportTasksReport = () => {
    if (!Array.isArray(tasks)) return;
    
    const reportData = tasks.map(task => ({
      'رقم المهمة': task.id,
      'اسم المهمة': task.title,
      'الوصف': task.description || 'لا يوجد',
      'الحالة': task.status === 'completed' ? 'مكتمل' : 
               task.status === 'in_progress' ? 'قيد التنفيذ' :
               task.status === 'overdue' ? 'متأخر' : 'مجدول',
      'الأولوية': task.priority === 'high' ? 'عالية' :
                  task.priority === 'medium' ? 'متوسطة' : 'منخفضة',
      'نسبة الإنجاز': `${task.progress || 0}%`,
      'المسؤول': task.assigneeId || 'غير محدد',
      'تاريخ الإنشاء': new Date(task.createdAt).toLocaleDateString('ar-SA'),
      'تاريخ التسليم': task.dueDate ? new Date(task.dueDate).toLocaleDateString('ar-SA') : 'غير محدد'
    }));
    
    exportToCSV(reportData, `تقرير_المهام_${new Date().toLocaleDateString('ar-SA')}`);
  };

  const exportUsersReport = () => {
    if (!Array.isArray(users)) return;
    
    const reportData = users.map(user => ({
      'رقم الموظف': user.id,
      'الاسم الكامل': user.fullName,
      'اسم المستخدم': user.username,
      'البريد الإلكتروني': user.email,
      'الدور': user.role === 'admin' ? 'مدير النظام' :
              user.role === 'manager' ? 'مدير' : 'موظف',
      'تاريخ التسجيل': 'يناير 2025'
    }));
    
    exportToCSV(reportData, `تقرير_الموظفين_${new Date().toLocaleDateString('ar-SA')}`);
  };

  const exportPerformanceReport = () => {
    if (!Array.isArray(tasks)) return;
    
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    
    const reportData = [
      {
        'المؤشر': 'المهام المكتملة',
        'العدد': completedTasks,
        'النسبة': `${((completedTasks / tasks.length) * 100).toFixed(1)}%`
      },
      {
        'المؤشر': 'المهام قيد التنفيذ',
        'العدد': inProgressTasks,
        'النسبة': `${((inProgressTasks / tasks.length) * 100).toFixed(1)}%`
      },
      {
        'المؤشر': 'المهام المتأخرة',
        'العدد': overdueTasks,
        'النسبة': `${((overdueTasks / tasks.length) * 100).toFixed(1)}%`
      },
      {
        'المؤشر': 'المهام المجدولة',
        'العدد': pendingTasks,
        'النسبة': `${((pendingTasks / tasks.length) * 100).toFixed(1)}%`
      }
    ];
    
    exportToCSV(reportData, `تقرير_الأداء_${new Date().toLocaleDateString('ar-SA')}`);
  };

  const reportCards = [
    {
      title: "تقرير الأداء الشهري",
      description: "تحليل شامل للإنجازات والأداء",
      icon: TrendingUp,
      color: "green",
      action: "download",
      onClick: exportPerformanceReport
    },
    {
      title: "تقرير المهام", 
      description: "جميع المهام مع تفاصيلها",
      icon: FileText,
      color: "blue",
      action: "download",
      onClick: exportTasksReport
    },
    {
      title: "تقرير الموظفين",
      description: "بيانات الموظفين والأدوار",
      icon: Users,
      color: "purple",
      action: "download",
      onClick: exportUsersReport
    },
    {
      title: "تقرير يومي سريع",
      description: "ملخص سريع للنشاط اليومي",
      icon: Calendar,
      color: "yellow",
      action: "view",
      onClick: () => {
        const today = new Date().toLocaleDateString('ar-SA');
        toast({
          title: "تقرير يومي",
          description: `تقرير سريع ليوم ${today} - يتم العمل على التطوير`,
        });
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        border: "border-green-200",
        bg: "bg-green-100",
        text: "text-green-600",
        button: "bg-green-500 hover:bg-green-600"
      },
      blue: {
        border: "border-blue-200", 
        bg: "bg-blue-100",
        text: "text-blue-600",
        button: "bg-blue-500 hover:bg-blue-600"
      },
      yellow: {
        border: "border-yellow-200",
        bg: "bg-yellow-100", 
        text: "text-yellow-600",
        button: "bg-yellow-500 hover:bg-yellow-600"
      },
      purple: {
        border: "border-purple-200",
        bg: "bg-purple-100",
        text: "text-purple-600", 
        button: "bg-purple-500 hover:bg-purple-600"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getButtonText = (action: string) => {
    const actionMap = {
      download: "تحميل التقرير",
      view: "عرض التقرير", 
      browse: "تصفح"
    };
    return actionMap[action as keyof typeof actionMap] || "عرض";
  };

  const getButtonIcon = (action: string) => {
    const iconMap = {
      download: Download,
      view: Eye,
      browse: Search
    };
    return iconMap[action as keyof typeof iconMap] || Eye;
  };

  return (
    <>
      <Helmet>
        <title>التقارير والإحصائيات - نظام إدارة المهام 2025</title>
        <meta name="description" content="تقارير مفصلة حول أداء المهام والفرق مع إحصائيات شاملة" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">التقارير والإحصائيات</h2>
              <p className="text-gray-600">تقارير مفصلة حول أداء المهام والفرق</p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {reportCards.map((report, index) => {
                const colors = getColorClasses(report.color);
                const ButtonIcon = getButtonIcon(report.action);
                
                return (
                  <Card key={index} className={`border-2 ${colors.border}`}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className={`${colors.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <report.icon className={`h-8 w-8 ${colors.text}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                        <Button 
                          className={`w-full ${colors.button} text-white text-sm`}
                          onClick={report.onClick}
                        >
                          <ButtonIcon className="h-4 w-4 ml-2" />
                          {getButtonText(report.action)}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الإنتاجية الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>توزيع المهام حسب الفريق</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
