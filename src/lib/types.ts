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
  // KADMIEL fields
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

export interface ProximoPaso {
  id: string;
  prospecto_id: string;
  descripcion: string;
  fecha_objetivo: string | null;
  created_at: string;
  created_by: string | null;
}

export type EtapaProspecto =
  | 'calificacion'
  | 'presentacion'
  | 'negociacion'
  | 'decision'
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
  { id: 'calificacion', label: 'Calificación', emoji: '🎯', color: '#06b6d4', bgColor: '#ecfeff', probabilidad: 10 },
  { id: 'presentacion', label: 'Presentación', emoji: '🤝', color: '#8b5cf6', bgColor: '#f5f3ff', probabilidad: 40 },
  { id: 'negociacion', label: 'Negociación', emoji: '⚖️', color: '#f59e0b', bgColor: '#fffbeb', probabilidad: 70 },
  { id: 'decision', label: 'Decisión Final', emoji: '⏰', color: '#f97316', bgColor: '#fff7ed', probabilidad: 90 },
  { id: 'ganado', label: '¡Ganado!', emoji: '🏆', color: '#10b981', bgColor: '#ecfdf5', probabilidad: 100 },
  { id: 'perdido', label: 'Perdido', emoji: '❌', color: '#ef4444', bgColor: '#fef2f2', probabilidad: 0 },
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
  presentacion: [
    'Confirmar tipo de evento o volumen de compra',
    'Descalificación temprana: "Si el precio no encaja, ¿avisan hoy?"',
    'Agenda y fecha confirmada para demostración/visita',
  ],
  negociacion: [
    'El "Sí No" de la prueba: Feedback claro del degustación/servicio',
    'Aislamiento de Objeciones: ¿Hay algún otro impedimento?',
    'Presupuesto formal / Propuesta enviada al tomador de decisión',
  ],
  decision: [
    'Miedo a la Pérdida: "¿Podrían avisarme para liberar esta fecha/stock?"',
    'Validación de Decisores: Todos los involucrados dieron el OK',
    'Contrato y términos legales enviados para revisión',
  ],
  ganado: [
    'Cierre Kadmiel: "¿Avanzamos con el acuerdo o lo cerramos por hoy?"',
    'Contrato y/o acuerdo comercial firmado',
    'Anticipo o depósito en firme recibido',
  ],
};
