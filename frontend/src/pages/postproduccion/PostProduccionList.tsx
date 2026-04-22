import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import { useAuth } from '../../context/AuthContext'; 
import { socket } from '../../api/socket'; 
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNotification } from '../../hooks/useNotification'; 

interface CicloPost {
  idciclo: string;
  loteAlias: string;
  fecha: string;
  turno: string;
  toneladas: number;
  ley: number;
  recuperacion: number;
  oroEstimado: number;
  oroObtenido: number | null;
  colas: number | null;
  observaciones: string;
  estadoOperativo: string; 
  humedadmerma: number | null;
  conscianuro: number | null;
  estatusvalidacion: string; 
  
  trazabilidad: {
    pendiente: string; 
    proceso: string;
    finalizado: string;
    cierreTurno: string;
    cierreDia: string;
    cierreLote: string;
  }
}

export default function PostProduccionList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, loading, dismiss } = useNotification(); 
  
  const rol = user?.rol || '';
  const isSupervisor = rol === 'Supervisor' || rol === 'Super administrador' || rol === 'Administrador del sistema';
  const isInversionista = rol === 'Inversionista';

  const [ciclos, setCiclos] = useState<CicloPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [turnoFiltro, setTurnoFiltro] = useState('Todos');
  const [estatusValidacionFiltro, setEstatusValidacionFiltro] = useState('Todos');

  const [showModal, setShowModal] = useState(false);
  const [cicloEditando, setCicloEditando] = useState<CicloPost | null>(null);
  const [formValidacion, setFormValidacion] = useState({ oroObtenido: '', humedad: '', cianuro: '' });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async (silencioso = false) => {
    if (!silencioso) setIsLoading(true);
    if (!silencioso) loading('Cargando datos...', 'carga-post'); 
    try {
      const res = await api.get('/produccion/ciclos');
      let datosCrudos = Array.isArray(res.data)
        ? res.data
        : (res.data.data || []);

      if (isInversionista) {
        datosCrudos = datosCrudos.filter((c: any) => c.estatusvalidacion === 'Validado' || c.estatusvalidacion === 'Visto inversionista');
      }

      const datosMapeados: CicloPost[] = datosCrudos.map((c: any) => {
        const fechaObj = new Date(c.fechaoperacion);
        const fecha = `${String(fechaObj.getDate()).padStart(2, '0')}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}`;
        return ({
          idciclo: c.idciclo,
          loteAlias: c.prospeccion?.nombrealias || 'Lote Desconocido',
          fecha: fecha,
          turno: c.turno,
          toneladas: Number(c.toneladasprocesadas) || 0,
          ley: Number(c.leyciclo) || 0,
          recuperacion: Number(c.recuperacionporcentaje) || 0,
          oroEstimado: Number(c.oroestimadogramos) || 0,
          oroObtenido: c.oroobtenidogramos ? Number(c.oroobtenidogramos) : null,
          colas: c.colastoneladas ? Number(c.colastoneladas) : null,
          observaciones: c.observaciones || '',
          estadoOperativo: c.estado || 'Pendiente',
          humedadmerma: c.humedadmerma ? Number(c.humedadmerma) : null,
          conscianuro: c.conscianuro ? Number(c.conscianuro) : null,
          estatusvalidacion: c.estatusvalidacion || 'Pendiente validar',
          trazabilidad: {
            pendiente: c.usuarioRegistra ? `${c.usuarioRegistra.nombre}` : '-',
            proceso: c.usuarioEnProceso ? `${c.usuarioEnProceso.nombre}` : '-',
            finalizado: c.usuarioFinalizado ? `${c.usuarioFinalizado.nombre}` : '-',
            cierreTurno: c.usuarioCierreTurno ? `${c.usuarioCierreTurno.nombre}` : '-',
            cierreDia: c.usuarioCierreDia ? `${c.usuarioCierreDia.nombre}` : '-',
            cierreLote: c.usuarioCierreLote ? `${c.usuarioCierreLote.nombre}` : '-'
          }
        });
      });
      
      setCiclos(datosMapeados);
      setErrorMsg('');
    } catch (err: any) {
      const mensajeError = err?.response?.data?.message || "Error al cargar los datos";
      setErrorMsg(mensajeError);
      if (!silencioso) error(mensajeError); 
    } finally {
      if (!silencioso) {
        setIsLoading(false);
        dismiss('carga-post'); 
      }
    }
  };

  useEffect(() => {
    const escucharCambios = () => {
      if (navigator.onLine) {
        cargarDatos(true); 
      }
    };

    socket.on('nueva_produccion', escucharCambios);

    return () => {
      socket.off('nueva_produccion', escucharCambios);
    };
  }, []);

  const volverAtras = () => {
    navigate('/dashboard');
  };

  const aplicarFiltroTurno = (turno: string) => {
    setTurnoFiltro(turno);
  };

  const exportarAPDF = () => {
    if (ciclosFiltrados.length === 0) {
      return error('No hay datos para exportar a PDF', { icon: '⚠️' });
    }

    try {
      const pdf = new jsPDF();
      const titulo = 'Reporte de Post-Producción';
      const fecha = new Date().toLocaleDateString('es-ES');
      
      pdf.setFontSize(18);
      pdf.text(titulo, 14, 20);
      pdf.setFontSize(10);
      pdf.text(`Generado: ${fecha}`, 14, 28);

      const datosParaPDF = ciclosFiltrados.map(c => ([
        c.idciclo.substring(0, 8).toUpperCase(),
        c.loteAlias,
        c.fecha,
        c.turno,
        c.toneladas.toFixed(2),
        c.oroEstimado.toFixed(2),
        c.oroObtenido?.toFixed(2) || '-',
        c.estatusvalidacion
      ]));

      autoTable(pdf, {
        head: [['Ciclo', 'Lote', 'Fecha', 'Turno', 'Toneladas', 'Oro Est (g)', 'Oro Obt (g)', 'Estatus']],
        body: datosParaPDF,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [26, 35, 50] }
      });

      pdf.save(`PostCierre_${new Date().toISOString().split('T')[0]}.pdf`);
      success('PDF exportado exitosamente', { icon: '📄' }); 
    } catch (err) {
      error('Error al generar PDF');
    }
  };

  const ciclosFiltrados = ciclos.filter(c => {
    const cumpleBusqueda = c.idciclo.toLowerCase().includes(busqueda.toLowerCase()) || 
                           c.loteAlias.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleTurno = turnoFiltro === 'Todos' || c.turno === turnoFiltro;
    const cumpleValidacion = estatusValidacionFiltro === 'Todos' || c.estatusvalidacion === estatusValidacionFiltro;
    
    let cumpleFechas = true;
    if (fechaInicio && fechaFin) {
      const partesFecha = c.fecha.split('/');
      const fechaCicloObj = new Date(`${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`).getTime();
      const inicio = new Date(fechaInicio).getTime();
      const fin = new Date(fechaFin).getTime();
      cumpleFechas = fechaCicloObj >= inicio && fechaCicloObj <= fin;
    }

    return cumpleBusqueda && cumpleTurno && cumpleValidacion && cumpleFechas;
  });

  const abrirModalValidacion = (ciclo: CicloPost) => {
    setCicloEditando(ciclo);
    setFormValidacion({
      oroObtenido: ciclo.oroObtenido?.toString() || '',
      humedad: ciclo.humedadmerma?.toString() || '',
      cianuro: ciclo.conscianuro?.toString() || ''
    });
    setShowModal(true);
  };

  const guardarValidacion = async () => {
    if (!cicloEditando) return;
    
    if (formValidacion.oroObtenido && isNaN(parseFloat(formValidacion.oroObtenido))) {
      return error('Oro Obtenido debe ser un número válido', { icon: '⚖️' });
    }
    if (formValidacion.humedad && isNaN(parseFloat(formValidacion.humedad))) {
      return error('Humedad/Merma debe ser un número válido', { icon: '💧' });
    }
    if (formValidacion.cianuro && isNaN(parseFloat(formValidacion.cianuro))) {
      return error('Cianuro debe ser un número válido', { icon: '🧪' });
    }

    loading('Validando cierre de ciclo...', 'validando'); 

    try {
      await api.put(`/produccion/ciclos/${cicloEditando.idciclo}/postcierre`, {
        oroobtenidogramos: formValidacion.oroObtenido ? parseFloat(formValidacion.oroObtenido) : null,
        humedadmerma: formValidacion.humedad ? parseFloat(formValidacion.humedad) : null,
        conscianuro: formValidacion.cianuro ? parseFloat(formValidacion.cianuro) : null,
        estatusvalidacion: 'Validado'
      });
      dismiss('validando');
      success('Ciclo validado exitosamente', { icon: '✅' }); 
      setShowModal(false);
      cargarDatos();
    } catch (err: any) {
      dismiss('validando');
      const mensajeError = err?.response?.data?.message || "Error al validar el ciclo";
      error(mensajeError); 
    }
  };

  const exportarAExcel = () => {
    if (ciclosFiltrados.length === 0) {
      return error('No hay datos para exportar en este momento.', { icon: '⚠️' }); 
    }
    try {
      const ws = XLSX.utils.json_to_sheet(ciclosFiltrados.map(c => ({
        'Ciclo': c.idciclo.substring(0,8).toUpperCase(),
        'Lote': c.loteAlias, 'Fecha': c.fecha, 'Turno': c.turno,
        'Tons': c.toneladas, 'Oro Est (g)': c.oroEstimado, 'Oro Obt (g)': c.oroObtenido || 0,
        'Estatus Operación': c.estadoOperativo, 'Estatus Validación': c.estatusvalidacion,
        'Humedad/Merma %': c.humedadmerma || 0, 'Cianuro (kg)': c.conscianuro || 0
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'PostCierre');
      XLSX.writeFile(wb, `Conciliacion_${new Date().toISOString().split('T')[0]}.xlsx`);
      success('Excel exportado exitosamente', { icon: '📊' }); 
    } catch (err) {
      error('Error al generar Excel'); 
    }
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      {showModal && cicloEditando && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--primary-dark)' }}>Validación Post-Cierre</h3>
            <p style={{ color: 'var(--gray-600)' }}>Ciclo: {cicloEditando.idciclo.substring(0,8).toUpperCase()} - {cicloEditando.loteAlias}</p>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label">Oro Final Obtenido (Refinado) en gramos</label>
                <input type="number" step="0.01" className="form-input" value={formValidacion.oroObtenido} onChange={e => setFormValidacion({...formValidacion, oroObtenido: e.target.value})} />
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>El estimado por planta fue: {cicloEditando.oroEstimado.toFixed(2)}g</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Humedad / Merma (%)</label>
                  <input type="number" step="0.01" className="form-input" value={formValidacion.humedad} onChange={e => setFormValidacion({...formValidacion, humedad: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Consumo Cianuro (kg)</label>
                  <input type="number" step="0.01" className="form-input" value={formValidacion.cianuro} onChange={e => setFormValidacion({...formValidacion, cianuro: e.target.value})} />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardarValidacion}>✔️ Confirmar y Validar</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header" style={{ background: 'white', padding: '2rem', borderBottom: '2px solid var(--gray-200)' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>Cierre y Conciliación</h1>
        <p className="page-subtitle" style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>Verificación final de datos operativos, mermas y resultados para inversionistas.</p>
      </div>

      <div className="page-content" style={{ background: 'white', padding: '2rem' }}>
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>⏳</div>
              <p>Cargando datos de post-producción...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--gray-200)', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Buscar (Lote o ID)</label>
                  <input type="text" className="form-input" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Filtrar por Turno</label>
                  <select className="form-select" value={turnoFiltro} onChange={e => aplicarFiltroTurno(e.target.value)}>
                    <option value="Todos">Todos</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Nocturno">Nocturno</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Estatus Validación</label>
                  <select className="form-select" value={estatusValidacionFiltro} onChange={e => setEstatusValidacionFiltro(e.target.value)}>
                    <option value="Todos">Todos</option>
                    {!isInversionista && <option value="Pendiente validar">Pendiente validar</option>}
                    <option value="Validado">Validado</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Desde / Hasta</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="date" className="form-input" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                    <input type="date" className="form-input" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <strong>⚠️ Error:</strong> {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ borderColor: '#10b981', color: '#065f46', background: 'white' }}>📊 Exportar Excel</button>
                <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ borderColor: '#3b82f6', color: '#1e40af', background: 'white' }}>📄 Exportar PDF</button>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={volverAtras}>← Volver</button>
            </div>

            {ciclosFiltrados.length === 0 ? (
              <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'var(--gray-600)' }}>
                <p style={{ fontSize: '1.1rem', margin: 0 }}>No hay datos que coincidan con los filtros aplicados.</p>
              </div>
            ) : (
              <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', minWidth: '1800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--gray-100)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
                    <tr>
                      <th style={{ padding: '1rem', position: 'sticky', left: 0, background: 'var(--gray-100)', zIndex: 10 }}>Ciclo / Lote</th>
                      <th style={{ padding: '1rem' }}>Estatus Prod / Valid</th>
                      <th style={{ padding: '1rem' }}>Operación (Tons / Ley)</th>
                      <th style={{ padding: '1rem' }}>Oro (Estimado vs Real)</th>
                      <th style={{ padding: '1rem' }}>Químicos y Merma</th>
                      <th style={{ padding: '1rem' }}>Firmas (Trazabilidad)</th>
                      {isSupervisor && <th style={{ padding: '1rem', textAlign: 'center', position: 'sticky', right: 0, background: 'var(--gray-100)', zIndex: 10 }}>Acción</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {ciclosFiltrados.map((ciclo, index) => (
                      <tr key={ciclo.idciclo} style={{ borderBottom: '1px solid var(--gray-200)', background: index % 2 === 0 ? 'white' : 'var(--gray-50)' }}>
                        
                        <td style={{ padding: '1rem', position: 'sticky', left: 0, background: index % 2 === 0 ? 'white' : 'var(--gray-50)', zIndex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{ciclo.idciclo.substring(0,8).toUpperCase()}</div>
                          <div style={{ fontWeight: 600 }}>{ciclo.loteAlias}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{ciclo.fecha} • {ciclo.turno}</div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: ciclo.estadoOperativo === 'Finalizado' ? '#d1fae5' : '#f1f5f9', color: ciclo.estadoOperativo === 'Finalizado' ? '#065f46' : '#475569' }}>
                              OP: {ciclo.estadoOperativo}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: ciclo.estatusvalidacion === 'Validado' ? '#dbeafe' : '#fef3c7', color: ciclo.estatusvalidacion === 'Validado' ? '#1e40af' : '#92400e', fontWeight: 600 }}>
                              {ciclo.estatusvalidacion === 'Validado' ? '✅ VALIDADO' : '⏳ PENDIENTE'}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div><strong>{ciclo.toneladas.toFixed(2)}</strong> Tons procesadas</div>
                          <div>Ley Prom: <strong>{ciclo.ley.toFixed(2)} g/t</strong></div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ color: 'var(--gray-500)' }}>Est: {ciclo.oroEstimado.toFixed(2)} g</div>
                          <div style={{ fontWeight: 700, color: ciclo.oroObtenido ? 'var(--success-green)' : 'var(--danger-red)' }}>
                            Obtenido: {ciclo.oroObtenido ? `${ciclo.oroObtenido.toFixed(2)} g` : 'Falta capturar'}
                          </div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          <div>Humedad/Merma: <strong>{ciclo.humedadmerma ? `${ciclo.humedadmerma}%` : '-'}</strong></div>
                          <div>Cianuro: <strong>{ciclo.conscianuro ? `${ciclo.conscianuro} kg` : '-'}</strong></div>
                        </td>

                        <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <div><span style={{color:'var(--primary-blue)'}}>Reg:</span> {ciclo.trazabilidad.pendiente}</div>
                            <div><span style={{color:'var(--primary-blue)'}}>Fin:</span> {ciclo.trazabilidad.finalizado}</div>
                            <div><span style={{color:'var(--amber)'}}>C.Turno:</span> {ciclo.trazabilidad.cierreTurno}</div>
                            <div><span style={{color:'var(--amber)'}}>C.Día:</span> {ciclo.trazabilidad.cierreDia}</div>
                          </div>
                        </td>

                        {isSupervisor && (
                          <td style={{ padding: '1rem', textAlign: 'center', position: 'sticky', right: 0, background: index % 2 === 0 ? 'white' : 'var(--gray-50)', zIndex: 1 }}>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => abrirModalValidacion(ciclo)}
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: '100%' }}
                            >
                              {ciclo.estatusvalidacion === 'Validado' ? 'Editar Cierre' : 'Validar'}
                            </button>
                          </td>
                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}