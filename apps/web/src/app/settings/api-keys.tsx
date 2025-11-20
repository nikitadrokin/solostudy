'use client';

import { Key, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { authClient } from '@/lib/auth-client';

interface ApiKey {
  id: string;
  name?: string | null;
  createdAt: string | Date;
}

const ApiKeys: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    async function loadApiKeys() {
      const { data } = await authClient.apiKey.list();
      if (data) {
        setApiKeys(data);
      }
    }
    loadApiKeys();
  }, []);

  //   const handleAddApiKey = async () => {
  //     // const { data, error } = await authClient.apiKey.create({
  //     //   name: newName,
  //     //   prefix: 'sk_',
  //     // });
  //   };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">API Keys</CardTitle>
        <CardDescription>
          API Keys can be used when connecting via MCP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys?.length === 0 ? null : (
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
                <div className="flex items-center gap-2">
                  <Button
                    // onClick={() => startEditingApiKey(apiKey)}
                    size="sm"
                    variant="ghost"
                  >
                    Rename
                  </Button>
                  <Button
                    className="text-destructive hover:text-destructive/90"
                    // onClick={() => handleDeleteApiKey(apiKey.id)}
                    icon={<Trash2 className="size-4" stroke="currentColor" />}
                    size="icon"
                    variant="ghost"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger>
            <Button icon={<Plus className="size-4" />}>Add New API Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ApiKeys;
