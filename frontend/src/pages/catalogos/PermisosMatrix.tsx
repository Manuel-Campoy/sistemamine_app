import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import { useNotification } from '../../hooks/useNotification';

const MODULOS_PERMISOS = [
  {
    modulo: 'Catálogos y Seguridad',
    permisos: [
      { clave: 'catalogos-Administrar', etiqueta: 'Administrar Catálogos y Usuarios' },
      { clave: 'permisos-Administrar', etiqueta: 'Gestionar Matriz de Permisos' }
    ]
  },
  {
    modulo: 'Prospección',
    permisos: [
      { clave: 'prospeccion-Consultar', etiqueta: 'Ver Lotes y Estimaciones' },
      { clave: 'prospeccion-Registrar', etiqueta: 'Crear y Editar Lotes' },
      { clave: 'prospeccion-Aprobar', etiqueta: 'Autorizar pase a Acarreo' }
    ]
  },
  {
    modulo: 'Movimiento (Acarreo)',
    permisos: [
      { clave: 'movimiento-Consultar', etiqueta: 'Ver Bitácora de Viajes' },
      { clave: 'movimiento-Registrar', etiqueta: 'Registrar Nuevos Viajes' }
    ]
  },
  {
    modulo: 'Producción (Planta)',
    permisos: [
      { clave: 'produccion-Consultar', etiqueta: 'Ver Ciclos de Lixiviación' },
      { clave: 'produccion-Registrar', etiqueta: 'Crear Nuevos Ciclos' },
      { clave: 'produccion-CambiarFase', etiqueta: 'Avanzar / Finalizar Ciclos' }
    ]
  },
  {
    modulo: 'Post-Producción (Cierre)',
    permisos: [
      { clave: 'postproduccion-Consultar', etiqueta: 'Ver Resultados Finales' },
      { clave: 'postproduccion-Validar', etiqueta: 'Validar Oro y Mermas (Conciliación)' }
    ]
  },
  {
    modulo: 'Combustible',
    permisos: [
      { clave: 'combustible-Consultar', etiqueta: 'Ver Auditoría de Diésel' },
      { clave: 'combustible-Registrar', etiqueta: 'Despachar Diésel (Tablet)' }
    ]
  },
  {
    modulo: 'Reportes',
    permisos: [
      { clave: 'reportes-Exportar', etiqueta: 'Generar y Exportar Reportes (PDF/Excel)' }
    ]
  }
];

const ROLES_DISPONIBLES = [
  'Super administrador',
  'Administrador del sistema',
  'Supervisor',
  'Geólogo/Prospector',
  'Chofer/operador',
  'Inversionista'
];

export default function PermisosMatrix() {
  const navigate = useNavigate();
  const { success, error } = useNotification(); 
  
  const [rolSeleccionado, setRolSeleccionado] = useState(ROLES_DISPONIBLES[0]);
  const [permisosActuales, setPermisosActuales] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    cargarPermisosDelRol(rolSeleccionado);
  }, [rolSeleccionado]);

  const cargarPermisosDelRol = async (rol: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/auth/rol-permisos/${encodeURIComponent(rol)}`);
      setPermisosActuales(res.data);
      success(`Permisos cargados para ${rol}`); 
    } catch (err) {
      error(`Error al cargar los permisos del rol: ${rol}`);
      setPermisosActuales([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePermiso = async (clavePermiso: string, modulo: string, tienePermiso: boolean) => {
    if (tienePermiso) {
      setPermisosActuales(prev => prev.filter(p => p !== clavePermiso));
    } else {
      setPermisosActuales(prev => [...prev, clavePermiso]);
    }

    try {
      if (tienePermiso) {
        await api.delete('/auth/rol-permisos', { data: { rol: rolSeleccionado, permisoClave: clavePermiso } });
      } else {
        await api.post('/auth/rol-permisos', { rol: rolSeleccionado, permisoClave: clavePermiso, modulo });
      }
      success('Permiso guardado correctamente'); 
    } catch (err) {
      error("Fallo al guardar el permiso. Revirtiendo cambio.");
      cargarPermisosDelRol(rolSeleccionado); 
    }
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'white' }}>
      
      <div className="page-header" style={{ padding: '2rem', borderBottom: '2px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={() => navigate('/dashboard/usuarios')} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem', padding: 0 }}>
            ← Volver a Usuarios
          </button>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
            🛡️ Matriz de Permisos
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>Gestiona los accesos y privilegios de cada rol en el sistema.</p>
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        
        <div style={{ background: 'var(--gray-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--gray-200)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--gray-700)' }}>Modificando permisos para:</h3>
          <select 
            className="form-select" 
            value={rolSeleccionado} 
            onChange={(e) => setRolSeleccionado(e.target.value)}
            style={{ padding: '0.75rem', fontSize: '1.1rem', borderRadius: '8px', fontWeight: 700, minWidth: '250px', border: '2px solid var(--primary-blue)', color: 'var(--primary-dark)' }}
          >
            {ROLES_DISPONIBLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {isLoading ? ( 
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary-blue)', fontWeight: 600 }}>Cargando configuración de seguridad...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {MODULOS_PERMISOS.map(grupo => (
              <div key={grupo.modulo} style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--primary-dark)', color: 'white', padding: '1rem', fontWeight: 700 }}>
                  {grupo.modulo}
                </div>
                <div style={{ padding: '1rem', background: 'white' }}>
                  {grupo.permisos.map(permiso => {
                    const tienePermiso = permisosActuales.includes(permiso.clave);
                    return (
                      <label key={permiso.clave} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='var(--gray-50)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                        
                        <input 
                          type="checkbox" 
                          checked={tienePermiso}
                          onChange={() => handleTogglePermiso(permiso.clave, grupo.modulo, tienePermiso)}
                          style={{ width: '20px', height: '20px', marginRight: '1rem', cursor: 'pointer', accentColor: 'var(--primary-blue)' }}
                        />
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: tienePermiso ? 700 : 500, color: tienePermiso ? 'var(--primary-dark)' : 'var(--gray-600)' }}>
                            {permiso.etiqueta}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                            {permiso.clave}
                          </div>
                        </div>

                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}