import { createContext, useContext, useCallback } from 'react';
import { Toaster, toast } from 'sonner';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const showToast = useCallback((message, { type = 'info', duration = 5000 } = {}) => {
    const options = { duration };
    if (type === 'success') toast.success(message, options);
    else if (type === 'error') toast.error(message, options);
    else if (type === 'warning') toast.warning(message, options);
    else toast(message, options);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={5000}
        toastOptions={{
          style: {
            width: '420px',
            maxWidth: '90vw',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
