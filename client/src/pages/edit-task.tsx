import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "wouter";
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
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, X } from "lucide-react";
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
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function EditTask() {
  const params = useParams();
  const taskId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ["/api/tasks", taskId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}`);
      return response.json();
    },
  });

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
      dueDate: "",
    },
  });

  // Update form when task data loads
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        assigneeId: task.assigneeId,
        progress: task.progress,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      });
    }
  }, [task, form]);

  const updateTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const updateData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };
      await apiRequest("PUT", `/api/tasks/${taskId}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", taskId] });
      toast({
        title: "تم تحديث المهمة بنجاح",
        description: "تم حفظ التغييرات على المهمة",
      });
      setLocation(`/tasks/${taskId}`);
    },
    onError: () => {
      toast({
        title: "خطأ في تحديث المهمة",
        description: "حدث خطأ أثناء محاولة تحديث المهمة",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    updateTaskMutation.mutate(data);
  };

  if (taskLoading) {
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
        <title>تعديل المهمة: {task.title}</title>
        <meta name="description" content={`تعديل المهمة: ${task.title}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setLocation(`/tasks/${taskId}`)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  العودة إلى التفاصيل
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">تعديل المهمة</h2>
                  <p className="text-gray-600">تحديث معلومات وتفاصيل المهمة</p>
                </div>
              </div>
            </div>

            <div className="max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle>تعديل معلومات المهمة</CardTitle>
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
                                className="min-h-[120px]"
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
                              <Select onValueChange={field.onChange} value={field.value}>
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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر الحالة" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">مجدول</SelectItem>
                                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                                  <SelectItem value="completed">مكتمل</SelectItem>
                                  <SelectItem value="overdue">متأخر</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="assigneeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>المسؤول</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر المسؤول" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="">غير محدد</SelectItem>
                                  {Array.isArray(users) && users.map((user: any) => (
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

                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>تاريخ التسليم</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="progress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نسبة الإنجاز: {field.value}%</FormLabel>
                            <FormControl>
                              <div className="px-3">
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={100}
                                  min={0}
                                  step={5}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-end gap-4 pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation(`/tasks/${taskId}`)}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          إلغاء
                        </Button>
                        <Button
                          type="submit"
                          disabled={updateTaskMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {updateTaskMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}