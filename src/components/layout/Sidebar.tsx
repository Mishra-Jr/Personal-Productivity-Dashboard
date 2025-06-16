import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderOpen, StickyNote, Image, FileText, Calendar, Linkedin, Moon, Sun, X, Eye, User, Upload, Files } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useApp();
  const { isPublicView } = state;

  const publicNavItems = [
    { to: '/recruiter', icon: User, label: 'Recruiter View' },
  ];

  const privateNavItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/notes', icon: StickyNote, label: 'Notes' },
    { to: '/planner', icon: Calendar, label: 'Daily Planner' },
    { to: '/linkedin', icon: Linkedin, label: 'LinkedIn Tracker' },
    { to: '/media', icon: Image, label: 'Media' },
    { to: '/files', icon: Files, label: 'Files' },
    { to: '/resume', icon: FileText, label: 'Resume' },
  ];

  const navItems = isPublicView ? publicNavItems : [...privateNavItems, ...publicNavItems];

  const togglePublicView = () => {
    dispatch({ type: 'TOGGLE_PUBLIC_VIEW', payload: !isPublicView });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out z-50
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {isPublicView ? 'Public Profile' : 'Dashboard'}
            </h1>
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Public View Toggle */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={togglePublicView}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                isPublicView
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Eye size={20} />
              <span>{isPublicView ? 'Exit Public View' : 'Public View'}</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onMobileClose}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;