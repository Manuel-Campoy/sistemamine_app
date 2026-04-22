import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ReportesCenter() {
  const { user } = useAuth();
  const rol = user?.rol || '';
  const isCLevel = rol === 'Inversionista' || rol === 'Super administrador' || rol === 'Administrador del sistema';

  const [activeTab, setActiveTab] = useState(isCLevel ? 'Inversionistas' : 'BalanceLote');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const [datosBalance, setDatosBalance] = useState<any[]>([]);
  const [datosAuditoria, setDatosAuditoria] = useState<any[]>([]);
  const [datosNotificaciones, setDatosNotificaciones] = useState<any[]>([]);
  
  const [datosInversionistaKPI, setDatosInversionistaKPI] = useState({
    lotesActivos: 0, tonsProcesadas: 0, oroEstimado: 0, oroRecuperado: 0
  });
  const [tendenciaMensual, setTendenciaMensual] = useState<any[]>([]);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    cargarDatos();
    
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    }
  }, [activeTab]);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'Inversionistas') {
        const res = await api.get('/reportes/inversionista');
        if (res.data) {
           setDatosInversionistaKPI(res.data.kpis);
           setTendenciaMensual(res.data.tendenciaMensual);
        }
      } 
      else if (activeTab === 'BalanceLote') {
        const res = await api.get('/reportes/balance');
        setDatosBalance(res.data);
      } 
      else if (activeTab === 'Auditoria') {
        const res = await api.get('/reportes/auditoria');
        setDatosAuditoria(res.data);
      }
      else if (activeTab === 'Notificaciones') {
        const res = await api.get('/dashboard/notificaciones');
        setDatosNotificaciones(res.data);
      }
    } catch (error) {
      console.error("Error cargando reporte", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cumpleFechas = (fechaStr: string) => {
    if (!fechaInicio && !fechaFin) return true;
    const fechaItem = new Date(fechaStr).getTime();
    const inicio = fechaInicio ? new Date(fechaInicio).getTime() : 0;
    const fin = fechaFin ? new Date(fechaFin).getTime() : Infinity;
    return fechaItem >= inicio && fechaItem <= fin;
  };

  const balanceFiltrado = datosBalance.filter(b => 
    (b.loteAlias.toLowerCase().includes(busqueda.toLowerCase()) || b.idarealote.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const auditoriaFiltrada = datosAuditoria.filter(a => 
    (a.usuario.toLowerCase().includes(busqueda.toLowerCase()) || a.accion.toLowerCase().includes(busqueda.toLowerCase())) &&
    cumpleFechas(a.fecha)
  );

  const notificacionesFiltradas = datosNotificaciones.filter(n => 
    (n.titulo.toLowerCase().includes(busqueda.toLowerCase()) || n.mensaje.toLowerCase().includes(busqueda.toLowerCase())) &&
    cumpleFechas(n.fechacreacion)
  );

  const exportarExcel = () => {
    let datos: any[] = [];
    let nombreHoja = activeTab;

    if (activeTab === 'BalanceLote') {
      if (balanceFiltrado.length === 0) return alert("No hay datos para exportar.");
      datos = balanceFiltrado.map(b => ({
        'ID Lote': b.idarealote.substring(0,8).toUpperCase(),
        'Alias Lote': b.loteAlias,
        'Tons Movidas': b.tonsMovidas,
        'Tons Procesadas': b.tonsProcesadas,
        'Ley Estimada (g/t)': b.leyEstimada,
        'Ley Real Promedio (g/t)': Number(b.leyPromedioReal).toFixed(2),
        'Oro Estimado (g)': b.oroEstimado,
        'Oro Real Obtenido (g)': b.oroObtenido,
        'Recuperación %': Number(b.recuperacion).toFixed(2),
        'Estatus Rentabilidad': b.rentabilidad
      }));
    } else if (activeTab === 'Auditoria') {
      if (auditoriaFiltrada.length === 0) return alert("No hay datos para exportar.");
      datos = auditoriaFiltrada.map(a => ({
        'Fecha y Hora': new Date(a.fecha).toLocaleString(),
        'Usuario': a.usuario,
        'Acción Realizada': a.accion,
        'Entidad Afectada': a.entidad,
        'Valores Anteriores': a.detallesAntes,
        'Valores Nuevos': a.detallesDespues
      }));
    } else if (activeTab === 'Notificaciones') {
      if (notificacionesFiltradas.length === 0) return alert("No hay datos para exportar.");
      datos = notificacionesFiltradas.map(n => ({
        'Fecha y Hora': new Date(n.fechacreacion).toLocaleString(),
        'Tipo': n.tipo,
        'Título': n.titulo,
        'Mensaje': n.mensaje,
        'Leída': n.leida ? 'Sí' : 'No'
      }));
    } else {
      return alert("Esta vista no soporta exportación tabular directa a Excel.");
    }

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
    XLSX.writeFile(wb, `Reporte_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportarPDF = () => {
    if (activeTab === 'Inversionistas') return alert("Para exportar el dashboard, recomendamos la opción de Imprimir pantalla del navegador.");
    
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text(`Reporte de Sistema: ${activeTab}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);

    let head: any[] = [];
    let body: any[] = [];

    if (activeTab === 'BalanceLote') {
      if (balanceFiltrado.length === 0) return alert("No hay datos para exportar.");
      head = [['Lote', 'Tons Movidas / Proc.', 'Ley Est/Real', 'Oro Est/Real', 'Recuperación', 'Estado']];
      body = balanceFiltrado.map(b => [
        b.loteAlias,
        `${b.tonsMovidas} / ${b.tonsProcesadas}`,
        `${b.leyEstimada} / ${Number(b.leyPromedioReal).toFixed(2)}`,
        `${b.oroEstimado}g / ${b.oroObtenido}g`,
        `${Number(b.recuperacion).toFixed(2)}%`,
        b.rentabilidad
      ]);
    } else if (activeTab === 'Auditoria') {
      if (auditoriaFiltrada.length === 0) return alert("No hay datos para exportar.");
      head = [['Fecha', 'Usuario', 'Acción', 'Entidad', 'Detalles Cambios']];
      body = auditoriaFiltrada.map(a => [
        new Date(a.fecha).toLocaleString(),
        a.usuario,
        a.accion,
        a.entidad,
        `Antes: ${a.detallesAntes ? a.detallesAntes.substring(0,40)+'...' : 'N/A'}\nDespués: ${a.detallesDespues ? a.detallesDespues.substring(0,40)+'...' : 'N/A'}`
      ]);
    } else if (activeTab === 'Notificaciones') {
      if (notificacionesFiltradas.length === 0) return alert("No hay datos para exportar.");
      head = [['Fecha', 'Tipo', 'Título', 'Mensaje']];
      body = notificacionesFiltradas.map(n => [
        new Date(n.fechacreacion).toLocaleString(),
        n.tipo,
        n.titulo,
        n.mensaje
      ]);
    }

    autoTable(doc, {
      head: head,
      body: body,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save(`Reporte_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const TabButton = ({ id, titulo, icon }: { id: string, titulo: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        padding: '1rem 1.5rem', border: 'none', background: activeTab === id ? 'white' : 'transparent',
        borderBottom: activeTab === id ? '3px solid var(--primary-blue)' : '3px solid transparent',
        color: activeTab === id ? 'var(--primary-blue)' : 'var(--gray-500)',
        fontWeight: activeTab === id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.95rem', transition: 'all 0.2s'
      }}
    >
      <span>{icon}</span> {titulo}
    </button>
  );

  const renderCambiosLimpios = (antesStr: string, despuesStr: string) => {
    try {
      const antes = antesStr ? JSON.parse(antesStr) : {};
      const despues = despuesStr ? JSON.parse(despuesStr) : {};      
      const todasLasLlaves = Array.from(new Set([...Object.keys(antes), ...Object.keys(despues)]));
      const camposIgnorados = ['usuarioModificacion', 'rolModificacion', 'fechaModificacion'];
      const cambios = todasLasLlaves.filter(key => 
        !camposIgnorados.includes(key) && antes[key] !== despues[key]
      );

      if (cambios.length === 0) return <span style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>Cambios de sistema o sin alteraciones.</span>;

      return (
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--gray-700)', fontSize: '0.85rem' }}>
          {cambios.map(key => {
            const nombreCampo = key.charAt(0).toUpperCase() + key.slice(1);
            
            const valorAntes = antes[key] !== undefined && antes[key] !== null ? String(antes[key]) : 'Vacío';
            const valorDespues = despues[key] !== undefined && despues[key] !== null ? String(despues[key]) : 'Vacío';

            const mostrarAntes = valorAntes.length > 20 ? valorAntes.substring(0, 8) + '...' : valorAntes;
            const mostrarDespues = valorDespues.length > 20 ? valorDespues.substring(0, 8) + '...' : valorDespues;

            return (
              <li key={key} style={{ marginBottom: '0.4rem', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--gray-800)' }}>{nombreCampo}:</strong>{' '}
                <span style={{ color: 'var(--danger-red)', textDecoration: 'line-through', marginRight: '0.5rem' }}>
                  {mostrarAntes}
                </span>
                <span style={{ color: 'var(--gray-400)' }}>➔</span>{' '}
                <span style={{ color: 'var(--success-green)', fontWeight: 700, marginLeft: '0.5rem' }}>
                  {mostrarDespues}
                </span>
              </li>
            );
          })}
        </ul>
      );
    } catch (e) {
      return <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{despuesStr}</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {!isOnline && (
        <div style={{ background: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>
          📡 Modo Offline - Estás viendo datos cacheados. Conéctate para ver el reporte en tiempo real.
        </div>
      )}

      {/* ENCABEZADO Y TABS */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--gray-200)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>Centro de Inteligencia y Reportes</h1>
          <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem', marginBottom: 0 }}>Métricas consolidadas, balances productivos y auditoría del sistema.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--gray-50)', overflowX: 'auto' }}>
          {isCLevel && <TabButton id="Inversionistas" titulo="Visión Inversionista" icon="📊" />}
          <TabButton id="BalanceLote" titulo="Balance por Lote" icon="⚖️" />
          <TabButton id="Auditoria" titulo="Auditoría de Cambios" icon="🛡️" />
          <TabButton id="Notificaciones" titulo="Bitácora Notificaciones" icon="🔔" />
        </div>
      </div>

      {/* FILTROS ESTANDARIZADOS */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flex: 1 }}>
          <div>
            <label className="form-label">Desde</label>
            <input type="date" className="form-input" value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Hasta</label>
            <input type="date" className="form-input" value={fechaFin} onChange={e=>setFechaFin(e.target.value)} />
          </div>
          <div style={{ minWidth: '250px' }}>
            <label className="form-label">Búsqueda / Filtro</label>
            <input type="text" className="form-input" placeholder="Buscar por palabra clave..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={exportarExcel} style={{ borderColor: '#10b981', color: '#065f46' }}>📊 Exportar Excel</button>
          <button className="btn btn-secondary" onClick={exportarPDF} style={{ borderColor: '#ef4444', color: '#991b1b' }}>📄 Exportar PDF</button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '1.2rem', background: 'white', borderRadius: '12px' }}>
          Generando reporte de datos...
        </div>
      ) : (
        <>
          {/* =========================================
              REPORTE 1: VISIÓN INVERSIONISTA (DASHBOARD)
              ========================================= */}
          {activeTab === 'Inversionistas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Tarjetas KPI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--primary-blue)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Lotes Activos</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{datosInversionistaKPI.lotesActivos}</div>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #8b5cf6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Tons. Procesadas</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#6d28d9' }}>{Number(datosInversionistaKPI.tonsProcesadas).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--amber)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Oro Estimado (g)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#b45309' }}>{Number(datosInversionistaKPI.oroEstimado).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--success-green)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Oro Recuperado Real</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#047857' }}>{Number(datosInversionistaKPI.oroRecuperado).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
              </div>

              {/* Gráficas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--gray-700)', fontWeight: 700 }}>Tendencia de Recuperación (Mensual)</h3>
                  <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tendenciaMensual}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="estimado" name="Oro Estimado (g)" stroke="var(--amber)" strokeWidth={3} />
                        <Line type="monotone" dataKey="real" name="Oro Real (g)" stroke="var(--success-green)" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--gray-700)', fontWeight: 700 }}>Rendimiento Real por Periodo</h3>
                  <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tendenciaMensual}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="real" name="Gramos Recuperados" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              REPORTE 2: BALANCE POR LOTE
              ========================================= */}
          {activeTab === 'BalanceLote' && (
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <h3 style={{ margin: 0, color: 'var(--gray-800)' }}>Balance Técnico de Producción</h3>
              </div>
              <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1200px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--gray-100)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
                    <tr>
                      <th style={{ padding: '1rem' }}>Lote / Área</th>
                      <th style={{ padding: '1rem' }}>Tons Movidas vs Proc.</th>
                      <th style={{ padding: '1rem' }}>Ley Estimada vs Real</th>
                      <th style={{ padding: '1rem' }}>Oro Estimado vs Real</th>
                      <th style={{ padding: '1rem' }}>% Recup. Mín / Global</th>
                      <th style={{ padding: '1rem' }}>Estado Rentabilidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balanceFiltrado.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No hay registros de balance.</td></tr>
                    ) : (
                      balanceFiltrado.map((b) => (
                        <tr key={b.idarealote} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{b.loteAlias}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>ID: {b.idarealote.substring(0,8).toUpperCase()}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>{Number(b.tonsMovidas).toFixed(2)} t / <span style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{Number(b.tonsProcesadas).toFixed(2)} t</span></td>
                          <td style={{ padding: '1rem' }}>{Number(b.leyEstimada).toFixed(2)} g/t / <span style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{Number(b.leyPromedioReal).toFixed(2)} g/t</span></td>
                          <td style={{ padding: '1rem' }}>{Number(b.oroEstimado).toFixed(2)} g / <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{Number(b.oroObtenido).toFixed(2)} g</span></td>
                          <td style={{ padding: '1rem' }}>- / <strong style={{ color: 'var(--primary-blue)' }}>{Number(b.recuperacion).toFixed(2)}%</strong></td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              background: b.rentabilidad === 'Pérdida' ? '#fee2e2' : (b.rentabilidad === 'Aceptable' ? '#fef3c7' : '#d1fae5'), 
                              color: b.rentabilidad === 'Pérdida' ? '#991b1b' : (b.rentabilidad === 'Aceptable' ? '#92400e' : '#065f46'), 
                              padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                            }}>
                              {b.rentabilidad}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================
              REPORTE 3: AUDITORÍA DE CAMBIOS
              ========================================= */}
          {activeTab === 'Auditoria' && (
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
               <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--gray-100)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
                    <tr>
                      <th style={{ padding: '1rem' }}>Fecha y Hora</th>
                      <th style={{ padding: '1rem' }}>Usuario Responsable</th>
                      <th style={{ padding: '1rem' }}>Acción Realizada</th>
                      <th style={{ padding: '1rem' }}>Entidad Afectada</th>
                      <th style={{ padding: '1rem' }}>Valores Antes / Después</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriaFiltrada.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No hay registros de auditoría.</td></tr>
                    ) : (
                      auditoriaFiltrada.map((a) => (
                        <tr key={a.idauditoria} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{new Date(a.fecha).toLocaleString()}</td>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{a.usuario}</td>
                          <td style={{ padding: '1rem' }}><span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{a.accion}</span></td>
                          <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{a.entidad}</td>
                          <td style={{ padding: '1rem' }}>
                            {renderCambiosLimpios(a.detallesAntes, a.detallesDespues)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

           {/* =========================================
              REPORTE 4: BITÁCORA NOTIFICACIONES
              ========================================= */}
          {activeTab === 'Notificaciones' && (
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
               <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--gray-100)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
                    <tr>
                      <th style={{ padding: '1rem' }}>Fecha de Emisión</th>
                      <th style={{ padding: '1rem' }}>Clasificación</th>
                      <th style={{ padding: '1rem' }}>Título de Notificación</th>
                      <th style={{ padding: '1rem' }}>Detalle / Mensaje</th>
                      <th style={{ padding: '1rem' }}>Estatus de Lectura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificacionesFiltradas.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No hay registros de notificaciones.</td></tr>
                    ) : (
                      notificacionesFiltradas.map((n) => (
                        <tr key={n.idnotificacion || n.id} style={{ borderBottom: '1px solid var(--gray-200)', background: n.leida ? 'white' : '#f8fafc' }}>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{new Date(n.fechacreacion).toLocaleString()}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              background: n.tipo === 'Alerta' || n.tipo === 'Error' ? '#fee2e2' : (n.tipo === 'Éxito' || n.tipo === 'Autorizado' ? '#d1fae5' : '#e0e7ff'), 
                              color: n.tipo === 'Alerta' || n.tipo === 'Error' ? '#991b1b' : (n.tipo === 'Éxito' || n.tipo === 'Autorizado' ? '#065f46' : '#3730a3'), 
                              padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                            }}>
                              {n.tipo}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--gray-800)' }}>{n.titulo}</td>
                          <td style={{ padding: '1rem', color: 'var(--gray-600)', fontSize: '0.9rem' }}>{n.mensaje}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ color: n.leida ? 'var(--gray-500)' : 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem' }}>
                              {n.leida ? 'Leída' : 'Sin Leer'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}