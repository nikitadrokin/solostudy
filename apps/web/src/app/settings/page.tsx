'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient, type Passkey } from '@/lib/auth-client';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPasskey, setEditingPasskey] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!(session || isPending)) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  const loadPasskeys = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await authClient.passkey.listUserPasskeys();
      setPasskeys(data || []);
    } catch {
      toast.error('Failed to load passkeys');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load passkeys when component mounts
  useEffect(() => {
    if (session) {
      loadPasskeys();
    }
  }, [session, loadPasskeys]);

  const handleDeletePasskey = async (id: string) => {
    try {
      await authClient.passkey.deletePasskey({ id });
      toast.success('Passkey deleted successfully');
      await loadPasskeys();
    } catch {
      toast.error('Failed to delete passkey');
    }
  };

  const handleRenamePasskey = async (id: string) => {
    if (!newName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      await authClient.passkey.updatePasskey({
        id,
        name: newName.trim(),
      });
      toast.success('Passkey renamed successfully');
      setEditingPasskey(null);
      setNewName('');
      await loadPasskeys();
    } catch {
      toast.error('Failed to rename passkey');
    }
  };

  const handleAddPasskey = async () => {
    try {
      setIsAddingPasskey(true);
      await authClient.passkey.addPasskey({
        name: `${session?.user.email || 'Account'} - New Passkey`,
      });
      toast.success('Passkey added successfully');
      await loadPasskeys();
    } catch {
      toast.error('Failed to add passkey');
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

  if (isPending) {
    return <Loader />;
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and security settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <p className="text-sm">{session.user.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm">{session.user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Passkey Management */}
        <Card>
          <CardHeader>
            <CardTitle>Passkeys</CardTitle>
            <CardDescription>
              Manage your passkeys for secure, passwordless authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Button
                className="w-full sm:w-auto"
                disabled={isAddingPasskey}
                onClick={handleAddPasskey}
              >
                {isAddingPasskey ? 'Adding Passkey...' : 'Add New Passkey'}
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : passkeys.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No passkeys found</p>
                <p className="mt-2 text-muted-foreground text-sm">
                  Add a passkey for secure, passwordless authentication
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {passkeys.map((passkey) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
                    key={passkey.id}
                  >
                    <div className="flex-1">
                      {editingPasskey === passkey.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            className="max-w-xs"
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter passkey name"
                            value={newName}
                          />
                          <Button
                            onClick={() => handleRenamePasskey(passkey.id)}
                            size="sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={cancelEditing}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium">
                            {passkey.name || 'Unnamed Passkey'}
                          </h3>
                          <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span>Device: {passkey.deviceType}</span>
                            <span>
                              Added:{' '}
                              {new Date(passkey.createdAt).toLocaleDateString()}
                            </span>
                            {passkey.backedUp && (
                              <span className="text-green-600">
                                ✓ Backed up
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {editingPasskey !== passkey.id && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => startEditing(passkey)}
                          size="sm"
                          variant="outline"
                        >
                          Rename
                        </Button>
                        <Button
                          onClick={() => handleDeletePasskey(passkey.id)}
                          size="sm"
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
