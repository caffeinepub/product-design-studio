import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Loader2, Palette } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSave = async () => {
    if (!name.trim()) return;
    await saveProfile.mutateAsync({ name: name.trim() });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent-foreground" />
            </div>
            <DialogTitle className="font-serif text-xl">Welcome to DesignCraft Studio</DialogTitle>
          </div>
          <DialogDescription>
            Tell us your name to personalize your design experience.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="profile-name" className="text-sm font-medium mb-2 block">
            Your Name
          </Label>
          <Input
            id="profile-name"
            placeholder="e.g. Alex Johnson"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {saveProfile.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : (
              'Start Designing'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
