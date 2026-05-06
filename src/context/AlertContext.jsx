
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }, []);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const value = useMemo(
    () => ({
      alert,
      showAlert,
      clearAlert,
    }),
    [alert, showAlert, clearAlert]
  );

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }

  return context;
}