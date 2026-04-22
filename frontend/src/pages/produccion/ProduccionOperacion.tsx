import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext'; 
import { socket } from '../../api/socket'; 
import { useNotification } from '../../hooks/useNotification'; 

export default function ProduccionOperacion() {
  const { idlote } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, loading, dismiss } = useNotification(); 
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendientesSync, setPendientesSync] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [aliasLote, setAliasLote] = useState('Cargando Lote...');
  const [ciclos, setCiclos] = useState<any[]>([]);
  
  const [turno, setTurno] = useState('Matutino');
  const [toneladas, setToneladas] = useState('');
  const [ley, setLey] = useState('');
  const [recuperacion, setRecuperacion] = useState('85'); 
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    const handleOnline = () => { 
      setIsOnline(true); 
      sincronizarOffline(); 
    };
    const handleOffline = () => {
      setIsOnline(false);
      error("Sin conexión. Trabajando en modo offline.", { icon: '📡' }); 
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    verificarOffline();
    inicializarProduccion();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [idlote]);

  const inicializarProduccion = async (silencioso = false) => {
    if (!silencioso) setIsLoading(true);
    try {
      const resLote = await api.get(`/prospeccion/${idlote}`);
      setAliasLote(resLote.data.nombrealias || `Lote ${idlote?.substring(0,8)}`);
      const resCiclos = await api.get(`/produccion/ciclos/lote/${idlote}`);
      const ciclosArray = Array.isArray(resCiclos.data)
        ? resCiclos.data 
        : (resCiclos.data.data || []);
      setCiclos(ciclosArray);
      
    } catch (err) {
      console.warn("Trabajando en modo offline o error de red");
      setAliasLote(`Lote Offline ${idlote?.substring(0,8)}`);
    } finally {
      if (!silencioso) setIsLoading(false);
    }
  };

  useEffect(() => {
    const recargarSilenciosamente = () => {
      if (navigator.onLine) {
        inicializarProduccion(true);
      }
    };

    socket.on('nueva_produccion', recargarSilenciosamente);

    return () => {
      socket.off('nueva_produccion', recargarSilenciosamente);
    };
  }, [idlote]);

  const verificarOffline = async () => {
    const queue: any[] = await localforage.getItem('produccionQueue') || [];
    setPendientesSync(queue.length);
  };

  const sincronizarOffline = async () => {
    const queue: any[] = await localforage.getItem('produccionQueue') || [];
    if (queue.length === 0) return;

    try {
      for (const ciclo of queue) {
        const { idciclo, ...cicloData } = ciclo; 
        await api.post('/produccion/ciclos', cicloData);
      }
      await localforage.removeItem('produccionQueue');
      setPendientesSync(0);
      inicializarProduccion(); 
      success('¡Sincronización de ciclos exitosa!', { icon: '☁️' }); 
    } catch (err) {
      console.error("Error al sincronizar ciclos", err);
    }
  };

  const tons = parseFloat(toneladas) || 0;
  const leyGt = parseFloat(ley) || 0;
  const recup = parseFloat(recuperacion) || 0;
  const oroEstimado = tons * leyGt * (recup / 100);
  const colasGeneradas = tons - (oroEstimado / 1000000); 

  const registrarCiclo = async () => {
    if (tons <= 0 || leyGt <= 0) return error('Ingresa toneladas y ley válidas.', { icon: '⚖️' }); 
    const nuevoCiclo = {
      idciclo: 'TEMP-' + Date.now(), 
      idarealote: idlote,
      numerociclo: ciclos.length + 1,
      turno,
      fechaoperacion: new Date().toISOString(), 
      fechahorainicio: new Date().toISOString(),
      toneladasprocesadas: tons,
      leyciclo: leyGt,
      recuperacionporcentaje: recup,
      oroestimadogramos: oroEstimado,
      colastoneladas: colasGeneradas,
      observaciones,
      estado: 'Pendiente',
      usuarioregistra: user?.id
    };

    const nuevosCiclos = [nuevoCiclo, ...ciclos];
    setCiclos(nuevosCiclos);
    setToneladas(''); setLey(''); setObservaciones('');

    loading("Registrando ciclo...", "registro-ciclo"); 

    if (!isOnline) {
      const queue: any[] = await localforage.getItem('produccionQueue') || [];
      queue.push(nuevoCiclo);
      await localforage.setItem('produccionQueue', queue);
      setPendientesSync(queue.length);
      dismiss("registro-ciclo");
      success("Ciclo guardado en la Tablet (Offline)", { icon: '💾' }); 
    } else {
      try {
        const { idciclo, ...payloadData } = nuevoCiclo;
        await api.post('/produccion/ciclos', payloadData);
        dismiss("registro-ciclo");
        success("Ciclo registrado en el servidor", { icon: '✅' }); 
      } catch (err) {
        const queue: any[] = await localforage.getItem('produccionQueue') || [];
        queue.push(nuevoCiclo);
        await localforage.setItem('produccionQueue', queue);
        setPendientesSync(queue.length);
        dismiss("registro-ciclo");
        success("Red inestable. Se guardó de forma local.", { icon: '⚠️' }); 
      }
    }
  };

  const avanzarEstatus = async (idciclo: string, estatusActual: string) => {
    if (idciclo.startsWith('TEMP-')) {
        return error('Este ciclo aún no se sincroniza. Espera a tener conexión para avanzar su estatus.', { icon: '⏳' }); 
    }

    let nuevoEstatus = '';
    let accionTexto = '';
    
    if (estatusActual === 'Pendiente') {
        nuevoEstatus = 'En Proceso';
        accionTexto = 'INICIAR PROCESO';
    } else if (estatusActual === 'En Proceso') {
        nuevoEstatus = 'Finalizado';
        accionTexto = 'FINALIZAR';
    } else return;

    if (!window.confirm(`¿Confirmas que deseas ${accionTexto} este ciclo?`)) return;

    setCiclos(ciclos.map(c => c.idciclo === idciclo ? { ...c, estado: nuevoEstatus } : c));

    if (isOnline) {
      loading("Actualizando estatus...", "estatus-ciclo");
      try {
        await api.put(`/produccion/ciclos/${idciclo}/estatus`, { 
          estado: nuevoEstatus, 
          idusuario: user?.id 
        });
        dismiss("estatus-ciclo");
        success(`Ciclo marcado como ${nuevoEstatus}`, { icon: '🔄' });
      } catch (err) {
        dismiss("estatus-ciclo");
        error("Error al actualizar el estado en el servidor. Revirtiendo cambios visuales."); 
        inicializarProduccion(); 
      }
    } else {
        error("Necesitas conexión a internet para cambiar el estatus operativo.", { icon: '📡' }); 
        setCiclos(ciclos.map(c => c.idciclo === idciclo ? { ...c, estado: estatusActual } : c));
    }
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'white' }}>
      
      {!isOnline && (
        <div style={{ background: '#d97706', color: 'white', padding: '1rem', textAlign: 'center', fontWeight: 700 }}>
          MODO OFFLINE: {pendientesSync} ciclos pendientes de sincronizar a la base de datos.
        </div>
      )}

      <div className="page-header" style={{ padding: '2rem', borderBottom: '2px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={() => navigate('/dashboard/produccion')} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem', padding: 0 }}>
            ← Volver al Control General
          </button>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
            Operación en Planta
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginTop: '0.25rem' }}>📍 {aliasLote}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#f59e0b', borderRadius: '12px' }}>⏱️ Cierre de Turno</button>
          <button className="btn btn-secondary" style={{ background: '#dbeafe', color: '#1e40af', borderColor: '#3b82f6', borderRadius: '12px' }}>📅 Cierre de Día</button>
        </div>
      </div>

      <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div style={{ background: 'var(--gray-50)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚗️</span> Registrar Nuevo Ciclo de Procesamiento
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Turno</label>
              <select className="form-select" value={turno} onChange={e=>setTurno(e.target.value)} style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', width: '100%' }} disabled={isLoading}>
                <option value="Matutino">Matutino (06:00 - 14:00)</option>
                <option value="Vespertino">Vespertino (14:00 - 22:00)</option>
                <option value="Nocturno">Nocturno (22:00 - 06:00)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Toneladas (t)</label>
              <input type="number" step="0.01" className="form-input" value={toneladas} onChange={e=>setToneladas(e.target.value)} placeholder="Ej: 45.5" style={{ padding: '1rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)', borderRadius: '12px', width: '100%' }} disabled={isLoading} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Ley (g/t)</label>
              <input type="number" step="0.01" className="form-input" value={ley} onChange={e=>setLey(e.target.value)} placeholder="Ej: 12.3" style={{ padding: '1rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)', borderRadius: '12px', width: '100%' }} disabled={isLoading} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>% Recup. Esperada</label>
              <input type="number" step="0.01" className="form-input" value={recuperacion} onChange={e=>setRecuperacion(e.target.value)} style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', width: '100%' }} disabled={isLoading} />
            </div>
          </div>

          <div style={{ background: '#d1fae5', border: '2px dashed #10b981', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: 600, textTransform: 'uppercase' }}>Oro Estimado (Calc.)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857' }}>{oroEstimado.toFixed(2)} g</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: 600, textTransform: 'uppercase' }}>Colas / Tepetate</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857' }}>{colasGeneradas.toFixed(2)} t</div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Observaciones</label>
            <textarea className="form-input" rows={2} value={observaciones} onChange={e=>setObservaciones(e.target.value)} placeholder="Ej: Mineral con alta humedad..." style={{ borderRadius: '12px', width: '100%' }} disabled={isLoading}></textarea>
          </div>

          <button onClick={registrarCiclo} disabled={isLoading} style={{ width: '100%', padding: '1.25rem', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.25rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(37,99,235,0.3)', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Sincronizando...' : '➕ Registrar Ciclo al Turno'}
          </button>
        </div>

        <div className="table-container" style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', background: 'var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray-200)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-800)', margin: 0 }}>Bitácora de Operación (Lote)</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Acciones Rápidas: </span>
               <span title="Avanzar a En Proceso">🔄 Iniciar</span> <span title="Finalizar">✅ Terminar</span>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'white', borderBottom: '2px solid var(--gray-200)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>No. Ciclo / Turno</th>
                <th style={{ padding: '1rem' }}>Tonelaje</th>
                <th style={{ padding: '1rem' }}>Ley (g/t)</th>
                <th style={{ padding: '1rem' }}>Oro Est.</th>
                <th style={{ padding: '1rem' }}>Estatus</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Cambiar Fase</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && ciclos.length === 0 ? (
                 <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--primary-blue)', fontWeight: 600 }}>Cargando bitácora...</td></tr>
              ) : ciclos.length === 0 ? (
                 <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Aún no hay ciclos registrados para este Lote. Inicia uno en el panel superior.</td></tr>
              ) : (
                ciclos.map(c => (
                  <tr key={c.idciclo} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>#{c.numerociclo} • {c.turno}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{new Date(c.fechahorainicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{Number(c.toneladasprocesadas).toFixed(2)} t</td>
                    <td style={{ padding: '1rem', color: 'var(--primary-blue)', fontWeight: 600 }}>{Number(c.leyciclo).toFixed(2)}</td>
                    <td style={{ padding: '1rem', color: '#d97706', fontWeight: 700 }}>{Number(c.oroestimadogramos).toFixed(2)} g</td>
                    <td style={{ padding: '1rem' }}>
                      {c.estado === 'Pendiente' && <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Pendiente</span>}
                      {c.estado === 'En Proceso' && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>⚙️ Lixiviando</span>}
                      {c.estado === 'Finalizado' && <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>✅ Finalizado</span>}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', fontSize: '1.25rem' }}>
                        {c.estado === 'Pendiente' && <button onClick={() => avanzarEstatus(c.idciclo, c.estado)} style={{ background:'none', border:'none', cursor:'pointer' }} title="Iniciar Proceso">🔄</button>}
                        {c.estado === 'En Proceso' && <button onClick={() => avanzarEstatus(c.idciclo, c.estado)} style={{ background:'none', border:'none', cursor:'pointer' }} title="Marcar Finalizado">✅</button>}
                        {c.estado === 'Finalizado' && <span style={{ fontSize: '0.9rem', color: 'var(--gray-400)', fontStyle: 'italic' }}>Completado</span>}
                      </div>
                    </td>
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