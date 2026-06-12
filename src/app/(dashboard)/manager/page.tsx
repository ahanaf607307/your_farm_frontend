'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { Animal, AnimalCategory, Medicine, FoodItem, Task, User, ScheduleTime, TaskType } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
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
  Sprout,
  Activity,
  ShoppingBag,
  ClipboardList,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Settings,
  ShieldAlert,
  TrendingUp,
  Tag
} from 'lucide-react';

export default function FarmManagerPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'animals');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab('animals');
    }
  }, [searchParams]);

  // Modals state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [animalModalOpen, setAnimalModalOpen] = useState(false);
  const [medModalOpen, setMedModalOpen] = useState(false);
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Forms State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const [aniName, setAniName] = useState('');
  const [aniCatId, setAniCatId] = useState('');
  const [aniQty, setAniQty] = useState(1);
  const [aniAge, setAniAge] = useState('');
  const [aniDate, setAniDate] = useState('');
  const [aniWeight, setAniWeight] = useState(0.0);
  const [aniStatus, setAniStatus] = useState<'healthy' | 'sick' | 'sold' | 'quarantine'>('healthy');
  const [aniSection, setAniSection] = useState('');

  const [medName, setMedName] = useState('');
  const [medAssignType, setMedAssignType] = useState<'animal' | 'category' | 'section'>('category');
  const [medAssignId, setMedAssignId] = useState('');
  const [medSchedule, setMedSchedule] = useState<ScheduleTime[]>(['morning']);
  const [medStock, setMedStock] = useState(10);

  const [foodName, setFoodName] = useState('');
  const [foodAssignType, setFoodAssignType] = useState<'category' | 'section'>('category');
  const [foodAssignId, setFoodAssignId] = useState('');
  const [foodSchedule, setFoodSchedule] = useState<ScheduleTime[]>(['morning']);
  const [foodStock, setFoodStock] = useState(100);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('feed');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  // 1. Fetch Categories
  const { data: categories = [] } = useQuery<AnimalCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      return res.data;
    },
  });

  // 2. Fetch Animals
  const { data: animals = [] } = useQuery<Animal[]>({
    queryKey: ['animals'],
    queryFn: async () => {
      const res = await axiosInstance.get('/animals');
      return res.data;
    },
  });

  // 3. Fetch Medicines
  const { data: medicines = [] } = useQuery<Medicine[]>({
    queryKey: ['medicines'],
    queryFn: async () => {
      const res = await axiosInstance.get('/medicines');
      return res.data;
    },
  });

  // 4. Fetch Food
  const { data: foods = [] } = useQuery<FoodItem[]>({
    queryKey: ['foods'],
    queryFn: async () => {
      const res = await axiosInstance.get('/foods');
      return res.data;
    },
  });

  // 5. Fetch Tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axiosInstance.get('/tasks');
      return res.data;
    },
  });

  // 6. Fetch Employees (for assignees)
  const { data: employees = [] } = useQuery<User[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const stored = localStorage.getItem('mock_users');
      const list: User[] = stored ? JSON.parse(stored) : [];
      return list.filter(u => u.role === 'FARM_EMPLOYEE');
    },
  });

  // Mutations
  const createCatMutation = useMutation({
    mutationFn: async (newCat: Partial<AnimalCategory>) => {
      const res = await axiosInstance.post('/categories', newCat);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCatModalOpen(false);
      setCatName('');
      setCatDesc('');
      toast.success('Category registered.');
    },
  });

  const createAnimalMutation = useMutation({
    mutationFn: async (newAnimal: Partial<Animal>) => {
      const res = await axiosInstance.post('/animals', newAnimal);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setAnimalModalOpen(false);
      resetAnimalForm();
      toast.success('Livestock catalog entry registered.');
    },
  });

  const createMedMutation = useMutation({
    mutationFn: async (newMed: Partial<Medicine>) => {
      const cats = queryClient.getQueryData<AnimalCategory[]>(['categories']) || [];
      const cat = cats.find(c => c.id === medAssignId);
      const anis = queryClient.getQueryData<Animal[]>(['animals']) || [];
      const ani = anis.find(a => a.id === medAssignId);
      
      const payload = {
        ...newMed,
        assignedToName: medAssignType === 'category' ? (cat ? cat.name : 'Category') : medAssignType === 'animal' ? (ani ? ani.name : 'Animal') : medAssignId,
      };

      const res = await axiosInstance.post('/medicines', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      setMedModalOpen(false);
      resetMedForm();
      toast.success('Medicine stock schedule configured.');
    },
  });

  const createFoodMutation = useMutation({
    mutationFn: async (newFood: Partial<FoodItem>) => {
      const cats = queryClient.getQueryData<AnimalCategory[]>(['categories']) || [];
      const cat = cats.find(c => c.id === foodAssignId);
      
      const payload = {
        ...newFood,
        assignedToName: foodAssignType === 'category' ? (cat ? cat.name : 'Category') : foodAssignId,
      };

      const res = await axiosInstance.post('/foods', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      setFoodModalOpen(false);
      resetFoodForm();
      toast.success('Food items registered.');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const res = await axiosInstance.post('/tasks', {
        ...newTask,
        farmId: 'farm-01',
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setTaskModalOpen(false);
      resetTaskForm();
      toast.success('Task generated and assigned to staff.');
    },
  });

  const resetAnimalForm = () => {
    setAniName('');
    setAniCatId('');
    setAniQty(1);
    setAniAge('');
    setAniDate('');
    setAniWeight(0);
    setAniStatus('healthy');
    setAniSection('');
  };

  const resetMedForm = () => {
    setMedName('');
    setMedAssignType('category');
    setMedAssignId('');
    setMedSchedule(['morning']);
    setMedStock(10);
  };

  const resetFoodForm = () => {
    setFoodName('');
    setFoodAssignType('category');
    setFoodAssignId('');
    setFoodSchedule(['morning']);
    setFoodStock(100);
  };

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDesc('');
    setTaskType('feed');
    setTaskAssigneeId('');
    setTaskDueDate('');
  };

  const animalColumns = [
    {
      header: 'Livestock Name',
      accessorKey: 'name',
      sortable: true,
      render: (row: Animal) => (
        <div>
          <div className="font-bold">{row.name}</div>
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-zinc-500 mt-1 inline-block">
            {row.categoryName}
          </span>
        </div>
      ),
    },
    {
      header: 'Quantity',
      accessorKey: 'quantity',
      sortable: true,
      render: (row: Animal) => <span className="font-bold">{row.quantity}</span>,
    },
    {
      header: 'Section',
      accessorKey: 'section',
      sortable: true,
      render: (row: Animal) => <Badge variant="outline" className="text-[10px]">{row.section}</Badge>,
    },
    {
      header: 'Age & Weight',
      accessorKey: 'weight',
      render: (row: Animal) => (
        <div>
          <div>{row.age}</div>
          <div className="text-3xs text-muted-foreground">{row.weight} kg avg</div>
        </div>
      ),
    },
    {
      header: 'Purchase Date',
      accessorKey: 'purchaseDate',
      render: (row: Animal) => <span>{formatDate(row.purchaseDate)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (row: Animal) => {
        let variant: 'success' | 'warning' | 'destructive' | 'info' = 'success';
        if (row.status === 'sick') variant = 'destructive';
        if (row.status === 'quarantine') variant = 'warning';
        if (row.status === 'sold') variant = 'info';
        return <Badge variant={variant} className="text-[10px]">{row.status.toUpperCase()}</Badge>;
      },
    },
  ];

  const medColumns = [
    {
      header: 'Medicine Name',
      accessorKey: 'name',
      sortable: true,
      render: (row: Medicine) => <div className="font-bold">{row.name}</div>,
    },
    {
      header: 'Assignment Target',
      accessorKey: 'assignedToName',
      render: (row: Medicine) => (
        <div>
          <div className="text-xs font-semibold">{row.assignedToName}</div>
          <div className="text-3xs text-muted-foreground capitalize">Scope: {row.assignedType}</div>
        </div>
      ),
    },
    {
      header: 'Schedule',
      accessorKey: 'schedule',
      render: (row: Medicine) => (
        <div className="flex gap-1">
          {row.schedule.map((t, idx) => (
            <Badge key={idx} variant="outline" className="text-[9px] capitalize px-1 py-0.5 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400">
              {t}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Stock Levels',
      accessorKey: 'remainingStock',
      render: (row: Medicine) => (
        <div>
          <div className="font-semibold text-xs">{row.remainingStock} remaining</div>
          <div className="text-3xs text-muted-foreground">Used: {row.usedStock} / Stock: {row.stock}</div>
        </div>
      ),
    },
    {
      header: 'Threshold Status',
      accessorKey: 'status',
      render: (row: Medicine) => {
        const variant = row.status === 'available' ? 'success' : row.status === 'low_stock' ? 'warning' : 'destructive';
        return <Badge variant={variant} className="text-[10px]">{row.status.replace('_', ' ').toUpperCase()}</Badge>;
      },
    },
  ];

  const foodColumns = [
    {
      header: 'Food Item',
      accessorKey: 'name',
      sortable: true,
      render: (row: FoodItem) => <div className="font-bold">{row.name}</div>,
    },
    {
      header: 'Assigned Scope',
      accessorKey: 'assignedToName',
      render: (row: FoodItem) => (
        <div>
          <div className="text-xs font-semibold">{row.assignedToName}</div>
          <div className="text-3xs text-muted-foreground capitalize">Scope: {row.assignedType}</div>
        </div>
      ),
    },
    {
      header: 'Stock Quantity',
      accessorKey: 'stock',
      render: (row: FoodItem) => <span className="font-bold text-xs">{row.stock} kg</span>,
    },
    {
      header: 'Usage Dynamics',
      accessorKey: 'dailyUsage',
      render: (row: FoodItem) => (
        <div>
          <div>Daily: {row.dailyUsage} kg</div>
          <div className="text-3xs text-muted-foreground">Monthly: {row.monthlyUsage} kg</div>
        </div>
      ),
    },
    {
      header: 'Threshold Status',
      accessorKey: 'status',
      render: (row: FoodItem) => {
        const variant = row.status === 'available' ? 'success' : 'warning';
        return <Badge variant={variant} className="text-[10px]">{row.status.replace('_', ' ').toUpperCase()}</Badge>;
      },
    },
  ];

  const taskColumns = [
    {
      header: 'Task Title',
      accessorKey: 'title',
      sortable: true,
      render: (row: Task) => (
        <div>
          <div className="font-bold">{row.title}</div>
          <div className="text-3xs text-muted-foreground max-w-[200px] truncate">{row.description}</div>
        </div>
      ),
    },
    {
      header: 'Category Type',
      accessorKey: 'type',
      sortable: true,
      render: (row: Task) => <Badge variant="outline" className="text-[10px] uppercase">{row.type}</Badge>,
    },
    {
      header: 'Assignee Employee',
      accessorKey: 'assignedToName',
      sortable: true,
      render: (row: Task) => <span>{row.assignedToName}</span>,
    },
    {
      header: 'Due Limit',
      accessorKey: 'dueDate',
      render: (row: Task) => <span className="text-[11px] font-mono">{new Date(row.dueDate).toLocaleDateString()}</span>,
    },
    {
      header: 'Work Status',
      accessorKey: 'status',
      render: (row: Task) => {
        const variant = row.status === 'completed' ? 'success' : row.status === 'in-progress' ? 'warning' : 'info';
        return <Badge variant={variant} className="text-[10px]">{row.status.toUpperCase()}</Badge>;
      },
    },
  ];

  // Auto-calculated low-stock indicators
  const lowStockCount = medicines.filter(m => m.status === 'low_stock' || m.status === 'out_of_stock').length + foods.filter(f => f.status === 'low_stock').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Farm Operations Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage animal categories, medication logs, feed balances, and staff worksheets.
          </p>
        </div>

        {/* Action Widgets */}
        <div className="flex space-x-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setCatModalOpen(true)} className="text-xs">
            <Tag className="h-4 w-4 mr-1.5" /> New Category
          </Button>
        </div>
      </div>

      {/* Stock warning Banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl flex items-center space-x-3 text-xs leading-normal">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
          <span>
            <strong>Inventory threshold alert:</strong> You have {lowStockCount} items (feed/medicine) currently falling below safety thresholds. Check Stock Inventory.
          </span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Livestock Census</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {animals.reduce((acc, cur) => acc + cur.quantity, 0)}
              <span className="text-xs text-muted-foreground ml-1">heads</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Distributed in {categories.length} categories
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Medicine Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {medicines.length} <span className="text-xs text-muted-foreground">Types</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Active vaccine cycles in execution
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Feed Stock Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
              {foods.reduce((acc, cur) => acc + cur.stock, 0)} <span className="text-xs font-normal text-muted-foreground">kg</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Estimated coverage: 12 days
            </p>
          </CardContent>
        </Card>

        <Card className="pb-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Today's Tasks Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {tasks.filter(t => t.status === 'completed').length} / {tasks.length}
            </div>
            <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${tasks.length ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          const params = new URLSearchParams(window.location.search);
          if (val === 'animals') params.delete('tab');
          else params.set('tab', val);
          window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
        }}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 max-w-3xl mb-4">
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="foods">Feeds</TabsTrigger>
          <TabsTrigger value="inventory">Finances</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Tab 1: Animals */}
        <TabsContent value="animals">
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Livestock Registry</CardTitle>
              <CardDescription>Catalog livestock batches, set cages/sections, and register categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={animalColumns}
                data={animals}
                searchKey="name"
                searchPlaceholder="Search animals by name..."
                onAddClick={() => setAnimalModalOpen(true)}
                addLabel="Catalog Animal"
                csvName="livestock-registry"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Medicines */}
        <TabsContent value="medicines">
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Medicine Schedules</CardTitle>
              <CardDescription>Setup medication schedules, assign scopes, and track stock counts.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={medColumns}
                data={medicines}
                searchKey="name"
                searchPlaceholder="Search medicines by name..."
                onAddClick={() => setMedModalOpen(true)}
                addLabel="Configure Medicine"
                csvName="medicine-schedules"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Feeds */}
        <TabsContent value="foods">
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Feeds Inventory</CardTitle>
              <CardDescription>Add food items, map daily feed allowances, and track stock reserves.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={foodColumns}
                data={foods}
                searchKey="name"
                searchPlaceholder="Search feeds by name..."
                onAddClick={() => setFoodModalOpen(true)}
                addLabel="Add Feed Item"
                csvName="feed-inventory"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Finances */}
        <TabsContent value="inventory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Finances: Income Tracking</CardTitle>
                <CardDescription>Income yields from sales logs (e.g. egg sales, milk sales, fish sales).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { source: 'Egg Sales (Vance Poultry)', amount: 4800, date: '2026-06-12' },
                  { source: 'Milk Yield Sales (Vance Cattle)', amount: 3500, date: '2026-06-11' },
                  { source: 'Livestock Sales (Vance Cattle)', amount: 6600, date: '2026-06-09' },
                ].map((inc, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-3 border rounded-lg bg-muted/20">
                    <div>
                      <div className="font-bold">{inc.source}</div>
                      <div className="text-3xs text-muted-foreground font-mono mt-0.5">{inc.date}</div>
                    </div>
                    <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">
                      +{formatCurrency(inc.amount)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Finances: Expenses Log</CardTitle>
                <CardDescription>Operating bills (e.g. feed orders, medicine logs, utilities, salary).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { exp: 'Starter Mash feed bulk order', amount: 2450, category: 'Food' },
                  { exp: 'Newcastle Disease vaccine batch', amount: 800, category: 'Medicine' },
                  { exp: 'Alex Rivera monthly salary', amount: 3200, category: 'Salary' },
                ].map((ex, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-3 border rounded-lg bg-muted/20">
                    <div>
                      <div className="font-bold">{ex.exp}</div>
                      <Badge variant="outline" className="text-[9px] mt-1">{ex.category}</Badge>
                    </div>
                    <span className="font-mono font-semibold text-red-500">
                      -{formatCurrency(ex.amount)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 5: Tasks */}
        <TabsContent value="tasks">
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Tasks Generator</CardTitle>
              <CardDescription>Create automated or custom operational tasks and dispatch them to employee lists.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={taskColumns}
                data={tasks}
                searchKey="title"
                searchPlaceholder="Search tasks by title..."
                onAddClick={() => setTaskModalOpen(true)}
                addLabel="Dispatch Task"
                csvName="tasks-history"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Settings */}
        <TabsContent value="settings">
          <Card className="border bg-card max-w-xl">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal details and account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Manager profile credentials updated successfully.');
                }}
                className="space-y-4 pt-2"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="mgr-name">Manager Name</Label>
                  <Input id="mgr-name" defaultValue="David Carter" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mgr-email">Email Address</Label>
                  <Input id="mgr-email" type="email" defaultValue="david@vancefarms.com" />
                </div>
                <div className="space-y-1.5 pt-2 border-t">
                  <Label htmlFor="mgr-pass">New Password</Label>
                  <Input id="mgr-pass" type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white mt-4">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Category Modal */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Livestock Category</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!catName) return;
              createCatMutation.mutate({ name: catName, description: catDesc, farmId: 'farm-01' });
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Category Title</Label>
              <Input
                id="cat-name"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Broiler, Cow, Sheep"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Input
                id="cat-desc"
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Brief purpose notes"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCatModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Save Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Catalog Animal Modal */}
      <Dialog open={animalModalOpen} onOpenChange={setAnimalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Catalog Livestock Entry</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!aniName || !aniCatId || !aniAge || !aniDate) {
                toast.error('All form fields are required.');
                return;
              }
              createAnimalMutation.mutate({
                name: aniName,
                categoryId: aniCatId,
                quantity: Number(aniQty),
                age: aniAge,
                purchaseDate: aniDate,
                weight: Number(aniWeight),
                status: aniStatus,
                section: aniSection,
                farmId: 'farm-01',
              });
            }}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ani-name">Name / Batch Label</Label>
                <Input id="ani-name" value={aniName} onChange={(e) => setAniName(e.target.value)} placeholder="Broiler Batch #11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ani-cat">Category</Label>
                <select
                  id="ani-cat"
                  value={aniCatId}
                  onChange={(e) => setAniCatId(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="">Choose category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ani-qty">Quantity</Label>
                <Input id="ani-qty" type="number" value={aniQty} onChange={(e) => setAniQty(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ani-weight">Avg Weight (kg)</Label>
                <Input id="ani-weight" type="number" step="0.1" value={aniWeight} onChange={(e) => setAniWeight(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ani-sec">Cage / Section</Label>
                <Input id="ani-sec" value={aniSection} onChange={(e) => setAniSection(e.target.value)} placeholder="Section A" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ani-age">Age Details</Label>
                <Input id="ani-age" value={aniAge} onChange={(e) => setAniAge(e.target.value)} placeholder="e.g., 6 weeks" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ani-date">Purchase Date</Label>
                <Input id="ani-date" type="date" value={aniDate} onChange={(e) => setAniDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ani-status">Livestock Status</Label>
              <select
                id="ani-status"
                value={aniStatus}
                onChange={(e) => setAniStatus(e.target.value as any)}
                className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
              >
                <option value="healthy">Healthy</option>
                <option value="sick">Sick (Requires medicine)</option>
                <option value="quarantine">Quarantine</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAnimalModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Save Livestock</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Configure Medicine Modal */}
      <Dialog open={medModalOpen} onOpenChange={setMedModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Medicine Stock & Schedule</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!medName || !medAssignId) {
                toast.error('All form fields are required.');
                return;
              }
              createMedMutation.mutate({
                name: medName,
                assignedType: medAssignType,
                assignedToId: medAssignId,
                schedule: medSchedule,
                stock: Number(medStock),
                farmId: 'farm-01',
              });
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="med-name">Medicine / Vaccine Name</Label>
              <Input id="med-name" value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Newcastle Vaccine, Paracetamol" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="med-type">Scope Type</Label>
                <select
                  id="med-type"
                  value={medAssignType}
                  onChange={(e) => setMedAssignType(e.target.value as any)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="category">Entire Category</option>
                  <option value="section">Entire Section</option>
                  <option value="animal">Individual Animal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="med-target">Assign Scope Target</Label>
                {medAssignType === 'category' ? (
                  <select
                    id="med-target"
                    value={medAssignId}
                    onChange={(e) => setMedAssignId(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                  >
                    <option value="">Choose category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : medAssignType === 'animal' ? (
                  <select
                    id="med-target"
                    value={medAssignId}
                    onChange={(e) => setMedAssignId(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                  >
                    <option value="">Choose animal batch</option>
                    {animals.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="med-target"
                    value={medAssignId}
                    onChange={(e) => setMedAssignId(e.target.value)}
                    placeholder="e.g. Section B"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Medication Times</Label>
                <div className="flex gap-2 pt-1 text-xs">
                  {(['morning', 'noon', 'evening'] as ScheduleTime[]).map((time) => (
                    <label key={time} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={medSchedule.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) setMedSchedule([...medSchedule, time]);
                          else setMedSchedule(medSchedule.filter(t => t !== time));
                        }}
                      />
                      <span className="capitalize">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="med-stock">Total Stock Bottles/Units</Label>
                <Input id="med-stock" type="number" value={medStock} onChange={(e) => setMedStock(Number(e.target.value))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMedModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Configure Medicine</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Configure Feed Modal */}
      <Dialog open={foodModalOpen} onOpenChange={setFoodModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Feed Item</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!foodName || !foodAssignId) {
                toast.error('All form fields are required.');
                return;
              }
              createFoodMutation.mutate({
                name: foodName,
                assignedType: foodAssignType,
                assignedToId: foodAssignId,
                schedule: foodSchedule,
                stock: Number(foodStock),
                farmId: 'farm-01',
              });
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="food-name">Feed Item Name</Label>
              <Input id="food-name" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Starter Mash, Grower Pellets" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="food-type">Scope Type</Label>
                <select
                  id="food-type"
                  value={foodAssignType}
                  onChange={(e) => setFoodAssignType(e.target.value as any)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="category">Animal Category</option>
                  <option value="section">Farm Section</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="food-target">Assign Scope Target</Label>
                {foodAssignType === 'category' ? (
                  <select
                    id="food-target"
                    value={foodAssignId}
                    onChange={(e) => setFoodAssignId(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                  >
                    <option value="">Choose category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="food-target"
                    value={foodAssignId}
                    onChange={(e) => setFoodAssignId(e.target.value)}
                    placeholder="e.g. Section A"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Feeding Schedule</Label>
                <div className="flex gap-2 pt-1 text-xs">
                  {(['morning', 'noon', 'evening'] as ScheduleTime[]).map((time) => (
                    <label key={time} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={foodSchedule.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) setFoodSchedule([...foodSchedule, time]);
                          else setFoodSchedule(foodSchedule.filter(t => t !== time));
                        }}
                      />
                      <span className="capitalize">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="food-stock">Total Stock (kg)</Label>
                <Input id="food-stock" type="number" value={foodStock} onChange={(e) => setFoodStock(Number(e.target.value))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFoodModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Save Feed Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dispatch Task Modal */}
      <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Dispatch Task to Staff</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!taskTitle || !taskAssigneeId || !taskDueDate) {
                toast.error('All form fields are required.');
                return;
              }
              createTaskMutation.mutate({
                title: taskTitle,
                description: taskDesc,
                type: taskType,
                assignedToId: taskAssigneeId,
                dueDate: new Date(taskDueDate).toISOString(),
              });
            }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Task Title</Label>
              <Input id="task-title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Feed Broiler Category" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-desc">Task Description Details</Label>
              <Input id="task-desc" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="e.g. Empty silos and refill Section A..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="task-type">Task Category</Label>
                <select
                  id="task-type"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as any)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="feed">Feed</option>
                  <option value="medicine">Medicine</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-employee">Assignee Employee</Label>
                <select
                  id="task-employee"
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="">Choose employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-date">Due Limit Time</Label>
              <Input id="task-date" type="datetime-local" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTaskModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Dispatch Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
