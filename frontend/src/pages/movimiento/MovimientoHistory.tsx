import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { localDb } from '../../db/localDb';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { socket } from '../../api/socket'; 
import { useNotification } from '../../hooks/useNotification'; 

export default function MovimientoHistory() {
  const { idarealote } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotification(); 

  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreLote, setNombreLote] = useState(idarealote ? 'Cargando Lote...' : 'General (Todos los Lotes)');

  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    cargarHistorialCompleto();
  }, [idarealote]);

  const cargarHistorialCompleto = async (silencioso = false) => {
    if (!silencioso) setIsLoading(true);
    let datosServidor = [];
    let datosLocales: any[] = [];

    try {
      if (navigator.onLine) {
        const url = idarealote ? `/movimientos/lote/${idarealote}` : '/movimientos';
        const res = await api.get(url);
        datosServidor = Array.isArray(res.data) 
          ? res.data 
          : (res.data.data || []);

        if (idarealote) {
          const resLote = await api.get(`/prospeccion/${idarealote}`);
          setNombreLote(resLote.data.nombrealias || 'Lote Seleccionado');
        }
      }

      if (idarealote) {
        datosLocales = await localDb.movimientos.where('idarealote').equals(idarealote).toArray();
      } else {
        datosLocales = await localDb.movimientos.toArray();
      }

      const localesFormateados = await Promise.all(datosLocales.map(async (m) => {
        const vehiculoCache = await localDb.vehiculos.get(m.idvehiculo);
        const loteCache = await localDb.lotes.get(m.idarealote);
        return {
          idmovimiento: m.idmovimiento,
          fechayhorainicio: m.fechayhorainicio,
          turno: m.turno,
          numeroextraccion: m.numeroextraccion,
          cantidadextraida: m.cantidadextraida,
          destino: m.destino,
          lote: { nombrealias: loteCache?.nombrealias || 'Lote Local' },
          vehiculo: { 
            numeroeconomico: vehiculoCache?.numeroeconomico || 'N/A', 
            marca: vehiculoCache?.marca || 'Vehículo Offline' 
          },
          responsable: { nombre: 'Operador', apellidopaterno: '(Local)' },
          _esLocal: true 
        };
      }));

      const todosLosMovimientos = [...localesFormateados, ...datosServidor];
      todosLosMovimientos.sort((a, b) => new Date(b.fechayhorainicio).getTime() - new Date(a.fechayhorainicio).getTime());

      setMovimientos(todosLosMovimientos);

    } catch (err) {
      console.error("Error al cargar historial", err);
    } finally {
      if (!silencioso) setIsLoading(false);
    }
  };

  useEffect(() => {
    const recargarTablaSilenciosamente = () => {
      if (navigator.onLine) {
        cargarHistorialCompleto(true);
      }
    };

    socket.on('nueva_dompada', recargarTablaSilenciosamente);

    return () => {
      socket.off('nueva_dompada', recargarTablaSilenciosamente);
    };
  }, [idarealote]); 

  const movimientosFiltrados = movimientos.filter(m => {
    const termino = busqueda.toLowerCase();
    const cumpleBusqueda = 
      (m.vehiculo?.numeroeconomico || '').toLowerCase().includes(termino) ||
      (m.destino || '').toLowerCase().includes(termino) ||
      (m.lote?.nombrealias || '').toLowerCase().includes(termino);
      
    let cumpleFechas = true;
    if (fechaInicio && fechaFin) {
      const fechaMov = new Date(m.fechayhorainicio).getTime();
      const inicio = new Date(fechaInicio).getTime();
      const fin = new Date(fechaFin).getTime();
      cumpleFechas = fechaMov >= inicio && fechaMov <= (fin + 86400000); 
    }

    return cumpleBusqueda && cumpleFechas;
  });

  const exportarAExcel = () => {
    if (movimientosFiltrados.length === 0) {
      return error("No hay datos para exportar en este momento.", { icon: '⚠️' }); 
    }

    const datosExcel = movimientosFiltrados.map(mov => ({
      'Estatus': mov._esLocal ? 'Pendiente Sync' : 'Servidor',
      'Fecha y Hora': new Date(mov.fechayhorainicio).toLocaleString(),
      ...(idarealote ? {} : { 'Lote Origen': mov.lote?.nombrealias }),
      'Camión': mov.vehiculo?.numeroeconomico,
      'Turno': mov.turno,
      'Viaje #': mov.numeroextraccion,
      'Tonelaje (t)': mov.cantidadextraida,
      'Destino': mov.destino
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");
    const maxWidth = 20;
    worksheet['!cols'] = Object.keys(datosExcel[0]).map(() => ({ wch: maxWidth }));
    
    XLSX.writeFile(workbook, `Movimientos_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    success("¡Documento Excel descargado correctamente!", { icon: '📊' }); 
  };

  const exportarAPDF = () => {
    if (movimientosFiltrados.length === 0) {
      return error("No hay datos para exportar en este momento.", { icon: '⚠️' }); 
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Historial de Movimientos', 14, 15);
    doc.setFontSize(10);
    doc.text(`Lote: ${nombreLote}`, 14, 25);

    const columns = idarealote 
      ? ['Estatus', 'Fecha y Hora', 'Camión', 'Turno', 'Viaje #', 'Tonelaje (t)', 'Destino']
      : ['Estatus', 'Fecha y Hora', 'Lote Origen', 'Camión', 'Turno', 'Viaje #', 'Tonelaje (t)', 'Destino'];
    
    const datosTabla = movimientosFiltrados.map(mov => {
      const fila = [
        mov._esLocal ? 'Pendiente' : 'Servidor',
        new Date(mov.fechayhorainicio).toLocaleString(),
      ];
      
      if (!idarealote) {
        fila.push(mov.lote?.nombrealias || 'N/A');
      }
      
      fila.push(
        mov.vehiculo?.numeroeconomico || 'N/A',
        mov.turno,
        mov.numeroextraccion,
        mov.cantidadextraida,
        mov.destino
      );
      
      return fila;
    });

    autoTable(doc, {
      head: [columns],
      body: datosTabla,
      startY: 35,
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        doc.setFontSize(9);
        doc.text(`Página ${data.pageNumber} de ${pageCount}`, 
          pageSize.getWidth() / 2, 
          pageHeight - 10, 
          { align: 'center' }
        );
      }
    });

    doc.save(`Movimientos_${new Date().toISOString().split('T')[0]}.pdf`);
    
    success("¡Documento PDF descargado correctamente!", { icon: '📄' }); 
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      
      <div className="page-header" style={{ background: 'white', padding: '2rem', borderBottom: '2px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            Historial de Movimientos 
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
            Mostrando viajes de: <strong style={{ color: 'var(--primary-blue)' }}>{nombreLote}</strong>
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Volver Atrás</button>
      </div>

      <div className="page-content" style={{ background: 'white', padding: '2rem' }}>
        
        <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--gray-200)', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 250px' }}>
              <label className="form-label">Buscar (Camión, Destino, Lote)</label>
              <input type="text" className="form-input" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Ej: ECO-01..." />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label className="form-label">Desde</label>
              <input type="date" className="form-input" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label className="form-label">Hasta</label>
              <input type="date" className="form-input" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
            </div>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-primary" 
            onClick={exportarAExcel}
            disabled={movimientosFiltrados.length === 0}
          >
            📊 Exportar a Excel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={exportarAPDF}
            disabled={movimientosFiltrados.length === 0}
          >
            📄 Exportar a PDF
          </button>
        </div>

        {isLoading ? (
           <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 600, color: 'var(--primary-blue)' }}>Cargando bitácora de viajes...</div>
        ) : (
          <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--gray-100)', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Estatus</th>
                  <th style={{ padding: '1rem' }}>Fecha y Hora</th>
                  {!idarealote && <th style={{ padding: '1rem' }}>Lote Origen</th>}
                  <th style={{ padding: '1rem' }}>Camión / Turno</th>
                  <th style={{ padding: '1rem' }}>Viaje #</th>
                  <th style={{ padding: '1rem' }}>Tonelaje</th>
                  <th style={{ padding: '1rem' }}>Destino</th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.length === 0 ? (
                   <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>No hay viajes registrados.</td></tr>
                ) : (
                  movimientosFiltrados.map((mov, index) => (
                    <tr key={mov.idmovimiento} style={{ borderBottom: '1px solid var(--gray-200)', background: index % 2 === 0 ? 'white' : 'var(--gray-50)' }}>
                      <td style={{ padding: '1rem' }}>
                        {mov._esLocal ? (
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>⏳ Pendiente Sync</span>
                        ) : (
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>✔️ Servidor</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{new Date(mov.fechayhorainicio).toLocaleString()}</td>
                      {!idarealote && <td style={{ padding: '1rem', fontWeight: 600 }}>{mov.lote?.nombrealias}</td>}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{mov.vehiculo?.numeroeconomico}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Turno {mov.turno}</div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>{mov.numeroextraccion}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--gray-800)' }}>{mov.cantidadextraida} t</td>
                      <td style={{ padding: '1rem', color: 'var(--gray-600)', fontSize: '0.9rem' }}>{mov.destino}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}