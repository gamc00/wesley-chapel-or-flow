import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserIcon, 
  Bars3Icon, 
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout, isAdmin, isActive } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !isActive) {
    return <>{children}</>;
  }

  const navigation = [
    { name: 'Live Board', href: '/board', icon: ClipboardDocumentListIcon, adminOnly: false },
    { name: 'Admin Menu', href: '/admin', icon: HomeIcon, adminOnly: true },
    { name: 'Today\'s Setup', href: '/setup', icon: DocumentChartBarIcon, adminOnly: true },
    { name: 'Providers', href: '/providers', icon: UserGroupIcon, adminOnly: true },
    { name: 'Surgeons', href: '/surgeons', icon: UserIcon, adminOnly: true },
    { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon, adminOnly: true },
    { name: 'Mobile View', href: '/m', icon: DevicePhoneMobileIcon, adminOnly: false },
    { name: 'Kiosk', href: '/board/kiosk', icon: ComputerDesktopIcon, adminOnly: false },
  ];

  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Wesley Chapel OR</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <div className="text-base font-medium text-gray-800">{user.email}</div>
                <div className="text-sm font-medium text-gray-500">
                  {user.role} {user.provider && `• ${user.provider.firstName} ${user.provider.lastName}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Wesley Chapel OR</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{user.email}</div>
                <div className="text-xs text-gray-500">
                  {user.role} {user.provider && `• ${user.provider.firstName} ${user.provider.lastName}`}
                </div>
              </div>
              <button
                onClick={logout}
                className="ml-3 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-500 hover:text-gray-700"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {title && (
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h1>
              )}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
