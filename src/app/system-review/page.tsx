'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sprout, Monitor, Layout, BarChart3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/providers/LanguageProvider';

export default function SystemReviewPage() {
  const { t, locale } = useLanguage();

  const reviews = [
    {
      title: t('review.p4_title'),
      desc: t('review.p4_desc'),
      image: '/previews/preview_4.png',
      badge: locale === 'bn' ? 'ব্যবসার মালিক' : 'Business Owner',
      icon: Layout,
    },
    {
      title: t('review.p5_title'),
      desc: t('review.p5_desc'),
      image: '/previews/preview_5.png',
      badge: locale === 'bn' ? 'ব্যবসার মালিক' : 'Business Owner',
      icon: Layout,
    },
    {
      title: t('review.p6_title'),
      desc: t('review.p6_desc'),
      image: '/previews/preview_6.png',
      badge: locale === 'bn' ? 'খামার ব্যবস্থাপক' : 'Farm Manager',
      icon: BarChart3,
    },
    {
      title: t('review.p7_title'),
      desc: t('review.p7_desc'),
      image: '/previews/preview_7.png',
      badge: locale === 'bn' ? 'খামার ব্যবস্থাপক' : 'Farm Manager',
      icon: BarChart3,
    },
    {
      title: t('review.p8_title'),
      desc: t('review.p8_desc'),
      image: '/previews/preview_8.png',
      badge: locale === 'bn' ? 'খামার কর্মী' : 'Farm Employee',
      icon: Monitor,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md">
        <div className="w-full max-w-[1700px] mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
              <div className="p-2 bg-orange-500/10 rounded-lg text-primary">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Farmly
              </span>
            </Link>
          </div>
          <Link href="/" passHref>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {t('review.back')}
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Review Section */}
      <main className="w-full max-w-[1700px] mx-auto px-4 md:px-12 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold">
            <Monitor className="h-4.5 w-4.5" /> Interactive Previews
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {t('review.title')}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('review.subtitle')}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-16">
          {reviews.map((rev, idx) => (
            <Card key={idx} className="border bg-card overflow-hidden orange-glow flex flex-col lg:flex-row transition-all duration-300 hover:border-orange-500/30">
              {/* Image Preview */}
              <div className="lg:w-7/12 border-b lg:border-b-0 lg:border-r bg-zinc-950 p-2 flex items-center justify-center relative group overflow-hidden">
                <img
                  src={rev.image}
                  alt={rev.title}
                  className="rounded-lg shadow-2xl max-w-full h-auto transition-transform duration-500 group-hover:scale-102"
                />
                <span className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
                  {rev.badge}
                </span>
              </div>

              {/* Text Description */}
              <div className="lg:w-5/12 p-8 flex flex-col justify-center space-y-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-primary flex items-center justify-center mb-2">
                  <rev.icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{rev.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rev.desc}
                </p>
                <div className="pt-2">
                  <Link href="/login" passHref>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-5 shadow-md shadow-orange-500/10">
                      Access Live Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
