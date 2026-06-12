'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Roles from '@/components/landing/Roles';
import Pricing from '@/components/landing/Pricing';
import ContactForm from '@/components/landing/ContactForm';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Landing Header with Theme and Language Switching */}
      <Header />

      <main className="flex-1">
        {/* Localized Hero banner section */}
        <Hero />

        {/* Dynamic Farm profiles showcase */}
        <Features />

        {/* Granular RBAC section showing tenant roles (excludes System Owner) */}
        <Roles />

        {/* Differentiated pricing tiers grid */}
        <Pricing />

        {/* Customer Testimonial block */}
        <section className="py-20 border-t bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <MessageSquare className="h-10 w-10 text-orange-500/40 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 italic">
              "Farmly completely revolutionized how we coordinate broiler vaccination and feed logs. We reduced feed losses by 18% in our first two months and employees always know exactly what tasks are pending."
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-600">
                RV
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Robert Vance</div>
                <div className="text-xs text-muted-foreground">Managing Director, Vance Agricultural Group</div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Request Form & Contact card */}
        <ContactForm />
      </main>

      {/* Landing footer details */}
      <Footer />
    </div>
  );
}
