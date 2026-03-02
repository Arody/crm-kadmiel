'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface CurrentUserInfo {
  user: User | null;
  role: string | null;
  sucursal: string | null;
  isSuper: boolean;
  isBranch: boolean;
  loading: boolean;
}

export function useCurrentUser(): CurrentUserInfo {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sucursal, setSucursal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }
      setUser(authUser);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, sucursal')
        .eq('user_id', authUser.id)
        .single();

      if (roleData) {
        setRole(roleData.role);
        setSucursal(roleData.sucursal);
      }
      setLoading(false);
    };

    fetch();
  }, [supabase]);

  return {
    user,
    role,
    sucursal,
    isSuper: role === 'super_admin',
    isBranch: role === 'branch_admin',
    loading,
  };
}
