'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ETAPAS, type Prospecto } from '@/lib/types';
import {
  Users,
  DollarSign,
  TrendingUp,
  UserPlus,
  Clock,
  Trophy,
} from 'lucide-react';

export default function DashboardPage() {
  const supabase = createClient();
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProspectos = async () => {
      const { data } = await supabase
        .from('crm_prospectos')
        .select('*')
        .order('created_at', { ascending: false });

      setProspectos(data || []);
      setLoading(false);
    };

    fetchProspectos();
  }, [supabase]);

  const totalProspectos = prospectos.length;
  const valorTotal = prospectos.reduce((sum, p) => sum + (p.valor_estimado || 0), 0);
  const ganados = prospectos.filter(p => p.etapa === 'ganado').length;
  const valorGanado = prospectos.filter(p => p.etapa === 'ganado').reduce((sum, p) => sum + (p.valor_estimado || 0), 0);
  const activos = prospectos.filter(p => !['ganado', 'perdido'].includes(p.etapa)).length;
  const nuevosEsteMes = prospectos.filter(p => {
    const d = new Date(p.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(n);

  const stats = [
    { label: 'Total prospectos', value: totalProspectos.toString(), icon: Users, color: '#6366f1', bgColor: '#eef2ff', subtext: `${nuevosEsteMes} nuevos este mes` },
    { label: 'Prospectos activos', value: activos.toString(), icon: Clock, color: '#3b82f6', bgColor: '#eff6ff', subtext: 'En el pipeline' },
    { label: 'Valor del pipeline', value: formatCurrency(valorTotal), icon: DollarSign, color: '#f59e0b', bgColor: '#fffbeb', subtext: 'Valor total estimado' },
    { label: 'Ganados', value: ganados.toString(), icon: Trophy, color: '#10b981', bgColor: '#ecfdf5', subtext: formatCurrency(valorGanado) + ' cerrados' },
    { label: 'Tasa de conversión', value: totalProspectos > 0 ? `${Math.round((ganados / totalProspectos) * 100)}%` : '0%', icon: TrendingUp, color: '#8b5cf6', bgColor: '#f5f3ff', subtext: 'Prospectos ganados vs total' },
    { label: 'Nuevos este mes', value: nuevosEsteMes.toString(), icon: UserPlus, color: '#ec4899', bgColor: '#fdf2f8', subtext: new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }) },
  ];

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general del pipeline Kadmiel</p>
        </div>
      </div>
      <div className="dashboard-page">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-subtext">{stat.subtext}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Kadmiel Pipeline stages */}
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.3px' }}>
            Pipeline Kadmiel por etapa
          </h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ETAPAS.map((etapa) => {
              const count = prospectos.filter(p => p.etapa === etapa.id).length;
              const valor = prospectos.filter(p => p.etapa === etapa.id).reduce((s, p) => s + (p.valor_estimado || 0), 0);
              return (
                <div
                  key={etapa.id}
                  style={{
                    flex: '1 1 140px',
                    background: '#fff',
                    border: `1px solid ${etapa.color}20`,
                    borderRadius: 12,
                    padding: '16px 18px',
                    borderLeft: `4px solid ${etapa.color}`,
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{etapa.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: etapa.color, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    {etapa.label}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4, letterSpacing: '-1px' }}>{count}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{formatCurrency(valor)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
