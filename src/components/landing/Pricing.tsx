'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: 'Basic',
      price: '$49',
      desc: t('pricing.basicDesc'),
      features: [
        t('pricing.farms2'),
        t('pricing.livestockRegistry'),
        t('pricing.feedTracker'),
        t('pricing.employeeTasks'),
      ],
    },
    {
      name: 'Standard',
      price: '$99',
      desc: t('pricing.standardDesc'),
      popular: true,
      features: [
        t('pricing.farms5'),
        t('pricing.livestockRegistry'),
        t('pricing.feedTracker'),
        t('pricing.employeeTasks'),
        t('pricing.csvTools'),
        t('pricing.alerts'),
      ],
    },
    {
      name: 'Enterprise',
      price: '$199',
      desc: t('pricing.enterpriseDesc'),
      features: [
        t('pricing.farmsUnlimited'),
        t('pricing.livestockRegistry'),
        t('pricing.feedTracker'),
        t('pricing.employeeTasks'),
        t('pricing.csvTools'),
        t('pricing.alerts'),
        t('pricing.chat'),
        t('pricing.prioritySupport'),
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 border-t bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl border relative flex flex-col justify-between bg-card transition-all duration-300 ${
                plan.popular ? 'border-primary shadow-xl ring-2 ring-primary/20 scale-105 orange-glow' : 'border-border hover:border-orange-500/20'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white text-[10px] px-3.5 py-1 rounded-full font-extrabold uppercase tracking-widest whitespace-nowrap shadow-md shadow-orange-500/20 ring-4 ring-background">
                  {t('pricing.mostPopular')}
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/month</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className={`flex items-center ${fIdx === 0 ? 'text-foreground font-semibold' : ''}`}>
                      <Check className="h-4 w-4 text-primary mr-2 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" passHref className="w-full">
                <Button
                  className={`w-full py-5 rounded-xl text-sm font-bold ${
                    plan.popular ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/10' : 'variant-outline'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {t('pricing.getStarted')} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
