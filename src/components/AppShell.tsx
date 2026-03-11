'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import {
  Zap,
  LayoutDashboard,
  Users,
  GraduationCap,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase.auth]);

  // Cierra el menú en móvil al navegar
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/prospectos', icon: Users, label: 'Pipeline' },
    { href: '/aprendizaje', icon: GraduationCap, label: 'Aprendizaje' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'KD';

  return (
    <div className="app-layout">
      {/* HEADER EXCLUSIVO MÓVIL */}
      <header className="mobile-header">
        <div className="mobile-header-brand">
          <div className="mobile-header-brand-icon">
            <Zap size={18} />
          </div>
          <h1>Kadmiel CRM</h1>
        </div>
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY PARA MÓVIL */}
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Zap size={20} />
            </div>
            {!collapsed && (
              <div>
                <h1>Kadmiel</h1>
                <span>CRM</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          
          {/* BOTÓN PARA CERRAR SOLO EN MOVIL (A la derecha del brand) */}
          <button
            className="mobile-menu-btn"
            style={{ display: 'none', position: 'absolute', right: 16, top: 16 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} style={{ display: mobileMenuOpen ? 'block' : 'none' }} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <div className="sidebar-section-label">Menú</div>}
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && item.label}
            </a>
          ))}

          <div className="sidebar-divider" />

          <button
            className="sidebar-nav-item"
            onClick={handleLogout}
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && 'Cerrar sesión'}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user ? initials : <User size={16} />}
            </div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {user?.email?.split('@')[0] || 'Usuario'}
                </div>
                <div className="sidebar-user-email">
                  {user?.email || ''}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
