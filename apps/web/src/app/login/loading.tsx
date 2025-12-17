import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginLoading = () => (
  <div className="m-auto w-full max-w-md">
    <Tabs defaultValue="sign-in">
      <TabsList>
        <TabsTrigger disabled value="sign-in">
          Sign In
        </TabsTrigger>
        <TabsTrigger disabled value="sign-up">
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <Card className="!h-[473px] border-border/50 shadow-lg backdrop-blur-sm">
          <CardHeader className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-[20ch]" />
            <Skeleton className="h-4 w-[18ch]" />
          </CardHeader>

          <CardContent className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[7ch]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[8ch]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />

            <Separator className="my-3" />

            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-[20ch] self-center" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default LoginLoading;
