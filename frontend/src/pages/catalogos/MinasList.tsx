import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Mina {
  idmina: string; 
  claveminera: string; 
  nombreempresa: string; 
  aliasmina: string;
  tipomina: string; 
  estatusoperacion: string; 
  mineralesprincipales: string;
  estadooficina: string; 
  paisoficina: string; 
  activo: boolean;
}

export default function MinasList() {
  const navigate = useNavigate();
  const [minas, setMinas] = useState<Mina[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { cargarMinas(); }, []);

  const cargarMinas = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/minas');
      setMinas(response.data.data || []);
    } catch (err: any) { 
      const mensaje = err.response?.data?.error || err.message || 'Error al conectar con el servidor';
      setError(mensaje); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const alternarEstatus = async (id: string, estadoActual: boolean) => {
    if (!window.confirm(`¿Seguro que deseas ${estadoActual ? 'deshabilitar' : 'habilitar'} este registro?`)) return;
    try {
      await api.put(`/minas/${id}/estado`, { activo: !estadoActual });
      cargarMinas();
    } catch (err) {
      alert('Error al actualizar el estado de la mina');
    }
  };

  const minasFiltradas = minas.filter(m => {
    const term = busqueda.toLowerCase();
    return m.nombreempresa.toLowerCase().includes(term) || 
           m.aliasmina.toLowerCase().includes(term) || 
           m.claveminera.toLowerCase().includes(term);
  });

  const totalEmpresas = new Set(minas.map(m => m.nombreempresa)).size;
  const totalMinasActivas = minas.filter(m => m.activo).length;
  const totalEstados = new Set(minas.filter(m => m.estadooficina).map(m => m.estadooficina)).size;
  const totalEnOperacion = minas.filter(m => m.estatusoperacion === 'Activa').length;

  const exportarAExcel = () => {
    const datos = minasFiltradas.map(m => ({
      'Clave': m.claveminera, 'Empresa': m.nombreempresa, 'Alias': m.aliasmina,
      'Tipo': m.tipomina, 'Minerales': m.mineralesprincipales, 'Ubicación': `${m.estadooficina}, ${m.paisoficina}`,
      'Estatus': m.estatusoperacion, 'Sistema': m.activo ? 'Habilitada' : 'Deshabilitada'
    }));
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Minas");
    XLSX.writeFile(workbook, "Catalogo_Minas_SistemaMine.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18); doc.text("Catálogo de Empresas Mineras / Minas", 14, 22);
    autoTable(doc, {
      startY: 30, head: [['Clave', 'Alias', 'Empresa', 'Tipo', 'Minerales', 'Estatus']],
      body: minasFiltradas.map(m => [m.claveminera, m.aliasmina, m.nombreempresa, m.tipomina, m.mineralesprincipales, m.estatusoperacion]),
      theme: 'grid', headStyles: { fillColor: [37, 99, 235] }
    });
    doc.save("Catalogo_Minas.pdf");
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <div className="page-header" style={{ background: 'white', borderRadius: '8px 8px 0 0', padding: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gray-900)' }}>Directorio de Minas y Empresas</h1>
        <p className="page-subtitle" style={{ color: 'var(--gray-600)' }}>Administración de complejos mineros, corporativos y operaciones activas</p>
      </div>

      <div className="page-content" style={{ background: 'white', borderRadius: '0 0 8px 8px', padding: '2rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🏢</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalEmpresas}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Empresas Registradas</div>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⛏️</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalMinasActivas}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Minas Habilitadas</div>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#ec4899' }}>📍</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalEstados}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Estados de la República</div>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>✅</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalEnOperacion}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>En Operación Activa</div>
          </div>
        </div>

        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input type="text" className="search-input" placeholder="Buscar por clave, nombre o alias..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportarAExcel} style={{ color: '#047857', borderColor: '#10b981', borderRadius: '12px' }}>📊 Excel</button>
            <button className="btn btn-secondary btn-sm" onClick={exportarAPDF} style={{ color: '#b91c1c', borderColor: '#ef4444', borderRadius: '12px' }}>📄 PDF</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/minas/nuevo')} style={{ borderRadius: '12px' }}>➕ Registrar Mina</button>
          </div>
        </div>
        
        {isLoading ? <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando catálogo de minas...</div> : 
         error ? <div className="alert alert-error">⚠️ {error}</div> : 
         minasFiltradas.length === 0 ? <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--gray-50)', borderRadius: '12px' }}>No se encontraron minas con los criterios de búsqueda.</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {minasFiltradas.map((mina) => (
              <div key={mina.idmina} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', background: !mina.activo ? '#fff1f2' : 'white' }}>
                <div style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', padding: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '3rem', opacity: 0.2 }}>⛰️</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Clave: {mina.claveminera} {!mina.activo && <b style={{color: '#fca5a5'}}> - DESHABILITADA</b>}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{mina.aliasmina}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{mina.nombreempresa}</div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tipo Operación</div><div style={{ fontWeight: 600 }}>{mina.tipomina}</div></div>
                    <div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>Minerales</div><div style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{mina.mineralesprincipales}</div></div>
                    <div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ubicación</div><div style={{ fontWeight: 600 }}>{mina.estadooficina || 'N/A'}, {mina.paisoficina}</div></div>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: mina.estatusoperacion === 'Activa' ? '#d1fae5' : '#fef3c7', color: mina.estatusoperacion === 'Activa' ? '#065f46' : '#92400e', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                    {mina.estatusoperacion}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/dashboard/minas/editar/${mina.idmina}`)} style={{ borderRadius: '8px' }}>✏️</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => alternarEstatus(mina.idmina, mina.activo)} style={{ borderRadius: '8px' }}>
                      {mina.activo ? '❌' : '✅'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}