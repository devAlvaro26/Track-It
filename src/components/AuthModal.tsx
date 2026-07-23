import { useState, FormEvent } from "react";
import { Language } from "../types";
import { getTranslation } from "../translations";
import { db, isDatabaseConfigured } from "../lib/database";
import * as Icons from "lucide-react";
import { motion } from "motion/react";

interface AuthModalProps {
  language: Language;
  onClose: () => void;
  onSuccess: (user: any, username?: string) => void;
}

export function AuthModal({ language, onClose, onSuccess }: AuthModalProps) {
  const t = getTranslation(language);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isDatabaseConfigured || !db) {
      setErrorMsg(t.databaseNotConfiguredErr);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg(t.fillEmailPasswordErr);
      return;
    }

    if (!isLogin && !username.trim()) {
      setErrorMsg(t.usernameRequiredErr);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await db.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMsg(t.loginSuccess);
          setTimeout(() => {
            onSuccess(data.user);
            onClose();
          }, 800);
        }
      } else {
        const { data, error } = await db.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              username: username.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMsg(t.signupSuccess);
          setTimeout(() => {
            onSuccess(data.user, username.trim());
            onClose();
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || t.authDefaultErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="auth-modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-[#121212] rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 space-y-6"
        id="auth-modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/10 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Icons.UserCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {isLogin ? t.loginTitle : t.signupTitle}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-gray-400">
                {t.authSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Database status warning if not connected */}
        {!isDatabaseConfigured && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Icons.AlertTriangle size={16} className="text-amber-500 shrink-0" />
              <span>{t.databaseNotConnected}</span>
            </div>
            <p>
              {t.databaseWarningDesc}
            </p>
          </div>
        )}

        {/* Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <Icons.AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <Icons.CheckCircle size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-gray-300">
                {t.usernameLabel} *
              </label>
              <div className="relative">
                <Icons.User className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.usernamePlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 dark:text-gray-300">
              {t.emailLabel} *
            </label>
            <div className="relative">
              <Icons.Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 dark:text-gray-300">
              {t.passwordLabel} *
            </label>
            <div className="relative">
              <Icons.Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/10 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isDatabaseConfigured}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                <span>{isLogin ? t.signingIn : t.signingUp}</span>
              </>
            ) : (
              <span>{isLogin ? t.loginBtn : t.signupBtn}</span>
            )}
          </button>
        </form>

        {/* Mode switcher */}
        <div className="pt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs">
          <span className="text-neutral-500 dark:text-gray-400">
            {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg(null);
            }}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {isLogin ? t.signupBtn : t.loginBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
