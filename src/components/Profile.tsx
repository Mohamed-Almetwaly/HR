import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Briefcase, Building, Shield, Lock, CheckCircle, Edit, Save, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileProps {
  user: User;
  onUpdateProfile: (updated: User) => void;
  onLogout: () => void;
}

export default function Profile({ user, onUpdateProfile, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [jobTitle, setJobTitle] = useState(user.jobTitle || '');
  const [department, setDepartment] = useState(user.department || '');
  const [password, setPassword] = useState(user.password || '');
  const [success, setSuccess] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedUser: User = {
      ...user,
      name,
      jobTitle,
      department,
      password: password || user.password
    };

    onUpdateProfile(updatedUser);
    setSuccess('تم تحديث ملفك الشخصي وكلمة المرور بنجاح.');
    setIsEditing(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="profile_container">
      {/* Top Banner with avatar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500 relative">
          <div className="absolute inset-0 bg-black/15"></div>
        </div>
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
          <div className={`w-28 h-28 rounded-2xl ${user.avatarColor || 'bg-indigo-600'} border-4 border-white text-white font-extrabold text-4xl flex items-center justify-center shadow-md z-10`}>
            {user.name.charAt(0)}
          </div>
          <div className="text-center sm:text-right flex-1 mb-2 z-10">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500 font-medium">
              {user.jobTitle || 'موظف'} | {user.department || 'إدارة الشركة'}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl transition"
                id="edit_profile_btn"
              >
                <Edit className="w-4 h-4" />
                تعديل البيانات
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition"
              >
                إلغاء
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl transition"
              id="logout_btn"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-3.5 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {success}
        </motion.div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Sidebar Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-indigo-600" />
            معلومات الهوية والمنصب
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Shield className="w-4.5 h-4.5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xxs text-gray-400">الدور بالنظام</p>
                <p className="text-sm font-bold text-indigo-700">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xxs text-gray-400">المسمى الوظيفي</p>
                <p className="text-sm font-semibold text-gray-800">{user.jobTitle || 'موظف بالشركة'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Building className="w-4.5 h-4.5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xxs text-gray-400">القسم الداخلي</p>
                <p className="text-sm font-semibold text-gray-800">{user.department || 'إداري'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Mail className="w-4.5 h-4.5 text-indigo-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xxs text-gray-400">البريد الإلكتروني</p>
                <p className="text-xs font-semibold text-gray-800 truncate" dir="ltr">{user.email}</p>
              </div>
            </div>

            <div className="text-xxs text-gray-400 border-t border-gray-50 pt-3">
              تاريخ الالتحاق بالنظام: {user.joinedDate || '2024-06-01'}
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
            {isEditing ? 'تعديل بيانات الحساب' : 'تفاصيل العضوية'}
          </h3>

          {!isEditing ? (
            <div className="space-y-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                مرحباً بك في لوحة تحكم ملفك الشخصي. تتيح لك هذه اللوحة تحديث ممتلكات حسابك، وتأكيد هويتك، والتحقق من التفاصيل الإدارية والمهام الموكلة إليك بفاعلية.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3.5">
                <h4 className="text-xs font-bold text-gray-700">📌 إرشادات الاستخدام الآمن:</h4>
                <ul className="list-disc leading-relaxed list-inside text-xs text-gray-500 space-y-1.5">
                  <li>لا تشارك بريدك الإلكتروني أو كلمة المرور الخاصة بك مع زملائك في العمل لتجنب تداخل الصلاحيات.</li>
                  <li>تأكد من إثبات تسجيل حضورك وانصرافك بشكل يومي من لوحة التحكم لتفادي الخصم أو الإنذار.</li>
                  <li>عند تعديل المسمى الوظيفي أو القسم، سيظهر هذا التعديل فوراً للمدير العام ولزملائك في قائمة الموظفين بمشاريعك والمهام.</li>
                </ul>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4" id="edit_profile_form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">الاسم بالكامل</label>
                  <div className="relative">
                    <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">المسمى الوظيفي</label>
                  <div className="relative">
                    <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">القسم</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">تحديث كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition text-left"
                      value={password}
                      placeholder="تغيير كلمة السر الحالية"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/10 transition"
                  id="save_profile_btn"
                >
                  <Save className="w-4 h-4" />
                  حفظ التعديلات
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
