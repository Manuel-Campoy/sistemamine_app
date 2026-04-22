import toast from "react-hot-toast";

interface ToastOptions {
  duration?: number;
  id?: string;
  icon?: string;
}

export const useNotification = () => {
  const success = (message: string, options: ToastOptions = {}) => {
    toast.success(message, { 
      duration: 4000, 
      ...options 
    });
  };

  const error = (message: string, options: ToastOptions = {}) => {
    toast.error(message, { 
      duration: 4000, 
      ...options 
    });
  };

  const loading = (message: string, id?: string) => {
    toast.loading(message, { id });
  };

  const dismiss = (id?: string) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  };

  return { success, error, loading, dismiss };
};