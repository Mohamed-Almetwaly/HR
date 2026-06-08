import React, { useState, useEffect } from 'react';
import { User, Task, Announcement, AttendanceRecord, EmployeeRequest, TaskStatus, RequestType } from '../types';
import { CheckSquare, Clock, Bell, Send, CheckCircle, RefreshCw, Layers, Calendar, ChevronLeft, MapPin, Play, Pause, Square, ExternalLink, HelpCircle, Key, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeeDashboardProps {
  user: User;
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  announcements: Announcement[];
  attendance: AttendanceRecord[];
  onCheckIn: (email: string, name: string) => void;
  onCheckOut: (email: string) => void;
  requests: EmployeeRequest[];
  onSubmitRequest: (request: Omit<EmployeeRequest, 'id' | 'userEmail' | 'userName' | 'createdAt' | 'status'>) => void;
}

export default function EmployeeDashboard({
  user,
  tasks,
  onUpdateTaskStatus,
  announcements,
  attendance,
  onCheckIn,
  onCheckOut,
  requests,
  onSubmitRequest
}: EmployeeDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'attendance' | 'requests' | 'announcements'>('tasks');
  const [time, setTime] = useState(new Date());
  
  // Tasks filters
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'الكل'>('الكل');
  const [taskSearch, setTaskSearch] = useState('');

  // Requests States
  const [reqType, setReqType] = useState<RequestType>('إجازة');
  const [reqDetails, setReqDetails] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter tasks belonging only to current logged in employee
  const myTasks = tasks.filter((t) => t.assignedTo === user.email);
  const filteredTasks = myTasks.filter((t) => {
    const matchesFilter = taskFilter === 'الكل' || t.status === taskFilter;
    const matchesSearch = t.title.toLowerCase().includes(taskSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(taskSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const myAttendance = attendance.filter((a) => a.userEmail === user.email);
  const myRequests = requests.filter((r) => r.userEmail === user.email);

  // Today's attendance status
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = myAttendance.find((a) => a.date === todayStr);

  const handleCheckIn = () => {
    onCheckIn(user.email, user.name);
  };

  const handleCheckOut = () => {
    onCheckOut(user.email);
  };

  const handleRequestForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqDetails.trim()) return;

    onSubmitRequest({
      type: reqType,
      details: reqDetails
    });

    setReqDetails('');
    setSuccessMsg('تم إرسال طلبك بنجاح للمدير المسؤول. ستتلقى الرد قريباً.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6" id="employee_dashboard">
      
      {/* Top Banner Status */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-indigo-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm">
            لوحة تحكم الموظف
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">أهلاً بك، الزميل {user.name} 👋</h1>
          <p className="text-white/80 mt-1.5 text-sm max-w-lg leading-relaxed">
            شعبة {user.department || 'العمل الإداري'} | مسمى {user.jobTitle || 'موظف بـ شركتك'}
          </p>
        </div>

        {/* Real-time Clock Widget */}
        <div className="bg-white/10 border border-white/10 backdrop-blur-md p-4 rounded-xl text-center self-stretch sm:self-center flex flex-col justify-center items-center px-8">
          <Clock className="w-5 h-5 text-indigo-200 mb-1" />
          <span className="text-2xl font-bold tracking-widest leading-none font-mono">
            {time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-xxs text-white/70 mt-1">
            {time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Tabs Menu in clean responsive layout */}
      <div className="flex border-b border-gray-100 overflow-x-auto bg-white rounded-xl shadow-sm p-2 gap-1" id="employee_tab_list">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          المهام الموكلة إليّ {myTasks.filter(t => t.status !== 'مكتملة').length > 0 && (
            <span className="bg-red-500 text-white rounded-full text-xxs w-5 h-5 flex items-center justify-center font-bold">
              {myTasks.filter(t => t.status !== 'مكتملة').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          تسجيل الدوام والمرونة {todayRecord ? (
            <span className="bg-emerald-500 w-2.5 h-2.5 rounded-full"></span>
          ) : (
            <span className="bg-amber-400 w-2.5 h-2.5 rounded-full animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Send className="w-4 h-4" />
          الطلبات والعهود {myRequests.filter(r => r.status === 'قيد الانتظار').length > 0 && (
            <span className="bg-indigo-400 text-white rounded-full text-xxs w-5 h-5 flex items-center justify-center font-bold">
              {myRequests.filter(r => r.status === 'قيد الانتظار').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition shrink-0 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          إعلانات وتعاميم الإدارة {announcements.length > 0 && (
            <span className="bg-indigo-100 text-indigo-700 font-extrabold rounded-full text-xxs px-1.5 py-0.5">
              {announcements.length}
            </span>
          )}
        </button>
      </div>

      {/* Primary Tab content container */}
      <div className="min-h-[400px]">
        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 animate-fade"
            id="employee_tasks_tab"
          >
            {/* Filter and search head */}
            <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="w-full md:w-auto relative" id="search_task_container">
                <input
                  type="text"
                  placeholder="ابحث في عنوان المهمة أو الوصف..."
                  className="w-full md:w-64 pr-4 pl-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                />
              </div>

              {/* Status categories badges */}
              <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {(['الكل', 'لم تبدأ', 'قيد التنفيذ', 'قيد المراجعة', 'مكتملة'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setTaskFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      taskFilter === st
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                        : 'bg-white border border-gray-100 text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks list mapping */}
            {filteredTasks.length === 0 ? (
              <div className="bg-white border rounded-2xl p-12 text-center text-gray-400">
                <Layers className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-semibold">لا يوجد مهام توافق خيارات البحث المطلوبة حالياً.</p>
                <p className="text-xs text-gray-400 mt-1">تزول المهام المكتملة بالتنظيم أو بإدارتك لها.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map((tk) => (
                  <div
                    key={tk.id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition p-5 space-y-4 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <span className={`px-2 py-1 rounded text-xxs font-bold ${
                          tk.priority === 'عاجلة'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : tk.priority === 'متوسطة'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          أولوية: {tk.priority}
                        </span>

                        <span className={`px-2.5 py-1 rounded-full text-xxs font-semibold ${
                          tk.status === 'مكتملة'
                            ? 'bg-green-100 text-green-800'
                            : tk.status === 'قيد المراجعة'
                              ? 'bg-blue-100 text-blue-800'
                              : tk.status === 'قيد التنفيذ'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tk.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 mt-3 text-md">{tk.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-3 mt-1.5 leading-relaxed">{tk.description}</p>
                      
                      {tk.notes && (
                        <div className="mt-3.5 bg-gray-50 p-2.5 rounded-lg text-xxs text-gray-400 border border-gray-100 line-clamp-3">
                          💡 ملاحظات المكلِّف: {tk.notes}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-50 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xxs">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>موعد التسليم: <span className="font-bold text-gray-700">{tk.dueDate}</span></span>
                      </div>

                      {/* State update controls buttons */}
                      <div className="flex gap-1">
                        {tk.status === 'لم تبدأ' && (
                          <button
                            onClick={() => onUpdateTaskStatus(tk.id, 'قيد التنفيذ')}
                            className="bg-indigo-600 text-white rounded-lg px-3 py-1.5 font-bold hover:bg-indigo-700 flex items-center gap-1 transition"
                          >
                            <Play className="w-3 h-3" />
                            بدء العمل
                          </button>
                        )}

                        {tk.status === 'قيد التنفيذ' && (
                          <button
                            onClick={() => onUpdateTaskStatus(tk.id, 'قيد المراجعة')}
                            className="bg-indigo-400 text-white rounded-lg px-3 py-1.5 font-bold hover:bg-indigo-500 flex items-center gap-1 transition"
                          >
                            <Pause className="w-3 h-3" />
                            تسليم للمراجعة
                          </button>
                        )}

                        {tk.status === 'قيد المراجعة' && (
                          <span className="text-gray-400 font-semibold py-1">
                            انتظار موافقة المدير...
                          </span>
                        )}

                        {tk.status === 'مكتملة' && (
                          <span className="text-green-600 font-bold py-1 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            أُنجزت بنجاح
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'attendance' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade"
            id="employee_attendance_tab"
          >
            {/* Quick check in card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-md">سجل اليوم للدوام المكتبي</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">حالة اليوم</span>
                </div>

                {!todayRecord ? (
                  <div className="space-y-3.5 py-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      لم تسجل حضورك اليوم لشعبة <span className="font-bold text-indigo-700">{user.department}</span> حتى الآن. يرجى إثبات المباشرة لبدء احتساب الساعات.
                    </p>
                    <button
                      onClick={handleCheckIn}
                      className="w-full text-white py-3 rounded-xl font-bold hover:opacity-90 shadow-md transition flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', cursor: 'pointer' }}
                      id="checkin_btn"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      تسجيل الحضور العام
                    </button>
                  </div>
                ) : !todayRecord.checkOut ? (
                  <div className="space-y-3.5 py-4">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                      <p className="text-xs text-emerald-800 font-semibold">
                        أنت الآن نشط بالدوام منذ الساعة: <span className="font-bold">{todayRecord.checkIn}</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      عند انتهائك وإتمام ساعات عمل اليوم الموصفة (8 ساعات)، يرجى إثبات تسجيل خروج الزميل.
                    </p>
                    <button
                      onClick={handleCheckOut}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                      id="checkout_btn"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      تسجيل انصراف
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 text-center">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">تم إكمال الدوام بنجاح اليوم وصرف بياناته.</p>
                      <div className="mt-2 text-xs flex justify-center gap-4 text-gray-600 font-semibold bg-gray-50 py-1.5 rounded-lg">
                        <span>الحضور: {todayRecord.checkIn}</span>
                        <span>الانصراف: {todayRecord.checkOut}</span>
                      </div>
                      <p className="text-xxs text-emerald-600 font-bold mt-2">
                        ساعات العمل المسجلة: {todayRecord.hoursWorked ? todayRecord.hoursWorked.toFixed(2) : ''} ساعة
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xxs text-gray-400 bg-gray-50 p-2.5 rounded-xl mt-3">
                📍 يسجل النظام عنوان الـ IP والوقت الحالي بدقة لمراجعة سلامة التقارير الإدارية شهرياً.
              </div>
            </div>

            {/* Attendance list table */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 mb-4 text-md flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                سجل الدوام والـحضور التاريخي لـ شركتك
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs" id="attendance_table">
                  <header className="bg-gray-50/50 text-gray-400">
                    <tr className="border-b border-gray-50">
                      <th className="py-2.5 px-3">التاريخ</th>
                      <th className="py-2.5 px-3">تسجيل الحضور</th>
                      <th className="py-2.5 px-3">تسجيل الانصراف</th>
                      <th className="py-2.5 px-3 text-center">ساعات المكوث</th>
                      <th className="py-2.5 px-3 text-left">التثبيت</th>
                    </tr>
                  </header>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {myAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          لا توجد قيود مسجلة لحظورك في قواعد البيانات المحلية حتى الآن.
                        </td>
                      </tr>
                    ) : (
                      myAttendance.slice().reverse().map((rec) => (
                        <tr key={rec.id} className="hover:bg-gray-50/40 transition">
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{rec.date}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-medium">{rec.checkIn}</td>
                          <td className="py-2.5 px-3 text-rose-600 font-medium">
                            {rec.checkOut || <span className="text-amber-500 font-pulse">قيد الدوام</span>}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">
                            {rec.hoursWorked ? `${rec.hoursWorked.toFixed(2)} ساعة` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-left">
                            <span className="text-xxs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
                              موثق
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade"
            id="employee_requests_tab"
          >
            {/* Submit requests Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 border-b pb-3 mb-4 text-md flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" />
                تقديم طلب إداري جديد
              </h3>

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleRequestForm} className="space-y-4" id="request_form">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">تصنيف ونوع الطلب</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as RequestType)}
                  >
                    <option value="إجازة">إجازة سنوية / طارئة</option>
                    <option value="طلب عهدة / سلفة">طلب عهدة نقديّة أو سلفة</option>
                    <option value="تقرير صيانة">طلب صيانة أجهزة / معدات</option>
                    <option value="أخرى">أخرى (رسالة إحاطة إدارية)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">تفاصيل الطلب ومبرراته</label>
                  <textarea
                    rows={4}
                    placeholder="اكتب التبريرات والمواعيد بالتفصيل هنا لمساعدة المسؤول في تقييم الطلب بسرعة..."
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition leading-relaxed"
                    value={reqDetails}
                    onChange={(e) => setReqDetails(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full text-white py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition shadow-sm cursor-pointer text-xs"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}
                  id="submit_req_btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  تقديم الطلب للمدير
                </button>
              </form>
            </div>

            {/* Past status table */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 mb-2 text-md">
                متابعة حالة الطلبات السابقة
              </h3>

              <div className="space-y-3.5">
                {myRequests.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400">
                    <Send className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold">لم تقدم أي طلبات إجازة أو عهود من حسابك من قبل.</p>
                  </div>
                ) : (
                  myRequests.slice().reverse().map((rq) => (
                    <div
                      key={rq.id}
                      className="border border-gray-100 rounded-xl p-4 space-y-3 shadow-2xs hover:shadow-xs transition"
                    >
                      <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-indigo-700 bg-indigo-50/90 px-2 py-0.5 rounded-md">
                            {rq.type}
                          </span>
                          <span className="text-xxs text-gray-400">{rq.createdAt}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded text-xxs font-extrabold ${
                          rq.status === 'تمت الموافقة'
                            ? 'bg-green-100 text-green-800'
                            : rq.status === 'مرفوض'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rq.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed font-normal">{rq.details}</p>

                      {rq.managerNotes && (
                        <div className="bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-50/30 text-xxs text-gray-500">
                          🎯 <span className="font-extrabold text-indigo-700">ملاحظة الإدارة:</span> {rq.managerNotes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'announcements' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 animate-fade"
            id="employee_announcements_tab"
          >
            <h2 className="text-md font-bold text-gray-900 flex items-center gap-2 px-1">
              <Bell className="w-5 h-5 text-indigo-600 animate-bounce" />
              أحدث التعاميم والفعاليات الرسمية في شركتك
            </h2>

            {announcements.length === 0 ? (
              <div className="bg-white border rounded-2xl p-12 text-center text-gray-400">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">لا توجد تعاميم إعلانية منشورة حالياً.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 transition duration-300 space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
                      <h3 className="font-bold text-gray-900 text-md">{ann.title}</h3>
                      <div className="text-xxs text-gray-400 flex items-center gap-2">
                        <span>المرسل: <span className="font-bold text-indigo-600">{ann.author}</span></span>
                        <span>•</span>
                        <span>{ann.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed space-y-1.5 whitespace-pre-line font-normal">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

    </div>
  );
}
