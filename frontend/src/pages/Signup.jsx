import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, Info, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 👈 Import navigate
const BACKEND_URL = "https://coder-kohl-eight.vercel.app";

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate(); // 👈 Initialize navigate

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  };

 const handleSubmit = async () => {
  if (!validate()) return showToast('Fix errors before continuing', 'error');

  setIsLoading(true);
  showToast("Creating your account...", "info"); // 👈 added like login

  try {
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Signup failed");
    }

    const data = await res.json();

    // 🎉 Success
    showToast(`Welcome ${form.name.split(' ')[0]}! 🎉`, "success", 4000);

    // Redirect to dashboard after a short delay
    setTimeout(() => navigate("/login"), 1000);

  } catch (err) {
    showToast(err.message, "error", 4000);
  } finally {
    setIsLoading(false);
  }
};



  const updateField = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <div className="pt-16 relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <BackgroundAmbient />
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-slate-900">Create Account</h2>
            <p className="text-sm text-slate-600">Join us and get started today</p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm space-y-4">
            <InputField
              label="Full Name"
              type="text"
              value={form.name}
              onChange={updateField('name')}
              error={errors.name}
              placeholder="Enter your name"
              icon={<div className="h-4 w-4 rounded-full bg-violet-300" />}
            />

            <InputField
              ref={emailRef}
              label="Email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              error={errors.email}
              placeholder="Enter your email"
              icon={<Mail className="h-4 w-4 text-slate-400" />}
            />

            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={updateField('password')}
              error={errors.password}
              placeholder="Create a password"
              icon={<Lock className="h-4 w-4 text-slate-400" />}
              rightIcon={
                <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <InputField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={form.confirm}
              onChange={updateField('confirm')}
              error={errors.confirm}
              placeholder="Confirm password"
              icon={<Check className="h-4 w-4 text-slate-400" />}
            />

            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`group relative w-full rounded-xl py-3 px-4 font-medium transition-all
                ${!isLoading ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:scale-[1.02]' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}
              `}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div key="loading" className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Creating...</span>
                  </motion.div>
                ) : (
                  <motion.div key="submit" className="flex items-center justify-center gap-2">
                    <span>Sign Up</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* ✅ Add Sign In Link */}
            <p className="text-center text-sm text-slate-600 mt-4">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-violet-600 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            By signing up, you agree to our{' '}
            <button className="text-violet-600 hover:underline">Terms of Service</button> and{' '}
            <button className="text-violet-600 hover:underline">Privacy Policy</button>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ------------------------------
// 🔧 Reusable Components (unchanged)
// ------------------------------

const InputField = React.forwardRef(({ label, type, value, onChange, error, placeholder, icon, rightIcon }, ref) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border py-3 pl-10 pr-12 text-sm placeholder:text-slate-400
          ${error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 bg-white/70 focus:ring-violet-100'}
        `}
      />
      {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
    <AnimatePresence>
      {error && (
        <motion.div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onRemove={() => onRemove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ message, type, duration, onRemove }) {
  const styles = {
    success: { bg: 'from-green-500 to-emerald-600', icon: <CheckCircle className="h-5 w-5" /> },
    error: { bg: 'from-red-500 to-rose-600', icon: <AlertCircle className="h-5 w-5" /> },
    info: { bg: 'from-blue-500 to-indigo-600', icon: <Info className="h-5 w-5" /> },
  }[type] || { bg: 'from-slate-500 to-gray-600', icon: <Info className="h-5 w-5" /> };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`relative flex items-center gap-3 rounded-xl border p-4 text-white backdrop-blur-sm bg-gradient-to-r ${styles.bg} shadow-lg max-w-sm`}
    >
      {styles.icon}
      <span className="flex-1 text-sm">{message}</span>
      <button onClick={onRemove} className="hover:bg-white/20 rounded-full p-1">
        <X className="h-4 w-4" />
      </button>
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
      />
    </motion.div>
  );
}

function BackgroundAmbient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute right-[-8rem] top-16 h-80 w-80 rounded-full bg-pink-300/40 blur-3xl"
      />
    </div>
  );
}
