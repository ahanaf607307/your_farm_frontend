'use client';

import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChatWidget from '@/components/dashboard/ChatWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
        <ChatWidget />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
