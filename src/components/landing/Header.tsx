'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="p-2 bg-orange-500/10 rounded-lg text-primary">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Farmly
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">{t('nav.features')}</a>
          <a href="#roles" className="hover:text-foreground transition-colors">{t('nav.roles')}</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">{t('nav.pricing')}</a>
          <a href="#contact" className="hover:text-foreground transition-colors">{t('nav.contact')}</a>
          <Link href="/system-review" className="hover:text-foreground transition-colors">{t('nav.systemReview')}</Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold px-2 h-9"
          >
            <Globe className="h-4 w-4" />
            <span>{locale === 'en' ? 'বাং' : 'EN'}</span>
          </Button>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground h-9 w-9"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/login" passHref>
            <Button variant="ghost" size="sm" className="h-9">{t('nav.signIn')}</Button>
          </Link>
          <Link href="/register" passHref>
            <Button size="sm" className="hidden sm:inline-flex bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md shadow-orange-500/10 h-9">
              {t('nav.register')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
