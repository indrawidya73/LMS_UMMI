import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { AppData, User } from "@/types";

interface AppContextType {
  data: AppData;
  user: User | null;
  setUser: (user: User | null) => void;
  updateData: (updater: (prev: AppData) => AppData) => void;
  logout: () => void;
}

const AppContext = createContext<<AppContextType | undefined>(undefined);

export function AppProvider({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode; 
  initialData: AppData; 
}) {
  const [data, setData] = useState<<AppData>(initialData);
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("ummi_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev);
      localStorage.setItem("ummi_data", JSON.stringify(next));
      return next;
    });
  }, []);

  const setUser = useCallback((user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("ummi_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("ummi_session");
    }
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    localStorage.removeItem("ummi_session");
  }, []);

  const value = useMemo(
    () => ({ data, user, setUser, updateData, logout }),
    [data, user, setUser, updateData, logout]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}