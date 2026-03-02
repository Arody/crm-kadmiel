'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  X,
} from 'lucide-react';
import { STAGE_CHECKLIST, ETAPAS, type EtapaProspecto, type ChecklistItem } from '@/lib/types';

interface StageGateCheckProps {
  dealId: string;
  fromStage: EtapaProspecto;
  toStage: EtapaProspecto;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function StageGateCheck({
  dealId,
  fromStage,
  toStage,
  isOpen,
  onConfirm,
  onCancel,
}: StageGateCheckProps) {
  const supabase = createClient();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const checklistDefs = STAGE_CHECKLIST[toStage] || [];
  const toEtapaConfig = ETAPAS.find(e => e.id === toStage);
  const fromEtapaConfig = ETAPAS.find(e => e.id === fromStage);

  useEffect(() => {
    if (!isOpen || !checklistDefs.length) return;

    const loadOrCreate = async () => {
      setLoading(true);

      // Fetch existing checklist items for this deal+stage
      const { data: existing } = await supabase
        .from('crm_prospectos_checklist')
        .select('*')
        .eq('deal_id', dealId)
        .eq('etapa', toStage);

      if (existing && existing.length > 0) {
        setItems(existing);
      } else {
        // Create checklist items for this transition
        const newItems = checklistDefs.map(item => ({
          deal_id: dealId,
          etapa: toStage,
          item,
          completado: false,
        }));

        const { data: created } = await supabase
          .from('crm_prospectos_checklist')
          .insert(newItems)
          .select('*');

        setItems(created || []);
      }
      setLoading(false);
    };

    loadOrCreate();
  }, [isOpen, dealId, toStage, supabase, checklistDefs]);

  const toggleItem = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newVal = !item.completado;
    setItems(prev =>
      prev.map(i =>
        i.id === itemId
          ? { ...i, completado: newVal, completado_at: newVal ? new Date().toISOString() : null }
          : i
      )
    );

    await supabase
      .from('crm_prospectos_checklist')
      .update({
        completado: newVal,
        completado_at: newVal ? new Date().toISOString() : null,
      })
      .eq('id', itemId);
  };

  const completedCount = items.filter(i => i.completado).length;
  const totalCount = items.length;
  const allDone = completedCount === totalCount;
  const hasWarnings = !allDone && totalCount > 0;

  if (!isOpen) return null;

  // No checklist defined for this transition (e.g. "perdido")
  if (!checklistDefs.length) {
    onConfirm();
    return null;
  }

  return (
    <div className="delete-confirm-overlay" onClick={onCancel}>
      <div
        className="delete-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 440, textAlign: 'left' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              Mover prospecto
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: fromEtapaConfig?.color,
                background: fromEtapaConfig?.bgColor,
                padding: '4px 10px',
                borderRadius: 6,
              }}>
                {fromEtapaConfig?.emoji} {fromEtapaConfig?.label}
              </span>
              <ArrowRight size={16} style={{ color: '#d1d5db' }} />
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: toEtapaConfig?.color,
                background: toEtapaConfig?.bgColor,
                padding: '4px 10px',
                borderRadius: 6,
              }}>
                {toEtapaConfig?.emoji} {toEtapaConfig?.label}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onCancel} style={{ marginTop: -4 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#374151',
          marginBottom: 12,
        }}>
          ¿Ya hiciste todo esto? ({completedCount}/{totalCount})
        </div>

        {loading ? (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: item.completado ? '#f0fdf4' : '#ffffff',
                  border: `1.5px solid ${item.completado ? '#bbf7d0' : '#e5e7eb'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: item.completado ? '#166534' : '#374151',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                {item.completado ? (
                  <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                ) : (
                  <Circle size={18} style={{ color: '#d1d5db', flexShrink: 0 }} />
                )}
                <span style={{
                  textDecoration: item.completado ? 'line-through' : 'none',
                  opacity: item.completado ? 0.7 : 1,
                }}>
                  {item.item}
                </span>
              </button>
            ))}
          </div>
        )}

        {hasWarnings && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 8,
            fontSize: 12,
            color: '#92400e',
            marginBottom: 16,
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            Te faltan cosas por hacer, pero puedes avanzar de todas formas.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {allDone ? '✅ Mover' : '⚠️ Mover de todos modos'}
          </button>
        </div>
      </div>
    </div>
  );
}
