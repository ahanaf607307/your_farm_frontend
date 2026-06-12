'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleSidebar, toggleChat, setNotificationsOpen, selectChatUser } from '@/redux/slices/uiSlice';
import { switchRole, logout } from '@/redux/slices/authSlice';
import { axiosInstance } from '@/lib/axios';
import { Notification, Role } from '@/types';
import { cn } from '@/lib/utils';
import {
  Bell,
  MessageSquare,
  Search,
  Sun,
  Moon,
  Menu,
  LogOut,
  ChevronDown,
  User as UserIcon,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  
  const { user } = useAppSelector((state) => state.auth);
  const { notificationOpen } = useAppSelector((state) => state.ui);

  // Fetch Notifications
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/notifications');
      return res.data;
    },
    refetchInterval: 5000, // Poll notifications every 5s for real-time feel
  });

  // Read Notification Mutation
  const readNotifMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.put(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const handleRoleChange = (role: Role) => {
    dispatch(switchRole(role));
    // Redirect to matching home routing
    if (role === 'SYSTEM_OWNER') router.push('/system-owner');
    else if (role === 'BUSINESS_OWNER') router.push('/business-owner');
    else if (role === 'FARM_MANAGER') router.push('/manager');
    else router.push('/employee');
  };

  // Get Notification Icon
  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'medicine_time':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'food_time':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'task_assigned':
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-orange-500" />;
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'farm_alerts':
        return <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />;
      default:
        return <Bell className="h-4 w-4 text-zinc-500" />;
    }
  };

  if (!user) return null;

  return (
    <header className="h-16 w-full border-b bg-card text-card-foreground px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Search & Mobile toggle */}
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg border hover:bg-muted md:flex hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-sm w-full hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search animals, medicines, logs..."
            className="w-full bg-muted/40 border border-input rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-3.5">
        {/* Development Role Switcher helper */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-orange-500/20 text-orange-600 dark:text-orange-400 bg-orange-500/5 hover:bg-orange-500/10">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                Role: {user.role.replace('_', ' ')}
                <ChevronDown className="h-3 w-3 ml-1.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Demo Role Swapper</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleRoleChange('SYSTEM_OWNER')} className={cn(user.role === 'SYSTEM_OWNER' ? 'bg-accent font-semibold' : '')}>
                1. System Owner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange('BUSINESS_OWNER')} className={cn(user.role === 'BUSINESS_OWNER' ? 'bg-accent font-semibold' : '')}>
                2. Business Owner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange('FARM_MANAGER')} className={cn(user.role === 'FARM_MANAGER' ? 'bg-accent font-semibold' : '')}>
                3. Farm Manager
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange('FARM_EMPLOYEE')} className={cn(user.role === 'FARM_EMPLOYEE' ? 'bg-accent font-semibold' : '')}>
                4. Farm Employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Theme Toggler */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground h-9 w-9"
        >
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:block" />
        </Button>

        {/* Chat Drawer Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleChat())}
          className="text-muted-foreground h-9 w-9 relative"
        >
          <MessageSquare className="h-5 w-5" />
          {/* Static chat notification count trigger */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu open={notificationOpen} onOpenChange={(val) => dispatch(setNotificationsOpen(val))}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-9 w-9 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-[10px] border-2 border-card font-bold">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/20 flex items-center justify-between">
              <span className="font-bold text-sm">Notifications Center</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => readNotifMutation.mutate(notif.id)}
                    className={cn(
                      'p-3 flex gap-3 hover:bg-muted/40 transition-colors cursor-pointer text-xs leading-normal',
                      !notif.read ? 'bg-primary/5 font-medium' : 'text-muted-foreground'
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{getNotifIcon(notif.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className={cn('text-xs font-semibold text-foreground', !notif.read ? '' : 'text-zinc-500')}>{notif.title}</div>
                      <p className="text-2xs text-muted-foreground">{notif.message}</p>
                      <div className="text-3xs text-zinc-500 font-mono mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {!notif.read && (
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenuSeparator className="h-5 w-[1px] bg-border/80" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-orange-500/10 text-primary font-bold text-xs uppercase">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-bold leading-none text-foreground">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground font-mono">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(user.role === 'FARM_EMPLOYEE' ? '/employee/settings' : user.role === 'FARM_MANAGER' ? '/manager/settings' : user.role === 'BUSINESS_OWNER' ? '/business-owner/settings' : '/system-owner/settings')}>
                <UserIcon className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/5">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
