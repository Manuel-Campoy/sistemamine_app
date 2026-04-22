import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EstatusProspeccion {
  id: number;
  nombre: string;
  nombreBadge: string;
  icono: string;
  descripcion: string;
  uso: string;
  etapa: string;
  accionSiguiente: React.ReactNode | string; 
  accionSiguienteTexto: string; 
  tipo: React.ReactNode | string;
  tipoTexto: string;
  
  colorPrincipal: string;
  gradienteHeader: string;
  badgeBg: string;
  badgeText: string;
  rowBg?: string; 
}

const ESTATUS_DATA: EstatusProspeccion[] = [
  { 
    id: 1, nombre: 'En Muestreo', nombreBadge: 'En_Muestreo', icono: '🔬', 
    descripcion: 'Etapa inicial del proceso donde se están recolectando muestras del terreno. Se toman muestras sistemáticas para análisis geológico y determinación de ley mineral.',
    uso: 'Cuando un lote está en fase de exploración activa y se están tomando muestras de suelo, roca o material aluvial.',
    etapa: 'Fase inicial - Recolección de muestras en campo',
    accionSiguiente: <>Enviar muestras a laboratorio → <strong>En_Analisis</strong></>,
    accionSiguienteTexto: 'Enviar muestras a laboratorio → En_Analisis',
    tipo: 'Activo', tipoTexto: 'Activo',
    colorPrincipal: '#3b82f6', gradienteHeader: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', badgeBg: '#dbeafe', badgeText: '#1e40af'
  },
  { 
    id: 2, nombre: 'En Análisis', nombreBadge: 'En_Analisis', icono: '🧪', 
    descripcion: 'Las muestras han sido enviadas al laboratorio para análisis químico. Se están determinando leyes, concentraciones y composición mineral.',
    uso: 'Cuando las muestras están en proceso de análisis de laboratorio y se esperan resultados.',
    etapa: 'Análisis de laboratorio en progreso',
    accionSiguiente: <>Recibir resultados → <strong>Estimado_Registrado</strong></>,
    accionSiguienteTexto: 'Recibir resultados → Estimado_Registrado',
    tipo: 'Activo', tipoTexto: 'Activo',
    colorPrincipal: '#8b5cf6', gradienteHeader: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', badgeBg: '#ede9fe', badgeText: '#6b21a8'
  },
  { 
    id: 3, nombre: 'Estimado Registrado', nombreBadge: 'Estimado_Registrado', icono: '📊', 
    descripcion: 'Los resultados de laboratorio han sido recibidos y se ha registrado la estimación de ley, tonelaje y potencial del yacimiento. Pendiente de revisión y autorización.',
    uso: 'Cuando se han completado los análisis y se ha registrado la estimación de recursos minerales.',
    etapa: 'Resultados registrados - Pendiente de revisión',
    accionSiguiente: <>Revisar y decidir → <strong>Autorizado</strong> o <strong>Rechazado</strong></>,
    accionSiguienteTexto: 'Revisar y decidir → Autorizado o Rechazado',
    tipo: 'Activo', tipoTexto: 'Activo',
    colorPrincipal: '#f59e0b', gradienteHeader: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', badgeBg: '#fef3c7', badgeText: '#92400e'
  },
  { 
    id: 4, nombre: 'Autorizado Para Movimiento', nombreBadge: 'Autorizado_Para_Movimiento', icono: '✅', 
    descripcion: 'El lote ha sido aprobado y autorizado para iniciar operaciones de movimiento de tierra y posterior procesamiento. Cumple con los criterios mínimos de ley y viabilidad.',
    uso: 'Cuando el lote ha sido revisado, aprobado y está listo para pasar al módulo de Movimiento de Tierra.',
    etapa: 'Aprobado - Listo para operaciones',
    accionSiguiente: <>Pasar a módulo de <strong>Movimiento de Tierra</strong></>,
    accionSiguienteTexto: 'Pasar a módulo de Movimiento de Tierra',
    tipo: <span style={{ color: '#065f46' }}>✓ Aprobado</span>, tipoTexto: '✓ Aprobado',
    colorPrincipal: '#10b981', gradienteHeader: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', badgeBg: '#d1fae5', badgeText: '#065f46', rowBg: '#f0fdf4'
  },
  { 
    id: 5, nombre: 'Rechazado', nombreBadge: 'Rechazado', icono: '❌', 
    descripcion: 'El lote no cumple con los criterios mínimos de ley mineral o viabilidad económica. No se autoriza para operaciones de extracción. Se documenta el motivo del rechazo.',
    uso: 'Cuando los resultados muestran que el lote no es viable para operación (ley insuficiente, problemas técnicos, etc.).',
    etapa: 'No viable - No cumple criterios mínimos',
    accionSiguiente: 'Documentar motivo y archivar',
    accionSiguienteTexto: 'Documentar motivo y archivar',
    tipo: <span style={{ color: '#991b1b' }}>✗ Rechazado</span>, tipoTexto: '✗ Rechazado',
    colorPrincipal: '#ef4444', gradienteHeader: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', badgeBg: '#fee2e2', badgeText: '#991b1b', rowBg: '#fef2f2'
  },
  { 
    id: 6, nombre: 'Cerrado', nombreBadge: 'Cerrado', icono: '🔒', 
    descripcion: 'El lote ha completado su ciclo de vida y ya no se operará. Puede ser porque se agotó el recurso, se cambió de estrategia o por decisión administrativa.',
    uso: 'Cuando un lote autorizado ha terminado su operación o se decide archivarlo definitivamente.',
    etapa: 'Ciclo completado - Ya no se operará',
    accionSiguiente: 'Sin acción - Registro histórico',
    accionSiguienteTexto: 'Sin acción - Registro histórico',
    tipo: 'Opcional', tipoTexto: 'Opcional',
    colorPrincipal: '#6b7280', gradienteHeader: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', badgeBg: '#f3f4f6', badgeText: '#374151', rowBg: '#f9fafb'
  }
];

export default function EstatusProspeccionList() {
  const [busqueda, setBusqueda] = useState('');

  const estatusFiltrados = ESTATUS_DATA.filter((est) => {
    const termino = busqueda.toLowerCase();
    return (
      est.nombre.toLowerCase().includes(termino) ||
      est.descripcion.toLowerCase().includes(termino) ||
      est.etapa.toLowerCase().includes(termino) ||
      est.uso.toLowerCase().includes(termino)
    );
  });

  const exportarAExcel = () => {
    const datosParaExcel = estatusFiltrados.map(e => ({
      'ID Estatus': e.id,
      'Estatus': e.nombreBadge,
      'Descripción General': e.descripcion,
      'Etapa del Proceso': e.etapa,
      'Acción Siguiente': e.accionSiguienteTexto,
      'Tipo / Condición': e.tipoTexto
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estatus_Prospeccion");
    XLSX.writeFile(workbook, "Catalogo_Estatus_SistemaMine.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF('landscape'); 
    doc.setFontSize(18);
    doc.text("Catálogo de Estatus de Prospección", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = estatusFiltrados.map(e => [
      e.id.toString(),
      e.nombreBadge,
      e.etapa,
      e.accionSiguienteTexto,
      e.tipoTexto
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Estatus', 'Etapa del Proceso', 'Acción Siguiente', 'Tipo']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: { 0: { cellWidth: 15 } }
    });

    doc.save("Catalogo_Estatus_SistemaMine.pdf");
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', background: 'transparent' }}>
      
      <div className="page-header" style={{ background: 'white', borderRadius: '8px 8px 0 0' }}>
        <h1 className="page-title">Catálogo de Estatus de Prospección</h1>
        <p className="page-subtitle">Flujo de trabajo y control de estados en el proceso de prospección minera</p>
      </div>

      <div className="page-content" style={{ background: 'white', borderRadius: '0 0 8px 8px' }}>
        
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar estatus o etapa..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '2px solid var(--gray-200)', borderRadius: '8px' }}
            />
          </div>
          <div className="toolbar-actions" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ color: '#047857', borderColor: '#10b981' }}>
              <span>📊</span> Exportar Excel
            </button>
            <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ color: '#b91c1c', borderColor: '#ef4444' }}>
              <span>📄</span> Exportar PDF
            </button>
          </div>
        </div>

        {estatusFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)', background: 'var(--gray-50)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
            No se encontró ningún estatus que coincida con "{busqueda}".
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '3rem' 
            }}>
              {estatusFiltrados.map((est) => (
                <div key={`card-${est.id}`} style={{ 
                  background: 'white', 
                  border: `3px solid ${est.colorPrincipal}`, 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ background: est.gradienteHeader, padding: '1.5rem', color: 'white', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{est.icono}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem' }}>ID: {est.id} {est.id === 6 && '(Opcional)'}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{est.nombre}</div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--gray-700)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {est.descripcion}
                    </div>
                    <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.5rem' }}>🎯 Cuándo usar:</div>
                      {est.uso}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--gray-800)', paddingBottom: '0.5rem', borderBottom: '2px solid var(--gray-200)' }}>
              Resumen del Flujo de Trabajo
            </h2>
            <div className="table-container" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--gray-100)' }}>
                  <tr>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', width: '100px' }}>ID Estatus</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', width: '60px' }}></th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Descripción Estatus</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Etapa del Proceso</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Acción Siguiente</th>
                    <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', width: '120px' }}>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {estatusFiltrados.map((est, index) => (
                    <tr key={`row-${est.id}`} style={{ background: est.rowBg || 'transparent', borderBottom: index === estatusFiltrados.length - 1 ? 'none' : '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--gray-100)', borderRadius: '6px', fontWeight: 600, color: 'var(--gray-700)' }}>
                          {est.id}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontSize: '1.5rem' }}>{est.icono}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', background: est.badgeBg, color: est.badgeText }}>
                          {est.nombreBadge}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{est.etapa}</td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{est.accionSiguiente}</td>
                      <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--gray-600)' }}>{est.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}