'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { Business } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Play,
  Pause,
  Edit,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function SystemOwnerPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<'today' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);

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

  const columns = [
    {
      header: 'Business Name',
      accessorKey: 'name',
      sortable: true,
      render: (row: Business) => (
        <div>
          <div className="font-bold text-foreground">{row.name}</div>
          <div className="text-3xs text-muted-foreground font-mono">ID: {row.id}</div>
        </div>
      ),
    },
    {
      header: 'Owner',
      accessorKey: 'ownerName',
      sortable: true,
      render: (row: Business) => (
        <div>
          <div>{row.ownerName}</div>
          <div className="text-3xs text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Subscription',
      accessorKey: 'subscriptionType',
      sortable: true,
      render: (row: Business) => (
        <Badge
          variant={
            row.subscriptionType === 'Enterprise'
              ? 'default'
              : row.subscriptionType === 'Standard'
              ? 'info'
              : 'secondary'
          }
          className="text-[10px]"
        >
          {row.subscriptionType}
        </Badge>
      ),
    },
    {
      header: 'Farms Count',
      accessorKey: 'totalFarms',
      sortable: true,
      render: (row: Business) => (
        <div className="flex items-center space-x-1">
          <Layers className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-semibold">{row.totalFarms}</span>
        </div>
      ),
    },
    {
      header: 'Monthly Revenue',
      accessorKey: 'monthlyRevenue',
      sortable: true,
      render: (row: Business) => (
        <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">
          {formatCurrency(row.monthlyRevenue)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row: Business) => (
        <Badge variant={row.status === 'active' ? 'success' : 'destructive'} className="text-[10px]">
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      render: (row: Business) => (
        <div className="flex items-center space-x-1.5">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(row)}>
            <Edit className="h-3.5 w-3.5 text-zinc-500 hover:text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              toggleActivationMutation.mutate({
                id: row.id,
                status: row.status === 'active' ? 'inactive' : 'active',
              })
            }
          >
            {row.status === 'active' ? (
              <Pause className="h-3.5 w-3.5 text-amber-500 hover:text-amber-600" />
            ) : (
              <Play className="h-3.5 w-3.5 text-orange-500 hover:text-orange-600" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteMutation.mutate(row.id)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive hover:text-destructive/90" />
          </Button>
        </div>
      ),
    },
  ];

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

        {/* Time Filters */}
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

      {/* Analytics Charts (Mock SVG layout) */}
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
            {/* Draw grid SVG line */}
            <svg className="absolute inset-x-6 bottom-16 h-36 w-[calc(100%-3rem)] text-primary overflow-visible">
              <path
                d="M0,120 Q50,90 100,80 T200,60 T300,40 T400,20 T500,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                className="drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)]"
              />
              {/* Highlight Dot */}
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

      {/* Businesses Table */}
      <Card className="border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Businesses Registry</CardTitle>
          <CardDescription>Activate, edit details, or suspend tenant databases.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-400">Loading business directories...</div>
          ) : (
            <DataTable
              columns={columns}
              data={businesses}
              searchKey="name"
              searchPlaceholder="Search businesses by name..."
              onAddClick={() => {
                resetForm();
                setCreateModalOpen(true);
              }}
              addLabel="Register Business"
              csvName="businesses-list"
            />
          )}
        </CardContent>
      </Card>

      {/* Register Business Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Tenant Business</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="biz-name">Business / Company Name</Label>
              <Input
                id="biz-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Apex Cattle Breeders"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="biz-owner">Owner Full Name</Label>
              <Input
                id="biz-owner"
                value={formOwner}
                onChange={(e) => setFormOwner(e.target.value)}
                placeholder="John Jenkins"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="biz-email">Owner Email Address</Label>
              <Input
                id="biz-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="john@jenkins.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="biz-sub">Subscription Tier</Label>
              <select
                id="biz-sub"
                value={formSub}
                onChange={(e) => setFormSub(e.target.value as any)}
                className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
              >
                <option value="Basic">Basic ($49/mo)</option>
                <option value="Standard">Standard ($99/mo)</option>
                <option value="Enterprise">Enterprise ($199/mo)</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                Submit Registration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Business Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modify Business credentials</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-biz-name">Business / Company Name</Label>
              <Input
                id="edit-biz-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-biz-owner">Owner Full Name</Label>
              <Input
                id="edit-biz-owner"
                value={formOwner}
                onChange={(e) => setFormOwner(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-biz-email">Owner Email Address</Label>
              <Input
                id="edit-biz-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-biz-sub">Subscription Tier</Label>
              <select
                id="edit-biz-sub"
                value={formSub}
                onChange={(e) => setFormSub(e.target.value as any)}
                className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
              >
                <option value="Basic">Basic ($49/mo)</option>
                <option value="Standard">Standard ($99/mo)</option>
                <option value="Enterprise">Enterprise ($199/mo)</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
