import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import { useAuth } from '../../context/AuthContext'; 
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { socket } from '../../api/socket'; 
import { useNotification } from '../../hooks/useNotification'; 

interface CicloProduccion {
  idciclo: string;
  numerociclo: number;
  loteAlias: string;
  fecha: string;
  turno: string;
  inicio: string;
  fin: string | null;
  toneladas: number;
  ley: number;
  recuperacion: number;
  oroEstimado: number;
  oroObtenido: number | null;
  colas: number | null;
  estado: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Deshabilitado';
  observaciones: string;
  trazabilidad: {
    pendiente: string; 
    proceso?: string;
    finalizado?: string;
  }
}

export default function ProduccionList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, loading, dismiss } = useNotification(); 
  
  const [ciclos, setCiclos] = useState<CicloProduccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [errorMsg, setErrorMsg] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [turnoFiltro, setTurnoFiltro] = useState('Todos');

  const [showModalLote, setShowModalLote] = useState(false);
  const [lotesDisponibles, setLotesDisponibles] = useState<any[]>([]);
  const [loteElegido, setLoteElegido] = useState('');
  const [cargandoLotes, setCargandoLotes] = useState(false);

  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [modoModal, setModoModal] = useState<'consulta' | 'edicion'>('consulta');
  const [cicloActivo, setCicloActivo] = useState<CicloProduccion | null>(null);
  
  const [formEdicion, setFormEdicion] = useState({
    toneladas: '', ley: '', recuperacion: '', observaciones: ''
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    cargarCiclos();
    
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  const cargarCiclos = async (silencioso = false) => {
    if (!silencioso) setIsLoading(true);
    if (!silencioso) setErrorMsg('');
    try {
      const res = await api.get('/produccion/ciclos');


      const ciclosArray = res.data.data || [];
      const datosMapeados: CicloProduccion[] = ciclosArray.map((c: any) => ({
        idciclo: c.idciclo,
        numerociclo: c.numerociclo,
        loteAlias: c.prospeccion?.nombrealias || 'Lote Desconocido',
        fecha: new Date(c.fechaoperacion).toLocaleDateString(),
        turno: c.turno,
        inicio: new Date(c.fechahorainicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        fin: c.fechahorafin ? new Date(c.fechahorafin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null,
        toneladas: Number(c.toneladasprocesadas) || 0,
        ley: Number(c.leyciclo) || 0,
        recuperacion: Number(c.recuperacionporcentaje) || 0,
        oroEstimado: Number(c.oroestimadogramos) || 0,
        oroObtenido: c.oroobtenidogramos ? Number(c.oroobtenidogramos) : null,
        colas: c.colastoneladas ? Number(c.colastoneladas) : null,
        estado: c.estado || 'Pendiente',
        observaciones: c.observaciones || '',
        trazabilidad: {
          pendiente: c.usuarioRegistra ? `${c.usuarioRegistra.nombre} ${c.usuarioRegistra.apellidopaterno}` : 'Sistema',
          proceso: c.usuarioEnProceso ? `${c.usuarioEnProceso.nombre} ${c.usuarioEnProceso.apellidopaterno}` : '-',
          finalizado: c.usuarioFinalizado ? `${c.usuarioFinalizado.nombre} ${c.usuarioFinalizado.apellidopaterno}` : '-'
        }
      }));
      
      setCiclos(datosMapeados);
    } catch (err: any) {
      if (!navigator.onLine) {
        if (!silencioso) setErrorMsg('Estás sin conexión. No se pudieron actualizar los registros.');
      } else {
        if (!silencioso) setErrorMsg(err.response?.data?.error || "Error al cargar los ciclos de producción");
      }
    } finally {
      if (!silencioso) setIsLoading(false);
    }
  };

  useEffect(() => {
    const recargarTablaSilenciosamente = () => {
      if (navigator.onLine) {
        cargarCiclos(true); 
      }
    };

    socket.on('nueva_produccion', recargarTablaSilenciosamente);

    return () => {
      socket.off('nueva_produccion', recargarTablaSilenciosamente);
    };
  }, []);

  const abrirModalSeleccionLote = async () => {
    setShowModalLote(true);
    setCargandoLotes(true);
    try {
      const res = await api.get('/prospeccion');
      const lotesArray = Array.isArray(res.data) 
        ? res.data 
        : (res.data.data || []);
      setLotesDisponibles(lotesArray);
      if (lotesArray.length > 0) {
        setLoteElegido(lotesArray[0].idarealote); 
      }
    } catch (err) {
      console.error("Error al cargar lotes", err);
    } finally {
      setCargandoLotes(false);
    }
  };

  const avanzarEstatus = async (id: string, accion: 'En Proceso' | 'Finalizado' | 'Deshabilitado') => {
    const accionTexto = accion === 'En Proceso' ? 'INICIAR PROCESO' : accion === 'Finalizado' ? 'FINALIZAR' : 'DESHABILITAR';
    let motivo = '';
    
    if (accion === 'Deshabilitado') {
        const respuesta = window.prompt(`¿Por qué deseas deshabilitar el ciclo ${id.substring(0,8).toUpperCase()}?`);
        if (!respuesta) return; 
        motivo = respuesta;
    } else {
        if (!window.confirm(`¿Confirmas que deseas ${accionTexto} el ciclo ${id.substring(0,8).toUpperCase()}?`)) return;
    }
    
    loading("Actualizando estatus...", "estatus-update");
    try {
      await api.put(`/produccion/ciclos/${id}/estatus`, { estado: accion, idusuario: user?.id, motivodeshabilitado: motivo });
      cargarCiclos(true); 
      dismiss("estatus-update");
      success(`Ciclo marcado como ${accion}`, { icon: accion === 'En Proceso' ? '🔄' : (accion === 'Finalizado' ? '✅' : '❌') });
    } catch (err: any) {
      dismiss("estatus-update");
      error(err.response?.data?.error || "Error al actualizar el estatus del ciclo");
    }
  };

  const handleAbrirConsulta = (ciclo: CicloProduccion) => {
    setCicloActivo(ciclo);
    setModoModal('consulta');
    setShowDetalleModal(true);
  };

  const handleAbrirEdicion = (ciclo: CicloProduccion) => {
    setCicloActivo(ciclo);
    setFormEdicion({
      toneladas: ciclo.toneladas.toString(),
      ley: ciclo.ley.toString(),
      recuperacion: ciclo.recuperacion.toString(),
      observaciones: ciclo.observaciones || ''
    });
    setModoModal('edicion');
    setShowDetalleModal(true);
  };

  const guardarEdicion = async () => {
    if (!cicloActivo) return;
    
    const tons = parseFloat(formEdicion.toneladas) || 0;
    const leyGt = parseFloat(formEdicion.ley) || 0;
    const recup = parseFloat(formEdicion.recuperacion) || 0;

    if (tons <= 0 || leyGt <= 0) return error('Ingresa toneladas y ley válidas.', { icon: '⚖️' }); 

    const oroEstimado = tons * leyGt * (recup / 100);
    const colasGeneradas = tons - (oroEstimado / 1000000);

    setIsSavingEdit(true);
    loading("Guardando cambios...", "guardar-edicion"); 

    try {
      await api.put(`/produccion/ciclos/${cicloActivo.idciclo}`, {
        toneladasprocesadas: tons,
        leyciclo: leyGt,
        recuperacionporcentaje: recup,
        oroestimadogramos: oroEstimado,
        colastoneladas: colasGeneradas,
        observaciones: formEdicion.observaciones
      });
      dismiss("guardar-edicion");
      success('Ciclo actualizado correctamente', { icon: '💾' }); 
      setShowDetalleModal(false);
      cargarCiclos(true);
    } catch (err) {
      dismiss("guardar-edicion");
      error('Error al guardar la edición'); 
    } finally {
      setIsSavingEdit(false);
    }
  };

  const ciclosFiltrados = ciclos.filter(c => {
    const cumpleBusqueda = c.idciclo.toLowerCase().includes(busqueda.toLowerCase()) || 
                           c.loteAlias.toLowerCase().includes(busqueda.toLowerCase()) ||
                           (c.observaciones && c.observaciones.toLowerCase().includes(busqueda.toLowerCase()));
    
    const cumpleTurno = turnoFiltro === 'Todos' || c.turno === turnoFiltro;
    
    let cumpleFechas = true;
    if (fechaInicio && fechaFin) {
      const partesFecha = c.fecha.split('/');
      const fechaCicloObj = new Date(`${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`).getTime();
      const inicio = new Date(fechaInicio).getTime();
      const fin = new Date(fechaFin).getTime();
      cumpleFechas = fechaCicloObj >= inicio && fechaCicloObj <= fin;
    }

    return cumpleBusqueda && cumpleTurno && cumpleFechas;
  });

  const exportarAExcel = () => {
    if (ciclosFiltrados.length === 0) return error('No hay datos para exportar en este momento.', { icon: '⚠️' }); 
    
    const datosExcel = ciclosFiltrados.map(ciclo => ({
      'Ciclo': ciclo.idciclo.substring(0,8).toUpperCase(),
      'Lote': ciclo.loteAlias,
      'Fecha': ciclo.fecha,
      'Turno': ciclo.turno,
      'Inicio': ciclo.inicio,
      'Fin': ciclo.fin || '-',
      'Toneladas': ciclo.toneladas,
      'Ley (g/t)': ciclo.ley,
      'Recuperación %': ciclo.recuperacion,
      'Oro Estimado (g)': ciclo.oroEstimado,
      'Oro Obtenido (g)': ciclo.oroObtenido || '-',
      'Colas (t)': ciclo.colas || '-',
      'Estado': ciclo.estado,
      'Usuario Pendiente': ciclo.trazabilidad.pendiente,
      'Usuario Proceso': ciclo.trazabilidad.proceso || '-',
      'Usuario Finalizado': ciclo.trazabilidad.finalizado || '-',
      'Observaciones': ciclo.observaciones || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(datosExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Producción');
    ws['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 15 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 30 }];
    XLSX.writeFile(wb, `Produccion_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    success("¡Documento Excel descargado correctamente!", { icon: '📊' }); 
  };

  const exportarAPDF = () => {
    if (ciclosFiltrados.length === 0) return error('No hay datos para exportar en este momento.', { icon: '⚠️' }); 
    
    const doc = new jsPDF('l', 'mm', 'a4'); 
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16);
    doc.text('Reporte de Control de Producción', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, pageWidth / 2, 22, { align: 'center' });

    const datosTabla = ciclosFiltrados.map(ciclo => [
      ciclo.idciclo.substring(0, 8).toUpperCase(), ciclo.loteAlias, ciclo.fecha, ciclo.turno, ciclo.toneladas.toString(), ciclo.ley.toString(), ciclo.recuperacion + '%', ciclo.oroEstimado.toString(), ciclo.oroObtenido?.toString() || '-', ciclo.estado, ciclo.trazabilidad.pendiente
    ]);

    autoTable(doc, {
      head: [['Ciclo', 'Lote', 'Fecha', 'Turno', 'Tons', 'Ley g/t', 'Recup %', 'Oro Est (g)', 'Oro Obt (g)', 'Estado', 'Usuario']],
      body: datosTabla, startY: 28, theme: 'grid', styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 28, right: 10, bottom: 10, left: 10 }
    });
    doc.save(`Produccion_${new Date().toISOString().split('T')[0]}.pdf`);
    
    success("¡Documento PDF descargado correctamente!", { icon: '📄' }); 
  };

  const btnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '34px', height: '34px', borderRadius: '8px',
    background: 'white', border: '1px solid var(--gray-300)',
    cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1.1rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' }}>
      {showDetalleModal && cicloActivo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {modoModal === 'consulta' ? '🔍 Detalle del Ciclo' : '✍️ Editar Ciclo'}
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--gray-600)' }}>ID: {cicloActivo.idciclo.substring(0,8).toUpperCase()} • {cicloActivo.loteAlias}</p>
              </div>
              <span style={{ background: 'var(--primary-blue)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {cicloActivo.estado}
              </span>
            </div>

            {modoModal === 'consulta' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: '12px' }}>
                  <div><span style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Fecha y Turno</span><br/><strong>{cicloActivo.fecha} • {cicloActivo.turno}</strong></div>
                  <div><span style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Horario</span><br/><strong>{cicloActivo.inicio} a {cicloActivo.fin || 'Pendiente'}</strong></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div style={{ border: '1px solid var(--gray-200)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Toneladas</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gray-800)' }}>{cicloActivo.toneladas.toFixed(2)} t</div>
                  </div>
                  <div style={{ border: '1px solid var(--gray-200)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Ley Mineral</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{cicloActivo.ley.toFixed(2)} g/t</div>
                  </div>
                  <div style={{ border: '1px solid var(--gray-200)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Recuperación</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gray-800)' }}>{cicloActivo.recuperacion}%</div>
                  </div>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ color: '#d97706', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Oro Estimado a Recuperar</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#b45309' }}>{cicloActivo.oroEstimado.toFixed(2)} g</div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-700)' }}>Observaciones</h4>
                  <p style={{ margin: 0, color: 'var(--gray-600)', background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px' }}>
                    {cicloActivo.observaciones || 'Sin observaciones registradas.'}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#eff6ff', color: '#1e40af', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  ℹ️ Al guardar, los valores de Oro Estimado y Colas se recalcularán automáticamente.
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Toneladas (t)</label>
                    <input type="number" step="0.01" className="form-input" value={formEdicion.toneladas} onChange={e=>setFormEdicion({...formEdicion, toneladas: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label className="form-label">Ley (g/t)</label>
                    <input type="number" step="0.01" className="form-input" value={formEdicion.ley} onChange={e=>setFormEdicion({...formEdicion, ley: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label className="form-label">Recuperación (%)</label>
                    <input type="number" step="0.01" className="form-input" value={formEdicion.recuperacion} onChange={e=>setFormEdicion({...formEdicion, recuperacion: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-input" rows={3} value={formEdicion.observaciones} onChange={e=>setFormEdicion({...formEdicion, observaciones: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}></textarea>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowDetalleModal(false)}>Cerrar</button>
              {modoModal === 'edicion' && (
                <button className="btn btn-primary" onClick={guardarEdicion} disabled={isSavingEdit}>
                  {isSavingEdit ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {showModalLote && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'fadeIn 0.2s ease-out' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', background: 'var(--gray-100)', padding: '0.75rem', borderRadius: '12px' }}>⚗️</div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>Seleccionar Lote</h3>
            </div>
            
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Elige de la lista el material que vas a procesar en este momento en la planta.
            </p>

            {cargandoLotes ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                Consultando inventario...
              </div>
            ) : (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Lote / Área Disponible</label>
                <select 
                  className="form-select" 
                  value={loteElegido} 
                  onChange={e => setLoteElegido(e.target.value)} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--gray-300)', fontSize: '1.1rem', backgroundColor: '#f8fafc' }}
                >
                  <option value="" disabled>Selecciona un lote...</option>
                  {lotesDisponibles.map(l => (
                    <option key={l.idarealote} value={l.idarealote}>
                      {l.nombrealias} (ID: {l.idarealote.substring(0,6).toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '12px', fontWeight: 600 }} onClick={() => setShowModalLote(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={!loteElegido || cargandoLotes} onClick={() => { setShowModalLote(false); navigate(`/dashboard/produccion/operacion/${loteElegido}`); }}>
                Continuar <span>→</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {!isOnline && (
        <div style={{ background: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', fontWeight: 600 }}>
          Modo Offline Activo - No se pueden actualizar los estados sin conexión
        </div>
      )}

      <div className="page-header" style={{ background: 'white', padding: '2rem', borderBottom: '2px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem', margin: 0 }}>
            Control de Producción 
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--gray-600)', margin: 0, marginTop: '0.5rem' }}>Monitoreo general de todos los ciclos de procesamiento en Planta.</p>
        </div>
        
        <div>
          <button 
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(37,99,235,0.2)', border: 'none', background: 'var(--primary-blue)', color: 'white', cursor: 'pointer', fontWeight: 600 }}
            onClick={abrirModalSeleccionLote}
          >
            Ir a Operación en Planta
          </button>
        </div>
      </div>

      <div className="page-content" style={{ background: 'white', padding: '2rem' }}>
        {errorMsg && <div className="alert alert-error" style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>⚠️ {errorMsg}</div>}

        <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--gray-200)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '1rem' }}>🔍 Búsqueda y Filtros</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Descripción General</label>
              <input type="text" className="form-input" placeholder="Ciclo, Lote u Observación..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}/>
            </div>
            <div>
              <label className="form-label">Turno</label>
              <select className="form-select" value={turnoFiltro} onChange={e => setTurnoFiltro(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                <option value="Todos">Todos los turnos</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Nocturno">Nocturno</option>
              </select>
            </div>
            <div>
              <label className="form-label">Fecha Inicio</label>
              <input type="date" className="form-input" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}/>
            </div>
            <div>
              <label className="form-label">Fecha Fin</label>
              <input type="date" className="form-input" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}/>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', padding: '0.5rem' }}>Guía de Iconos:</span>
            <span title="Avanzar a En Proceso" style={{ padding: '0.5rem', background: 'var(--gray-100)', borderRadius: '4px', fontSize: '0.85rem' }}>🔄 Proceso</span>
            <span title="Marcar como Finalizado" style={{ padding: '0.5rem', background: 'var(--gray-100)', borderRadius: '4px', fontSize: '0.85rem' }}>✅ Finalizar</span>
            <span title="Editar" style={{ padding: '0.5rem', background: 'var(--gray-100)', borderRadius: '4px', fontSize: '0.85rem' }}>✍️ Editar</span>
            <span title="Deshabilitar" style={{ padding: '0.5rem', background: 'var(--gray-100)', borderRadius: '4px', fontSize: '0.85rem' }}>❌ Deshabilitar</span>
            <span title="Consulta de Detalle" style={{ padding: '0.5rem', background: 'var(--gray-100)', borderRadius: '4px', fontSize: '0.85rem' }}>🔍 Consultar</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ borderColor: '#10b981', color: '#065f46', background: 'white', padding: '0.5rem 1rem', borderRadius: '6px' }}>📊 Excel</button>
            <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ borderColor: '#ef4444', color: '#991b1b', background: 'white', padding: '0.5rem 1rem', borderRadius: '6px' }}>📄 PDF</button>
          </div>
        </div>

        <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', minWidth: '1500px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--gray-100)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', position: 'sticky', left: 0, background: 'var(--gray-100)', zIndex: 10 }}>Ciclo / Lote</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Turno y Fechas</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Valores de Extracción</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Resultados</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Trazabilidad</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Observaciones</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', textAlign: 'center', position: 'sticky', right: 0, background: 'var(--gray-100)', zIndex: 10 }}>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary-blue)', fontWeight: 600 }}>Cargando datos de producción...</td></tr>
              ) : ciclosFiltrados.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>No hay ciclos de producción registrados</td></tr>
              ) : (
                ciclosFiltrados.map((ciclo, index) => (
                  <tr key={ciclo.idciclo} style={{ borderBottom: '1px solid var(--gray-200)', background: ciclo.estado === 'Deshabilitado' ? '#fef2f2' : (index % 2 === 0 ? 'white' : 'var(--gray-50)') }}>
                    
                    <td style={{ padding: '1rem', position: 'sticky', left: 0, background: ciclo.estado === 'Deshabilitado' ? '#fef2f2' : (index % 2 === 0 ? 'white' : 'var(--gray-50)'), zIndex: 1, borderRight: '1px solid var(--gray-200)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.9rem' }}>{ciclo.idciclo.substring(0,8).toUpperCase()}</div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: '0.8rem' }}>{ciclo.loteAlias}</div>
                      <div style={{ marginTop: '0.5rem' }}>
                        {ciclo.estado === 'Pendiente' && <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600 }}>Pendiente</span>}
                        {ciclo.estado === 'En Proceso' && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600 }}>⚙️ En Proceso</span>}
                        {ciclo.estado === 'Finalizado' && <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600 }}>✅ Finalizado</span>}
                        {ciclo.estado === 'Deshabilitado' && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600 }}>🚫 Deshabilitado</span>}
                      </div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--gray-700)' }}>
                      <div style={{ fontWeight: 600 }}>{ciclo.fecha} • {ciclo.turno}</div>
                      <div><strong>Inicio:</strong> {ciclo.inicio}</div>
                      <div><strong>Fin:</strong> {ciclo.fin || '-'}</div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div><span style={{ color: 'var(--gray-500)' }}>Tons:</span> <strong>{ciclo.toneladas.toFixed(2)}</strong></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Ley:</span> <strong style={{ color: 'var(--primary-blue)' }}>{ciclo.ley.toFixed(2)} g/t</strong></div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div><span style={{ color: 'var(--gray-500)' }}>Recup:</span> <strong>{ciclo.recuperacion}%</strong></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Oro Est:</span> <strong style={{ color: '#d97706' }}>{ciclo.oroEstimado.toFixed(2)} g</strong></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Oro Obt:</span> <strong style={{ color: 'var(--success-green)' }}>{ciclo.oroObtenido ? ciclo.oroObtenido.toFixed(2) : '-'} g</strong></div>
                        <div><span style={{ color: 'var(--gray-500)' }}>Colas:</span> <strong>{ciclo.colas ? ciclo.colas.toFixed(2) : '-'} t</strong></div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div title="Pendiente">👤 {ciclo.trazabilidad.pendiente}</div>
                        {ciclo.trazabilidad.proceso && <div title="En Proceso">⚙️ {ciclo.trazabilidad.proceso}</div>}
                        {ciclo.trazabilidad.finalizado && <div title="Finalizado">✅ {ciclo.trazabilidad.finalizado}</div>}
                      </div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--gray-700)', maxWidth: '200px' }}>
                      {ciclo.observaciones || <span style={{ color: 'var(--gray-400)' }}>Sin observaciones</span>}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'center', position: 'sticky', right: 0, background: ciclo.estado === 'Deshabilitado' ? '#fef2f2' : (index % 2 === 0 ? 'white' : 'var(--gray-50)'), zIndex: 1, borderLeft: '1px solid var(--gray-200)' }}>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button title="Consultar Detalle" style={btnStyle} onClick={() => handleAbrirConsulta(ciclo)} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                          🔍
                        </button>
                        
                        {ciclo.estado !== 'Deshabilitado' && (
                          <>
                            {ciclo.estado !== 'Finalizado' && (
                              <button title="Editar" style={btnStyle} onClick={() => handleAbrirEdicion(ciclo)} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                ✍️
                              </button>
                            )}
                            
                            {ciclo.estado === 'Pendiente' && (
                              <button title="Avanzar a En Proceso" style={{...btnStyle, opacity: isOnline ? 1 : 0.5}} disabled={!isOnline} onClick={() => avanzarEstatus(ciclo.idciclo, 'En Proceso')} onMouseOver={e => e.currentTarget.style.background = '#e0f2fe'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                🔄
                              </button>
                            )}
                            
                            {ciclo.estado === 'En Proceso' && (
                              <button title="Marcar como Finalizado" style={{...btnStyle, opacity: isOnline ? 1 : 0.5}} disabled={!isOnline} onClick={() => avanzarEstatus(ciclo.idciclo, 'Finalizado')} onMouseOver={e => e.currentTarget.style.background = '#dcfce7'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                ✅
                              </button>
                            )}
                            
                            <button title="Deshabilitar" style={{...btnStyle, opacity: isOnline ? 1 : 0.5}} disabled={!isOnline} onClick={() => avanzarEstatus(ciclo.idciclo, 'Deshabilitado')} onMouseOver={e => e.currentTarget.style.background = '#fee2e2'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                              ❌
                            </button>
                          </>
                        )}
                      </div>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}