import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { localDb } from '../../db/localDb';
import { socket } from '../../api/socket';

interface LoteAutorizado {
  idarealote: string; 
  nombrealias: string;
  idestatusprospeccion: string;
  fecharegistro: string;
  tonelajeestimado: number | null;
  coordenadas: any | null; 
  estatus: {
    descripcion: string;
  };
  responsable?: {
    nombre: string;
    apellidopaterno: string;
  };
}

export default function MovimientoListForm() {
  const navigate = useNavigate();
  const [lotesAutorizados, setLotesAutorizados] = useState<LoteAutorizado[]>([]);
  const [estatusCatalogo, setEstatusCatalogo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    cargarLotesYEstatus();
  }, []);

  const cargarLotesYEstatus = async (silencioso = false) => {
    if (!silencioso) setIsLoading(true);
    if (!silencioso) setError('');

    if (navigator.onLine) {
      try {
        const [resLotes, resEstatus] = await Promise.all([
          api.get('/prospeccion'),
          api.get('/prospeccion/estatus-prospeccion')
        ]);

        const estatusData = Array.isArray(resEstatus.data) 
          ? resEstatus.data 
          : (resEstatus.data.data || []);
        setEstatusCatalogo(estatusData);

        const lotesArray = resLotes.data.data || [];
        
        const filtrados = lotesArray.filter((l: LoteAutorizado) => 
          l.estatus?.descripcion === 'Autorizado Para Movimiento'
        );
        
        setLotesAutorizados(filtrados);

        const lotesParaGuardar = filtrados.map((l: LoteAutorizado) => ({
          idarealote: l.idarealote,
          nombrealias: l.nombrealias,
          idestatusprospeccion: l.idestatusprospeccion,
          fecharegistro: l.fecharegistro,
          tonelajeestimado: l.tonelajeestimado,
          coordenadas: l.coordenadas,
          estatus: l.estatus,
          responsable: l.responsable
        }));
        await localDb.lotes.clear(); 
        await localDb.lotes.bulkPut(lotesParaGuardar);

      } catch (err: any) {
        console.warn("API Failed, falling back to cache...", err);
        await cargarLotesDesdeCache();
      }
    } else {
      await cargarLotesDesdeCache();
    }
    
    if (!silencioso) setIsLoading(false);
  };

  useEffect(() => {
    const recargarSilenciosamente = () => {
      if (navigator.onLine) {
        cargarLotesYEstatus(true); 
      }
    };

    socket.on('nueva_notificacion', recargarSilenciosamente);

    return () => {
      socket.off('nueva_notificacion', recargarSilenciosamente);
    };
  }, []);

  const cargarLotesDesdeCache = async () => {
    try {
      const lotesCacheados = await localDb.lotes.toArray();
      if (lotesCacheados.length > 0) {
        setLotesAutorizados(lotesCacheados as unknown as LoteAutorizado[]);
      } else {
        setError("Sin conexión a internet y sin lotes guardados localmente.");
      }
    } catch (error) {
      console.error("Error leyendo caché local", error);
      setError("Error leyendo base de datos local.");
    }
  };

  const handleRechazar = async (idarealote: string, nombreAlias: string) => {
    if (!navigator.onLine) {
      alert("No puedes rechazar lotes estando sin conexión (Modo Offline).");
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas RECHAZAR el lote "${nombreAlias}"?`)) return;    
    
    const estatusRechazado = estatusCatalogo.find(e => e.descripcion === 'Rechazado');

    if (!estatusRechazado) {
      alert("Error: No se encontró el estatus 'Rechazado' en el sistema.");
      return;
    }

    try {
      setIsLoading(true);
      await api.put(`/prospeccion/${idarealote}`, { 
        idestatusprospeccion: estatusRechazado.idestatusprospeccion,
        observaciones: 'Rechazado desde panel de Movimiento de Tierra'
      });
      cargarLotesYEstatus();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al rechazar el lote.');
      setIsLoading(false);
    }
  };

  const lotesFiltrados = lotesAutorizados.filter(lote => {
    const cumpleBusqueda = (lote.nombrealias || '').toLowerCase().includes(busqueda.toLowerCase()) || 
                           (lote.idarealote || '').toLowerCase().includes(busqueda.toLowerCase());
    
    let cumpleFechas = true;
    if (fechaInicio && fechaFin && lote.fecharegistro) {
      const fechaLote = new Date(lote.fecharegistro).getTime();
      const inicio = new Date(fechaInicio).getTime();
      const fin = new Date(fechaFin).getTime();
      cumpleFechas = fechaLote >= inicio && fechaLote <= fin;
    }

    return cumpleBusqueda && cumpleFechas;
  });

  const exportarAExcel = () => {
    const datos = lotesFiltrados.map((l, i) => ({
      'No.': i + 1,
      'Código Lote': l.idarealote.substring(0,8).toUpperCase(),
      'Nombre Lote': l.nombrealias,
      'Total a Extraer (t)': l.tonelajeestimado || 0,
      'Fecha Prospección': new Date(l.fecharegistro).toLocaleDateString(),
      'Responsable': l.responsable ? `${l.responsable.nombre} ${l.responsable.apellidopaterno}` : 'N/A'
    }));
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movimiento_Tierra");
    XLSX.writeFile(workbook, "Lotes_Movimiento_Tierra.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lotes Autorizados - Movimiento de Tierra", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Código', 'Nombre Lote', 'Total (t)', 'Fecha Pros.', 'Responsable']],
      body: lotesFiltrados.map(l => [
        l.idarealote.substring(0,8).toUpperCase(), 
        l.nombrealias, 
        l.tonelajeestimado || '0', 
        new Date(l.fecharegistro).toLocaleDateString(), 
        l.responsable ? l.responsable.nombre : 'N/A'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });
    doc.save("Movimiento_Tierra.pdf");
  };

  const getCoordenadaPrincipal = (coords: any) => {
    if (!coords) return 'Sin GPS';
    const parsedCoords = typeof coords === 'string' ? JSON.parse(coords) : coords;
    if (!Array.isArray(parsedCoords) || parsedCoords.length === 0) return 'Sin GPS';
    return `${parsedCoords[0].lat.toFixed(4)}, ${parsedCoords[0].lng.toFixed(4)}`;
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      
      {!navigator.onLine && (
        <div style={{ background: '#f59e0b', color: 'white', padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ Estás en modo Offline. Mostrando lotes cacheados. Las operaciones de rechazo están deshabilitadas.
        </div>
      )}

      <div className="page-header" style={{ background: 'white', padding: '2rem', borderBottom: '2px solid var(--gray-200)' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
          Movimiento de Tierra 
        </h1>
        <p className="page-subtitle" style={{ color: 'var(--gray-600)' }}>Lotes autorizados listos para extracción y acarreo.</p>
      </div>

      <div className="page-content" style={{ background: 'white', padding: '2rem' }}>
        <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--gray-200)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--gray-800)' }}>🔍 Filtros</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label htmlFor="busqueda" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Buscar por nombre o ID</label>
              <input id="busqueda" type="text" className="form-input" placeholder="Ej: Veta Norte..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%' }} />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label htmlFor="fInicio" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Fecha Inicio</label>
              <input id="fInicio" type="date" className="form-input" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%' }} />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label htmlFor="fFin" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Fecha Fin</label>
              <input id="fFin" type="date" className="form-input" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard/movimiento/historial')}>📂 Ver Historial Completo</button>
          <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} disabled={lotesFiltrados.length === 0}>📊 Excel</button>
          <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} disabled={lotesFiltrados.length === 0}>📄 PDF</button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 600, color: 'var(--primary-blue)' }}>Consultando disponibilidad de lotes...</div>
        ) : error ? (
          <div className="alert alert-error" style={{ textAlign: 'center', padding: '2rem' }}>⚠️ {error}</div>
        ) : lotesFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--gray-50)', borderRadius: '12px' }}>No hay lotes autorizados pendientes de movimiento.</div>
        ) : (
          <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--gray-100)' }}>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Código / Lote</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Ubicación</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Cant. Estimada</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Fecha Autorización</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lotesFiltrados.map((lote, index) => (
                  <tr key={lote.idarealote} style={{ borderBottom: '1px solid var(--gray-200)', background: index % 2 === 0 ? 'white' : 'var(--gray-50)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.9rem' }}>{lote.idarealote.substring(0,8).toUpperCase()}</div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{lote.nombrealias}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                      📍 {getCoordenadaPrincipal(lote.coordenadas)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{lote.tonelajeestimado || 0} t</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {new Date(lote.fecharegistro).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => navigate(`/dashboard/movimiento/registrar/${lote.idarealote}`)}
                        >
                          REGISTRAR VIAJE
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{ background: 'transparent', color: !navigator.onLine ? 'var(--gray-400)' : '#ef4444', border: 'none', cursor: !navigator.onLine ? 'not-allowed' : 'pointer' }}
                          onClick={() => handleRechazar(lote.idarealote, lote.nombrealias)}
                          disabled={!navigator.onLine}
                        >
                          Rechazar
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => navigate(`/dashboard/movimiento/historial/${lote.idarealote}`)}
                          style={{ background: 'white', border: '1px solid var(--gray-300)' }}
                        >
                          Ver Historial
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}