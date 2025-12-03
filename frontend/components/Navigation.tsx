'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Bell, User, LogOut, Menu, X, Home, Briefcase, FileText, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export default function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      // Refresh count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const count = await apiClient.getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/dashboard/admin';
    if (user?.role === 'RECRUITER') return '/dashboard/recruiter';
    return '/dashboard/candidate';
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Recruitsss</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              
              {user?.role === 'CANDIDATE' && (
                <>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Briefcase className="h-4 w-4 mr-1" />
                    Emplois
                  </Link>
                  <Link
                    href="/applications"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Candidatures
                  </Link>
                </>
              )}
              
              {user?.role === 'RECRUITER' && (
                <>
                  <Link
                    href="/jobs/create"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Briefcase className="h-4 w-4 mr-1" />
                    Publier une offre
                  </Link>
                  <Link
                    href="/applications"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Candidatures
                  </Link>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <>
                  <Link
                    href="/admin/users"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Utilisateurs
                  </Link>
                  <Link
                    href="/admin/jobs"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Emplois
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href={user?.role === 'CANDIDATE' ? '/profile/candidate' : user?.role === 'RECRUITER' ? '/profile/recruiter' : '/dashboard/admin'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {user?.role === 'ADMIN' ? 'Paramètres' : 'Mon profil'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href={getDashboardLink()}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            
            {user?.role === 'CANDIDATE' && (
              <>
                <Link
                  href="/jobs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Emplois
                </Link>
                <Link
                  href="/applications"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Candidatures
                </Link>
              </>
            )}
            
            {user?.role === 'RECRUITER' && (
              <>
                <Link
                  href="/jobs/create"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Publier une offre
                </Link>
                <Link
                  href="/applications"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Candidatures
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
