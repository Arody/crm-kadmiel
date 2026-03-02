'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  Search,
  Plus,
  Building2,
  DollarSign,
  UserPlus,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  type Prospecto,
  type EtapaProspecto,
  type AdminUser,
  ETAPAS,
  PRIORIDAD_CONFIG,
} from '@/lib/types';
import ProspectModal from '@/components/ProspectModal';
import StageGateCheck from '@/components/StageGateCheck';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

export default function ProspectosPage() {
  const supabase = createClient();
  const { isSuper, sucursal, loading: userLoading } = useCurrentUser();

  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProspecto, setSelectedProspecto] = useState<Prospecto | null>(null);
  const [defaultEtapa, setDefaultEtapa] = useState<EtapaProspecto>('nuevo');

  // Stage gate state
  const [gateCheck, setGateCheck] = useState<{
    dealId: string;
    fromStage: EtapaProspecto;
    toStage: EtapaProspecto;
    destinationIndex: number;
  } | null>(null);

  const fetchAdminUsers = useCallback(async () => {
    const { data } = await supabase.rpc('get_admin_users');
    if (data) {
      setAdminUsers(data);
    }
  }, [supabase]);

  const fetchProspectos = useCallback(async () => {
    const { data } = await supabase
      .from('crm_prospectos')
      .select('*')
      .order('posicion', { ascending: true })
      .order('created_at', { ascending: false });

    setProspectos(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!userLoading) {
      fetchProspectos();
      fetchAdminUsers();
    }
  }, [userLoading, fetchProspectos, fetchAdminUsers]);

  const filteredProspectos = prospectos.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    const assignedUser = adminUsers.find(u => u.user_id === p.asignado_a);
    const assignedName = assignedUser?.full_name || assignedUser?.email || '';
    return (
      p.nombre.toLowerCase().includes(s) ||
      p.empresa?.toLowerCase().includes(s) ||
      p.email?.toLowerCase().includes(s) ||
      assignedName.toLowerCase().includes(s) ||
      p.sucursal?.toLowerCase().includes(s) ||
      p.dolor_principal?.toLowerCase().includes(s)
    );
  });

  const getProspectosByEtapa = (etapa: EtapaProspecto) =>
    filteredProspectos.filter(p => p.etapa === etapa);

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const fromStage = source.droppableId as EtapaProspecto;
    const toStage = destination.droppableId as EtapaProspecto;

    // Show stage gate check before moving
    setGateCheck({
      dealId: draggableId,
      fromStage,
      toStage,
      destinationIndex: destination.index,
    });
  };

  const confirmStageMove = async () => {
    if (!gateCheck) return;

    const { dealId, toStage, destinationIndex } = gateCheck;

    // Optimistic update
    setProspectos(prev =>
      prev.map(p =>
        p.id === dealId
          ? { ...p, etapa: toStage, posicion: destinationIndex }
          : p
      )
    );

    // Persist
    await supabase
      .from('crm_prospectos')
      .update({ etapa: toStage, posicion: destinationIndex })
      .eq('id', dealId);

    setGateCheck(null);
  };

  const handleAddProspect = (etapa: EtapaProspecto) => {
    setSelectedProspecto(null);
    setDefaultEtapa(etapa);
    setModalOpen(true);
  };

  const handleEditProspect = (prospecto: Prospecto) => {
    setSelectedProspecto(prospecto);
    setModalOpen(true);
  };

  const formatCurrency = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  };

  const getAssignedName = (userId: string | null) => {
    if (!userId) return null;
    const user = adminUsers.find(u => u.user_id === userId);
    return user?.full_name || user?.email?.split('@')[0] || null;
  };

  const getDaysInStage = (prospecto: Prospecto) => {
    const d = prospecto.ultimo_cambio_etapa
      ? new Date(prospecto.ultimo_cambio_etapa)
      : new Date(prospecto.created_at);
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    return days;
  };

  const getDaysColor = (days: number) => {
    if (days <= 7) return '#22c55e';
    if (days <= 14) return '#f59e0b';
    return '#ef4444';
  };

  const totalPipeline = filteredProspectos
    .filter(p => !['ganado', 'perdido'].includes(p.etapa))
    .reduce((sum, p) => sum + (p.valor_estimado || 0), 0);

  if (loading || userLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Pipeline REVERSA</h1>
          <p className="page-subtitle">
            {filteredProspectos.length} prospectos · Pipeline:{' '}
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(totalPipeline)}
            {!isSuper && sucursal && (
              <span style={{ marginLeft: 8, color: '#9ca3af' }}>
                <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                {sucursal}
              </span>
            )}
          </p>
        </div>
        <div className="page-header-actions">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              id="search-prospectos"
              className="search-input"
              placeholder="Buscar prospectos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            id="add-prospecto-btn"
            className="btn btn-primary"
            onClick={() => handleAddProspect('nuevo')}
          >
            <UserPlus size={16} />
            Nuevo prospecto
          </button>
        </div>
      </div>

      <div className="kanban-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {ETAPAS.map((etapa) => {
              const items = getProspectosByEtapa(etapa.id);
              const totalValue = items.reduce((s, p) => s + (p.valor_estimado || 0), 0);
              return (
                <div key={etapa.id} className="kanban-column">
                  <div className="kanban-column-header">
                    <div className="kanban-column-title">
                      <span style={{ fontSize: 16 }}>{etapa.emoji}</span>
                      <span className="kanban-column-name" style={{ fontSize: 11 }}>{etapa.label}</span>
                      <span className="kanban-column-count">{items.length}</span>
                    </div>
                    {totalValue > 0 && (
                      <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>
                        {formatCurrency(totalValue)}
                      </span>
                    )}
                  </div>

                  <Droppable droppableId={etapa.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`kanban-column-body ${
                          snapshot.isDraggingOver ? 'dragging-over' : ''
                        }`}
                      >
                        {items.map((prospecto, index) => {
                          const assignedName = getAssignedName(prospecto.asignado_a);
                          const days = getDaysInStage(prospecto);
                          return (
                            <Draggable
                              key={prospecto.id}
                              draggableId={prospecto.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`prospect-card ${
                                    snapshot.isDragging ? 'dragging' : ''
                                  }`}
                                  onClick={() => handleEditProspect(prospecto)}
                                >
                                  <div className="prospect-card-header">
                                    <span className="prospect-card-name">
                                      {prospecto.nombre}
                                    </span>
                                    <span
                                      className="prospect-card-badge"
                                      style={{
                                        color: PRIORIDAD_CONFIG[prospecto.prioridad].color,
                                        background: PRIORIDAD_CONFIG[prospecto.prioridad].bgColor,
                                      }}
                                    >
                                      {PRIORIDAD_CONFIG[prospecto.prioridad].label}
                                    </span>
                                  </div>
                                  {prospecto.empresa && (
                                    <div className="prospect-card-company">
                                      <Building2 />
                                      {prospecto.empresa}
                                    </div>
                                  )}
                                  {prospecto.dolor_principal && (
                                    <div style={{
                                      fontSize: 11,
                                      color: '#6b7280',
                                      marginBottom: 8,
                                      lineHeight: 1.4,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}>
                                      💡 {prospecto.dolor_principal}
                                    </div>
                                  )}
                                  <div className="prospect-card-footer">
                                    {prospecto.valor_estimado > 0 ? (
                                      <span className="prospect-card-value">
                                        <DollarSign
                                          size={14}
                                          style={{
                                            display: 'inline',
                                            verticalAlign: 'middle',
                                            marginRight: 2,
                                            opacity: 0.5,
                                          }}
                                        />
                                        {new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0 }).format(prospecto.valor_estimado)}
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: 12, color: '#d1d5db' }}>
                                        Sin valor
                                      </span>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      {days > 0 && (
                                        <span style={{
                                          fontSize: 10,
                                          color: getDaysColor(days),
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 2,
                                          fontWeight: 600,
                                        }}>
                                          <Clock size={10} />
                                          {days}d
                                        </span>
                                      )}
                                      {assignedName && (
                                        <span style={{
                                          fontSize: 11,
                                          color: '#9ca3af',
                                          maxWidth: 60,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}>
                                          {assignedName}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {isSuper && prospecto.sucursal && (
                                    <div style={{
                                      marginTop: 6,
                                      fontSize: 10,
                                      color: '#9ca3af',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}>
                                      <MapPin size={10} />
                                      {prospecto.sucursal}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}

                        {items.length === 0 && !search && (
                          <div style={{
                            textAlign: 'center',
                            padding: '20px 12px',
                            color: '#d1d5db',
                            fontSize: 13,
                          }}>
                            Sin prospectos
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>

                  <button
                    className="kanban-add-btn"
                    onClick={() => handleAddProspect(etapa.id)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <ProspectModal
        prospecto={selectedProspecto}
        defaultEtapa={defaultEtapa}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProspecto(null);
        }}
        onSaved={fetchProspectos}
        adminUsers={adminUsers}
        currentUserSucursal={sucursal}
        isSuper={isSuper}
      />

      {gateCheck && (
        <StageGateCheck
          dealId={gateCheck.dealId}
          fromStage={gateCheck.fromStage}
          toStage={gateCheck.toStage}
          isOpen={true}
          onConfirm={confirmStageMove}
          onCancel={() => setGateCheck(null)}
        />
      )}
    </>
  );
}
