import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Usuario {
  idusuario: string;
  nombre: string;
  apellidopaterno: string;
  correo: string;
  activo: boolean;
  rol: {
    nombre: string;
  };
}

export default function UsuariosList() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  
  const [busqueda, setBusqueda] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data.data || []);
    } catch (err: any) {
      const mensaje = err.response?.data?.error || err.message || 'Error de conexión';
      setError(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  const alternarEstatus = async (id: string, estadoActual: boolean) => {
    if (!window.confirm(`¿Seguro que deseas ${estadoActual ? 'deshabilitar' : 'habilitar'} este usuario?`)) return;

    try {
      await api.put(`/usuarios/${id}/estado`, { activo: !estadoActual });
      cargarUsuarios(); 
    } catch (err) {
      alert('Hubo un error al cambiar el estado del usuario.');
    }
  };

  const getIniciales = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const getBadgeColor = (rolNombre: string) => {
    if (!rolNombre) return 'badge-operator'; 
    if (rolNombre.toLowerCase().includes('admin')) return 'badge-admin';
    if (rolNombre.toLowerCase().includes('inversionista')) return 'badge-investor';
    return 'badge-operator';
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termino = busqueda.toLowerCase();
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidopaterno}`.toLowerCase();
    const correoVal = usuario.correo.toLowerCase();
    const rol = (usuario.rol?.nombre || '').toLowerCase();

    return nombreCompleto.includes(termino) || 
           correoVal.includes(termino) || 
           rol.includes(termino);
  });

  const rolesUnicos = new Set(usuarios.map(u => u.rol?.nombre)).size;

  const exportarAExcel = () => {
    const datosParaExcel = usuariosFiltrados.map(u => ({
      'ID Usuario': u.idusuario,
      'Nombre Completo': `${u.nombre} ${u.apellidopaterno}`,
      'Correo Electrónico': u.correo,
      'Rol': u.rol?.nombre || 'Sin Rol',
      'Estado': u.activo ? 'Activo' : 'Inactivo'
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, "Listado_Usuarios_SistemaMine.xlsx");
  };

  const exportarAPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte de Usuarios - SistemaMine", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = usuariosFiltrados.map(u => [
      `${u.nombre} ${u.apellidopaterno}`,
      u.correo,
      u.rol?.nombre || 'Sin Rol',
      u.activo ? 'Activo' : 'Inactivo'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Nombre Completo', 'Correo', 'Rol', 'Estado']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    doc.save("Listado_Usuarios_SistemaMine.pdf");
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <div className="page-header" style={{ background: 'white', padding: '2rem', borderBottom: '2px solid var(--gray-200)' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Gestión de Usuarios</h1>
        <p className="page-subtitle" style={{ color: 'var(--gray-600)' }}>Administración de cuentas, roles y permisos del sistema</p>
      </div>

      <div className="page-content" style={{ background: 'white', padding: '2rem' }}>
        
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>{usuarios.length}</div>
            <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: 600 }}>Usuarios Totales</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-green)' }}>{usuarios.filter(u => u.activo).length}</div>
            <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: 600 }}>Usuarios Activos</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏸️</div>
            <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger-red)' }}>{usuarios.filter(u => !u.activo).length}</div>
            <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: 600 }}>Usuarios Inactivos</div>
          </div>
          <div className="stat-card" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔑</div>
            <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{rolesUnicos}</div>
            <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: 600 }}>Roles Activos</div>
          </div>
        </div>

        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <span className="search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar por nombre, correo o rol..." 
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
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/usuarios/nuevo')}>
              <span>➕</span> Nuevo Usuario
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}><span className="alert-icon">⚠️</span> {error}</div>}
        {isLoading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary-blue)', fontWeight: 600 }}>Cargando usuarios...</div>}

        {!isLoading && !error && (
          <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--gray-100)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Usuario</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Correo</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Rol</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Estado</th>
                  <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.875rem' }}>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                      No se encontraron usuarios que coincidan con "{busqueda}".
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((user, i) => (
                    <tr key={user.idusuario} style={{ borderBottom: '1px solid var(--gray-200)', background: !user.activo ? '#fef2f2' : (i % 2 === 0 ? 'white' : 'var(--gray-50)') }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#1e40af' }}>
                            {getIniciales(user.nombre, user.apellidopaterno)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                              {user.nombre} {user.apellidopaterno}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>ID: {user.idusuario.substring(0,8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{user.correo}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${getBadgeColor(user.rol?.nombre || '')}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, background: 'var(--gray-200)' }}>
                          {user.rol?.nombre || 'Sin Rol'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          background: user.activo ? '#d1fae5' : '#fee2e2', 
                          color: user.activo ? '#065f46' : '#991b1b', 
                          padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 
                        }}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-icon" title="Editar" onClick={() => navigate(`/dashboard/usuarios/editar/${user.idusuario}`)} style={{ background: 'white', border: '1px solid var(--gray-300)', borderRadius: '6px', padding: '0.25rem 0.5rem' }}>✏️</button>
                        
                          <button 
                            className="btn btn-secondary btn-icon" 
                            title={user.activo ? "Deshabilitar" : "Habilitar"} 
                            onClick={() => alternarEstatus(user.idusuario, user.activo)} 
                            style={{ background: 'white', border: '1px solid var(--gray-300)', borderRadius: '6px', padding: '0.25rem 0.5rem', opacity: user.activo ? 1 : 0.6 }}
                          >
                            {user.activo ? '❌' : '✅'}
                          </button>
                        </div>
                      </td>
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