import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosConfig'; 

const MINERALES_OPCIONES = ['Oro (Au)', 'Plata (Ag)', 'Cobre (Cu)', 'Hierro (Fe)', 'Zinc (Zn)', 'Plomo (Pb)'];
const METODOS_EXTRACCION_OPCIONES = [
  'Barrenación y Voladura',
  'Corte y Relleno (Cut and Fill)',
  'Cámaras y Pilares (Room and Pillar)',
  'Vaciado por Subniveles (Sublevel Stoping)',
  'Almacenamiento por Viruteo (Shrinkage Stoping)',
  
  'Hundimiento por Bloques (Block Caving)',
  'Hundimiento por Subniveles (Sublevel Caving)',
  
  'Tajo Abierto (Open Pit)',
  'Minería de Placer (Aluvión)',
  'Canteras (Quarrying)',
  
  'Lixiviación in situ',
  'Dragado',
  'Pozos de Sondeo (Borehole Mining)'
];
const PAISES_OPCIONES = ['México']; 
const ESTADOS_OPCIONES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 
  'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 
  'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas', 'Otras'
];
const MUNICIPIOS_OPCIONES_POR_ESTADO: Record<string, string[]> = {
  'Sonora': ['Caborca', 'Cananea', 'Guaymas', 'Hermosillo', 'Nacozari de García', 'Navojoa', 'Nogales', 'Puerto Peñasco', 'Sahuaripa'],
  'Zacatecas': ['Calera', 'Fresnillo', 'Guadalupe', 'Jerez', 'Mazapil', 'Sombrerete', 'Villa de Cos', 'Zacatecas'],
  'Chihuahua': ['Chihuahua', 'Cuauhtémoc', 'Delicias', 'Guachochi', 'Hidalgo del Parral', 'Juárez', 'Madera'],
  'Durango': ['Cuencamé', 'Durango', 'Gómez Palacio', 'Guadalupe Victoria', 'Lerdo', 'Pueblo Nuevo', 'Santiago Papasquiaro'],
  'Guerrero': ['Acapulco de Juárez', 'Chilpancingo de los Bravo', 'Iguala de la Independencia', 'Taxco de Alarcón', 'Zihuatanejo de Azueta'],
  'San Luis Potosí': ['Ciudad Valles', 'Matehuala', 'Río Verde', 'San Luis Potosí', 'Soledad de Graciano Sánchez', 'Tamuín'],
  'Otras': ['Seleccione un estado primero']
};

export default function MinaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [claveminera, setClave] = useState('');
  const [nombreempresa, setEmpresa] = useState('');
  const [aliasmina, setAlias] = useState('');
  const [tipomina, setTipo] = useState('Subterránea');
  const [metodoextraccion, setMetodo] = useState('');
  const [mineralesprincipales, setMinerales] = useState('');
  const [estatusoperacion, setEstatus] = useState('Activa');
  const [activo, setActivo] = useState(true);

  const [direccionmina, setDirMina] = useState('');
  const [poligonoubicacion, setPoligono] = useState('');
  const [calleoficina, setCalle] = useState('');
  const [numerooficina, setNum] = useState('');
  const [cpoficina, setCp] = useState('');
  const [coloniaoficina, setCol] = useState('');
  const [municipiooficina, setMun] = useState('');
  const [estadooficina, setEdo] = useState('');
  const [paisoficina, setPais] = useState('México');

  const [correoelectronico, setCorreo] = useState('');
  const [telefonofijo, setFijo] = useState('');
  const [extension, setExt] = useState('');
  const [telefonomovil, setMovil] = useState('');

  useEffect(() => {
    if (isEditing) cargarMina();
  }, [id]);

  const cargarMina = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/minas/${id}`);
      const d = res.data;
      
      setClave(d.claveminera); setEmpresa(d.nombreempresa); setAlias(d.aliasmina);
      setTipo(d.tipomina); setMetodo(d.metodoextraccion); setMinerales(d.mineralesprincipales);
      setEstatus(d.estatusoperacion); setActivo(d.activo);
      
      setDirMina(d.direccionmina); setPoligono(d.poligonoubicacion || '');
      setCalle(d.calleoficina || ''); setNum(d.numerooficina || ''); setCp(d.cpoficina || '');
      setCol(d.coloniaoficina || ''); setMun(d.municipiooficina || ''); setEdo(d.estadooficina || ''); setPais(d.paisoficina || 'México');
      
      setCorreo(d.correoelectronico || ''); setFijo(d.telefonofijo || ''); setExt(d.extension || ''); setMovil(d.telefonomovil || '');
    } catch (err: any) { 
      setErrorMsg(err.response?.data?.error || 'Error al cargar la mina'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEdo(e.target.value);
    setMun(''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMsg(''); 
    setIsLoading(true);

    try {
      const payload = {
        claveminera, nombreempresa, aliasmina, tipomina, metodoextraccion, mineralesprincipales, estatusoperacion, activo,
        direccionmina, poligonoubicacion, calleoficina, numerooficina, cpoficina, coloniaoficina, municipiooficina, estadooficina, paisoficina,
        correoelectronico, telefonofijo, extension, telefonomovil
      };

      if (isEditing) {
        await api.put(`/minas/${id}`, payload);
      } else {
        await api.post('/minas', payload);
      }
      
      navigate('/dashboard/minas');
    } catch (err: any) { 
      setErrorMsg(err.response?.data?.error || 'Error al guardar los datos'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '8px', background: 'white' }}>
      <div className="page-header" style={{ padding: '2rem', borderBottom: '2px solid var(--gray-200)' }}>
        <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
          {isEditing ? '✏️ Editar Empresa / Mina' : '🏢 Nueva Empresa / Mina'}
        </h1>
        <p className="page-subtitle" style={{ color: 'var(--gray-600)' }}>
          {isEditing ? `Actualizando datos de: ${aliasmina}` : 'Registra un nuevo complejo minero o razón social'}
        </p>
      </div>

      <div className="page-content" style={{ padding: '2rem' }}>
        {errorMsg && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', border: '1px solid #fecaca' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="tabs" style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--gray-200)', marginBottom: '2rem' }}>
          {['general', 'ubicacion', 'contacto'].map(tab => (
            <button 
              key={tab} 
              type="button" 
              onClick={() => setActiveTab(tab)} 
              style={{ 
                padding: '1rem 1.5rem', 
                background: 'none', 
                border: 'none', 
                borderBottom: activeTab === tab ? '3px solid var(--primary-blue)' : '3px solid transparent', 
                color: activeTab === tab ? 'var(--primary-blue)' : 'var(--gray-500)', 
                fontWeight: 700, 
                cursor: 'pointer', 
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {tab === 'general' ? '📄 Datos Generales' : tab === 'ubicacion' ? '🗺️ Ubicación' : '📞 Contacto'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'general' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label htmlFor="claveminera" className="form-label required">Clave Minera (ID Interno)</label>
                <input id="claveminera" name="claveminera" type="text" required className="form-input" value={claveminera} onChange={e=>setClave(e.target.value.toUpperCase())} placeholder="Ej: MIN-01" disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="aliasmina" className="form-label required">Alias de la Mina</label>
                <input id="aliasmina" name="aliasmina" type="text" required className="form-input" value={aliasmina} onChange={e=>setAlias(e.target.value)} placeholder="Ej: La Herradura" disabled={isLoading} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="nombreempresa" className="form-label required">Nombre o Razón Social de la Empresa</label>
                <input id="nombreempresa" name="nombreempresa" type="text" required className="form-input" value={nombreempresa} onChange={e=>setEmpresa(e.target.value)} placeholder="Ej: Minera Penmont S. de R.L. de C.V." disabled={isLoading} />
              </div>
              
              <div>
                <label htmlFor="tipomina" className="form-label required">Tipo de Mina</label>
                <select id="tipomina" name="tipomina" className="form-select" value={tipomina} onChange={e=>setTipo(e.target.value)} disabled={isLoading} required>
                  <option value="">Seleccionar...</option>
                  <option value="Subterránea">Subterránea</option>
                  <option value="Tajo Abierto (Open Pit)">Tajo Abierto (Open Pit)</option>
                  <option value="Mixta">Mixta</option>
                </select>
              </div>
              <div>
                <label htmlFor="metodoextraccion" className="form-label required">Método de Extracción</label>
                <select id="metodoextraccion" name="metodoextraccion" className="form-select" value={metodoextraccion} onChange={e=>setMetodo(e.target.value)} disabled={isLoading} required>
                  <option value="">Seleccionar...</option>
                  {METODOS_EXTRACCION_OPCIONES.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="mineralesprincipales" className="form-label required">Mineral Principal</label>
                <select id="mineralesprincipales" name="mineralesprincipales" className="form-select" value={mineralesprincipales} onChange={e=>setMinerales(e.target.value)} disabled={isLoading} required>
                  <option value="">Seleccionar...</option>
                  {MINERALES_OPCIONES.map(mineral => (
                    <option key={mineral} value={mineral}>{mineral}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="estatusoperacion" className="form-label required">Estatus de Operación</label>
                <select id="estatusoperacion" name="estatusoperacion" className="form-select" value={estatusoperacion} onChange={e=>setEstatus(e.target.value)} disabled={isLoading} required>
                  <option value="">Seleccionar...</option>
                  <option value="Activa">🟢 Activa</option>
                  <option value="En Exploración">🔍 En Exploración</option>
                  <option value="En Mantenimiento">🔧 En Mantenimiento</option>
                  <option value="Cerrada">🚫 Cerrada</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'ubicacion' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="direccionmina" className="form-label required">Dirección Física de la Mina</label>
                <input id="direccionmina" name="direccionmina" type="text" required className="form-input" value={direccionmina} onChange={e=>setDirMina(e.target.value)} placeholder="Ej: Km 125 Carretera Caborca-Sonoyta" disabled={isLoading} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="poligonoubicacion" className="form-label">Polígono de Ubicación (GPS / Coordenadas)</label>
                <input id="poligonoubicacion" name="poligonoubicacion" type="text" className="form-input" value={poligonoubicacion} onChange={e=>setPoligono(e.target.value)} placeholder="Ej: 30.7145, -112.4589" disabled={isLoading} />
              </div>
              
              <h3 style={{ gridColumn: '1 / -1', borderBottom: '2px solid var(--gray-100)', paddingBottom: '0.5rem', marginTop: '1rem', color: 'var(--gray-800)', fontSize: '1rem' }}>📍 Oficinas Administrativas</h3>
              <div><label htmlFor="calleoficina" className="form-label">Calle</label><input id="calleoficina" name="calleoficina" type="text" className="form-input" value={calleoficina} onChange={e=>setCalle(e.target.value)} disabled={isLoading} /></div>
              <div><label htmlFor="numerooficina" className="form-label">Número</label><input id="numerooficina" name="numerooficina" type="text" className="form-input" value={numerooficina} onChange={e=>setNum(e.target.value)} disabled={isLoading} /></div>
              <div><label htmlFor="coloniaoficina" className="form-label">Colonia</label><input id="coloniaoficina" name="coloniaoficina" type="text" className="form-input" value={coloniaoficina} onChange={e=>setCol(e.target.value)} disabled={isLoading} /></div>
              <div><label htmlFor="cpoficina" className="form-label">Código Postal</label><input id="cpoficina" name="cpoficina" type="text" className="form-input" value={cpoficina} onChange={e=>setCp(e.target.value)} disabled={isLoading} /></div>
              
              <div>
                <label htmlFor="paisoficina" className="form-label">País</label>
                <select id="paisoficina" name="paisoficina" className="form-select" value={paisoficina} onChange={e=>setPais(e.target.value)} disabled={isLoading}>
                  {PAISES_OPCIONES.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="estadooficina" className="form-label">Estado</label>
                <select id="estadooficina" name="estadooficina" className="form-select" value={estadooficina} onChange={handleEstadoChange} disabled={isLoading}>
                  <option value="">Seleccionar...</option>
                  {ESTADOS_OPCIONES.map(edo => (
                    <option key={edo} value={edo}>{edo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="municipiooficina" className="form-label">Municipio</label>
                <select id="municipiooficina" name="municipiooficina" className="form-select" value={municipiooficina} onChange={e=>setMun(e.target.value)} disabled={!estadooficina || isLoading}>
                  <option value="">Seleccionar...</option>
                  {estadooficina && MUNICIPIOS_OPCIONES_POR_ESTADO[estadooficina]?.map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'contacto' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div><label htmlFor="correoelectronico" className="form-label">Correo Electrónico de Contacto</label><input id="correoelectronico" name="correoelectronico" type="email" className="form-input" value={correoelectronico} onChange={e=>setCorreo(e.target.value)} placeholder="admin@mina.com" disabled={isLoading} /></div>
              <div><label htmlFor="telefonomovil" className="form-label">Teléfono Móvil / WhatsApp</label><input id="telefonomovil" name="telefonomovil" type="tel" className="form-input" value={telefonomovil} onChange={e=>setMovil(e.target.value)} placeholder="662..." disabled={isLoading} /></div>
              <div><label htmlFor="telefonofijo" className="form-label">Teléfono Fijo Oficina</label><input id="telefonofijo" name="telefonofijo" type="tel" className="form-input" value={telefonofijo} onChange={e=>setFijo(e.target.value)} disabled={isLoading} /></div>
              <div><label htmlFor="extension" className="form-label">Extensión</label><input id="extension" name="extension" type="text" className="form-input" value={extension} onChange={e=>setExt(e.target.value)} placeholder="Ej: 101" disabled={isLoading} /></div>
              
              {isEditing && (
                <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem', padding: '1.5rem', background: 'var(--gray-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--gray-200)' }}>
                  <input type="checkbox" id="activo" name="activo" checked={activo} onChange={e=>setActivo(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }}/>
                  <label htmlFor="activo" style={{ fontWeight: 700, color: activo ? 'var(--success-green)' : 'var(--danger-red)', cursor: 'pointer' }}>
                    {activo ? '✅ Registro Habilitado en el Sistema' : '❌ Registro Deshabilitado (Baja Lógica)'}
                  </label>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '2px solid var(--gray-100)', paddingTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/minas')} disabled={isLoading} style={{ padding: '0.75rem 2rem' }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ padding: '0.75rem 3rem', minWidth: '220px' }}>
              {isLoading ? '⌛ Guardando...' : (isEditing ? '💾 Guardar Cambios' : '💾 Registrar Mina')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}