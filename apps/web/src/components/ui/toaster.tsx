import { createContext, useCallback, useRef, useState, type ReactNode } from "react";
import { Toast, type ToastData, type ToastVariant } from "./toast";

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const counterRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const id = ++counterRef.current;
    setToast({ id, message, variant });
    timeoutRef.current = setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3000);
  }, []);

  const showSuccess = useCallback((message: string) => showToast(message, "success"), [showToast]);

  const showError = useCallback((message: string) => showToast(message, "error"), [showToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 left-4 sm:left-auto">
          <Toast toast={toast} />
        </div>
      )}
    </ToastContext.Provider>
  );
}

export { ToastContext };
