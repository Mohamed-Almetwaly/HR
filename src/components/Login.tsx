import React, { useState } from 'react';
import { User, Role } from '../types';
import { Mail, Lock, User as UserIcon, Briefcase, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
  onRegisterUser: (newUser: User) => void;
}

export default function Login({ onLoginSuccess, users, onRegisterUser }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration States
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('موظف');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      if (!email || !password) {
        setError('يرجى ملء جميع الحقول المطلوبة.');
        return;
      }

      // Check user
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (existingUser) {
        // Save to currentUser localStorage & state
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        localStorage.setItem('currentUser_session', 'true');
        onLoginSuccess(existingUser);
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      }
    } else {
      // Registration flow
      if (!name || !email || !password || !jobTitle || !department) {
        setError('يرجى ملء جميع الحقول لتسجيل حسابك.');
        return;
      }

      // Check if email already exists
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError('هذا البريد الإلكتروني مسجل بالفعل.');
        return;
      }

      const colors = ['bg-indigo-600', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-600', 'bg-violet-600', 'bg-rose-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newUser: User = {
        name,
        email: email.toLowerCase(),
        password,
        role,
        jobTitle,
        department,
        avatarColor: randomColor,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      onRegisterUser(newUser);
      setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      
      // Auto toggle to login after 1.5s
      setTimeout(() => {
        setIsLogin(true);
        setEmail(newUser.email);
        setPassword('');
        setSuccess('');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* Decorative Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse duration-4000"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse duration-3000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 relative z-10"
        id="auth_card"
      >
        {/* Banner with gradient (Theme Identity) */}
        <div className="md:w-1/2 p-12 text-white flex flex-col justify-between" 
             style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}>
          <div>
            <div className="flex items-center gap-3 mb-6" id="auth_logo_container">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">نظام شركتي</span>
            </div>
            
            <h1 className="text-3xl font-extrabold mb-4 leading-snug">نظام إدارة الشركات والموارد المتكامل</h1>
            <p className="text-white/80 text-sm leading-relaxed mb-8">
              منصة ذكية ومبسطة تتيح لك تنظيم العمل، متابعة شؤون الموظفين، تتبع الفعاليات والمهام، إضافة إلى إثبات الحضور والانصراف بمرونة وفعالية تامة.
            </p>
          </div>

          <div className="space-y-4 text-xs text-white/70 bg-white/10 p-4 rounded-xl border border-white/10">
            <h3 className="font-semibold text-white">⚙️ حسابات تجريبية سريعة:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-white/90">حاسب المدير:</p>
                <p>admin@company.com</p>
                <p>كلمة السر: 123</p>
              </div>
              <div>
                <p className="font-medium text-white/90">حاسب الموظف:</p>
                <p>sara@company.com</p>
                <p>كلمة السر: 123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Panel (Forms) */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6 text-center md:text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'أهلاً بك مجدداً! يرجى إدخال بياناتك للدخول.' : 'انضم إلينا وابدأ بتنظيم أعمال شركتك وإدارتها الآن.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-xs rounded-lg font-medium"
              id="error_msg"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-3 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 text-xs rounded-lg font-medium"
              id="success_msg"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="auth_form">
            {!isLogin && (
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">الاسم الكامل</label>
                  <div className="relative">
                    <UserIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                      placeholder="الاسم الثلاثي أو الثنائي"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Role selection Button Group */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">نوع الحساب (الدور الوظيفي)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('موظف')}
                      className={`py-2 px-4 rounded-xl border text-sm font-medium transition ${
                        role === 'موظف'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      موظف بالشركة
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('مدير')}
                      className={`py-2 px-4 rounded-xl border text-sm font-medium transition ${
                        role === 'مدير'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      مدير / مسؤول نظام
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Job Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">المسمى الوظيفي</label>
                    <div className="relative">
                      <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pr-9 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                        placeholder="مثل: مطور برمجيات"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">القسم</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                      placeholder="مثل: التقنية، التسويق"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition placeholder-gray-400 text-left"
                  placeholder="name@company.com"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-700">كلمة المرور</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => alert('لأغراض النظام التجريبي، يرجى مراجعة الخانة الملونة الهامشية للحصول على كلمة المرور وهي (123).')} 
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    نسيت الرمز؟
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pr-10 pl-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition text-left"
                  placeholder="••••••••"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white py-2.5 rounded-xl font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                cursor: 'pointer'
              }}
              id="auth_submit_btn"
            >
              {isLogin ? 'دخول للنظام' : 'تسجيل الحساب الجديد'}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="mt-6 text-center text-xs">
            <span className="text-gray-500">
              {isLogin ? 'ليس لديك حساب حتى الآن؟' : 'لديك حساب بالفعل؟'}
            </span>{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-indigo-600 hover:underline font-bold"
              id="auth_toggle_btn"
            >
              {isLogin ? 'إنشاء حساب موظف/مدير جديد' : 'تسجيل الدخول هنا'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
