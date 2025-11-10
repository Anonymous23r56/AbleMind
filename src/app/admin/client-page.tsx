'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { User } from '@/lib/entities';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminClientPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userProfileRef);

  useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) {
        router.push('/login');
      } else if (!userProfile?.isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [isUserLoading, isProfileLoading, user, userProfile, router]);

  const usersQuery = useMemoFirebase(() => {
    if (!userProfile?.isAdmin) return null;
    return collection(firestore, 'users');
  }, [firestore, userProfile]);

  const { data: users, isLoading: isUsersLoading, error } = useCollection<User>(usersQuery);

  if (isUserLoading || isProfileLoading || !userProfile?.isAdmin || isUsersLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20 text-center">
        <h2 className="text-2xl font-semibold text-destructive">An error occurred</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20">
      <div className="space-y-4 mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage users and view application data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all registered users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell className="text-muted-foreground">{u.id}</TableCell>
                  <TableCell>
                    {u.isAdmin && <Badge>Admin</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
