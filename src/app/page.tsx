'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Sprout,
  TrendingUp,
  ShieldAlert,
  Users,
  Layers,
  Check,
  ChevronRight,
  MessageSquare,
  Activity,
  Calendar,
  Sun,
  Moon,
  ArrowRight,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  const farmTypes = [
    { name: 'Poultry Farm', desc: 'Broilers & Layers health, feed tracking & egg counts.' },
    { name: 'Dairy Farm', desc: 'Milk yield tracking, cow schedules & quarantine logs.' },
    { name: 'Goat Farm', desc: 'Category breeding records, weight & medicine schedules.' },
    { name: 'Fish Farm', desc: 'Pond aeration levels, stocking history & feed daily usage.' },
    { name: 'Duck Farm', desc: 'Brooding schedules, vaccination logs & water health.' },
    { name: 'Bird Farm', desc: 'Aviary climate details, diet plans & species catalog.' },
    { name: 'Cattle Farm', desc: 'Herd breeding, feeding ratios & weight tracking.' },
    { name: 'Sheep Farm', desc: 'Wool yields tracking, grazing records & vaccines.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-500/10 rounded-lg text-primary">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Farmly
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#roles" className="hover:text-foreground transition-colors">Roles</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-muted-foreground"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Link href="/login" passHref>
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register" passHref>
              <Button size="sm" className="hidden sm:inline-flex bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md shadow-orange-500/10">
                Register Business
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          {/* Background Gradient Blurs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-6">
              <Award className="h-4 w-4" /> Best Farm Management Software of 2026
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Enterprise Farm Management <br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Simplified & Unified
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              A comprehensive multi-tenant SaaS built for modern agriculture. Streamline feed schedules, livestock weight, veterinary operations, inventory, and staff tasks across multiple businesses in one real-time panel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-base px-8 py-6 rounded-xl shadow-lg shadow-orange-500/20 font-bold">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl">
                  Explore Features
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
                      <div className="h-8 w-8 rounded bg-orange-500 flex items-center justify-center text-white font-bold">F</div>
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
                      { l: 'Total Broilers', v: '1,200', c: 'Healthy (100%)', g: '+8.3%' },
                      { l: 'Remaining Feed', v: '400 kg', c: 'Starter Mash', g: 'Low Stock Alert' },
                      { l: 'Completed Tasks', v: '12 / 15', c: 'Daily Employees Tasks', g: '80%' },
                      { l: 'Net Profit', v: '$4,120', c: 'This Week Sales', g: '+12.4%' },
                    ].map((s, i) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                        <span className="text-zinc-550 text-xs">{s.l}</span>
                        <div className="text-white text-xl font-bold mt-1">{s.v}</div>
                        <div className="flex justify-between mt-2 text-2xs">
                          <span className="text-zinc-400">{s.c}</span>
                          <span className="text-orange-400 font-medium">{s.g}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Mock Chart Area & Tasks */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex flex-col justify-between h-48">
                      <div className="text-white text-xs font-semibold">Weekly Growth Dynamics</div>
                      <div className="h-28 flex items-end space-x-3 pt-4">
                        {[40, 55, 45, 60, 75, 80, 95].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-orange-500/80 rounded-t" style={{ height: `${val}%` }} />
                            <span className="text-zinc-600 text-3xs mt-1">Day {idx + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg space-y-3">
                      <div className="text-white text-xs font-semibold">Today's Employee Tasks</div>
                      <div className="space-y-2 text-2xs">
                        <div className="flex items-center justify-between p-2 rounded bg-zinc-800/50 border border-zinc-800 text-white">
                          <span>Feed Broiler Batch #10</span>
                          <span className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">Complete</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-zinc-800/50 border border-zinc-800 text-white">
                          <span>Give Vaccine to Layer</span>
                          <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">In Progress</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-zinc-800/50 border border-zinc-800 text-white">
                          <span>Clean Fish Pond #3</span>
                          <span className="text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Farm Types Showcase */}
        <section id="features" className="py-20 border-t bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Designed for Every Agricultural Operation
              </h2>
              <p className="text-muted-foreground">
                Whether you run a single chicken coop or coordinate several high-intensity aquaculture lagoons and dairy stables, Farmly adapts to your requirements.
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

        {/* Roles & Permissions Breakdown */}
        <section id="roles" className="py-20 border-t bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Granular Role-Based Access Control
              </h2>
              <p className="text-muted-foreground">
                Separate tasks and limit views automatically to match your workflow. Four distinct dashboards ready out of the box.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  role: 'System Owner',
                  icon: Layers,
                  desc: 'Superuser access. Monitors global SaaS activity, registers new businesses, and tracks platform subscriptions and revenue growth trends.',
                },
                {
                  role: 'Business Owner',
                  icon: Users,
                  desc: 'Company management. Creates farms, assigns managers and employees, tracks financial statements, and reviews company expenses and profits.',
                },
                {
                  role: 'Farm Manager',
                  icon: Activity,
                  desc: 'Operational controls. Organizes categories, livestock lists, food/medicine schedules, monitors stock alerts, and assigns daily staff tasks.',
                },
                {
                  role: 'Farm Employee',
                  icon: Calendar,
                  desc: 'Mobile action items. Receives dynamic work cards (feeding, vaccine, cleaning), reports completion notes, and uploads photo evidence.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 border rounded-xl bg-card hover:shadow-md transition-shadow">
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

        {/* Pricing Plan */}
        <section id="pricing" className="py-20 border-t bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Flexible Plans for Businesses of Any Size
              </h2>
              <p className="text-muted-foreground">
                All plans include automated tasks generation, real-time alert notifications, and internal chat threads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Basic', price: '$49', desc: 'Perfect for small single-farm owners', farms: 'Up to 2 Farms', support: 'Standard Email support' },
                { name: 'Standard', price: '$99', desc: 'Popular choice for expanding setups', farms: 'Up to 5 Farms', support: 'Priority 24/7 help desk', popular: true },
                { name: 'Enterprise', price: '$199', desc: 'Custom configuration for agriculture groups', farms: 'Unlimited Farms', support: 'Dedicated Account Manager' },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-2xl border relative flex flex-col justify-between bg-card ${
                    plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-2xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      Most Popular
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
                      <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> {plan.farms}</li>
                      <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Livestock Registry</li>
                      <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Food/Medicine Trackers</li>
                      <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> Employee Task Cards</li>
                      <li className="flex items-center"><Check className="h-4 w-4 text-primary mr-2" /> {plan.support}</li>
                    </ul>
                  </div>
                  <Link href="/register" passHref className="w-full">
                    <Button
                      className={`w-full py-5 rounded-xl text-sm font-bold ${
                        plan.popular ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'variant-outline'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Started <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 border-t bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <MessageSquare className="h-10 w-10 text-orange-500/40 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 italic">
              "Farmly completely revolutionized how we coordinate broiler vaccination and feed logs. We reduced feed losses by 18% in our first two months and employees always know exactly what tasks are pending."
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-600">
                RV
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Robert Vance</div>
                <div className="text-xs text-muted-foreground">Managing Director, Vance Agricultural Group</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-12 border-t bg-muted/40">
          <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-500/10 rounded-lg text-primary">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">Farmly</span>
            </div>
            
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Farmly Inc. All rights reserved. Platform optimized for modern multi-tenant agriculture. By Ahanaf Mubasshir
            </p>

            <div className="flex space-x-4 text-xs text-muted-foreground">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
