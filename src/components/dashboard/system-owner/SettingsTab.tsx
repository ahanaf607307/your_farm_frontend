'use client';

import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SettingsTabProps {
  sysName: string;
  setSysName: (val: string) => void;
  sysEmail: string;
  setSysEmail: (val: string) => void;
  sysTrial: number;
  setSysTrial: (val: number) => void;
  sysMaint: boolean;
  setSysMaint: (val: boolean) => void;
}

export default function SettingsTab({
  sysName,
  setSysName,
  sysEmail,
  setSysEmail,
  sysTrial,
  setSysTrial,
  sysMaint,
  setSysMaint,
}: SettingsTabProps) {
  return (
    <Card className="border bg-card max-w-xl">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Global Platform Settings</CardTitle>
        <CardDescription>Modify platform name, trial parameters, and maintenance triggers.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success('System global configuration parameters updated.');
          }}
          className="space-y-4 pt-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="set-sys-name">Platform Public Name</Label>
            <Input id="set-sys-name" value={sysName} onChange={(e) => setSysName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="set-sys-email">Support Contact Email</Label>
            <Input id="set-sys-email" type="email" value={sysEmail} onChange={(e) => setSysEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="set-sys-trial">Default Trial Duration (Days)</Label>
            <Input id="set-sys-trial" type="number" value={sysTrial} onChange={(e) => setSysTrial(Number(e.target.value))} />
          </div>
          <div className="flex items-center space-x-2 pt-2 border-t">
            <input
              type="checkbox"
              id="set-sys-maint"
              checked={sysMaint}
              onChange={(e) => setSysMaint(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <Label htmlFor="set-sys-maint" className="text-xs font-normal cursor-pointer">
              Enable Global Maintenance Mode Lock
            </Label>
          </div>
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white mt-4">
            Save Settings Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
