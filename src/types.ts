export type Role = 'مدير' | 'موظف';

export interface User {
  name: string;
  email: string;
  password?: string;
  role: Role;
  jobTitle?: string;
  department?: string;
  avatarColor?: string;
  joinedDate?: string;
}

export type TaskStatus = 'لم تبدأ' | 'قيد التنفيذ' | 'قيد المراجعة' | 'مكتملة';
export type TaskPriority = 'منخفضة' | 'متوسطة' | 'عاجلة';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // user email
  assignedToName: string; // user name
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface AttendanceRecord {
  id: string;
  userEmail: string;
  userName: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:MM:SS
  checkOut: string | null; // HH:MM:SS
  hoursWorked?: number;
}

export type RequestStatus = 'قيد الانتظار' | 'تمت الموافقة' | 'مرفوض';
export type RequestType = 'إجازة' | 'طلب عهدة / سلفة' | 'تقرير صيانة' | 'أخرى';

export interface EmployeeRequest {
  id: string;
  userEmail: string;
  userName: string;
  type: RequestType;
  details: string;
  createdAt: string;
  status: RequestStatus;
  managerNotes?: string;
}
