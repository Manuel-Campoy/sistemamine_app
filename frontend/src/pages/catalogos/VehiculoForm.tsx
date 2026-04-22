import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
// import useNetworkStatus from '../../hooks/useNetworkStatus';


const CATEGORIAS = ['Acarreo', 'Carga/Excavación', 'Apoyo/Servicios'];

const TIPOS_POR_CATEGORIA: Record<string, string[]> = {
  'Acarreo': ['Dompe (camión rígido)', 'Camión articulado'],
  'Carga/Excavación': ['Retroexcavadora', 'Excavadora', 'Cargador Frontal (Loader)'],
  'Apoyo/Servicios': ['Cisterna de agua', 'Pick-up 4x4', 'Taller móvil']
};

const SUBTIPOS_POR_TIPO: Record<string, string[]> = {
  'Dompe (camión rígido)': ['Dompe 10-30 t', 'Dompe 40-90 t', 'Dompe 100-240 t'],
  'Camión articulado': ['Articulado 20-45 t'],
  'Cisterna de agua': ['Cisterna 8–20 m³'],
  'Retroexcavadora': ['Retro 0.3–1.0 m³'],
  'Cargador Frontal (Loader)': ['Loader 1.5–6.0 m³'],
  'Excavadora': ['Excavadora 0.8–3.5 m³'],
  'Pick-up 4x4': ['Pick-up Estándar'],
  'Taller móvil': ['Camión Taller', 'Camioneta Taller']
};

export default function VehiculoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [codigovehiculo, setCodigoVehiculo] = useState('');
  const [numeroeconomico, setNumeroEconomico] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipovehiculo, setTipoVehiculo] = useState('');
  const [subtipovehiculo, setSubtipoVehiculo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState<number | ''>('');
  const [placas, setPlacas] = useState('');
  const [estadooperacion, setEstadoOperacion] = useState('Disponible');
  const [activo, setActivo] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (isEditing) {
      cargarVehiculo();
    }
  }, [id]);

  const cargarVehiculo = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/vehiculos/${id}`);
      const data = response.data;
      
      setCodigoVehiculo(data.codigovehiculo);
      setNumeroEconomico(data.numeroeconomico);
      setCategoria(data.categoria);
      
      setTimeout(() => {
        setTipoVehiculo(data.tipovehiculo);
        setTimeout(() => setSubtipoVehiculo(data.subtipovehiculo), 50);
      }, 50);
      
      setMarca(data.marca);
      setModelo(data.modelo);
      setAnio(data.anio);
      setPlacas(data.placas || '');
      setEstadoOperacion(data.estadooperacion);
      setActivo(data.activo);
    } catch (error: any) {
      const mensaje = error.response?.data?.error || 'No se pudo cargar la información del vehículo';
      setErrorMsg(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(e.target.value);
    setTipoVehiculo(''); 
    setSubtipoVehiculo('');
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoVehiculo(e.target.value);
    setSubtipoVehiculo(''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const payload = {
        codigovehiculo, numeroeconomico, categoria, tipovehiculo, subtipovehiculo,
        marca, modelo, anio: Number(anio), placas, estadooperacion, activo
      };

      if (isEditing) {
        await api.put(`/vehiculos/${id}`, payload);
      } else {
        await api.post('/vehiculos', payload);
      }

      navigate('/dashboard/vehiculos'); 
    } catch (error: any) {
      const mensaje = error.response?.data?.error || 'Error de conexión con el servidor.';
      setErrorMsg(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', background: 'white' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}</h1>
          <p className="page-subtitle">{isEditing ? `Actualizando equipo: ${numeroeconomico}` : 'Añade un nuevo vehículo al catálogo de maquinaria'}</p>
        </div>
        {isEditing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>Estatus:</span>
            <span className={`badge ${activo ? 'badge-available' : 'badge-out-service'}`}>
              {activo ? 'Habilitado' : 'Deshabilitado'}
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
          <button type="button" className={`tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>Información General y Jerarquía</button>
          <button type="button" className={`tab ${activeTab === 'identificacion' ? 'active' : ''}`} onClick={() => setActiveTab('identificacion')}>Identificación y Estado</button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'general' && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '1rem 0', color: 'var(--gray-800)', borderBottom: '2px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                🚜 Clasificación del Equipo 
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">Categoría de Vehículo</label>
                  <select className="form-select" required value={categoria} onChange={handleCategoriaChange} disabled={isLoading}>
                    <option value="">Seleccione Categoría...</option>
                    {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label required">Tipo de Vehículo</label>
                  <select className="form-select" required value={tipovehiculo} onChange={handleTipoChange} disabled={!categoria || isLoading}>
                    <option value="">Seleccione Tipo...</option>
                    {categoria && TIPOS_POR_CATEGORIA[categoria]?.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label required">Subtipo / Capacidad</label>
                  <select className="form-select" required value={subtipovehiculo} onChange={(e) => setSubtipoVehiculo(e.target.value)} disabled={!tipovehiculo || isLoading}>
                    <option value="">Seleccione Subtipo...</option>
                    {tipovehiculo && SUBTIPOS_POR_TIPO[tipovehiculo]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '2rem 0 1rem 0', color: 'var(--gray-800)', borderBottom: '2px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                📋 Especificaciones Básicas
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">Marca</label>
                  <input type="text" className="form-input" required value={marca} onChange={e => setMarca(e.target.value)} placeholder="Ej: Caterpillar, Komatsu..." disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label className="form-label required">Modelo</label>
                  <input type="text" className="form-input" required value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ej: 785D" disabled={isLoading} />
                </div>
                <div className="form-group">
                  <label className="form-label required">Año de Fabricación</label>
                  <input type="number" className="form-input" required min="1980" max="2030" value={anio} onChange={e => setAnio(Number(e.target.value))} placeholder="Ej: 2021" disabled={isLoading} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'identificacion' && (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '1rem 0', color: 'var(--gray-800)', borderBottom: '2px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                🆔 Identificación Interna y Legal
              </h3>
              
              {isEditing && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" id="estadoActivo" checked={activo} onChange={(e) => setActivo(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="estadoActivo" style={{ cursor: 'pointer', fontWeight: 600, color: activo ? 'var(--success-green)' : 'var(--danger-red)' }}>
                    {activo ? 'El vehículo está HABILITADO en el sistema' : 'El vehículo está DESHABILITADO (Dado de baja)'}
                  </label>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">Código de Vehículo (Interno)</label>
                  <input type="text" className="form-input" required value={codigovehiculo} onChange={e => setCodigoVehiculo(e.target.value.toUpperCase())} placeholder="Ej: VEH-001" disabled={isLoading} />
                  <div className="form-help">Clave única en base de datos.</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label required">Número Económico</label>
                  <input type="text" className="form-input" required value={numeroeconomico} onChange={e => setNumeroEconomico(e.target.value.toUpperCase())} placeholder="Ej: EC-785-01" disabled={isLoading} />
                  <div className="form-help">Identificador pintado en el chasis.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Placas (Si aplica)</label>
                  <input type="text" className="form-input" value={placas} onChange={e => setPlacas(e.target.value.toUpperCase())} placeholder="Ej: SON-1234-A" disabled={isLoading} />
                  <div className="form-help">Para vehículos que salen a carretera.</div>
                </div>

                <div className="form-group">
                  <label className="form-label required">Estado de Operación Actual</label>
                  <select className="form-select" required value={estadooperacion} onChange={e => setEstadoOperacion(e.target.value)} disabled={isLoading}>
                    <option value="Disponible">Disponible (En Patio)</option>
                    <option value="Reservado">Reservado</option>
                    <option value="En Operación">En Operación (Asignado a turno)</option>
                    <option value="En Tránsito">En Tránsito</option>
                    <option value="En Mantenimiento">En Mantenimiento Preventivo</option>
                    <option value="Mantenimiento Correctivo">Mantenimiento Correctivo</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/vehiculos')} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
               {isLoading ? 'Guardando...' : (isEditing ? '✓ Guardar Cambios' : '✓ Registrar Vehículo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}