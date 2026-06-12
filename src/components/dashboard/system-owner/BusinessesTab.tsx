'use client';

import React from 'react';
import { Layers, Edit, Pause, Play, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/DataTable';
import { Business } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface BusinessesTabProps {
  businesses: Business[];
  isLoading: boolean;
  onAddClick: () => void;
  openEditModal: (biz: Business) => void;
  onToggleActivation: (id: string, status: 'active' | 'inactive') => void;
  onDelete: (id: string) => void;
}

export default function BusinessesTab({
  businesses,
  isLoading,
  onAddClick,
  openEditModal,
  onToggleActivation,
  onDelete,
}: BusinessesTabProps) {
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
            onClick={() => onToggleActivation(row.id, row.status === 'active' ? 'inactive' : 'active')}
          >
            {row.status === 'active' ? (
              <Pause className="h-3.5 w-3.5 text-amber-500 hover:text-amber-600" />
            ) : (
              <Play className="h-3.5 w-3.5 text-orange-500 hover:text-orange-600" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(row.id)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive hover:text-destructive/90" />
          </Button>
        </div>
      ),
    },
  ];

  return (
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
            onAddClick={onAddClick}
            addLabel="Register Business"
            csvName="businesses-list"
          />
        )}
      </CardContent>
    </Card>
  );
}
