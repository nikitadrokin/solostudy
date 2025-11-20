'use client';

import { Key, Loader2, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { authClient, type Passkey } from '@/lib/auth-client';

const Passkeys: React.FC<{ userEmail?: string | null }> = ({ userEmail }) => {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loadingPasskeys, setLoadingPasskeys] = useState(true);
  const [editingPasskey, setEditingPasskey] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(
    null
  );

  const loadPasskeys = useCallback(async () => {
    try {
      setLoadingPasskeys(true);
      const { data } = await authClient.passkey.listUserPasskeys();
      setPasskeys(data || []);
    } finally {
      setLoadingPasskeys(false);
    }
  }, []);

  useEffect(() => {
    loadPasskeys();
  }, [loadPasskeys]);

  const handleDeletePasskey = async () => {
    if (!deletingPasskeyId || isDeleting) {
      return;
    }

    setIsDeleting(true);
    try {
      await authClient.passkey.deletePasskey({ id: deletingPasskeyId });
      await loadPasskeys();
      setDeleteDialogOpen(false);
      setDeletingPasskeyId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenamePasskey = async (id: string) => {
    if (!newName.trim() || isRenaming) {
      return;
    }

    setIsRenaming(true);
    try {
      await authClient.passkey.updatePasskey({
        id,
        name: newName.trim(),
      });
      setEditingPasskey(null);
      setNewName('');
      await loadPasskeys();
    } finally {
      setIsRenaming(false);
    }
  };

  const handleAddPasskey = async () => {
    if (isAddingPasskey) {
      return;
    }

    try {
      setIsAddingPasskey(true);
      await authClient.passkey.addPasskey({
        name: `${userEmail || 'Account'} - New Passkey`,
      });
      await loadPasskeys();
    } finally {
      setIsAddingPasskey(false);
    }
  };

  const startEditing = (passkey: Passkey) => {
    setEditingPasskey(passkey.id);
    setNewName(passkey.name || '');
  };

  const cancelEditing = () => {
    setEditingPasskey(null);
    setNewName('');
  };

  const handleDeleteClick = (passkeyId: string) => {
    setDeletingPasskeyId(passkeyId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open && isDeleting) {
      return;
    }
    setDeleteDialogOpen(open);
    if (!open) {
      setDeletingPasskeyId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Passkeys</CardTitle>
        <CardDescription>
          Passkeys allow you to sign in securely without a password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingPasskeys ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : passkeys.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Key className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground text-sm">
              You haven't added any passkeys yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {passkeys.map((passkey) => (
              <div
                className="flex items-center justify-between rounded-md border p-3"
                key={passkey.id}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Key className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    {editingPasskey === passkey.id ? (
                      <Input
                        className="h-8 w-40"
                        disabled={isRenaming}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isRenaming) {
                            handleRenamePasskey(passkey.id);
                          }
                        }}
                        placeholder="Passkey Name"
                        value={newName}
                      />
                    ) : (
                      <p className="font-medium text-sm">
                        {passkey.name || 'Unnamed Passkey'}
                      </p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      Added {new Date(passkey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingPasskey === passkey.id ? (
                    <>
                      <Button
                        disabled={!newName.trim()}
                        isLoading={isRenaming}
                        onClick={() => handleRenamePasskey(passkey.id)}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        disabled={isRenaming}
                        onClick={cancelEditing}
                        size="sm"
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => startEditing(passkey)}
                        size="sm"
                        variant="ghost"
                      >
                        Rename
                      </Button>
                      <Button
                        className="text-destructive hover:text-destructive/90"
                        icon={
                          <Trash2 className="size-4" stroke="currentColor" />
                        }
                        onClick={() => handleDeleteClick(passkey.id)}
                        size="icon"
                        variant="ghost"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          disabled={isAddingPasskey}
          isLoading={isAddingPasskey}
          onClick={handleAddPasskey}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Passkey
        </Button>
        <Dialog
          onOpenChange={handleDeleteDialogOpenChange}
          open={deleteDialogOpen}
        >
          <DialogContent
            onInteractOutside={(e) => isDeleting && e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Delete Passkey</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Are you sure you want to delete this passkey? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                disabled={isDeleting}
                onClick={() => setDeleteDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
                isLoading={isDeleting}
                onClick={handleDeletePasskey}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default Passkeys;
