import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../hooks/useNotification';

export default function CombustibleForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, loading, dismiss } = useNotification();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendientesSync, setPendientesSync] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState<any[]>([]);

  const [idvehiculo, setIdvehiculo] = useState('');
  const [litros, setLitros] = useState('');
  const [horometro, setHorometro] = useState('');
  const [turno, setTurno] = useState('Matutino');
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
    cargarVehiculos();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cargarVehiculos = async () => {
    try {
      if (navigator.onLine) {
        const res = await api.get('/vehiculos');
        setVehiculos(res.data);
        await localforage.setItem('vehiculosCache', res.data); 
      } else {
        const cached = await localforage.getItem('vehiculosCache') as any[];
        if (cached) setVehiculos(cached);
      }
    } catch (err) {
      const cached = await localforage.getItem('vehiculosCache') as any[];
      if (cached) setVehiculos(cached);
    }
  };

  const verificarOffline = async () => {
    const queue: any[] = await localforage.getItem('combustibleQueue') || [];
    setPendientesSync(queue.length);
  };

  const sincronizarOffline = async () => {
    const queue: any[] = await localforage.getItem('combustibleQueue') || [];
    if (queue.length === 0) return;

    try {
      let exitos = 0;
      for (const recarga of queue) {
        const { idTemp, ...payload } = recarga;
        await api.post('/combustible', payload);
        exitos++;
      }
      await localforage.removeItem('combustibleQueue');
      setPendientesSync(0);
      success(`¡${exitos} recargas sincronizadas al servidor!`, { icon: '☁️' });
    } catch (err) {
      console.error("Fallo al sincronizar combustible:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const litrosNum = parseFloat(litros);
    if (!idvehiculo || isNaN(litrosNum) || litrosNum <= 0) {
      return error("Selecciona un vehículo e ingresa litros válidos.", { icon: '⛽' });
    }

    setIsLoading(true);
    loading("Registrando recarga...", "guardar-diesel");

    const payload = {
      idvehiculo,
      idusuario: user?.id,
      fechayhora: new Date().toISOString(),
      litros: litrosNum,
      horometro: horometro ? parseFloat(horometro) : null,
      turno,
      observaciones
    };

    if (!isOnline) {
      try {
        const queue: any[] = await localforage.getItem('combustibleQueue') || [];
        queue.push({ idTemp: Date.now(), ...payload });
        await localforage.setItem('combustibleQueue', queue);
        
        dismiss("guardar-diesel");
        success("Recarga guardada en la Tablet (Offline)", { icon: '💾' });
        
        setPendientesSync(queue.length);
        limpiarFormulario();
      } catch (err) {
        dismiss("guardar-diesel");
        error("Error al guardar localmente");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await api.post('/combustible', payload);
        dismiss("guardar-diesel");
        success("Recarga de diésel registrada exitosamente", { icon: '✅' });
        limpiarFormulario();
      } catch (err) {
        const queue: any[] = await localforage.getItem('combustibleQueue') || [];
        queue.push({ idTemp: Date.now(), ...payload });
        await localforage.setItem('combustibleQueue', queue);
        setPendientesSync(queue.length);
        
        dismiss("guardar-diesel");
        success("Red inestable. Se guardó de forma local.", { icon: '⚠️' });
        limpiarFormulario();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const limpiarFormulario = () => {
    setIdvehiculo('');
    setLitros('');
    setHorometro('');
    setObservaciones('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {!isOnline && (
        <div style={{ background: '#f59e0b', color: 'white', padding: '1rem', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
          <span>📡 Sin conexión - Guardando en caché.</span>
          <span>{pendientesSync} pendientes de subir.</span>
        </div>
      )}

      <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--gray-100)', paddingBottom: '1.5rem' }}>
          <div>
            <button onClick={() => navigate('/dashboard/combustible')} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem', padding: 0 }}>
              ← Volver al Panel
            </button>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⛽ Despacho de Diésel
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Camión o Máquina</label>
              <select className="form-select" value={idvehiculo} onChange={e=>setIdvehiculo(e.target.value)} required style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', width: '100%' }}>
                <option value="">Seleccione el equipo...</option>
                {vehiculos.map(v => (
                  <option key={v.idvehiculo} value={v.idvehiculo}>{v.numeroeconomico} - {v.marca}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Turno Operativo</label>
              <select className="form-select" value={turno} onChange={e=>setTurno(e.target.value)} style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', width: '100%' }}>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Nocturno">Nocturno</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#047857' }}>Litros Surtidos (L)</label>
              <input type="number" step="0.01" className="form-input" value={litros} onChange={e=>setLitros(e.target.value)} placeholder="Ej: 150.5" required style={{ padding: '1rem', fontSize: '1.5rem', fontWeight: 800, color: '#047857', borderRadius: '12px', width: '100%', borderColor: '#10b981' }} disabled={isLoading} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Horómetro Actual</label>
              <input type="number" step="0.1" className="form-input" value={horometro} onChange={e=>setHorometro(e.target.value)} placeholder="Ej: 4500.5" style={{ padding: '1rem', fontSize: '1.5rem', fontWeight: 700, borderRadius: '12px', width: '100%' }} disabled={isLoading} />
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.25rem', display: 'block' }}>*Opcional pero recomendado para KPIs</span>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Observaciones</label>
            <textarea className="form-input" rows={2} value={observaciones} onChange={e=>setObservaciones(e.target.value)} placeholder="Ej: Fuga detectada en tanque..." style={{ borderRadius: '12px', width: '100%', padding: '1rem' }} disabled={isLoading}></textarea>
          </div>

          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '1.5rem', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.25rem', fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(37,99,235,0.3)', opacity: isLoading ? 0.7 : 1, marginTop: '1rem' }}>
            {isLoading ? 'Registrando...' : ' Registrar Carga de Diésel'}
          </button>

        </form>
      </div>
    </div>
  );
}