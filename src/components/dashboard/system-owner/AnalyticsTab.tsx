'use client';

import React from 'react';
import { DollarSign, Users, Briefcase, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsTabProps {
  activeFilter: 'today' | 'weekly' | 'monthly' | 'yearly';
  setActiveFilter: (filter: 'today' | 'weekly' | 'monthly' | 'yearly') => void;
  stats: {
    revenue: number;
    registrations: number;
    activeBiz: number;
    totalBiz: number;
  };
}

export default function AnalyticsTab({ activeFilter, setActiveFilter, stats }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* Time Filters */}
      <div className="flex justify-end">
        <div className="flex items-center border bg-card p-1 rounded-xl shrink-0">
          {(['today', 'weekly', 'monthly', 'yearly'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="text-xs capitalize h-8 rounded-lg"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Monthly Gross Revenue</CardTitle>
            <DollarSign className="h-4.5 w-4.5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
              {formatCurrency(stats.revenue)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" /> +14.2% from previous cycle
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">New Tenant Registrations</CardTitle>
            <Users className="h-4.5 w-4.5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats.registrations}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" /> +8.1% organic registrations
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active SaaS Businesses</CardTitle>
            <Briefcase className="h-4.5 w-4.5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {stats.activeBiz} <span className="text-sm font-normal text-muted-foreground">/ {stats.totalBiz}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {stats.totalBiz - stats.activeBiz} tenants are currently suspended
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Subscriptions Conversion</CardTitle>
            <TrendingUp className="h-4.5 w-4.5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">82%</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" /> High conversion to Enterprise
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Revenue Growth Dynamics</CardTitle>
            <CardDescription>Simulated weekly platform earnings.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-end justify-between px-6 pb-6 pt-4">
            {[45, 60, 55, 78, 92, 85, 110, 130].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="text-3xs text-zinc-500 font-mono mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${val}k
                </div>
                <div
                  className="w-8/12 bg-gradient-to-t from-orange-600 to-orange-400 dark:from-orange-700 dark:to-orange-500 rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-md shadow-orange-500/10"
                  style={{ height: `${(val / 140) * 150}px` }}
                />
                <span className="text-[10px] text-zinc-500 mt-2 font-mono">Wk {i + 1}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Tenant Accounts Growth</CardTitle>
            <CardDescription>Total registered businesses accumulative.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 relative flex items-end px-6 pb-6 pt-4">
            <svg className="absolute inset-x-6 bottom-16 h-36 w-[calc(100%-3rem)] text-primary overflow-visible">
              <path
                d="M0,120 Q50,90 100,80 T200,60 T300,40 T400,20 T500,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                className="drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)]"
              />
              <circle cx="500" cy="5" r="5" className="fill-primary stroke-white dark:stroke-zinc-950 stroke-2" />
            </svg>
            <div className="w-full flex justify-between text-[10px] text-zinc-500 font-mono border-t pt-2 mt-auto">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
