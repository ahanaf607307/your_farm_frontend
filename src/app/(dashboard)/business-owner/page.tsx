'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { Farm, User, FarmType } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Layers,
  Users,
  DollarSign,
  Plus,
  Trash2,
  TrendingUp,
  MapPin,
  Briefcase,
  UserCheck
} from 'lucide-react';

export default function BusinessOwnerPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'farms' | 'staff' | 'finances' | 'settings' | null;
  const [activeTab, setActiveTab] = useState<'farms' | 'staff' | 'finances' | 'settings'>(
    tabParam === 'staff' || tabParam === 'finances' || tabParam === 'settings' ? tabParam : 'farms'
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'staff' || tab === 'farms' || tab === 'finances' || tab === 'settings') {
      setActiveTab(tab as any);
    } else {
      setActiveTab('farms');
    }
  }, [searchParams]);



  // Farm Settings Form State
  const [bizGroupName, setBizGroupName] = useState('Vance Agricultural Group');
  const [bizOwnerName, setBizOwnerName] = useState('Robert Vance');
  const [bizEmail, setBizEmail] = useState('robert@vancefarms.com');
  const [bizAddress, setBizAddress] = useState('Valley Region, Sector B');
  const [bizTimezone, setBizTimezone] = useState('GMT+6');
  
  // Modals state
  const [farmModalOpen, setFarmModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);

  // Farm Form State
  const [farmName, setFarmName] = useState('');
  const [farmType, setFarmType] = useState<FarmType>('POULTRY');
  const [farmLoc, setFarmLoc] = useState('');

  // Staff Form State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<'FARM_MANAGER' | 'FARM_EMPLOYEE'>('FARM_MANAGER');
  const [staffFarmId, setStaffFarmId] = useState('');

  // 1. Fetch Farms
  const { data: farms = [], isLoading: farmsLoading } = useQuery<Farm[]>({
    queryKey: ['farms'],
    queryFn: async () => {
      const res = await axiosInstance.get('/farms');
      return res.data;
    },
  });

  // 2. Fetch Users (staff)
  const { data: users = [], isLoading: staffLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      // In mock DB, we query users
      const stored = localStorage.getItem('mock_users');
      return stored ? JSON.parse(stored) : [];
    },
  });

  // Mutations
  const createFarmMutation = useMutation({
    mutationFn: async (newFarm: Partial<Farm>) => {
      const res = await axiosInstance.post('/farms', newFarm);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      setFarmModalOpen(false);
      resetFarmForm();
      toast.success('New farm division added successfully.');
    },
  });

  const createStaffMutation = useMutation({
    mutationFn: async (newStaff: any) => {
      const stored = localStorage.getItem('mock_users');
      const list = stored ? JSON.parse(stored) : [];
      const userObj = {
        id: `user-${Date.now()}`,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        businessId: 'biz-01',
        farmId: newStaff.farmId || undefined,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('mock_users', JSON.stringify([...list, userObj]));
      return userObj;
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Update Employee counts on corresponding farm in mock list
      if (newUser.farmId) {
        const farmList: Farm[] = JSON.parse(localStorage.getItem('mock_farms') || '[]');
        const idx = farmList.findIndex(f => f.id === newUser.farmId);
        if (idx !== -1) {
          if (newUser.role === 'FARM_MANAGER') farmList[idx].managersCount += 1;
          else farmList[idx].employeesCount += 1;
          localStorage.setItem('mock_farms', JSON.stringify(farmList));
          queryClient.invalidateQueries({ queryKey: ['farms'] });
        }
      }

      setStaffModalOpen(false);
      resetStaffForm();
      toast.success('Workspace staff profile registered.');
    },
  });

  const deleteFarmMutation = useMutation({
    mutationFn: async (id: string) => {
      const farmList: Farm[] = JSON.parse(localStorage.getItem('mock_farms') || '[]');
      localStorage.setItem('mock_farms', JSON.stringify(farmList.filter(f => f.id !== id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success('Farm division removed.');
    },
  });

  const resetFarmForm = () => {
    setFarmName('');
    setFarmType('POULTRY');
    setFarmLoc('');
  };

  const resetStaffForm = () => {
    setStaffName('');
    setStaffEmail('');
    setStaffRole('FARM_MANAGER');
    setStaffFarmId('');
  };

  const handleFarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !farmLoc) {
      toast.error('Please enter name and location.');
      return;
    }
    createFarmMutation.mutate({
      name: farmName,
      type: farmType,
      location: farmLoc,
      businessId: 'biz-01',
    });
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) {
      toast.error('All staff fields are required.');
      return;
    }
    createStaffMutation.mutate({
      name: staffName,
      email: staffEmail,
      role: staffRole,
      farmId: staffFarmId,
    });
  };

  const farmColumns = [
    {
      header: 'Farm Name',
      accessorKey: 'name',
      sortable: true,
      render: (row: Farm) => (
        <div>
          <div className="font-bold text-foreground">{row.name}</div>
          <div className="text-3xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" /> {row.location}
          </div>
        </div>
      ),
    },
    {
      header: 'Farm Category',
      accessorKey: 'type',
      sortable: true,
      render: (row: Farm) => (
        <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
          {row.type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Managers Assigned',
      accessorKey: 'managersCount',
      render: (row: Farm) => (
        <div className="flex items-center space-x-1.5">
          <UserCheck className="h-4 w-4 text-blue-500" />
          <span className="font-bold">{row.managersCount}</span>
        </div>
      ),
    },
    {
      header: 'Employees',
      accessorKey: 'employeesCount',
      render: (row: Farm) => (
        <div className="flex items-center space-x-1.5">
          <Users className="h-4 w-4 text-zinc-500" />
          <span className="font-bold">{row.employeesCount}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row: Farm) => (
        <Badge variant={row.status === 'active' ? 'success' : 'destructive'} className="text-[10px]">
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      render: (row: Farm) => (
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/5" onClick={() => deleteFarmMutation.mutate(row.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  const staffColumns = [
    {
      header: 'Staff Name',
      accessorKey: 'name',
      sortable: true,
      render: (row: User) => (
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-full bg-emerald-500/10 text-primary flex items-center justify-center font-bold text-xs">
            {row.name[0]}
          </div>
          <div>
            <div className="font-bold">{row.name}</div>
            <div className="text-3xs text-muted-foreground font-mono">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      accessorKey: 'role',
      sortable: true,
      render: (row: User) => (
        <Badge variant={row.role === 'FARM_MANAGER' ? 'default' : 'secondary'} className="text-[10px]">
          {row.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Assigned Farm Division',
      accessorKey: 'farmId',
      render: (row: User) => {
        const targetFarm = farms.find((f) => f.id === row.farmId);
        return (
          <span className="font-medium text-xs">
            {targetFarm ? targetFarm.name : 'Not Assigned'}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row: User) => (
        <Badge variant="success" className="text-[10px]">
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Business Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Supervise farm structures, check financials, and organize employee assignments.
          </p>
        </div>
      </div>

      {/* Tabs list for farms, staff registry, finances, and settings */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as any);
          const params = new URLSearchParams(window.location.search);
          if (val === 'farms') params.delete('tab');
          else params.set('tab', val);
          window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
        }}
        className="w-full"
      >


        <TabsContent value="farms" className="space-y-6">
          {/* Summary Cards for Farms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Total Farms Managed</CardTitle>
                <Layers className="h-4.5 w-4.5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{farms.length}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {farms.filter((f) => f.status === 'active').length} divisions actively logging details
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Total Staff Employees</CardTitle>
                <Users className="h-4.5 w-4.5 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">
                  {users.filter((u) => u.role === 'FARM_EMPLOYEE').length}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    (+{users.filter((u) => u.role === 'FARM_MANAGER').length} managers)
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Active communication channels open
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Operating Net Profit</CardTitle>
                <DollarSign className="h-4.5 w-4.5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
                  {formatCurrency(6490)}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" /> +6.5% yield index growth
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Farms Registry</CardTitle>
              <CardDescription>Add new farm divisions, monitor managers count, or check locations.</CardDescription>
            </CardHeader>
            <CardContent>
              {farmsLoading ? (
                <div className="py-12 text-center text-xs text-zinc-400">Loading farms...</div>
              ) : (
                <DataTable
                  columns={farmColumns}
                  data={farms}
                  searchKey="name"
                  searchPlaceholder="Search farms by name..."
                  onAddClick={() => setFarmModalOpen(true)}
                  addLabel="Register Farm"
                  csvName="farms-registry"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Workspace Staff</CardTitle>
              <CardDescription>Register farm managers and employees, select their role, and assign divisions.</CardDescription>
            </CardHeader>
            <CardContent>
              {staffLoading ? (
                <div className="py-12 text-center text-xs text-zinc-400">Loading staff registry...</div>
              ) : (
                <DataTable
                  columns={staffColumns}
                  data={users.filter(u => u.role === 'FARM_MANAGER' || u.role === 'FARM_EMPLOYEE')}
                  searchKey="name"
                  searchPlaceholder="Search staff by name..."
                  onAddClick={() => setStaffModalOpen(true)}
                  addLabel="Register Staff"
                  csvName="staff-registry"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Monthly Operating Expense</CardTitle>
                <DollarSign className="h-4.5 w-4.5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-red-500">{formatCurrency(8450)}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Includes feed bulk orders and staff payroll
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Operating Net Profit</CardTitle>
                <DollarSign className="h-4.5 w-4.5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
                  {formatCurrency(6490)}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" /> +6.5% yield index growth
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Chart & Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Income vs Expense Consolidation</CardTitle>
                <CardDescription>Consolidated metrics across all active operations.</CardDescription>
              </CardHeader>
              <CardContent className="h-56 flex items-end justify-between px-6 pb-6 pt-4">
                {[
                  { label: 'Jan', inc: 8, exp: 5 },
                  { label: 'Feb', inc: 9, exp: 6 },
                  { label: 'Mar', inc: 11, exp: 7 },
                  { label: 'Apr', inc: 10, exp: 8 },
                  { label: 'May', inc: 13, exp: 8 },
                  { label: 'Jun', inc: 15, exp: 8.4 },
                ].map((d, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex items-end justify-center space-x-1.5 w-full h-32">
                      <div className="w-3 bg-orange-500 rounded-t-sm" style={{ height: `${(d.inc / 18) * 100}%` }} />
                      <div className="w-3 bg-red-400 rounded-t-sm" style={{ height: `${(d.exp / 18) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1">{d.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Farm Yield performance list */}
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Yield Performance Rate</CardTitle>
                <CardDescription>Efficiency rating by farm divisions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Vance Poultry Division', type: 'Poultry', rating: 94 },
                  { name: 'Vance Cattle Ranch', type: 'Cattle', rating: 88 },
                  { name: 'Vance Fish Estuary', type: 'Fish', rating: 76 },
                ].map((f, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground truncate max-w-[170px]">{f.name}</span>
                      <span className="text-orange-500 font-semibold">{f.rating}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: `${f.rating}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Finance Transaction Logs */}
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Transaction Logs</CardTitle>
              <CardDescription>Recent operating expenses and income records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { source: 'Egg Sales Yield (Vance Poultry)', amount: 4800, date: '2026-06-12', type: 'income' },
                { source: 'Bulk Chicken Feed Purchase', amount: -2500, date: '2026-06-10', type: 'expense' },
                { source: 'Milk Yield Sales (Vance Cattle)', amount: 3500, date: '2026-06-08', type: 'income' },
                { source: 'Livestock Vaccine Package Order', amount: -1200, date: '2026-06-05', type: 'expense' },
              ].map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-3 border rounded-lg bg-muted/20">
                  <div>
                    <div className="font-bold">{tx.source}</div>
                    <div className="text-3xs text-muted-foreground font-mono mt-0.5">{tx.date}</div>
                  </div>
                  <span className={cn('font-mono font-semibold', tx.type === 'income' ? 'text-orange-600 dark:text-orange-400' : 'text-red-500')}>
                    {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border bg-card max-w-xl">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Farm & Group Settings</CardTitle>
              <CardDescription>Configure business registration details, addresses, and timezones.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Farm configuration settings updated.');
                }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="set-biz-name">Business / Company Group Name</Label>
                  <Input id="set-biz-name" value={bizGroupName} onChange={(e) => setBizGroupName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="set-biz-owner">Owner Full Name</Label>
                  <Input id="set-biz-owner" value={bizOwnerName} onChange={(e) => setBizOwnerName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="set-biz-email">Contact Email Address</Label>
                  <Input id="set-biz-email" type="email" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="set-biz-addr">Primary Headquarters Address</Label>
                  <Input id="set-biz-addr" value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="set-biz-tz">System Timezone</Label>
                  <select
                    id="set-biz-tz"
                    value={bizTimezone}
                    onChange={(e) => setBizTimezone(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                  >
                    <option value="GMT+6">Bangladesh (GMT+6)</option>
                    <option value="EST">United States (EST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">
                  Save Settings Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Register Farm Modal */}
      <Dialog open={farmModalOpen} onOpenChange={setFarmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Farm Division</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFarmSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="farm-name">Farm Name / Title</Label>
              <Input
                id="farm-name"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g. Vance Goat Barn #3"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="farm-type">Farm Type</Label>
              <select
                id="farm-type"
                value={farmType}
                onChange={(e) => setFarmType(e.target.value as FarmType)}
                className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
              >
                <option value="POULTRY">Poultry Farm</option>
                <option value="DAIRY">Dairy Farm</option>
                <option value="GOAT">Goat Farm</option>
                <option value="FISH">Fish Farm</option>
                <option value="DUCK">Duck Farm</option>
                <option value="BIRD">Bird Farm</option>
                <option value="CATTLE">Cattle Farm</option>
                <option value="SHEEP">Sheep Farm</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="farm-loc">Geographical Location</Label>
              <Input
                id="farm-loc"
                value={farmLoc}
                onChange={(e) => setFarmLoc(e.target.value)}
                placeholder="Valley Region, Sector B"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setFarmModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                Register Farm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Staff Modal */}
      <Dialog open={staffModalOpen} onOpenChange={setStaffModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Workspace Staff</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStaffSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="staff-name">Staff Name</Label>
              <Input
                id="staff-name"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Jake Harper"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-email">Email Address</Label>
              <Input
                id="staff-email"
                type="email"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                placeholder="jake@vancefarms.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-role">Access Role</Label>
              <select
                id="staff-role"
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as any)}
                className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
              >
                <option value="FARM_MANAGER">Farm Manager</option>
                <option value="FARM_EMPLOYEE">Farm Employee</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-farm">Assign Farm Division</Label>
              <select
                id="staff-farm"
                value={staffFarmId}
                onChange={(e) => setStaffFarmId(e.target.value)}
                className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
              >
                <option value="">Unassigned</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.type})
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setStaffModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                Add Staff Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}







