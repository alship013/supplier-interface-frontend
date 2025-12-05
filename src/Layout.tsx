import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeItem?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeItem = 'dashboard' }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeItem={activeItem}
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSidebarToggle={handleSidebarToggle} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};