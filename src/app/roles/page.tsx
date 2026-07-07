'use client';

import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Roles from '@/components/landing/Roles';
import { Users } from 'lucide-react';

export default function RolesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="flex-1">
        {/* Page Hero Banner */}
        <section className="py-16 bg-gradient-to-b from-orange-500/5 to-background border-b">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-5">
              <Users className="h-4 w-4" />
              Role-Based Access Control
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              User Roles & Permissions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Three distinct dashboards tailored to each user's responsibilities — Business Owner, Farm Manager, and Farm Employee.
            </p>
          </div>
        </section>

        {/* Roles Section */}
        <Roles />
      </main>

      <Footer />
    </div>
  );
}
