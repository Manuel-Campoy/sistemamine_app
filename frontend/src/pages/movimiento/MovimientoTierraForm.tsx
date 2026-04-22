import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { localDb } from '../../db/localDb'; 
import type { MovimientoOffline, VehiculoOffline, LoteOffline } from '../../db/localDb'; 
import { useNotification } from '../../hooks/useNotification'; 

export default function MovimientoTierraForm() {
  const { idarealote } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, loading, dismiss } = useNotification(); 

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendientesSync, setPendientesSync] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState<VehiculoOffline[]>([]);
  const [nombreLote, setNombreLote] = useState('Cargando...');
  const [tonelajeEstimado, setTonelajeEstimado] = useState(0);
  const [tonelajeAcumulado, setTonelajeAcumulado] = useState(0);
  const [idvehiculo, setIdvehiculo] = useState('');
  const [turno, setTurno] = useState('Matutino');
  const [cantidadextraida, setCantidadExtraida] = useState('');
  const [destino, setDestino] = useState('Patio de Lixiviación 1');
  const [numeroextraccion, setNumeroExtraccion] = useState(1);

  useEffect(() => {
    const handleOnline = () => { 
        setIsOnline(true); 
        success("¡Conexión recuperada! Sincronizando datos...", { icon: '🌐' }); 
        sincronizarPendientes(); 
    };
    const handleOffline = () => {
        setIsOnline(false);
        error("Sin conexión. Modo Offline activado.", { icon: '📡' }); 
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    cargarCatalogosVehiculos();
    cargarProgresoLote(); 
    contarPendientes();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [idarealote]);

  const contarPendientes = async () => {
    const cantidad = await localDb.movimientos.where('sincronizado').equals('false').count();
    setPendientesSync(cantidad);
  };

  const cargarProgresoLote = async () => {
    try {
      let estimado = 0;
      let acumuladoApi = 0;

      if (navigator.onLine) {
        const resLote = await api.get(`/prospeccion/${idarealote}`);
        estimado = Number(resLote.data.tonelajeestimado) || 0;
        setNombreLote(resLote.data.nombrealias);

        const resMovs = await api.get(`/movimientos/lote/${idarealote}`);
        acumuladoApi = resMovs.data.reduce((sum: number, mov: any) => sum + Number(mov.cantidadextraida || 0), 0);
      } else {
        const loteLocal = await localDb.lotes.get(idarealote || '') as LoteOffline;
        if (loteLocal) {
          setNombreLote(loteLocal.nombrealias);
          estimado = Number(loteLocal.tonelajeestimado) || 0;
        }
      }

      const movsLocales = await localDb.movimientos.where('idarealote').equals(idarealote || '').toArray();
      const acumuladoLocal = movsLocales.reduce((sum: number, mov: any) => sum + Number(mov.cantidadextraida || 0), 0);

      setTonelajeEstimado(estimado);
      setTonelajeAcumulado(acumuladoApi + acumuladoLocal);
    } catch (err) {
      console.error("Error al cargar progreso", err);
      setNombreLote("Lote Desconocido");
    }
  };

  const cargarCatalogosVehiculos = async () => {
    if (navigator.onLine) {
      try {
        const resVehiculos = await api.get('/vehiculos');
        const vehiculosFormateados = resVehiculos.data.map((v: any) => ({
          idvehiculo: v.idvehiculo, numeroeconomico: v.numeroeconomico, marca: v.marca
        }));
        setVehiculos(vehiculosFormateados);
        await localDb.vehiculos.clear(); 
        await localDb.vehiculos.bulkPut(vehiculosFormateados);
      } catch (err) {
        cargarCatalogosDesdeCache();
      }
    } else {
      cargarCatalogosDesdeCache();
    }
  };

  const cargarCatalogosDesdeCache = async () => {
    try {
      const vehiculosCacheados = await localDb.vehiculos.toArray();
      if (vehiculosCacheados.length > 0) {
        setVehiculos(vehiculosCacheados);
      }
    } catch (err) {
      console.error("Error leyendo caché local", err);
    }
  };

  const sincronizarPendientes = async () => {
    try {
      const viajesPendientes = await localDb.movimientos.where('sincronizado').equals('false').toArray();
      if (viajesPendientes.length === 0) return;

      let subidosConExito = 0;
      for (const viaje of viajesPendientes) {
        try {
          const { idmovimiento, sincronizado, intentoSync, ...payloadDuro } = viaje;
          await api.post('/movimientos', payloadDuro);
          await localDb.movimientos.delete(viaje.idmovimiento);
          subidosConExito++;
        } catch (err) {
          await localDb.movimientos.update(viaje.idmovimiento, { intentoSync: viaje.intentoSync + 1 });
        }
      }

      contarPendientes();
      if (subidosConExito > 0) {
        success(`Se sincronizaron ${subidosConExito} viajes exitosamente.`, { icon: '☁️' }); 
      }
    } catch (err) {
      console.error("Fallo crítico en sincronización", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idvehiculo || !cantidadextraida) {
        return error("Completa los campos requeridos"); 
    }

    setIsLoading(true);
    const cantidadNumerica = parseFloat(cantidadextraida);

    const nuevoViaje: MovimientoOffline = {
      idmovimiento: `TEMP-${Date.now()}`,
      idarealote: idarealote || '',
      idresponsable: user?.id || '',
      idvehiculo: idvehiculo,
      turno: turno,
      capacidadestimada: null,
      numeroextraccion: numeroextraccion,
      fechayhorainicio: new Date().toISOString(),
      fechayhorafin: new Date().toISOString(), 
      cantidadextraida: cantidadNumerica,
      destino: destino,
      sincronizado: false, 
      intentoSync: 0
    };

    loading("Guardando viaje...", "guardar-viaje");

    if (!isOnline) {
      try {
        await localDb.movimientos.add(nuevoViaje);
        dismiss("guardar-viaje"); 
        success("Viaje guardado en la Tablet (Offline)", { icon: '💾' });
        
        setNumeroExtraccion(prev => prev + 1); 
        setCantidadExtraida('');
        setTonelajeAcumulado(prev => prev + cantidadNumerica); 
        contarPendientes();
      } catch (err) {
        dismiss("guardar-viaje");
        error("Error al guardar localmente");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const { idmovimiento, sincronizado, intentoSync, ...payloadDuro } = nuevoViaje;
        await api.post('/movimientos', payloadDuro);
        
        dismiss("guardar-viaje"); 
        success("Viaje registrado en el servidor", { icon: '✅' });
        
        setNumeroExtraccion(prev => prev + 1);
        setCantidadExtraida('');
        setTonelajeAcumulado(prev => prev + cantidadNumerica); 
      } catch (err) {
        await localDb.movimientos.add(nuevoViaje);
        dismiss("guardar-viaje");
        success("Red inestable. Se guardó de forma local.", { icon: '⚠️' });
        
        setTonelajeAcumulado(prev => prev + cantidadNumerica);
        contarPendientes();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const estNum = Number(tonelajeEstimado) || 0;
  const acNum = Number(tonelajeAcumulado) || 0;
  const porcentaje = estNum > 0 ? Math.min(100, (acNum / estNum) * 100) : 0;
  const restante = Math.max(0, estNum - acNum);
  const colorBarra = porcentaje > 90 ? 'var(--danger-red)' : (porcentaje > 75 ? 'var(--amber)' : 'var(--primary-blue)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--gray-800)', fontSize: '1.1rem' }}>Progreso de Extracción</h3>
            <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.85rem' }}>Lote: <strong style={{ color: 'var(--primary-dark)' }}>{nombreLote}</strong></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: colorBarra }}>{porcentaje.toFixed(1)}%</span>
          </div>
        </div>

        <div style={{ width: '100%', background: 'var(--gray-200)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ height: '100%', background: colorBarra, width: `${porcentaje}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--gray-600)' }}>
            Extraído: <strong>{acNum.toFixed(2)} t</strong> de {estNum.toFixed(2)} t
          </div>
          <div style={{ color: restante === 0 ? 'var(--success-green)' : 'var(--gray-600)' }}>
            Restante: <strong>{restante.toFixed(2)} t</strong>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        {!isOnline && (
          <div style={{ background: '#f59e0b', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
            <span>📡 Sin conexión - Guardando en almacenamiento local.</span>
            <span>{pendientesSync} viajes pendientes de subir.</span>
          </div>
        )}

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
          🚛 Registro de Acarreo (Dompada)
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="form-label">Vehículo (Camión)</label>
              <select className="form-select" value={idvehiculo} onChange={e=>setIdvehiculo(e.target.value)} required>
                <option value="">Seleccione un camión...</option>
                {vehiculos.map(v => (
                  <option key={v.idvehiculo} value={v.idvehiculo}>{v.numeroeconomico} - {v.marca}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Turno</label>
              <select className="form-select" value={turno} onChange={e=>setTurno(e.target.value)}>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Nocturno">Nocturno</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="form-label">Número de Viaje (Consecutivo)</label>
              <input type="number" className="form-input" value={numeroextraccion} onChange={e=>setNumeroExtraccion(parseInt(e.target.value))} required />
            </div>
            <div>
              <label className="form-label">Toneladas Descargadas (t)</label>
              <input type="number" step="0.01" className="form-input" value={cantidadextraida} onChange={e=>setCantidadExtraida(e.target.value)} placeholder="Ej: 45.5" required style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }} />
            </div>
            <div>
              <label className="form-label">Destino</label>
              <select className="form-select" value={destino} onChange={e=>setDestino(e.target.value)}>
                <option value="Patio de Lixiviación 1">Patio de Lixiviación 1</option>
                <option value="Patio de Lixiviación 2">Patio de Lixiviación 2</option>
                <option value="Trituradora">Trituradora</option>
                <option value="Botadero (Tepetate)">Botadero (Tepetate)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/movimiento')} style={{ flex: 1 }}>
              Cancelar / Volver
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ flex: 2, fontSize: '1.1rem' }}>
              {isLoading ? 'Guardando...' : (isOnline ? '💾 Guardar en Servidor' : '💾 Guardar en Tablet')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}