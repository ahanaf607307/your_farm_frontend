'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Monitor, Layout, BarChart3, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/providers/LanguageProvider';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function SystemReviewPage() {
  const { t, locale } = useLanguage();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

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

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const goPrev = useCallback(() => {
    setLightboxIdx((prev) => (prev !== null ? (prev - 1 + reviews.length) % reviews.length : null));
  }, [reviews.length]);

  const goNext = useCallback(() => {
    setLightboxIdx((prev) => (prev !== null ? (prev + 1) % reviews.length : null));
  }, [reviews.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, closeLightbox, goPrev, goNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Landing Header */}
      <Header />

      {/* Main Review Section */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-12 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold">
            <Monitor className="h-4 w-4" /> Interactive Previews
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
              {/* Image Preview — clickable */}
              <div
                className="lg:w-7/12 border-b lg:border-b-0 lg:border-r bg-zinc-950 p-2 flex items-center justify-center relative group overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIdx(idx)}
                role="button"
                aria-label={`View ${rev.title} fullscreen`}
              >
                <img
                  src={rev.image}
                  alt={rev.title}
                  className="rounded-lg shadow-2xl max-w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* Zoom hint overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-lg">
                  <div className="bg-black/70 text-white rounded-full p-3 flex items-center gap-2 text-xs font-semibold shadow-lg backdrop-blur-sm">
                    <ZoomIn className="h-4 w-4" />
                    Click to expand
                  </div>
                </div>
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
                <div className="pt-2 flex gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLightboxIdx(idx)}
                    className="gap-2 border-orange-500/30 hover:bg-orange-500/5 hover:text-primary text-xs"
                  >
                    <ZoomIn className="h-3.5 w-3.5" /> View Full Screen
                  </Button>
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

      <Footer />

      {/* ─── Lightbox Modal ─── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev button */}
          <button
            className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Image container — stop click propagation so clicking image doesn't close */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Badge */}
            <span className="self-start bg-orange-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded shadow-md tracking-wider">
              {reviews[lightboxIdx].badge}
            </span>

            <img
              src={reviews[lightboxIdx].image}
              alt={reviews[lightboxIdx].title}
              className="rounded-xl shadow-2xl object-contain max-w-[88vw] max-h-[78vh] ring-1 ring-white/10"
            />

            {/* Caption */}
            <div className="text-center">
              <p className="text-white font-bold text-base">{reviews[lightboxIdx].title}</p>
              <p className="text-white/60 text-xs mt-1">
                {lightboxIdx + 1} / {reviews.length} — Press Esc to close · ← → to navigate
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
