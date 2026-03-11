'use client';

import {
  BookOpen,
  Target,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  MousePointerClick,
  ListChecks,
  MessageSquarePlus,
  ClipboardList,
  TrendingUp,
  Star,
} from 'lucide-react';

const sections = [
  {
    id: 'que-es-crm',
    icon: BookOpen,
    title: '¿Qué es un CRM?',
    color: '#6366f1',
    content: `Un **CRM** (Customer Relationship Management) es un sistema diseñado para gestionar todas las interacciones y relaciones de tu empresa con clientes actuales y potenciales. Su objetivo principal es **mejorar las relaciones comerciales**, ayudándote a retener clientes y a impulsar el crecimiento de tus ventas.`,
    highlights: [
      { icon: Target, text: 'Centraliza toda la información de tus contactos y prospectos en un solo lugar.' },
      { icon: Users, text: 'Permite dar seguimiento personalizado a cada oportunidad de negocio.' },
      { icon: BarChart3, text: 'Visualiza tu embudo de ventas para tomar decisiones basadas en datos.' },
    ],
  },
  {
    id: 'por-que-kadmiel',
    icon: Star,
    title: '¿Por qué Kadmiel CRM?',
    color: '#f59e0b',
    content: `Kadmiel CRM fue diseñado específicamente para empresas del **sector alimentario y de eventos** (banquetes, mesas de postres, rentas de salón, ventas B2B). A diferencia de un CRM genérico, nuestro pipeline de ventas está optimizado con las etapas reales de un cierre comercial en la industria, y cada etapa incluye un **sistema de verificación (Checklist Kadmiel)** que te guía para avanzar correctamente.`,
    highlights: [
      { icon: CheckCircle2, text: 'Pipeline de 4 etapas ajustado al cierre de ventas B2B alimentario.' },
      { icon: ListChecks, text: 'Checklist Kadmiel integrado: no avanzas de etapa sin cumplir los requisitos.' },
      { icon: ClipboardList, text: 'Historial completo de actividades y próximos pasos por cada prospecto.' },
    ],
  },
];

const tutorialSteps = [
  {
    step: 1,
    title: 'Ingresa al Sistema',
    icon: MousePointerClick,
    description: 'Accede con tu correo y contraseña en la pantalla de Login. Al ingresar, serás redirigido al Dashboard principal donde verás un resumen de tu pipeline.',
    tip: 'Tu sesión permanece activa mientras no cierres sesión manualmente.',
  },
  {
    step: 2,
    title: 'Explora el Dashboard',
    icon: BarChart3,
    description: 'El Dashboard muestra las métricas clave de tu pipeline: total de prospectos, prospectos activos, valor estimado, ventas ganadas y tasa de conversión. También verás un desglose por etapa.',
    tip: 'Revisa el Dashboard al inicio de cada día para priorizar tu trabajo.',
  },
  {
    step: 3,
    title: 'Crea un Nuevo Prospecto',
    icon: Users,
    description: 'Ve a la sección "Pipeline" y haz clic en "+ Nuevo Prospecto". Llena los datos del prospecto: empresa, contacto, valor estimado, origen del lead y más. El prospecto aparecerá automáticamente en la primera columna (Calificación).',
    tip: 'Mientras más datos completes al inicio, mejor seguimiento podrás dar.',
  },
  {
    step: 4,
    title: 'Arrastra las Tarjetas entre Etapas',
    icon: ArrowRight,
    description: 'El pipeline funciona con el sistema Kanban: arrastra las tarjetas de izquierda a derecha conforme avanzas en la negociación. Al mover una tarjeta, se activa el Checklist Kadmiel que te pide confirmar que cumples los requisitos de esa etapa.',
    tip: 'No te saltes el checklist. Cada pregunta está diseñada para asegurar que la venta avance correctamente.',
  },
  {
    step: 5,
    title: 'Registra Actividades',
    icon: MessageSquarePlus,
    description: 'Dentro de cada prospecto, ve a la pestaña "Actividades". Usa el campo "¿Qué hice hoy?" para registrar llamadas, reuniones, correos o notas. Todo queda en un historial cronológico para que nunca pierdas contexto.',
    tip: 'Registra cada interacción. Un historial completo es clave para cerrar la venta.',
  },
  {
    step: 6,
    title: 'Define los Próximos Pasos',
    icon: ClipboardList,
    description: 'En la misma pestaña de "Actividades", encontrarás el campo "Próximo paso". Escribe qué harás a continuación y presiona el botón de guardar (💾). Cada paso guardado queda registrado en el historial de "Pasos Anteriores" para auditoría total.',
    tip: 'Siempre define un próximo paso concreto con fecha. Un prospecto sin próximo paso es un prospecto sin seguimiento.',
  },
  {
    step: 7,
    title: 'Cierra la Venta',
    icon: TrendingUp,
    description: 'Cuando la negociación se concrete, arrastra la tarjeta a "Ganado" o, si no se logró, a "No Cerrado". El checklist final te pedirá confirmar que el contrato está firmado y el anticipo recibido. ¡Felicidades por otra venta cerrada!',
    tip: 'Si un prospecto se pierde, registra la razón. Esta información es valiosa para mejorar tu proceso.',
  },
];

export default function AprendizajePage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">📚 Aprendizaje</h1>
          <p className="page-subtitle">Aprende a usar Kadmiel CRM y maximiza tus resultados comerciales</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 48px' }}>

        {/* Secciones Conceptuales */}
        {sections.map((section) => (
          <div key={section.id} style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #e5e7eb',
            padding: '32px 28px',
            marginBottom: 24,
            borderLeft: `4px solid ${section.color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${section.color}15`, color: section.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <section.icon size={22} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
                {section.title}
              </h2>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 20 }}
              dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.highlights.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', background: '#f9fafb', borderRadius: 10,
                }}>
                  <h.icon size={18} style={{ color: section.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#1f2937' }}>{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Tutorial / Guía Paso a Paso */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          padding: '32px 28px',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#10b98115', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lightbulb size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
                Guía de Uso: Paso a Paso
              </h2>
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                Sigue estos 7 pasos para dominar Kadmiel CRM
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {tutorialSteps.map((item, idx) => (
              <div key={item.step} style={{ display: 'flex', gap: 16 }}>
                {/* Timeline line + dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, flexShrink: 0,
                  }}>
                    {item.step}
                  </div>
                  {idx < tutorialSteps.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: 'linear-gradient(to bottom, #6366f1, #e5e7eb)', minHeight: 24 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: idx < tutorialSteps.length - 1 ? 20 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <item.icon size={16} style={{ color: '#6366f1' }} />
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: '#374151', margin: '0 0 8px' }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    padding: '8px 12px', background: '#fffbeb', borderRadius: 8,
                    border: '1px solid #fde68a',
                  }}>
                    <Lightbulb size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                      <strong>Tip:</strong> {item.tip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline visual reference */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          borderRadius: 16,
          padding: '28px 24px',
          color: '#fff',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.3px' }}>
            🚀 Tu Pipeline Kadmiel
          </h3>
          <p style={{ fontSize: 13, color: '#c7d2fe', lineHeight: 1.6, marginBottom: 20 }}>
            Cada prospecto pasa por estas etapas. El checklist integrado asegura que avances de forma correcta.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { emoji: '🔍', label: 'Calificación', color: '#818cf8' },
              { emoji: '📊', label: 'Presentación', color: '#60a5fa' },
              { emoji: '🤝', label: 'Negociación', color: '#fbbf24' },
              { emoji: '📋', label: 'Decisión', color: '#f97316' },
              { emoji: '🏆', label: 'Ganado', color: '#34d399' },
              { emoji: '❌', label: 'No Cerrado', color: '#f87171' },
            ].map((etapa, i) => (
              <div key={i} style={{
                flex: '1 1 120px',
                background: `${etapa.color}20`,
                border: `1px solid ${etapa.color}40`,
                borderRadius: 10,
                padding: '12px 14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{etapa.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: etapa.color, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {etapa.label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', background: '#4f46e520', borderRadius: 20,
              fontSize: 11, color: '#a5b4fc', fontWeight: 600,
            }}>
              <ArrowRight size={14} />
              Arrastra las tarjetas de izquierda a derecha para avanzar
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
