'use client';

import React from 'react';
import { Users, Activity, Calendar } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Roles() {
  const { t } = useLanguage();

  const roleItems = [
    {
      role: t('roles.bizOwner'),
      icon: Users,
      desc: t('roles.bizOwnerDesc'),
    },
    {
      role: t('roles.manager'),
      icon: Activity,
      desc: t('roles.managerDesc'),
    },
    {
      role: t('roles.employee'),
      icon: Calendar,
      desc: t('roles.employeeDesc'),
    },
  ];

  return (
    <section id="roles" className="py-20 border-t bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t('roles.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('roles.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roleItems.map((item, idx) => (
            <div key={idx} className="p-6 border rounded-xl bg-card hover:shadow-md hover:border-orange-500/20 transition-all duration-300 orange-glow-hover">
              <div className="h-12 w-12 rounded-full bg-orange-500/10 text-primary flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.role}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
