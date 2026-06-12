'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BusinessDialogsProps {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  formName: string;
  setFormName: (val: string) => void;
  formOwner: string;
  setFormOwner: (val: string) => void;
  formEmail: string;
  setFormEmail: (val: string) => void;
  formSub: 'Basic' | 'Standard' | 'Enterprise';
  setFormSub: (val: 'Basic' | 'Standard' | 'Enterprise') => void;
  handleCreateSubmit: (e: React.FormEvent) => void;
  handleEditSubmit: (e: React.FormEvent) => void;
}

export default function BusinessDialogs({
  createModalOpen,
  setCreateModalOpen,
  editModalOpen,
  setEditModalOpen,
  formName,
  setFormName,
  formOwner,
  setFormOwner,
  formEmail,
  setFormEmail,
  formSub,
  setFormSub,
  handleCreateSubmit,
  handleEditSubmit,
}: BusinessDialogsProps) {
  return (
    <>
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
            <DialogTitle>Modify Business Credentials</DialogTitle>
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
    </>
  );
}
