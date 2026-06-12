'use client';

import React from 'react';
import { Shield, CheckCircle2, Tv, Sparkles } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function VideoShowcase() {
  const { locale } = useLanguage();

  const title = locale === 'bn' ? 'চলুন এক নজরে ফার্মলি ডিজিটাল ট্যুর দেখে আসি' : 'Experience Farmly in Action';
  const subtitle = locale === 'bn' 
    ? 'খামার ব্যবস্থাপক কীভাবে ওষুধের সময়সূচী নির্ধারণ করেন, ব্যবসার মালিক কীভাবে লাভ-ক্ষতি ট্র্যাক করেন এবং কর্মীরা কীভাবে কাজের প্রমাণ আপলোড করেন তা ভিডিওর মাধ্যমে দেখুন।'
    : 'Watch how managers delegate vaccine schedules, business owners track financials, and employees upload verification photos in our unified portal.';
  const badge = locale === 'bn' ? 'পণ্য পরিচিতি ভিডিও' : 'Product Video Tour';

  const highlights = [
    {
      title: locale === 'bn' ? 'স্বয়ংক্রিয় কাজের চেকলিস্ট' : 'Automated Task Cards',
      desc: locale === 'bn' ? 'কর্মীরা তাদের ফোনে তাৎক্ষণিকভাবে খাবার এবং ভ্যাকসিনের সময়সূচী জানতে পারেন।' : 'Employees receive instant feeding and vaccine alerts on their phone.',
    },
    {
      title: locale === 'bn' ? 'আর্থিক হিসাব ট্র্যাকিং' : 'Financial Ledger Tracking',
      desc: locale === 'bn' ? 'খামারের মালিকরা খাদ্য খরচ, দুধ বিক্রির আয় এবং নেট লাভ পর্যবেক্ষণ করতে পারেন।' : 'Owners monitor feeding costs, milk sale revenues, and net profits.',
    },
    {
      title: locale === 'bn' ? 'পশুচিকিৎসা ও স্বাস্থ্য লগিং' : 'Veterinary & Health Logging',
      desc: locale === 'bn' ? 'গবাদি পশুর ওজন, প্রজনন অগ্রগতি এবং কোয়ারেন্টাইন রেকর্ড করুন।' : 'Record livestock quarantine stats, weights, and breeding progress.',
    },
  ];

  return (
    <section id="demo-tour" className="py-20 border-t bg-zinc-50/50 dark:bg-zinc-950/20 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 right-[10%] w-[350px] h-[350px] bg-orange-500/5 dark:bg-orange-500/2 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-[10%] w-[250px] h-[250px] bg-amber-500/5 dark:bg-amber-500/2 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 text-xs font-semibold">
            <Tv className="h-4 w-4" /> {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Video Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Video Player Mockup */}
          <div className="lg:col-span-8 w-full">
            <div className="relative group">
              {/* Outer ambient glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-25 blur-xl group-hover:opacity-35 transition duration-1000" />
              
              {/* Browser mockup for Video */}
              <div className="relative bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
                {/* Header bar */}
                <div className="bg-zinc-50 dark:bg-zinc-900/60 px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono bg-zinc-100 dark:bg-zinc-950 px-4 py-1 rounded-md border border-zinc-200/50 dark:border-zinc-800/50 w-1/3 text-center truncate">
                    farmly-demo-tour.mp4
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-500">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline-block">HD Playback</span>
                  </div>
                </div>

                {/* Video Container */}
                <div className="bg-black aspect-video relative flex items-center justify-center">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-contain"
                    poster="/heroImage/g4.png"
                  >
                    <source src="/heroVide/framVideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Features / highlights */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {locale === 'bn' ? 'ডেমো হাইলাইটস' : 'Demo Highlights'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {locale === 'bn' 
                  ? 'ভিডিওতে দেখানো মূল মডিউলগুলো নিচে সংক্ষেপে দেওয়া হলো যা খামার পরিচালনায় প্রভূত সুবিধা প্রদান করে।'
                  : 'Quick summary of the main features visualized in this walkthrough video.'}
              </p>
            </div>

            <div className="space-y-6">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 h-7 w-7 rounded-lg bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
