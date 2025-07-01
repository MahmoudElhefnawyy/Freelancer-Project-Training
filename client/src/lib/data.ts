// Static data for charts and analytics when API is not available
export const chartData = {
  monthlyTasks: [
    { name: 'يناير', completed: 12, overdue: 2 },
    { name: 'فبراير', completed: 19, overdue: 3 },
    { name: 'مارس', completed: 15, overdue: 1 },
    { name: 'أبريل', completed: 17, overdue: 2 },
    { name: 'مايو', completed: 14, overdue: 1 },
    { name: 'يونيو', completed: 20, overdue: 0 },
  ],
  
  taskDistribution: [
    { name: 'مكتملة', value: 3, color: '#10b981' },
    { name: 'قيد التنفيذ', value: 2, color: '#f59e0b' },
    { name: 'متأخرة', value: 0, color: '#ef4444' },
    { name: 'مجدولة', value: 1, color: '#6366f1' }
  ],

  productivity: [
    { name: 'الأسبوع 1', value: 75 },
    { name: 'الأسبوع 2', value: 82 },
    { name: 'الأسبوع 3', value: 88 },
    { name: 'الأسبوع 4', value: 91 },
  ],

  teamDistribution: [
    { name: 'فريق التطوير', value: 15, color: '#8b5cf6' },
    { name: 'فريق التسويق', value: 8, color: '#06b6d4' },
    { name: 'فريق المبيعات', value: 12, color: '#10b981' },
    { name: 'الإدارة', value: 5, color: '#f59e0b' }
  ]
};

export const priorityLabels = {
  high: 'عالية',
  medium: 'متوسطة', 
  low: 'منخفضة'
};

export const statusLabels = {
  pending: 'مجدول',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  overdue: 'متأخر'
};

export const roleLabels = {
  admin: 'مدير النظام',
  manager: 'مدير',
  employee: 'موظف'
};
