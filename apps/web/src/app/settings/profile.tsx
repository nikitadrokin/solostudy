'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
}

const Profile: React.FC<ProfileProps> = ({ userName, userEmail, userRole }) => {
  return (
    <section className="scroll-mt-16 space-y-4" id="profile">
      <div className="space-y-1">
        <h2 className="font-semibold text-lg">Profile</h2>
        <p className="text-muted-foreground text-sm">
          Manage your public profile information.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input defaultValue={userName || ''} disabled id="name" />
            <p className="text-[0.8rem] text-muted-foreground">
              This is your display name.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input defaultValue={userEmail || ''} disabled id="email" />
            <p className="text-[0.8rem] text-muted-foreground">
              Your email address is managed by your authentication provider.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                  userRole === 'admin'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {userRole || 'user'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Profile;
