'use client';

import SignInForm from '@/components/sign-in-form';
import SignUpForm from '@/components/sign-up-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage = () => (
  <div className="m-auto w-full max-w-md">
    <Tabs defaultValue="sign-in">
      <TabsList>
        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <SignInForm />
      </TabsContent>
      <TabsContent value="sign-up">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  </div>
);

export default LoginPage;
