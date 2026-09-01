import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-brand-400 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-slate-900/90 shadow-emerald-500/10';
      case 'error':
        return 'border-rose-500/30 bg-slate-900/90 shadow-rose-500/10';
      case 'warning':
        return 'border-amber-500/30 bg-slate-900/90 shadow-amber-500/10';
      default:
        return 'border-brand-500/30 bg-slate-900/90 shadow-brand-500/10';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 ${getBorderColor(toast.type)}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 text-sm">
            {toast.title && (
              <h4 className="font-semibold text-slate-100 mb-0.5">{toast.title}</h4>
            )}
            <p className="text-slate-300 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
