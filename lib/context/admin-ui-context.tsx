'use client';

import React, { createContext, useContext, useState } from 'react';

interface AdminUIContextType {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

const AdminUIContext = createContext<AdminUIContextType>({
  mobileSidebarOpen: false,
  setMobileSidebarOpen: () => {},
  openMobileSidebar: () => {},
  closeMobileSidebar: () => {},
});

export function AdminUIProvider({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminUIContext.Provider
      value={{
        mobileSidebarOpen,
        setMobileSidebarOpen,
        openMobileSidebar: () => setMobileSidebarOpen(true),
        closeMobileSidebar: () => setMobileSidebarOpen(false),
      }}
    >
      {children}
    </AdminUIContext.Provider>
  );
}

export function useAdminUI() {
  return useContext(AdminUIContext);
}
