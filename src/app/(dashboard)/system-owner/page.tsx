'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { Business } from '@/types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Sub-components
import AnalyticsTab from '@/components/dashboard/system-owner/AnalyticsTab';
import BusinessesTab from '@/components/dashboard/system-owner/BusinessesTab';
import SubscriptionsTab from '@/components/dashboard/system-owner/SubscriptionsTab';
import UsersTab from '@/components/dashboard/system-owner/UsersTab';
import SettingsTab from '@/components/dashboard/system-owner/SettingsTab';
import BusinessDialogs from '@/components/dashboard/system-owner/BusinessDialogs';

export default function SystemOwnerPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'businesses' | 'analytics' | 'subscriptions' | 'users' | 'settings' | null;
  
  const [activeTab, setActiveTab] = useState<'businesses' | 'analytics' | 'subscriptions' | 'users' | 'settings'>(
    tabParam === 'businesses' || tabParam === 'subscriptions' || tabParam === 'users' || tabParam === 'settings' ? tabParam : 'analytics'
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'businesses' || tab === 'analytics' || tab === 'subscriptions' || tab === 'users' || tab === 'settings') {
      setActiveTab(tab as any);
    } else {
      setActiveTab('analytics');
    }
  }, [searchParams]);

  const [activeFilter, setActiveFilter] = useState<'today' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);

  // Settings Form Mock State
  const [sysName, setSysName] = useState('Farmly System');
  const [sysEmail, setSysEmail] = useState('support@farmly.com');
  const [sysMaint, setSysMaint] = useState(false);
  const [sysTrial, setSysTrial] = useState(14);

  // Form State
  const [formName, setFormName] = useState('');
  const [formOwner, setFormOwner] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSub, setFormSub] = useState<'Basic' | 'Standard' | 'Enterprise'>('Basic');

  // Fetch Businesses
  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ['businesses'],
    queryFn: async () => {
      const res = await axiosInstance.get('/businesses');
      return res.data;
    },
  });

  // Create Business Mutation
  const createMutation = useMutation({
    mutationFn: async (newBiz: Partial<Business>) => {
      const res = await axiosInstance.post('/businesses', newBiz);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      setCreateModalOpen(false);
      resetForm();
      toast.success('Tenant business registered successfully.');
    },
  });

  // Edit Business Mutation
  const editMutation = useMutation({
    mutationFn: async (updated: Partial<Business>) => {
      const res = await axiosInstance.put(`/businesses/${selectedBiz?.id}`, updated);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      setEditModalOpen(false);
      resetForm();
      toast.success('Business credentials updated.');
    },
  });

  // Toggle Activation Mutation
  const toggleActivationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      const res = await axiosInstance.put(`/businesses/${id}`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success(`Business ${variables.status === 'active' ? 'activated' : 'deactivated'}.`);
    },
  });

  // Delete Business Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/businesses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Tenant business deleted.');
    },
  });

  const resetForm = () => {
    setFormName('');
    setFormOwner('');
    setFormEmail('');
    setFormSub('Basic');
    setSelectedBiz(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formOwner || !formEmail) {
      toast.error('All form fields are required.');
      return;
    }
    createMutation.mutate({
      name: formName,
      ownerName: formOwner,
      email: formEmail,
      subscriptionType: formSub,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBiz) return;
    editMutation.mutate({
      name: formName,
      ownerName: formOwner,
      email: formEmail,
      subscriptionType: formSub,
    });
  };

  const openEditModal = (biz: Business) => {
    setSelectedBiz(biz);
    setFormName(biz.name);
    setFormOwner(biz.ownerName);
    setFormEmail(biz.email);
    setFormSub(biz.subscriptionType);
    setEditModalOpen(true);
  };

  // Dynamic calculations based on time filters
  const getStats = () => {
    const factor = activeFilter === 'today' ? 0.05 : activeFilter === 'weekly' ? 0.25 : activeFilter === 'yearly' ? 12 : 1;
    const baseRevenue = 25550 * factor;
    const baseReg = Math.max(1, Math.round(12 * factor));
    
    return {
      revenue: baseRevenue,
      registrations: baseReg,
      activeBiz: businesses.filter(b => b.status === 'active').length,
      totalBiz: businesses.length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Owner Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Oversee tenant business directories, subscription tiers, and monthly gross analytics.
          </p>
        </div>
      </div>

      {/* Tabs control */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as any);
          const params = new URLSearchParams(window.location.search);
          if (val === 'analytics') params.delete('tab');
          else params.set('tab', val);
          window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
        }}
        className="w-full"
      >
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsTab activeFilter={activeFilter} setActiveFilter={setActiveFilter} stats={stats} />
        </TabsContent>

        <TabsContent value="businesses" className="space-y-6">
          <BusinessesTab
            businesses={businesses}
            isLoading={isLoading}
            onAddClick={() => {
              resetForm();
              setCreateModalOpen(true);
            }}
            openEditModal={openEditModal}
            onToggleActivation={(id, status) => toggleActivationMutation.mutate({ id, status })}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <SubscriptionsTab />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsTab
            sysName={sysName}
            setSysName={setSysName}
            sysEmail={sysEmail}
            setSysEmail={setSysEmail}
            sysTrial={sysTrial}
            setSysTrial={setSysTrial}
            sysMaint={sysMaint}
            setSysMaint={setSysMaint}
          />
        </TabsContent>
      </Tabs>

      {/* Modals Dialogs wrapper */}
      <BusinessDialogs
        createModalOpen={createModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        formName={formName}
        setFormName={setFormName}
        formOwner={formOwner}
        setFormOwner={setFormOwner}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
        formSub={formSub}
        setFormSub={setFormSub}
        handleCreateSubmit={handleCreateSubmit}
        handleEditSubmit={handleEditSubmit}
      />
    </div>
  );
}
