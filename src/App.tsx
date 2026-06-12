import { useState, useEffect } from 'react';
import { db } from './firebase'; // تأكد من تحويل الملف إلى firebase.ts
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { User, Task, Announcement, AttendanceRecord, EmployeeRequest, TaskStatus, RequestStatus } from './types';
import Login from './components/Login';
import Profile from './components/Profile';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import { ShieldCheck, LogOut, RefreshCw, LayoutDashboard, UserCircle } from 'lucide-react';
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

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          name: data.name || '',
          password: data.password || '',
          role: data.role || 'موظف', // قيمة افتراضية لحمايتك من الأخطاء في حال عدم وجود الحقل بـ Firebase
          jobTitle: data.jobTitle || '',
          department: data.department || '',
          joinedDate: data.joinedDate || '',
          avatarColor: data.avatarColor || 'bg-indigo-600'
        } as User;
      });
      setUsers(usersData);
      
      const savedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (savedCurrentUser) {
        const verifiedUser = usersData.find((u: User) => u.email.toLowerCase() === savedCurrentUser.email.toLowerCase());
        if (verifiedUser) {
          setCurrentUser(verifiedUser);
        } else {
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Users Error:", error);
      setLoading(false);
    });

    const unsubscribeTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });

    const unsubscribeAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
    });

    const unsubscribeAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
      setAttendance(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord)));
    });

    const unsubscribeRequests = onSnapshot(collection(db, 'requests'), (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmployeeRequest)));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeTasks();
      unsubscribeAnnouncements();
      unsubscribeAttendance();
      unsubscribeRequests();
    };
  }, []);

  const handleLoginSuccess = (userObj: User) => {
    setCurrentUser(userObj);
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser_session');
    setCurrentUser(null);
  };

  const handleRegisterUser = async (newUser: User) => {
    const { id, ...userWithoutId } = newUser as any;
    await addDoc(collection(db, 'users'), {
      ...userWithoutId,
      role: userWithoutId.role || 'موظف'
    });
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    const targetUser = users.find(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());
    if (targetUser && targetUser.id) {
      await updateDoc(doc(db, 'users', targetUser.id), { ...updatedUser });
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const handleAddUser = async (user: User) => {
    const { id, ...userWithoutId } = user as any;
    await addDoc(collection(db, 'users'), userWithoutId);
  };

  const handleEditUser = async (user: User) => {
    const targetUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (targetUser && targetUser.id) {
      await updateDoc(doc(db, 'users', targetUser.id), { ...user });
    }
  };

  const handleDeleteUser = async (email: string) => {
    const targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (targetUser && targetUser.id) {
      await deleteDoc(doc(db, 'users', targetUser.id));
    }
  };

  const handleAddTask = async (task: Task) => {
    const { id, ...taskWithoutId } = task as any;
    await addDoc(collection(db, 'tasks'), taskWithoutId);
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask && targetTask.id) {
      await updateDoc(doc(db, 'tasks', targetTask.id), { status });
    }
  };

  const handleReviewTask = async (taskId: string, approve: boolean) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask && targetTask.id) {
      await updateDoc(doc(db, 'tasks', targetTask.id), {
        status: approve ? 'مكتملة' : 'قيد التنفيذ'
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask && targetTask.id) {
      await deleteDoc(doc(db, 'tasks', targetTask.id));
    }
  };

  const handleCheckIn = async (email: string, name: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    await addDoc(collection(db, 'attendance'), {
      userEmail: email,
      userName: name,
      date: todayStr,
      checkIn: new Date().toLocaleTimeString('ar-EG', { hour12: false }),
      checkOut: null
    });
  };

  const handleCheckOut = async (email: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const targetRecord = attendance.find(rec => rec.userEmail === email && rec.date === todayStr && !rec.checkOut);
    
    if (targetRecord && targetRecord.id) {
      const checkOutTime = new Date().toLocaleTimeString('ar-EG', { hour12: false });
      const checkInParts = targetRecord.checkIn.split(':').map(Number);
      const checkOutParts = checkOutTime.split(':').map(Number);
      
      let hours = 8.00;
      if (checkInParts.length === 3 && checkOutParts.length === 3) {
        const inSecs = checkInParts[0] * 3600 + checkInParts[1] * 60 + checkInParts[2];
        const outSecs = checkOutParts[0] * 3600 + checkOutParts[1] * 60 + checkOutParts[2];
        const diffSecs = outSecs - inSecs;
        if (diffSecs > 0) {
          hours = diffSecs / 3600;
        }
      }

      await updateDoc(doc(db, 'attendance', targetRecord.id), {
        checkOut: checkOutTime,
        hoursWorked: Math.max(0.1, parseFloat(hours.toFixed(2)))
      });
    }
  };

  const handleNewRequest = async (rawReq: Omit<EmployeeRequest, 'id' | 'userEmail' | 'userName' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'requests'), {
      userEmail: currentUser.email,
      userName: currentUser.name,
      type: rawReq.type,
      details: rawReq.details,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'قيد الانتظار'
    });
  };

  const handleResolveRequest = async (id: string, status: RequestStatus, notes: string) => {
    const targetReq = requests.find(r => r.id === id);
    if (targetReq && targetReq.id) {
      await updateDoc(doc(db, 'requests', targetReq.id), {
        status,
        managerNotes: notes
      });
    }
  };

  const handleAddAnnouncement = async (ann: Announcement) => {
    const { id, ...annWithoutId } = ann as any;
    await addDoc(collection(db, 'announcements'), annWithoutId);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const targetAnn = announcements.find(a => a.id === id);
    if (targetAnn && targetAnn.id) {
      await deleteDoc(doc(db, 'announcements', targetAnn.id));
    }
  };

  const handleFullReset = () => {
    if (confirm('🚨 تحذير: هل أنت متأكد من رغبتك بالقيام بمسح وإعادة تهيئة الجلسة المحلية بالنظام؟')) {
      localStorage.clear();
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
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-tiny">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-sm shadow-indigo-600/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-md font-extrabold text-gray-900 tracking-tight leading-none block">نظام إدارة شركتك</span>
              <span className="text-xxs text-gray-400 font-semibold mt-0.5 block">تصميم بروتوكول الإدارة الحديثة</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة التحكم
            </button>
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              الملف الشخصي
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab(currentTab === 'profile' ? 'dashboard' : 'profile')}
              className="sm:hidden p-2 bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-lg transition"
              aria-label="الملف الشخصي"
            >
              <UserCircle className="w-4 h-4" />
            </button>
            <div className="hidden md:block text-left" style={{ textAlign: 'left' }}>
              <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
              <p className="text-xxs text-gray-400 font-medium">صلاحية: {currentUser.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-lg transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentTab === 'profile' ? (
            <motion.div key="profile" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.25 }}>
              <Profile user={currentUser} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.25 }}>
              {currentUser.role === 'مدير' ? (
                <ManagerDashboard user={currentUser} users={users} onAddUser={handleAddUser} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} tasks={tasks} onAddTask={handleAddTask} onReviewTask={handleReviewTask} onDeleteTask={handleDeleteTask} announcements={announcements} onAddAnnouncement={handleAddAnnouncement} onDeleteAnnouncement={handleDeleteAnnouncement} attendance={attendance} requests={requests} onResolveRequest={handleResolveRequest} />
              ) : (
                <EmployeeDashboard user={currentUser} tasks={tasks} onUpdateTaskStatus={handleUpdateTaskStatus} announcements={announcements} attendance={attendance} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} requests={requests} onSubmitRequest={handleNewRequest} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-medium">جميع الحقوق محفوظة © {new Date().getFullYear()} نظام شركتي.</p>
          <button onClick={handleFullReset} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-rose-50 text-gray-500 rounded-lg text-xxs font-bold transition">
            <RefreshCw className="w-3.5 h-3.5" />
            إعادة تهيئة الجلسة المحلية
          </button>
        </div>
      </footer>
    </div>
  );
}