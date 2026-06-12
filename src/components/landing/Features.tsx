'use client';

import React from 'react';
import { Sprout } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Features() {
  const { t } = useLanguage();

  const farmTypes = [
    { name: t('features.poultry'), desc: t('features.poultryDesc') },
    { name: t('features.dairy'), desc: t('features.dairyDesc') },
    { name: t('features.goat'), desc: t('features.goatDesc') },
    { name: t('features.fish'), desc: t('features.fishDesc') },
    { name: t('features.duck'), desc: t('features.duckDesc') },
    { name: t('features.bird'), desc: t('features.birdDesc') },
    { name: t('features.cattle'), desc: t('features.cattleDesc') },
    { name: t('features.sheep'), desc: t('features.sheepDesc') },
  ];

  return (
    <section id="features" className="py-20 border-t bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {farmTypes.map((farm, idx) => (
            <Card key={idx} className="border bg-card hover:border-orange-500/35 transition-all duration-300 group hover:shadow-md orange-glow-hover">
              <CardHeader className="p-5">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sprout className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">{farm.name}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-1">{farm.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
