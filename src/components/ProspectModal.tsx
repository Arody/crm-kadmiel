'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  X,
  Save,
  Trash2,
  AlertTriangle,
  StickyNote,
  Phone,
  Mail,
  Users as UsersIcon,
  Send,
  Clock,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import {
  type Prospecto,
  type EtapaProspecto,
  type PrioridadProspecto,
  type OrigenProspecto,
  type Actividad,
  type TipoActividad,
  type AdminUser,
  type ChecklistItem,
  ETAPAS,
  ORIGEN_OPTIONS,
  ACTIVIDAD_TIPOS,
  SUCURSALES,
  STAGE_CHECKLIST,
} from '@/lib/types';

interface ProspectModalProps {
  prospecto: Prospecto | null;
  defaultEtapa?: EtapaProspecto;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  adminUsers: AdminUser[];
  currentUserSucursal: string | null;
  isSuper: boolean;
}

const ACTIVIDAD_ICONS: Record<string, typeof StickyNote> = {
  nota: StickyNote,
  llamada: Phone,
  email: Mail,
  reunion: UsersIcon,
};

export default function ProspectModal({
  prospecto,
  defaultEtapa,
  isOpen,
  onClose,
  onSaved,
  adminUsers,
  currentUserSucursal,
  isSuper,
}: ProspectModalProps) {
  const supabase = createClient();
  const isEditing = !!prospecto;

  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    valor_estimado: '',
    etapa: defaultEtapa || 'nuevo' as EtapaProspecto,
    prioridad: 'media' as PrioridadProspecto,
    notas: '',
    origen: '' as OrigenProspecto | '',
    asignado_a: '' as string,
    sucursal: currentUserSucursal || 'Teran',
    // REVERSA fields
    contacto_nombre: '',
    puesto: '',
    industria: '',
    dolor_principal: '',
    siguiente_paso: '',
    fecha_siguiente_paso: '',
    probabilidad: '',
    razon_perdida: '',
  });

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newActividad, setNewActividad] = useState('');
  const [newActividadTipo, setNewActividadTipo] = useState<TipoActividad>('nota');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'actividad' | 'checklist'>('info');

  const creatorName = prospecto?.created_by
    ? adminUsers.find(u => u.user_id === prospecto.created_by)?.full_name
      || adminUsers.find(u => u.user_id === prospecto.created_by)?.email
      || 'Desconocido'
    : null;

  const currentEtapaConfig = ETAPAS.find(e => e.id === (prospecto?.etapa || form.etapa));

  useEffect(() => {
    if (prospecto) {
      setForm({
        nombre: prospecto.nombre || '',
        empresa: prospecto.empresa || '',
        email: prospecto.email || '',
        telefono: prospecto.telefono || '',
        valor_estimado: prospecto.valor_estimado?.toString() || '',
        etapa: prospecto.etapa,
        prioridad: prospecto.prioridad,
        notas: prospecto.notas || '',
        origen: prospecto.origen || '',
        asignado_a: prospecto.asignado_a || '',
        sucursal: prospecto.sucursal || currentUserSucursal || 'Teran',
        contacto_nombre: prospecto.contacto_nombre || '',
        puesto: prospecto.puesto || '',
        industria: prospecto.industria || '',
        dolor_principal: prospecto.dolor_principal || '',
        siguiente_paso: prospecto.siguiente_paso || '',
        fecha_siguiente_paso: prospecto.fecha_siguiente_paso || '',
        probabilidad: prospecto.probabilidad?.toString() || '',
        razon_perdida: prospecto.razon_perdida || '',
      });
      fetchActividades(prospecto.id);
      fetchChecklist(prospecto.id);
    } else {
      const etapaDefault = defaultEtapa || 'nuevo';
      const prob = ETAPAS.find(e => e.id === etapaDefault)?.probabilidad || 0;
      setForm({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        valor_estimado: '',
        etapa: etapaDefault,
        prioridad: 'media',
        notas: '',
        origen: '',
        asignado_a: '',
        sucursal: currentUserSucursal || 'Teran',
        contacto_nombre: '',
        puesto: '',
        industria: '',
        dolor_principal: '',
        siguiente_paso: '',
        fecha_siguiente_paso: '',
        probabilidad: prob.toString(),
        razon_perdida: '',
      });
      setActividades([]);
      setChecklist([]);
      setActiveTab('info');
    }
  }, [prospecto, defaultEtapa, currentUserSucursal]);

  const fetchActividades = async (prospectoId: string) => {
    const { data } = await supabase
      .from('crm_prospectos_actividades')
      .select('*')
      .eq('prospecto_id', prospectoId)
      .order('created_at', { ascending: false });
    setActividades(data || []);
  };

  const fetchChecklist = async (dealId: string) => {
    const { data } = await supabase
      .from('crm_prospectos_checklist')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: true });
    setChecklist(data || []);
  };

  const toggleChecklistItem = async (itemId: string) => {
    const item = checklist.find(i => i.id === itemId);
    if (!item) return;
    const newVal = !item.completado;
    setChecklist(prev =>
      prev.map(i => i.id === itemId ? { ...i, completado: newVal, completado_at: newVal ? new Date().toISOString() : null } : i)
    );
    await supabase.from('crm_prospectos_checklist').update({
      completado: newVal,
      completado_at: newVal ? new Date().toISOString() : null,
    }).eq('id', itemId);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);

    const payload = {
      nombre: form.nombre.trim(),
      empresa: form.empresa.trim() || null,
      email: form.email.trim() || null,
      telefono: form.telefono.trim() || null,
      valor_estimado: form.valor_estimado ? parseFloat(form.valor_estimado) : 0,
      etapa: form.etapa,
      prioridad: form.prioridad,
      notas: form.notas.trim() || null,
      origen: form.origen || null,
      asignado_a: form.asignado_a || null,
      sucursal: form.sucursal,
      contacto_nombre: form.contacto_nombre.trim() || null,
      puesto: form.puesto.trim() || null,
      industria: form.industria.trim() || null,
      dolor_principal: form.dolor_principal.trim() || null,
      siguiente_paso: form.siguiente_paso.trim() || null,
      fecha_siguiente_paso: form.fecha_siguiente_paso || null,
      probabilidad: form.probabilidad ? parseInt(form.probabilidad) : 0,
      razon_perdida: form.etapa === 'perdido' ? (form.razon_perdida.trim() || null) : null,
      etapa_perdida: form.etapa === 'perdido' && prospecto ? prospecto.etapa : null,
    };

    if (isEditing) {
      await supabase.from('crm_prospectos').update(payload).eq('id', prospecto!.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('crm_prospectos').insert({ ...payload, created_by: user?.id });
    }

    setSaving(false);
    onSaved();
    onClose();
  };

  const handleDelete = async () => {
    if (!prospecto) return;
    await supabase.from('crm_prospectos').delete().eq('id', prospecto.id);
    setShowDeleteConfirm(false);
    onSaved();
    onClose();
  };

  const handleAddActividad = async () => {
    if (!newActividad.trim() || !prospecto) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('crm_prospectos_actividades').insert({
      prospecto_id: prospecto.id,
      tipo: newActividadTipo,
      descripcion: newActividad.trim(),
      created_by: user?.id,
    });
    setNewActividad('');
    fetchActividades(prospecto.id);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  if (!isOpen) return null;

  const currentChecklist = checklist.filter(c => c.etapa === (prospecto?.etapa || form.etapa));
  const checklistDone = currentChecklist.filter(c => c.completado).length;
  const checklistTotal = currentChecklist.length;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2 className="modal-title">
                {isEditing ? 'Editar prospecto' : 'Nuevo prospecto'}
              </h2>
              {currentEtapaConfig && (
                <div style={{ fontSize: 12, color: currentEtapaConfig.color, fontWeight: 600, marginTop: 4 }}>
                  {currentEtapaConfig.emoji} {currentEtapaConfig.label}
                  {checklistTotal > 0 && (
                    <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>
                      · {checklistDone}/{checklistTotal} ✓
                    </span>
                  )}
                </div>
              )}
            </div>
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          {isEditing && (
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb',
              padding: '0 28px',
              gap: 0,
            }}>
              {[
                { id: 'info' as const, label: 'Información' },
                { id: 'checklist' as const, label: `Checklist (${checklistDone}/${checklistTotal})` },
                { id: 'actividad' as const, label: `Actividad (${actividades.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 16px',
                    fontSize: 13,
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    color: activeTab === tab.id ? '#111827' : '#9ca3af',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #111827' : '2px solid transparent',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="modal-body">
            {/* Creator info */}
            {isEditing && creatorName && activeTab === 'info' && (
              <div style={{
                marginBottom: 20,
                padding: '10px 14px',
                background: '#f9fafb',
                borderRadius: 8,
                fontSize: 13,
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <UsersIcon size={14} />
                Creado por: <strong style={{ color: '#374151' }}>{creatorName}</strong>
                <span style={{ marginLeft: 'auto', fontSize: 11 }}>
                  {new Date(prospecto!.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}

            {/* TAB: Info */}
            {(activeTab === 'info' || !isEditing) && (
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre del prospecto *</label>
                  <input className="form-input" placeholder="Nombre o empresa" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <input className="form-input" placeholder="Nombre de la empresa" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contacto principal</label>
                  <input className="form-input" placeholder="Nombre de la persona" value={form.contacto_nombre} onChange={(e) => setForm({ ...form, contacto_nombre: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Puesto</label>
                  <input className="form-input" placeholder="Ej: Director Comercial" value={form.puesto} onChange={(e) => setForm({ ...form, puesto: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input className="form-input" placeholder="+52 000 000 0000" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Industria</label>
                  <input className="form-input" placeholder="Ej: Alimentos, Tech, Salud..." value={form.industria} onChange={(e) => setForm({ ...form, industria: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Valor estimado (MXN)</label>
                  <input className="form-input" type="number" placeholder="0" value={form.valor_estimado} onChange={(e) => setForm({ ...form, valor_estimado: e.target.value })} />
                </div>

                <div className="form-group full-width" style={{ background: '#fffbeb', padding: 14, borderRadius: 10, border: '1px solid #fde68a' }}>
                  <label className="form-label" style={{ color: '#92400e' }}>💡 ¿Cuál es su dolor principal?</label>
                  <input className="form-input" placeholder="¿Qué problema tiene que queremos resolver?" value={form.dolor_principal} onChange={(e) => setForm({ ...form, dolor_principal: e.target.value })} style={{ background: '#fff' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">🎯 ¿Qué sigue?</label>
                  <input className="form-input" placeholder="Siguiente paso concreto" value={form.siguiente_paso} onChange={(e) => setForm({ ...form, siguiente_paso: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">📅 ¿Cuándo?</label>
                  <input className="form-input" type="date" value={form.fecha_siguiente_paso} onChange={(e) => setForm({ ...form, fecha_siguiente_paso: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Probabilidad (%)</label>
                  <input className="form-input" type="number" min="0" max="100" placeholder="0-100" value={form.probabilidad} onChange={(e) => setForm({ ...form, probabilidad: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prioridad</label>
                  <select className="form-select" value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value as PrioridadProspecto })}>
                    <option value="alta">🔴 Alta</option>
                    <option value="media">🟡 Media</option>
                    <option value="baja">⚪ Baja</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Etapa</label>
                  <select className="form-select" value={form.etapa} onChange={(e) => setForm({ ...form, etapa: e.target.value as EtapaProspecto })}>
                    {ETAPAS.map((et) => (
                      <option key={et.id} value={et.id}>{et.emoji} {et.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Origen</label>
                  <select className="form-select" value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value as OrigenProspecto })}>
                    <option value="">Sin especificar</option>
                    {ORIGEN_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sucursal</label>
                  {isSuper ? (
                    <select className="form-select" value={form.sucursal} onChange={(e) => setForm({ ...form, sucursal: e.target.value })}>
                      {SUCURSALES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input className="form-input" value={form.sucursal} disabled style={{ background: '#f3f4f6', cursor: 'not-allowed' }} />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Asignado a</label>
                  <select className="form-select" value={form.asignado_a} onChange={(e) => setForm({ ...form, asignado_a: e.target.value })}>
                    <option value="">Sin asignar</option>
                    {adminUsers.map((u) => (
                      <option key={u.user_id} value={u.user_id}>
                        {u.full_name || u.email} ({u.sucursal})
                      </option>
                    ))}
                  </select>
                </div>

                {form.etapa === 'perdido' && (
                  <div className="form-group full-width" style={{ background: '#fef2f2', padding: 14, borderRadius: 10, border: '1px solid #fecaca' }}>
                    <label className="form-label" style={{ color: '#991b1b' }}>❌ ¿Por qué se perdió?</label>
                    <textarea className="form-textarea" placeholder="Razón de la pérdida..." value={form.razon_perdida} onChange={(e) => setForm({ ...form, razon_perdida: e.target.value })} rows={2} style={{ background: '#fff' }} />
                  </div>
                )}

                <div className="form-group full-width">
                  <label className="form-label">Notas</label>
                  <textarea className="form-textarea" placeholder="Notas adicionales..." value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} rows={3} />
                </div>
              </div>
            )}

            {/* TAB: Checklist */}
            {activeTab === 'checklist' && isEditing && (
              <div>
                {ETAPAS.filter(e => !['nuevo', 'perdido'].includes(e.id)).map(etapa => {
                  const items = checklist.filter(c => c.etapa === etapa.id);
                  const defs = STAGE_CHECKLIST[etapa.id] || [];
                  if (!defs.length) return null;
                  const done = items.filter(c => c.completado).length;
                  const isCurrentStage = etapa.id === prospecto?.etapa;
                  return (
                    <div key={etapa.id} style={{
                      marginBottom: 16,
                      padding: '14px 16px',
                      borderRadius: 10,
                      background: isCurrentStage ? etapa.bgColor : '#fafafa',
                      border: isCurrentStage ? `1.5px solid ${etapa.color}30` : '1px solid #f3f4f6',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: etapa.color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{etapa.emoji}</span> {etapa.label}
                        {items.length > 0 && (
                          <span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', marginLeft: 'auto' }}>
                            {done}/{items.length}
                          </span>
                        )}
                      </div>
                      {items.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {items.map(item => (
                            <button
                              key={item.id}
                              onClick={() => toggleChecklistItem(item.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '8px 10px', background: item.completado ? '#f0fdf4' : '#fff',
                                border: `1px solid ${item.completado ? '#bbf7d0' : '#e5e7eb'}`,
                                borderRadius: 6, cursor: 'pointer', fontSize: 12,
                                color: item.completado ? '#166534' : '#374151',
                                textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                              }}
                            >
                              {item.completado ? <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} /> : <Circle size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />}
                              <span style={{ textDecoration: item.completado ? 'line-through' : 'none', opacity: item.completado ? 0.7 : 1 }}>{item.item}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>Se creará al llegar a esta etapa</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB: Actividad */}
            {activeTab === 'actividad' && isEditing && (
              <div>
                <div className="activity-add-form">
                  <select className="form-select" value={newActividadTipo} onChange={(e) => setNewActividadTipo(e.target.value as TipoActividad)} style={{ width: 130 }}>
                    {ACTIVIDAD_TIPOS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <input className="form-input" placeholder="Agregar actividad..." value={newActividad} onChange={(e) => setNewActividad(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddActividad()} style={{ flex: 1 }} />
                  <button className="btn btn-primary btn-icon" onClick={handleAddActividad} disabled={!newActividad.trim()}>
                    <Send size={16} />
                  </button>
                </div>
                {actividades.length === 0 ? (
                  <div style={{ padding: '30px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                    Sin actividades registradas
                  </div>
                ) : (
                  <div style={{ marginTop: 12 }}>
                    {actividades.map((act) => {
                      const Icon = ACTIVIDAD_ICONS[act.tipo] || StickyNote;
                      return (
                        <div key={act.id} className="activity-item">
                          <div className="activity-icon-wrapper">
                            <Icon size={14} style={{ color: '#6b7280' }} />
                          </div>
                          <div className="activity-content">
                            <div className="activity-text">{act.descripcion}</div>
                            <div className="activity-time">
                              {ACTIVIDAD_TIPOS.find(t => t.value === act.tipo)?.label} · {formatDate(act.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <div>
              {isEditing && (
                <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 size={16} />
                  Eliminar
                </button>
              )}
            </div>
            <div className="modal-footer-right">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.nombre.trim()}>
                {saving ? <div className="spinner spinner-light" /> : <Save size={16} />}
                {isEditing ? 'Guardar' : 'Crear prospecto'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon"><AlertTriangle size={28} /></div>
            <h3 className="delete-confirm-title">¿Eliminar prospecto?</h3>
            <p className="delete-confirm-text">Esta acción no se puede deshacer. Se eliminarán también todas las actividades y checklists.</p>
            <div className="delete-confirm-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}><Trash2 size={16} /> Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
