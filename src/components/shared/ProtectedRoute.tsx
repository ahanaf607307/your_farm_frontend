'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their default allowed dashboard if they bypass URL manually
        if (user.role === 'SYSTEM_OWNER') {
          router.push('/system-owner');
        } else if (user.role === 'BUSINESS_OWNER') {
          router.push('/business-owner');
        } else if (user.role === 'FARM_MANAGER') {
          router.push('/manager');
        } else {
          router.push('/employee');
        }
      }
    }
  }, [mounted, isAuthenticated, user, isLoading, allowedRoles, router]);

  // Loading skeleton/spinner while checking credentials
  if (!mounted || isLoading || !isAuthenticated || (user && allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-medium">Validating credentials & permissions...</span>
      </div>
    );
  }

  return <>{children}</>;
}
