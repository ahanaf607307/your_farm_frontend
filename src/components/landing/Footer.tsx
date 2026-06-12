'use client';

import React from 'react';
import { Sprout } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t bg-muted/40">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-orange-500/10 rounded-lg text-primary">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">Farmly</span>
        </div>
        
        <p className="text-xs text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} Farmly Inc. All rights reserved. {t('footerText')}
        </p>

        <div className="flex space-x-4 text-xs text-muted-foreground">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Support</a>
        </div>
      </div>
    </footer>
  );
}
