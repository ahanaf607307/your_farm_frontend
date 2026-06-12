'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleSidebar } from '@/redux/slices/uiSlice';
import { cn } from '@/lib/utils';
import {
  Sprout,
  LayoutDashboard,
  Briefcase,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  Activity,
  Tags,
  Calendar,
  Layers,
  ShoppingBag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  History,
  MessageSquare
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarExpanded } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  // Define menu items based on role
  const getMenuItems = () => {
    switch (user.role) {
      case 'SYSTEM_OWNER':
        return [
          { label: 'Businesses', path: '/system-owner', icon: Briefcase },
          { label: 'System Analytics', path: '/system-owner?tab=analytics', icon: TrendingUp },
          { label: 'Subscriptions', path: '/system-owner?tab=subscriptions', icon: CreditCard },
          { label: 'User Registry', path: '/system-owner?tab=users', icon: Users },
          { label: 'Global Settings', path: '/system-owner?tab=settings', icon: Settings },
        ];
      case 'BUSINESS_OWNER':
        return [
          { label: 'Farms Control', path: '/business-owner', icon: LayoutDashboard },
          { label: 'Employee Registry', path: '/business-owner?tab=staff', icon: Users },
          { label: 'Financial Reports', path: '/business-owner?tab=finances', icon: DollarSign },
          { label: 'Farm Settings', path: '/business-owner?tab=settings', icon: Settings },
        ];
      case 'FARM_MANAGER':
        return [
          { label: 'Farm Overview', path: '/manager', icon: LayoutDashboard },
          { label: 'Categories', path: '/manager?tab=animals', icon: Tags },
          { label: 'Animals Registry', path: '/manager?tab=animals', icon: Sprout },
          { label: 'Medicine Tracker', path: '/manager?tab=medicines', icon: Activity },
          { label: 'Food Schedule', path: '/manager?tab=foods', icon: ShoppingBag },
          { label: 'Stock Inventory', path: '/manager?tab=inventory', icon: Layers },
          { label: 'Expenses & Income', path: '/manager?tab=inventory', icon: DollarSign },
          { label: 'Tasks Generator', path: '/manager?tab=tasks', icon: ClipboardList },
          { label: 'Settings', path: '/manager?tab=settings', icon: Settings },
        ];
      case 'FARM_EMPLOYEE':
        return [
          { label: 'Assigned Tasks', path: '/employee', icon: ClipboardList },
          { label: 'Tasks Logs', path: '/employee?tab=history', icon: History },
          { label: 'Profile Settings', path: '/employee?tab=settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-card text-card-foreground transition-all duration-300 relative h-screen',
        sidebarExpanded ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="p-2 bg-orange-500/10 rounded-lg text-primary shrink-0">
            <Sprout className="h-5 w-5" />
          </div>
          {sidebarExpanded && (
            <span className="font-extrabold text-lg bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
              Farmly
            </span>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path.split('?')[0];
          return (
            <Link
              key={index}
              href={item.path}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                isActive
                  ? 'bg-orange-500/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-primary' : '')} />
              {sidebarExpanded ? (
                <span className="whitespace-nowrap transition-opacity duration-300">{item.label}</span>
              ) : (
                <span className="absolute left-16 bg-zinc-950 text-white text-2xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50 pointer-events-none">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Minimize trigger */}
      <div className="p-4 border-t flex justify-end">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg border bg-muted/40 hover:bg-muted text-muted-foreground transition-colors"
        >
          {sidebarExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
