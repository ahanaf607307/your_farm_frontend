'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setMobileMenuOpen } from '@/redux/slices/uiSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sprout } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { mobileMenuOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Mobile Sidebar (Sheet drawer) */}
      <Sheet open={mobileMenuOpen} onOpenChange={(val) => dispatch(setMobileMenuOpen(val))}>
        <SheetContent side="left" className="p-0 w-64 bg-card border-r">
          <div className="h-16 flex items-center px-6 border-b">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="p-2 bg-orange-500/10 rounded-lg text-primary">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                Farmly
              </span>
            </Link>
          </div>
          {/* Scrollable menu options */}
          <div className="p-4">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        
        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="container mx-auto max-w-6xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
