'use client';

import BackToFocusLink from '@/components/back-to-focus-link';
import SignInForm from '@/components/sign-in-form';
import SignUpForm from '@/components/sign-up-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage = () => (
  <main className="relative grid min-h-svh place-items-center px-4 py-20">
    <BackToFocusLink className="absolute top-4 left-4 sm:top-6 sm:left-6" />
    <div className="w-full max-w-md">
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
  </main>
);

export default LoginPage;
