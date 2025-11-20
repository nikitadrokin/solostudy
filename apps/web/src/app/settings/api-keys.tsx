'use client';

import { Check, Copy, Key, Plus, Trash2 } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

interface ApiKey {
  id: string;
  name?: string | null;
  createdAt: string | Date;
}

const ApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadApiKeys = useCallback(async () => {
    const { data } = await authClient.apiKey.list();
    if (data) {
      setApiKeys(data);
    }
  }, []);

  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  const handleAddApiKey = async () => {
    if (!newKeyName.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.apiKey.create({
        name: newKeyName,
        prefix: 'sk_',
      });
      if (error) {
        return;
      }
      if (data?.key) {
        setCreatedKey(data.key);
        setKeyDialogOpen(true);
        await loadApiKeys();
      }
      setNewKeyName('');
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyKey = async () => {
    if (createdKey) {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isLoading) {
      return;
    }
    setIsDialogOpen(open);
    if (!open) {
      setNewKeyName('');
    }
  };

  const handleDeleteClick = (apiKeyId: string) => {
    setDeletingKeyId(apiKeyId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteApiKey = async () => {
    if (!deletingKeyId || isDeleting) {
      return;
    }

    setIsDeleting(true);
    try {
      await authClient.apiKey.delete({ keyId: deletingKeyId });
      await loadApiKeys();
      setDeleteDialogOpen(false);
      setDeletingKeyId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open && isDeleting) {
      return;
    }
    setDeleteDialogOpen(open);
    if (!open) {
      setDeletingKeyId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">API Keys</CardTitle>
        <CardDescription>
          API Keys can be used when connecting via MCP.
        </CardDescription>
      </CardHeader>
      {apiKeys?.length === 0 ? null : (
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {apiKeys?.map((apiKey) => (
              <div
                className="flex items-center justify-between rounded-md border p-3"
                key={apiKey.id}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Key className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {apiKey.name || 'Unnamed API Key'}
                    </p>

                    <p className="text-muted-foreground text-xs">
                      Added {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Button
                  className="text-destructive hover:text-destructive/90"
                  icon={<Trash2 className="size-4" stroke="currentColor" />}
                  onClick={() => handleDeleteClick(apiKey.id)}
                  size="icon"
                  variant="ghost"
                />
              </div>
            ))}
          </div>
        </CardContent>
      )}
      ;
      <CardFooter>
        <Dialog onOpenChange={handleDialogOpenChange} open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button icon={<Plus className="size-4" />}>Add New API Key</Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => isLoading && e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="api-key-name">Name</FieldLabel>
                <Input
                  autoComplete="off"
                  disabled={isLoading}
                  id="api-key-name"
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleAddApiKey();
                    }
                  }}
                  placeholder="My API Key"
                  value={newKeyName}
                />
                <FieldDescription>
                  Give your API key a descriptive name to identify it later.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                disabled={isLoading}
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={!newKeyName.trim()}
                isLoading={isLoading}
                onClick={handleAddApiKey}
              >
                Create API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          onOpenChange={handleDeleteDialogOpenChange}
          open={deleteDialogOpen}
        >
          <DialogContent
            onInteractOutside={(e) => isDeleting && e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Delete API Key</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Are you sure you want to delete this API key? This action cannot
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
                onClick={handleDeleteApiKey}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          onOpenChange={(open) => {
            setKeyDialogOpen(open);
            if (!open) {
              setCreatedKey(null);
            }
          }}
          open={keyDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Your API key has been created. Click the copy button to copy it to
              the clipboard.
            </p>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="api-key-value">API Key</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    className="font-mono text-xs"
                    id="api-key-value"
                    readOnly
                    value={createdKey || ''}
                  />
                  <Button
                    icon={
                      copied ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )
                    }
                    onClick={handleCopyKey}
                    size="icon"
                    variant="outline"
                  />
                </div>
                <FieldDescription>
                  Click the copy button to copy your API key to the clipboard.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setKeyDialogOpen(false)}>Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ApiKeys;
