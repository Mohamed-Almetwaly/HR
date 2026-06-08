import React, { useState } from 'react';
import { User, Task, Announcement, AttendanceRecord, EmployeeRequest, TaskStatus, TaskPriority, RequestStatus, Role } from '../types';
import { Users, CheckSquare, Bell, Send, CheckCircle, PlusCircle, Trash2, Edit, Save, Check, X, Calendar, Layers, Activity, Clock, ShieldCheck, Heart, Search, Filter, AlertCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ManagerDashboardProps {
  user: User;
  users: User[];
  onAddaUser: (u: User) => void;
  onEditUser: (u: User) => void;
  onDeleteUser: (email: string) => void;
  tasks: Task[];
  onAddTask: (t: Task) => void;
  onReviewTask: (id: string, approve: boolean) => void;
  onDeleteTask: (id: string) => void;
  announcements: Announcement[];
  onAddAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  attendance: AttendanceRecord[];
  requests: EmployeeRequest[];
  onResolveRequest: (id: string, status: RequestStatus, notes: string) => void;
}

export default function ManagerDashboard({
  user,
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  tasks,
  onAddTask,
  onReviewTask,
  onDeleteTask,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  attendance,
  requests,
  onResolveRequest
}: ManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'tasks' | 'requests' | 'announcements' | 'attendance_log'>('overview');

  // Stats
  const totalEmployees = users.filter(u => u.role === 'موظف').length;
  const pendingRequests = requests.filter(r => r.status === 'قيد الانتظار').length;
  const activeTasks = tasks.filter(t => t.status !== 'مكتملة').length;
  const completedTasksCount = tasks.filter(t => t.status === 'مكتملة').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const activeTodayAttendance = attendance.filter(a => a.date === todayStr);

  // Users Tab States
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUserEmail, setEditUserEmail] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123');
  const [newUserRole, setNewUserRole] = useState<Role>('موظف');
  const [newUserJob, setNewUserJob] = useState('');
  const [newUserDept, setNewUserDept] = useState('');

  // Editing User States
  const [editName, setEditName] = useState('');
  const [editJob, setEditJob] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editRole, setEditRole] = useState<Role>('موظف');

  // Tasks Tab States
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignTo, setNewTaskAssignTo] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('متوسطة');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Announcements Tab States
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Request Resolution States
  const [resolvingRequestId, setResolvingRequestId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Feedback States
  const [alertMsg, setAlertMsg] = useState({ text: '', type: 'success' });

  const triggerAlert = (text: string, type: 'success' | 'danger' = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg({ text: '', type: 'success' }), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserJob || !newUserDept) {
      triggerAlert('الرجاء تعبئة جميع الخانات لإنشاء المستخدم الجديد.', 'danger');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === newUserEmail.toLowerCase().trim())) {
      triggerAlert('البريد الإلكتروني هذا مستخدم بالفعل.', 'danger');
      return;
    }

    const colors = ['bg-indigo-600', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-600', 'bg-violet-600', 'bg-rose-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddUser({
      name: newUserName.trim(),
      email: newUserEmail.toLowerCase().trim(),
      password: newUserPassword,
      role: newUserRole,
      jobTitle: newUserJob.trim(),
      department: newUserDept.trim(),
      avatarColor: randomColor,
      joinedDate: todayStr
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserJob('');
    setNewUserDept('');
    setShowAddUser(false);
    triggerAlert('تمت إضافة المستخدم للنظام بنجاح.');
  };

  const handleStartEditUser = (u: User) => {
    setEditUserEmail(u.email);
    setEditName(u.name);
    setEditJob(u.jobTitle || '');
    setEditDept(u.department || '');
    setEditRole(u.role);
  };

  const handleSaveUserEdit = (email: string) => {
    if (!editName.trim()) return;
    onEditUser({
      email,
      name: editName,
      jobTitle: editJob,
      department: editDept,
      role: editRole
    });
    setEditUserEmail(null);
    triggerAlert('تمت حفظ تعديلات بيانات الموظف بنجاح.');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDesc || !newTaskAssignTo || !newTaskDueDate) {
      triggerAlert('الرجاء التأكد من ملء الحقول الأساسية وتعيين الموظف.', 'danger');
      return;
    }

    const assignedEmployee = users.find(u => u.email === newTaskAssignTo);
    if (!assignedEmployee) return;

    onAddTask({
      id: 'task_' + Date.now(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      assignedTo: newTaskAssignTo,
      assignedToName: assignedEmployee.name,
      status: 'لم تبدأ',
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      createdAt: todayStr,
      notes: newTaskNotes.trim() || undefined
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskAssignTo('');
    setNewTaskNotes('');
    setNewTaskDueDate('');
    setShowAddTask(false);
    triggerAlert('تم إنشاء المهمة بنجاح وإسنادها إلى ' + assignedEmployee.name);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    onAddAnnouncement({
      id: 'ann_' + Date.now(),
      title: annTitle.trim(),
      content: annContent.trim(),
      createdAt: todayStr,
      author: user.name
    });

    setAnnTitle('');
    setAnnContent('');
    triggerAlert('تم نشر التعميم لجميع منسوبي شركتك بنجاح.');
  };

  const startResolve = (id: string) => {
    setResolvingRequestId(id);
    setResolutionNotes('');
  };

  const handleResolve = (id: string, status: RequestStatus) => {
    onResolveRequest(id, status, resolutionNotes.trim() || (status === 'تمت الموافقة' ? 'موافق عليها بعد الدراسة.' : 'تم الرفض بناءً على المتطلبات الحالية.'));
    setResolvingRequestId(null);
    setResolutionNotes('');
    triggerAlert(status === 'تمت الموافقة' ? 'تمت الموافقة على الطلب بنجاح.' : 'تم رفض الطلب وتدوين السبب.');
  };

  return (
    <div className="space-y-6" id="manager_dashboard">
      
      {/* Alert toast info */}
      {alertMsg.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-4 left-4 z-50 p-4 rounded-xl shadow-lg border text-xs font-bold ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {alertMsg.text}
        </motion.div>
      )}

      {/* Top Welcome Admin Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-indigo-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold">
            مسؤول النظام والمدير العام
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">أهلاً بك، الأستاذ {user.name} 💼</h1>
          <p className="text-white/80 mt-1.5 text-sm max-w-lg leading-relaxed">
            مرحباً بك مجدداً في لوحة تحكم الإدارة. يمكنك من هنا ضبط عمليات الموارد وحضور الموظفين والمهام بكل سهولة.
          </p>
        </div>

        {/* System Active Status Indicator */}
        <div className="bg-white/10 border border-white/10 backdrop-blur-md px-6 py-4 rounded-xl text-right flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <p className="text-xxs text-indigo-200">حالة قاعدة البيانات المحلية</p>
            <p className="text-sm font-bold">نشطة ومزامنة (RTL)</p>
          </div>
        </div>
      </div>

      {/* Grid Tabs Selection */}
      <div className="flex border-b border-gray-100 overflow-x-auto bg-white rounded-xl shadow-sm p-2 gap-1" id="manager_tab_list">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          نظرة عامّة ومؤشرات
        </button>

        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'employees' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          إدارة الموظفين ({totalEmployees})
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          إدارة ومتابعة المهام ({activeTasks})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'requests' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Send className="w-4 h-4" />
          طلبات الموظفين العالقة {pendingRequests > 0 && (
            <span className="bg-red-500 text-white rounded-full text-xxs w-5 h-5 flex items-center justify-center font-bold">
              {pendingRequests}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'announcements' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          التوجيهات والتعاميم العامّة
        </button>

        <button
          onClick={() => setActiveTab('attendance_log')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'attendance_log' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          لوحة الحضور اليومية
        </button>
      </div>

      {/* Tabs Inner Sections */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            id="manager_overview_tab"
          >
            {/* Quick Metrics grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xxs font-semibold text-gray-400">إجمالي الموظفين</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{totalEmployees}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xxs font-semibold text-gray-400">مهام قيد العمل</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{activeTasks}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xxs font-semibold text-gray-400">المهام المنجزة</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{completedTasksCount}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-xxs font-semibold text-gray-400">حضور الموظفين اليوم</p>
                  <p className="text-2xl font-black text-gray-900 mt-0.5">{activeTodayAttendance.length}</p>
                </div>
              </div>
            </div>

            {/* Custom Interactive visual charts styled beautifully with Tailwind */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Task Completion Progress Wheel */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">معدلات إنجاز المهام</h3>
                  <p className="text-xxs text-gray-400 mt-0.5">تحليل نسبة المهام المغلقة مقابل المتبقية</p>
                </div>

                <div className="py-6 flex flex-col items-center justify-center">
                  {/* Circle SVG */}
                  {(() => {
                    const total = tasks.length || 1;
                    const pct = Math.round((completedTasksCount / total) * 100);
                    const strokeDashoffset = 251 - (251 * pct) / 100;
                    return (
                      <div className="relative flex items-center justify-center w-36 h-36">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="72" cy="72" r="40" stroke="#334155" strokeWidth="8" fill="transparent" />
                          <circle cx="72" cy="72" r="40" stroke="#4f46e5" strokeWidth="8" fill="transparent" 
                                  strokeDasharray="251" strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-3xl font-black text-gray-900">{pct}%</span>
                          <p className="text-xxs text-gray-400">نسبة نجاح الإغلاق</p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex gap-4 text-xxs mt-2 text-gray-500 font-semibold w-full justify-around bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 block"></span>
                      مكتملة ({completedTasksCount})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-350 bg-gray-300 block"></span>
                      متبقية ({activeTasks})
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance engagement rate */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">الالتزام اليومي بالحضور والسرعة</h3>
                  <p className="text-xxs text-gray-400 mt-0.5">معدل انضباط الموظفين اليوم مقارنة بالأيام المنصرمة</p>
                </div>

                {/* Simulated Chart Bars */}
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span>السبت (اليوم)</span>
                      <span className="font-bold text-gray-900">
                        {totalEmployees > 0 ? Math.round((activeTodayAttendance.length / totalEmployees) * 100) : 0}% ملزمون بالدوام
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full transition" 
                           style={{ width: `${totalEmployees > 0 ? (activeTodayAttendance.length / totalEmployees) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span>الجمعة (أمس)</span>
                      <span className="font-bold text-gray-900">100% حضور واكتمل</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span>الخميس الفائت</span>
                      <span className="font-bold text-gray-900">75% حضور جزئي</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-50 text-xxs text-indigo-805 text-indigo-800 leading-relaxed font-semibold">
                  📌 يرجى مراجعة صفحة "لوحة الحضور اليومية" لتعقب أوقات وصول كل موظف بدقة.
                </div>
              </div>

              {/* Pending Resolution actions Box */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">معاملات وبلاغات إدارية عالقة</h3>
                  <p className="text-xxs text-gray-400 mt-0.5">طلبات بانتظار اتخاذ إجراء الموافقة/الرفض منك</p>
                </div>

                <div className="py-2.5 text-center">
                  <p className="text-4xl font-extrabold text-indigo-700 animate-bounce">{pendingRequests}</p>
                  <p className="text-xs text-gray-500 mt-1">طلبات إعفاء أو إجازة للموظفين قيد المراجعة</p>
                </div>

                <button
                  onClick={() => setActiveTab('requests')}
                  className="w-full text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-1 cursor-pointer"
                >
                  معالجة الطلبات العالقة الآن
                  <ChevronLeft className="w-4 h-4 ml-1" />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* Employees list tab */}
        {activeTab === 'employees' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 animate-fade"
            id="manager_employees_tab"
          >
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-col sm:flex-row gap-3">
              <h2 className="font-bold text-gray-900 text-sm">قائمة منسوبي الشركة ومسؤولي النظام</h2>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                إضافة موظف/مدير جديد
              </button>
            </div>

            {/* Slide input form to add employees right inside */}
            {showAddUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 text-xs mb-3.5 border-b pb-2">➕ تسجيل موظف جديد وتخصيص الصلاحيات</h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="add_user_form">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-gray-600 block">الاسم بالكامل</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                      placeholder="امجد طارق العلي"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-gray-600 block">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-left"
                      dir="ltr"
                      placeholder="amjad@company.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-gray-600 block">رتبة الرخص البرمجية</label>
                    <select
                      className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as Role)}
                    >
                      <option value="موظف">موظف عادي</option>
                      <option value="مدير">مسؤول / مدير عام</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-gray-650 text-gray-600 block">المسمى العملي</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                      placeholder="أخصائي موارد بشرية"
                      value={newUserJob}
                      onChange={(e) => setNewUserJob(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-gray-650 text-gray-600 block">القسم</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                      placeholder="إدارة المواهب"
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-gray-650 text-gray-600 block">كلمة السر المؤقتة</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-center font-mono bg-gray-50"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end gap-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-bold text-xs hover:bg-indigo-700 transition"
                    >
                      تسجيل العضو الجديد
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-xs font-semibold"
                    >
                      حجب النوافذ
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* List Table of all users */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-right text-xs" id="employees_table">
                <thead className="bg-gray-50 text-gray-400 font-bold border-b border-gray-150">
                  <tr>
                    <th className="py-3 px-4">منسوب الشركة</th>
                    <th className="py-3 px-4">البريد الإلكتروني</th>
                    <th className="py-3 px-4">المنصب والقسم</th>
                    <th className="py-3 px-4 text-center">الرتبة</th>
                    <th className="py-3 px-4 text-left">العمليات السيادية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {users.map((u) => {
                    const isEditingThisUser = editUserEmail === u.email;

                    return (
                      <tr key={u.email} className="hover:bg-gray-50/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg ${u.avatarColor || 'bg-indigo-600'} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              {isEditingThisUser ? (
                                <input
                                  type="text"
                                  className="border rounded px-2 py-0.5 text-xs text-gray-900 focus:outline-none"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                />
                              ) : (
                                <p className="font-bold text-gray-900">{u.name}</p>
                              )}
                              <p className="text-xxs text-gray-400">سجل: {u.joinedDate || '2024-05-01'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-gray-500" dir="ltr">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-4 space-y-1">
                          {isEditingThisUser ? (
                            <div className="flex gap-1.5 flex-col">
                              <input
                                type="text"
                                className="border rounded px-2 py-0.5 text-xs text-gray-900 focus:outline-none"
                                placeholder="مسمى عملي"
                                value={editJob}
                                onChange={(e) => setEditJob(e.target.value)}
                              />
                              <input
                                type="text"
                                className="border rounded px-2 py-0.5 text-xs text-gray-900 focus:outline-none"
                                placeholder="القسم"
                                value={editDept}
                                onChange={(e) => setEditDept(e.target.value)}
                              />
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-800">{u.jobTitle || 'موظف عام'}</p>
                              <p className="text-xxs text-indigo-600 bg-indigo-50/70 inline-block px-1.5 py-0.5 rounded">
                                {u.department || 'العمليات'}
                              </p>
                            </>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {isEditingThisUser ? (
                            <select
                              className="border text-xs rounded"
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as Role)}
                            >
                              <option value="موظف">موظف</option>
                              <option value="مدير">مدير</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-xxs font-bold inline-block ${
                              u.role === 'مدير'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {u.role}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-left">
                          <div className="flex justify-end items-center gap-1">
                            {isEditingThisUser ? (
                              <>
                                <button
                                  onClick={() => handleSaveUserEdit(u.email)}
                                  className="p-1 px-2.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 text-xxs font-bold transition flex items-center gap-1"
                                >
                                  <Save className="w-3 h-3" />
                                  حفظ
                                </button>
                                <button
                                  onClick={() => setEditUserEmail(null)}
                                  className="p-1 px-2.5 bg-gray-100 text-gray-600 rounded text-xxs font-semibold"
                                >
                                  إلغاء
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEditUser(u)}
                                  className="p-1 bg-amber-50 text-amber-600 rounded hover:bg-amber-100 transition"
                                  title="تعديل"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                {u.email !== user.email && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`هل أنت متأكد من رغبتك بالاستغناء وإزالة الموظف/المدير ${u.name} من النظام نهائياً؟`)) {
                                        onDeleteUser(u.email);
                                        triggerAlert('تمت إزالة العضو من سجلات الشركة بنجاح.', 'danger');
                                      }
                                    }}
                                    className="p-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 transition"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tasks management dashboard tab */}
        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 animate-fade"
            id="manager_tasks_tab"
          >
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-col sm:flex-row gap-3">
              <div>
                <h2 className="font-bold text-gray-900 text-sm">متابعة وإسناد المهام في الشركة</h2>
                <p className="text-xxs text-gray-400 mt-0.5">تتبع عمليات التنفيذ لجميع الموظفين بشكل لحظي</p>
              </div>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                تعيين مهمة جديدة لموظف
              </button>
            </div>

            {showAddTask && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 text-xs mb-3.5 border-b pb-2">📋 تسجيل مهمة جديدة بالبطاقة</h3>
                <form onSubmit={handleCreateTask} className="space-y-4" id="add_task_form">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">عنوان المهمة المطلوب</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                        placeholder="امثلة: أرشفة مستندات المحاسبة لعام 2025"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">إسناد وتكليف الموظف</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50"
                        value={newTaskAssignTo}
                        onChange={(e) => setNewTaskAssignTo(e.target.value)}
                        required
                      >
                        <option value="">اطلب الموظف من القائمة...</option>
                        {users.filter(u => u.role === 'موظف').map(usr => (
                          <option key={usr.email} value={usr.email}>
                            {usr.name} ({usr.jobTitle || 'موظف'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">تاريخ الاستحقاق والـ deadline</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 animate-pulse">
                      <label className="text-xs font-bold text-gray-650 text-gray-600 block">الأولويّة / الحساسيّة</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['منخفضة', 'متوسطة', 'عاجلة'] as const).map(prio => (
                          <button
                            key={prio}
                            type="button"
                            onClick={() => setNewTaskPriority(prio)}
                            className={`py-1.5 px-3 rounded-lg border text-xxs font-bold transition flex justify-center items-center gap-1 shrink-0 ${
                              newTaskPriority === prio
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-xs'
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span>{prio}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 block">ملاحظات أو توجيهات إضافية للمنفّذ</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                        placeholder="مثل: لا مانع من التواصل معنا في حال احتجت دعم للميزانية"
                        value={newTaskNotes}
                        onChange={(e) => setNewTaskNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">تفصيل بطاقة المهمّة</label>
                    <textarea
                      rows={3}
                      placeholder="صف المتطلبات ومخرجات تسليم المهمة بوضوح للموظف وبأدق المسميات..."
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-xs"
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg px-4 py-2 font-bold text-xs hover:bg-indigo-700 transition"
                    >
                      إرسال المهمة وتفويض العمل
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-200"
                    >
                      إلغاء النافذة
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Manager view tasks board */}
            {tasks.length === 0 ? (
              <div className="bg-white border rounded-2xl p-12 text-center text-gray-400">
                <CheckSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">لا يوجد أي مهام مضافة للنظام حتى الآن.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="manager_tasks_grid">
                {tasks.slice().reverse().map((tk) => (
                  <div
                    key={tk.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xxs text-gray-400 font-medium">المنفّذ: <span className="font-bold text-indigo-700">{tk.assignedToName}</span></span>
                        
                        <span className={`px-2 py-0.5 rounded text-xxs font-bold ${
                          tk.status === 'لم تبدأ'
                            ? 'bg-gray-100 text-gray-600'
                            : tk.status === 'قيد التنفيذ'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : tk.status === 'قيد المراجعة'
                                ? 'bg-blue-100 text-blue-850 bg-blue-100 text-blue-805 text-blue-800 font-extrabold animate-bounce'
                                : 'bg-green-100 text-green-800'
                        }`}>
                          {tk.status === 'قيد المراجعة' ? '🔔 سلمت للمراجعة' : tk.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 mt-3 text-sm">{tk.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-3">{tk.description}</p>
                      
                      {tk.notes && (
                        <p className="text-xxs text-gray-400 mt-2 italic bg-gray-50 p-2 rounded">
                          💡 توجيه المدير: {tk.notes}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-xxs">
                      <span className="text-gray-400">الاستحقاق: <span className="font-bold text-gray-700">{tk.dueDate}</span></span>

                      <div className="flex items-center gap-1.5">
                        {tk.status === 'قيد المراجعة' && (
                          <div className="flex gap-1" id="review_actions">
                            <button
                              onClick={() => {
                                onReviewTask(tk.id, true);
                                triggerAlert('تم قبول واعتماد تسليم مهمة ' + tk.assignedToName);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-1.5 font-bold transition flex items-center gap-0.5"
                              title="موافقة واعتماد الإنجاز"
                            >
                              <Check className="w-3.5 h-3.5" />
                              اعتماد
                            </button>
                            <button
                              onClick={() => {
                                onReviewTask(tk.id, false);
                                triggerAlert('تمت إعادة المهمة كـ "قيد التنفيذ" وسحب التسليم.', 'danger');
                              }}
                              className="bg-rose-50 text-rose-600 rounded-lg p-1.5 font-semibold hover:bg-rose-100 transition"
                              title="رفض وإعادة قيد التنفيذ"
                            >
                              إعادة
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من رغبتك في حذف وإلغاء هذه المهمة نهائياً من سجل الموظف والنظام؟')) {
                              onDeleteTask(tk.id);
                              triggerAlert('تم حذف بطاقة المهمة بنجاح.', 'danger');
                            }
                          }}
                          className="text-gray-400 hover:text-rose-600 p-1"
                          title="حذف المهمة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Requests Resolution Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 animate-fade"
            id="manager_requests_tab"
          >
            <h2 className="font-bold text-gray-950 text-sm">مستندات وطلبات الإجازات والمعاملات الإدارية المرفوعة</h2>
            <p className="text-xxs text-gray-400 -mt-1.5">قم بدراسة واتخاذ قرارات الموافقة أو الرفض للطلبات في غضون 24 ساعة</p>

            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="bg-white border rounded-2xl p-12 text-center text-gray-400">
                  <Send className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold">لا يوجد أي طلبات مرفوعة بالنظام حالياً.</p>
                </div>
              ) : (
                requests.slice().reverse().map((rq) => (
                  <div
                    key={rq.id}
                    className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 space-y-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                          {rq.type}
                        </span>
                        <span className="text-xxs text-gray-400">التاريخ: {rq.createdAt}</span>
                        <span className="text-xxs text-indigo-550 text-indigo-650 font-bold bg-gray-200/50 px-2 py-0.5 rounded">
                          صاحب الطلب: {rq.userName} ({rq.userEmail})
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded text-xxs font-extrabold ${
                        rq.status === 'تمت الموافقة'
                          ? 'bg-green-100 text-green-800'
                          : rq.status === 'مرفوض'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rq.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-650 text-gray-700 leading-relaxed font-normal">{rq.details}</p>

                    {rq.status === 'قيد الانتظار' && (
                      <div className="border-t border-gray-50 pt-3.5 space-y-3">
                        {resolvingRequestId === rq.id ? (
                          <div className="space-y-3" id="resolving_panel">
                            <label className="text-xxs font-bold text-gray-600 block">قم بتسجيل وتدوين مبرر القرار (سيظهر للموظف):</label>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                              placeholder="مثال: يرجى تسليم المهام العالقة لسارة قبل بدء الإجازة، مع أطيب التمنيات."
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleResolve(rq.id, 'تمت الموافقة')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-1.5 text-xxs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                تأكيد الموافقة
                              </button>
                              <button
                                onClick={() => handleResolve(rq.id, 'مرفوض')}
                                className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-4 py-1.5 text-xxs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                تأكيد الرفض
                              </button>
                              <button
                                onClick={() => setResolvingRequestId(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg px-3 py-1.5 text-xxs font-semibold transition"
                              >
                                إلغاء
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => startResolve(rq.id)}
                            className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xxs font-bold transition cursor-pointer"
                          >
                            اتخاذ قرار وحوكمة المعاملة
                          </button>
                        )}
                      </div>
                    )}

                    {rq.managerNotes && (
                      <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-50 text-xxs text-indigo-800 font-semibold leading-relaxed">
                        📌 <span className="font-extrabold text-indigo-700">ملاحظتك الإدارية المدوّنة:</span> {rq.managerNotes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Announcements management board */}
        {activeTab === 'announcements' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade"
            id="manager_announcements_tab"
          >
            {/* Create Announcement Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-3 mb-2 text-md flex items-center gap-1.5">
                  <Bell className="w-5 h-5 text-indigo-600 animate-pulse" />
                  نشر تعميم أو قرار عامّ
                </h3>
                <form onSubmit={handleCreateAnnouncement} className="space-y-3.5" id="ann_form">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">عنوان الإعلان</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 transition"
                      placeholder="امثلة: اجتماع مراجعة الميزانية أو تهنئة بالعيد"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">محتوى التعميم</label>
                    <textarea
                      rows={5}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 transition leading-relaxed"
                      placeholder="صغ محتوى التعميم بوضوح لجميع منسوبي شركتك والموظفين..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 transition shadow-sm text-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    نشر وتعميم البيان فوراً
                  </button>
                </form>
              </div>
            </div>

            {/* List Active Announcements */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-3 text-md">التعاميم النشطة حالياً</h3>

              <div className="space-y-4">
                {announcements.slice().reverse().map((an) => (
                  <div
                    key={an.id}
                    className="border border-gray-150 border-gray-100 rounded-xl p-4.5 space-y-3 shadow-2xs hover:shadow-xs transition relative"
                  >
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{an.title}</h4>
                        <p className="text-xxs text-gray-400 mt-0.5">الناشر: {an.author} • {an.createdAt}</p>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من سحب وحذف هذا التعميم؟')) {
                            onDeleteAnnouncement(an.id);
                            triggerAlert('تم إزالة وحذف البيان المعمم بنجاح.', 'danger');
                          }
                        }}
                        className="text-gray-400 hover:text-rose-600 transition p-1"
                        title="إلغاء وسحب التعميم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-normal whitespace-pre-line">{an.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Global/Daily attendance tracing log */}
        {activeTab === 'attendance_log' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 animate-fade"
            id="manager_attendance_tab"
          >
            <div>
              <h2 className="font-bold text-gray-900 text-sm">كشف حضور وانصراف الموظفين التاريخي</h2>
              <p className="text-xxs text-gray-400 mt-0.5">مراجعة أوقات بدء المباشرة لكل موظف وتراكم ساعات العمل المنجزة</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs" id="manager_attendance_table">
                <thead className="bg-gray-50 text-gray-450 text-gray-400 font-extrabold border-b border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3">منسوب العمل</th>
                    <th className="py-2.5 px-3">التاريخ</th>
                    <th className="py-2.5 px-3">وقت المباشرة</th>
                    <th className="py-2.5 px-3">وقت الانصراف</th>
                    <th className="py-2.5 px-3 text-center">أقر ساعات الدوام</th>
                    <th className="py-2.5 px-3 text-left">التحقق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 font-semibold text-xs">
                        لا توجد سجلات حضور مسجلة وموثقة بالنظام حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    attendance.slice().reverse().map((att) => (
                      <tr key={att.id} className="hover:bg-gray-50/40 transition">
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">{att.userName}</p>
                          <p className="text-xxs text-gray-400 font-normal truncate" dir="ltr">{att.userEmail}</p>
                        </td>
                        <td className="py-3 px-3">{att.date}</td>
                        <td className="py-3 px-3 text-emerald-600 font-bold">{att.checkIn}</td>
                        <td className="py-3 px-3 text-rose-600 font-bold">
                          {att.checkOut || <span className="text-amber-500 font-semibold">نشط الآن</span>}
                        </td>
                        <td className="py-3 px-3 text-center font-black">
                          {att.hoursWorked ? `${att.hoursWorked.toFixed(2)} ساعة` : '-'}
                        </td>
                        <td className="py-3 px-3 text-left">
                          <span className="text-xxs bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full inline-block font-bold">
                            موثق بالـ IP
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
