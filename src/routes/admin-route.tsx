import React from 'react';

import { createFileRoute } from '@tanstack/react-router'
import supabase from '@/utils/supabase';
import AdminPage from '../components/AdminPage';
import AdminComp from '@/components/AdminComp';

export const Route = createFileRoute('/admin-route')({
  component: AdminComp,
  loader: async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@gmail.com',
      password: 'realadmin',
    });
    if (error) {
      console.error('Error fetching user:', error);
    }
    console.log(data)
    return data;
  }
});
