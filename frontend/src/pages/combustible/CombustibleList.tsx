import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { socket } from '../../api/socket'; 
import { useNotification } from '../../hooks/useNotification';

interface RecargaCombustible {
  idrecarga: string;
  fechaFormateada: string;
  timestamp: number;
  vehiculoEco: string;
  vehiculoMarca: string;
  despachador: string;
  litros: number;
  horometro: number | null;
  turno: string;
  observaciones: string;
}

export default function CombustibleList() {
  const navigate = useNavigate();
  const { success, error, loading, dismiss } = useNotification();
  
  const [recargas, setRecargas] = useState<RecargaCombustible[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [turnoFiltro, setTurnoFiltro] = useState('Todos');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async (silencioso = false) => {
    if (!silencioso) setIsLoading(true);
    try {
      const res = await api.get('/combustible');
      
      const datosMapeados = res.data.data.map((r: any) => ({
        idrecarga: r.idrecarga,
        fechaFormateada: new Date(r.fechayhora).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
        timestamp: new Date(r.fechayhora).getTime(),
        vehiculoEco: r.vehiculo?.numeroeconomico || 'N/A',
        vehiculoMarca: r.vehiculo?.marca || '',
        despachador: r.usuario ? `${r.usuario.nombre} ${r.usuario.apellidopaterno}` : 'Sistema',
        litros: Number(r.litros),
        horometro: r.horometro ? Number(r.horometro) : null,
        turno: r.turno,
        observaciones: r.observaciones || ''
      }));

      setRecargas(datosMapeados);
    } catch (err) {
      if (!silencioso) error('Error al cargar el historial de diésel');
    } finally {
      if (!silencioso) setIsLoading(false);
    }
  };

  useEffect(() => {
    const escucharNuevasRecargas = () => {
      cargarHistorial(true);
    };
    socket.on('nueva_recarga', escucharNuevasRecargas);
    return () => {
      socket.off('nueva_recarga', escucharNuevasRecargas);
    };
  }, []);

  const recargasFiltradas = recargas.filter(r => {
    const cumpleBusqueda = r.vehiculoEco.toLowerCase().includes(busqueda.toLowerCase()) || 
                           r.despachador.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleTurno = turnoFiltro === 'Todos' || r.turno === turnoFiltro;
    
    let cumpleFechas = true;
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio).getTime();
      const fin = new Date(fechaFin).getTime() + 86399999; 
      cumpleFechas = r.timestamp >= inicio && r.timestamp <= fin;
    }

    return cumpleBusqueda && cumpleTurno && cumpleFechas;
  });

  const totalLitros = recargasFiltradas.reduce((sum, r) => sum + r.litros, 0);
  const totalEventos = recargasFiltradas.length;

  const exportarAExcel = () => {
    if (recargasFiltradas.length === 0) return error('No hay datos para exportar', { icon: '⚠️' });
    
    loading("Generando archivo Excel...", "export-excel");

    try {
      const datosExcel = recargasFiltradas.map(r => ({
        'ID Recarga': r.idrecarga.substring(0,8).toUpperCase(),
        'Fecha y Hora': r.fechaFormateada,
        'Camión / Máquina': r.vehiculoEco,
        'Turno': r.turno,
        'Litros Cargados': r.litros,
        'Horómetro': r.horometro || 'N/A',
        'Despachador': r.despachador,
        'Observaciones': r.observaciones
      }));

      const ws = XLSX.utils.json_to_sheet(datosExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Combustible');
      ws['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 30 }];
      XLSX.writeFile(wb, `Reporte_Diesel_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      dismiss("export-excel");
      success('Excel generado exitosamente', { icon: '📊' });
    } catch (err) {
      dismiss("export-excel");
      error('Ocurrió un error al generar el Excel');
    }
  };

  const exportarAPDF = () => {
    if (recargasFiltradas.length === 0) return error('No hay datos para exportar', { icon: '⚠️' });
    
    loading("Estructurando documento PDF...", "export-pdf");

    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Control General de Consumo de Diésel', 14, 20);
      doc.setFontSize(10);
      doc.text(`Total Periodo: ${totalLitros.toFixed(2)} Litros en ${totalEventos} recargas.`, 14, 28);

      const datosTabla = recargasFiltradas.map(r => [
        r.fechaFormateada, r.vehiculoEco, r.turno, r.litros.toFixed(2), r.horometro || '-', r.despachador
      ]);

      autoTable(doc, {
        head: [['Fecha/Hora', 'Máquina', 'Turno', 'Litros', 'Horómetro', 'Despachador']],
        body: datosTabla, startY: 35, theme: 'grid', styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      doc.save(`Reporte_Diesel_${new Date().toISOString().split('T')[0]}.pdf`);
      
      dismiss("export-pdf");
      success('PDF generado exitosamente', { icon: '📄' });
    } catch (err) {
      dismiss("export-pdf");
      error('Ocurrió un error al crear el PDF');
    }
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'white' }}>
      
      <div className="page-header" style={{ padding: '2rem', borderBottom: '2px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
            Panel de Combustible
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>Auditoría y control de consumos de diésel por máquina.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/combustible/despacho')}
          style={{ padding: '0.75rem 1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Ir a Vista de Despachador (Tablet)
        </button>
      </div>

      <div className="page-content" style={{ padding: '2rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <div style={{ color: '#1e40af', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Litros Surtidos (Filtro)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1d4ed8' }}>{totalLitros.toFixed(2)} <span style={{ fontSize: '1.25rem' }}>L</span></div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <div style={{ color: '#166534', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>Eventos de Recarga</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#15803d' }}>{totalEventos}</div>
          </div>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--gray-200)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '1rem' }}>🔍 Filtros de Auditoría</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Buscar Máquina o Usuario</label>
              <input type="text" className="form-input" placeholder="Ej: ECO-01..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%' }}/>
            </div>
            <div>
              <label className="form-label">Filtrar por Turno</label>
              <select className="form-select" value={turnoFiltro} onChange={e => setTurnoFiltro(e.target.value)} style={{ width: '100%' }}>
                <option value="Todos">Todos</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Nocturno">Nocturno</option>
              </select>
            </div>
            <div>
              <label className="form-label">Fecha Inicio</label>
              <input type="date" className="form-input" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ width: '100%' }}/>
            </div>
            <div>
              <label className="form-label">Fecha Fin</label>
              <input type="date" className="form-input" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ width: '100%' }}/>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={exportarAExcel} style={{ borderColor: '#10b981', color: '#065f46', background: 'white' }}>📊 Exportar Excel</button>
          <button className="btn btn-secondary" onClick={exportarAPDF} style={{ borderColor: '#3b82f6', color: '#1e40af', background: 'white' }}>📄 Exportar PDF</button>
        </div>

        <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--gray-100)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Fecha y Hora</th>
                <th style={{ padding: '1rem' }}>Máquina / Vehículo</th>
                <th style={{ padding: '1rem' }}>Turno</th>
                <th style={{ padding: '1rem' }}>Litros (L)</th>
                <th style={{ padding: '1rem' }}>Horómetro</th>
                <th style={{ padding: '1rem' }}>Despachador</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary-blue)', fontWeight: 600 }}>Cargando bitácora de combustible...</td></tr>
              ) : recargasFiltradas.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>No se encontraron recargas en este periodo.</td></tr>
              ) : (
                recargasFiltradas.map((r, index) => (
                  <tr key={r.idrecarga} style={{ borderBottom: '1px solid var(--gray-200)', background: index % 2 === 0 ? 'white' : 'var(--gray-50)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--gray-700)' }}>{r.fechaFormateada}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>{r.vehiculoEco}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{r.vehiculoMarca}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{r.turno}</td>
                    <td style={{ padding: '1rem', fontWeight: 800, color: '#047857', fontSize: '1.1rem' }}>{r.litros.toFixed(2)} L</td>
                    <td style={{ padding: '1rem', color: 'var(--gray-600)', fontWeight: 600 }}>{r.horometro || '-'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>👤 {r.despachador}</td>
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