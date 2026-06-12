'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/shared/DataTable';
import { formatDate } from '@/lib/utils';

export default function UsersTab() {
  const columns = [
    { header: 'Full Name', accessorKey: 'name', sortable: true },
    { header: 'Email Address', accessorKey: 'email', sortable: true },
    {
      header: 'Access Role',
      accessorKey: 'role',
      sortable: true,
      render: (row: any) => <Badge variant="secondary">{row.role.replace('_', ' ')}</Badge>,
    },
    {
      header: 'Created Date',
      accessorKey: 'createdAt',
      render: (row: any) => formatDate(row.createdAt),
    },
  ];

  const userData = [
    { name: 'System Admin', email: 'admin@farmly.com', role: 'SYSTEM_OWNER', createdAt: '2026-06-01T00:00:00.000Z' },
    { name: 'Robert Vance', email: 'robert@vancefarms.com', role: 'BUSINESS_OWNER', createdAt: '2026-06-02T10:11:00.000Z' },
    { name: 'David Carter', email: 'david@vancefarms.com', role: 'FARM_MANAGER', createdAt: '2026-06-03T14:15:00.000Z' },
    { name: 'Alex Rivera', email: 'alex@vancefarms.com', role: 'FARM_EMPLOYEE', createdAt: '2026-06-04T12:00:00.000Z' },
    { name: 'Elena Rostova', email: 'elena@greenfield.com', role: 'BUSINESS_OWNER', createdAt: '2026-06-05T09:30:00.000Z' },
  ];

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Global Users Registry</CardTitle>
        <CardDescription>List of all users, business owners, managers, and employee logins.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={userData}
          searchKey="name"
          searchPlaceholder="Search registry by user name..."
          csvName="users-registry"
        />
      </CardContent>
    </Card>
  );
}
