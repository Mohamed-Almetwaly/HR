import { useState, useEffect } from 'react';
import { initializeLocalStorage } from './initialData';
import { User, Task, Announcement, AttendanceRecord, EmployeeRequest, TaskStatus, RequestStatus } from './types';
import Login from './components/Login';
import Profile from './components/Profile';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import { ShieldCheck, LogOut, User as UserIcon, RefreshCw, Layers, LayoutDashboard, Heart, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [requests, setRequests] = useState<EmployeeRequest[]>([]);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [loading, setLoading] = useState(true);

  // Initialize data on component mount
  useEffect(() => {
    initializeLocalStorage();
    
    // Load lists from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('company_users') || '[]');
    const savedTasks = JSON.parse(localStorage.getItem('company_tasks') || '[]');
    const savedAnnouncements = JSON.parse(localStorage.getItem('company_announcements') || '[]');
    const savedAttendance = JSON.parse(localStorage.getItem('company_attendance') || '[]');
    const savedRequests = JSON.parse(localStorage.getItem('company_requests') || '[]');
    const savedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    setUsers(savedUsers);
    setTasks(savedTasks);
    setAnnouncements(savedAnnouncements);
    setAttendance(savedAttendance);
    setRequests(savedRequests);
    
    if (savedCurrentUser) {
      // Cross-check if the current user still exists
      const verifiedUser = savedUsers.find((u: User) => u.email.toLowerCase() === savedCurrentUser.email.toLowerCase());
      if (verifiedUser) {
        setCurrentUser(verifiedUser);
      } else {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Sync state functions
  const saveUsersState = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('company_users', JSON.stringify(updatedUsers));
  };

  const saveTasksState = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('company_tasks', JSON.stringify(updatedTasks));
  };

  const saveAnnouncementsState = (updatedAnn: Announcement[]) => {
    setAnnouncements(updatedAnn);
    localStorage.setItem('company_announcements', JSON.stringify(updatedAnn));
  };

  const saveAttendanceState = (updatedAtt: AttendanceRecord[]) => {
    setAttendance(updatedAtt);
    localStorage.setItem('company_attendance', JSON.stringify(updatedAtt));
  };

  const saveRequestsState = (updatedReqs: EmployeeRequest[]) => {
    setRequests(updatedReqs);
    localStorage.setItem('company_requests', JSON.stringify(updatedReqs));
  };

  // Auth Operations
  const handleLoginSuccess = (userObj: User) => {
    setCurrentUser(userObj);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser_session');
    setCurrentUser(null);
  };

  const handleRegisterUser = (newUser: User) => {
    const updated = [...users, newUser];
    saveUsersState(updated);
  };

  // Profile Update
  const handleUpdateProfile = (updatedUser: User) => {
    // 1. Update list of users
    const updatedUsers = users.map(u => u.email.toLowerCase() === updatedUser.email.toLowerCase() ? updatedUser : u);
    saveUsersState(updatedUsers);

    // 2. Update active session
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // Administrative / Manager - Employee CRUD
  const handleAddUser = (user: User) => {
    const updated = [...users, user];
    saveUsersState(updated);
  };

  const handleEditUser = (user: User) => {
    const updated = users.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, ...user } : u);
    saveUsersState(updated);
  };

  const handleDeleteUser = (email: string) => {
    const updated = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    saveUsersState(updated);
  };

  // Task Operations
  const handleAddTask = (task: Task) => {
    const updated = [...tasks, task];
    saveTasksState(updated);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    saveTasksState(updated);
  };

  const handleReviewTask = (taskId: string, approve: boolean) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: approve ? ('مكتملة' as TaskStatus) : ('قيد التنفيذ' as TaskStatus)
        };
      }
      return t;
    });
    saveTasksState(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    saveTasksState(updated);
  };

  // Attendance Controls
  const handleCheckIn = (email: string, name: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: 'att_' + Date.now(),
      userEmail: email,
      userName: name,
      date: todayStr,
      checkIn: new Date().toLocaleTimeString('ar-EG', { hour12: false }),
      checkOut: null
    };

    const updated = [...attendance, newRecord];
    saveAttendanceState(updated);
  };

  const handleCheckOut = (email: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = attendance.map(rec => {
      if (rec.userEmail === email && rec.date === todayStr && !rec.checkOut) {
        const checkOutTime = new Date().toLocaleTimeString('ar-EG', { hour12: false });
        
        // Compute simple random hours worked or delta check if time difference computed roughly
        const checkInParts = rec.checkIn.split(':').map(Number);
        const checkOutParts = checkOutTime.split(':').map(Number);
        
        let hours = 8.00; // sensible default
        if (checkInParts.length === 3 && checkOutParts.length === 3) {
          const inSecs = checkInParts[0] * 3600 + checkInParts[1] * 60 + checkInParts[2];
          const outSecs = checkOutParts[0] * 3600 + checkOutParts[1] * 60 + checkOutParts[2];
          const diffSecs = outSecs - inSecs;
          if (diffSecs > 0) {
            hours = diffSecs / 3600;
          }
        }

        return {
          ...rec,
          checkOut: checkOutTime,
          hoursWorked: Math.max(0.1, parseFloat(hours.toFixed(2)))
        };
      }
      return rec;
    });

    saveAttendanceState(updated);
  };

  // Request Submission and Resolution
  const handleNewRequest = (rawReq: Omit<EmployeeRequest, 'id' | 'userEmail' | 'userName' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;
    const newReq: EmployeeRequest = {
      id: 'req_' + Date.now(),
      userEmail: currentUser.email,
      userName: currentUser.name,
      type: rawReq.type,
      details: rawReq.details,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'قيد الانتظار'
    };

    const updated = [...requests, newReq];
    saveRequestsState(updated);
  };

  const handleResolveRequest = (id: string, status: RequestStatus, notes: string) => {
    const updated = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status,
          managerNotes: notes
        };
      }
      return req;
    });
    saveRequestsState(updated);
  };

  // Announcement Operations
  const handleAddAnnouncement = (ann: Announcement) => {
    const updated = [...announcements, ann];
    saveAnnouncementsState(updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    saveAnnouncementsState(updated);
  };

  // Total reset back to factory initial data seed
  const handleFullReset = () => {
    if (confirm('🚨 تحذير: هل أنت متأكد من رغبتك بالقيام بمسح وإعادة تهيئة قاعدة البيانات المحلية بالنظام للقيم الافتراضية؟ سيتم إخراجك من الحساب وتسجيل البيانات الأولية.')) {
      localStorage.clear();
      initializeLocalStorage();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans" dir="rtl">
        <div className="text-center space-y-3">
          <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-500">جاري تحميل نظام شركتك الرقمي...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Auth Center
  if (!currentUser) {
    return (
      <Login
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
      
      {/* Top Universal Unified Navigation bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-tiny">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand Right */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-sm shadow-indigo-600/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-md font-extrabold text-gray-900 tracking-tight leading-none block">نظام إدارة شركتك</span>
              <span className="text-xxs text-gray-400 font-semibold mt-0.5 block">تصميم بروتوكول الإدارة الحديثة</span>
            </div>
          </div>

          {/* Center Tabs Toggle */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة التحكم
            </button>
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              الملف الشخصي
            </button>
          </div>

          {/* Left Session Details Panel */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-left" style={{ textAlign: 'left' }}>
              <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
              <p className="text-xxs text-gray-400 font-medium">صلاحية: {currentUser.role}</p>
            </div>
            
            {/* Quick Profile Tab Toggle */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`w-9.5 h-9.5 rounded-lg ${currentUser.avatarColor || 'bg-indigo-600'} text-white font-extrabold text-sm flex items-center justify-center shadow-xs cursor-pointer hover:opacity-90 transition`}
              title="الملف الشخصي"
            >
              {currentUser.name.charAt(0)}
            </button>

            {/* Logout trigger */}
            <button
              onClick={handleLogout}
              className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-lg transition"
              title="الخروج الآمن"
              id="top_logout_btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Secondary Mobile Tabs */}
        <div className="sm:hidden flex bg-white border border-gray-100 p-1.5 rounded-xl shadow-xs gap-1 mb-6">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition ${
              currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            لوحة التحكم
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition ${
              currentTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            الملف الشخصي
          </button>
        </div>

        <AnimatePresence mode="wait">
          {currentTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <Profile
                user={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogout}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              {currentUser.role === 'مدير' ? (
                <ManagerDashboard
                  user={currentUser}
                  users={users}
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onReviewTask={handleReviewTask}
                  onDeleteTask={handleDeleteTask}
                  announcements={announcements}
                  onAddAnnouncement={handleAddAnnouncement}
                  onDeleteAnnouncement={handleDeleteAnnouncement}
                  attendance={attendance}
                  requests={requests}
                  onResolveRequest={handleResolveRequest}
                />
              ) : (
                <EmployeeDashboard
                  user={currentUser}
                  tasks={tasks}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  announcements={announcements}
                  attendance={attendance}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  requests={requests}
                  onSubmitRequest={handleNewRequest}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Humble Footer with Reset and author attributes */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-405 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-medium">
            جميع الحقوق محفوظة © {new Date().getFullYear()} نظام شركتي لإدارة العمليات والمنشآت.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFullReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 text-gray-500 rounded-lg text-xxs font-bold transition duration-300"
              title="إعادة ضبط وتهيئة النظام"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              إعادة تهيئة النظام للقيم الافتراضية
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
