export interface Prospecto {
  id: string;
  nombre: string;
  empresa: string | null;
  email: string | null;
  telefono: string | null;
  valor_estimado: number;
  etapa: EtapaProspecto;
  prioridad: PrioridadProspecto;
  notas: string | null;
  origen: OrigenProspecto | null;
  asignado_a: string | null;
  sucursal: string;
  posicion: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  // REVERSA fields
  contacto_nombre: string | null;
  puesto: string | null;
  industria: string | null;
  dolor_principal: string | null;
  siguiente_paso: string | null;
  fecha_siguiente_paso: string | null;
  probabilidad: number;
  razon_perdida: string | null;
  etapa_perdida: string | null;
  ultimo_cambio_etapa: string | null;
}

export interface AdminUser {
  user_id: string;
  full_name: string | null;
  email: string;
  role: string;
  sucursal: string;
}

export interface ChecklistItem {
  id: string;
  deal_id: string;
  etapa: string;
  item: string;
  completado: boolean;
  completado_at: string | null;
}

export const SUCURSALES = ['Teran', 'San Cristobal', 'Aeropuerto'] as const;

export interface Actividad {
  id: string;
  prospecto_id: string;
  tipo: TipoActividad;
  descripcion: string;
  created_at: string;
  created_by: string | null;
}

export type EtapaProspecto =
  | 'nuevo'
  | 'primer_contacto'
  | 'descubrimiento'
  | 'entendimos_dolor'
  | 'le_conviene'
  | 'quien_decide'
  | 'le_mostramos'
  | 'cerrando'
  | 'ganado'
  | 'perdido';

export type PrioridadProspecto = 'alta' | 'media' | 'baja';
export type OrigenProspecto = 'referido' | 'web' | 'redes_sociales' | 'llamada' | 'otro';
export type TipoActividad = 'nota' | 'llamada' | 'email' | 'reunion';

export interface EtapaConfig {
  id: EtapaProspecto;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  probabilidad: number; // default probability for this stage
}

export const ETAPAS: EtapaConfig[] = [
  { id: 'nuevo',            label: 'Nuevo',              emoji: '🆕', color: '#6366f1', bgColor: '#eef2ff', probabilidad: 5 },
  { id: 'primer_contacto',  label: 'Primer contacto',    emoji: '📞', color: '#3b82f6', bgColor: '#eff6ff', probabilidad: 15 },
  { id: 'descubrimiento',   label: 'Descubrimiento',     emoji: '🎯', color: '#06b6d4', bgColor: '#ecfeff', probabilidad: 25 },
  { id: 'entendimos_dolor', label: 'Entendimos su dolor', emoji: '💡', color: '#f59e0b', bgColor: '#fffbeb', probabilidad: 40 },
  { id: 'le_conviene',      label: 'Le conviene',        emoji: '💰', color: '#84cc16', bgColor: '#f7fee7', probabilidad: 55 },
  { id: 'quien_decide',     label: 'Quién decide',       emoji: '🗺️', color: '#8b5cf6', bgColor: '#f5f3ff', probabilidad: 65 },
  { id: 'le_mostramos',     label: 'Le mostramos',       emoji: '🎪', color: '#ec4899', bgColor: '#fdf2f8', probabilidad: 75 },
  { id: 'cerrando',         label: 'Cerrando',           emoji: '🤝', color: '#f97316', bgColor: '#fff7ed', probabilidad: 85 },
  { id: 'ganado',           label: '¡Ganado!',           emoji: '🏆', color: '#10b981', bgColor: '#ecfdf5', probabilidad: 100 },
  { id: 'perdido',          label: 'Perdido',            emoji: '❌', color: '#ef4444', bgColor: '#fef2f2', probabilidad: 0 },
];

export const PRIORIDAD_CONFIG = {
  alta: { label: 'Alta', color: '#ef4444', bgColor: '#fef2f2' },
  media: { label: 'Media', color: '#f59e0b', bgColor: '#fffbeb' },
  baja: { label: 'Baja', color: '#6b7280', bgColor: '#f3f4f6' },
};

export const ORIGEN_OPTIONS = [
  { value: 'referido', label: 'Referido' },
  { value: 'web', label: 'Web' },
  { value: 'redes_sociales', label: 'Redes Sociales' },
  { value: 'llamada', label: 'Llamada' },
  { value: 'otro', label: 'Otro' },
];

export const ACTIVIDAD_TIPOS = [
  { value: 'nota', label: 'Nota', icon: 'sticky-note' },
  { value: 'llamada', label: 'Llamada', icon: 'phone' },
  { value: 'email', label: 'Email', icon: 'mail' },
  { value: 'reunion', label: 'Reunión', icon: 'users' },
];

// Checklist items per stage transition (soft gates)
export const STAGE_CHECKLIST: Record<string, string[]> = {
  primer_contacto: [
    'Tiene datos de contacto completos',
    'Parece buen candidato',
  ],
  descubrimiento: [
    'Reunión agendada con fecha',
    'Sabemos quién asiste',
    'Preparamos la agenda',
  ],
  entendimos_dolor: [
    'Confirmamos que es buen candidato',
    'Anotamos sus problemas principales',
    'Tiene un siguiente paso definido',
  ],
  le_conviene: [
    'Tiene mínimo 3 cosas que le importan',
    'Sabemos cuánto pierde sin actuar',
  ],
  quien_decide: [
    'Hay un rango de inversión',
    'Sabemos si es urgente para ellos',
  ],
  le_mostramos: [
    'Sabemos quién aprueba la compra',
    'Identificamos un aliado interno',
    'Hay una fecha objetivo de decisión',
  ],
  cerrando: [
    'Hicimos la demo o presentación',
    'El prospecto confirmó que le sirve',
    'Hay un siguiente paso definido',
  ],
  ganado: [
    'Se resolvieron todas las dudas',
    'Hay acuerdo en los términos',
    'Contrato o acuerdo firmado',
  ],
};
