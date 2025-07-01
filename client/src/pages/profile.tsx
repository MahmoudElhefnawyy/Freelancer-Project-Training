import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar, Save, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const profileSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "??";
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return { text: 'مدير النظام', variant: 'default' as const };
      case 'manager': return { text: 'مدير', variant: 'secondary' as const };
      case 'employee': return { text: 'موظف', variant: 'outline' as const };
      default: return { text: 'مستخدم', variant: 'outline' as const };
    }
  };

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email || "",
      username: user.username || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // In a real app, this would be an API call
      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ معلوماتك الشخصية بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      // In a real app, this would be an API call to update password
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تحديث كلمة المرور بنجاح",
      });
      passwordForm.reset();
    },
    onError: () => {
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: "تأكد من صحة كلمة المرور الحالية",
        variant: "destructive",
      });
    },
  });

  const onUpdateProfile = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onUpdatePassword = (data: PasswordFormData) => {
    updatePasswordMutation.mutate(data);
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <>
      <Helmet>
        <title>الملف الشخصي - نظام إدارة المهام</title>
        <meta name="description" content="إدارة الملف الشخصي والإعدادات" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الملف الشخصي</h2>
              <p className="text-gray-600 dark:text-gray-300">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
            </div>

            <div className="max-w-4xl">
              {/* Profile Header */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        title="تغيير الصورة"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                          {user.fullName || 'المستخدم'}
                        </h3>
                        <Badge variant={roleBadge.variant}>{roleBadge.text}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>@{user.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>انضم في يناير 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
                  <TabsTrigger value="password">كلمة المرور</TabsTrigger>
                  <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
                </TabsList>

                {/* Profile Information Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>تحديث المعلومات الشخصية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                          <FormField
                            control={profileForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم الكامل</FormLabel>
                                <FormControl>
                                  <Input placeholder="أدخل الاسم الكامل" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="أدخل البريد الإلكتروني" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم المستخدم</FormLabel>
                                <FormControl>
                                  <Input placeholder="أدخل اسم المستخدم" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end">
                            <Button
                              type="submit"
                              disabled={updateProfileMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              {updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>تغيير كلمة المرور</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-6">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور الحالية</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="أدخل كلمة المرور الحالية" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور الجديدة</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="أدخل كلمة المرور الجديدة" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تأكيد كلمة المرور</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="أعد إدخال كلمة المرور الجديدة" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end">
                            <Button
                              type="submit"
                              disabled={updatePasswordMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Shield className="h-4 w-4" />
                              {updatePasswordMutation.isPending ? "جاري التحديث..." : "تحديث كلمة المرور"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>التفضيلات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">إعدادات الإشعارات</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            يمكنك إدارة إعدادات الإشعارات من الإعدادات العامة للنظام
                          </p>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">اللغة والمنطقة الزمنية</h4>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            النظام يدعم اللغة العربية بشكل كامل مع التوقيت المحلي
                          </p>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">الأمان والخصوصية</h4>
                          <p className="text-sm text-purple-600 dark:text-purple-300">
                            جميع بياناتك محمية ومشفرة وفقاً لأعلى معايير الأمان
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}