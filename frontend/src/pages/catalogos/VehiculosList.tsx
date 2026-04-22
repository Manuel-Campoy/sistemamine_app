import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Vehiculo {
  idvehiculo: string;
  codigovehiculo: string;
  numeroeconomico: string;
  categoria: string;
  tipovehiculo: string;
  subtipovehiculo: string;
  marca: string;
  modelo: string;
  anio: number;
  placas: string;
  estadooperacion: string;
  activo: boolean;
}

export default function VehiculosList() {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/vehiculos');
      const vehiculosArray = Array.isArray(response.data)
        ? response.data
        : (response.data.data || []);
      setVehiculos(vehiculosArray);
    } catch (err: any) {
      const mensaje = err.response?.data?.error || err.message || 'Error al cargar vehículos';
      setError(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const termino = busqueda.toLowerCase();
    return (
      vehiculo.modelo.toLowerCase().includes(termino) ||
      vehiculo.numeroeconomico.toLowerCase().includes(termino) ||
      (vehiculo.placas && vehiculo.placas.toLowerCase().includes(termino)) ||
      vehiculo.tipovehiculo.toLowerCase().includes(termino)
    );
  });

  const total = vehiculos.length;
  const disponibles = vehiculos.filter(v => v.estadooperacion === 'Disponible').length;
  const enMantenimiento = vehiculos.filter(v => v.estadooperacion.toLowerCase().includes('mantenimiento')).length;
  const enOperacion = vehiculos.filter(v => v.estadooperacion === 'En Operación' || v.estadooperacion === 'Reservado').length;

  const getVehiculoIcon = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes('dompe') || t.includes('camión')) return '🚛';
    if (t.includes('excavadora') || t.includes('retro')) return '🏗️';
    if (t.includes('cargador') || t.includes('loader')) return '🚜';
    if (t.includes('pipa') || t.includes('cisterna')) return '🚚';
    return '🚙'; 
  };

  const getBadgeStyle = (estado: string) => {
    const e = estado.toLowerCase();
    if (e === 'disponible') return { bg: '#d1fae5', color: '#065f46', text: 'Disponible' };
    if (e.includes('mantenimiento')) return { bg: '#fef3c7', color: '#92400e', text: 'Mantenimiento' };
    if (e === 'en operación' || e === 'reservado') return { bg: '#dbeafe', color: '#1e40af', text: estado };
    return { bg: '#fee2e2', color: '#991b1b', text: estado }; 
  };

  const exportarAExcel = () => {
    const datos = vehiculosFiltrados.map(v => ({
      'Código': v.codigovehiculo,
      'No. Económico': v.numeroeconomico,
      'Categoría': v.categoria,
      'Tipo': v.tipovehiculo,
      'Subtipo': v.subtipovehiculo,
      'Marca': v.marca,
      'Modelo': v.modelo,
      'Año': v.anio,
      'Placas': v.placas || 'N/A',
      'Estado': v.estadooperacion,
      'Activo': v.activo ? 'Sí' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehículos");
    XLSX.writeFile(workbook, "Catalogo_Vehiculos_SistemaMine.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text("Catálogo de Vehículos Mineros", 14, 22);
    
    const tableData = vehiculosFiltrados.map(v => [
      v.numeroeconomico,
      `${v.marca} ${v.modelo} (${v.anio})`,
      v.tipovehiculo,
      v.subtipovehiculo,
      v.placas || '-',
      v.estadooperacion
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['No. Econ.', 'Vehículo', 'Tipo', 'Subtipo', 'Placas', 'Estado']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save("Catalogo_Vehiculos_SistemaMine.pdf");
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', background: 'transparent' }}>
      <div className="page-header" style={{ background: 'white', borderRadius: '8px 8px 0 0' }}>
        <h1 className="page-title">Gestión de Vehículos Mineros</h1>
        <p className="page-subtitle">Administración de maquinaria y equipo de transporte</p>
      </div>

      <div className="page-content" style={{ background: 'white', borderRadius: '0 0 8px 8px' }}>
        
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ background: 'white', border: '2px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚛</div>
            <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{total}</div>
            <div className="stat-label" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Total Vehículos</div>
          </div>
          <div className="stat-card" style={{ background: 'white', border: '2px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{disponibles}</div>
            <div className="stat-label" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Disponibles</div>
          </div>
          <div className="stat-card" style={{ background: 'white', border: '2px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧</div>
            <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{enMantenimiento}</div>
            <div className="stat-label" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>En Mantenimiento</div>
          </div>
          <div className="stat-card" style={{ background: 'white', border: '2px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
            <div className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{enOperacion}</div>
            <div className="stat-label" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>En Operación</div>
          </div>
        </div>

        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar por modelo, placa o no. económico..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '2px solid var(--gray-200)', borderRadius: '8px' }}
            />
          </div>
          <div className="toolbar-actions" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ color: '#047857', borderColor: '#10b981' }}>
              <span>📊</span> Excel
            </button>
            <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ color: '#b91c1c', borderColor: '#ef4444' }}>
              <span>📄</span> PDF
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/vehiculos/nuevo')}>
              <span>➕</span> Nuevo Vehículo
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando vehículos...</div>
        ) : error ? (
          <div className="alert alert-error">⚠️ {error}</div>
        ) : vehiculosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)', background: 'var(--gray-50)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
            No se encontraron vehículos.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {vehiculosFiltrados.map((vehiculo) => {
              const style = getBadgeStyle(vehiculo.estadooperacion);
              
              return (
                <div key={vehiculo.idvehiculo} style={{ background: 'white', border: '2px solid var(--gray-200)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s' }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--gray-800) 0%, var(--primary-dark) 100%)', color: 'white', padding: '1.5rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '3rem', opacity: 0.2 }}>
                      {getVehiculoIcon(vehiculo.tipovehiculo)}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                      {vehiculo.codigovehiculo} {!vehiculo.activo && <span style={{ color: '#fca5a5' }}>(Deshabilitado)</span>}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {vehiculo.marca} {vehiculo.modelo}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      {vehiculo.tipovehiculo} ({vehiculo.subtipovehiculo})
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>No. Económico</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)', fontWeight: 600 }}>{vehiculo.numeroeconomico}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>Año</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)', fontWeight: 600 }}>{vehiculo.anio}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>Placas</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)', fontWeight: 600 }}>{vehiculo.placas || 'N/A'}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>Categoría</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)', fontWeight: 600 }}>{vehiculo.categoria}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '1rem 1.5rem', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '0.375rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: style.bg, color: style.color }}>
                      {style.text}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Editar"
                        onClick={() => navigate(`/dashboard/vehiculos/editar/${vehiculo.idvehiculo}`)}
                      >
                        ✏️
                      </button>
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