import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Upload 
} from "lucide-react";

const menuItems = [
  {
    title: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "المهام", 
    href: "/tasks",
    icon: CheckSquare
  },
  {
    title: "الموظفين",
    href: "/employees", 
    icon: Users
  },
  {
    title: "التقارير",
    href: "/reports",
    icon: BarChart3
  },
  {
    title: "استيراد المهام من الإكسل",
    href: "/add-task",
    icon: Upload
  }
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  return (
    <aside className="w-64 bg-white rtl-sidebar min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-12 px-4",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/10"
                  )}
                  onClick={() => setLocation(item.href)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
