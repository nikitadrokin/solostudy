'use client';

import {
  Key,
  Laptop,
  Loader2,
  LogOut,
  Moon,
  Plus,
  Shield,
  Sun,
  Trash2,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authClient, type Passkey } from '@/lib/auth-client';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();

  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loadingPasskeys, setLoadingPasskeys] = useState(true);
  const [editingPasskey, setEditingPasskey] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);

  useEffect(() => {
    if (!(session || isPending)) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  const loadPasskeys = useCallback(async () => {
    try {
      setLoadingPasskeys(true);
      const { data } = await authClient.passkey.listUserPasskeys();
      setPasskeys(data || []);
    } catch {
      toast.error('Failed to load passkeys');
    } finally {
      setLoadingPasskeys(false);
    }
  }, []);

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
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, preferences, and security.
        </p>
      </div>

      <Separator />

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <nav className="flex flex-col space-y-1">
          <Button className="justify-start hover:bg-muted" variant="ghost">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button className="justify-start hover:bg-muted" variant="ghost">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button className="justify-start hover:bg-muted" variant="ghost">
            <Laptop className="mr-2 h-4 w-4" />
            Appearance
          </Button>
        </nav>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="scroll-mt-16 space-y-4" id="profile">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">Profile</h2>
              <p className="text-muted-foreground text-sm">
                Manage your public profile information.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your name and email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input defaultValue={session.user.name} disabled id="name" />
                  <p className="text-[0.8rem] text-muted-foreground">
                    This is your display name.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    defaultValue={session.user.email}
                    disabled
                    id="email"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Your email address is managed by your authentication
                    provider.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Appearance Section */}
          <section className="scroll-mt-16 space-y-4" id="appearance">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">Appearance</h2>
              <p className="text-muted-foreground text-sm">
                Customize the look and feel of the application.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Theme</CardTitle>
                <CardDescription>
                  Select your preferred theme for the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    className="w-32 justify-start"
                    onClick={() => setTheme('light')}
                    variant={theme === 'light' ? 'default' : 'outline'}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    className="w-32 justify-start"
                    onClick={() => setTheme('dark')}
                    variant={theme === 'dark' ? 'default' : 'outline'}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    className="w-32 justify-start"
                    onClick={() => setTheme('system')}
                    variant={theme === 'system' ? 'default' : 'outline'}
                  >
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Security Section */}
          <section className="scroll-mt-16 space-y-4" id="security">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">Security</h2>
              <p className="text-muted-foreground text-sm">
                Manage your passkeys and authentication methods.
              </p>
            </div>
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
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Passkey Name"
                                value={newName}
                              />
                            ) : (
                              <p className="font-medium text-sm">
                                {passkey.name || 'Unnamed Passkey'}
                              </p>
                            )}
                            <p className="text-muted-foreground text-xs">
                              Added{' '}
                              {new Date(passkey.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {editingPasskey === passkey.id ? (
                            <>
                              <Button
                                onClick={() => handleRenamePasskey(passkey.id)}
                                size="sm"
                              >
                                Save
                              </Button>
                              <Button
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
                                onClick={() => handleDeletePasskey(passkey.id)}
                                size="icon"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button disabled={isAddingPasskey} onClick={handleAddPasskey}>
                  {isAddingPasskey ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Passkey
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </section>

          <Separator />

          <div className="flex justify-end">
            <Button
              onClick={async () => {
                await authClient.signOut();
                router.push('/login');
              }}
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
