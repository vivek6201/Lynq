'use client';
import { logout } from '@/utils/routes/auth';
import { Button } from '@org/ui';
import React from 'react';
import { toast } from '@org/ui';
import { signOut } from 'next-auth/react';

export default function page() {
  const handleLogout = async () => {
    const { success, message } = await logout();

    if (!success) toast.error(message);

    await signOut();
    toast.success('Signout Successful!');
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
