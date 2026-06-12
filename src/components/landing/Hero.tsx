'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, ArrowRight, Monitor, Shield, Layout, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Hero() {
  const { t, locale } = useLanguage();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const heroImages = [
    {
      url: '/heroImage/g4.png',
      title: locale === 'bn' ? 'খামার ওভারভিউ' : 'Farms Overview',
      label: locale === 'bn' ? 'খামার' : 'Farms',
      icon: Layout,
    },
    {
      url: '/previews/preview_7.png',
      title: locale === 'bn' ? 'পশুপাখি রেজিস্ট্রি' : 'Animals Registry',
      label: locale === 'bn' ? 'পশুপাখি' : 'Animals',
      icon: Shield,
    },
    {
      url: '/heroImage/g5.png',
      title: locale === 'bn' ? 'কর্মী তালিকা ডিরেক্টরি' : 'Staff Directory',
      label: locale === 'bn' ? 'কর্মী' : 'Staff',
      icon: Users,
    },
    {
      url: '/previews/preview_8.png',
      title: locale === 'bn' ? 'কর্মী বরাদ্দকৃত কাজ' : 'Assigned Tasks',
      label: locale === 'bn' ? 'কাজ' : 'Tasks',
      icon: Monitor,
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b">
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 text-xs font-semibold">
              <Award className="h-4 w-4 text-orange-500 animate-pulse" /> {t('hero.award')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent block mt-1">
                {t('hero.titleAccent')}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register" passHref className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-500/20 px-8 py-6 text-base h-auto transition-transform hover:-translate-y-0.5 cursor-pointer">
                  {t('hero.getStarted')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold px-8 py-6 text-base h-auto cursor-pointer">
                  {t('hero.explore')}
                </Button>
              </a>
            </div>
            
            {/* Quick Indicators */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                {locale === 'bn' ? 'মাল্টি-টেন্যান্ট ড্যাশবোর্ড' : 'Multi-tenant Panel'}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                {locale === 'bn' ? 'রিয়েল-টাইম ট্র্যাকিং' : 'Real-time Operations'}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                {locale === 'bn' ? 'স্মার্ট কর্মী চেকলিস্ট' : 'Automated Task Checklists'}
              </div>
            </div>
          </div>
          
          {/* Right Column: Web Browser Mockup Image Switcher */}
          <div className="lg:col-span-7 flex flex-col w-full">
            <div className="relative w-full">
              {/* Decorative glows */}
              <div className="absolute -top-12 -left-12 w-72 h-72 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Browser mockup window wrapper */}
              <div className="relative bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 orange-glow">
                
                {/* Browser bar */}
                <div className="bg-zinc-50 dark:bg-zinc-900/60 px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80">
                  {/* Circle window controls */}
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                  </div>
                  
                  {/* Address url bar */}
                  <div className="text-[10px] text-muted-foreground font-mono bg-zinc-100 dark:bg-zinc-950 px-4 py-1 rounded-md border border-zinc-200/50 dark:border-zinc-800/50 w-2/3 max-w-[320px] text-center select-none truncate">
                    {heroImages[activeImageIdx].title}
                  </div>
                  
                  <div className="w-12 flex items-center justify-end space-x-1.5 text-muted-foreground">
                    <Monitor className="h-3.5 w-3.5" />
                  </div>
                </div>
                
                {/* Actual image canvas */}
                <div className="bg-zinc-950 aspect-[16/10] relative flex items-center justify-center p-2 group overflow-hidden">
                  <img
                    src={heroImages[activeImageIdx].url}
                    alt={heroImages[activeImageIdx].title}
                    className="rounded-md shadow-2xl max-w-full max-h-full object-contain animate-fadeIn"
                    key={activeImageIdx}
                  />
                </div>
              </div>
              
              {/* Switcher Controls tabs */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {heroImages.map((img, idx) => {
                  const Icon = img.icon;
                  const isActive = idx === activeImageIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold scale-[1.02] shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800/80 hover:border-orange-500/30 hover:bg-orange-500/5 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 mb-1.5" />
                      <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight block max-w-full truncate">
                        {img.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
