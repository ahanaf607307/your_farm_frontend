'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { Task, TaskStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Play,
  Check,
  FileText,
  Camera,
  Image as ImageIcon,
  AlertCircle,
  History,
  Settings,
  Lock,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FarmEmployeePage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || 'tasks';
  const [activeTab, setActiveTab] = useState(tabParam);

  const [activeTaskNotes, setActiveTaskNotes] = useState<Record<string, string>>({});
  const [activeTaskImage, setActiveTaskImage] = useState<Record<string, string>>({});

  // Settings mock states
  const [profileName, setProfileName] = useState('Alex Rivera');
  const [profileEmail, setProfileEmail] = useState('alex@vancefarms.com');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 1. Fetch employee tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', 'employee'],
    queryFn: async () => {
      const res = await axiosInstance.get('/tasks');
      return res.data.filter((t: Task) => t.assignedToId === 'user-emp');
    },
  });

  // Update Task Mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status, notes, imageUrl }: { id: string; status: TaskStatus; notes?: string; imageUrl?: string }) => {
      const res = await axiosInstance.put(`/tasks/${id}`, {
        status,
        notes,
        imageUrl,
      });
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'employee'] });
      toast.success(`Task status updated to ${updated.status}.`);
    },
  });

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateTaskMutation.mutate({
      id,
      status,
      notes: activeTaskNotes[id] || undefined,
      imageUrl: activeTaskImage[id] || undefined,
    });
  };

  const handleSimulatePhoto = (id: string) => {
    const mockImageUrls = [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
      'https://images.unsplash.com/photo-1545464191-ffbf7e231189?w=400',
      'https://images.unsplash.com/photo-1574359411659-15573a27f812?w=400',
    ];
    const randomUrl = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    setActiveTaskImage((prev) => ({ ...prev, [id]: randomUrl }));
    toast.info('Simulated camera capture: photo attached.');
  };

  const getTaskBadgeColor = (type: string) => {
    switch (type) {
      case 'feed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'medicine':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'vaccination':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'cleaning':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';
    }
  };

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const progressTasks = tasks.filter((t) => t.status === 'in-progress');

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Employee Workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Access your scheduled tasks, check work history, and configure your profile settings.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Today's Assigned Tasks</CardTitle>
            <ClipboardList className="h-4.5 w-4.5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{tasks.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {progressTasks.length} currently flagged in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {completedTasks.length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Great job! Keep the farm healthy.
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Pending Tasks</CardTitle>
            <Clock className="h-4.5 w-4.5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {pendingTasks.length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Requires attention before shift end
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conditional Rendering based on activeTab */}
      {activeTab === 'tasks' && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-emerald-500" /> Task Cards Checklist
          </h2>
          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-400">Loading worksheets...</div>
          ) : tasks.filter(t => t.status !== 'completed').length === 0 ? (
            <div className="border border-dashed py-16 text-center text-sm text-muted-foreground rounded-2xl bg-card">
              You don't have any pending tasks assigned for today! Good job!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.filter(t => t.status !== 'completed').map((task) => (
                <Card key={task.id} className="border bg-card hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('text-[9px] uppercase font-bold', getTaskBadgeColor(task.type))}>
                            {task.type}
                          </Badge>
                          <Badge variant={task.status === 'in-progress' ? 'warning' : 'secondary'} className="text-[9px]">
                            {task.status.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-bold mt-2">{task.title}</CardTitle>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Due: {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs leading-normal">
                      <p className="text-muted-foreground">{task.description}</p>
                      
                      <div className="space-y-3 border-t pt-4">
                        <div className="space-y-1.5">
                          <Label htmlFor={`notes-${task.id}`} className="text-3xs text-muted-foreground">Checklist Notes / Log</Label>
                          <Input
                            id={`notes-${task.id}`}
                            value={activeTaskNotes[task.id] || ''}
                            onChange={(e) =>
                              setActiveTaskNotes((prev) => ({ ...prev, [task.id]: e.target.value }))
                            }
                            placeholder="Describe feed refilled, logs registered"
                            className="text-xs h-8"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSimulatePhoto(task.id)}
                            className="text-2xs h-7 px-2"
                          >
                            <Camera className="h-3 w-3 mr-1" /> Attach Live Photo
                          </Button>
                          {activeTaskImage[task.id] && (
                            <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-mono">
                              <ImageIcon className="h-3.5 w-3.5" /> attached.jpg
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  
                  <CardFooter className="border-t pt-3 flex justify-end gap-2 bg-muted/10">
                    {task.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(task.id, 'in-progress')}
                        className="text-2xs h-8"
                      >
                        <Play className="h-3.5 w-3.5 mr-1" /> Start Task
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-2xs h-8"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Complete Task
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-500" /> Completed Tasks History
          </h2>
          {completedTasks.length === 0 ? (
            <div className="border border-dashed py-16 text-center text-sm text-muted-foreground rounded-2xl bg-card">
              No completed tasks logged in your history folder.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedTasks.map((task) => (
                <Card key={task.id} className="border border-emerald-500/20 bg-emerald-500/2 dark:bg-emerald-500/1 flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={cn('text-[9px] uppercase font-bold', getTaskBadgeColor(task.type))}>
                        {task.type}
                      </Badge>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Done: {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-bold mt-2">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs leading-normal">
                    <p className="text-muted-foreground">{task.description}</p>
                    
                    {(task.notes || task.imageUrl) && (
                      <div className="bg-card border p-3 rounded-lg space-y-2">
                        {task.notes && (
                          <div className="flex items-start gap-1.5 text-2xs">
                            <FileText className="h-3.5 w-3.5 text-zinc-400 mt-0.5 shrink-0" />
                            <span><strong>Report:</strong> {task.notes}</span>
                          </div>
                        )}
                        {task.imageUrl && (
                          <div className="flex items-center gap-1.5 text-2xs">
                            <ImageIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <a href={task.imageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                              View attached photo
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-xl">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-emerald-500" /> Account & Profile Settings
          </h2>
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle>Modify Profile Details</CardTitle>
              <CardDescription>Update your email address or change your system login password.</CardDescription>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Profile credentials updated successfully.');
                setNewPassword('');
              }}
              className="space-y-4 p-6 pt-0"
            >
              <div className="space-y-1.5">
                <Label htmlFor="prof-name">Staff Name</Label>
                <Input id="prof-name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-email">Email Address</Label>
                <Input id="prof-email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5 pt-2 border-t">
                <Label htmlFor="prof-pass" className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-zinc-500" /> Change Password
                </Label>
                <Input
                  id="prof-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Type new secure password"
                />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto pt-2 mt-4">
                Save Account Changes
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
