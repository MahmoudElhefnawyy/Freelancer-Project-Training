import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, FileSpreadsheet, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const taskSchema = z.object({
  title: z.string().min(1, "اسم المهمة مطلوب"),
  description: z.string().optional(),
  priority: z.enum(["high", "medium", "low"], {
    required_error: "الأولوية مطلوبة"
  }),
  status: z.enum(["pending", "in_progress", "completed", "overdue"], {
    required_error: "الحالة مطلوبة"
  }),
  assigneeId: z.number().optional(),
  progress: z.number().min(0).max(100).default(0),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function AddTask() {
  const [, setLocation] = useLocation();
  const [isFileUpload, setIsFileUpload] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      progress: 0,
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "تم إنشاء المهمة بنجاح",
        description: "تم إضافة المهمة الجديدة إلى النظام",
      });
      setLocation("/tasks");
    },
    onError: () => {
      toast({
        title: "خطأ في إنشاء المهمة",
        description: "حدث خطأ أثناء محاولة إنشاء المهمة",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    createTaskMutation.mutate(data);
  };

  const handleExcelImport = () => {
    toast({
      title: "ميزة قيد التطوير",
      description: "ميزة استيراد Excel ستكون متاحة قريباً",
    });
  };

  return (
    <>
      <Helmet>
        <title>إضافة مهمة جديدة - نظام إدارة المهام 2025</title>
        <meta name="description" content="إضافة مهمة جديدة أو استيراد المهام من ملف Excel" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">إضافة مهمة جديدة</h2>
              <p className="text-gray-600">إنشاء مهمة جديدة أو استيراد من Excel</p>
            </div>

            {/* Toggle between Excel and Manual */}
            <div className="mb-6">
              <div className="flex gap-4">
                <Button
                  variant={isFileUpload ? "default" : "outline"}
                  onClick={() => setIsFileUpload(true)}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  استيراد من Excel
                </Button>
                <Button
                  variant={!isFileUpload ? "default" : "outline"}
                  onClick={() => setIsFileUpload(false)}
                  className="flex items-center gap-2"
                >
                  إضافة يدوية
                </Button>
              </div>
            </div>

            {isFileUpload ? (
              // Excel Import Section
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-green-500" />
                    استيراد المهام من Excel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اختر ملف Excel
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">اسحب وأفلت ملف Excel هنا أو</p>
                      <Button variant="outline" onClick={handleExcelImport}>
                        انقر لاختيار الملف
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">يدعم ملفات .xlsx, .xls</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نوع الاستيراد</label>
                      <Select defaultValue="new">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">استيراد جديد</SelectItem>
                          <SelectItem value="update">تحديث المهام الموجودة</SelectItem>
                          <SelectItem value="merge">دمج مع المهام الحالية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">صيغة التاريخ</label>
                      <Select defaultValue="dd/mm/yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/mm/yyyy">يوم/شهر/سنة</SelectItem>
                          <SelectItem value="mm/dd/yyyy">شهر/يوم/سنة</SelectItem>
                          <SelectItem value="yyyy-mm-dd">سنة-شهر-يوم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      تنسيق الملف المطلوب
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• العمود الأول: اسم المهمة</p>
                      <p>• العمود الثاني: الوصف</p>
                      <p>• العمود الثالث: الأولوية (عالية، متوسطة، منخفضة)</p>
                      <p>• العمود الرابع: المسؤول (البريد الإلكتروني)</p>
                      <p>• العمود الخامس: تاريخ التسليم</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setLocation("/tasks")}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleExcelImport}
                      className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      استيراد المهام
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Manual Task Creation
              <Card>
                <CardHeader>
                  <CardTitle>إنشاء مهمة جديدة</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المهمة</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل اسم المهمة" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>وصف المهمة</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="أدخل وصف المهمة"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الأولوية</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر الأولوية" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="high">عالية</SelectItem>
                                  <SelectItem value="medium">متوسطة</SelectItem>
                                  <SelectItem value="low">منخفضة</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الحالة</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر الحالة" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">مجدول</SelectItem>
                                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                                  <SelectItem value="completed">مكتمل</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="assigneeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المسؤول</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر المسؤول" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {users?.map((user: any) => (
                                  <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.fullName} ({user.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation("/tasks")}
                        >
                          إلغاء
                        </Button>
                        <Button
                          type="submit"
                          disabled={createTaskMutation.isPending}
                        >
                          {createTaskMutation.isPending ? "جاري الحفظ..." : "حفظ المهمة"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
