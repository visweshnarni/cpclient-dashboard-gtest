import React, { useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import HomeView from './components/client/home/HomeView';
import EnrolledServiceView from './components/client/services/EnrolledServiceView';
import ServiceHubView from './components/client/service_hub/ServiceHubView';
import CalendarView from './components/client/calendar/CalendarView';
import DocumentsView from './components/client/documents/DocumentsView';
import ReportsView from './components/client/reports/ReportsView';
import ConsultView from './components/client/consult/ConsultView';
import SettingsView from './components/settings/SettingsView';

export type ViewType = 'home' | 'enrolledServices' | 'serviceHub' | 'calendar' | 'documents' | 'reports' | 'consult' | 'settings';
export type Theme = 'light' | 'dark' | 'system';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (theme === 'system') {
           const newIsDark = mediaQuery.matches;
           root.classList.remove(newIsDark ? 'light' : 'dark');
           root.classList.add(newIsDark ? 'dark' : 'light');
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
}, [theme]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setCurrentView={setCurrentView} />;
      case 'enrolledServices':
        return <EnrolledServiceView searchQuery={searchQuery} />;
      case 'serviceHub':
        return <ServiceHubView searchQuery={searchQuery} />;
      case 'calendar':
        return <CalendarView />;
      case 'documents':
        return <DocumentsView searchQuery={searchQuery} />;
      case 'reports':
        return <ReportsView />;
      case 'consult':
        return <ConsultView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-text-primary dark:text-gray-200">
      <MainLayout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        setTheme={setTheme}
      >
        {renderView()}
      </MainLayout>
    </div>
  );
};

export default App;
