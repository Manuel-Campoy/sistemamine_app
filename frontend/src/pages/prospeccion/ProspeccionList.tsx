import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNotification } from '../../hooks/useNotification'; 

interface Lote {
  idarealote: string;
  nombrealias: string;
  idestatusprospeccion: string;
  fecharegistro: string;
  fechayhoramuestreo: string | null;
  leyestimada: number | null;
  tonelajeestimado: number | null;
  coordenadas: any[] | null;
  estatus: {
    descripcion: string;
  };
  responsable: {
    nombre: string;
    apellidopaterno: string;
  };
  mina: {
    aliasmina: string;
  };
}

export default function ProspeccionList() {
  const navigate = useNavigate();
  const { success, error, loading, dismiss } = useNotification(); 

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(''); 
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendientesSync, setPendientesSync] = useState(0);

  useEffect(() => {
    cargarLotes();
    verificarColaOffline();

    const handleOnline = () => { setIsOnline(true); sincronizarPendientes(); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cargarLotes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/prospeccion');
      setLotes(response.data.data || []); 
      setErrorMsg(''); 
    } catch (err: any) {
      if (!navigator.onLine) {
        setErrorMsg('Mostrando datos en caché (Offline)');
      } else {
        const mensaje = err.response?.data?.error || err.message || 'Error al conectar con el servidor';
        setErrorMsg(mensaje);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verificarColaOffline = () => {
    const queueStr = localStorage.getItem('prospeccionSyncQueue');
    if (queueStr) {
      const queue = JSON.parse(queueStr);
      setPendientesSync(queue.length);
    }
  };

  const sincronizarPendientes = async () => {
    localStorage.removeItem('prospeccionSyncQueue');
    setPendientesSync(0);
    cargarLotes(); 
  };

  const lotesFiltrados = lotes.filter(l => 
    (l.nombrealias || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (l.idarealote || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const stats = {
    total: lotes.length,
    muestreo: lotes.filter(l => l.estatus?.descripcion === 'En Muestreo').length,
    analisis: lotes.filter(l => l.estatus?.descripcion === 'En Analisis').length,
    estimado: lotes.filter(l => l.estatus?.descripcion === 'Estimado Registrado').length,
    autorizados: lotes.filter(l => l.estatus?.descripcion === 'Autorizado Para Movimiento').length,
    rechazados: lotes.filter(l => l.estatus?.descripcion === 'Rechazado').length,
  };

  const getStatusInfo = (descripcionEstatus: string) => {
    switch(descripcionEstatus) {
      case 'En Muestreo': return { color: '#3b82f6', bg: '#dbeafe', label: descripcionEstatus, icon: '🔬' };
      case 'En Analisis': return { color: '#8b5cf6', bg: '#ede9fe', label: descripcionEstatus, icon: '🧪' };
      case 'Estimado Registrado': return { color: '#f59e0b', bg: '#fef3c7', label: descripcionEstatus, icon: '📊' };
      case 'Autorizado Para Movimiento': return { color: '#10b981', bg: '#d1fae5', label: 'Autorizado', icon: '✅' };
      case 'Rechazado': return { color: '#ef4444', bg: '#fee2e2', label: descripcionEstatus, icon: '❌' };
      case 'Cerrado': return { color: '#6b7280', bg: '#f3f4f6', label: descripcionEstatus, icon: '🔒' };
      default: return { color: '#6b7280', bg: '#f3f4f6', label: descripcionEstatus || 'Desconocido', icon: '❓' };
    }
  };

  const exportarAExcel = () => {
    if (lotesFiltrados.length === 0) {
      return error('No hay datos para exportar en este momento.', { icon: '⚠️' });
    }

    loading("Generando archivo Excel...", "export-prosp-excel");

    try {
      const datosExcel = lotesFiltrados.map(lote => ({
        'ID Lote': lote.idarealote,
        'Mina': lote.mina?.aliasmina || 'N/A',
        'Nombre': lote.nombrealias,
        'Estado': getStatusInfo(lote.estatus?.descripcion).label,
        'Fecha Registro': new Date(lote.fecharegistro).toLocaleDateString(),
        'Fecha Muestreo': lote.fechayhoramuestreo ? new Date(lote.fechayhoramuestreo).toLocaleDateString() : 'N/A',
        'Responsable': lote.responsable ? `${lote.responsable.nombre} ${lote.responsable.apellidopaterno}` : 'N/A',
        'Ley Estimada (g/t)': lote.leyestimada || 'N/A',
        'Tonelaje (t)': lote.tonelajeestimado || 'N/A',
        'Coordenadas GPS': Array.isArray(lote.coordenadas) ? lote.coordenadas.length : 0
      }));

      const ws = XLSX.utils.json_to_sheet(datosExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Prospección');
      
      ws['!cols'] = [
        { wch: 40 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
      ];
      
      XLSX.writeFile(wb, `prospeccion_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      dismiss("export-prosp-excel");
      success('Excel generado exitosamente', { icon: '📊' });
    } catch (err) {
      dismiss("export-prosp-excel");
      error('Error al generar el Excel');
    }
  };

  const exportarAPDF = () => {
    if (lotesFiltrados.length === 0) {
      return error('No hay datos para exportar en este momento.', { icon: '⚠️' });
    }

    loading("Estructurando documento PDF...", "export-prosp-pdf");

    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('Prospección - Áreas y Lotes', 14, 10);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 20);
      
      const datosTabla = lotesFiltrados.map(lote => [
        lote.idarealote.substring(0, 8).toUpperCase(),
        lote.nombrealias,
        getStatusInfo(lote.estatus?.descripcion).label,
        lote.fechayhoramuestreo ? new Date(lote.fechayhoramuestreo).toLocaleDateString() : 'Pendiente',
        lote.leyestimada ? `${lote.leyestimada} g/t` : 'N/A',
        lote.tonelajeestimado ? `${lote.tonelajeestimado} t` : 'N/A'
      ]);

      autoTable(doc, {
        head: [['ID', 'Nombre', 'Estado', 'Fecha Muestreo', 'Ley Estimada', 'Tonelaje']],
        body: datosTabla,
        startY: 28,
        margin: { top: 28 },
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [41, 57, 86], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      doc.save(`prospeccion_${new Date().toISOString().split('T')[0]}.pdf`);
      
      dismiss("export-prosp-pdf");
      success('PDF generado exitosamente', { icon: '📄' });
    } catch (err) {
      dismiss("export-prosp-pdf");
      error('Error al crear el PDF');
    }
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      {!isOnline && (
        <div style={{ background: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
          <span>📡</span> Modo Offline - {pendientesSync} registros pendientes de sincronización
        </div>
      )}
      {isOnline && pendientesSync > 0 && (
        <div style={{ background: '#10b981', color: 'white', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
          <span>🔄</span> Conexión recuperada. Sincronizando {pendientesSync} registros...
        </div>
      )}

      <div className="page-header" style={{ background: 'white', padding: '2rem', borderBottom: '2px solid var(--gray-200)' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Prospección - Áreas y Lotes</h1>
        <p className="page-subtitle" style={{ color: 'var(--gray-600)' }}>Registro y seguimiento de lotes en proceso de prospección</p>
      </div>

      <div className="page-content" style={{ background: 'white', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: '📋', val: stats.total, label: 'Lotes Totales' },
            { icon: '🔬', val: stats.muestreo, label: 'En Muestreo' },
            { icon: '🧪', val: stats.analisis, label: 'En Análisis' },
            { icon: '📊', val: stats.estimado, label: 'Estimado' },
            { icon: '✅', val: stats.autorizados, label: 'Autorizados' },
            { icon: '❌', val: stats.rechazados, label: 'Rechazados' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', fontWeight: 500, marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input type="text" className="search-input" placeholder="Buscar lote por nombre o ID..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ borderRadius: '8px' }}>📊 Excel</button>
            <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ borderRadius: '8px' }}>📄 PDF</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/prospeccion/nuevo')} style={{ borderRadius: '8px' }}>➕ Nuevo Lote</button>
          </div>
        </div>

        {isLoading ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary-blue)', fontWeight: 600 }}>Cargando lotes de prospección...</div> : 
         errorMsg && isOnline ? <div className="alert alert-error">⚠️ {errorMsg}</div> : 
         lotesFiltrados.length === 0 ? <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--gray-50)', borderRadius: '12px', color: 'var(--gray-500)' }}>No hay lotes registrados o que coincidan con tu búsqueda.</div> : (
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {lotesFiltrados.map((lote) => {
              const status = getStatusInfo(lote.estatus?.descripcion);
              const totalCoords = Array.isArray(lote.coordenadas) ? lote.coordenadas.length : 0;

              return (
                <div key={lote.idarealote} style={{ background: 'white', border: '1px solid #e2e8f0', borderLeft: `5px solid ${status.color}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  
                  <div style={{ padding: '1.25rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontFamily: 'monospace' }}>ID: {lote.idarealote.substring(0,8).toUpperCase()}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>{lote.nombrealias}</div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: status.bg, color: status.color }}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: '#d1fae5', color: '#065f46', borderRadius: '8px', fontWeight: 600 }}>
                      ✓ Sincronizado
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Fecha Muestreo</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{lote.fechayhoramuestreo ? new Date(lote.fechayhoramuestreo).toLocaleDateString() : 'Pendiente'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Responsable</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                          {lote.responsable ? `${lote.responsable.nombre} ${lote.responsable.apellidopaterno}` : 'Desconocido'}
                        </div>
                      </div>
                      
                      {lote.estatus?.descripcion === 'Estimado Registrado' || lote.estatus?.descripcion === 'Autorizado Para Movimiento' ? (
                        <>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Ley Estimada</div>
                            <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.875rem' }}>{lote.leyestimada ? `${lote.leyestimada} g/t` : 'N/A'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Tonelaje</div>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{lote.tonelajeestimado ? `${lote.tonelajeestimado} t` : 'N/A'}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Coordenadas GPS</div>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{totalCoords} puntos</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '1rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      {lote.estatus?.descripcion === 'Estimado Registrado' && <span style={{color: '#f59e0b'}}>⚠️ Pendiente de Autorizar</span>}
                      {lote.estatus?.descripcion === 'Autorizado Para Movimiento' && <span style={{color: '#10b981'}}>✓ Listo para Movimiento</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }} onClick={() => navigate(`/dashboard/prospeccion/editar/${lote.idarealote}`)}>✏️ Evaluar</button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        )}
      </div>
    </div>
  );
}