import { User, Task, Announcement, AttendanceRecord, EmployeeRequest } from './types';
export const INITIAL_USERS: User[] = [
  {
    name: 'محمد المتولي',
    email: 'almetwaly088@gmail.com',
    password: '01030705465',
    role: 'مدير',
    jobTitle: 'FRONT END WEB DEVELOPER',
    department: 'الإدارة العليا',
    avatarColor: 'bg-indigo-600',
    joinedDate: '2024-01-15'
  },
  {
    name: 'سارة الشمري',
    email: 'sara@company.com',
    password: '123',
    role: 'موظف',
    jobTitle: 'مهندس برمجيات أول',
    department: 'تطوير المنتجات',
    avatarColor: 'bg-pink-500',
    joinedDate: '2024-06-20'
  },
  {
    name: 'خالد القحطاني',
    email: 'khaled@company.com',
    password: '123',
    role: 'موظف',
    jobTitle: 'أخصائي تجربة العميل',
    department: 'خدمة العملاء',
    avatarColor: 'bg-emerald-500',
    joinedDate: '2025-02-10'
  },
  {
    name: 'ريم العبدالله',
    email: 'reem@company.com',
    password: '123',
    role: 'موظف',
    jobTitle: 'مديرة التسويق الرقمي',
    department: 'التسويق والإعلام',
    avatarColor: 'bg-amber-500',
    joinedDate: '2024-09-01'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'تطوير واجهة مستخدم التقارير المالية',
    description: 'تصميم وبرمجة لوحة تحكم تفاعلية لعرض الرسوم البيانية لأرباح ومصاريف الشركة خلال الربع الحالي باستخدام مكتبات الرسوم التفاعلية.',
    assignedTo: 'sara@company.com',
    assignedToName: 'سارة الشمري',
    status: 'قيد التنفيذ',
    priority: 'عاجلة',
    dueDate: '2026-06-15',
    createdAt: '2026-06-04',
    notes: 'تأكدي من توافق الألوان مع الهوية وتوفير خيارات لتصدير البيانات كـ PDF.'
  },
  {
    id: 'task-2',
    title: 'تجهيز ردود الدعم الفني للعملاء المهمين',
    description: 'مراجعة وحل جميع تذاكر الدعم والاتصالات المتأخرة وتجهيز مستند الردود الشائعة لتحسين سرعة الخدمة.',
    assignedTo: 'khaled@company.com',
    assignedToName: 'خالد القحطاني',
    status: 'لم تبدأ',
    priority: 'متوسطة',
    dueDate: '2026-06-12',
    createdAt: '2026-06-05',
    notes: 'الاستجابة يجب أن تكون في أقل من ساعتين للعملاء المميزين.'
  },
  {
    id: 'task-3',
    title: 'إطلاق الحملة الإعلانية الصيفية',
    description: 'تصميم البنرات، إعداد جداول المنشورات لشبكات التواصل الاجتماعي، وضبط ميزانية الإعلانات الممولة على جوجل والميتا.',
    assignedTo: 'reem@company.com',
    assignedToName: 'ريم العبدالله',
    status: 'مكتملة',
    priority: 'متوسطة',
    dueDate: '2026-06-05',
    createdAt: '2026-05-25',
    notes: 'تم إطلاق الحملة بنجاح وحققت زيادة في التسجيل بنسبة 14% في الأسبوع الأول.'
  },
  {
    id: 'task-4',
    title: 'تحديث خوادم الاستضافة وقواعد البيانات',
    description: 'ترقية خوادم التطبيق ونسخ قواعد البيانات احتياطياً لتأمين سلامة النظام خلال فترة الصيانة الدورية المجدولة.',
    assignedTo: 'sara@company.com',
    assignedToName: 'سارة الشمري',
    status: 'مكتملة',
    priority: 'عاجلة',
    dueDate: '2026-06-01',
    createdAt: '2026-05-28',
    notes: 'تمت الصيانة بين الثالثة والخامسة صباحاً دون أي انقطاع في الخدمة.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'مواعيد العمل الجديدة وفترة الصيف',
    content: 'تقديراً لكم وتماشياً مع حرارة الصيف، قررت الإدارة العامة إتاحة خيار تسجيل الحضور في الفترة الصباحية المرنة من الساعة 7:30 صباحاً وحتى 9:30 صباحاً، مع الالتزام التام بساعات العمل اليومية (8 ساعات). نتمنى لكم صيفاً ممتعاً وإنتاجاً متميزاً.',
    createdAt: '2026-06-06',
    author: 'أحمد العتيبي'
  },
  {
    id: 'ann-2',
    title: 'الاحتفال بالموظف المثالي لهذا الشهر',
    content: 'يسرنا أن نعلن عن فوز الزميلة سارة الشمري بجائزة موظف الشهر نظير جهودها المتواصلة والمتميزة في تسليم تحديثات النظام ومستوى التزامها العالي. سيتم تسليم الجائزة خلال لقاء القهوة الصباحي يوم الإثنين القادم.',
    createdAt: '2026-06-04',
    author: 'أحمد العتيبي'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    userEmail: 'sara@company.com',
    userName: 'سارة الشمري',
    date: '2026-06-06',
    checkIn: '08:12:45',
    checkOut: '16:15:30',
    hoursWorked: 8.05
  },
  {
    id: 'att-2',
    userEmail: 'khaled@company.com',
    userName: 'خالد القحطاني',
    date: '2026-06-06',
    checkIn: '09:05:12',
    checkOut: null
  },
  {
    id: 'att-3',
    userEmail: 'reem@company.com',
    userName: 'ريم العبدالله',
    date: '2026-06-06',
    checkIn: '08:30:00',
    checkOut: '16:30:00',
    hoursWorked: 8.00
  },
  // Yesterday's records
  {
    id: 'att-4',
    userEmail: 'sara@company.com',
    userName: 'سارة الشمري',
    date: '2026-06-05',
    checkIn: '08:05:10',
    checkOut: '16:10:00',
    hoursWorked: 8.08
  },
  {
    id: 'att-5',
    userEmail: 'khaled@company.com',
    userName: 'خالد القحطاني',
    date: '2026-06-05',
    checkIn: '08:50:22',
    checkOut: '17:00:15',
    hoursWorked: 8.16
  }
];

export const INITIAL_REQUESTS: EmployeeRequest[] = [
  {
    id: 'req-1',
    userEmail: 'khaled@company.com',
    userName: 'خالد القحطاني',
    type: 'إجازة',
    details: 'أرجو التكرم بالموافقة على إجازة اضطرارية ليوم الإثنين القادم الموافق 2026-06-08 بسبب ظروف صحية طارئة لأحد أفراد العائلة والموعد الطبي المرافق له.',
    createdAt: '2026-06-05',
    status: 'قيد الانتظار'
  },
  {
    id: 'req-2',
    userEmail: 'reem@company.com',
    userName: 'ريم العبدالله',
    type: 'طلب عهدة / سلفة',
    details: 'طلب شراء اشتراك بريميوم في منصة التصاميم Canva وإعلانات ممولة على لينكد إن لإطلاق الحملة الجديدة. قيمة الاشتراك التقريبية 150 دولار أمريكي.',
    createdAt: '2026-06-03',
    status: 'تمت الموافقة',
    managerNotes: 'تمت الموافقة، وسيتم تحويل الميزانية لحساب بطاقة التسويق فوراً. يرجى تزويد المحاسبة بالفواتير لاحقاً.'
  }
];

export function initializeLocalStorage() {
  if (!localStorage.getItem('company_users')) {
    localStorage.setItem('company_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('company_tasks')) {
    localStorage.setItem('company_tasks', JSON.stringify(INITIAL_TASKS));
  }
  if (!localStorage.getItem('company_announcements')) {
    localStorage.setItem('company_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem('company_attendance')) {
    localStorage.setItem('company_attendance', JSON.stringify(INITIAL_ATTENDANCE));
  }
  if (!localStorage.getItem('company_requests')) {
    localStorage.setItem('company_requests', JSON.stringify(INITIAL_REQUESTS));
  }
}
