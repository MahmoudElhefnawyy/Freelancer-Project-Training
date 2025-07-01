import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <>
      <Helmet>
        <title>الصفحة غير موجودة - نظام إدارة المهام 2025</title>
        <meta name="description" content="الصفحة المطلوبة غير موجودة" />
      </Helmet>
      
      <div className="min-h-screen w-full flex items-center justify-center gradient-bg">
        <Card className="w-full max-w-md mx-4 shadow-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
              <h2 className="text-xl font-semibold text-gray-800">الصفحة غير موجودة</h2>
            </div>

            <p className="text-gray-600 mb-6">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
            </p>

            <Button 
              onClick={() => setLocation("/dashboard")}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2 mx-auto"
            >
              <Home className="h-4 w-4" />
              العودة إلى الصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
