'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function SubscriptionsTab() {
  const plans = [
    {
      name: 'Basic Tier',
      price: '$49',
      desc: 'Perfect for small single-farm owners',
      features: [
        'Up to 2 Farms',
        'Livestock Registry & Categories',
        'Feed & Medication Tracker',
        'Employee Task Checklists'
      ]
    },
    {
      name: 'Standard Tier',
      price: '$99',
      desc: 'Popular choice for expanding setups',
      popular: true,
      features: [
        'Up to 5 Farms',
        'Livestock Registry & Categories',
        'Feed & Medication Tracker',
        'Employee Task Checklists',
        'CSV Import & Export Tools',
        'Real-time Alert Notifications'
      ]
    },
    {
      name: 'Enterprise Tier',
      price: '$199',
      desc: 'Custom configuration for agriculture groups',
      features: [
        'Unlimited Farms',
        'Livestock Registry & Categories',
        'Feed & Medication Tracker',
        'Employee Task Checklists',
        'CSV Import & Export Tools',
        'Real-time Alert Notifications',
        'Internal Chat Messenger',
        '24/7 Priority Support Helpdesk'
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pricing tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`p-6 bg-card rounded-2xl border relative flex flex-col justify-between transition-all duration-300 ${
              plan.popular ? 'border-primary shadow-xl ring-2 ring-primary/20 scale-105 orange-glow' : 'border-border'
            }`}
          >
            {plan.popular && (
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white text-[10px] px-3.5 py-1 rounded-full font-extrabold uppercase tracking-widest whitespace-nowrap shadow-md shadow-orange-500/20 ring-4 ring-background">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="text-sm font-bold mb-1 text-orange-500 uppercase tracking-wider">{plan.name}</h3>
              <p className="text-3xs text-muted-foreground mb-3 leading-relaxed">{plan.desc}</p>
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-extrabold font-mono">{plan.price}</span>
                <span className="text-muted-foreground text-3xs ml-1">/month</span>
              </div>
              <ul className="space-y-2 text-[11px] text-muted-foreground border-t pt-4">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className={`flex items-center ${fIdx === 0 ? 'text-foreground font-semibold' : ''}`}>
                    <Check className="h-3.5 w-3.5 text-primary mr-2 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Recent Billing Logs</CardTitle>
          <CardDescription>Tenant automated stripe/cash subscription payments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { group: 'Vance Agricultural Group', tier: 'Enterprise Tier', amt: 199, date: '2026-06-10', status: 'PAID' },
            { group: 'Greenfield Poultry Corp', tier: 'Standard Tier', amt: 99, date: '2026-06-08', status: 'PAID' },
            { group: 'Greenfield Barns', tier: 'Basic Tier', amt: 49, date: '2026-06-05', status: 'PAID' }
          ].map((inv, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs p-3 border rounded-lg bg-muted/20">
              <div>
                <div className="font-bold">{inv.group}</div>
                <div className="text-3xs text-muted-foreground font-mono mt-0.5">{inv.tier} • {inv.date}</div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(inv.amt)}</span>
                <Badge variant="success" className="text-[9px] font-bold">{inv.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
