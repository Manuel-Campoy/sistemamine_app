import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../api/axiosConfig'; 

export default function UsuarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id); 

  const tabInicial = searchParams.get('tab') || 'general';
  const [activeTab, setActiveTab] = useState(tabInicial);

  const [nombre, setNombre] = useState('');
  const [apellidopaterno, setApellidoPaterno] = useState('');
  const [apellidomaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombreusuario, setNombreUsuario] = useState('');
  const [celular, setCelular] = useState('');
  const [rol, setRol] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activo, setActivo] = useState(true);

  const [rolesDisponibles, setRolesDisponibles] = useState<{idrol: string, nombre: string}[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const res = await api.get('/roles');
      const rolesArray = Array.isArray(res.data) 
        ? res.data 
        : (res.data.data || []);
      setRolesDisponibles(rolesArray);
    } catch (error) {
      console.error("Error al cargar el catálogo de roles", error);
    }
  };

  useEffect(() => {
    if (isEditing) {
      cargarDatosUsuario();
    }
  }, [id]);

  const cargarDatosUsuario = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/usuarios/${id}`);
      const data = response.data.data || response.data;
      
      setNombre(data.nombre);
      setApellidoPaterno(data.apellidopaterno);
      setApellidoMaterno(data.apellidomaterno || '');
      setCorreo(data.correo);
      setNombreUsuario(data.nombreusuario);
      setCelular(data.celular || '');
      setRol(data.rol);
      setActivo(data.activo);

    } catch (err: any) {
      const mensaje = err.response?.data?.error || err.message || 'Error al cargar datos del usuario';
      setErrorMsg(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        nombre,
        apellidopaterno,
        apellidomaterno,
        correo,
        nombreusuario,
        celular,
        rol,
        password: password || undefined,
        activo
      };

      if (isEditing) {
        await api.put(`/usuarios/${id}`, payload);
      } else {
        await api.post('/usuarios', payload);
      }

      navigate('/dashboard/usuarios');
      
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Ocurrió un error al procesar la solicitud';
      setErrorMsg(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', background: 'white' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>
          <p className="page-subtitle">
            {isEditing ? `Actualizando a ${nombre} ${apellidopaterno}` : 'Crea una nueva cuenta de usuario en el sistema'}
          </p>
        </div>
        {isEditing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>Estado:</span>
            <span className={`badge ${activo ? 'badge-active' : 'badge-inactive'}`}>
              {activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        )}
      </div>

      <div className="page-content">
        {errorMsg && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="tabs">
          <button type="button" className={`tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
            Información General
          </button>
          <button type="button" className={`tab ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
            Roles y Permisos
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'general' && (
            <>
              {isEditing && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" id="estadoUsuario" checked={activo} onChange={(e) => setActivo(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="estadoUsuario" style={{ cursor: 'pointer', fontWeight: 600, color: activo ? 'var(--success-green)' : 'var(--danger-red)' }}>
                    La cuenta está habilitada (Puede iniciar sesión)
                  </label>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">Nombre(s)</label>
                  <input type="text" className="form-input" required value={nombre} onChange={e => setNombre(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label className="form-label required">Apellido Paterno</label>
                  <input type="text" className="form-input" required value={apellidopaterno} onChange={e => setApellidoPaterno(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido Materno</label>
                  <input type="text" className="form-input" value={apellidomaterno} onChange={e => setApellidoMaterno(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label className="form-label required">Correo Electrónico</label>
                  <input type="email" className="form-input" required value={correo} onChange={e => setCorreo(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label className="form-label required">Nombre de Usuario</label>
                  <input type="text" className="form-input" required value={nombreusuario} onChange={e => setNombreUsuario(e.target.value)} disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label className="form-label">Número Celular</label>
                  <input type="tel" className="form-input" value={celular} onChange={e => setCelular(e.target.value)} disabled={isLoading} />
                </div>
                
                <div className="form-group">
                  <label className="form-label required">Rol Principal</label>
                  <select className="form-select" required value={rol} onChange={e => setRol(e.target.value)} disabled={isLoading}>
                    <option value="">Seleccionar...</option>
                    {rolesDisponibles.map((r) => (
                      <option key={r.idrol} value={r.nombre}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--gray-50)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-800)' }}>
                  🔒 {isEditing ? 'Cambiar Contraseña' : 'Contraseña Inicial'}
                </h3>
                {isEditing && <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>(Déjalo en blanco si no deseas cambiar la contraseña actual)</p>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className={`form-label ${!isEditing ? 'required' : ''}`}>Contraseña</label>
                    <input type="password" className="form-input" placeholder="••••••••" required={!isEditing} value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="form-group">
                    <label className={`form-label ${!isEditing ? 'required' : ''}`}>Confirmar Contraseña</label>
                    <input type="password" className="form-input" placeholder="••••••••" required={!isEditing} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading} />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'roles' && (
            <div style={{ animation: 'slideDown 0.3s ease' }}>
              <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                <span className="alert-icon">ℹ️</span>
                <span>
                  <strong>Gestión de Accesos Dinámica:</strong> Los permisos ya no se asignan individualmente. 
                  Este usuario heredará automáticamente todos los accesos correspondientes a su rol: <b>{rol || 'Ninguno seleccionado'}</b>.
                </span>
              </div>
              
              <div style={{ padding: '2rem', background: 'var(--gray-50)', borderRadius: '12px', border: '1px solid var(--gray-200)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--primary-dark)', fontSize: '1.25rem' }}>🛡️ Matriz de Permisos Global</h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                  Para revisar o modificar exactamente qué puede hacer un <b>{rol || 'usuario con este rol'}</b> dentro del sistema, visita el gestor central de permisos.
                </p>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/permisos')} style={{ background: 'white', borderColor: 'var(--primary-blue)', color: 'var(--primary-blue)', fontWeight: 600 }}>
                  Ir a la Matriz de Permisos
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/usuarios')} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Procesando...' : (isEditing ? '✓ Guardar Cambios' : '✓ Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}