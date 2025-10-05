'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AppContent() {
  const { user, loading, isActive } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect logic based on user status and device
    if (user && isActive) {
      const isMobile = window.innerWidth < 768;
      const isAdmin = user.role === 'Admin';
      
      // Non-admin users on mobile should go to mobile view
      if (!isAdmin && isMobile) {
        router.push('/m');
      } else {
        // Admin users or desktop users go to admin dashboard or board
        router.push(isAdmin ? '/admin' : '/board');
      }
    }
  }, [user, isActive, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Wesley Chapel OR Flow...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in or not active
  if (!user || !isActive) {
    return <AuthPage />;
  }

  // Show welcome message while redirecting
  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Wesley Chapel OR Flow</h1>
        <p className="text-gray-600">Redirecting you to your dashboard...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div>
      </div>
    </Layout>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
