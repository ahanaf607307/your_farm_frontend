'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Hero() {
  const { t, locale } = useLanguage();

  const mockTexts = locale === 'en' ? {
    broilers: 'Total Broilers',
    feed: 'Remaining Feed',
    tasks: 'Completed Tasks',
    profit: 'Net Profit',
    growth: 'Weekly Growth Dynamics',
    employeeTasks: "Today's Employee Tasks",
    healthy: 'Healthy (100%)',
    starter: 'Starter Mash',
    daily: 'Daily Employees Tasks',
    week: 'This Week Sales',
    lowStock: 'Low Stock Alert',
    t1: 'Feed Broiler Batch #10',
    t2: 'Give Vaccine to Layer',
    t3: 'Clean Fish Pond #3',
    statusComplete: 'Complete',
    statusProgress: 'In Progress',
    statusPending: 'Pending',
    day: 'Day',
  } : {
    broilers: 'মোট ব্রয়লার',
    feed: 'অবশিষ্ট খাদ্য',
    tasks: 'সম্পন্ন কাজ',
    profit: 'নীট লাভ',
    growth: 'সাপ্তাহিক প্রবৃদ্ধি বিবরণ',
    employeeTasks: 'আজকের কর্মীদের কাজ',
    healthy: 'সুস্থ (১০০%)',
    starter: 'স্টার্টার ম্যাশ',
    daily: 'কর্মীদের দৈনিক কাজ',
    week: 'এই সপ্তাহের বিক্রি',
    lowStock: 'স্বল্প স্টকের অ্যালার্ট',
    t1: 'ব্রয়লার ব্যাচ #১০ কে খাওয়ান',
    t2: 'লেয়ার মুরগিকে টিকা দিন',
    t3: 'পুকুর ৩ নম্বর পরিষ্কার করুন',
    statusComplete: 'সম্পন্ন',
    statusProgress: 'চলমান',
    statusPending: 'অপেক্ষমান',
    day: 'দিন',
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-6">
          <Award className="h-4 w-4" /> {t('hero.award')}
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          {t('hero.title')} <br />
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            {t('hero.titleAccent')}
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-base px-8 py-6 rounded-xl shadow-lg shadow-orange-500/20 font-bold">
              {t('hero.getStarted')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl">
              {t('hero.explore')}
            </Button>
          </a>
        </div>

        {/* Dashboard Mock Preview */}
        <div className="mt-16 border rounded-2xl overflow-hidden shadow-2xl bg-card/60 backdrop-blur border-border/80 orange-glow">
          <div className="bg-muted/40 h-8 flex items-center px-4 border-b space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-muted-foreground mx-auto pl-10 font-mono">dashboard.farmly.com</span>
          </div>
          <div className="p-4 md:p-8 bg-zinc-950 text-left overflow-x-auto">
            <div className="min-w-[800px] space-y-6">
              {/* Mock Navbar */}
              <div className="flex justify-between items-center border-b border-zinc-855 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded bg-orange-505 bg-orange-500 flex items-center justify-center text-white font-bold">F</div>
                  <span className="text-white font-bold text-sm">Vance Poultry Division</span>
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20">Poultry Farm</span>
                </div>
                <div className="flex space-x-2">
                  <span className="h-6 px-2.5 rounded bg-zinc-800 text-zinc-400 text-xs flex items-center">Active Block</span>
                  <div className="h-6 w-6 rounded-full bg-zinc-800" />
                </div>
              </div>
              {/* Mock Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { l: mockTexts.broilers, v: '1,200', c: mockTexts.healthy, g: '+8.3%', warn: false },
                  { l: mockTexts.feed, v: '400 kg', c: mockTexts.starter, g: mockTexts.lowStock, warn: true },
                  { l: mockTexts.tasks, v: '12 / 15', c: mockTexts.daily, g: '80%', warn: false },
                  { l: mockTexts.profit, v: '$4,120', c: mockTexts.week, g: '+12.4%', warn: false },
                ].map((s, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                    <span className="text-zinc-500 text-xs">{s.l}</span>
                    <div className="text-white text-xl font-bold mt-1">{s.v}</div>
                    <div className="flex justify-between mt-2 text-2xs">
                      <span className="text-zinc-400">{s.c}</span>
                      <span className={`font-medium ${s.warn ? 'text-rose-500 font-semibold' : 'text-orange-400'}`}>{s.g}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mock Chart Area & Tasks */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex flex-col justify-between h-48">
                  <div className="text-white text-xs font-semibold">{mockTexts.growth}</div>
                  <div className="h-28 flex items-end space-x-3 pt-4">
                    {[40, 55, 45, 60, 75, 80, 95].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-orange-500/80 rounded-t" style={{ height: `${val}%` }} />
                        <span className="text-zinc-650 text-zinc-550 text-3xs mt-1">{mockTexts.day} {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg space-y-3">
                  <div className="text-white text-xs font-semibold">{mockTexts.employeeTasks}</div>
                  <div className="space-y-2 text-2xs">
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-800/50 border border-zinc-800 text-white">
                      <span>{mockTexts.t1}</span>
                      <span className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded font-semibold">{mockTexts.statusComplete}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-800/50 border border-zinc-800 text-white">
                      <span>{mockTexts.t2}</span>
                      <span className="text-amber-450 text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-semibold">{mockTexts.statusProgress}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-800/50 border border-zinc-800 text-white">
                      <span>{mockTexts.t3}</span>
                      <span className="text-zinc-450 text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">{mockTexts.statusPending}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
